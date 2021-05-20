class Sticker {
    constructor(parent, key, id, zIndexer) {
        this._elem = document.createElement('textarea');
        this._elem.classList = 'sticker';

        this._parent = parent;
        this._parent.appendChild(this._elem);

        this._zIndexer = zIndexer;
         
        this._initRelocation();
        this._initRemove();
        this._initRemove();
        this._initAtopState();

        this._watchSize();
        this._watchText();

        this._stock = new Stock(key, id);
    }

    create(w, h, x, y) {
        this._setW(w);
        this._setH(h);
        this._setX(x);
        this._setY(y);
        this._setText(" ");
        //в момент создания поверх всех
        this._setMaxZ();
    }
    restore(data) {
        this._setW(data.w);
        this._setH(data.h);
        this._setX(data.x);
        this._setY(data.y);
        this._setZ(data.z);

        this._setText(data.text);
    }
    _save() {
        let data = {
            x: this._getX(),
            y: this._getY(),
            z: this._getZ(),
            w: this._getW(),
            h: this._getH(),
            text: this._getText(),           
        };
        this._stock.save(data);
    }
    //установить ширину
    _setW(value) {
        this._w = value;
        this._elem.style.width = value + "px";

        this._save(); //cохраняем в локальное хранилище
    }
    //получить ширину
    _getW() {
        return this._w;
    }

    _setH(value) {
        this._h = value;
        this._elem.style.height = value + "px";

        this._save();
    }
    _getH() {
        return this._h;
    }

    //установить координаты по оси X
    _setX(value) {
        this._x = value;
        this._elem.style.left = value + "px";

        this._save();
    }
    //получить координаты по оси X
    _getX() {
        return this._x;
    }

    _setY(value) {
        this._y = value;
        this._elem.style.top = value + "px";

        this._save();
    }
    _getY() {
        return this._y;
    }
    //самый верхний стикер тот у которого zIndex больше
    _setZ(value) {
        this._z = value;
        this._elem.style.zIndex = value;

        this._save();
    }
    //прочитываем с элемента
    getZ() {
        return this._z;
      //return parseInt(this._elem.style.zIndex);
    }
    //установить текст в textarea
    _setText(text) {
        this._text = text;
        this._elem.value = text;

        this._save();
    }
    _getText() {
        return this._text;
    }
    //установить макс zIndex
    _setMaxZ() {
        let maxZ = this._zIndexer.getMaxZ();
        //если макс zIndex не равен текущему
        if(maxZ !== this._getZ() || maxZ === 0 ) {
            this._setZ(maxZ + 1);
        }
    }
    //отслеживаем изменения размера стикера (resize не работает)
    _watchSize() {
        this.elem.addEventListener('mouseup', () => {
            let newWidth = parseInt(this._elem.clientWidth);
            let newHeight = parseInt(this._elem.clientHeight);

            if (newWidth !== this._getW()){
                this._setW(newWidth);
            }
            if (newHeight !== this._getH()){
                this._setH(newHeight);
            }
        });
    }
    //отслеживаем изменения текста и меняем текст при потери фокуса если текст изменился 
    _watchText() {       
        this._elem.addEventListener('blur', () => {
            let newText = this._elem.value;

            if (newText !== this._getText()) {
                this._setText(newText)
            }
        });
    }
    //поверх всех при клике или перетаскивании
    _initAtopState() {
        this._elem.addEventListener('click', () => {
            this._setMaxZ();
        });
        this._elem.addEventListener('dragstar', () => {
            this._setMaxZ();
        });
    }
    //удаления стикера колесиком mouse
    _initRemove() {
        this._elem.addEventListener('mousedown', event => {
            if(event.which == 2) {
                this._parent.removeChild(this._elem);
                event.preventDefault();

                this._stock.remove();
            }
        });
    }
    //перемещение элемента
    _initRelocation() {
        this._elem.draggable = true; //разрешение элементу быть "перетягиваемым"

        let correctionX = 0;
        let correctionY = 0;

        this._elem.addEventListener('dragstart', event => {
            correctionX = this._getX() - event.pageX;
            correctionY = this._getY() - event.pageY;
        });
        this._elem.addEventListener('dragend', event => {
            this._setX(event.pageX + correctionX);
            this._setY(event.pageY + correctionY);
            //чтобы убрать focus 
            this._elem.blur();
        });
    }
}
    class ZIndexer {
        constructor() {
            this._stickers = [];
        }

        add(sticker) {
            this._stickers.push(sticker);
        }
        getMaxZ() {
            if (this._stickers.length !== 0) {
                let zindexes = [];

                this.stickers.forEach(sticker => {
                    zindexes.push(sticker.getZ());
                });
                //находим максимальное значеник в масиве
                return Math.max.apply(null, zindexes);
            } else {
                return 0;
            }
        }
    }
    //хранилище
    class Stock {
        constructor(key, id  = null) {
            this._storage = new Storage(key);
            this._id = id
        }

        save(value) {
            let data = this._extract();
            data[_this,_id] = value;
            _this.compact(data)
        }
    }

    class Storage {
        constructor(key) {
            this._key = key;
        }

        save(data) {
            localStorage.setItem(this._key, data);
        }
        get() {
            return localStorage.getItem(this._key);
        }
    }

    let key = 'stickers';
    let zIndexer = new ZIndexer;

    let stock = new Stock(key);
    let globalData = stock.getAll();

    let id = 0;
    for (id in globalData) {
        let sticker = new Sticker (document.body, key, id, zIndexer);
        sticker.restore(globalData(id));

        zIndexer.add(sticker);
    };

window.addEventListener('dblclick', (event) => {
    id++;

    let sticker = new Sticker (document.body, key, id, zIndexer);
    sticker.create(150, 200, event.pageX, event.pageY);

    zIndexer.add(stiker);
})