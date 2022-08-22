// ==UserScript==
// @name         禁用S1繁简转换
// @license      GPL v3
// @namespace    http://tampermonkey.net/
// @version      0.132
// @description  禁用S1的繁简转换功能
// @author       unlsycn
// @require      https://cdn.jsdelivr.net/gh/mathiasbynens/he@36afe179392226cf1b6ccdb16ebbb7a5a844d93a/he.min.js
// @match        https://bbs.saraba1st.com/2b/*
// @icon         https://bbs.saraba1st.com/favicon.ico
// ==/UserScript==

(function () {
    "use strict";
    function substituteText(elementId) {
        document.getElementById(elementId).value = he.encode(
            document.getElementById(elementId).value,
            {
                allowUnsafeSymbols: true,
            }
        );
    }

    // 替换标题
    let subject = document.getElementById("subject");
    let subjectCheckBox = document.createElement("input");
    subjectCheckBox.setAttribute("id", "is-substitute-subject");
    subjectCheckBox.setAttribute("type", "checkbox");
    subjectCheckBox.setAttribute("title", "标题禁用繁简转换");
    if (subject) {
        console.log("subject");
        subject.parentNode.insertBefore(subjectCheckBox, subject.nextSibling);
    }
    function SubstituteSubject() {
        if (subjectCheckBox.checked) {
            substituteText("subject");
        }
    }

    // 快速回贴/发帖
    if (document.getElementById("fastpostsubmit")) {
        document
            .getElementById("fastpostsubmit")
            .addEventListener("click", () => {
                substituteText("fastpostmessage");
                SubstituteSubject();
            });
    }

    // 编辑器
    if (document.getElementById("e_iframe")) {
        document.getElementById("postsubmit").addEventListener("click", () => {
            SubstituteSubject();
            switchEditor(0); // 切换到纯文本模式
            substituteText("e_textarea");
        });
    }

    // 回帖窗体
    const appendNode = document.getElementById("append_parent");
    const observationConfig = {
        childList: true,
        subtree: true,
    };
    const callback = function (mutationsList) {
        for (let mutation of mutationsList) {
            if (
                mutation.type === "childList" &&
                mutation.addedNodes.length > 0 &&
                mutation.addedNodes[0].id === "fctrl_reply" // 监视回复窗体的添加
            ) {
                document
                    .getElementById("postsubmit")
                    .addEventListener("click", () => {
                        substituteText("postmessage");
                    });
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(appendNode, observationConfig);
})();
