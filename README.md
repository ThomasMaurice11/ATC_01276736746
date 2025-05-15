🛠️ Event Booking App — Backend This is the backend API for the Event Booking Web Application. It handles authentication, event management, and booking operations.

🌐 Live Backend URL => http://areebtask.somee.com/swagger/index.html

🚀 Features 🖥️ Deployed on Somee.com 📁 Image upload support 🌍 Multi-language ready responses (EN / AR) 🔐 JWT-based authentication 👤 User roles: Admin & User 🎫 Event booking API 📅 Event management API (CRUD for Admins)

🛠️ Technologies Used ASP.NET Core 9 Entity Framework SQL Server JWT (JSON Web Token) for authentication Swagger for API documentation

✅ Key API Endpoints Overview

🔐 Authentication (/api/Auth) POST /RegisterUser – Register a regular user. POST /RegisterAdmin – Register an admin user. POST /login – Login with credentials.

📅 Events (/api/Events) GET / – Retrieve all events. POST / – Create an event (multipart/form-data; includes Date, Venue, and ImageFile). POST /{eventId}/translations – Add translations to an event. GET /{id} – Retrieve a specific event by ID. PUT /{id} – Update an event by ID (multipart form). DELETE /{id} – Delete an event by ID. PUT /UpdateTranslations/{id} – Update translations for an event.

📆 Bookings (/api/Booking) POST / – Book an event by passing eventId as a query param. DELETE /{id} – Cancel booking by ID.
