// Cute animated GIFs representing stages of pleading when she clicks 'No'
const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0: Awaiting/Normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1: Confused / Curious
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2: Pleading sweet bear
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3: Pleading sad eyes
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4: Chiikawa crying
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5: Heartbroken
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6: Deeply devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"   // 7: Runaway panic
]

// Playful birthday guilt-trip messages tailored for Arunima (Mona)
const noMessages = [
    "No 🙄",
    "Mona, are you sure? 🤔",
    "Arunima pookie, please... 🥺",
    "But I made a super special surprise for you! 🎁 So please… tell me yes! 🥺💖",
    "I will be so, so sad if you don't look... 😢",
    "Please click Yes??? 💔",
    "Don't break my heart on your birthday! 😭",
    "Last chance, my love! 🥺💖",
    "Haha, you can't catch me! 😜"
]

// Short tags for the No button itself to prevent horizontal stretching
const noBtnTexts = [
    "No 🙄",
    "No 🥺",
    "No 😭",
    "No...",
    "No 😢",
    "No 💔",
    "No 😭",
    "No 🥺",
    "No 😜"
]

// Playful teasing when she tries to click "Yes" immediately without seeing the fun runaway "No" button
const yesTeasePokes = [
    "Wait, try tapping 'No' first... I spent hours making a funny runaway game for you! 😂",
    "Go on, tap 'No' just once... I dare you! 👀",
    "You're missing out on the best part, Mona! 😈",
    "Tapping 'No' is super fun, trust me! 😏"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Restore music state from sessionStorage
const savedMusicPlaying = sessionStorage.getItem('bgMusicPlaying')
const savedMusicTime = sessionStorage.getItem('bgMusicTime')

if (savedMusicPlaying !== null) {
    musicPlaying = savedMusicPlaying === 'true'
}

let timeSynced = false
const syncTime = () => {
    if (timeSynced) return
    if (savedMusicTime !== null) {
        music.currentTime = parseFloat(savedMusicTime)
        timeSynced = true
    }
}

// Try syncing when metadata, canplay, or playing events fire
music.addEventListener('loadedmetadata', syncTime)
music.addEventListener('canplay', syncTime)
music.addEventListener('playing', syncTime)

// Fallback if already loaded
if (music.readyState >= 1) {
    syncTime()
}

// Keep updating saved time as music plays
music.addEventListener('timeupdate', () => {
    if (musicPlaying && !music.paused) {
        sessionStorage.setItem('bgMusicTime', music.currentTime)
    }
})

// Autoplay audio handling: start muted (bypasses browser autoplay policy), then unmute
if (musicPlaying) {
    music.muted = true
    music.volume = 0.3
    music.play().then(() => {
        music.muted = false
    }).catch(() => {
        // Fallback: unmute on first click/touch interaction
        const unmuteHandler = () => {
            music.muted = false
            music.play().catch(() => {})
            document.removeEventListener('click', unmuteHandler)
            document.removeEventListener('touchstart', unmuteHandler)
        }
        document.addEventListener('click', unmuteHandler)
        document.addEventListener('touchstart', unmuteHandler)
    })
} else {
    music.pause()
    document.getElementById('music-toggle').textContent = '🔇'
}

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
        sessionStorage.setItem('bgMusicPlaying', 'false')
    } else {
        music.muted = false
        music.play().catch(() => {})
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
        sessionStorage.setItem('bgMusicPlaying', 'true')
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    
    // Save state exactly before transition
    sessionStorage.setItem('bgMusicTime', music.currentTime)
    sessionStorage.setItem('bgMusicPlaying', musicPlaying ? 'true' : 'false')
    
    // Proceed to the celebration page
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    
    // Update the main prompt text on the screen!
    document.getElementById('prompt-text').textContent = noMessages[msgIndex]
    
    // Update the No button text with a short text so it doesn't stretch!
    noBtn.textContent = noBtnTexts[msgIndex]

    // Scale up the Yes button
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.25}px`
    
    // Scale up padding proportionally with a cap for mobile layout safety
    const padY = Math.min(16 + noClickCount * 4, 45)
    const padX = Math.min(35 + noClickCount * 8, 90)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Change gif state
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Enable runaway flight ONLY on the last step (when we reach the end of noMessages)
    if (noClickCount >= noMessages.length - 1 && !runawayEnabled) {
        runawayEnabled = true
        
        // Add hover & touch event listeners so it runs away when she tries to click it!
        noBtn.addEventListener('mouseover', runAway)
        noBtn.addEventListener('touchstart', runAway, { passive: true })
        
        // Jumps once immediately so she sees it run away!
        runAway()
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function runAway() {
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    
    // Generous safe margins to keep the button well within the visible screen area
    // and away from browser address bars, status bars, and screen edges.
    const marginX = 80
    const marginY = 100
    
    const minX = marginX
    const maxX = window.innerWidth - btnW - marginX
    const minY = marginY
    const maxY = window.innerHeight - btnH - marginY

    // Fallbacks to handle extremely small layouts safely
    const safeMaxX = maxX > minX ? maxX : minX
    const safeMaxY = maxY > minY ? maxY : minY

    const randomX = Math.random() * (safeMaxX - minX) + minX
    const randomY = Math.random() * (safeMaxY - minY) + minY

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '1000'
}
