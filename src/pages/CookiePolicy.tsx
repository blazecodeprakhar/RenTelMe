import { Layout } from "@/components/layout/Layout";

const CookiePolicy = () => (
  <Layout>
    <section className="py-12 md:py-16 bg-gradient-warm">
      <div className="container-section">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: January 2024</p>
      </div>
    </section>
    <section className="py-12">
      <div className="container-section max-w-4xl">
        <div className="bg-card p-8 rounded-2xl shadow-soft border border-border space-y-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">What Are Cookies</h2>
            <p className="text-muted-foreground">Cookies are small text files stored on your device that help us improve your browsing experience.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">How We Use Cookies</h2>
            <p className="text-muted-foreground">We use cookies to remember your preferences, analyze site traffic, and enhance functionality.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Managing Cookies</h2>
            <p className="text-muted-foreground">You can control cookies through your browser settings. Disabling cookies may affect site functionality.</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default CookiePolicy;
