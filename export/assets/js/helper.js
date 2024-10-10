export function showSuccessMessage() {
  const message = document.getElementById("success-message");
  message.style.display = "block"; // Display the message

  // Fade out and hide the message after 2 seconds
  setTimeout(() => {
    message.style.opacity = "0"; // Fade out
    setTimeout(() => {
      message.style.display = "none"; // Hide after fading out
      message.style.opacity = "1"; // Reset opacity
    }, 1000); // Time to fade out
  }, 2000); // Show for 2 seconds
}
