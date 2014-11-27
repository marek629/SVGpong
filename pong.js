/* This file is part of SVG pong game.
 * https://github.com/marek629/SVGpong
 * Copyright 2012 Marek Jędryka
 */

var playground, topPlayer, bottomPlayer, ball, r, scoreText;
var leftBorder, rightBorder, topBorder, bottomBorder;
var centerX, centerY;
var cx, cy;
var ballMissed = false;
var score = [0,0];
var gameTickInterval = null;

var KEY_LEFT  = 37;
var KEY_RIGHT = 39;

var dx = 0;
var dy = 0;
var player1dx = 0;
var player2dx = 0;
var playerMove = 10;

var player1cx;
var halfPaddleWidth;

function init() {
    playground    = document.getElementById("playground");
    topPlayer     = document.getElementById("player1");
    bottomPlayer  = document.getElementById("player2");
    ball          = document.getElementById("ball");
    r             = parseInt(ball.getAttribute("r"));
    scoreText     = document.getElementById("score");
    leftBorder    = parseInt(playground.getAttribute("x")) + r;
    rightBorder   = leftBorder + parseInt(playground.getAttribute("width")) - 2*r;
    var xMin = parseInt(playground.getAttribute("x"));
    var xMax = xMin + parseInt(playground.getAttribute("width"));
    var yMin = parseInt(playground.getAttribute("y"));
    var yMax = yMin + parseInt(playground.getAttribute("height"));
    centerX = (xMin + xMax) / 2;
    centerY = (yMin + yMax) / 2;
    score = [0,0];
    dx = 1;
    dy = 1;
    window.onkeydown = function(e) { getKey(e); };
    window.onkeyup   = function() { player2dx = 0; };
    halfPaddleWidth = parseInt(topPlayer.getAttribute("width")) / 2;
    startSet();
}

function getKey(e) {
    var event = window.event || e;
    switch (event.keyCode) {
        case KEY_LEFT:
            player2dx = -1;
            break;
        case KEY_RIGHT:
            player2dx = 1;
            break;
        default:
            player2dx = 0;
            break;
    }
}

function startSet() {
    if (gameTickInterval != null)
        window.clearInterval(gameTickInterval);
    dx *= -1;
    dy *= -1;
    topBorder     = parseInt(topPlayer.getAttribute("y")) + parseInt(topPlayer.getAttribute("height")) + r;
    bottomBorder  = parseInt(bottomPlayer.getAttribute("y")) - r;
    ballMissed    = false;
    ball.setAttribute("cx", centerX);
    ball.setAttribute("cy", centerY);
    window.setTimeout(function(){gameTickInterval=window.setInterval(function(){gameTick()}, 50)}, 1000);
}

function movePaddles() {
    // top player
    var tx = parseInt(topPlayer.getAttribute("x"));
    player1dx = 0;
    player1cx = parseInt(topPlayer.getAttribute("x")) + halfPaddleWidth;
    if (dy < 0) {
        var margin = halfPaddleWidth * Math.random();
        if (player1cx-margin > cx)
            player1dx = -1;
        else if (player1cx+margin < cx)
            player1dx = 1;
        tx += playerMove * player1dx;
        var tw = parseInt(topPlayer.getAttribute("width"));
        if (tx > leftBorder && tx+tw < rightBorder)
            topPlayer.setAttribute("x", tx);
    }
    // bottom player
    var bx = parseInt(bottomPlayer.getAttribute("x")) + playerMove * player2dx;
    var bw = parseInt(bottomPlayer.getAttribute("width"));
    if (bx > leftBorder && bx+bw < rightBorder)
        bottomPlayer.setAttribute("x", bx);
}

function moveBall() {
    var mx      = cx + dx * r;
    var my      = cy + dy * r;
    if (mx > rightBorder || mx < leftBorder)
        dx *= -1;
    if (my > bottomBorder || my < topBorder) {
        if (ballMissed) {
            if (my > bottomBorder)
                score[0]++;
            else
                score[1]++;
            scoreText.firstChild.nodeValue = score[0].toString() + ':' + score[1].toString();
            startSet();
            return;
        }
        var elem = document.elementFromPoint(mx, my-1);
        if (elem.className.baseVal != "paddle")
            elem = document.elementFromPoint(mx, my+1);
        if (elem.className.baseVal == "paddle")
            dy *= -1;
        else {
            ballMissed = true;
            if (dy < 0)
                topBorder = parseInt(playground.getAttribute("y")) + r;
            else
                bottomBorder = parseInt(playground.getAttribute("y")) + parseInt(playground.getAttribute("height")) - r;
        }
    }
    ball.setAttribute("cx", cx+dx*r);
    ball.setAttribute("cy", cy+dy*r);
}

function gameTick() {
    cx = parseInt(ball.getAttribute("cx"));
    cy = parseInt(ball.getAttribute("cy"));
    movePaddles();
    moveBall();
}
