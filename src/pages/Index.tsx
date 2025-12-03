import { useState } from "react";
import { MessageCircle, Smartphone, Zap, Send, CheckCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "393XXXXXXXXX"; // Sostituisci con il tuo numero
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Ciao%20Zorro%2C%20voglio%20un%20sito%20a%20180%E2%82%AC`;
const EMAIL = "tuaemail@example.com"; // Sostituisci con la tua email

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Compila tutti i campi", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    // Simula invio - integra EmailJS o altro servizio
    setTimeout(() => {
      toast({ title: "Messaggio inviato!", description: "Ti risponderò il prima possibile." });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="noise-overlay" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold glow-shadow">
              Z
            </div>
            <div>
              <div className="font-semibold text-sm">Zorro Web Studio</div>
              <div className="text-xs text-muted-foreground">Siti vetrina professionali</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#servizi" className="hover:text-foreground transition-colors">Servizi</a>
            <a href="#prezzo" className="hover:text-foreground transition-colors">Prezzo</a>
            <a href="#contatti" className="hover:text-foreground transition-colors">Contatti</a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
              Posti limitati
            </span>
            <Button asChild size="sm" className="glow-shadow">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground mb-4">
              <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/50 text-primary text-[10px] uppercase tracking-wider">
                Lancio speciale
              </span>
              <span>Qualità da agenzia, prezzo accessibile</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              Siti web <span className="gradient-text">professionali</span> a solo{" "}
              <span className="text-primary">180€</span>
            </h1>
            
            <p className="text-foreground/80 mb-6 max-w-lg leading-relaxed">
              Creo <strong className="text-foreground">siti vetrina su misura</strong>: moderni, veloci e perfetti su ogni dispositivo. 
              Design curato che fa la differenza per la tua attività.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button asChild size="lg" className="glow-shadow">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  🚀 Inizia il tuo sito ora
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#servizi">Scopri cosa include</a>
              </Button>
            </div>

            {/* Credibility element */}
            <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Risposta entro 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>3+ anni di esperienza web</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up [animation-delay:150ms]">
            <div className="card-gradient rounded-2xl p-5 border border-border/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-3 py-1 rounded-full border border-border bg-secondary/50">
                  Anteprima stile
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success-foreground border border-success/50">
                  Design curato
                </span>
              </div>
              
              <div className="rounded-xl border border-border/70 bg-background/50 p-4">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-sm mb-1">Sito per la tua attività</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Hero d'impatto, sezioni chiare, call-to-action efficaci.
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border">Responsive</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border">Moderno</span>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary inline-flex items-center gap-1">
                      ✨ Questo stesso sito è un esempio del mio stile
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-b from-primary/20 to-background rounded-xl p-3 border border-border/50">
                    <div className="text-[10px] text-muted-foreground mb-2">Chat WhatsApp</div>
                    <div className="text-xs bg-secondary/80 rounded-lg px-2 py-1.5 mb-2">
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
        <section id="servizi" className="mb-16 animate-fade-in-up [animation-delay:200ms]">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Cosa include</span>
            <h2 className="text-2xl font-bold mt-1">Un sito vetrina curato nei dettagli</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
              <article key={i} className="card-gradient rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <span className="text-xs px-2 py-1 rounded-full border border-border bg-secondary/50 inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-success" /> {item.badge}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* Prezzo */}
        <section id="prezzo" className="mb-16 animate-fade-in-up [animation-delay:250ms]">
          <div className="card-gradient rounded-2xl p-6 md:p-8 border border-border/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Offerta lancio</span>
                <div className="flex items-baseline gap-2 mt-2 mb-3">
                  <span className="text-4xl font-bold text-primary">180€</span>
                  <span className="text-muted-foreground">/ sito completo</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Nessun abbonamento, nessun costo nascosto. Un pagamento unico per il tuo sito.
                </p>
                
                <ul className="space-y-2 text-sm">
                  {[
                    "Layout personalizzato per la tua attività",
                    "Sezioni: hero, servizi, chi sei, contatti",
                    "Ottimizzato per mobile e conversioni",
                    "Supporto per contenuti e immagini"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-secondary/30 rounded-xl p-5 border border-dashed border-border">
                <h3 className="font-semibold mb-2">Perché questo prezzo?</h3>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">È una tariffa lancio</strong> per crescere insieme ai miei primi clienti. 
                  Tu ottieni un sito professionale a un prezzo accessibile, io costruisco il mio portfolio con progetti reali.
                  <br /><br />
                  Stesso livello di cura di un'agenzia, ma senza i costi da agenzia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contatti */}
        <section id="contatti" className="animate-fade-in-up [animation-delay:300ms]">
          <div className="card-gradient rounded-2xl p-6 md:p-8 border border-border/50">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-wider text-primary font-medium">Parliamone</span>
              <h2 className="text-2xl font-bold mt-2">Iniziamo il tuo progetto</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* WhatsApp - Opzione principale */}
              <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-success/20 border border-success/50 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-xs text-foreground/70">Risposta più veloce</p>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/80 mb-4">
                  Ti rispondo di solito entro qualche ora. È il modo migliore per iniziare.
                </p>
                
                <Button asChild className="w-full glow-shadow mb-4">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" /> Scrivimi su WhatsApp
                  </a>
                </Button>

                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Risposta garantita entro 24h</span>
                </div>
              </div>

              {/* Form email */}
              <form onSubmit={handleSubmit} className="bg-secondary/30 rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-4">
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
                    />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 mb-1 block">Email</label>
                    <Input 
                      type="email" 
                      placeholder="Dove posso risponderti?" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 mb-1 block">Messaggio</label>
                    <Textarea 
                      placeholder="Raccontami della tua attività..." 
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Invia richiesta
                  </Button>
                </div>
              </form>
            </div>

            <p className="text-center text-xs text-foreground/50 mt-6">
              Non hai ancora testi o immagini? Nessun problema, ti aiuto io.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Zorro Web Studio – Siti vetrina a 180€</span>
          <div className="flex gap-4">
            <a href={`mailto:${EMAIL}`} className="hover:text-foreground transition-colors">{EMAIL}</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* Sticky WhatsApp CTA - Mobile only */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <Button asChild className="w-full glow-shadow animate-pulse-glow" size="lg">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5 mr-2" /> Scrivimi su WhatsApp – 180€
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Index;
