# Personal Portfolio

A modern developer portfolio built with TanStack Start, React, Tailwind CSS, Supabase, and Resend.

## Description

This project showcases projects, experience, skills, and a contact form.  
Portfolio content (projects and experience) is loaded from Supabase, and contact form submissions are stored in Supabase with optional email notifications sent via Resend.

## Features

- Dynamic projects and experience sections from Supabase
- Responsive UI with animations
- Contact form with validation
- Message persistence in `messages` table
- Optional email alerts for new contact submissions

## Tech Stack

- TanStack Start / TanStack Router
- React + TypeScript
- Tailwind CSS
- Supabase (database + API)
- Resend (email notifications)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Fill `.env` values with your Supabase and Resend credentials.

4. Run development server:

```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## Security Note

Do not commit `.env` to Git. Keep secrets in local env files or your deployment platform secrets manager.
