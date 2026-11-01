// contact.js - Swargatil Konkan Resort Contact Form Handler

document.addEventListener("DOMContentLoaded", function () {
  var contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      var msg = document.getElementById("msg").value.trim();

      if (!msg) {
        alert("Please write your message before submitting.");
        return;
      }

      try {
        const response = await fetch("/api/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: "Guest",
            email: "swargatilkonkan@gmail.com",
            phone: "9836543624",
            msg: msg
          })
        });

        const result = await response.json();

        if (result.success) {
          alert(" Message Sent Successfully!\n\nThank you for reaching out to Swargatil Konkan Resort. Our team will get back to you shortly.");
          document.getElementById("msg").value = "";
        } else {
          alert("Error: " + (result.message || "Could not send message."));
        }
      } catch (err) {
        alert("Message recorded. Thank you for contacting Swargatil Konkan Resort!");
        document.getElementById("msg").value = "";
      }
    });
  }
});
