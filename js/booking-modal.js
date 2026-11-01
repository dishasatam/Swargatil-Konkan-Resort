// js/booking-modal.js - Interactive Booking & Guest Authentication Gateway

// State
let currentModalGateTab = 'login';

function getLoggedInGuest() {
    try {
        const stored = localStorage.getItem("swargatil_user");
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Storage parse error:", e);
    }
    return null;
}

// Open Booking Modal
function handleBookNowClick(e) {
    if (e && e.preventDefault) e.preventDefault();
    const guest = getLoggedInGuest();
    const modalOverlay = document.getElementById("bookingModalOverlay");
    const authGateView = document.getElementById("modalAuthGate");
    const bookingFormView = document.getElementById("modalBookingFormView");

    if (!modalOverlay) return;

    if (!guest) {
        // Not logged in -> Show Authentication Gate
        if (authGateView) authGateView.style.display = "block";
        if (bookingFormView) bookingFormView.style.display = "none";
        switchGateTab('login');
    } else {
        // Logged in -> Show Reservation Form with prefilled guest data
        if (authGateView) authGateView.style.display = "none";
        if (bookingFormView) bookingFormView.style.display = "block";
        populateGuestBookingFields(guest);
    }

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close Modal
function closeBookingModal() {
    const modalOverlay = document.getElementById("bookingModalOverlay");
    if (modalOverlay) {
        modalOverlay.classList.remove("active");
    }
    document.body.style.overflow = "";
}

// Switch between Login and Register in the Auth Gate
function switchGateTab(tab) {
    currentModalGateTab = tab;
    const tabLoginBtn = document.getElementById("gateTabLogin");
    const tabRegBtn = document.getElementById("gateTabReg");
    const gateLoginForm = document.getElementById("gateLoginForm");
    const gateRegForm = document.getElementById("gateRegForm");
    const alertBox = document.getElementById("gateAlert");

    if (alertBox) alertBox.style.display = "none";

    if (tab === 'register') {
        if (tabRegBtn) tabRegBtn.classList.add("active");
        if (tabLoginBtn) tabLoginBtn.classList.remove("active");
        if (gateRegForm) gateRegForm.style.display = "block";
        if (gateLoginForm) gateLoginForm.style.display = "none";
    } else {
        if (tabLoginBtn) tabLoginBtn.classList.add("active");
        if (tabRegBtn) tabRegBtn.classList.remove("active");
        if (gateLoginForm) gateLoginForm.style.display = "block";
        if (gateRegForm) gateRegForm.style.display = "none";
    }
}

// Populate guest fields once authenticated
function populateGuestBookingFields(guest) {
    const guestNameDisplay = document.getElementById("modalGuestNameDisplay");
    const nameInput = document.getElementById("m_visitor_name");
    const emailInput = document.getElementById("m_email");
    const phoneInput = document.getElementById("m_mobile");

    if (guestNameDisplay) {
        guestNameDisplay.innerText = guest.full_name || guest.username;
    }
    if (nameInput) {
        nameInput.value = guest.full_name || guest.username || "";
    }
    if (emailInput) {
        emailInput.value = guest.email || "";
    }
    if (phoneInput) {
        phoneInput.value = guest.phone || "";
    }
}

// Show alert inside gate
function showGateAlert(msg, type = "error") {
    const alertBox = document.getElementById("gateAlert");
    if (!alertBox) return;
    alertBox.className = `gate-alert ${type}`;
    alertBox.innerHTML = `<i class="fa ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${msg}`;
    alertBox.style.display = "block";
}

// Guest Logout handler
function logoutGuest() {
    localStorage.removeItem("swargatil_user");
    localStorage.removeItem("swargatil_admin");
    updateHeaderUserPill();
    // Switch modal back to auth gate if open
    const authGateView = document.getElementById("modalAuthGate");
    const bookingFormView = document.getElementById("modalBookingFormView");
    if (authGateView && bookingFormView) {
        authGateView.style.display = "block";
        bookingFormView.style.display = "none";
        switchGateTab('login');
    }
}

// Sync header dynamically with logged-in user
function updateHeaderUserPill() {
    const guest = getLoggedInGuest();
    const headerActions = document.querySelector(".header-actions");
    if (!headerActions) return;

    if (guest) {
        // If guest is logged in, show personalized greeting and logout
        headerActions.innerHTML = `
            <span class="header-user-pill" title="${guest.full_name || guest.username}">
                <i class="fa fa-user-circle" style="color:#e0ac1c;"></i> ${guest.full_name || guest.username}
            </span>
            <button class="box" type="button" onclick="logoutGuest()" style="background:#555; color:#fff; font-size:13px; padding:6px 12px;">Logout</button>
            <a href="feedback.html"><button class="box box-feedback" type="button">Feedback</button></a>
            <a href="admin.html"><button class="box box-admin" type="button" style="margin-left: 2px;">Admin</button></a>
        `;
    } else {
        headerActions.innerHTML = `
            <a href="Login.html?mode=login"><button class="box box-login" type="button"><i class="fa fa-user"></i> Login</button></a>
            <a href="Login.html?mode=register"><button class="box box-register" type="button"><i class="fa fa-user-plus"></i> Register</button></a>
            <a href="feedback.html"><button class="box box-feedback" type="button">Feedback</button></a>
            <a href="admin.html"><button class="box box-admin" type="button" style="margin-left: 4px;">Admin</button></a>
        `;
    }
}

// Setup & Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    updateHeaderUserPill();

    // Auto-open booking modal if requested via URL query (?openBooking=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("openBooking") === "true") {
        setTimeout(handleBookNowClick, 200);
    }

    // Setup minimum date logic on checkin/checkout
    const checkin = document.getElementById("m_checkin");
    const checkout = document.getElementById("m_checkout");

    if (checkin && checkout) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        checkin.setAttribute("min", tomorrowStr);

        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        const dayAfterStr = dayAfter.toISOString().split("T")[0];
        checkout.setAttribute("min", dayAfterStr);

        checkin.addEventListener("change", function () {
            if (this.value) {
                const nextDate = new Date(this.value);
                nextDate.setDate(nextDate.getDate() + 1);
                const nextDateStr = nextDate.toISOString().split("T")[0];
                checkout.setAttribute("min", nextDateStr);
                if (checkout.value && checkout.value <= this.value) {
                    checkout.value = nextDateStr;
                }
            }
        });
    }

    // Modal Background Click Closes Modal
    const modalOverlay = document.getElementById("bookingModalOverlay");
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) {
                closeBookingModal();
            }
        });
    }

    // 1. Handle Inline Gate Login
    const gateLoginForm = document.getElementById("gateLoginForm");
    if (gateLoginForm) {
        gateLoginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const submitBtn = gateLoginForm.querySelector("button[type='submit']");
            const orig = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Authenticating...';

            const uname = document.getElementById("gateLoginUser").value.trim();
            const psw = document.getElementById("gateLoginPsw").value;

            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ uname, psw, portal: "guest" })
                });
                const data = await res.json();

                if (data.success && data.user) {
                    localStorage.setItem("swargatil_user", JSON.stringify(data.user));
                    updateHeaderUserPill();
                    showGateAlert("Authenticated! Loading booking form...", "success");

                    setTimeout(() => {
                        document.getElementById("modalAuthGate").style.display = "none";
                        document.getElementById("modalBookingFormView").style.display = "block";
                        populateGuestBookingFields(data.user);
                    }, 600);
                } else {
                    showGateAlert(data.message || "Invalid credentials. Please verify your details.");
                }
            } catch (err) {
                showGateAlert("Could not connect to authentication server.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = orig;
            }
        });
    }

    // 2. Handle Inline Gate Registration
    const gateRegForm = document.getElementById("gateRegForm");
    if (gateRegForm) {
        gateRegForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const submitBtn = gateRegForm.querySelector("button[type='submit']");
            const orig = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Creating Account...';

            const full_name = document.getElementById("gateRegName").value.trim();
            const username = document.getElementById("gateRegUser").value.trim();
            const email = document.getElementById("gateRegEmail").value.trim();
            const phone = document.getElementById("gateRegPhone").value.trim();
            const password = document.getElementById("gateRegPsw").value;

            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ full_name, username, email, phone, password })
                });
                const data = await res.json();

                if (data.success && data.user) {
                    gateRegForm.reset();
                    switchGateTab('login');
                    showGateAlert("Registration successful! Please enter your password to sign in.", "success");
                    
                    const loginUserInput = document.getElementById("gateLoginUser");
                    if (loginUserInput) {
                        loginUserInput.value = username;
                    }
                    const loginPswInput = document.getElementById("gateLoginPsw");
                    if (loginPswInput) {
                        loginPswInput.value = "";
                        loginPswInput.focus();
                    }
                } else {
                    showGateAlert(data.message || "Registration could not be completed.");
                }
            } catch (err) {
                showGateAlert("Connection to registration service failed.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = orig;
            }
        });
    }

    // 3. Handle Reservation Form Submission inside Modal
    const modalReservationForm = document.getElementById("modalReservationForm");
    if (modalReservationForm) {
        modalReservationForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById("modalBookSubmitBtn");
            const orig = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Confirming Reservation...';

            const formData = new FormData(modalReservationForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (result.success) {
                    // Show confirmation inside modal
                    const bookingFormView = document.getElementById("modalBookingFormView");
                    bookingFormView.innerHTML = `
                        <div style="text-align: center; padding: 25px 10px;">
                            <div style="font-size: 58px; color: #2e7d32; margin-bottom: 12px;">
                                <i class="fa fa-circle-check"></i>
                            </div>
                            <h2 style="font-family:'Playfair Display', serif; font-size:30px; color:#1e1b20; margin-bottom:8px;">Reservation Confirmed!</h2>
                            <p style="font-size:16px; color:#555; margin-bottom:20px;">Thank you <strong>${data.visitor_name}</strong> for booking your stay with Swargatil Konkan Resort.</p>
                            
                            <div style="background:#fdf8eb; border:1px solid #e0ac1c; border-radius:12px; padding:18px; text-align:left; max-width:440px; margin:0 auto 25px;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px dashed #dcd0b3; padding-bottom:6px;">
                                    <span style="color:#777;">Booking Reference:</span>
                                    <strong style="color:#a51d24;">#SKR-${result.bookingId}</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                    <span style="color:#777;">Room Category:</span>
                                    <strong>${data.room_preference}</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                                    <span style="color:#777;">Check-in:</span>
                                    <strong>${data.checkin}</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:#777;">Check-out:</span>
                                    <strong>${data.checkout}</strong>
                                </div>
                            </div>

                            <button type="button" class="modal-submit-btn" onclick="closeBookingModal()" style="max-width:240px; margin:0 auto;">
                                Done & Close
                            </button>
                        </div>
                    `;
                } else {
                    alert("Booking Error: " + (result.message || "Failed to submit booking."));
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = orig;
                }
            } catch (err) {
                console.error("Booking error:", err);
                alert("Failed to connect to reservation server.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = orig;
            }
        });
    }
});
