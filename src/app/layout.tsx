import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Using Geist font from original scaffold
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "@/components/layout/app-layout";
import { APP_NAME } from '@/lib/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Intelligent Web Suite for Manufacturing Units - Udyog Sahayak helps streamline operations for small-scale manufacturing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <AppLayout>{children}</AppLayout>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
