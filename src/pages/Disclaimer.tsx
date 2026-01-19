import { Layout } from "@/components/layout/Layout";

const Disclaimer = () => (
  <Layout>
    <section className="py-12 md:py-16 bg-gradient-warm">
      <div className="container-section">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Disclaimer</h1>
        <p className="text-muted-foreground">Last updated: January 2024</p>
      </div>
    </section>
    <section className="py-12">
      <div className="container-section max-w-4xl">
        <div className="bg-card p-8 rounded-2xl shadow-soft border border-border space-y-6">
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">Verification Notice</h2>
            <p className="text-muted-foreground">While RenTelMe verifies listings to the best of our ability, users should perform their own due diligence before entering any rental agreements.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">Third-Party Content</h2>
            <p className="text-muted-foreground">Property information is provided by owners. RenTelMe does not guarantee accuracy of all details and is not liable for any discrepancies.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-3">Rental Agreements</h2>
            <p className="text-muted-foreground">We recommend all parties enter formal rental agreements. Visit properties in person and verify all details before committing.</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Disclaimer;
