// feedback.js - Swargatil Konkan Resort Feedback Submission

document.addEventListener("DOMContentLoaded", function () {
  const feedbackForm = document.getElementById("feedbackForm") || document.querySelector("form");
  const alertBox = document.getElementById("feedbackAlert");

  function showFeedbackAlert(msg, type = "success") {
    if (alertBox) {
      alertBox.className = `feedback-alert ${type}`;
      alertBox.innerHTML = `<i class="fa ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${msg}</span>`;
      alertBox.style.display = "flex";
      alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      alert(msg);
    }
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = feedbackForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting Feedback...';
      }

      const formData = new FormData(feedbackForm);
      const data = Object.fromEntries(formData.entries());

      // Find checked star
      const selectedStar = document.querySelector('input[name="star"]:checked');
      data.star = selectedStar ? selectedStar.value : "5";

      try {
        const response = await fetch("/api/feedbacks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          showFeedbackAlert("Thank you for sharing your experience! Your valuable feedback has been recorded.", "success");
          feedbackForm.reset();
        } else {
          showFeedbackAlert(result.message || "Failed to submit feedback. Please try again.", "error");
        }
      } catch (err) {
        console.warn("Feedback API request error:", err);
        showFeedbackAlert("Connection to the feedback server failed. Please try again.", "error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
});
