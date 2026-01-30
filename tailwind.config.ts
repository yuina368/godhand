import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                serif: ['var(--font-noto-serif-jp)'],
            },
            colors: {
                'luxury-purple': '#6B46C1',
                'luxury-purple-dark': '#553C9A',
                'luxury-gold': '#D4AF37',
                'deep-navy': '#0F0F23',
                'soft-white': '#F8F8FF',
            },
            backgroundImage: {
                'premium-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4E5A0 100%)',
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                glow: 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    from: {
                        boxShadow: '0 0 20px rgba(103, 126, 234, 0.4)',
                    },
                    to: {
                        boxShadow: '0 0 40px rgba(103, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6)',
                    },
                },
            },
        },
    },
    plugins: [],
};

export default config;
