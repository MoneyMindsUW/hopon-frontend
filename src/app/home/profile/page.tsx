"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";

export default function ProfilePage() {
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
            <h1 className="text-lg font-semibold">Profile</h1>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">User Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Name
                        </label>
                        <p className="text-lg">John Doe</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Email
                        </label>
                        <p className="text-lg">john.doe@example.com</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Member Since
                        </label>
                        <p className="text-lg">January 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">
                      Account Stats
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Posts
                        </label>
                        <p className="text-2xl font-bold">42</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Followers
                        </label>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Following
                        </label>
                        <p className="text-2xl font-bold">567</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Activity</h2>
                <div className="bg-card p-6 rounded-lg border">
                  <p className="text-muted-foreground">
                    Your recent activity and posts will appear here.
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
