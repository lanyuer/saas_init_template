"use client";

import { useState } from "react";
import { Button } from "@saas/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@saas/ui/components/ui/card";
import { Badge } from "@saas/ui/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saas/ui/components/ui/tabs";
import { Separator } from "@saas/ui/components/ui/separator";
import { CreditCard, Download, ExternalLink, Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for side projects",
    features: ["Up to 5 team members", "1,000 API calls/month", "Basic support"],
  },
  {
    name: "Pro",
    price: 29,
    description: "For growing teams",
    features: [
      "Up to 20 team members",
      "100,000 API calls/month",
      "Priority support",
      "Advanced analytics",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "For large organizations",
    features: [
      "Unlimited team members",
      "Unlimited API calls",
      "24/7 dedicated support",
      "Custom SLA",
    ],
  },
];

const billingHistory = [
  { id: "1", date: "Mar 1, 2024", amount: "$29.00", status: "paid", invoice: "INV-001" },
  { id: "2", date: "Feb 1, 2024", amount: "$29.00", status: "paid", invoice: "INV-002" },
  { id: "3", date: "Jan 1, 2024", amount: "$29.00", status: "paid", invoice: "INV-003" },
];

export default function BillingPage() {
  const [currentPlan] = useState("pro");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="method">Payment Method</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the <Badge variant="secondary">Pro Plan</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">$29/month</p>
                    <p className="text-muted-foreground">Next billing date: Apr 1, 2024</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline" className="text-red-600">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>
                  Choose the plan that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={`relative ${
                        plan.popular ? "border-primary shadow-lg" : ""
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={plan.name === currentPlan ? "outline" : "default"}
                          disabled={plan.name === currentPlan}
                        >
                          {plan.name === currentPlan ? "Current Plan" : "Upgrade"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.invoice}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {item.status}
                      </Badge>
                      <p className="font-medium">{item.amount}</p>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="method">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment method for subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-16 bg-slate-100 rounded flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Update</Button>
                  <Button variant="outline">Remove</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage in Stripe Portal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
