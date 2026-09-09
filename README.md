# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Contact Form Setup (EmailJS)

The contact form uses [EmailJS](https://www.emailjs.com) to send messages
straight to your Gmail inbox without needing a backend server.

1. Create a free account at https://www.emailjs.com
2. **Email Services** -> Add New Service -> connect your Gmail account -> copy the **Service ID**
3. **Email Templates** -> Create New Template. Use these variable names so they match the form field `name` attributes: `{{name}}`, `{{email}}`, `{{subject}}`, `{{message}}`. Set the "To email" in the template to your Gmail address. Copy the **Template ID**
4. **Account** -> **General** -> copy your **Public Key**
5. Copy `.env.example` to `.env` and fill in the three values:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```
6. Restart `npm run dev` after adding/changing `.env`
7. For production (Vercel/Netlify), add the same three variables in the
   host's Environment Variables settings so the live site can send email too.

The form includes a hidden honeypot field for basic spam protection and
shows a "reply within 24 hours" note plus a success/error status message
after submission.
