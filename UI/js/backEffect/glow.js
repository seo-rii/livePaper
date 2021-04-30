let animCTX, stars = [], animCanvas

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyStarEffect(count) {
    animCanvas = document.getElementById('effect')
    animCTX = animCanvas.getContext('2d')
    animCanvas.width = animCanvas.offsetWidth;
    animCanvas.height = animCanvas.offsetHeight;
    let colorrange = [0, 60, 240]
    while (stars.length < count) {
        let x = Math.random() * animCanvas.offsetWidth, y = Math.random() * animCanvas.offsetHeight,
            radius = Math.random() * 1.2, hue = colorrange[getRandom(0, colorrange.length - 1)],
            sat = getRandom(50, 100)
        stars.push({
            'x': x,
            'y': y,
            'radius': radius,
            'hue': hue,
            'sat': sat,
            'speed': Math.random() * 5,
            'alpha': Math.random() * 255,
            'maxAlpha': Math.random() * 100 + 155,
            'minAlpha': Math.random() * 100
        })
    }
    requestAnimationFrame(starGlowEffectInterval)
}

function starGlowEffectInterval() {
    animCTX.clearRect(0, 0, animCanvas.offsetWidth, animCanvas.offsetHeight);
    for (let i of stars) {
        i.alpha += i.speed
        if (i.alpha < i.minAlpha) {
            i.alpha = i.minAlpha
            i.speed *= -1
        }
        if (i.alpha > i.maxAlpha) {
            i.alpha = i.maxAlpha
            i.speed *= -1
        }
        animCTX.beginPath()
        animCTX.arc(i.x, i.y, i.radius, 0, 360)
        animCTX.fillStyle = `hsla(${i.hue}, ${i.sat}%, 88%, ${i.alpha / 255})`
        animCTX.fill()
    }
    requestAnimationFrame(starGlowEffectInterval)
}
