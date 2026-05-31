// === Live Image Preview (for Edit form) ===
function updatePreview(url) {
  const img = document.getElementById("previewImage");
  if (img)
    img.src =
      url || "https://placehold.co/600x400?text=No+Image";
}

// === Unified Form Validation + Animated Alerts ===
(function () {
  "use strict";

  // Choose whichever form exists on the page
  const form =
    document.getElementById("listingForm") ||
    document.getElementById("reviewForm") ||
    document.getElementById("editListingForm");
  if (!form) return;

  const alertContainer = document.getElementById("alert-container");
  const alertBox = document.getElementById("alert-message");
  const alertText = document.getElementById("alert-text");

  function showAlert(type, message) {
    if (!alertContainer || !alertBox || !alertText) return;
    alertBox.classList.remove("alert-success", "alert-danger", "fade", "show");
    alertBox.classList.add(`alert-${type}`, "fade");
    alertText.textContent = message;
    alertContainer.style.display = "block";
    // small delay to kick CSS transition
    setTimeout(() => alertBox.classList.add("show"), 50);
    // auto hide
    setTimeout(() => {
      alertBox.classList.remove("show");
      setTimeout(() => {
        const bs = bootstrap.Alert.getOrCreateInstance(alertBox);
        bs.close();
        alertContainer.style.display = "none";
      }, 300);
    }, 3000);
  }

  // === Special handling for review dropdown ===
  let hiddenInput = null;
  if (form.id === "reviewForm") {
    hiddenInput = document.getElementById("selectRating");
    const dropdownButton = document.getElementById("ratingDropdown");
    const dropdownItems =
      dropdownButton.nextElementSibling.querySelectorAll(".dropdown-item");

    // Update hidden input and button text when a rating is selected
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function () {
        const value = this.getAttribute("data-value");
        hiddenInput.value = value;

        // Update button style and text
        dropdownButton.textContent = this.textContent;
        dropdownButton.classList.remove("btn-light", "text-start");
        dropdownButton.classList.add(
          "btn-primary",
          "text-white",
          "text-center"
        );

        // Remove invalid styling if any
        hiddenInput.classList.remove("is-invalid");
      });
    });
  }

  form.addEventListener(
    "submit",
    function (event) {
      // Always add validation class so invalid fields show
      form.classList.add("was-validated");

      // Check if review form hidden input is selected
      if (hiddenInput && hiddenInput.value === "") {
        event.preventDefault();
        event.stopPropagation();
        hiddenInput.classList.add("is-invalid");
        showAlert(
          "danger",
          "⚠️ Please select a rating before submitting your review."
        );
        return;
      }

      // Check overall form validity
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        showAlert(
          "danger",
          "⚠️ Please check the entire form carefully and fix all errors."
        );
        return;
      }

      // Form is valid
      event.preventDefault(); // temporarily stop submission to show alert
      if (form.id === "listingForm") {
        showAlert("success", "✅ Listing created successfully! Saving...");
      } else if (form.id === "reviewForm") {
        showAlert("success", "✅ Review submitted successfully!");
      } else {
        showAlert("success", "✅ Listing updated successfully! Saving...");
      }

      // short delay so user sees the message
      setTimeout(() => {
        form.classList.remove("was-validated");
        window.requestAnimationFrame(() => form.submit());
      }, 700);
    },
    false
  );
})();
