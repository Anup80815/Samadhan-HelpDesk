// src/utils/theme.js — SAMADHAN always uses dark theme

export const applyStoredTheme = () => {
  // Always force dark mode — SAMADHAN is a dark-themed app
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
};

// Keep for compatibility but always sets dark
export const toggleTheme = () => {
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
};
