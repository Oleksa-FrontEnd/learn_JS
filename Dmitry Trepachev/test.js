class Rectangle {
    constructor(width, height) {
        this.elem = document.createElement('div');

        this.setWidth(width);
        this.setHeight(height);
        this.elem.style.border = '2px solid red';

        document.body.appendChild(this.elem);
    }
    setWidth(width) {
        this.elem.style.width = width + 'px';
    }
    getWidth() {
        return parseInt(this.elem.style.width);
    }
    setHeight(height) {
        this.elem.style.height = height + 'px';
        this.elem.style.border = '5px solid green';
    }
    getHeigth() {
        return parseInt(this.elem.style.height);
    }
}

let elem = new Rectangle (100, 150);
elem.setWidth(450);
alert(elem.getWidth());
alert(elem.getHeigth());
elem.setHeight(500);
alert(elem.getHeigth());
let elem2 = new Rectangle (200, 250);

