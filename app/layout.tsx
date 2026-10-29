import type { Metadata } from "next";
import "./globals.css";
import RoleAwareAIHelpdesk from "@/components/RoleAwareAIHelpdesk";
import { LanguageProvider } from "@/context/LanguageContext";
import AccessibilityModal from "@/components/AccessibilityModal";

export const metadata: Metadata = {
  title: "VIDYA-SETU | AICTE – APAAR Student Data Management Platform",
  description:
    "Official APAAR ID-Based Student Data Management and Verification Platform for AICTE-Approved Institutions. Regulation & Approval Bureau, Ministry of Education, Government of India.",
  keywords: ["AICTE", "APAAR", "Student Verification", "National Academic Depository", "VIDYA-SETU"],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                try {
                  new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'hi,en',
                    autoDisplay: false
                  }, 'google_translate_element');
                } catch(e) {}
              }
            `,
          }}
        />
        <script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
      </head>
      <body>
        <div id="google_translate_element" style={{ display: 'none' }} />
        <LanguageProvider>
          {children}
          <RoleAwareAIHelpdesk />
          <AccessibilityModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
