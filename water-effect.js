// Water Touch Effect - Ripple Animation
class WaterEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ripples = [];
        this.maxRipples = 10;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Style the canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        // Set canvas size
        this.resize();
        
        // Add to body
        document.body.appendChild(this.canvas);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // Mouse click
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
        
        // Mouse move (with throttling)
        let lastMove = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMove > 100) { // Throttle to every 100ms
                this.createRipple(e.clientX, e.clientY, 0.5);
                lastMove = now;
            }
        });
        
        // Touch events
        document.addEventListener('touchstart', (e) => {
            for (let touch of e.touches) {
                this.createRipple(touch.clientX, touch.clientY);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let touch of e.touches) {
                this.createRipple(touch.clientX, touch.clientY, 0.5);
            }
        }, { passive: false });
        
        // Resize
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    createRipple(x, y, intensityMultiplier = 1) {
        // Remove oldest ripple if we have too many
        if (this.ripples.length >= this.maxRipples) {
            this.ripples.shift();
        }
        
        this.ripples.push({
            x: x,
            y: y,
            radius: 2,
            maxRadius: 200 * intensityMultiplier,
            opacity: 0.6 * intensityMultiplier,
            speed: 3,
            lineWidth: 5
        });
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const ripple = this.ripples[i];
            
            // Update ripple
            ripple.radius += ripple.speed;
            ripple.opacity -= 0.01;
            
            // Remove if faded out or too big
            if (ripple.opacity <= 0 || ripple.radius > ripple.maxRadius) {
                this.ripples.splice(i, 1);
                continue;
            }
            
            // Draw ripple
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(100, 150, 200, ${ripple.opacity})`;
            this.ctx.lineWidth = ripple.lineWidth;
            this.ctx.stroke();
            
            // Draw inner ripple for more effect
            if (ripple.radius > 10) {
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius - 5, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(150, 200, 255, ${ripple.opacity * 0.5})`;
                this.ctx.lineWidth = ripple.lineWidth - 1;
                this.ctx.stroke();
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WaterEffect();
    });
} else {
    new WaterEffect();
}