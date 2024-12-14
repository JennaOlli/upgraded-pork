import { Hono } from "https://deno.land/x/hono/mod.ts"; // Import Hono framework
import { loginUser } from "./routes/login.js"; // Import login logic
import { registerUser } from "./routes/register.js"; // Import registration logic
import { serveStatic } from "https://deno.land/x/hono/middleware.ts"; // Import static file middleware
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"; // Import bcrypt for password hashing

// Create the Hono app
const app = new Hono();

// Middleware to add security headers
app.use('*', async (c, next) => {
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

  await next();
});

// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root:'.'}));

// Serve registration page
app.get('/register', async (c) => {
  try {
    const html = await Deno.readTextFile('./views/register.html');
    return c.html(html); // Serve register.html
  } catch (err) {
    console.error("Error reading register.html:", err);
    return c.text('Error loading registration page', 500);
  }
});

// Handle user registration
app.post('/register', async (c) => {
  try {
    return await registerUser(c); // Call the imported registerUser function
  } catch (err) {
    console.error("Error in registration:", err);
    return c.text('Registration error', 500);
  }
});

// Serve login page
app.get('/login', async (c) => {
  try {
    const html = await Deno.readTextFile('./views/login.html');
    return c.html(html); // Serve login.html
  } catch (err) {
    console.error("Error reading login.html:", err);
    return c.text('Error loading login page', 500);
  }
});

// Handle user login
app.post('/login', async (c) => {
  try {
    return await loginUser(c); // Call the imported loginUser function
  } catch (err) {
    console.error("Error in login:", err);
    return c.text('Login error', 500);
  }
});

// Start the server
Deno.serve({ port: 3000 }, app.fetch);
console.log('Server running on http://localhost:3000');
