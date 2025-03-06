import '../../app/globals.css';

export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function AuthRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header id="auth-header">
          <p>Welcome back!</p>
          <form action="">
            <button>Logout</button>
          </form>
        </header>
        {children}
      </body>
    </html>
  );
}
