var canvas; // キャンバス
var ctx;    // コンテキスト
var timerID;    // タイマー

var canvas_magnification = 15;    // 表示倍率  
var canvas_width = 40;           // キャンバス横幅   
var canvas_height = 35;           // キャンバス縦幅 
var canvas_mousedown_flg = false; // マウスダウンフラグ

var debug = false; // デバッグ
var swLifeGame = false; // LifeGame実行フラグ
var lfArray = Array(Array(canvas_width + 2), Array(canvas_height + 2)); // LifeGame配列

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

    if (debug) document.getElementById('msg3').innerHTML = 'セル番号　' + row + ' x ' + col;
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
        ctx.lineTo(canvas.width, (i * canvas_magnification));
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
    // 配列初期化 ※配列サイズは行列ともマスの数+2(はみ出しマス考慮)
    init_lfArray();
}

function init_CA() {
    init_canvas();
    // 配列初期化 ※配列サイズは行列ともマスの数+2(はみ出しマス考慮)
    init_lfArray();
}

function OnMousedown(e) {
    var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // 塗りつぶし
    var col = Math.floor(mouseX / canvas_magnification);
    var row = Math.floor(mouseY / canvas_magnification);

    drawCell(row, col);

    lfArray[row + 1][col + 1] = 1;
    // 罫線の描画
    drawRule();

    if (debug) document.getElementById('msg2').innerHTML = 'マウスダウン　X:' + mouseX + ' Y' + mouseY;

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

        drawCell(row, col);

        lfArray[row + 1][col + 1] = 1;
        // 罫線の描画
        drawRule();
    }

    if (debug) document.getElementById('msg1').innerHTML = '現在座標　X:' + mouseX + ' Y' + mouseY;
    Point2BlockName(mouseX, mouseY);
}

function OnMouseup(e) {
    canvas_mousedown_flg = false;
}

// LifeGame開始/停止
function OnPresssLifeGame() {
    swLifeGame = !swLifeGame
    if (swLifeGame) {
        // タイマー起動
        timerID = setInterval("moveLifeGame()", 250);
        $('#BTNLifeGame').text('停止||');
        $('#BTNLifeGame').attr('class', 'btn btn-outline-primary');
    } else {
        // タイマー停止
        clearInterval(timerID);
        $('#BTNLifeGame').text('開始>>');
        $('#BTNLifeGame').attr('class', 'btn btn-primary');
    }
}

// 配列初期化 ※配列サイズは行列ともマスの数+2(はみ出しマス考慮)
function init_lfArray() {
    // LifeGameの初期化
    var lfrows = canvas_height + 2;
    var lfcols = canvas_width + 2;
    lfArray = new Array(lfrows);
    for (let i = 0; i < lfrows; i++) {
        lfArray[i] = new Array(lfcols).fill(0);
        // 端セルはMAX値代入
        lfArray[i][0] = Number.MAX_SAFE_INTEGER;
        lfArray[i][canvas_width + 1] = Number.MAX_SAFE_INTEGER;
    }
    // 端セルはMAX値代入
    lfArray[0].fill(Number.MAX_SAFE_INTEGER);
    lfArray[canvas_height + 1].fill(Number.MAX_SAFE_INTEGER);
}

// LifeGameをやる関数
function moveLifeGame() {
    // lfArrayを待避(値渡し)
    var lfArrayPrev = lfArray.slice();
    // lfArrayを初期化
    init_canvas();
    init_lfArray();
    // ライフゲームのメイン処理
    for (let row = 0; row < canvas_height; row++) {
        for (let col = 0; col < canvas_width; col++) {
            if (lfArrayPrev[row + 1][col + 1] == 1) {
                // 今は生きている
                if (countLife(lfArrayPrev, row + 1, col + 1) == 2 || countLife(lfArrayPrev, row + 1, col + 1) == 3) {
                    lfArray[row + 1][col + 1] = 1;
                } else {
                    lfArray[row + 1][col + 1] = 0;
                }
            } else {
                // 今は死んでいる
                if (countLife(lfArrayPrev, row + 1, col + 1) == 3) {
                    lfArray[row + 1][col + 1] = 1;
                } else {
                    lfArray[row + 1][col + 1] = 0;
                }
            }
        }
    }
    // lfArrayの中身表示
    show_lfArray();
}

// LifeGame表示関数
function show_lfArray() {
    // Canvas初期化
    init_canvas();
    // 塗り直し
    for (let row = 0; row < canvas_height; row++) {
        for (let col = 0; col < canvas_width; col++) {
            if (lfArray[row + 1][col + 1] == 1) {
                drawCell(row, col);
            }
        }
    }
    // 罫線の描画
    drawRule();
}

// セル色塗り
function drawCell(row, col){
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(col * canvas_magnification, row * canvas_magnification,
        canvas_magnification, canvas_magnification);
}

// row行col列のセル周囲の生存セルチェック
function countLife(lfArrayPrev, row, col) {
    var cnt = 0;
    for (i = row - 1; i <= row + 1; i++) {
        for (j = col - 1; j <= col + 1; j++) {
            // 現在のセルは見なくていい
            if (i == row && j == col) continue;
            // 周囲のセルが生きている(1)ならカウント増加
            if (lfArrayPrev[i][j] == 1) cnt++;
        }
    }
    return cnt;
}