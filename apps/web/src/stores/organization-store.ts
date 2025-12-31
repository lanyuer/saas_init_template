import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
}

interface OrganizationState {
  currentOrg: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  setCurrentOrg: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  switchOrg: (orgId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      currentOrg: null,
      organizations: [],
      isLoading: true,
      setCurrentOrg: (org) => set({ currentOrg: org }),
      setOrganizations: (orgs) => set({ organizations: orgs }),
      setLoading: (loading) => set({ isLoading: loading }),
      switchOrg: async (orgId: string) => {
        const { organizations } = get();
        const org = organizations.find((o) => o.id === orgId);
        if (org) {
          set({ currentOrg: org });
          // TODO: Call API to update session with new organization
        }
      },
    }),
    {
      name: "organization-storage",
      partialize: (state) => ({
        currentOrg: state.currentOrg,
        organizations: state.organizations,
      }),
    }
  )
);
