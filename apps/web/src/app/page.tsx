import Link from "next/link";
import { Button } from "@saas/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saas/ui/components/ui/card";
import { Badge } from "@saas/ui/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="font-bold text-xl">SaaS Template</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            Enterprise-grade SaaS Template
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Build your SaaS faster with<br />
            <span className="text-primary">production-ready</span> code
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A complete monorepo template with authentication, multi-tenancy,
            payments, and notifications. Built with Next.js, Turborepo, and Shadcn/UI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg">Start Building</Button>
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">View on GitHub</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pre-built components and integrations that would take weeks to build from scratch.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">
              Start free, upgrade when you're ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit mb-2">Most Popular</Badge>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-semibold">SaaS Template</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Turborepo, and Shadcn/UI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Multi-Tenancy",
    description: "Built-in organization management with roles, permissions, and team invitations.",
    icon: <div className="h-5 w-5 rounded bg-primary" />,
  },
  {
    title: "Payments",
    description: "Stripe integration with subscriptions, billing history, and customer portal.",
    icon: <div className="h-5 w-5 rounded bg-primary" />,
  },
  {
    title: "Notifications",
    description: "In-app and email notifications with user preferences and templates.",
    icon: <div className="h-5 w-5 rounded bg-primary" />,
  },
  {
    title: "Authentication",
    description: "Secure authentication with email/password and OAuth providers.",
    icon: <div className="h-5 w-5 rounded bg-primary" />,
  },
  {
    title: "Type Safety",
    description: "End-to-end type safety with TypeScript and shared types across packages.",
    icon: <div className="h-5 w-5 rounded bg-primary" />,
  },
  {
    title: "Modern UI",
    description: "Beautiful, accessible components built with Shadcn/UI and Tailwind CSS.",
    icon: <div className="h-5 w-5 rounded bg-primary" />,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for side projects",
    price: "0",
    features: ["Up to 5 team members", "1,000 API calls/month", "Basic support", "Community features"],
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing teams",
    price: "29",
    features: ["Up to 20 team members", "100,000 API calls/month", "Priority support", "Advanced analytics", "Custom integrations"],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "99",
    features: ["Unlimited team members", "Unlimited API calls", "24/7 dedicated support", "Custom SLA", "On-premise deployment", "SSO & SAML"],
    popular: false,
  },
];
