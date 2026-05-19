let musicPlaying = false
const music = document.getElementById('bg-music')

window.addEventListener('load', () => {
    // Initial sweet confetti burst when the page loads!
    launchConfetti()

    // Autoplay music (since user clicked YES to get here, browser policies are satisfied)
    music.volume = 0.3
    music.play().then(() => {
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }).catch(() => {
        // Fallback in case of strict policies
        const playOnInteraction = () => {
            music.play().catch(() => {})
            musicPlaying = true
            document.getElementById('music-toggle').textContent = '🔊'
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('touchstart', playOnInteraction)
        }
        document.addEventListener('click', playOnInteraction)
        document.addEventListener('touchstart', playOnInteraction)
    })
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const duration = 4000
    const end = Date.now() + duration

    // Initial big burst
    confetti({
        particleCount: 100,
        spread: 80,
        origin: { x: 0.5, y: 0.4 },
        colors
    })

    // Continuous side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }

        confetti({
            particleCount: 30,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors
        })

        confetti({
            particleCount: 30,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors
        })
    }, 400)
}

function blowCandle() {
    const flame = document.getElementById('flame')
    const blowInstruction = document.getElementById('blow-instruction')
    
    if (flame.style.display === 'none') return // Already blown
    
    // Extinguish the flame
    flame.style.display = 'none'
    blowInstruction.textContent = "✨ Wish made! ✨"
    
    // Celebration confetti explosion for blowing out the candle!
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { x: 0.5, y: 0.65 },
        colors: ['#ffd700', '#ff69b4', '#ff1493', '#ffc0cb', '#fff']
    })
    
    // Smooth transition to the Love Letter stage
    setTimeout(() => {
        const cakeStage = document.getElementById('cake-stage')
        const letterStage = document.getElementById('letter-stage')
        
        // Fade out cake
        cakeStage.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        cakeStage.style.opacity = '0'
        cakeStage.style.transform = 'scale(0.9)'
        
        setTimeout(() => {
            cakeStage.style.display = 'none'
            
            // Show and fade in letter
            letterStage.style.display = 'block'
            letterStage.style.opacity = '0'
            letterStage.style.transform = 'scale(0.95)'
            
            // Force redraw
            letterStage.offsetHeight 
            
            letterStage.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
            letterStage.style.opacity = '1'
            letterStage.style.transform = 'scale(1)'
            
            // Sparkly star-shower for the letter stage entrance!
            confetti({
                particleCount: 80,
                spread: 120,
                origin: { x: 0.5, y: 0.4 },
                colors: ['#ff85a2', '#ffb3c1', '#ffffff', '#ffd700']
            })
        }, 600)
    }, 1500)
}

function openEnvelope() {
    const envelope = document.getElementById('envelope')
    const sealInstruction = document.getElementById('seal-instruction')
    const envelopeWrapper = document.getElementById('envelope-wrapper')
    
    if (envelope.classList.contains('open')) return // Already open
    
    envelope.classList.add('open')
    if (envelopeWrapper) {
        envelopeWrapper.classList.add('open')
    }
    sealInstruction.style.opacity = '0'
    
    // Magical mini-confetti burst inside the card when she opens it!
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 90,
            spread: 60,
            origin: { x: 0.5, y: 0.55 },
            colors: ['#ff1493', '#ff69b4', '#ffd700', '#fff']
        })
    }, 600)
}

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play().catch(() => {})
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}
