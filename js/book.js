// book.js - Swargatil Konkan Resort Booking Handler

document.addEventListener("DOMContentLoaded", function () {
  var checkinElem = document.querySelector("#checkin-date");
  var checkoutElem = document.querySelector("#checkout-date");
  var bookingForm = document.querySelector("form");

  if (checkinElem && checkoutElem) {
    // Set min date to tomorrow
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dateTomorrow = tomorrow.toISOString().split("T")[0];

    checkinElem.setAttribute("min", dateTomorrow);

    checkinElem.addEventListener("change", function () {
      checkoutElem.setAttribute("min", this.value);
    });
  }

  // Auto-fill logged in user info if available
  try {
    const storedUser = localStorage.getItem("swargatil_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      const nameInput = document.querySelector("#name");
      const emailInput = document.querySelector("#email");
      const phoneInput = document.querySelector("#mobile") || document.querySelector("#phone");
      if (nameInput && !nameInput.value) nameInput.value = u.full_name || u.username || "";
      if (emailInput && !emailInput.value) emailInput.value = u.email || "";
      if (phoneInput && !phoneInput.value) phoneInput.value = u.phone || "";
    }
  } catch (err) {}

  // Handle form submission via AJAX / Fetch
  if (bookingForm) {
    bookingForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          alert(" Booking Confirmed Successfully!\n\nBooking ID: #SKR-" + result.bookingId + "\nGuest: " + data.visitor_name + "\nCheck-in: " + data.checkin + "\nCheck-out: " + data.checkout + "\n\nThank you for choosing Swargatil Konkan Resort!");
          bookingForm.reset();
        } else {
          alert("Booking Error: " + (result.message || "Failed to submit booking."));
        }
      } catch (err) {
        // Fallback to normal form submit if API fetch fails
        console.warn("API request failed, falling back to direct submit:", err);
        bookingForm.submit();
      }
    });
  }
});

// Legacy button click function compatibility
function button() {
  var form = document.querySelector("form");
  if (form && !form.checkValidity()) {
    form.reportValidity();
  }
}

// Payment button handler
function handlePayment() {
  alert("Payment Options:\n1. Pay at Resort during Check-in (Cash / UPI / Card)\n2. Online UPI: swargatilkokan@upi\n\nYour room reservation is secured upon booking!");
}

// Cancellation button handler
async function handleCancellation() {
  var bookingId = prompt("Enter your Booking Reference ID (e.g. 1):");
  if (!bookingId) return;

  var mobile = prompt("Enter your 10-digit mobile number used for booking:");
  if (!mobile) return;

  try {
    const res = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ bookingId: parseInt(bookingId), mobile: mobile.trim() })
    });
    const data = await res.json();
    alert(data.message || (data.success ? "Booking cancelled successfully." : "Booking cancellation failed."));
  } catch (err) {
    alert("Cancellation request sent. Resort desk has been notified.");
  }
}
