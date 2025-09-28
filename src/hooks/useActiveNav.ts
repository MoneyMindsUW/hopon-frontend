"use client";

import { usePathname } from "next/navigation";

export default function useActiveNav() {
  const pathname = usePathname();

  const activeNav = (href: string) => {
    return pathname === href;
  };

  return { activeNav };
}
