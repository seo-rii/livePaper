class Effect {
    constructor(el, rotateAmount) {
        this.el = el;
        this.isHover = false;
        this.isClicked = false;
        this.el.addEventListener('mouseenter', () => {
            this.isHover = true;
            this.el.classList.remove('--fluent-release');
            if (this.isClicked) this.el.classList.add('--fluent-click');
            this.el.classList.add('--fluent-hover');
        });
        this.el.addEventListener('mouseleave', () => {
            this.isHover = false;
            this.el.classList.remove('--fluent-click');
            if (this.isClicked) this.el.classList.add('--fluent-release');
            this.el.classList.remove('--fluent-hover');
        });
        this.el.addEventListener('mousedown', (e) => {
            this.isClicked = true;
            this.el.classList.add('--fluent-click');
            this.el.classList.remove('--fluent-release');
            let deg = (-e.offsetY / this.el.offsetHeight + 0.5) * 2 * rotateAmount;
            document.documentElement.style.setProperty('--fluent-rotate', `${deg}deg`);
        });
        document.addEventListener('mouseStateChange', (e) => {
            if (e.detail > 0) return;
            if (!this.isClicked) return;
            this.isClicked = false;
            this.el.classList.remove('--fluent-click');
            this.el.classList.add('--fluent-release');
        });
    }
}

exports.Effect = Effect;