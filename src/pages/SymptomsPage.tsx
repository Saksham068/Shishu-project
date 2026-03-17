import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  Droplets,
  Eye,
  Battery,
  Thermometer,
  Zap,
  Waves,
  HeartPulse,
  Pill,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { predictRisk, type MLPayload } from "@/services/predictionService";

const toggleFields = [
  { key: "prev_complications", icon: AlertCircle },
  { key: "preexisting_diabetes", icon: Pill },
  { key: "gestational_diabetes", icon: Pill },
  { key: "mental_health", icon: Brain },
  { key: "vaginal_bleeding", icon: Droplets },
  { key: "abdominal_pain", icon: Zap },
  { key: "fever_symptom", icon: Thermometer },
  { key: "dizziness", icon: Eye },
  { key: "back_pain", icon: Waves },
  { key: "pelvic_cramps", icon: HeartPulse },
  { key: "weakness", icon: Battery },
];

const SymptomsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    try {
      const rawNum = sessionStorage.getItem("patientNumeric");
      const num = rawNum ? JSON.parse(rawNum) : {};

      const payload: MLPayload = {
        age: parseFloat(num.age) || 25,
        systolic_bp: parseFloat(num.systolic_bp) || 120,
        diastolic_bp: parseFloat(num.diastolic_bp) || 80,
        blood_sugar: parseFloat(num.blood_sugar) || 90,
        body_temp: parseFloat(num.body_temp) || 98.6,
        heart_rate: parseFloat(num.heart_rate) || 72,
        bmi: parseFloat(num.bmi) || 24,
        prev_complications: selected.has("prev_complications") ? 1 : 0,
        preexisting_diabetes: selected.has("preexisting_diabetes") ? 1 : 0,
        gestational_diabetes: selected.has("gestational_diabetes") ? 1 : 0,
        mental_health: selected.has("mental_health") ? 1 : 0,
        vaginal_bleeding: selected.has("vaginal_bleeding") ? 1 : 0,
        abdominal_pain: selected.has("abdominal_pain") ? 1 : 0,
        fever_symptom: selected.has("fever_symptom") ? 1 : 0,
        dizziness: selected.has("dizziness") ? 1 : 0,
        back_pain: selected.has("back_pain") ? 1 : 0,
        pelvic_cramps: selected.has("pelvic_cramps") ? 1 : 0,
        weakness: selected.has("weakness") ? 1 : 0,
      };

      const result = await predictRisk(payload);

      sessionStorage.setItem("predictionResult", JSON.stringify(result));
      sessionStorage.setItem("symptoms", JSON.stringify([...selected]));
      navigate("/screening/results");
    } catch (err) {
      console.error("Prediction failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
            {t("symptomsTitle")}
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">{t("symptomsToggleDesc")}</p>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{t("predictionError")}</p>
            </motion.div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {toggleFields.map(({ key, icon: Icon }) => {
              const active = selected.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-card"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{t(key)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {active ? t("yes") : t("no")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate("/screening")}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> {t("back")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("analyzing")}</span>
                </>
              ) : (
                <>
                  {t("viewResults")} <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomsPage;
