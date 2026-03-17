import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

function generateTrendData(startPercent: number) {
  const s = Math.max(0, Math.min(100, startPercent));
  const days: number[] = [s];

  if (s <= 20) {
    // Low: decrease slightly each day
    for (let i = 1; i < 7; i++) days.push(days[i - 1] - (1 + Math.random() * 2));
  } else if (s <= 40) {
    // Small increase/stable Day 2, then gradual decrease
    days.push(s + (Math.random() * 2));           // Day 2
    for (let i = 2; i < 7; i++) days.push(days[i - 1] - (2 + Math.random() * 2));
  } else if (s <= 60) {
    // Small increase Day 2, stay elevated briefly, then slow decrease
    days.push(s + (1 + Math.random() * 3));        // Day 2
    days.push(days[1] + (Math.random() * 1.5));     // Day 3 elevated
    for (let i = 3; i < 7; i++) days.push(days[i - 1] - (2 + Math.random() * 2));
  } else if (s <= 80) {
    // Slight increase Day 2, remain high few days, then decrease
    days.push(s + (1 + Math.random() * 3));         // Day 2
    days.push(days[1] + (Math.random() * 1));        // Day 3
    days.push(days[2] - (Math.random() * 1));        // Day 4 still high
    for (let i = 4; i < 7; i++) days.push(days[i - 1] - (2 + Math.random() * 3));
  } else {
    // 81-100: spike Day 2, remain very high 2-3 days, then decrease
    days.push(s + (1 + Math.random() * 2));          // Day 2
    days.push(days[1] + (Math.random() * 1));         // Day 3
    days.push(days[2] - (Math.random() * 1.5));       // Day 4
    for (let i = 4; i < 7; i++) days.push(days[i - 1] - (2 + Math.random() * 3));
  }

  return days.slice(0, 7).map((v, i) => ({
    day: i + 1,
    risk: Math.round(Math.max(0, Math.min(100, v))),
  }));
}

const TrendPage = () => {
  const { t } = useLanguage();

  const { data, baseScore } = useMemo(() => {
    const rawResult = sessionStorage.getItem("predictionResult");
    const result = rawResult ? JSON.parse(rawResult) : null;
    const score = result?.risk_score ?? 30;
    return {
      data: generateTrendData(score),
      baseScore: score,
    };
  }, []);

  const trendDirection = data[6].risk - data[0].risk;

  const getStrokeColor = (score: number) => {
    if (score >= 70) return "hsl(0 72% 51%)";
    if (score >= 40) return "hsl(38 92% 50%)";
    return "hsl(142 71% 45%)";
  };

  const stroke = getStrokeColor(baseScore);
  const TrendIcon = trendDirection > 0 ? TrendingUp : trendDirection < 0 ? TrendingDown : Minus;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
            {t("trendTitle")}
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">{t("trendDesc")}</p>

          {/* Summary strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: stroke, color: "white" }}
            >
              <TrendIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("trendSummaryLabel")}: {data[0].risk}% → {data[6].risk}%
              </p>
              <p className="text-xs text-muted-foreground">
                {trendDirection > 0
                  ? t("trendIncreasing")
                  : trendDirection < 0
                    ? t("trendDecreasing")
                    : t("trendStable")}
              </p>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${t("day")} ${v}`}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{
                    value: t("riskLevel"),
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    backgroundColor: "hsl(var(--card))",
                  }}
                  formatter={(value: number) => [`${value}%`, t("riskLevel")]}
                  labelFormatter={(label) => `${t("day")} ${label}`}
                />
                <ReferenceLine y={70} stroke="hsl(0 72% 51%)" strokeDasharray="4 4" strokeOpacity={0.4} />
                <ReferenceLine y={40} stroke="hsl(38 92% 50%)" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke={stroke}
                  strokeWidth={3}
                  dot={{ fill: stroke, r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <p className="mt-6 text-center text-xs text-muted-foreground italic">
            {t("trendAwarenessDisclaimer")}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendPage;
