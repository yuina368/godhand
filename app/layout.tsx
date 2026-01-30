import type { Metadata } from "next";
import { Noto_Serif_JP, Inter } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "手相AI Premium - AI手相占いで運命を知る",
  description: "最新のAI技術で手相を解析。生命線から健康運、活力、長寿度を科学的に分析。プレミアム会員限定で詳細な運勢とアドバイスを提供します。",
  keywords: ["手相", "占い", "AI", "手相占い", "生命線", "運勢", "fortune telling"],
  authors: [{ name: "手相AI" }],
  openGraph: {
    title: "手相AI Premium - AI手相占いで運命を知る",
    description: "最新のAI技術で手相を解析し、あなたの運命を占います",
    type: "website",
    locale: "ja_JP",
    siteName: "手相AI Premium",
  },
  twitter: {
    card: "summary_large_image",
    title: "手相AI Premium",
    description: "AI技術で手相を解析し運命を占う",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
