import { Hono } from "https://deno.land/x/hono/mod.ts";
import { registerUser } from "./routes/register.js"; // Import register logic

const app = new Hono();

// Serve the registration form
app.get('/register', async (c) => {
  const registerForm = await Deno.readTextFile('./views/register.html');
  return c.html(registerForm);
});

// Route for user registration (POST request)
app.post('/register', registerUser);
Deno.serve(app.fetch);

// To run the app, use the following command:
// deno run --allow-net --allow-env --allow-read --watch app.js