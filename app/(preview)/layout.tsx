import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

const APP_NAME = "Tu Asistente Educativo 🏫";
const APP_DEFAULT_TITLE = "Tu Asistente Educativo 🏫";
const APP_DESCRIPTION = "Soy tu asistente educativo que te ayudará con tus tareas y dudas académicas.";

export const metadata: Metadata = {
  metadataBase: new URL("https://educational-assistant.vercel.app/"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_DEFAULT_TITLE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_DEFAULT_TITLE,
    },
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: "/icon512_rounded.png",
  }
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
