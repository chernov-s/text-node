/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * Vector
 */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = {
    set: function (x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    }
};
/*
 * Node
 */
function Node(x, y, radius) {
    this.target = new Vector(x, y);
    this.curXY = randXY();
    this.p = new Vector(this.curXY.x, this.curXY.y)
    this.radius = radius;
    this.active = true;
    this.color = Math.random()*360;
    //this.color = "rgba(0,0,0,1)";
    this.angle = Math.random();
    this.k = randomInt(5,8);
}

Node.prototype.update = function (delta) {
    var speed = distance(this.p.x, this.p.y, this.target.x, this.target.y) / 10;
    if(speed < 1) {
        speed = randomInt(1,2) > 1 ? -0.2: 0.2;
    }
    if(move(this.p, this.target, speed)) {
        //this.radius = .5;
    }
}

Node.prototype.draw = function (c) {
    c.fillStyle = 'hsla('+this.color+',95%, 50%,1)';
    //c.fillStyle = this.color;
    c.beginPath();
    c.arc(this.p.x, this.p.y, this.radius, 0, Math.PI * 2, true);
    c.fill();
    c.closePath();
}


//utils
function randomInt( min, max ) {
    return Math.round(min + ( Math.random() * ( max - min ) ));
}
function distance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow( ax - bx, 2) + Math.pow( ay - by, 2));
}
function randXY() {
    switch(randomInt( 1, 4 )) {
        case 1: return {x: randomInt(-10, width + 10), y: -10}; // Top
        case 2: return {x: width + 10, y: randomInt(-10, height + 10)}; // Right
        case 3: return {x: randomInt(-10, width + 10), y: height + 10}; // Bottom
        case 4: return {x: -10, y: randomInt(-10, height + 10)}; // Left
    }
}
/*
 * Движения объекта из одной точки в другую в 2D пространстве.
 * Функция принимает указатель на объект, тем самым меняя его координаты.
 *
 * @param {x,y} begin - координаты оъекта
 * @param {x,y} end - цель оъекта
 * @param {number} speed - скорость движения
 * @return {bool} достиг ли объект цели
 */
function move(begin, end, speed) {
    var distx = end.x - begin.x;
    var disty = end.y - begin.y;
    var angle = Math.atan2(disty, distx);

    begin.x += speed * Math.cos(angle);
    begin.y += speed * Math.sin(angle);

    return (distx < 0 ? -distx : distx) + (disty < 0 ? -disty : disty) < 1;
};

// Initialize
//---------------------------------------------------

// Configs

var BG_COLOR      = 'rgba(255, 255, 255, 1)',
    RELATION_COLOR      = 'rgba(89,80,255, 0.2)',
    PARTICLE_RADIUS       = 1,
    G_POINT_RADIUS        = 10,
    G_POINT_RADIUS_LIMITS = 65,
    MAX_POINT_LINE = 50,
    CHART_LENGTH = 5;

var charts = {
    // 0 1 2 3 4 5 -> CHART_LENGTH
    // 1 X - - - X
    // 2 |       |
    // 3 |       | => П => [[1,5, 1,1], [1,1, 5,1], [5,1, 5,5]]
    // 4 |       |
    // 5 X       X

    "А": [[1,5, 3,1], [5,5, 3,1], [2,4, 4,4]],
    "Б": [[4,1, 1,1], [1,1, 1,5], [1,5, 4,5], [4,5, 5,4], [5,4, 4,3], [4,3, 1,3]],
    "В": [[1,1, 1,5], [1,1, 5,2], [5,2, 1,3], [1,3, 5,4], [5,4, 1,5]],
    "Г": [[1,5, 1,1], [1,1, 4,1]],
    "Д": [[1,5, 1,4], [1,4, 5,4], [5,4, 5,5], [2,4, 2,1], [2,1, 4,1], [4,1, 4,4]],
    "Е": [[1,1, 1,5], [1,5, 5,5], [1,3, 4,3], [1,1, 5,1]],
    "Ж": [[3,1, 3,5], [1,5, 2,3], [1,1, 2,3], [2,3, 4,3], [4,3, 5,1], [4,3, 5,5]],
    "З": [[1,1, 4,1], [4,1, 5,2], [5,2, 4,3], [4,3, 2,3], [4,3, 5,4], [5,4, 4,5], [4,5, 1,5]],
    "И": [[1,1, 1,5], [1,5, 5,1], [5,1, 5,5]],
    "К": [[1,1, 1,5], [1,3, 3,3], [3,3, 5,1], [3,3, 5,5]],
    "Л": [[1,5, 2,3], [2,3, 4,1], [4,1, 5,1], [5,1, 5,5]],
    "М": [[1,5, 1,1], [1,1, 3,3], [3,3, 5,1], [5,1, 5,5]],
    "Н": [[1,5, 1,1], [1,3, 4,3], [4,5, 4,1]],
    "О": [[1,1, 1,5], [1,5, 5,5], [5,5, 5,1], [5,1, 1,1]],
    "П": [[1,5, 1,1], [1,1, 4,1], [4,1, 4,5]],
    "Р": [[1,7, 1,1], [1,1, 5,3], [5,3, 1,5]],
    "С": [[4,1, 2,1], [2,1, 1,2], [1,2, 1,4], [1,4, 2,5], [2,5, 4,5]],
    "Т": [[1,1, 5,1], [3,1, 3,5]],
    "У": [[1,1, 1,2], [1,2, 2,3], [2,3, 4,3], [4,1, 4,4], [4,4, 3,5], [3,5, 1,5]],
    "Ф": [[1,3, 1,2], [1,2, 2,1], [2,1, 4,1], [4,1, 5,2], [5,2, 5,3], [5,3, 4,4], [4,4, 2,4], [2,4, 1,3], [3,1, 3,5]],
    "Х": [[1,1, 5,5], [1,5, 5,1]],
    "Ц": [[1,1, 1,4], [1,4, 4,4], [4,4, 4,1], [4,4, 5,4], [5,4, 5,5]],
    "Ч": [[1,1, 1,3], [1,3, 4,3], [4,1, 4,5]],
    "Ш": [[1,1, 1,5], [1,5, 5,5], [5,5, 5,1], [3,1, 3,5]],
    "Щ": [[1,1, 1,4], [1,4, 5,4], [5,4, 5,1], [3,4, 3,1], [6,4, 6,5]],
    "Ъ": [[1,1, 2,1], [2,1, 2,5], [2,5, 5,5], [5,5, 5,3], [5,3, 2,3]],
    "Ы": [[1,1, 1,5], [1,5, 4,5], [4,5, 4,3], [4,3, 1,3], [6,1, 6,5]],
    "Ь": [[1,1, 1,5], [1,5, 4,5], [4,5, 4,3], [4,3, 1,3]],
    "Э": [[1,1, 3,1], [3,1, 4,2], [4,2, 4,4], [4,4, 3,5], [3,5, 1,5], [4,3, 1,3]],
    "Ю": [[1,1, 1,5], [1,3, 3,3], [3,2, 3,4], [3,4, 4,5], [4,5, 5,4], [5,4, 5,2], [5,2, 4,1], [4,1, 3,2]],
    "Я": [[1,2, 2,1], [2,1, 5,1], [5,1, 5,5], [5,3, 2,3], [2,3, 1,2], [3,3, 1,5]],
    " ": [],
    "!": [[3,1, 3,5], [4,1, 4,5], [3,7, 4,7]],
};

// Vars

var canvas, ctx,
    width, height,
    fontSize, //Размер шрифта в пискселях
    lineWidth,  //Ширина линии шривта в пикселях
    minDist, //Минимальное расстояние между узлами в пикселях
    cellWidth,//Ширина ячейки в пикселях. Высчитывается: Размер шрифта / CHART_LENGTH
    delta, last,
    objects = [],
    text = [
        {word: "ПРИВЕТ", time: 1500 },
        {word: "!!!", time: 1500 },
        {word: "ПАУ", time: 1500 },
        {word: "ТУКТУК", time: 1500 },
    ],
    currentChart = 0,
    mouse = new Vector(),
    isDown = false,
    currentText = 0, currentNode = 0, timer, removeOld = false;

// Event Listeners

function resize(e) {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function mouseMove(e) {
    mouse.set(e.clientX, e.clientY);

}

function mouseDown(e) {
    isDown = true;
}

function mouseUp(e) {
    isDown = false;
}

// Functions

function drawRelation() {
    var i, k, len = objects.length, node1, node2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = RELATION_COLOR;
    for(i = 0; i < len - 1; i++) {
        node1 = objects[i];
        if(!isDown && node1.active) {
            var dist = distance(mouse.x, mouse.y, node1.p.x, node1.p.y);
            if(dist < minDist * 2) {
                node1.radius = (minDist * 2 - dist)/8;
            } else {
                node1.radius = PARTICLE_RADIUS;
            }
        } else {
            if(node1.radius > PARTICLE_RADIUS) {
                node1.p.x = mouse.x;
                node1.p.y = mouse.y;
                node1.anim1 = true;
            }
        }
        for(k = i + 1; k < len; k++) {
            node2 = objects[k];
            joinNodes(node1.p, node2.p)
        }
    }
    ctx.stroke();
    ctx.closePath();
}

function joinNodes(a, b) {
    var dist = distance(a.x, a.y, b.x, b.y);
    if (dist < minDist) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
    }
}

/*
 * Отступ сверху и справа в пикселях
 *
 * @param {string} Слово
 * @param {number} номер символа в слове
 * @return {x, y} структура
 */
function getOffset(str, number) {
    //Высчитываем общую длину слова, учитывая промежутки между символами
    var commonWidth = cellWidth * CHART_LENGTH * str.length + (str.length - 1) * cellWidth;

    //Высчитываем отступ от начала холста до пярвого символа.
    var offsetFirst = (width - commonWidth) / 2;
    return {
        x: offsetFirst + number * CHART_LENGTH * cellWidth + number * cellWidth,
        y: height / 2 - fontSize / 2
    }
}

function addObj(n) {
    var r;
    for(var i = 0; i < n; i++) {
        r = randXY();
        objects.push(new Node(r.x, r.y, PARTICLE_RADIUS));
    }

}
/*
 * Добавление случайных точек близ заданной прямой учитывая угол
 *
 * @param {array} 0 - x1, 1 - y1, 3 - x2, 4 - y2
 */
function addPointInChart(m, offsetX, offsetY) {
    var i, p,
        d = distance(m[0],m[1],m[2],m[3]),
        step = d * cellWidth / MAX_POINT_LINE,
        begin = {x: m[0], y: m[1]},
        end = {x: m[2], y: m[3]},
        x, y;
    var angle = Math.atan2(end.y - begin.y, end.x - begin.x);

    x = offsetX + begin.x * cellWidth;
    y = offsetY + begin.y * cellWidth;
    var ss = d * cellWidth;

    for (i = 0; i < ss; i+= step) {
        x += step*Math.cos(angle);
        y += step*Math.sin(angle);
        objects[currentNode].target.x = x + randomInt(0, lineWidth/1.5);
        objects[currentNode].target.y = y + randomInt(0, lineWidth/1.5);
        objects[currentNode].active = true;
        currentNode ++;
    }
}

// Init
function init() {

    canvas  = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resize();

    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);

    addObj(2000);

    nextText();

    loop();
}

function nextText() {
    var i, k, j;
    var txt = text[currentText];
    fontSize = width / (txt.word.length + 2);

    lineWidth = fontSize / 6;
    minDist = lineWidth;
    cellWidth = fontSize / CHART_LENGTH;

    removeOld = false;
    currentNode = 0;
    for(k = 0; k < txt.word.length; k++) {
        var chart = charts[txt.word[k]];
        var offset = getOffset(txt.word, k);
        for(j = 0; j < chart.length; j++) {
            addPointInChart(chart[j], offset.x, offset.y);
        }
    }
    for(i = currentNode; i < objects.length; i++) {
        objects[i].active = false;
        objects[i].p = randXY();
    }
    timer = Date.now() + txt.time;
    currentText ++;
}

// Start Update
var loop = function() {
    var i, len,
        now = Date.now();
    delta = (now - last) / 1000.0;
    last = now;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    drawRelation();

    if(timer + 1000 < now) {
        if(currentText < text.length)
            nextText();
        else
            currentText = 0;
    }

    for (i = 0; i < objects.length; i++) {
        if(objects[i].active) {
            objects[i].update(delta);
            objects[i].draw(ctx);
        }
    }
    requestAnimationFrame(loop);
}

init();

//---------------------------------------------------