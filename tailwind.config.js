module.exports = {
  content: ["./*.html", "./components/**/*.html"],
  theme: {
    extend: {
      keyframes: {
        heroDrift: {
          "0%, 100%": { transform: "scale(1.02) translateY(0)" },
          "50%": { transform: "scale(1.08) translateY(-1%)" },
        },
        cardEnter: {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shapeDrift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -0.75rem, 0) rotate(4deg)" },
        },
      },
      animation: {
        "hero-drift": "heroDrift 24s ease-in-out infinite",
        "card-enter": "cardEnter 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "shape-drift": "shapeDrift 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}