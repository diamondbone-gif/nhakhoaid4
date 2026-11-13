(() => {
    "use strict";

    function cckhInit() {
        const cckhPage = document.getElementById("cckh--part-02");
        if (!cckhPage || cckhPage.dataset.cckhInitialized) return;
        cckhPage.dataset.cckhInitialized = "true";

        // WordPress may wrap standalone controls and images in formatting paragraphs.
        cckhPage
            .querySelectorAll("p:not([class]):not([id])")
            .forEach((paragraph) => {
                const nodes = [...paragraph.childNodes];
                if (
                    nodes.length &&
                    nodes.every(
                        (node) =>
                        node.nodeType === Node.COMMENT_NODE ||
                        (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) ||
                        (node.nodeType === Node.ELEMENT_NODE &&
                            node.matches("img, a, button")),
                    )
                )
                    paragraph.replaceWith(...nodes);
            });

        const cckhContent = {
            stories: [...cckhPage.querySelectorAll("[data-portrait]")].map(
                (cckhButton) => ({
                    id: cckhButton.dataset.portrait,
                    title: cckhButton.dataset.storyTitle,
                    summary: cckhButton.dataset.storySummary,
                    url: cckhButton.dataset.detailUrl || "",
                }),
            ),
        };

        function cckhEnableStorySwipe(cckhViewport) {
            const cckhTrack = cckhViewport.querySelector(
                ".cckh--story-track",
            );
            let cckhGesture = null;
            let cckhSuppressClick = false;
            cckhViewport.addEventListener(
                "click",
                (cckhEvent) => {
                    if (!cckhSuppressClick) return;
                    cckhEvent.preventDefault();
                    cckhEvent.stopPropagation();
                    cckhSuppressClick = false;
                },
                true,
            );
            cckhViewport.addEventListener("pointerdown", (cckhEvent) => {
                if (!cckhEvent.isPrimary ||
                    (cckhEvent.pointerType === "mouse" && cckhEvent.button !== 0)
                )
                    return;
                const cckhAnimation = cckhTrack.getAnimations()[0];
                // Dùng điều kiện thường thay optional chaining để trình soạn thảo cũ đọc được.
                const cckhAnimationTime = cckhAnimation ?
                    cckhAnimation.currentTime :
                    0;
                const cckhAnimationDuration =
                    cckhAnimation && cckhAnimation.effect ?
                    cckhAnimation.effect.getTiming().duration :
                    0;
                cckhGesture = {
                    id: cckhEvent.pointerId,
                    x: cckhEvent.clientX,
                    y: cckhEvent.clientY,
                    animation: cckhAnimation,
                    time: cckhAnimationTime || 0,
                    duration: cckhAnimationDuration || 0,
                    width: cckhTrack
                        .querySelector(".cckh--story-group")
                        .getBoundingClientRect().width,
                    scroll: cckhViewport.scrollLeft,
                };
                cckhSuppressClick = false;
                cckhTrack.dataset.storyDragging = "true";
                (
                    cckhEvent.target.closest("button") || cckhViewport
                ).setPointerCapture(cckhEvent.pointerId);
            });
            cckhViewport.addEventListener("pointermove", (cckhEvent) => {
                if (!cckhGesture || cckhGesture.id !== cckhEvent.pointerId)
                    return;
                const cckhDx = cckhEvent.clientX - cckhGesture.x;
                const cckhDy = cckhEvent.clientY - cckhGesture.y;
                if (
                    Math.abs(cckhDx) <= 10 ||
                    Math.abs(cckhDx) < Math.abs(cckhDy)
                )
                    return;
                cckhSuppressClick = true;
                if (cckhGesture.animation && cckhGesture.width) {
                    const cckhTime =
                        cckhGesture.time -
                        (cckhDx / cckhGesture.width) * cckhGesture.duration;
                    cckhGesture.animation.currentTime =
                        ((cckhTime % cckhGesture.duration) +
                            cckhGesture.duration) %
                        cckhGesture.duration;
                } else {
                    cckhViewport.scrollLeft = cckhGesture.scroll - cckhDx;
                }
            });
            const cckhRelease = (cckhEvent) => {
                if (!cckhGesture || cckhGesture.id !== cckhEvent.pointerId)
                    return;
                cckhGesture = null;
                delete cckhTrack.dataset.storyDragging;
            };
            cckhViewport.addEventListener("pointerup", cckhRelease);
            cckhViewport.addEventListener("pointercancel", cckhRelease);
            cckhViewport.addEventListener("lostpointercapture", cckhRelease);
            cckhViewport.addEventListener("dragstart", (cckhEvent) =>
                cckhEvent.preventDefault(),
            );
        }

        const cckhDialogs = [...cckhPage.querySelectorAll("dialog")];

        function cckhOpenDialog(cckhDialog) {
            cckhDialogs.forEach((cckhItem) => {
                if (cckhItem.open) cckhItem.close();
            });
            cckhDialog.showModal();
            document.body.classList.add("cckh--dialog-open");
        }
        cckhDialogs.forEach((cckhDialog) => {
            cckhDialog
                .querySelector(".cckh--dialog-close")
                .addEventListener("click", () => cckhDialog.close());
            cckhDialog.addEventListener("click", (cckhEvent) => {
                const cckhBox = cckhDialog.getBoundingClientRect();
                if (
                    cckhEvent.target === cckhDialog &&
                    (cckhEvent.clientX < cckhBox.left ||
                        cckhEvent.clientX > cckhBox.right ||
                        cckhEvent.clientY < cckhBox.top ||
                        cckhEvent.clientY > cckhBox.bottom)
                )
                    cckhDialog.close();
            });
            cckhDialog.addEventListener("close", () => {
                if (!document.querySelector(".cckh--part dialog[open]"))
                    document.body.classList.remove("cckh--dialog-open");
            });
        });

        function cckhSetDetailLink(cckhLink, cckhValue) {
            cckhLink.removeAttribute("href");
            cckhLink.setAttribute("aria-disabled", "true");
            cckhLink.tabIndex = -1;
            if (!cckhValue || !cckhValue.trim()) return;
            try {
                const cckhUrl = new URL(cckhValue, document.baseURI);
                if (!["http:", "https:", "file:"].includes(cckhUrl.protocol)) return;
                cckhLink.href = cckhUrl.href;
                cckhLink.removeAttribute("aria-disabled");
                cckhLink.removeAttribute("tabindex");
            } catch (cckhError) {
                // Giữ nút không điều hướng nếu URL chưa hợp lệ.
            }
        }

        const cckhStoryTrack = cckhPage.querySelector(
            ".cckh--story-track",
        );
        const cckhStoryGroup = cckhStoryTrack.querySelector(
            ".cckh--story-group",
        );
        const cckhStoryLoop = cckhStoryGroup.cloneNode(true);
        cckhStoryLoop.setAttribute("aria-hidden", "true");
        cckhStoryLoop.querySelectorAll("button").forEach((cckhButton) => {
            cckhButton.tabIndex = -1;
        });
        cckhStoryTrack.append(cckhStoryLoop);
        cckhEnableStorySwipe(
            cckhPage.querySelector(".cckh--stories-viewport"),
        );
        const cckhBackdrop = cckhPage.querySelector(
            ".cckh--stories-backdrop",
        );
        cckhStoryGroup.querySelectorAll("img").forEach((cckhImage) => {
            const cckhCard = document.createElement("div");
            for (let cckhI = 0; cckhI < 2; cckhI++) {
                const cckhClone = cckhImage.cloneNode(true);
                cckhClone.alt = "";
                cckhCard.append(cckhClone);
            }
            cckhBackdrop.append(cckhCard);
        });

        const cckhDetailDialog = cckhPage.querySelector(
            "#cckh--detail-dialog",
        );

        function cckhShowDetail(
            cckhTitle,
            cckhText,
            cckhImage = "",
            cckhAlt = "",
            cckhDetailUrl = "",
        ) {
            cckhPage.querySelector("#cckh--detail-title").textContent =
                cckhTitle;
            cckhPage.querySelector("#cckh--detail-text").textContent =
                cckhText;
            const cckhImageElement = cckhPage.querySelector(
                "#cckh--detail-image",
            );
            cckhImageElement.hidden = !cckhImage;
            if (cckhImage) cckhImageElement.src = cckhImage;
            else cckhImageElement.removeAttribute("src");
            cckhImageElement.alt = cckhAlt;
            cckhSetDetailLink(
                cckhPage.querySelector("#cckh--story-detail-link"),
                cckhDetailUrl,
            );
            cckhOpenDialog(cckhDetailDialog);
        }
        cckhPage.querySelectorAll("[data-portrait]").forEach((cckhButton) =>
            cckhButton.addEventListener("click", () => {
                const cckhImg = cckhButton.querySelector("img");
                const cckhStory = cckhContent.stories.find(
                    (cckhItem) => cckhItem.id === cckhButton.dataset.portrait,
                );
                cckhShowDetail(
                    cckhStory ? cckhStory.title : "Nụ cười cùng nha khoa iD-4",
                    cckhStory ?
                    cckhStory.summary :
                    "Mỗi nụ cười trở lại là một hành trình khác nhau.",
                    cckhImg.getAttribute("src"),
                    cckhImg.alt,
                    cckhStory ? cckhStory.url : "",
                );
            }),
        );
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", cckhInit, { once: true });
    } else {
        cckhInit();
    }
})();