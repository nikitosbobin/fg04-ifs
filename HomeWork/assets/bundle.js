function Program() {
    this.display;
}

Program.prototype = {
    main: function () {
        var canvas = document.getElementById("canvas");
        this.display = new DisplayMetrics(-2, -2, 2, 2, canvas);
        this.createFractal();
    },
    createFractal: function(arg) {
        this.getDragonFractalPoints({ x: 500, y: 400 }, (!!arg && arg.value) || 9000)
            .drawPoints(this.display)
            .saveChanges();
    },
    getDragonFractalPoints: function(startPoint, count) {
        var result = [];
        result.push({point:startPoint, color:{ r: 255, g: 255, b: 255, a: 255}});
        for (var i = 0; i < count; ++i) {
            var zoomInPoint = this.display.zoomIn(startPoint);
            var transformedPoint = this.transformPoint(zoomInPoint);
            var zoomOutPoint = this.display.zoomOut(transformedPoint);
            result.push({point:zoomOutPoint, color:{ r: 255, g: 255, b: 255, a: 255}});
            startPoint = zoomOutPoint;
        }
        return result;
    },
    
    transformPoint: function(point) {
        var tranformedX = 0;
        var tranformedY = 0;
        if (this.getRandomBool()) {
            tranformedX = (point.x + point.y) / 2;
            tranformedY = (-point.x + point.y) / 2;
        } else {
            tranformedX = (-point.x + point.y) / 2 - 1;
            tranformedY = (-point.x - point.y) / 2;
        }
        return { x: tranformedX, y: tranformedY };
    },
    
    getRandomBool: function() {
        return Math.random() > 0.5;
    }
}

function DisplayMetrics(left, top, right, bottom, canvas) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.displaySize = { width: canvas.width, height: canvas.height };
    this.ctx = canvas.getContext('2d');
    this.clear();
}

DisplayMetrics.prototype = {
    clear: function() {
        this.ctx.fillStyle = "Black";
        this.ctx.fillRect(0, 0, this.displaySize.width, this.displaySize.height);
        this.imageData = this.ctx.getImageData(0, 0, this.displaySize.width, this.displaySize.height);
    },
    
    drawPoints(points) {
        this.clear();
        points.forEach(function(item) {
            this.setPixel(item.point, item.color);
        }.bind(this));
        return this;
    },
    
    zoomIn: function(point) {
        var resultX = point.x * (this.right - this.left) / (this.displaySize.width - 1) + this.left;
        var resultY = point.y * (this.bottom - this.top) / (this.displaySize.height - 1) + this.top;
        return { x: resultX, y: resultY };
    },
    
    zoomOut: function(point) {
        var resultX = Math.round(point.x * (this.displaySize.width - 1) / 4 + this.displaySize.width / 2);
        var resultY = Math.round(point.y * (this.displaySize.height - 1) / 4 + this.displaySize.height / 2);
        return { x: resultX, y: resultY };
    },
    
    setPixel: function(point, color) {
        this.imageData.data[4 * (point.x + this.displaySize.width * point.y) + 0] = color.r;
        this.imageData.data[4 * (point.x + this.displaySize.width * point.y) + 1] = color.g; 
        this.imageData.data[4 * (point.x + this.displaySize.width * point.y) + 2] = color.b;
        this.imageData.data[4 * (point.x + this.displaySize.width * point.y) + 3] = color.a;
    },
    
    saveChanges: function() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }
};

Array.prototype.drawPoints = function(metrics) {
    return metrics.drawPoints(this);
};

var program = new Program();