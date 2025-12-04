import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  Cookie,
  Info,
  Loader2,
  MessageCircle,
  Moon,
  Quote,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Ciao%20PIXEL BOH%2C%20vorrei%20un%20sito%20vetrina%20per%20la%20mia%20attivit%C3%A0`;
const EMAIL = "ciao@PIXEL BOH.it";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? "";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

type Theme = "light" | "dark";
type ConsentState = "accepted" | "declined" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __gaLoaded?: boolean;
  }
}

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [consent, setConsent] = useState<ConsentState>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const revealRefs = useRef<HTMLElement[]>([]);

  const whatsappLabel = useMemo(
    () => "Scrivimi su WhatsApp per un sito a 180€ (risposta entro 24h)",
    []
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme = storedTheme === "light" || storedTheme === "dark" ? (storedTheme as Theme) : prefersDark ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookie-consent");
    if (storedConsent === "accepted" || storedConsent === "declined") {
      setConsent(storedConsent as ConsentState);
      setShowCookieBanner(false);
    } else {
      setShowCookieBanner(true);
    }
  }, []);

  useEffect(() => {
    if (consent === "accepted" && GA_MEASUREMENT_ID && !window.__gaLoaded) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      const inline = document.createElement("script");
      inline.innerHTML = `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });`;
      document.body.appendChild(inline);
      window.__gaLoaded = true;
    }
  }, [consent]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 12);
      setParallaxOffset(Math.max(-28, Math.min(0, -y * 0.08)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const handleConsent = (value: Exclude<ConsentState, null>) => {
    setConsent(value);
    localStorage.setItem("cookie-consent", value);
    setShowCookieBanner(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Inserisci il tuo nome";
    if (!formData.email.trim()) newErrors.email = "Inserisci la tua email";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email non valida";
    if (!formData.message.trim()) newErrors.message = "Raccontami del tuo progetto";
    if (formData.message && formData.message.trim().length < 10) newErrors.message = "Aggiungi qualche dettaglio in più";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Controlla i campi evidenziati", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error("Config EmailJS mancante");
      }
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
            to_email: EMAIL
          }
        })
      });

      if (!response.ok) {
        throw new Error("EmailJS response not ok");
      }

      toast({ title: "Messaggio inviato!", description: "Ti risponderò il prima possibile." });
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error(error);
      toast({
        title: "Invio non riuscito",
        description: "Riprova tra un attimo o scrivimi su WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackWhatsAppClick = (label: string) => {
    if (consent === "accepted" && GA_MEASUREMENT_ID && typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", { event_category: "engagement", event_label: label });
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen gradient-bg text-base">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-background focus:border focus:border-primary"
      >
        Salta al contenuto principale
      </a>

      <div className="noise-overlay" aria-hidden="true" />

      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 border-b border-border/50 ${
          isScrolled ? "bg-background/90 shadow-lg" : "bg-background/60"
        }`}
        role="banner"
      >
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold glow-shadow">
              Z
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base">PIXEL BOH</div>
              <div className="text-xs text-muted-foreground">Siti vetrina professionali</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground" aria-label="Navigazione principale">
            <a href="#servizi" className="hover:text-foreground transition-colors">
              Servizi
            </a>
            <a href="#processo" className="hover:text-foreground transition-colors">
              Processo
            </a>
            <a href="#testimonianze" className="hover:text-foreground transition-colors">
              Testimonianze
            </a>
            <a href="#prezzo" className="hover:text-foreground transition-colors">
              Prezzo
            </a>
            <a href="#contatti" className="hover:text-foreground transition-colors">
              Contatti
            </a>
            <a href="#privacy" className="hover:text-foreground transition-colors">
              Policy
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border px-3 py-2 text-xs flex items-center gap-2 hover:border-primary transition-colors"
              aria-label="Toggle tema chiaro/scuro"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === "dark" ? "Light" : "Dark"}
            </button>
            <span className="hidden sm:inline-block text-xs px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
              Solo 5 posti al mese
            </span>
            <Button asChild size="sm" className="glow-shadow btn-interactive" onClick={() => trackWhatsAppClick("Header CTA")}
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={whatsappLabel}>
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="container py-10 md:py-14 space-y-20">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-10 items-center reveal" ref={registerReveal}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/70 text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Qualità da agenzia, prezzo accessibile</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Siti web <span className="gradient-text">professionali</span> a solo <span className="text-primary">180€</span>
            </h1>

            <p className="text-lg text-foreground/80 max-w-2xl">
              Creo <strong className="text-foreground">siti vetrina su misura</strong>: moderni, veloci e perfetti su ogni dispositivo.
              Design curato che fa la differenza per la tua attività.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="glow-shadow btn-interactive"
                onClick={() => trackWhatsAppClick("Hero CTA")}
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={whatsappLabel}>
                  🚀 Inizia il tuo sito ora
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="btn-interactive">
                <a href="#servizi">Scopri cosa include</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Risposta entro 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>3+ anni di esperienza web</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Pagamento unico, nessun abbonamento</span>
              </div>
            </div>

            <nav aria-label="Percorso" className="text-xs text-muted-foreground flex items-center gap-2">
              <a className="hover:text-foreground" href="#servizi">
                Home
              </a>
              <span aria-hidden="true">/</span>
              <a className="hover:text-foreground" href="#servizi">
                Servizi
              </a>
              <span aria-hidden="true">/</span>
              <a className="hover:text-foreground" href="#contatti">
                Contatti
              </a>
            </nav>
          </div>

          <div className="relative">
            <div
              className="card-gradient rounded-2xl p-6 border border-border/50 shadow-soft parallax-layer"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-3 py-1 rounded-full border border-border bg-secondary/60">Anteprima stile</span>
                <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success-foreground border border-success/50">
                  Design curato
                </span>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/70 p-4 space-y-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-sm mb-1">Sito per la tua attività</div>
                      <div className="text-xs text-muted-foreground">
                        Hero d'impatto, sezioni chiare, call-to-action efficaci.
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border">Responsive</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border">Moderno</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border">SEO Ready</span>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary inline-flex items-center gap-1">
                      ✨ Questo stesso sito è un esempio del mio stile
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-primary/15 to-background rounded-xl p-3 border border-border/50 space-y-2">
                    <div className="text-[10px] text-muted-foreground">Chat WhatsApp</div>
                    <div className="text-xs bg-secondary/80 rounded-lg px-2 py-1.5">
                      Ciao, il sito è davvero professionale?
                    </div>
                    <div className="text-xs bg-gradient-to-r from-success to-success/80 text-success-foreground rounded-lg px-2 py-1.5 ml-auto max-w-[90%]">
                      Assolutamente sì! Design curato e moderno 👋
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servizi */}
        <section id="servizi" className="space-y-6 reveal" ref={registerReveal}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Cosa include</span>
              <h2 className="text-2xl font-bold mt-1">Un sito vetrina curato nei dettagli</h2>
            </div>
            <span className="badge-soft">
              <CheckCircle className="w-3 h-3 text-success" />
              Mobile-first & ottimizzato SEO
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Smartphone,
                title: "Design responsive",
                desc: "Perfetto su smartphone, tablet e desktop. Testato su tutti i dispositivi.",
                badge: "Mobile-first"
              },
              {
                icon: Zap,
                title: "Veloce e chiaro",
                desc: "Pagine leggere, sezioni organizzate. Chi visita capisce subito cosa fai.",
                badge: "Performance"
              },
              {
                icon: MessageCircle,
                title: "Contatto diretto",
                desc: "WhatsApp sempre visibile + form email. I tuoi clienti ti trovano facilmente.",
                badge: "Conversioni"
              }
            ].map((item, i) => (
              <article
                key={i}
                className="card-gradient rounded-xl p-5 border border-border/50 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-soft reveal"
                ref={registerReveal}
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                <span className="text-xs px-2 py-1 rounded-full border border-border bg-secondary/60 inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-success" /> {item.badge}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* Come funziona */}
        <section id="processo" className="space-y-6 reveal" ref={registerReveal}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Processo semplice</span>
              <h2 className="text-2xl font-bold mt-1">Come funziona in 3 step</h2>
            </div>
            <span className="badge-soft text-destructive border-destructive/30 bg-destructive/10">Solo 5 posti disponibili questo mese</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: MessageCircle,
                title: "Scrivimi",
                desc: "Mandami un messaggio su WhatsApp o email con l'idea del tuo sito.",
                detail: "Risposta entro 24h"
              },
              {
                icon: Clock,
                title: "Brief di 15 minuti",
                desc: "Facciamo una call veloce per definire obiettivi, sezioni e stile.",
                detail: "Zero burocrazia"
              },
              {
                icon: CheckCircle,
                title: "Consegna rapida",
                desc: "Ti mostro la bozza in pochi giorni e la rifiniamo insieme.",
                detail: "Revisione inclusa"
              }
            ].map((step, i) => (
              <article key={i} className="card-gradient rounded-xl p-5 border border-border/50 flex flex-col gap-3 reveal" ref={registerReveal}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full border border-border bg-secondary/50 inline-flex items-center gap-1 w-fit">
                  <Zap className="w-3 h-3 text-primary" /> {step.detail}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* Testimonianze */}
        <section id="testimonianze" className="space-y-6 reveal" ref={registerReveal}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Credibilità</span>
              <h2 className="text-2xl font-bold mt-1">Cosa dicono i clienti</h2>
            </div>
            <span className="badge-soft">
              <Sparkles className="w-3 h-3 text-primary" /> Testimonianze realizzate su misura
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Francesca, estetica",
                quote: "Ha creato un sito elegante che rispecchia il mio salone. Comunicazione rapidissima.",
                score: "5/5"
              },
              {
                name: "Luca, studio legale",
                quote: "Struttura chiara, zero fronzoli. In pochi giorni avevo la bozza pronta da condividere.",
                score: "4.8/5"
              },
              {
                name: "Marta, personal trainer",
                quote: "Mobile perfetto e CTA WhatsApp funzionanti: ho ricevuto contatti già dal primo giorno.",
                score: "5/5"
              }
            ].map((review, i) => (
              <article key={i} className="glass-panel rounded-xl p-5 shadow-soft border border-border/60 reveal" ref={registerReveal}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Quote className="w-4 h-4 text-primary" /> {review.name}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">{review.score}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">“{review.quote}”</p>
              </article>
            ))}
          </div>
        </section>

        {/* Prezzo */}
        <section id="prezzo" className="reveal" ref={registerReveal}>
          <div className="card-gradient rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Offerta lancio</span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">180€</span>
                  <span className="text-muted-foreground">/ sito completo</span>
                  <span className="text-[11px] px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                    Solo 5 posti disponibili questo mese
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nessun abbonamento, nessun costo nascosto. Un pagamento unico per il tuo sito.
                </p>

                <ul className="space-y-2 text-sm">
                  {[
                    "Layout personalizzato per la tua attività",
                    "Sezioni: hero, servizi, chi sei, contatti",
                    "Ottimizzato per mobile, SEO base e conversioni",
                    "Supporto per contenuti e immagini"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-xl p-5 border border-dashed border-border space-y-3">
                <h3 className="font-semibold">Perché questo prezzo?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">È una tariffa lancio</strong> per crescere insieme ai miei primi clienti. Tu ottieni un sito professionale a un prezzo accessibile, io costruisco il mio portfolio con progetti reali.
                  <br />
                  <br />
                  Stesso livello di cura di un'agenzia, ma senza i costi da agenzia.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="badge-soft">Consegna in pochi giorni</span>
                  <span className="badge-soft">Revisione inclusa</span>
                  <span className="badge-soft">Supporto dedicato</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contatti */}
        <section id="contatti" className="reveal" ref={registerReveal}>
          <div className="card-gradient rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft">
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs uppercase tracking-wider text-primary font-medium">Parliamone</span>
              <h2 className="text-2xl font-bold">Iniziamo il tuo progetto</h2>
              <p className="text-sm text-muted-foreground">Scegli il canale che preferisci: risposta entro 24h.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-secondary/40 rounded-xl p-5 border border-border/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 border border-success/50 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-xs text-foreground/70">Opzione più veloce</p>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed">
                  Ti rispondo di solito entro qualche ora. È il modo migliore per iniziare.
                </p>

                <Button
                  asChild
                  className="w-full glow-shadow mb-2 btn-interactive"
                  onClick={() => trackWhatsAppClick("Contatti WhatsApp")}
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={whatsappLabel}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Scrivimi su WhatsApp
                  </a>
                </Button>

                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Risposta garantita entro 24h</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bg-secondary/40 rounded-xl p-5 border border-border/50 space-y-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-xs text-foreground/70">Preferisci scrivere?</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-foreground/90 mb-1 block">Nome</label>
                    <Input
                      placeholder="Come ti chiami?"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <p id="name-error" className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 mb-1 block">Email</label>
                    <Input
                      type="email"
                      placeholder="Dove posso risponderti?"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 mb-1 block">Messaggio</label>
                    <Textarea
                      placeholder="Raccontami della tua attività..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      autoComplete="on"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && <p id="message-error" className="text-xs text-destructive mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full btn-interactive">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Invio in corso...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Invia richiesta
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Nessun spam: uso i tuoi dati solo per rispondere.
                  </p>
                </div>
              </form>
            </div>

            <p className="text-center text-xs text-foreground/60 mt-6">
              Non hai ancora testi o immagini? Nessun problema, ti aiuto io.
            </p>
          </div>
        </section>

        {/* Legal & trust */}
        <section
          id="privacy"
          className="reveal card-gradient rounded-2xl p-6 md:p-8 border border-border/50 shadow-soft"
          aria-labelledby="legal-section"
          ref={registerReveal}
        >
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-primary" aria-hidden="true" />
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Trasparenza</span>
              <h2 id="legal-section" className="text-xl font-semibold leading-tight">
                Privacy, cookie e note legali
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-sm text-foreground/80">
            <article id="privacy-policy" className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">Privacy Policy</h3>
              </div>
              <p>
                Raccolgo solo i dati inviati volontariamente tramite form o WhatsApp per rispondere alle richieste. I dati non vengono ceduti a terzi e sono conservati in conformità al GDPR.
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Dati trattati: nome, email, contenuto del messaggio.</li>
                <li>Finalità: risposta e gestione dei preventivi.</li>
                <li>Diritti: accesso, rettifica, cancellazione scrivendo a {EMAIL}.</li>
              </ul>
            </article>

            <article id="cookie-policy" className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">Cookie Policy</h3>
              </div>
              <p>
                Il sito utilizza cookie tecnici essenziali al funzionamento. Gli strumenti di analisi vengono caricati solo dopo il consenso. Nessun tracking di terze parti è attivo senza accettazione.
              </p>
              <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-secondary/60">
                <CheckCircle className="w-3 h-3 text-success" aria-hidden="true" />
                <span>Zero cookie di profilazione di default</span>
              </div>
            </article>

            <article id="terms" className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">Termini e condizioni</h3>
              </div>
              <p>
                Il prezzo indicato si riferisce al pacchetto sito vetrina con struttura standard personalizzata sui tuoi contenuti. Il lavoro inizia dopo conferma scritta e accettazione del preventivo.
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Tempistiche: bozza iniziale in pochi giorni lavorativi.</li>
                <li>Una revisione inclusa, ulteriori modifiche su accordo.</li>
                <li>Pagamenti tracciati con regolare fattura.</li>
              </ul>
              <button
                type="button"
                className="text-xs text-primary hover:underline flex items-center gap-1"
                onClick={() => setShowCookieBanner(true)}
              >
                Rivedi preferenze cookie <ArrowUpRight className="w-3 h-3" />
              </button>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} PIXEL BOH – Siti vetrina a 180€</span>
          <nav aria-label="Link legali e contatti" className="flex flex-wrap gap-4">
            <a href={`mailto:${EMAIL}`} className="hover:text-foreground transition-colors">
              {EMAIL}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              onClick={() => trackWhatsAppClick("Footer WhatsApp")}
            >
              WhatsApp
            </a>
            <a href="#privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#cookie-policy" className="hover:text-foreground transition-colors">
              Cookie
            </a>
            <a href="#terms" className="hover:text-foreground transition-colors">
              Termini
            </a>
          </nav>
        </div>
      </footer>

      {/* Cookie banner */}
      {showCookieBanner && (
        <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:w-[420px] z-50 glass-panel rounded-2xl p-4 shadow-soft border">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <Cookie className="w-4 h-4" />
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Cookie e analytics</p>
              <p className="text-muted-foreground leading-relaxed">
                Uso cookie tecnici per il funzionamento. Posso attivare analytics anonimi solo con il tuo consenso per migliorare l'esperienza.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="btn-interactive" onClick={() => handleConsent("accepted")}>
                  Accetta
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleConsent("declined")}>Rifiuta</Button>
              </div>
              {!GA_MEASUREMENT_ID && (
                <p className="text-[11px] text-yellow-600">Configura VITE_GA_MEASUREMENT_ID per attivare l'analytics.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky WhatsApp CTA - Mobile only */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <Button
          asChild
          className="w-full glow-shadow animate-pulse-glow btn-interactive"
          size="lg"
          onClick={() => trackWhatsAppClick("Sticky WhatsApp")}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center leading-tight"
            aria-label={whatsappLabel}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Scrivimi su WhatsApp – 180€
            </span>
            <span className="text-xs text-primary/80">Risposta entro 24h</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Index;
