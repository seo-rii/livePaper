class Parallax {
    constructor(el, scale) {
        this.el = el
        this.scale = scale
        this.P_toX = -scale / 2
        this.P_toY = -scale / 2
        this.P_orgX = -scale / 2
        this.P_orgY = -scale / 2
        this.el.style.left = '0px'
        this.el.style.top = '0px'
        this.el.style.width = (100 + scale) + 'vw'
        this.el.style.height = (100 + scale) + 'vh'
        setInterval(() => {
            this.P_toX = screen.getCursorScreenPoint().x / window.innerWidth * scale - scale
            this.P_toY = screen.getCursorScreenPoint().y / window.innerWidth * scale - scale
        }, 10)
        requestAnimationFrame(() => this.parallax_intv())
    }

    parallax_intv() {
        let dX = this.P_toX - this.P_orgX
        let dY = this.P_toY - this.P_orgY
        if (Math.abs(dX) > 1) dX /= 30
        else if (Math.abs(dX) > 0.5) dX /= 25
        else if (Math.abs(dX) > 0.05) dX /= 20
        if (Math.abs(dY) > 1) dY /= 30
        else if (Math.abs(dY) > 0.5) dY /= 25
        else if (Math.abs(dY) > 0.05) dY /= 20
        this.P_orgX = ((this.P_orgX + dX))
        this.P_orgY = ((this.P_orgY + dY))
        this.el.style.left = this.P_orgX + 'vw'
        this.el.style.top = this.P_orgY + 'vh'
        requestAnimationFrame(() => this.parallax_intv())
    }
}
