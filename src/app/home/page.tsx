"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Home Dashboard</h1>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              {/* Home Dashboard Section */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Welcome to your Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </h3>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Revenue
                    </h3>
                    <p className="text-2xl font-bold">$45,678</p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Orders
                    </h3>
                    <p className="text-2xl font-bold">567</p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Growth
                    </h3>
                    <p className="text-2xl font-bold">+12.5%</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <div className="bg-card p-6 rounded-lg border">
                  <p className="text-muted-foreground">
                    Your recent activity and updates will appear here.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
