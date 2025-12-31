import { authClient } from "@saas/auth/client";
import { useEffect, useState } from "react";

export function useOrganization() {
  const { data: organization, isPending } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  const switchOrganization = async (orgId: string) => {
    await authClient.setActiveOrganization({ organizationId: orgId });
  };

  return {
    organization,
    organizations,
    isLoading: isPending,
    switchOrganization,
  };
}

