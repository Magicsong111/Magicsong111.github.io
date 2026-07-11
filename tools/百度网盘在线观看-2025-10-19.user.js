// ==UserScript==
// @name         百度网盘在线观看
// @namespace    http://tampermonkey.net/
// @version      2025-10-19
// @description  不用将视频转存在我的网盘中，而是可以直接播放。由于没有测试过未登录用户是否可以播放，请使用前先登录。由于手机网页端和电脑并不相同，使用手机端的Edge时请打开“以桌面网站查看”
// @author       MagicSong
// @match        *://pan.baidu.com/s/*
// @icon         https://api.afmax.cn/so/ico/index.php?r=https://pan.baidu.com/
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 核心功能：启用原生控件、隐藏百度自定义控制栏、移除干扰元素
     */
    function enhanceVideoPlayer() {
        try {
            // 获取 video 元素并启用原生控件
            const video = document.querySelector('#html5player_html5_api');
            if (video) {
                video.controls = true;
            }

            // 隐藏百度自定义控制栏（如果存在）
            const controlBar = document.querySelector('#html5player > div.vjs-control-bar');
            if (controlBar) {
                controlBar.style.display = 'none';
            }

            // 隐藏特定的覆盖层（通过 ID 和类名）
            const overlayIframe = document.querySelector('#video-wrap-outer > div.video-overlay-iframe');
            if (overlayIframe) {
                overlayIframe.style.display = 'none';
            }

            // 移除开始按钮提示（动态出现的元素）
            const startTip = document.querySelector('.video-start-btn-tip');
            if (startTip && startTip.parentNode) {
                startTip.parentNode.removeChild(startTip);
            }

            // 移除其他可能的覆盖层
            const overlay = document.querySelector('.video-overlay-iframe');
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        } catch (e) {
            console.error('百度网盘增强脚本出错:', e);
        }
    }

    /**
     * 使用 MutationObserver 监听 DOM 变化，确保动态加载的元素也能被处理
     */
    function observeAndEnhance() {
        // 立即执行一次，以防元素已经存在
        enhanceVideoPlayer();

        // 设置观察器，当子节点变化时再次尝试增强
        const observer = new MutationObserver(() => {
            enhanceVideoPlayer();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // 启动脚本：等待 DOM 加载完成后添加样式并开始观察
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observeAndEnhance();
        });
    } else {
        observeAndEnhance();
    }

})();