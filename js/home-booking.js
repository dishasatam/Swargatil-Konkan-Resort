// js/home-booking.js - Homepage Resort Booking Form Handler

document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("homeBookingForm");
    const checkinElem = document.getElementById("b_checkin");
    const checkoutElem = document.getElementById("b_checkout");
    const submitBtn = document.getElementById("homeBookSubmitBtn");

    // 1. Min Date Setup: Minimum check-in is tomorrow
    if (checkinElem && checkoutElem) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        checkinElem.setAttribute("min", tomorrowStr);

        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        const dayAfterStr = dayAfter.toISOString().split("T")[0];
        checkoutElem.setAttribute("min", dayAfterStr);

        checkinElem.addEventListener("change", function () {
            if (this.value) {
                const checkinDate = new Date(this.value);
                const nextDay = new Date(checkinDate);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split("T")[0];
                checkoutElem.setAttribute("min", nextDayStr);
                if (checkoutElem.value && checkoutElem.value <= this.value) {
                    checkoutElem.value = nextDayStr;
                }
            }
        });
    }

    // 2. Auto-fill logged-in guest data from localStorage if available
    try {
        const stored = localStorage.getItem("swargatil_user");
        if (stored) {
            const user = JSON.parse(stored);
            const nameField = document.getElementById("b_name");
            const emailField = document.getElementById("b_email");
            const phoneField = document.getElementById("b_mobile");
            if (nameField && !nameField.value) nameField.value = user.full_name || user.username || "";
            if (emailField && !emailField.value) emailField.value = user.email || "";
            if (phoneField && !phoneField.value) phoneField.value = user.phone || "";
        }
    } catch (e) {
        console.warn("Storage read error:", e);
    }

    // 3. Handle Form Submission
    if (bookingForm) {
        bookingForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing Reservation...';

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
                    alert(
                        "🎉 RESERVATION CONFIRMED!\n\n" +
                        "Booking Reference: #SKR-" + result.bookingId + "\n" +
                        "Guest: " + data.visitor_name + "\n" +
                        "Room: " + (data.room_preference || "Standard") + "\n" +
                        "Check-in: " + data.checkin + "\n" +
                        "Check-out: " + data.checkout + "\n" +
                        "Guests: " + data.total_adults + " Adult(s), " + (data.total_children || 0) + " Child(ren)\n\n" +
                        "Thank you for choosing Swargatil Konkan Resort! We look forward to welcoming you."
                    );
                    bookingForm.reset();
                } else {
                    alert("Booking Notice: " + (result.message || "Could not complete reservation."));
                }
            } catch (err) {
                console.warn("API submission error, falling back to form POST:", err);
                bookingForm.submit();
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
});
