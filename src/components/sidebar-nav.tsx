"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, User, Settings, Compass } from "lucide-react";

const sidebarItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Explore",
    url: "/home/explore",
    icon: Compass,
  },
  {
    title: "Profile",
    url: "/home/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/home/settings",
    icon: Settings,
  },
];

export function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();

  // Debug: Log the sidebar state
  console.log("Sidebar state:", state);

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        {state === "expanded" && (
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => handleNavigation(item.url)}
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <item.icon className="h-4 w-4" />
                  {state === "expanded" && <span>{item.title}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
