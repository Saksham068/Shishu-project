import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Heart,
  Droplets,
  Zap,
  AlertCircle,
  Thermometer,
  Eye,
  Waves,
  ShieldCheck,
  Phone,
  Stethoscope,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  HandHeart,
} from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45 },
});

const AboutPage = () => {
  const { t } = useLanguage();

  const warningSymptoms = [
    { icon: Droplets, key: "vaginalBleeding", descKey: "vaginalBleedingDesc" },
    { icon: Zap, key: "severeCramps", descKey: "severeCrampsDesc" },
    { icon: AlertCircle, key: "severeAbdominalPain", descKey: "severeAbdominalPainDesc" },
    { icon: Thermometer, key: "fever", descKey: "feverDesc" },
    { icon: Eye, key: "dizziness", descKey: "dizzinessDesc" },
    { icon: Waves, key: "tissueFluid", descKey: "tissueFluidDesc" },
  ];

  const actionSteps = [
    { icon: ShieldCheck, key: "aboutStayCalmTitle", descKey: "aboutStayCalmDesc" },
    { icon: Phone, key: "aboutSeekAdviceTitle", descKey: "aboutSeekAdviceDesc" },
    { icon: Stethoscope, key: "aboutVisitDoctorTitle", descKey: "aboutVisitDoctorDesc" },
  ];

  const facts = [
    "aboutFact1",
    "aboutFact2",
    "aboutFact3",
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="container max-w-3xl">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" />
            {t("aboutTitle")}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {t("aboutTitle")}
          </h1>
        </motion.div>

        {/* Section 1 — Why Awareness Matters */}
        <motion.section {...fadeUp(0.1)} className="mb-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {t("aboutWhyMattersTitle")}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("aboutWhyMattersDesc")}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2 — Common Warning Signs */}
        <motion.section {...fadeUp(0.2)} className="mb-10">
          <h2 className="mb-1 font-display text-lg font-semibold text-foreground">
            {t("aboutWarning")}
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            {t("aboutWarningNote")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {warningSymptoms.map(({ icon: Icon, key, descKey }, i) => (
              <motion.div
                key={key}
                {...fadeUp(0.25 + i * 0.05)}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                  <Icon className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t(key)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t(descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 3 — What To Do */}
        <motion.section {...fadeUp(0.5)} className="mb-10">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
            {t("aboutWhatToDoTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {actionSteps.map(({ icon: Icon, key, descKey }, i) => (
              <motion.div
                key={key}
                {...fadeUp(0.55 + i * 0.08)}
                className="rounded-2xl border border-border bg-card p-5 text-center shadow-card"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{t(key)}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 4 — Did You Know? */}
        <motion.section {...fadeUp(0.75)} className="mb-10">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                {t("aboutDidYouKnow")}
              </h2>
            </div>
            <ul className="space-y-3">
              {facts.map((key, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <HandHeart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Section 5 — Disclaimer */}
        <motion.div {...fadeUp(0.9)}>
          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="mb-1 text-sm font-semibold text-foreground">
                  {t("aboutDisclaimerTitle")}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("aboutDisclaimerDesc")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
