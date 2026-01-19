import { Layout } from "@/components/layout/Layout";

const Terms = () => (
  <Layout>
    <section className="py-12 md:py-16 bg-gradient-warm">
      <div className="container-section">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: January 2024</p>
      </div>
    </section>
    <section className="py-12">
      <div className="container-section max-w-4xl">
        <div className="bg-card p-8 rounded-2xl shadow-soft border border-border space-y-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground">By accessing RenTelMe, you agree to be bound by these terms. If you disagree, please do not use our services.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">User Responsibilities</h2>
            <p className="text-muted-foreground">Users must provide accurate information, not misuse the platform, and respect other users' privacy and property rights.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Listing Guidelines</h2>
            <p className="text-muted-foreground">All property listings must be accurate and truthful. We reserve the right to remove listings that violate our guidelines.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground">RenTelMe is a platform connecting renters and property owners. We are not responsible for disputes between parties.</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
