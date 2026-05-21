# 🚀 SAMADHAN - Smart Helpdesk Ticketing System
## Detailed Project Report

---

## 📖 Chapter 1: Introduction

### 1.1 Purpose
SAMADHAN is a next-generation, AI-powered IT Support Helpdesk platform designed to streamline internal operations, automated ticket routing, and issue resolution within an organization. It acts as a centralized hub connecting end-users (employees) facing IT issues with the technicians equipped to resolve them, managed and overseen by system administrators.

### 1.2 System Overview
The platform provides a cohesive experience through role-specific dashboards. By integrating modern web technologies with AI capabilities, SAMADHAN goes beyond traditional ticketing systems by offering a self-service AI chatbot, automated email/SMS alerts, and a strict, visually appealing premium dark mode UI.

---

## 🏗️ Chapter 2: System Architecture & Technology Stack

### 2.1 Frontend Architecture (Client-Side)
The frontend is designed to be highly responsive, interactive, and visually striking.
*   **Core Framework:** React 19 built with Vite for lightning-fast HMR (Hot Module Replacement) and optimized production builds.
*   **State & Routing:** React Router v7 is utilized for secure, protected navigation across different role dashboards (`/dashboard`, `/tech-dashboard`, `/admin-dashboard`, `/head-admin-dashboard`).
*   **Styling Engine:** Tailwind CSS v4 is strictly enforced, specifically tailored for a hardcoded dark-mode aesthetic. 
*   **Icons & Animations:** `lucide-react` and `react-icons` for scalable vector iconography, supplemented by AOS (Animate On Scroll) for fluid UI transitions.
*   **API Communication:** Axios is configured with interceptors to manage JWT authorization headers seamlessly.

### 2.2 Backend Architecture (Server-Side)
A robust and secure backend API handles business logic, data persistence, and external service integration.
*   **Runtime & Framework:** Node.js paired with Express.js (v5), utilizing ES Modules for modern syntax.
*   **Database:** MongoDB serves as the NoSQL data store, queried via the Mongoose ODM to enforce schema validation for `Users`, `Tickets`, and `Chats`.
*   **Authentication & Security:** 
    *   `jsonwebtoken` for stateless session management.
    *   `bcrypt`/`bcryptjs` for secure password hashing before database insertion.
*   **Communication Services:**
    *   `nodemailer` for transactional emails (OTPs, password resets, ticket assignments).
    *   `twilio` integrated for potential SMS alert fallbacks.
*   **File Handling:** `multer` middleware handles multipart/form-data for potential ticket attachments.

---

## 👥 Chapter 3: Role-Based Access Control (RBAC)

The system relies on a strict 4-tier hierarchy to maintain security and operational integrity.

### 3.1 Employee (End-User)
*   **Capabilities:** Employees can submit support tickets, track the real-time status of their requests, and interact with the Groq-powered AI chatbot for instant troubleshooting.
*   **Dashboard:** Focuses on user-friendly form submissions and tracking historical data.

### 3.2 Technician
*   **Capabilities:** Technicians receive automated email alerts when a ticket is assigned to them. They can view their specific queue, update ticket states (`Pending` ➡️ `In Progress` ➡️ `Resolved`), and append resolution comments.
*   **Dashboard:** A Kanban-style or list-based view focusing on active workload and SLA management.

### 3.3 Admin
*   **Capabilities:** Admins possess oversight over the entire ticketing lifecycle. They can manually assign or reassign tickets, manage employee/technician accounts, and delete standard users.
*   **Dashboard:** Features data tables, manual assignment overrides, and user management modules.

### 3.4 Head Admin
*   **Capabilities:** The "Super User." Head Admins have exclusive rights to elevate user privileges (e.g., promoting an Employee to a Technician or Admin). They oversee system-wide analytics.
*   **Dashboard:** Comprehensive system analytics, high-level role management, and audit logs.

---

## ⚡ Chapter 4: Core Features & Implementation Details

### 4.1 Intelligent Ticketing Lifecycle
*   **Creation to Resolution:** A ticket is generated via `ticketRoutes.js` and stored in MongoDB. Its state is strictly managed. When a technician resolves a ticket, their `solutionComment` is permanently attached to the ticket schema, providing a historical knowledge base.
*   **External API Integration:** `externalTicketApi.js` suggests the system can ingest or export ticket data to third-party services.

### 4.2 AI Support Chatbot (Groq API)
*   **Implementation:** Handled by `chatbotRoutes.js` on the backend and `Chatbot.jsx` on the frontend.
*   **Functionality:** A floating UI element that intercepts common IT queries. By leveraging Groq's high-speed LLM, the bot attempts to resolve tier-1 issues before a formal ticket is generated, reducing technician workload.

### 4.3 Secure Authentication & OTP Flow
*   **Registration:** New users must verify their identity using a 6-digit Email OTP (generated via `otp-generator` and sent via `nodemailer`) before their account is persisted in the database.
*   **Password Management:** A fully integrated "Forgot Password" flow allows users to securely reset their credentials without admin intervention, relying on short-lived OTP tokens.

### 4.4 Premium UI / UX Design
*   **Glassmorphism:** The frontend utilizes `backdrop-blur` utilities on modals and the floating chatbot to create a layered, modern interface.
*   **Color Theory:** Hardcoded space-dark backgrounds (`#0A0A0F`) contrasted with role-specific accent colors ensure high readability and a premium feel.

---

## 🛡️ Chapter 5: Security Measures

1.  **JWT Protection:** All sensitive routes (`/api/admin/*`, `/api/tickets/*`) are shielded by custom middleware that verifies the structural integrity and expiration of the provided JSON Web Token.
2.  **Role Verification:** Beyond checking if a user is logged in, middleware explicitly checks the `role` payload in the JWT to prevent an Employee from accessing Technician or Admin endpoints.
3.  **Data Sanitization:** Mongoose schemas prevent arbitrary data injection.
4.  **Secure Headers:** Use of CORS ensures the API only accepts requests from the designated frontend origin.

---

## 🚀 Chapter 6: Future Enhancements & Roadmap

To further elevate the SAMADHAN platform, the following features are slated for future releases:

1.  **AI-Driven Ticket Routing:** Upgrading the current manual assignment process to an automated system where the AI analyzes the ticket's contents and assigns it to the most relevant/available technician.
2.  **Real-Time WebSockets:** Implementing `Socket.io` to replace standard HTTP polling, allowing the dashboard to instantly reflect ticket status changes without manual page refreshes.
3.  **SLA (Service Level Agreement) Escalations:** Automated CRON jobs to detect tickets sitting in a `Pending` state for too long, automatically escalating them to an Admin.
4.  **SSO (Single Sign-On):** Integrating Google OAuth (already present in `package.json`) to allow seamless corporate logins.
