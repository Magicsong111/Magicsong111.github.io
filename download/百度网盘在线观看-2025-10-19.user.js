// ==UserScript==
// @name         百度网盘在线观看
// @namespace    http://tampermonkey.net/
// @version      2025-10-19
// @description  try to take over the world!
// @author       You
// @match        *://pan.baidu.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        // 执行某些操作
        let video = document.querySelectorAll("#html5player_html5_api")[0];
    video.controls="true";
    video.pause=null;
    document.querySelectorAll("#html5player > div.vjs-control-bar")[0].style.display = "none";
    document.querySelectorAll("#video-wrap-outer > div.video-overlay-iframe")[0].style.display = "none";
    let e = document.getElementsByClassName('video-start-btn-tip')[0];
    e.parentNode.removeChild(e);
    e = document.getElementsByClassName('video-overlay-iframe')[0];
    e.parentNode.removeChild(e);
    };
    // Your code here...
})();