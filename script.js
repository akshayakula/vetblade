// VetBlade Military Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Phone number animation and interaction
    const phoneDigits = document.querySelectorAll('.phone-digit');
    const phoneNumber = document.getElementById('phoneNumber');
    const callButton = document.getElementById('callButton');
    
    // Enhanced military-style digit animation on load
    function animateDigitsOnLoad() {
        phoneDigits.forEach((digit, index) => {
            setTimeout(() => {
                digit.style.transform = 'scale(1.3) translateY(-8px)';
                digit.style.textShadow = '0 0 80px rgba(37, 99, 235, 1), 0 0 40px rgba(255, 255, 255, 0.8)';
                digit.style.background = 'rgba(37, 99, 235, 0.4)';
                
                setTimeout(() => {
                    digit.style.transform = 'scale(1) translateY(0)';
                    digit.style.textShadow = '0 0 40px rgba(255, 255, 255, 0.5), 0 0 20px rgba(37, 99, 235, 0.8)';
                    digit.style.background = 'rgba(37, 99, 235, 0.1)';
                }, 400);
            }, index * 120);
        });
    }
    
    // Trigger military load animation 
    setTimeout(animateDigitsOnLoad, 1200);
    
    // Military-themed phone number hover effects
    phoneDigits.forEach((digit, index) => {
        digit.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) translateY(-8px)';
            this.style.textShadow = '0 0 100px rgba(37, 99, 235, 1), 0 0 60px rgba(255, 255, 255, 1)';
            this.style.background = 'rgba(37, 99, 235, 0.4)';
            this.style.borderRadius = '6px';
            
            // Create military ripple effect
            createMilitaryRipple(this);
        });
        
        digit.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.textShadow = '0 0 40px rgba(255, 255, 255, 0.5), 0 0 20px rgba(37, 99, 235, 0.8)';
            this.style.background = 'rgba(37, 99, 235, 0.1)';
        });
        
        // Military click effect
        digit.addEventListener('click', function() {
            this.style.transform = 'scale(0.85)';
            this.style.background = 'rgba(255, 215, 0, 0.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.background = 'rgba(37, 99, 235, 0.1)';
                }, 150);
            }, 100);
        });
    });
    
    // Create military-themed ripple effect
    function createMilitaryRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'military-ripple';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(37, 99, 235, 0.4), transparent)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'militaryRipple 0.8s linear';
        ripple.style.pointerEvents = 'none';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }
    
    // Add military ripple animation to CSS dynamically
    const militaryStyle = document.createElement('style');
    militaryStyle.textContent = `
        @keyframes militaryRipple {
            to {
                transform: translate(-50%, -50%) scale(2.5);
                opacity: 0;
            }
        }
        .military-ripple {
            z-index: -1;
        }
        .phone-digit {
            position: relative;
        }
    `;
    document.head.appendChild(militaryStyle);
    
    // Phone number click to copy functionality
    phoneNumber.addEventListener('click', function() {
        const phoneText = '+1 (866) 498 5013';
        navigator.clipboard.writeText(phoneText).then(() => {
            showMilitaryNotification('📋 CONTACT NUMBER SECURED TO CLIPBOARD', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = phoneText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showMilitaryNotification('📋 CONTACT NUMBER SECURED TO CLIPBOARD', 'success');
        });
    });
    
    // Military call button functionality
    callButton.addEventListener('click', function() {
        // Create military calling animation
        this.style.transform = 'scale(0.92)';
        this.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(30, 58, 138, 0.6))';
        this.style.boxShadow = '0 0 30px rgba(37, 99, 235, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.3)';
        
        setTimeout(() => {
            this.style.transform = 'scale(1.02)';
            this.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(53, 94, 59, 0.3))';
            this.style.boxShadow = 'var(--tactical-shadow)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        }, 200);
        
        // Trigger secure phone call
        window.location.href = 'tel:+18664985013';
        
        // Show military calling notification
        showMilitaryNotification('🔗 ESTABLISHING SECURE CONNECTION TO VETBLADE COMMAND', 'calling');
    });
    
    // Military notification system
    function showMilitaryNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `military-notification ${type}`;
        notification.textContent = message;
        
        // Military notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'calling' ? 
                'linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(30, 58, 138, 0.8))' : 
                'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(0, 0, 0, 0.8))',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            border: `2px solid ${type === 'calling' ? '#ffd700' : '#2563eb'}`,
            boxShadow: '0 0 25px rgba(37, 99, 235, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.4s ease',
            fontWeight: '600',
            fontSize: '13px',
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(10px)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in with military precision
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 4000);
    }
    
    // Enhanced military floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add tactical movement patterns
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 30;
            const randomY = (Math.random() - 0.5) * 30;
            const rotation = Math.random() * 360;
            
            element.style.transform += ` translate(${randomX}px, ${randomY}px) rotate(${rotation}deg)`;
            
            setTimeout(() => {
                element.style.transform = element.style.transform.replace(/ translate\([^)]+\)/g, '');
            }, 2000);
        }, 4000 + index * 1500);
    });
    
    // Military parallax scrolling effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = element.dataset.speed || 1;
            const yPos = -(scrolled * speed * 0.15);
            const rotation = scrolled * 0.1;
            element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
    });
    
    // Enhanced mouse interaction with military phone frame
    const phoneFrame = document.querySelector('.military-frame');
    
    phoneFrame.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        const rotateX = moveY * 0.05;
        const rotateY = moveX * 0.05;
        
        this.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        this.style.boxShadow = 'var(--tactical-shadow), 0 0 30px rgba(37, 99, 235, 0.4)';
    });
    
    phoneFrame.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0) rotateX(0) rotateY(0) scale(1)';
        this.style.boxShadow = 'var(--tactical-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    });
    
    // Military cards tactical hover interaction
    const militaryCards = document.querySelectorAll('.military-card');
    
    militaryCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.03)';
            this.style.boxShadow = '0 0 40px rgba(37, 99, 235, 0.6), var(--tactical-shadow)';
            
            // Add tactical scan line effect
            const scanLine = document.createElement('div');
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, #00ff00, transparent);
                animation: tacticalScan 1s ease-out;
            `;
            this.appendChild(scanLine);
            
            setTimeout(() => scanLine.remove(), 1000);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--tactical-shadow)';
        });
    });
    
    // Add tactical scan animation
    const tacticalStyle = document.createElement('style');
    tacticalStyle.textContent = `
        @keyframes tacticalScan {
            0% { left: -100%; opacity: 0; }
            50% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
        }
    `;
    document.head.appendChild(tacticalStyle);
    
    // Mission stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalText = target.textContent;
                
                if (finalText === '24/7') {
                    animateStatText(target, ['0/0', '12/3', '24/7']);
                } else if (finalText === '100%') {
                    animateStatCounter(target, 0, 100, '%');
                } else if (finalText === '∞') {
                    animateStatText(target, ['0', '999+', '∞']);
                }
                
                statObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => statObserver.observe(stat));
    
    function animateStatCounter(element, start, end, suffix = '') {
        let current = start;
        const increment = Math.ceil((end - start) / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current + suffix;
        }, 30);
    }
    
    function animateStatText(element, textArray) {
        let index = 0;
        const timer = setInterval(() => {
            element.textContent = textArray[index];
            index++;
            if (index >= textArray.length) {
                clearInterval(timer);
            }
        }, 300);
    }
    
    // Add mission status blinking
    const missionStatus = document.querySelector('.mission-status');
    if (missionStatus) {
        setInterval(() => {
            missionStatus.style.opacity = missionStatus.style.opacity === '0.4' ? '1' : '0.4';
        }, 2000);
    }
    
    // Enhanced particle system with military elements
    function createMilitaryParticle() {
        const particle = document.createElement('div');
        const particleTypes = ['●', '▲', '♦', '✦', '◆'];
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        
        particle.textContent = type;
        particle.className = 'military-particle';
        particle.style.position = 'fixed';
        particle.style.fontSize = '8px';
        particle.style.color = 'rgba(37, 99, 235, 0.6)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.fontWeight = 'bold';
        
        // Random position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        // Random animation
        const animationDuration = 4000 + Math.random() * 3000;
        particle.style.animation = `militaryParticleFloat ${animationDuration}ms linear`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, animationDuration);
    }
    
    // Add military particle animation to CSS
    const militaryParticleStyle = document.createElement('style');
    militaryParticleStyle.textContent = `
        @keyframes militaryParticleFloat {
            from {
                transform: translateY(0) rotate(0deg) scale(0.5);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: scale(1);
            }
            90% {
                opacity: 0.8;
            }
            to {
                transform: translateY(-100vh) rotate(720deg) scale(0.3);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(militaryParticleStyle);
    
    // Create military particles periodically
    setInterval(createMilitaryParticle, 3000);
    
    // Add military-style loading animation
    function addMilitaryLoadingAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1.5s ease';
        
        // Add tactical loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = 'INITIALIZING VETBLADE SYSTEMS...';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #2563eb;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            z-index: 10000;
            text-shadow: 0 0 20px rgba(37, 99, 235, 0.8);
        `;
        document.body.appendChild(loadingDiv);
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            setTimeout(() => {
                loadingDiv.remove();
            }, 1500);
        }, 500);
    }
    
    addMilitaryLoadingAnimation();
    
    // Performance optimization for military devices
    if (navigator.hardwareConcurrency <= 2) {
        document.documentElement.style.setProperty('--reduced-motion', '1');
        const heavyAnimations = document.querySelectorAll('.floating-element');
        heavyAnimations.forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    console.log('📞 Secure Line: +1 (866) 498 5013');
    console.log('🎯 Mission Status: READY TO SERVE');

    // Show Rucksack section when CTA clicked
    const showBtn = document.getElementById('showRucksackBtn');
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            const section = document.getElementById('rucksackSection');
            if (section) {
                section.classList.remove('hidden');
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add navigation for the View Rucksack button
    const viewBtn = document.getElementById('viewRucksackBtn');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            window.location.href = 'rucksack.html';
        });
    }

}); 