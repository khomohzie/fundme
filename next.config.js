/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
};

module.exports = {
	nextConfig,
	experimental: {
		// Enables the styled-components SWC transform
		styledComponents: true,
	},
};
