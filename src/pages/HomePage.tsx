import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Baby } from "lucide-react";

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              {t("projectTitle")}
            </div>
            <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t("projectTitle")}
            </h1>
            <p className="mb-4 text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <p className="mb-10 text-base text-muted-foreground/80">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/screening"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-card-hover"
              >
                {t("startScreeningBtn")}
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 font-display text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {t("learnMore")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-16">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Early Detection", desc: "Identify potential risk factors early through symptom analysis." },
              { icon: Heart, title: "Care & Awareness", desc: "Empower expecting mothers with knowledge about warning signs." },
              { icon: Baby, title: "Better Outcomes", desc: "Enable timely medical intervention for healthier pregnancies." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border py-8">
        <div className="container">
          <p className="text-center text-xs text-muted-foreground">{t("disclaimer")}</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
