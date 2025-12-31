"use client";

import { useEffect, useState } from "react";
import { authClient } from "@saas/auth/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saas/ui/components/ui/card";
import { Button } from "@saas/ui/components/ui/button";
import { Badge } from "@saas/ui/components/ui/badge";
import {
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session) {
          setUser(session.user);
        }
        // TODO: Fetch organization data from API
        setOrganization({ id: "1", name: "My Organization", slug: "my-org" });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const stats = [
    {
      name: "Total Members",
      value: "12",
      icon: Users,
      change: "+2 this month",
      changeType: "positive",
    },
    {
      name: "Active Now",
      value: "8",
      icon: Activity,
      change: "+3 today",
      changeType: "positive",
    },
    {
      name: "Subscription",
      value: "Pro Plan",
      icon: CreditCard,
      change: "Renews in 15 days",
      changeType: "neutral",
    },
  ];

  const recentActivity = [
    { user: "John Doe", action: "joined the team", time: "2 hours ago" },
    { user: "Jane Smith", action: "created a new project", time: "5 hours ago" },
    { user: "Mike Johnson", action: "uploaded files", time: "Yesterday" },
    { user: "Sarah Wilson", action: "updated settings", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your organization.
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Last 30 days
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : ""
                  }
                >
                  {stat.change}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest activity from your team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Organization info */}
      {organization && (
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>
              Manage your organization settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">
                    {organization.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{organization.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.slug}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Pro Plan</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
