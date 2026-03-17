import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Siren,
  RotateCcw,
  TrendingUp,
  Info,
  Heart,
} from "lucide-react";
import type { PredictionResult } from "@/services/predictionService";

interface RiskLevel {
  category: string;
  advice: string;
  Icon: typeof CheckCircle2;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconColorClass: string;
  textColorClass: string;
  scoreColorClass: string;
  ringClass: string;
}

const RiskResultPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { percentage, level, usedFallback } = useMemo(() => {
    const raw = sessionStorage.getItem("predictionResult");
    const result: PredictionResult | null = raw ? JSON.parse(raw) : null;

    const pct = result?.risk_score ?? 0;
    const fallback = result?.usedFallback ?? true;

    let lvl: RiskLevel;

    if (pct <= 32) {
      lvl = {
        category: t("low"),
        advice: "Current indicators suggest a low risk level. Continue monitoring your health.",
        Icon: CheckCircle2,
        bgClass: "bg-success-muted",
        borderClass: "border-success/30",
        iconBgClass: "bg-success/15",
        iconColorClass: "text-success",
        textColorClass: "text-success",
        scoreColorClass: "text-success",
        ringClass: "ring-success/20",
      };
    } else if (pct <= 66) {
      lvl = {
        category: t("moderate"),
        advice: "Some warning signs may require attention. Consider consulting a healthcare professional.",
        Icon: AlertTriangle,
        bgClass: "bg-warning-muted",
        borderClass: "border-warning/30",
        iconBgClass: "bg-warning/15",
        iconColorClass: "text-warning",
        textColorClass: "text-warning",
        scoreColorClass: "text-warning",
        ringClass: "ring-warning/20",
      };
    } else if (pct <= 90) {
      lvl = {
        category: t("high"),
        advice: "Important warning signs detected. Medical consultation is strongly recommended.",
        Icon: ShieldAlert,
        bgClass: "bg-destructive/5",
        borderClass: "border-destructive/30",
        iconBgClass: "bg-destructive/15",
        iconColorClass: "text-destructive",
        textColorClass: "text-destructive",
        scoreColorClass: "text-destructive",
        ringClass: "ring-destructive/20",
      };
    } else {
      lvl = {
        category: t("critical"),
        advice: "Serious warning signs detected. Please seek medical help immediately.",
        Icon: Siren,
        bgClass: "bg-critical-muted",
        borderClass: "border-critical/40",
        iconBgClass: "bg-critical/15",
        iconColorClass: "text-critical",
        textColorClass: "text-critical",
        scoreColorClass: "text-critical",
        ringClass: "ring-critical/25",
      };
    }

    return { percentage: pct, level: lvl, usedFallback: fallback };
  }, [t]);

  const { Icon } = level;

  // Circumference for the progress ring (radius = 58)
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="container max-w-lg">
        {/* Fallback notice */}
        {usedFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-muted p-3.5"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs text-muted-foreground">
              ML API not connected — showing estimate from fallback heuristic.
            </p>
          </motion.div>
        )}

        {/* Main alert card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={`relative overflow-hidden rounded-3xl border-2 ${level.borderClass} ${level.bgClass} p-8 ring-4 ${level.ringClass} shadow-card`}
          >
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-current to-transparent opacity-[0.04]" />

            {/* Header */}
            <div className="mb-2 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {t("riskResult")}
              </p>
            </div>

            {/* Score ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center"
            >
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  strokeWidth="8"
                  className="stroke-muted"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={`${level.iconColorClass.replace("text-", "stroke-")}`}
                  style={{ strokeDasharray: circumference }}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="text-center">
                <motion.span
                  className={`font-display text-5xl font-extrabold ${level.scoreColorClass}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {percentage}
                </motion.span>
                <span className={`font-display text-2xl font-bold ${level.scoreColorClass}`}>%</span>
              </div>
            </motion.div>

            {/* Icon + Category */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-5 flex flex-col items-center gap-3"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${level.iconBgClass}`}>
                <Icon className={`h-7 w-7 ${level.iconColorClass}`} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("riskCategory")}
                </p>
                <p className={`font-display text-2xl font-bold ${level.textColorClass}`}>
                  {level.category}
                </p>
              </div>
            </motion.div>

            {/* Advice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("medicalAdvice")}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{level.advice}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex flex-col gap-3"
        >
          <Link
            to="/trend"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-card transition-all hover:shadow-card-hover hover:brightness-110"
          >
            <TrendingUp className="h-4 w-4" /> {t("viewTrend")}
          </Link>
          <button
            onClick={() => { sessionStorage.clear(); navigate("/"); }}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> {t("startOver")}
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          {t("disclaimer")}
        </motion.p>
      </div>
    </div>
  );
};

export default RiskResultPage;
