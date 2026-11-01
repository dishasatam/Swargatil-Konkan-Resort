# Swargatil Konkan Resort (स्वर्गातील कोंकण रिसॉर्ट)

A full-stack Resort Booking & Hospitality Web Application built with a cleanly organized frontend, a Node.js/Express backend, dual-support PHP scripts, and a MySQL database.

---

## 🏗️ Professional Directory Classification

The project files have been categorized into designated folders:

```
Swargatil Kokan Resort/
│
├── 📂 html/                       # All HTML Pages (Preserved Content & Marathi UI)
│   ├── web.html                   # Resort Homepage (स्वर्गातील कोंकण)
│   ├── Booked.html                # Room Reservation & Cancellation Portal
│   ├── Login.html                 # Login Page (Admin: admin / Admin@123)
│   ├── admin.html                 # Live Operations Admin Dashboard
│   ├── feedback.html              # Customer Reviews & Star Rating Form
│   ├── Contact.html               # Contact & Location details
│   ├── About.html                 # About the Resort
│   ├── Menu.html                  # Authentic Konkani Menu
│   ├── Service.html               # Resort Amenities & Services
│   ├── Gallery.html               # Resort Photo Gallery
│   ├── Culture.html               # Konkan Culture Showcase
│   └── ...                        # Additional gallery & facility pages
│
├── 📂 css/                        # All Cascading Style Sheets
│   ├── style.css                  # Main resort stylesheet
│   ├── book.css                   # Booking form styling
│   ├── login.css                  # Login form styling
│   ├── feedback.css               # Feedback form styling
│   ├── contact.css                # Contact form styling
│   ├── menu.css                   # Menu items styling
│   └── ...                        # Responsive styles & carousel stylesheets
│
├── 📂 js/                         # All JavaScript Files
│   ├── book.js                    # Booking AJAX handler & cancellation
│   ├── login.js                   # Client-side validation & auth handler
│   ├── feedback.js                # Star rating & feedback submission
│   ├── contact.js                 # Contact form submission
│   └── ...                        # Interactive UI & carousel scripts
│
├── 📂 images/                     # All Media Assets (120+ Photos, Logos, Banners)
│   ├── logo3.png                  # Resort logo
│   ├── banner-img.jpg             # Header banner
│   ├── waves.gif                  # Ocean wave animation
│   └── ...                        # Food, room, and scenery images
│
├── 📂 docs/                       # Project Documentation & Diagrams
│   ├── DFD.pptx                   # Data Flow Diagrams
│   ├── project_ER.pdf             # Entity-Relationship diagram
│   └── Kamala College.docx        # College project documentation
│
├── 📂 backend/                    # Backend System Layer
│   ├── config/                    # MySQL connection pool configuration
│   ├── controllers/               # Business logic controllers (booking, feedback, contact, auth)
│   ├── database/                  # MySQL schema (schema.sql) & migration
│   ├── php/                       # Dual-support PHP handlers for XAMPP
│   ├── routes/                    # API routes (/api/bookings, /api/feedbacks, etc.)
│   └── server.js                  # Express web server & static folder resolver
│
├── index.html                     # Root entry point (redirects to html/web.html)
├── booking-form.php               # Standalone PHP form handler
├── package.json                   # Node.js dependencies & scripts
├── .env                           # Environment configuration
└── README.md                      # Project documentation
```

---

## 🗄️ MySQL Database Structure (`swargatil_konkan_db`)

- **`bookings`**: Stores reservation details (guest name, email, phone, check-in, check-out, room type, status).
- **`feedbacks`**: Stores guest reviews and 1–5 star ratings.
- **`contacts`**: Stores customer inquiry messages.
- **`users`**: Manages guest accounts and admin credentials (`admin` / `Admin@123`).

---

## 🚀 Live Preview Links

| Page | Preview URL | Description |
| :--- | :--- | :--- |
| **Resort Website (Home)** | [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/html/web.html](http://localhost:3000/html/web.html) | Main Resort Website (स्वर्गातील कोंकण) |
| **Admin Dashboard** | [http://localhost:3000/html/admin.html](http://localhost:3000/html/admin.html) | Live operations portal with "Back to Website" buttons |
| **Login Portal** | [http://localhost:3000/html/Login.html](http://localhost:3000/html/Login.html) | Admin Login (`admin` / `Admin@123`) or Guest Booking |
| **Room Booking** | [http://localhost:3000/html/Booked.html](http://localhost:3000/html/Booked.html) | Reservation and cancellation page |
| **Guest Feedback** | [http://localhost:3000/html/feedback.html](http://localhost:3000/html/feedback.html) | Guest reviews & ratings saved to MySQL |
| **Contact Page** | [http://localhost:3000/html/Contact.html](http://localhost:3000/html/Contact.html) | Location map & inquiry form saved to MySQL |
| **API Health Check** | [http://localhost:3000/api/health](http://localhost:3000/api/health) | MySQL & server connection status |
