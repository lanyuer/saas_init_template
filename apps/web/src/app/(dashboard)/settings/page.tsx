"use client";

import { useState } from "react";
import { Button } from "@saas/ui/components/ui/button";
import { Input } from "@saas/ui/components/ui/input";
import { Label } from "@saas/ui/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saas/ui/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saas/ui/components/ui/tabs";
import { Separator } from "@saas/ui/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@saas/ui/components/ui/avatar";
import { Badge } from "@saas/ui/components/ui/badge";
import { Upload, Save, Key, Bell, Shield, Building2 } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "My Company",
  });

  const handleSave = () => {
    // TODO: Save profile changes
    console.log("Saving profile:", profile);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and organization settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Manage your organization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-lg bg-primary flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">My Organization</h3>
                  <p className="text-muted-foreground">my-organization</p>
                  <Badge variant="secondary" className="mt-2">
                    Pro Plan
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Organization Slug</Label>
                  <Input id="slug" value="my-organization" disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <setting.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{setting.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Email</Label>
                      <input
                        type="checkbox"
                        defaultChecked={setting.email}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label className="text-sm">Push</Label>
                      <input
                        type="checkbox"
                        defaultChecked={setting.push}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </div>
                <Button>
                  <Key className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const notificationSettings = [
  {
    id: "team",
    title: "Team Activity",
    description: "When team members join or leave",
    icon: Bell,
    email: true,
    push: true,
  },
  {
    id: "billing",
    title: "Billing Updates",
    description: "Payment receipts and subscription changes",
    icon: Bell,
    email: true,
    push: false,
  },
  {
    id: "security",
    title: "Security Alerts",
    description: "Login attempts and password changes",
    icon: Shield,
    email: true,
    push: true,
  },
];
