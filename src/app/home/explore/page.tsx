"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";

export default function ExplorePage() {
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
            <h1 className="text-lg font-semibold">Explore</h1>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Discover New Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">
                      Trending Topics
                    </h3>
                    <p className="text-muted-foreground">
                      Explore the latest trending topics and discussions.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Recommended</h3>
                    <p className="text-muted-foreground">
                      Personalized recommendations based on your interests.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Categories</h3>
                    <p className="text-muted-foreground">
                      Browse content by categories and topics.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Featured Content</h2>
                <div className="bg-card p-6 rounded-lg border">
                  <p className="text-muted-foreground">
                    Featured content and highlights will appear here.
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
