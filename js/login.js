// js/login.js - Unified Authentication Handler for Swargatil Konkan Resort

// Global functions for portal and mode switching
function switchPortal(portal) {
  const tabGuest = document.getElementById("tabGuest");
  const tabAdmin = document.getElementById("tabAdmin");
  const guestSection = document.getElementById("guestSection");
  const adminSection = document.getElementById("adminSection");
  hideAlert();

  if (portal === "admin") {
    tabAdmin.classList.add("active");
    tabGuest.classList.remove("active");
    adminSection.style.display = "block";
    guestSection.style.display = "none";
    document.getElementById("adminUser").focus();
  } else {
    tabGuest.classList.add("active");
    tabAdmin.classList.remove("active");
    guestSection.style.display = "block";
    adminSection.style.display = "none";
    document.getElementById("guestUser").focus();
  }
}

function toggleGuestMode(mode) {
  const modeLoginBtn = document.getElementById("modeLoginBtn");
  const modeRegisterBtn = document.getElementById("modeRegisterBtn");
  const guestLoginForm = document.getElementById("guestLoginForm");
  const guestRegisterForm = document.getElementById("guestRegisterForm");
  const guestHeaderTitle = document.getElementById("guestHeaderTitle");
  const guestHeaderSubtitle = document.getElementById("guestHeaderSubtitle");
  hideAlert();

  if (mode === "register") {
    modeRegisterBtn.classList.add("active");
    modeLoginBtn.classList.remove("active");
    guestRegisterForm.style.display = "block";
    guestLoginForm.style.display = "none";
    guestHeaderTitle.innerText = "Guest Registration";
    guestHeaderSubtitle.innerText = "Create an account to manage bookings and preferences";
    document.getElementById("regFullName").focus();
  } else {
    modeLoginBtn.classList.add("active");
    modeRegisterBtn.classList.remove("active");
    guestLoginForm.style.display = "block";
    guestRegisterForm.style.display = "none";
    guestHeaderTitle.innerText = "Guest Sign In";
    guestHeaderSubtitle.innerText = "Access your bookings and exclusive resort privileges";
    document.getElementById("guestUser").focus();
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

function showAlert(message, type = "error") {
  const alertBox = document.getElementById("authAlert");
  if (!alertBox) return;
  alertBox.className = `auth-alert ${type}`;
  alertBox.innerHTML = `<i class="fa ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;
  alertBox.style.display = "flex";
}

function hideAlert() {
  const alertBox = document.getElementById("authAlert");
  if (alertBox) alertBox.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  // Check URL query parameters (e.g. ?portal=admin or ?mode=register)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("portal") === "admin") {
    switchPortal("admin");
  } else if (urlParams.get("mode") === "register") {
    toggleGuestMode("register");
  }

  // 1. Handle Guest Login
  const guestLoginForm = document.getElementById("guestLoginForm");
  if (guestLoginForm) {
    guestLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideAlert();

      const submitBtn = document.getElementById("guestLoginSubmitBtn");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Signing In...';

      const uname = document.getElementById("guestUser").value.trim();
      const psw = document.getElementById("guestPassword").value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ uname, psw, portal: "guest" })
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("swargatil_user", JSON.stringify(data.user));
          showAlert(data.message || "Login successful! Opening resort website...", "success");
          setTimeout(() => {
            window.location.href = data.redirectUrl || "web.html";
          }, 700);
        } else {
          showAlert(data.message || "Invalid credentials. Please verify and try again.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (err) {
        console.error("Login request error:", err);
        showAlert("Server connection failed. Please ensure the server is running.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 2. Handle Guest Registration
  const guestRegisterForm = document.getElementById("guestRegisterForm");
  if (guestRegisterForm) {
    guestRegisterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideAlert();

      const submitBtn = document.getElementById("guestRegisterSubmitBtn");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Registering Account...';

      const full_name = document.getElementById("regFullName").value.trim();
      const username = document.getElementById("regUsername").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const password = document.getElementById("regPassword").value;

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ full_name, username, email, phone, password })
        });

        const data = await response.json();

        if (data.success) {
          // Do not auto-login or redirect to booking form. Open login tab directly.
          guestRegisterForm.reset();
          toggleGuestMode('login');
          showAlert("Registration successful! Please sign in with your credentials to continue.", "success");
          
          const userInput = document.getElementById("guestUser");
          if (userInput) {
            userInput.value = username;
          }
          const pswInput = document.getElementById("guestPassword");
          if (pswInput) {
            pswInput.value = "";
            pswInput.focus();
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        } else {
          showAlert(data.message || "Registration could not be completed.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (err) {
        console.error("Registration request error:", err);
        showAlert("Unable to connect to the registration service.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 3. Handle Admin Login
  const adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideAlert();

      const submitBtn = document.getElementById("adminLoginSubmitBtn");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Authenticating Admin...';

      const uname = document.getElementById("adminUser").value.trim();
      const psw = document.getElementById("adminPassword").value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ uname, psw, portal: "admin" })
        });

        const data = await response.json();

        if (data.success && data.user && data.user.role === "admin") {
          localStorage.setItem("swargatil_admin", JSON.stringify(data.user));
          localStorage.setItem("swargatil_user", JSON.stringify(data.user));
          showAlert(data.message || "Admin authentication confirmed. Opening Operations Portal...", "success");
          setTimeout(() => {
            window.location.href = data.redirectUrl || "admin.html";
          }, 800);
        } else {
          showAlert(data.message || "Access denied. Valid staff credentials required.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (err) {
        console.error("Admin login error:", err);
        showAlert("Failed to connect to authentication server.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});
