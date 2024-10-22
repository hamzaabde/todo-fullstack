import daisyui from "daisyui"
import twForms from "@tailwindcss/forms"

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui, twForms],
}
