import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-attachments.vercel.dev"),
  title: "Tu Asistente Educativo 🏫",
  description: "Asistente educativo diseñado para ayudar a estudiantes de diversas edades con sus tareas y dudas académicas.",
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
