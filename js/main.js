var total=1;
var svg = document.getElementById('svg');
var maxDepth = 0;
var basicStyle = {
    textSize: "14px",
    text: "新节点",
    linkStroke: "lightseagreen",
    linkStrokeWidth: "2px"
}
function MyNode(parentNode, style, pos) {
    total+=1;
    console.log(total);
    var _this = this;
    //双向设置父子节点
    this.parent = parentNode;
    let parentLen = this.parent.children.length;
    if (pos === "sup") {
        let i = 0;
        for (; i < parentLen; i++) {
            if (this.parent.children[i] === defauleNode) break;
        }
        this.parent.children.splice(i, 0, this);
    } else if (pos === "sub") {
        let i = 0;
        for (; i < parentLen; i++) {
            if (this.parent.children[i] === defauleNode) break;
        }
        this.parent.children.splice(i + 1, 0, this);
    } else {
        this.parent.children[parentLen] = this;
    }

    //该节点位置属性
    this.parts = 1;
    this.moreNode = function (justdoit) {
        if (justdoit === true) {
            _this.parent.moreNode(true);
            _this.parts += 1;
        } else {
            if (_this.children.length > 1) {
                _this.parent.moreNode(true);
                _this.parts += 1;
            }
        }
        // console.log(text+':'+_this.parts);

    }
    this.parent.moreNode(false);//通知祖先节点，使祖先节点数+1

    this.depth = this.parent.depth + 1;
    maxDepth = maxDepth > this.depth ? maxDepth : this.depth;
    this.maxHeight = this.parent.maxHeight / this.parent.children.length;
    this.x = 180 * this.depth;
    this.y = this.parent.y + (this.parent.maxHeight - this.maxHeight) / 2;

    //独有的关联元素
    this.children = [];
    this.gElement = (function () {
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        // g.style.transform = "translate(" + _this.x + "px," + _this.y + "px)";
        g.style.transform = "translate(" + _this.parent.x + "px," + _this.parent.y + "px)";
        // setTimeout(function(){g.style.transform = "translate(" + _this.x + "px," + _this.y + "px)";},100);
        svg.append(g);
        return g;
    })();
    this.circleElement = (function () {
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('class', 'circle');
        c.setAttribute('r', '10px');
        c.addEventListener('click', chooseNode);
        c.coorNode = _this;
        _this.gElement.append(c);
        return c;
    })();
    this.pathElement = (function () {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', "M " + _this.parent.x + " " + _this.parent.y + "C " +
            _this.parent.x + " " + (_this.parent.y + _this.y) / 2 +
            "," + _this.parent.x + " " + _this.y +
            " " + _this.x + " " + _this.y);
        p.setAttribute('class', 'link');
        p.style.stroke = style.linkStroke;
        p.style.strokeWidth = style.linkStrokeWidth;
        svg.insertBefore(p, svg.childNodes[0]);
        return p;
    })();
    this.textElement = (function () {
        var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        t.textContent = style.text;
        t.style.fontSize = style.textSize;
        t.setAttribute('class', 'text');
        _this.gElement.append(t);
        return t;
    })();

    //样式属性
    this.bcStyle = {
        get text() { return _this.textElement.textContent; },
        set text(t) { _this.textElement.textContent = t; },
        get textSize() { return _this.textElement.style.fontSize; },
        set textSize(ts) { _this.textElement.style.fontSize = ts; },
        get linkStroke() { return _this.pathElement.style.stroke; },
        set linkStroke(ls) { _this.pathElement.style.stroke = ls; },
        get linkStrokeWidth() { return _this.pathElement.style.strokeWidth; },
        set linkStrokeWidth(lsw) { _this.pathElement.style.strokeWidth = lsw; }
    }

    //重置元素方法
    //设定新的最大高度和y坐标
    this.resetMHandY = function (newMH, newY) {
        _this.maxHeight = newMH;
        _this.y = newY;
        _this.gElement.style.transform = "translate(" + _this.x + "px," + _this.y + "px)";
        _this.pathElement.setAttribute('d', "M " + _this.parent.x + " " + _this.parent.y + "C " +
            _this.parent.x + " " + (_this.parent.y + _this.y) / 2 +
            "," + _this.x + " " + _this.y +
            " " + _this.x + " " + _this.y);
    }
    //刷新子节点
    this.flushNodeChildren = function () { flushNodeChildren(this); }
    //计算删除时祖先节点减少的份数
    this.toCalParts = function (decrease) {
        if (_this.children.length == 0) {
            if (decrease == 1) {
            } else {
                _this.parts = 1;
                _this.parent.toCalParts(decrease - 1);
            }
        } else {
            _this.parts -= decrease;
            _this.parent.toCalParts(decrease);
        }
    }
    //自身节点删除
    this.removeSelf = function () {
        let len = _this.children.length;
        for (let i = 0; i < len; i++) {
            _this.children[i].removeSelf();
        }
        _this.children.children = [];
        _this.gElement.remove();
        _this.pathElement.remove();
        _this.circleElement.coorNode = null;
    }
    //序列化
    this.toJSON = function () {
        return { bcStyle: _this.bcStyle, children: _this.children };
    }
}

//设置根节点
function getRoot(style) {
    var _this = this;
    //该节点位置属性
    this.depth = 0;
    this.maxHeight = 300;
    this.x = 15;
    this.y = 150;
    this.parts = 1;
    //独有的有关样式设置
    //独有的关联元素
    this.children = [];
    this.gElement = (function () {
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.style.transform = "translate(" + _this.x + "px," + _this.y + "px)";
        svg.append(g);
        return g;
    })();
    this.circleElement = (function () {
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('class', 'choosedcircle');
        c.setAttribute('r', '10px');
        c.addEventListener('click', chooseNode);
        c.coorNode = _this;
        _this.gElement.append(c);
        return c;
    })();
    this.textElement = (function () {
        var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        t.textContent = style.text;
        t.style.fontSize = style.textSize;
        t.setAttribute('class', 'text');
        _this.gElement.append(t);
        return t;
    })();

    //样式属性
    this.bcStyle = {
        get text() { return _this.textElement.textContent; },
        set text(t) { _this.textElement.textContent = t; },
        get textSize() { return _this.textElement.style.fontSize; },
        set textSize(ts) { _this.textElement.style.fontSize = ts; },
    }
    //重置元素方法
    this.resetMHandY = function (newMH, newY) {
        _this.maxHeight = newMH;
        _this.y = newY;
        _this.gElement.style.transform = "translate(" + _this.x + "px," + _this.y + "px)";
    }
    this.flushNodeChildren = function () { flushNodeChildren(this); }
    this.moreNode = function (justdoit) {
        if (justdoit === true) {
            _this.parts += 1;
        } else {
            if (_this.children.length > 1) {
                _this.parts += 1;
            }
        }
    }
    this.toCalParts = function (decrease) {
        if (_this.children.length == 0) {
            _this.parts = 1;
        } else {
            _this.parts -= decrease;
        }
    }
    //序列化
    this.toJSON = function () {
        return { bcStyle: _this.bcStyle, children: _this.children };
    }
}
var root = new getRoot(basicStyle);

// var node1 = new MyNode(root, basicStyle);
// var node2 = new MyNode(node1, basicStyle);
// var node3 = new MyNode(node2, basicStyle);
// var node4 = new MyNode(node2, basicStyle);
// var node5 = new MyNode(node2, basicStyle);
// var node6 = new MyNode(node2, basicStyle);
// var node7 = new MyNode(node3, basicStyle);
// var node8 = new MyNode(node3, basicStyle);
// var node9 = new MyNode(node8, basicStyle);
// var node10 = new MyNode(node8, basicStyle);
var defauleNode = root;
root.flushNodeChildren();


//刷新节点
function flushNodeChildren(node) {
    // console.log(node);
    var len = node.children.length, mh = node.maxHeight, totalP = node.parts, start = node.y - mh / 2;
    var newMH, newY;
    for (var i = 0; i < len; i++) {
        newMH = node.children[i].parts / totalP * mh;
        newY = start + newMH / 2;
        start += newMH;
        node.children[i].resetMHandY(newMH, newY);
        node.children[i].flushNodeChildren();
    }
    maxDepth = maxDepth > node.depth ? maxDepth : node.depth;
}
//添加节点到defauleNode后面
function addNode() {
    new MyNode(defauleNode, basicStyle);
    root.flushNodeChildren();
}
//添加兄弟节点到defauleNode
function addBroNode(bro) {
    if (defauleNode === root) {
        alert("根节点没有兄弟节点");
        return;
    }
    new MyNode(defauleNode.parent, basicStyle, bro);
    root.flushNodeChildren();
}
//删除节点
function rmNode() {
    if (defauleNode === root) {
        alert('无法删除根节点！');
        return;
    } else {
        maxDepth = 0;
        let temp = defauleNode;
        defauleNode = defauleNode.parent;
        defauleNode.circleElement.setAttribute('class', 'choosedcircle');
        let i = 0;
        for (; i < defauleNode.children.length; i++) {
            if (defauleNode.children[i] === temp) break;
        }
        defauleNode.children.splice(i, 1);
        defauleNode.toCalParts(temp.parts);
        temp.removeSelf();
    }
    chooseNode({ target: { coorNode: defauleNode } });
    root.flushNodeChildren();
}
//增大间距
function setSize(_h) {
    let h = parseInt(_h);
    root.resetMHandY(root.maxHeight + h, root.y + h / 2);
    root.flushNodeChildren();
}
//设置选中点
var showControls = {
    textinput: document.getElementById('textinput'),
    textSizeSelect: document.getElementById('textsize'),
    linksize: document.getElementById('linksize'),
    linkcolor: document.getElementById('linkcolor')
}
function chooseNode(event) {
    //切换选中点样式
    defauleNode.circleElement.setAttribute('class', 'circle');
    defauleNode = event.target.coorNode;
    defauleNode.circleElement.setAttribute('class', 'choosedcircle');
    //同步控制栏
    showControls.textinput.value = defauleNode.bcStyle.text;
    showControls.textSizeSelect.value = defauleNode.bcStyle.textSize;
    showControls.linksize.value = defauleNode.bcStyle.linkStrokeWidth;
    // console.dir(defauleNode.bcStyle);
    showControls.linkcolor.value = defauleNode.bcStyle.linkStroke;
}
//为下载做转换png
var svgurl, pngurl;
function toDownload() {
    //转png
    //内联样式
    let svgClone = svg.cloneNode(true);
    let links = svgClone.querySelectorAll('.link');
    let texts = svgClone.querySelectorAll('.text');
    let circles = svgClone.querySelectorAll('.circle');
    for (let i = 0; i < links.length; i++) {
        links[i].style.fill = 'transparent';
    }
    for (let i = 0; i < texts.length; i++) {
        texts[i].style.transform = 'translate(12px, 4px)';
    }
    for (let i = 0; i < circles.length; i++) {
        circles[i].style.fill = 'gray';
        circles[i].style.strokeWidth = '2px';
        circles[i].style.stroke = 'lightseagreen';
    }
    var cc = svgClone.querySelector('.choosedcircle');
    cc.style.fill = 'gray';
    cc.style.strokeWidth = '2px';
    cc.style.stroke = 'lightseagreen';
    //转换
    var canvas = document.getElementById('downloadPngCV');
    canvas.setAttribute('width', 180 * (maxDepth + 1) + 10 + 'px');
    canvas.setAttribute('height', root.maxHeight + 'px');
    var svgString = new XMLSerializer().serializeToString(svgClone);
    var ctx = canvas.getContext("2d");
    var img = new Image();
    var svgClonetext = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(svgClonetext);
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var png = canvas.toDataURL("image/png");
        pngurl = png;
        URL.revokeObjectURL(png);
    };
    img.src = url;
    svgurl = url;
    document.getElementById('downloadPng').style.display = 'block';
}
//svg下载按钮被点击
function svgDownload() {
    document.getElementById('svgDownload').setAttribute('href', svgurl);
}
//svg下载按钮被点击
function pngDownload() {
    document.getElementById('pngDownload').setAttribute('href', pngurl);
}
//关闭下载
function closeDownload() {
    document.getElementById('downloadPng').style.display = 'none';
}
//应用按钮点击
function applyNode() {
    defauleNode.bcStyle.text = showControls.textinput.value;
    defauleNode.bcStyle.textSize = showControls.textSizeSelect.value;
    if (defauleNode === root && (showControls.linksize.value != "" || showControls.linkcolor.value != "")) {
        alert('根节点不存在与上一节点的路径，无需设置');
    } else {
        defauleNode.bcStyle.linkStrokeWidth = showControls.linksize.value;
        defauleNode.bcStyle.linkStroke = showControls.linkcolor.value;
    }
}
//加载
function toLoad() {
    let loading = document.getElementById('loading');
    loading.style.display = 'block';
    var xmlHttp, handleRequestStateChange;
    handleRequestStateChange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var substring = xmlHttp.responseText;
            var reg = new RegExp('<body>(.*)</body>');
            var t = reg.exec(substring);
            substring = t[1];
            var json = JSON.parse(substring);
            console.log(json);
            creatRootFromJson(json);
            for (let i = 0; i < json.children.length; i++) {
                creatNodeFromJson(root, json.children[i]);
            }
            root.flushNodeChildren();
            alert('加载成功!');
        } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
            alert('加载失败!');
        }
        loading.style.display = "none";
    }
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost/thinks/jsonapi.jsp", true);
    xmlHttp.onreadystatechange = handleRequestStateChange;
    xmlHttp.send(null);
}
//保存
function toSave() {
    let loading = document.getElementById('loading');
    loading.style.display = 'block';
    var xmlHttp, handleRequestStateChange;
    handleRequestStateChange = function () {
        setTimeout('loading.style.display="none"', 2000);
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            alert('保存成功!');
        } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
            alert('保存失败!');
        }
        loading.style.display = "none";
    }
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost/thinks/jsonapi.jsp", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = handleRequestStateChange;
    xmlHttp.send("tosave=" + JSON.stringify(root));
}
//重构根节点
function creatRootFromJson(json) {
    //清理全部子节点
    root.children.forEach((t) => { t.removeSelf(); });
    root.parts = 1;
    root.children = [];

    //从json对象初始化
    root.bcStyle.text = json.bcStyle.text;
    root.bcStyle.textSize = json.bcStyle.textSize;
    chooseNode({ target: { coorNode: root } });
}
//重构子节点，辅助重构根节点用
function creatNodeFromJson(parentNode, json) {
    var temp = new MyNode(parentNode, json.bcStyle);
    for (let i = 0; i < json.children.length; i++) {
        creatNodeFromJson(temp, json.children[i]);
    }
}





