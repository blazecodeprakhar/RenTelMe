import { Layout } from "@/components/layout/Layout";

const PrivacyPolicy = () => (
  <Layout>
    <section className="py-12 md:py-16 bg-gradient-warm">
      <div className="container-section">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 2024</p>
      </div>
    </section>
    <section className="py-12">
      <div className="container-section max-w-4xl prose prose-slate">
        <div className="bg-card p-8 rounded-2xl shadow-soft border border-border space-y-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Information We Collect</h2>
            <p className="text-muted-foreground">We collect information you provide directly, including name, email, phone number, and property details when you use our services.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground">Your information is used to provide and improve our services, communicate with you, and ensure platform security. We never share personal information without consent.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Data Security</h2>
            <p className="text-muted-foreground">We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-navy mb-3">Contact Us</h2>
            <p className="text-muted-foreground">For privacy-related questions, contact us at privacy@rentelme.com</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
