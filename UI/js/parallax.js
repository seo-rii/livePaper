let P_toX, P_toY, P_orgX, P_orgY, scale
let back

function setParallax(el, zoom) {
    back = el
    scale = zoom
    P_toX = -scale / 2
    P_toY = -scale / 2
    P_orgX = -scale / 2
    P_orgY = -scale / 2
    back.style.left = '0px'
    back.style.top = '0px'
    back.style.width = (100 + scale) + 'vw'
    back.style.height = (100 + scale) + 'vh'
    requestAnimationFrame(parallax)
    setInterval(() => {
        P_toX = screen.getCursorScreenPoint().x / window.innerWidth * scale - scale
        P_toY = screen.getCursorScreenPoint().y / window.innerWidth * scale - scale
    }, 10)
    parallax()
}

function parallax() {
    let dX = P_toX - P_orgX
    let dY = P_toY - P_orgY
    if (Math.abs(dX) > 1) dX /= 30
    else if (Math.abs(dX) > 0.5) dX /= 25
    else if (Math.abs(dX) > 0.05) dX /= 20
    if (Math.abs(dY) > 1) dY /= 30
    else if (Math.abs(dY) > 0.5) dY /= 25
    else if (Math.abs(dY) > 0.05) dY /= 20
    P_orgX = ((P_orgX + dX))
    P_orgY = ((P_orgY + dY))
    back.style.left = P_orgX + 'vw'
    back.style.top = P_orgY + 'vh'
    requestAnimationFrame(parallax)
}
