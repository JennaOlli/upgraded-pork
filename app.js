import { Hono } from "https://deno.land/x/hono/mod.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

// Middleware to add security headers
app.use('*', (c, next) => {
  // Prevent MIME sniffing
  c.header('X-Content-Type-Options', 'nosniff');

  // Set a Content Security Policy (CSP) header
  c.header(
    'Content-Security-Policy',
    [
      "default-src 'self'", // Allow content only from the current origin
      "script-src 'self'", // Allow scripts only from the current origin
      "style-src 'self'", // Allow styles only from the current origin
      "img-src 'self' data:", // Allow images from the current origin and data URIs
      "connect-src 'self'", // Allow connections (e.g., AJAX requests) only to the current origin
      "frame-ancestors 'none'", // Disallow framing
      "form-action 'self'", // Allow form submissions only to the current origin
    ].join('; ')
  );

  // Prevent ClickJacking
  c.header('X-Frame-Options', 'DENY');

  return next();
});

// Serve the registration form
app.get('/register', async (c) => {
  const registerForm = await Deno.readTextFile('./views/register.html');
  return c.html(registerForm);
});

// Route for user registration (POST request)
app.post('/register', registerUser);

// Start the app
Deno.serve(app.fetch);

// To run the app, use the following command:
// deno run --allow-net --allow-env --allow-read --watch app.js
