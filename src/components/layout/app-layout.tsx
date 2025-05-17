"use client";

import type { ReactNode } from "react";
import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import AppSidebarStructure from "@/components/layout/app-sidebar-structure";
import AppHeader from "@/components/layout/app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar collapsible="icon" className="hidden border-r bg-card text-card-foreground md:flex md:flex-col">
        <AppSidebarStructure />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
          <div className="mx-auto w-full max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
      <SidebarRail className="hidden md:flex" />
    </div>
  );
}
