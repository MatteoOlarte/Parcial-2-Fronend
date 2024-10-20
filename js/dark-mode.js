// Función para cambiar el tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Cambiar el atributo data-bs-theme
  document.documentElement.setAttribute("data-bs-theme", newTheme);

  // Guardar la preferencia en localStorage
  localStorage.setItem("theme", newTheme);
}

// Función para cargar el tema guardado
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  // Si hay un tema guardado, aplicar ese tema
  if (savedTheme) {
      document.documentElement.setAttribute("data-bs-theme", savedTheme);
  }
}

// Cargar el tema guardado al cargar la página
loadTheme();

// Añadir evento al botón para cambiar el tema
// document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);