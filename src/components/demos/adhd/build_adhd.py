"""Recompute ADHD Care Gap numbers from the NS-DATA 2014 public-use CSV.
Survey-weighted (ADHD_WT) with Taylor-linearized SEs: strata = STATE x SAMPLE, PSU = IDNUMR (per CDC NS-DATA FAQ).
Domain estimates use the full file (no subsetting) so the design is preserved."""
import json, numpy as np, pandas as pd
from scipy import stats

d = pd.read_csv('/Users/eshaan/Desktop/Club/DataLearn/nsdata_adhd.csv')
W = d.ADHD_WT.to_numpy()
strata = (d.STATE.astype(str) + '_' + d.SAMPLE.astype(str)).to_numpy()
N = len(d)

def lin_var(z):
    """Stratified with-replacement variance of a total of linearized values z (one PSU per row)."""
    v = 0.0
    for h in np.unique(strata):
        m = strata == h
        nh = m.sum()
        if nh < 2: continue
        zh = z[m]
        v += nh / (nh - 1) * ((zh - zh.mean()) ** 2).sum()
    return v

def prop(y, dom):
    """Weighted proportion of y (0/1) in domain dom (bool), with linearized SE and logit CI."""
    y = np.nan_to_num(np.asarray(y, float)); dom = np.asarray(dom, bool)
    wd = W * dom
    p = (wd * y).sum() / wd.sum()
    z = wd * (y - p) / wd.sum()
    se = np.sqrt(lin_var(z))
    # logit-transformed 95% CI
    if 0 < p < 1:
        l = np.log(p / (1 - p)); sl = se / (p * (1 - p))
        lo, hi = 1 / (1 + np.exp(-(l - 1.96 * sl))), 1 / (1 + np.exp(-(l + 1.96 * sl)))
    else:
        lo = hi = p
    return dict(p=round(p, 4), lo=round(lo, 4), hi=round(hi, 4), n=int(dom.sum()))

def uprop(y, dom):
    y = np.asarray(y, float); dom = np.asarray(dom, bool)
    return round(float(y[dom].mean()), 4)

# ---------- severity x income ----------
sev = d.ADHD_A3_2.where(d.ADHD_A3_2.isin([1, 2, 3]))
inc = d.POVLEVEL1_4.where(d.POVLEVEL1_4.isin([1, 2, 3, 4]))
INC = {1: '≤100% FPL', 2: '100–200%', 3: '200–400%', 4: '>400%'}
SEV = {1: 'mild', 2: 'moderate', 3: 'severe'}
base = sev.notna() & inc.notna()
income = []
for k in [1, 2, 3, 4]:
    dom = base & (inc == k)
    row = dict(key=k, label=INC[k], n=int(dom.sum()))
    for s, nm in SEV.items():
        r = prop(sev == s, dom)
        row[nm] = r
        row[nm + '_unw'] = uprop(sev == s, dom)
        row[nm + '_count'] = int((dom & (sev == s)).sum())
    income.append(row)
overall = {nm: prop(sev == s, sev.notna()) for s, nm in SEV.items()}

# design-based CI for the severe-share ratio (lowest / highest) via linearization of log ratio
def ratio_ci():
    y = (sev == 3).astype(float).to_numpy()
    d1 = (base & (inc == 1)).to_numpy(); d4 = (base & (inc == 4)).to_numpy()
    p1 = (W * d1 * y).sum() / (W * d1).sum(); p4 = (W * d4 * y).sum() / (W * d4).sum()
    z = W * d1 * (y - p1) / (W * d1).sum() / p1 - W * d4 * (y - p4) / (W * d4).sum() / p4
    se = np.sqrt(lin_var(z)); r = p1 / p4
    return dict(r=round(r, 2), lo=round(r * np.exp(-1.96 * se), 2), hi=round(r * np.exp(1.96 * se), 2))
ratio = ratio_ci()
uy = (sev == 3); ur = uprop(uy, base & (inc == 1)) / uprop(uy, base & (inc == 4))

# ---------- 13 co-occurring conditions (ever told by a provider) ----------
CONDS = [('ADHD_B1_1_1', 'ODD'), ('ADHD_B1_1_2', 'Conduct disorder'), ('ADHD_B1_1_3', 'Autism'),
         ('ADHD_B1_1_4', 'Sleep disorder'), ('ADHD_B1_1_5', 'Intellectual disability'),
         ('ADHD_B1_1_6', 'Learning disorder'), ('ADHD_B1_1_7', 'Language disorder'), ('ADHD_B1_1_8', 'OCD'),
         ('ADHD_B1_1_9', 'PTSD'), ('ADHD_B1_1_10', 'Anxiety'), ('ADHD_B1_1_11', 'Bipolar'),
         ('ADHD_B1_1_13', 'Depression'), ('ADHD_B1_1_16', 'Other disorder')]
X = np.column_stack([(d[c] == 1).to_numpy() for c, _ in CONDS]).astype(float)  # DK/refused counted as not reported
allrows = np.ones(N, bool)
prev = [prop(X[:, i], allrows) for i in range(len(CONDS))]
order = sorted(range(len(CONDS)), key=lambda i: -prev[i]['p'])
names = [CONDS[i][1] for i in order]
Xo = X[:, order]; prevo = [prev[i] for i in order]
cond = []  # cond[i][j] = P(has j | has i)
for i in range(len(names)):
    row = []
    for j in range(len(names)):
        dom = Xo[:, i] == 1
        if i == j:
            row.append(None); continue
        p = (W * dom * Xo[:, j]).sum() / (W * dom).sum()
        both = int(((Xo[:, i] == 1) & (Xo[:, j] == 1)).sum())
        row.append([round(p, 3), both])
    cond.append(row)
cnt = X.sum(1)
# count of co-occurring conditions by severity
burden = []
for s, nm in SEV.items():
    dom = (sev == s).to_numpy()
    burden.append(dict(sev=nm, n=int(dom.sum()), none=prop(cnt == 0, dom), one=prop(cnt == 1, dom),
                       two=prop(cnt == 2, dom), three=prop(cnt >= 3, dom)))
anyc = prop(cnt >= 1, allrows)

# ---------- treatment by income x severity (children who currently have ADHD) ----------
cur = lambda c: (d[c] == 1).to_numpy()
beh = cur('ADHD_C3_2A') | cur('ADHD_C3_3A') | cur('ADHD_C3_4A') | cur('ADHD_C3_5A') | cur('ADHD_C3_8_X01A') | cur('ADHD_C3_8_X02A') | cur('ADHD_C5_2')
medk = d.ADHD_MEDS.isin([1, 2, 3]).to_numpy()
med = (d.ADHD_MEDS == 1).to_numpy()
tbase = base.to_numpy() & medk
treat = []
for k in [1, 2, 3, 4]:
    for s, nm in SEV.items():
        dom = tbase & (inc == k).to_numpy() & (sev == s).to_numpy()
        treat.append(dict(inc=k, sev=nm, n=int(dom.sum()), med=prop(med, dom), beh=prop(beh, dom),
                          neither=prop(~med & ~beh, dom)))
treat_inc = [dict(inc=k, neither=prop(~med & ~beh, tbase & (inc == k).to_numpy()), med=prop(med, tbase & (inc == k).to_numpy())) for k in [1, 2, 3, 4]]

# ---------- survey-weighted logistic regression: any current treatment ----------
r = pd.DataFrame(dict(y=(med | beh).astype(float), w=W, strata=strata))
r['inc1'] = (inc == 1).astype(float); r['inc2'] = (inc == 2).astype(float); r['inc3'] = (inc == 3).astype(float)
r['public'] = (d.TYPEINS == 1).astype(float); r['unins'] = (d.TYPEINS == 3).astype(float)
r['black'] = (d.RACER == 2).astype(float); r['other'] = (d.RACER == 3).astype(float)
r['hisp'] = (d.HISPANIC == 1).astype(float)
r['female'] = (d.SEX == 2).astype(float)
r['moderate'] = (sev == 2).astype(float); r['severe'] = (sev == 3).astype(float)
r['age14'] = d.AGE_NSDATAR.isin([5, 6]).astype(float)  # 14-17 vs younger
r['c1'] = (cnt == 1).astype(float); r['c2'] = (cnt >= 2).astype(float)
ok = tbase & d.TYPEINS.isin([1, 2, 3]).to_numpy() & d.RACER.isin([1, 2, 3]).to_numpy() & d.HISPANIC.isin([0, 1]).to_numpy()
TERMS = [('inc1', 'Income ≤100% FPL', 'vs >400%'), ('inc2', 'Income 100–200%', 'vs >400%'), ('inc3', 'Income 200–400%', 'vs >400%'),
         ('public', 'Public insurance', 'vs private'), ('unins', 'Uninsured', 'vs private'),
         ('black', 'Black', 'vs White'), ('other', 'Other race', 'vs White'), ('hisp', 'Hispanic', 'vs not'),
         ('female', 'Girl', 'vs boy'), ('moderate', 'Moderate ADHD', 'vs mild'), ('severe', 'Severe ADHD', 'vs mild'),
         ('age14', 'Age 14–17', 'vs under 14'), ('c1', '1 other condition', 'vs none'), ('c2', '2+ other conditions', 'vs none')]
cols = [t[0] for t in TERMS]
Xm = np.column_stack([np.ones(N)] + [r[c].to_numpy() for c in cols])
y = r.y.to_numpy(); w = W * ok
beta = np.zeros(Xm.shape[1])
for _ in range(50):
    p = 1 / (1 + np.exp(-Xm @ beta))
    H = (Xm * (w * p * (1 - p))[:, None]).T @ Xm
    g = Xm.T @ (w * (y - p))
    step = np.linalg.solve(H, g); beta += step
    if np.abs(step).max() < 1e-10: break
p = 1 / (1 + np.exp(-Xm @ beta))
Hinv = np.linalg.inv((Xm * (w * p * (1 - p))[:, None]).T @ Xm)
U = Xm * (w * (y - p))[:, None]
meat = np.zeros((Xm.shape[1],) * 2)
for h in np.unique(strata):
    m = strata == h; nh = m.sum()
    if nh < 2: continue
    Uh = U[m] - U[m].mean(0)
    meat += nh / (nh - 1) * Uh.T @ Uh
V = Hinv @ meat @ Hinv
se = np.sqrt(np.diag(V))
dfree = len(np.unique(strata)) and (ok.sum() - len(np.unique(strata[ok])))
odds = []
for k, (c, lab, ref) in enumerate(TERMS, start=1):
    b, s_ = beta[k], se[k]
    zv = b / s_
    odds.append(dict(term=c, label=lab, ref=ref, n=int((ok & (r[c].to_numpy() == 1)).sum()), est=round(float(np.exp(b)), 2),
                     lo=round(float(np.exp(b - 1.96 * s_)), 2), hi=round(float(np.exp(b + 1.96 * s_)), 2),
                     p=round(float(2 * stats.norm.sf(abs(zv))), 4)))
model = dict(n=int(ok.sum()), outcome='Currently on ADHD medication or in any behavioral treatment',
             treated=prop(med | beh, ok), terms=odds)

out = dict(
    source='CDC/NCHS NS-DATA 2014 ADHD public-use file (n = 2,966)',
    weight='ADHD_WT (final raked ADHD weight); SEs by Taylor linearization, strata STATE×SAMPLE, PSU IDNUMR',
    severity=dict(income=income, overall=overall, n=int(base.sum()), ratio=ratio, ratio_unw=round(ur, 2)),
    conditions=dict(names=names, prev=prevo, count=[int(Xo[:, i].sum()) for i in range(len(names))], cond=cond, burden=burden, any=anyc, n=N),
    treatment=dict(cells=treat, byIncome=treat_inc, n=int(tbase.sum())),
    model=model,
)
json.dump(out, open('/Users/eshaan/Desktop/Projects/site-wt-adhd/public/data/adhd-diagnosis/adhd.json', 'w'), ensure_ascii=False, separators=(',', ':'))
