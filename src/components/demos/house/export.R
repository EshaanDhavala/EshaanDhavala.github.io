# Exports public/data/house-prices/model.json from the STATS 101A final report model.
# Run from the folder holding HousePriceTrain.csv (class Kaggle data, not committed). Rscript export.R
suppressMessages({library(jsonlite); library(mgcv)})
OUT <- Sys.getenv("OUT", "model.json")
d <- read.csv("HousePriceTrain.csv")
m0 <- mean(d$YearBuilt)
d$TSF <- d$TotalBsmtSF + d$GrLivArea
d$log_TotalSF <- log(d$TotalBsmtSF + d$GrLivArea + 1)
d$YearBuilt_c <- d$YearBuilt - m0
d$log_LotArea <- log(d$LotArea + 1)
d$GarageArea <- ifelse(is.na(d$GarageArea),0,d$GarageArea)
d$BsmtFinSF1 <- ifelse(is.na(d$BsmtFinSF1),0,d$BsmtFinSF1)
d$Qual_x_logSF <- d$OverallQual*d$log_TotalSF
y <- log(d$SalePrice)
mb <- lm(log(SalePrice) ~ GrLivArea + OverallQual, d)
mi <- lm(log(SalePrice) ~ log_TotalSF + OverallQual + YearBuilt_c + BsmtFinSF1 + GarageArea + log_LotArea, d)
mf <- lm(log(SalePrice) ~ log_TotalSF + OverallQual + YearBuilt_c + BsmtFinSF1 + log_LotArea + TotRmsAbvGrd + Qual_x_logSF, d)
s <- summary(mf); dfr <- mf$df.residual
r6 <- function(x) signif(x, 7)
ladder <- lapply(list(list("Baseline", mb, "Living area + quality"),
                      list("Intermediate", mi, "+ log sq ft, year, bsmt, garage, log lot"),
                      list("Final", mf, "+ rooms, quality × log sq ft, − garage")), function(z){
  m <- z[[2]]; list(name=z[[1]], what=z[[3]], predictors=length(coef(m))-1, r2=round(summary(m)$r.squared,4),
    adjr2=round(summary(m)$adj.r.squared,4), aic=round(AIC(m),2), bic=round(BIC(m),2), sigma=round(sigma(m),4))})
q <- function(x,p) unname(quantile(x,p))
sl <- list(
  tsf = list(min=1000, max=4900, step=10, value=round(median(d$TSF),-1)),
  qual = list(min=1, max=10, step=1, value=6),
  year = list(min=1900, max=2010, step=1, value=round(median(d$YearBuilt))),
  bsmt = list(min=0, max=1600, step=10, value=round(median(d$BsmtFinSF1),-1)),
  lot = list(min=1600, max=39000, step=100, value=round(median(d$LotArea),-2)),
  rooms = list(min=3, max=11, step=1, value=6))
set.seed(101)
fit <- fitted(mf); res <- resid(mf); sres <- rstandard(mf)
i1 <- sample(nrow(d), 2400)
# resid vs fitted smoother (gam like geom_smooth)
sm <- function(x, yy, n=70){ g <- gam(yy ~ s(x, bs="cs"), method="REML"); gx <- seq(q(x,.005), q(x,.995), length.out=n); list(x=r6(gx), y=r6(predict(g, data.frame(x=gx)))) }
rvf <- list(fitted=round(fit[i1],3), resid=round(res[i1],3), smooth=sm(fit,res))
# QQ: 240 quantiles of standardized residuals
pp <- ppoints(240); qq <- list(theo=round(qnorm(pp),3), samp=round(q(sres,pp),3), min=round(min(sres),3), max=round(max(sres),3))
# marginal model plots: raw-unit x where useful
mm <- function(key,label,x,logx=FALSE){
  xs <- if(logx) log(x) else x
  gd <- gam(y ~ s(xs, bs="cs"), method="REML"); gm <- gam(fit ~ s(xs, bs="cs"), method="REML")
  gx <- seq(q(xs,.01), q(xs,.99), length.out=60)
  list(key=key,label=label,logx=logx, x=r6(if(logx) exp(gx) else gx), data=r6(predict(gd,data.frame(xs=gx))), model=r6(predict(gm,data.frame(xs=gx))),
       px=r6(x[i1[1:1500]]), py=round(y[i1[1:1500]],3))
}
mmp <- list(mm("tsf","Total sq ft",d$TSF,TRUE), mm("qual","Overall quality",d$OverallQual), mm("year","Year built",d$YearBuilt),
            mm("bsmt","Finished bsmt sq ft",d$BsmtFinSF1), mm("lot","Lot area",d$LotArea,TRUE), mm("rooms","Rooms above grade",d$TotRmsAbvGrd))
# interaction scatter
i2 <- sample(nrow(d), 2000)
fan <- list(tsf=round(d$TSF[i2]), price=round(d$SalePrice[i2]), qual=round(d$OverallQual[i2],2))
p <- exp(fit)
out <- list(
  meta=list(n=nrow(d), meanYear=r6(m0), sigma=r6(sigma(mf)), df=dfr, t975=r6(qt(.975,dfr)), r2=round(s$r.squared,4), adjr2=round(s$adj.r.squared,4),
            r2price=round(1-sum((d$SalePrice-p)^2)/sum((d$SalePrice-mean(d$SalePrice))^2),4), medianPrice=round(median(d$SalePrice)),
            kaggle=0.88847, kaggleFile="EshaanDhavalaKaggleSubmission13.csv", testN=3000),
  coef=list(names=names(coef(mf)), b=r6(unname(coef(mf))), se=r6(unname(s$coefficients[,2]))),
  vcov=unname(apply(vcov(mf),c(1,2),r6)),
  sliders=sl, ladder=ladder, rvf=rvf, qq=qq, mmp=mmp, fan=fan)
write_json(out, OUT, auto_unbox=TRUE, digits=NA)
# sanity: prediction at defaults
x <- c(1, log(sl$tsf$value+1), 6, sl$year$value-m0, sl$bsmt$value, log(sl$lot$value+1), 6, 6*log(sl$tsf$value+1))
nd <- data.frame(log_TotalSF=x[2],OverallQual=6,YearBuilt_c=x[4],BsmtFinSF1=x[5],log_LotArea=x[6],TotRmsAbvGrd=6,Qual_x_logSF=x[8])
print(exp(predict(mf, nd, interval="prediction"))); print(exp(predict(mf, nd, interval="confidence")))
str(ladder)
