import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Monitoring Banjir IoT",
  description: "Dashboard realtime monitoring banjir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
