// Order state: a list of project slugs, kept per visitor in localStorage.
type Item = { slug: string; name: string; stat: string; url: string };

const KEY = 'order-v1';
let menu: Record<string, Item> = {};

function load(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}
let order: string[] = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(order)); } catch {}
  render();
}

function announce(msg: string) {
  const el = document.querySelector('[data-order-live]');
  if (el) el.textContent = msg;
}
export function add(slugs: string[]) {
  const added = slugs.filter((s) => menu[s] && !order.includes(s));
  order.push(...added);
  save();
  if (added.length) { bump(); announce(`Added ${added.map((s) => menu[s].name).join(', ')}. ${order.length} in order.`); }
}
export function remove(slug: string) {
  order = order.filter((s) => s !== slug);
  save();
  announce(`Removed ${menu[slug]?.name ?? 'item'}. ${order.length} in order.`);
}

function bump() {
  document.querySelectorAll<HTMLElement>('[data-bag-count]').forEach((el) => {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
}

function render() {
  const n = order.length;
  document.querySelectorAll<HTMLElement>('[data-bag-count]').forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-order-bar]').forEach((el) => {
    el.hidden = n === 0;
    const label = el.querySelector('[data-order-bar-label]');
    if (label) label.textContent = `${n} ${n === 1 ? 'item' : 'items'}`;
  });
  document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((b) => {
    const inOrder = order.includes(b.dataset.add!);
    b.setAttribute('aria-pressed', String(inOrder));
    const lbl = b.querySelector('[data-add-label]');
    if (lbl) lbl.textContent = inOrder ? (b.dataset.addedText || 'Added') : (b.dataset.addText || 'Add');
    b.setAttribute('aria-label', `${inOrder ? 'Remove' : 'Add'} ${menu[b.dataset.add!]?.name ?? ''} ${inOrder ? 'from' : 'to'} order`);
  });
  const list = document.querySelector<HTMLUListElement>('[data-order-list]');
  if (list) {
    list.replaceChildren(
      ...order.map((s) => {
        const it = menu[s];
        const li = document.createElement('li');
        li.innerHTML = `<a href="${it.url}"></a><span class="o-stat"></span><button type="button" class="o-x" aria-label="Remove ${it.name}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg></button>`;
        li.querySelector('a')!.textContent = it.name;
        li.querySelector('.o-stat')!.textContent = it.stat;
        li.querySelector('button')!.addEventListener('click', () => remove(s));
        return li;
      }),
    );
  }
  document.querySelectorAll<HTMLElement>('[data-order-empty]').forEach((el) => (el.hidden = n > 0));
  document.querySelectorAll<HTMLElement>('[data-order-actions]').forEach((el) => (el.hidden = n === 0));
  const mail = document.querySelector<HTMLAnchorElement>('[data-order-mail]');
  if (mail) {
    const body = `Hi Eshaan,\n\nI looked at:\n${order.map((s) => `- ${menu[s].name}: ${location.origin}${menu[s].url}`).join('\n')}\n\n`;
    mail.href = `mailto:eshaandhavala@gmail.com?subject=${encodeURIComponent('Your projects')}&body=${encodeURIComponent(body)}`;
  }
}

function once(el: Element | null | undefined, ev: string, fn: (e: Event) => void) {
  if (!el || (el as HTMLElement).dataset.bound === ev) return;
  (el as HTMLElement).dataset.bound = ev;
  el.addEventListener(ev, fn);
}

function init() {
  const data = document.getElementById('menu-data');
  if (data) menu = JSON.parse(data.textContent || '{}');
  order = load();

  document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((b) =>
    once(b, 'click', (e) => {
      e.preventDefault();
      const s = b.dataset.add!;
      order.includes(s) ? remove(s) : add([s]);
    }),
  );
  document.querySelectorAll<HTMLButtonElement>('[data-add-combo]').forEach((b) =>
    once(b, 'click', () => {
      add(b.dataset.addCombo!.split(','));
      const t = b.querySelector('[data-add-label]');
      if (t) t.textContent = 'Added';
    }),
  );

  const sheet = document.querySelector<HTMLDialogElement>('[data-order-sheet]');
  document.querySelectorAll('[data-open-order]').forEach((b) => once(b, 'click', () => sheet?.showModal()));
  once(sheet?.querySelector('[data-close-order]'), 'click', () => sheet!.close());
  once(sheet, 'click', (e) => { if (e.target === sheet) sheet!.close(); });
  let undo: string[] | null = null;
  let undoTimer: number | undefined;
  once(sheet?.querySelector('[data-order-clear]'), 'click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (undo) {
      order = undo; undo = null; clearTimeout(undoTimer);
      btn.textContent = 'Clear order'; save(); announce('Order restored.');
      return;
    }
    undo = [...order]; order = []; save(); announce('Order cleared.');
    const actions = sheet!.querySelector<HTMLElement>('[data-order-actions]')!;
    actions.hidden = false;
    actions.querySelectorAll<HTMLElement>('.btn').forEach((b) => (b.hidden = true));
    btn.textContent = 'Undo clear';
    undoTimer = window.setTimeout(() => { undo = null; btn.textContent = 'Clear order'; actions.querySelectorAll<HTMLElement>('.btn').forEach((b) => (b.hidden = false)); render(); }, 5000);
  });
  once(sheet?.querySelector('[data-order-copy]'), 'click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const text = order.map((s) => `${menu[s].name}: ${location.origin}${menu[s].url}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      btn.querySelector('[data-copy-label]')!.textContent = 'Copied';
      announce('Links copied.');
      setTimeout(() => (btn.querySelector('[data-copy-label]')!.textContent = 'Copy links'), 1600);
    } catch {
      btn.querySelector('[data-copy-label]')!.textContent = 'Copy failed. Select and copy manually';
    }
  });
  render();
}

document.addEventListener('astro:page-load', init);
