# VetBlade AI Voice Agent Website
## Scraper and Task Repo: https://github.com/akshayakula/blade_scraper


A stunning, interactive website for VetBlade AI Voice Agent featuring beautiful animations, glowing effects, and a black/white color scheme with subtle patriotic accents.

## 🎯 Features

### 🎨 Design
- **Black & White Theme**: Sleek dark background with glowing white text
- **Patriotic Accents**: Subtle hints of blue and red throughout
- **Glowing Effects**: Beautiful white glow effects on text and elements
- **Modern Typography**: Orbitron font for tech feel, Inter for readability
- **Responsive Design**: Works perfectly on all devices

### 📱 Phone Number Focus
- **Animated Digits**: Each digit of +1 (866) 498 5013 has individual animations
- **Interactive Hover**: Digits glow and scale on hover with ripple effects
- **Click to Copy**: Click the phone number to copy to clipboard
- **3D Effects**: Mouse tracking creates subtle 3D movement

### ✨ Animations & Effects
- **Loading Animation**: Smooth fade-in on page load
- **Floating Particles**: Subtle background particle effects
- **Background Elements**: Animated floating dots with parallax scrolling
- **Interactive Cards**: Feature cards with hover animations
- **Call Button**: Gradient animation on click with phone dialing
- **Notifications**: Toast notifications for user feedback

### 🔧 Interactive Features
- **One-Click Calling**: Call button directly initiates phone call
- **Copy to Clipboard**: Click phone number to copy
- **Smooth Scrolling**: Buttery smooth page navigation
- **Performance Optimized**: Reduced animations on slower devices
- **Touch Friendly**: Optimized for mobile interaction

## 📁 File Structure

```
vetblade/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive JavaScript features
└── README.md           # This documentation
```

## 🚀 Getting Started

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **No server required**: Pure vanilla HTML/CSS/JS - works offline
3. **Mobile ready**: Responsive design works on all screen sizes

## 🎨 Color Scheme

- **Primary Black**: `#0a0a0a` - Main background
- **Secondary Black**: `#1a1a1a` - Cards and sections
- **Pure White**: `#ffffff` - Text and glow effects
- **Patriot Blue**: `#1e3a8a` - Subtle accent color
- **Patriot Red**: `#dc2626` - Subtle accent color

## ⚡ Key Interactions

| Element | Interaction | Effect |
|---------|-------------|---------|
| Phone Digits | Hover | Scale up + intense glow + ripple |
| Phone Number | Click | Copy to clipboard + notification |
| Call Button | Click | Initiate phone call + animation |
| Feature Cards | Hover | Lift up + glow effect |
| Phone Frame | Mouse Move | 3D tracking movement |
| Page Load | Auto | Staggered digit animation |

## 🔧 Customization

### Change Phone Number
Edit the phone number in `index.html` around line 43-54:
```html
<div class="phone-number" id="phoneNumber">
    <!-- Update these digits -->
    <span class="phone-digit">+</span>
    <span class="phone-digit">1</span>
    <!-- ... etc -->
</div>
```

### Adjust Colors
Modify CSS variables in `styles.css` at the top:
```css
:root {
    --primary-black: #0a0a0a;
    --patriot-blue: #1e3a8a;
    --patriot-red: #dc2626;
    /* ... etc */
}
```

### Animation Speed
Control animation timing in `styles.css`:
```css
@keyframes digitGlow {
    /* Change duration here */
}
```

## 🌟 Special Features

### Phone Number Animation
- Each digit animates individually on page load
- Staggered animation timing creates wave effect
- Hover effects with ripple animations
- Click effects with scale bounce

### Background Particles
- Floating elements with random movement
- Parallax scrolling effects
- Subtle patriotic color variations
- Performance-optimized rendering

### Notification System
- Success notifications (green theme)
- Calling notifications (patriotic gradient)
- Smooth slide-in/out animations
- Auto-dismiss after 3 seconds

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🔊 Accessibility

- High contrast black/white design
- Large, readable text
- Clear focus indicators
- Semantic HTML structure
- Screen reader friendly

## 📞 Contact Information

**VetBlade AI Voice Agent**
- Phone: +1 (866) 498 5013
- Available 24/7
- AI-powered conversations

## 🚀 Performance

- **Lightweight**: Pure vanilla JS, no frameworks
- **Fast Loading**: Optimized assets and animations
- **Mobile Optimized**: Responsive design patterns
- **Battery Friendly**: Reduced animations on low-power devices

## 🎯 Business Impact

This website serves as a conversion-focused landing page that:
- Immediately highlights the phone number as the primary CTA
- Creates memorable visual experience with animations
- Builds trust with professional, modern design
- Optimizes for mobile-first calling behavior
- Provides instant access to contact the AI agent

---

*Built with ❤️ using vanilla HTML, CSS, and JavaScript*
