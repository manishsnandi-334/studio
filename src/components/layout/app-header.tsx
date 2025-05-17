
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AppSidebarStructure from "./app-sidebar-structure"; // For mobile drawer content
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AppHeader() {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  const { toast } = useToast();

  const currentPage = NAV_ITEMS.find(item => {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  });
  const pageTitle = currentPage?.label || APP_NAME;

  const handleVoiceInputCommand = () => {
    // Placeholder for voice input logic
    // In a real app, you'd use Web Speech API here
    toast({
      title: "Voice Input Activated (Placeholder)",
      description: "Listening for commands... (Feature under development)",
      duration: 3000,
    });
    // Example: navigator.mediaDevices.getUserMedia({ audio: true }).then(...)
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      {/* Mobile Sidebar Toggle & Drawer */}
      {isMobile && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setOpenMobile(true)}
            aria-label="Toggle navigation menu"
          >
            <AppLogo className="h-5 w-5" />
          </Button>
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetContent side="left" className="flex flex-col p-0">
              <AppSidebarStructure isMobile={true} />
            </SheetContent>
          </Sheet>
        </>
      )}
      
      {/* Desktop Sidebar Toggle - if needed, usually handled by SidebarRail or direct interaction */}
      {/* <SidebarTrigger className="hidden md:flex" /> */}

      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
      </div>
      
      <Button variant="outline" size="icon" onClick={handleVoiceInputCommand} aria-label="Use voice command">
        <Mic className="h-5 w-5" />
      </Button>
      
      {/* Placeholder for User Menu/Actions */}
      {/* <UserMenu /> */}
    </header>
  );
}
