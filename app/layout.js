import Sidebar from "@/components/Sidebar";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata = {
  title: "Monitoring Banjir IoT Pamekasan",
  description: "Sistem monitoring banjir realtime Kabupaten Pamekasan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen font-['Inter',sans-serif]">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen lg:ml-64 transition-all duration-300 ease-in-out p-4 pt-20 md:p-8 lg:pt-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
