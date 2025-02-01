export default function DashboardLayout({ children }: Readonly<{
    children: React.ReactNode;}>) {
    return (
      <div>
        <nav>
          <h2>Dashboard Menu</h2>
        </nav>
        <main>{children}</main>
      </div>
    );
  }
  