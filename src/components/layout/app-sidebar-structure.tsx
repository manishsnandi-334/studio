"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { AppLogo } from '@/components/icons';
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface AppSidebarStructureProps {
  isMobile?: boolean;
}

export default function AppSidebarStructure({ isMobile = false }: AppSidebarStructureProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar(); // For closing mobile drawer on nav

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <AppLogo className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <Separator className="mb-2 group-data-[collapsible=icon]:hidden" />
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isActive = item.segment === null ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={handleLinkClick}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                    className="justify-start"
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* Optional Sidebar Footer */}
      {/* <SidebarFooter className="mt-auto p-4">
        <Button variant="outline" className="w-full group-data-[collapsible=icon]:hidden">
          Settings
        </Button>
      </SidebarFooter> */}
    </>
  );
}
