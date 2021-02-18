var canvas; // キャンバス
var ctx;    // コンテキスト

var canvas_magnification = 15;    // 表示倍率  
var canvas_width = 30;           // キャンバス横幅   
var canvas_height = 30;           // キャンバス縦幅 
var canvas_mousedown_flg = false; // マウスダウンフラグ

var debug = false; // デバッグ
var swLifeGame = false; // LifeGame実行ﾌﾗｸﾞ

///// 内部関数

function init_canvas() {
    canvas_mousedown_flg = false;

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRule();
}

// 座標からブロック名を取得する   
function Point2BlockName(x, y) {
    var col = 'C' + (Math.floor(x / canvas_magnification) + 1);
    var row = 'R' + (Math.floor(y / canvas_magnification) + 1);

    if(debug)document.getElementById('msg3').innerHTML = 'セル番号　' + row + ' x ' + col;
}

// キャンバスに罫線を描画する
function drawRule() {

    // 線の色
    ctx.strokeStyle = "#000000";

    // 線の太さ
    ctx.lineWidth = 2;

    ctx.beginPath();

    // 縦線
    for (var i = 0; i < canvas_width + 1; i++) {
        ctx.moveTo((i * canvas_magnification), 0);
        ctx.lineTo((i * canvas_magnification), canvas.height);
    }

    // 横線
    for (var i = 0; i < canvas_height + 1; i++) {
        ctx.moveTo(0, (i * canvas_magnification));
        ctx.lineTo(canvas.height, (i * canvas_magnification));
    }

    ctx.stroke();
}

///// イベント

window.onload = function () {
    // キャンバス
    canvas = document.getElementById("MyCanvas");

    canvas.width = canvas_width * canvas_magnification;
    canvas.height = canvas_height * canvas_magnification;

    ctx = canvas.getContext("2d");

    canvas.addEventListener('mousedown', OnMousedown);
    canvas.addEventListener('mousemove', OnMousemove);
    canvas.addEventListener('mouseup', OnMouseup);
    window.addEventListener('mouseup', OnMouseup);

    init_canvas();
}

function OnMousedown(e) {
    var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // 塗りつぶし
    var col = Math.floor(mouseX / canvas_magnification);
    var row = Math.floor(mouseY / canvas_magnification);

    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(col * canvas_magnification, row * canvas_magnification,
        canvas_magnification, canvas_magnification);

    // 罫線の描画
    drawRule();

    if(debug)document.getElementById('msg2').innerHTML = 'マウスダウン　X:' + mouseX + ' Y' + mouseY;

    canvas_mousedown_flg = true;
}

function OnMousemove(e) {
    var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (canvas_mousedown_flg) {
        // 塗りつぶし
        var col = Math.floor(mouseX / canvas_magnification);
        var row = Math.floor(mouseY / canvas_magnification);

        ctx.fillStyle = "rgb(200, 0, 0)";
        ctx.fillRect(col * canvas_magnification, row * canvas_magnification,
            canvas_magnification, canvas_magnification);

        drawRule();
    }

    if(debug)document.getElementById('msg1').innerHTML = '現在座標　X:' + mouseX + ' Y' + mouseY;
    Point2BlockName(mouseX, mouseY);
}

function OnMouseup(e) {
    canvas_mousedown_flg = false;
}

// LifeGame開始/停止
function OnPressswLifeGame() {
    swLifeGame = !swLifeGame
    if(swLifeGame){
        $('#BTNLifeGame').text('停止');
    }else{
        $('#BTNLifeGame').text('開始');
    }
}