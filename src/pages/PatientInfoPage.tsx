import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  Droplets,
  Thermometer,
  Activity,
  Scale,
  ArrowRight,
} from "lucide-react";

const numericFields = [
  { key: "age", icon: User, row: false },
  { key: "systolic_bp", icon: Activity, row: true },
  { key: "diastolic_bp", icon: Activity, row: true },
  { key: "blood_sugar", icon: Droplets, row: true },
  { key: "body_temp", icon: Thermometer, row: true },
  { key: "heart_rate", icon: Heart, row: true },
  { key: "bmi", icon: Scale, row: false },
];

const PatientInfoPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<string, string>>({
    age: "",
    systolic_bp: "",
    diastolic_bp: "",
    blood_sugar: "",
    body_temp: "",
    heart_rate: "",
    bmi: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.age) return;
    sessionStorage.setItem("patientNumeric", JSON.stringify(form));
    navigate("/screening/symptoms");
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

  const renderField = (key: string, Icon: typeof User) => (
    <div key={key}>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-primary" /> {t(key)}
      </label>
      <input
        type="number"
        step="any"
        className={inputClass}
        placeholder={t(`${key}_placeholder`)}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        required={key === "age"}
      />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="container max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
            {t("patientInfo")}
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">{t("patientInfoDesc")}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Age – full width */}
            {renderField("age", User)}

            {/* Paired fields */}
            <div className="grid grid-cols-2 gap-4">
              {renderField("systolic_bp", Activity)}
              {renderField("diastolic_bp", Activity)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField("blood_sugar", Droplets)}
              {renderField("body_temp", Thermometer)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField("heart_rate", Heart)}
              {renderField("bmi", Scale)}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-card-hover"
            >
              {t("next")} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientInfoPage;
