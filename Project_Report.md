# 🚀 SAMADHAN - Smart Helpdesk Ticketing System
## Comprehensive Project Report

---

## 📌 1. Project Overview
**SAMADHAN** is a next-generation, AI-powered IT Support Helpdesk platform designed to streamline internal operations, ticket routing, and issue resolution. Built with scalability and security in mind, the platform provides distinct dashboard interfaces for Employees, Technicians, System Admins, and Head Admins. The entire interface operates on a forced **Premium Dark Mode** aesthetic for guaranteed visual consistency and reduced eye strain.

---

## 🛠️ 2. Technology Stack
**Frontend Architecture:**
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS (Strict Dark Mode Enforcement)
*   **Icons:** Lucide React
*   **HTTP Client:** Axios
*   **Routing:** React Router v6

**Backend Architecture:**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB via Mongoose
*   **Authentication:** JWT (JSON Web Tokens), Bcryptjs for hashing
*   **Email Services:** Nodemailer (For OTPs and Technician Alerts)

**AI Integration:**
*   **LLM Provider:** Groq API (Used for the interactive AI Support Assistant)

---

## 👥 3. Role-Based Access Control (RBAC)
SAMADHAN strictly enforces authorization across four distinct roles:

1.  **Employee (End-User):**
    *   Can create support tickets.
    *   Can view the status of their own active and historical tickets.
    *   Has access to the AI chatbot for automated troubleshooting.
2.  **Technician:**
    *   Receives automated email alerts upon ticket assignment.
    *   Can view and manage their queue of assigned tickets.
    *   Can update ticket statuses (`Pending`, `In Progress`, `Resolved`) and add resolution comments.
3.  **Admin:**
    *   Has full oversight over all users (except other Admins/Head Admins) and tickets.
    *   Can manually assign tickets to specific technicians.
    *   Can create new Employee or Technician accounts.
    *   Can delete standard user accounts.
4.  **Head Admin:**
    *   The highest privilege tier in the system.
    *   Can promote standard users to Admin or Technician roles.
    *   Can view all system analytics and securely manage the platform's core user base.

---

## ✨ 4. Key Features & Implementation Highlights

### 🎨 Premium Dark UI System
The entire platform underwent a massive visual overhaul, migrating away from system-dependent CSS variables to strict, hardcoded Tailwind utility classes. 
*   **Color Palette:** Deep space backgrounds (`#0A0A0F`), interactive cards (`#16161E`), and highly distinct role-based accent colors (Orange/Amber for primary UI, Purple for Head Admin, Green for success states).
*   **Glassmorphism & Glows:** Implementation of radial CSS gradients and backdrop-blur effects to simulate depth and provide a premium, modern feel.
*   **Animation System:** Reusable `@keyframes` (`fadeUp`, `scaleIn`, `fadeIn`) were integrated directly into the global CSS for smooth modal transitions and page loads.
*   **CSS Specificity Fixes:** Enforced Tailwind's important modifiers (`!pl-11`) to prevent external stylesheet overrides on intricate UI elements.

### 🤖 Floating AI Support Agent
*   A persistent, floating chatbot available to end-users, powered by Groq's fast LLM capabilities.
*   The UI features typing indicators, quick-action suggestion chips, and dynamic link parsing (e.g., providing links to Password Reset manuals).
*   The chatbot window utilizes `backdrop-blur` for a transparent, glass-like overlay on top of the dashboard.

### 🔐 Secure Authentication Flow
*   **OTP Verification:** Signup flows mandate a 6-digit Email OTP verification step before account activation, effectively mitigating spam.
*   **Password Resets:** Fully integrated "Forgot Password" flow with OTP validation and secure password hashing.
*   **Token Expiration:** JWTs secure all API endpoints, seamlessly integrated via Axios interceptors or local headers.

### 🎫 Intelligent Ticket Management
*   **State Tracking:** Tickets move through predefined states. Resolution comments are securely attached and displayed to the end-user.
*   **Manual Override:** Admins possess a dropdown interface to override automated routing and assign specific technicians, instantly updating the database and triggering a notification email to the assigned tech.

---

## 📈 5. Future Roadmap & Scalability
While SAMADHAN V2.0 is fully functional, future iterations can introduce:
1.  **Full AI Routing:** Replacing the manual admin assignment with an AI model that reads the ticket description and auto-assigns it to the technician with the lightest load and matching skill set.
2.  **WebSockets:** Migrating from standard HTTP fetching to WebSockets (e.g., Socket.io) for real-time, live-updating dashboards without the need for manual refreshes.
3.  **SLA Tracking:** Automated timers that escalate tickets if they remain `Pending` past a specific Service Level Agreement (SLA) timeframe.
