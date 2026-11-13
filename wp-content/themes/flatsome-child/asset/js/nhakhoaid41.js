/* NỘI DUNG TRANG: chỉ xử lý slider, câu chuyện, bác sĩ, video, tab và popup. Nạp với defer. */

function id4HomeInit() {
    "use strict";
    const id4HomePage = document.querySelector("#-id4-home-main");
    if (!id4HomePage) return;
    // WordPress may wrap standalone controls and images in formatting paragraphs.
    id4HomePage.querySelectorAll("p:not([class]):not([id])").forEach((paragraph) => {
        const nodes = [...paragraph.childNodes];
        if (nodes.length && nodes.every((node) =>
            node.nodeType === Node.COMMENT_NODE ||
            (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) ||
            (node.nodeType === Node.ELEMENT_NODE && node.matches("img, a, button"))
        )) paragraph.replaceWith(...nodes);
    });

    // Dữ liệu và đường dẫn ảnh/video đọc trực tiếp từ HTML.
    const id4HomeVideoSource = id4HomePage.querySelector("[data-video-src]");
    const id4HomeContent = {
        journeyVideoUrl:
            (id4HomeVideoSource ? id4HomeVideoSource.dataset.videoSrc : "") || "",
        comparisons: [...id4HomePage.querySelectorAll("[data-comparison]")].map(
            (id4HomeButton) => ({
                id: id4HomeButton.dataset.comparison,
                image: id4HomeButton.querySelector("img").getAttribute("src"),
                title: id4HomeButton.dataset.comparisonTitle ||
                    id4HomeButton.querySelector("img").alt,
                summary: id4HomeButton.dataset.comparisonSummary || "",
                url: id4HomeButton.dataset.detailUrl || "",
            }),
        ),
        stories: [...id4HomePage.querySelectorAll("[data-portrait]")].map(
            (id4HomeButton) => ({
                id: id4HomeButton.dataset.portrait,
                title: id4HomeButton.dataset.storyTitle,
                summary: id4HomeButton.dataset.storySummary,
                url: id4HomeButton.dataset.detailUrl || "",
            }),
        ),
    };

    function id4HomeGetVideoUrl(id4HomeValue) {
        try {
            const id4HomeUrl = new URL(id4HomeValue, document.baseURI);
            if (!["https:", "http:", "file:"].includes(id4HomeUrl.protocol))
                return null;
            return /\.(mp4|webm|ogv)$/i.test(id4HomeUrl.pathname) ?
                id4HomeUrl.href :
                null;
        } catch {
            return null;
        }
    }

    function id4HomeCreateSlider(id4HomeRoot) {
        if (!id4HomeRoot) return;
        const id4HomeTrack = id4HomeRoot.querySelector(".-id4-home-slider-track");
        const id4HomeSlides = [...id4HomeTrack.children].filter((slide) => slide.matches(".-id4-home-slider-slide"));
        if (!id4HomeSlides.length) {
            id4HomeRoot.hidden = true;
            return;
        }
        const id4HomePrevious = id4HomeRoot.querySelector("[data-slider-prev]");
        const id4HomeNext = id4HomeRoot.querySelector("[data-slider-next]");
        const id4HomeDots = [...id4HomeRoot.querySelectorAll("[data-slider-dot]")];
        const id4HomeStatus = id4HomeRoot.querySelector("[data-slider-status]");
        let id4HomeIndex = 0;
        const id4HomeReducedMotion = window.matchMedia(
            "(prefers-reduced-motion:reduce)",
        );
        const id4HomeAutoplayDelay = Number(id4HomeRoot.dataset.autoplay) || 0;
        let id4HomeTimer;
        const id4HomeLoop =
            id4HomeRoot.dataset.loop === "true" && id4HomeSlides.length > 1;
        let id4HomePosition = id4HomeLoop ? 1 : 0;
        let id4HomeMoving = false;
        let id4HomeQueuedMove = null;
        if (id4HomeLoop) {
            const id4HomeClone = (id4HomeSlide) => {
                const id4HomeCopy = id4HomeSlide.cloneNode(true);
                id4HomeCopy.dataset.sliderClone = "";
                id4HomeCopy.setAttribute("aria-hidden", "true");
                id4HomeCopy.inert = true;
                id4HomeCopy
                    .querySelectorAll("[id]")
                    .forEach((id4HomeElement) => id4HomeElement.removeAttribute("id"));
                return id4HomeCopy;
            };
            id4HomeTrack.prepend(
                id4HomeClone(id4HomeSlides[id4HomeSlides.length - 1]),
            );
            id4HomeTrack.append(id4HomeClone(id4HomeSlides[0]));
        }

        function id4HomeResetBoundary() {
            if (!id4HomeLoop ||
                (id4HomePosition !== 0 && id4HomePosition !== id4HomeSlides.length + 1)
            )
                return;
            id4HomePosition = id4HomeIndex + 1;
            id4HomeTrack.style.transition = "none";
            id4HomeTrack.style.transform = `translate3d(${-100 * id4HomePosition}%, 0, 0)`;
            void id4HomeTrack.offsetWidth;
            id4HomeTrack.style.transition = "";
        }
        id4HomeTrack.addEventListener("transitionend", (id4HomeEvent) => {
            if (
                id4HomeEvent.target !== id4HomeTrack ||
                id4HomeEvent.propertyName !== "transform"
            )
                return;
            id4HomeMoving = false;
            id4HomeResetBoundary();
            if (id4HomeQueuedMove) {
                const id4HomeMove = id4HomeQueuedMove;
                id4HomeQueuedMove = null;
                id4HomeGoTo(id4HomeMove.value, id4HomeMove.announce);
            }
        });

        function id4HomeSchedule() {
            clearTimeout(id4HomeTimer);
            if (!id4HomeAutoplayDelay ||
                id4HomeSlides.length < 2 ||
                id4HomeStart ||
                document.hidden ||
                document.body.classList.contains("-id4-home-dialog-open") ||
                id4HomeReducedMotion.matches
            )
                return;
            id4HomeTimer = setTimeout(() => {
                id4HomeGoTo(id4HomeIndex + 1, false);
            }, id4HomeAutoplayDelay);
        }
        id4HomeRoot.dataset.single = String(id4HomeSlides.length < 2);

        function id4HomeGoTo(id4HomeValue, id4HomeAnnounce = true) {
            if (
                id4HomeLoop &&
                id4HomeMoving &&
                (id4HomePosition === 0 || id4HomePosition === id4HomeSlides.length + 1)
            ) {
                id4HomeQueuedMove = {
                    value: id4HomeValue,
                    announce: id4HomeAnnounce,
                };
                return;
            }
            id4HomeResetBoundary();
            id4HomeIndex =
                (id4HomeValue + id4HomeSlides.length) % id4HomeSlides.length;
            id4HomePosition = id4HomeLoop ?
                id4HomeValue < 0 ?
                0 :
                id4HomeValue >= id4HomeSlides.length ?
                id4HomeSlides.length + 1 :
                id4HomeIndex + 1 :
                id4HomeIndex;
            id4HomeTrack.style.transform = `translate3d(${-100 * id4HomePosition}%, 0, 0)`;
            id4HomeMoving = !id4HomeReducedMotion.matches;
            id4HomeSlides.forEach((id4HomeSlide, id4HomeI) => {
                const id4HomeActive = id4HomeI === id4HomeIndex;
                id4HomeSlide.dataset.slide = String(id4HomeI);
                id4HomeSlide.setAttribute("aria-hidden", String(!id4HomeActive));
                id4HomeSlide.inert = !id4HomeActive;
            });
            id4HomeDots.forEach((id4HomeDot, id4HomeI) =>
                id4HomeDot.setAttribute(
                    "aria-current",
                    String(id4HomeI === id4HomeIndex),
                ),
            );
            if (id4HomeStatus && id4HomeAnnounce)
                id4HomeStatus.textContent = `Slide ${id4HomeIndex + 1} / ${id4HomeSlides.length}`;
            if (id4HomeReducedMotion.matches) id4HomeResetBoundary();
            id4HomeSchedule();
        }
        id4HomePrevious.addEventListener("click", () =>
            id4HomeGoTo(id4HomeIndex - 1),
        );
        id4HomeNext.addEventListener("click", () => id4HomeGoTo(id4HomeIndex + 1));
        id4HomeDots.forEach((id4HomeDot, id4HomeI) =>
            id4HomeDot.addEventListener("click", () => id4HomeGoTo(id4HomeI)),
        );
        id4HomeRoot.addEventListener("keydown", (id4HomeEvent) => {
            if (/INPUT|TEXTAREA|SELECT/.test(id4HomeEvent.target.tagName)) return;
            if (id4HomeEvent.key === "ArrowLeft") {
                id4HomeEvent.preventDefault();
                id4HomeGoTo(id4HomeIndex - 1);
            }
            if (id4HomeEvent.key === "ArrowRight") {
                id4HomeEvent.preventDefault();
                id4HomeGoTo(id4HomeIndex + 1);
            }
            if (id4HomeEvent.key === "Home") {
                id4HomeEvent.preventDefault();
                id4HomeGoTo(0);
            }
            if (id4HomeEvent.key === "End") {
                id4HomeEvent.preventDefault();
                id4HomeGoTo(id4HomeSlides.length - 1);
            }
        });
        const id4HomeViewport = id4HomeRoot.querySelector(
            ".-id4-home-slider-viewport",
        );
        let id4HomeStart = null;
        let id4HomeSuppressClick = false;
        id4HomeViewport.addEventListener(
            "click",
            (id4HomeEvent) => {
                if (!id4HomeSuppressClick) return;
                id4HomeEvent.preventDefault();
                id4HomeEvent.stopPropagation();
                id4HomeSuppressClick = false;
            },
            true,
        );
        id4HomeViewport.addEventListener("pointerdown", (id4HomeEvent) => {
            const id4HomeImageButton =
                id4HomeEvent.target.closest("[data-comparison]");
            const id4HomeInteractive = id4HomeEvent.target.closest("button,a");
            if (
                (id4HomeInteractive &&
                    id4HomeInteractive.tagName === "BUTTON" &&
                    !id4HomeImageButton) ||
                (id4HomeEvent.pointerType === "mouse" && id4HomeEvent.button !== 0)
            )
                return;
            id4HomeSuppressClick = false;
            clearTimeout(id4HomeTimer);
            id4HomeStart = {
                x: id4HomeEvent.clientX,
                y: id4HomeEvent.clientY,
                id: id4HomeEvent.pointerId,
            };
            (id4HomeInteractive || id4HomeViewport).setPointerCapture(
                id4HomeEvent.pointerId,
            );
        });
        id4HomeViewport.addEventListener("pointerup", (id4HomeEvent) => {
            if (!id4HomeStart || id4HomeStart.id !== id4HomeEvent.pointerId) return;
            const id4HomeDx = id4HomeEvent.clientX - id4HomeStart.x,
                id4HomeDy = id4HomeEvent.clientY - id4HomeStart.y;
            id4HomeSuppressClick = Math.hypot(id4HomeDx, id4HomeDy) > 10;
            if (Math.abs(id4HomeDx) > 45 && Math.abs(id4HomeDx) > Math.abs(id4HomeDy))
                id4HomeGoTo(id4HomeIndex + (id4HomeDx < 0 ? 1 : -1));
            id4HomeStart = null;
            id4HomeSchedule();
        });
        id4HomeViewport.addEventListener("pointercancel", () => {
            id4HomeStart = null;
            id4HomeSuppressClick = false;
            id4HomeSchedule();
        });
        id4HomeViewport.addEventListener("dragstart", (id4HomeEvent) =>
            id4HomeEvent.preventDefault(),
        );
        if (id4HomeAutoplayDelay) {
            document.addEventListener("visibilitychange", id4HomeSchedule);
            id4HomeReducedMotion.addEventListener("change", () => {
                if (id4HomeReducedMotion.matches) {
                    id4HomeMoving = false;
                    id4HomeResetBoundary();
                    id4HomeQueuedMove = null;
                }
                id4HomeSchedule();
            });
            new MutationObserver(id4HomeSchedule).observe(document.body, {
                attributes: true,
                attributeFilter: ["class"],
            });
        }
        id4HomeTrack.style.transition = "none";
        id4HomeGoTo(0, false);
        void id4HomeTrack.offsetWidth;
        id4HomeTrack.style.transition = "";
        id4HomeMoving = false;
    }

    // Seek the existing CSS loop while dragging, preserving its speed and direction.
    function id4HomeEnableStorySwipe(id4HomeViewport) {
        const id4HomeTrack = id4HomeViewport.querySelector(
            ".-id4-home-story-track",
        );
        let id4HomeGesture = null;
        let id4HomeSuppressClick = false;
        id4HomeViewport.addEventListener(
            "click",
            (id4HomeEvent) => {
                if (!id4HomeSuppressClick) return;
                id4HomeEvent.preventDefault();
                id4HomeEvent.stopPropagation();
                id4HomeSuppressClick = false;
            },
            true,
        );
        id4HomeViewport.addEventListener("pointerdown", (id4HomeEvent) => {
            if (!id4HomeEvent.isPrimary ||
                (id4HomeEvent.pointerType === "mouse" && id4HomeEvent.button !== 0)
            )
                return;
            const id4HomeAnimation = id4HomeTrack.getAnimations()[0];
            // Dùng điều kiện thường thay optional chaining để trình soạn thảo cũ đọc được.
            const id4HomeAnimationTime = id4HomeAnimation ?
                id4HomeAnimation.currentTime :
                0;
            const id4HomeAnimationDuration =
                id4HomeAnimation && id4HomeAnimation.effect ?
                id4HomeAnimation.effect.getTiming().duration :
                0;
            id4HomeGesture = {
                id: id4HomeEvent.pointerId,
                x: id4HomeEvent.clientX,
                y: id4HomeEvent.clientY,
                animation: id4HomeAnimation,
                time: id4HomeAnimationTime || 0,
                duration: id4HomeAnimationDuration || 0,
                width: id4HomeTrack
                    .querySelector(".-id4-home-story-group")
                    .getBoundingClientRect().width,
                scroll: id4HomeViewport.scrollLeft,
            };
            id4HomeSuppressClick = false;
            id4HomeTrack.dataset.storyDragging = "true";
            (
                id4HomeEvent.target.closest("button") || id4HomeViewport
            ).setPointerCapture(id4HomeEvent.pointerId);
        });
        id4HomeViewport.addEventListener("pointermove", (id4HomeEvent) => {
            if (!id4HomeGesture || id4HomeGesture.id !== id4HomeEvent.pointerId)
                return;
            const id4HomeDx = id4HomeEvent.clientX - id4HomeGesture.x;
            const id4HomeDy = id4HomeEvent.clientY - id4HomeGesture.y;
            if (
                Math.abs(id4HomeDx) <= 10 ||
                Math.abs(id4HomeDx) < Math.abs(id4HomeDy)
            )
                return;
            id4HomeSuppressClick = true;
            if (id4HomeGesture.animation && id4HomeGesture.width) {
                const id4HomeTime =
                    id4HomeGesture.time -
                    (id4HomeDx / id4HomeGesture.width) * id4HomeGesture.duration;
                id4HomeGesture.animation.currentTime =
                    ((id4HomeTime % id4HomeGesture.duration) + id4HomeGesture.duration) %
                    id4HomeGesture.duration;
            } else {
                id4HomeViewport.scrollLeft = id4HomeGesture.scroll - id4HomeDx;
            }
        });
        const id4HomeRelease = (id4HomeEvent) => {
            if (!id4HomeGesture || id4HomeGesture.id !== id4HomeEvent.pointerId)
                return;
            id4HomeGesture = null;
            delete id4HomeTrack.dataset.storyDragging;
        };
        id4HomeViewport.addEventListener("pointerup", id4HomeRelease);
        id4HomeViewport.addEventListener("pointercancel", id4HomeRelease);
        id4HomeViewport.addEventListener("lostpointercapture", id4HomeRelease);
        id4HomeViewport.addEventListener("dragstart", (id4HomeEvent) =>
            id4HomeEvent.preventDefault(),
        );
    }


    if (!id4HomePage) return;
    const id4HomeDialogs = [...id4HomePage.querySelectorAll("dialog")];

    function id4HomeOpenDialog(id4HomeDialog) {
        id4HomeDialogs.forEach((id4HomeItem) => {
            if (id4HomeItem.open) id4HomeItem.close();
        });
        id4HomeDialog.showModal();
        document.body.classList.add("-id4-home-dialog-open");
    }
    id4HomeDialogs.forEach((id4HomeDialog) => {
        id4HomeDialog
            .querySelector(".-id4-home-dialog-close")
            .addEventListener("click", () => id4HomeDialog.close());
        id4HomeDialog.addEventListener("click", (id4HomeEvent) => {
            const id4HomeBox = id4HomeDialog.getBoundingClientRect();
            if (
                id4HomeEvent.target === id4HomeDialog &&
                (id4HomeEvent.clientX < id4HomeBox.left ||
                    id4HomeEvent.clientX > id4HomeBox.right ||
                    id4HomeEvent.clientY < id4HomeBox.top ||
                    id4HomeEvent.clientY > id4HomeBox.bottom)
            )
                id4HomeDialog.close();
        });
        id4HomeDialog.addEventListener("close", () => {
            if (!id4HomeDialogs.some((id4HomeItem) => id4HomeItem.open))
                document.body.classList.remove("-id4-home-dialog-open");
        });
    });
    // Chỉ khởi tạo các chức năng nội dung khi trang có đủ khối nội dung.

    // URL chi tiết đọc từ data-detail-url trong HTML; chỉ bật nút khi có link hợp lệ.
    function id4HomeSetDetailLink(id4HomeLink, id4HomeValue) {
        id4HomeLink.removeAttribute("href");
        id4HomeLink.setAttribute("aria-disabled", "true");
        id4HomeLink.tabIndex = -1;
        if (!id4HomeValue || !id4HomeValue.trim()) return;
        try {
            const id4HomeUrl = new URL(id4HomeValue, document.baseURI);
            if (!["http:", "https:", "file:"].includes(id4HomeUrl.protocol)) return;
            id4HomeLink.href = id4HomeUrl.href;
            id4HomeLink.removeAttribute("aria-disabled");
            id4HomeLink.removeAttribute("tabindex");
        } catch (id4HomeError) {
            // Giữ nút không điều hướng nếu URL chưa hợp lệ.
        }
    }

    function id4HomeOpenComparison(id4HomeComparisonId) {
        const id4HomeComparison =
            id4HomeContent.comparisons.find(
                (id4HomeItem) => id4HomeItem.id === id4HomeComparisonId,
            ) || id4HomeContent.comparisons[0];
        const id4HomeDialog = id4HomePage.querySelector(
            "#-id4-home-gallery-dialog",
        );
        id4HomeDialog.querySelector("#-id4-home-comparison-detail-image").src =
            id4HomeComparison.image;
        id4HomeDialog.querySelector("#-id4-home-comparison-detail-image").alt =
            id4HomeComparison.title;
        id4HomeDialog.querySelector("#-id4-home-gallery-dialog-title").textContent =
            id4HomeComparison.title;
        id4HomeDialog.querySelector(
            "#-id4-home-comparison-detail-text",
        ).textContent = id4HomeComparison.summary;
        id4HomeSetDetailLink(
            id4HomeDialog.querySelector("#-id4-home-comparison-detail-link"),
            id4HomeComparison.url,
        );
        id4HomeOpenDialog(id4HomeDialog);
    }
    id4HomePage
        .querySelector("#-id4-home-gallery-open")
        .addEventListener("click", () => {
            const id4HomeActive = id4HomePage.querySelector(
                '.-id4-home-comparison-slider [data-slide][aria-hidden="false"] [data-comparison]',
            );
            id4HomeOpenComparison(
                (id4HomeActive ? id4HomeActive.dataset.comparison : "") || "1",
            );
        });
    id4HomePage
        .querySelector(".-id4-home-comparison-slider")
        .addEventListener("click", (id4HomeEvent) => {
            const id4HomeButton = id4HomeEvent.target.closest("[data-comparison]");
            if (id4HomeButton)
                id4HomeOpenComparison(id4HomeButton.dataset.comparison);
        });
    id4HomeCreateSlider(
        id4HomePage.querySelector(".-id4-home-comparison-slider"),
    );
    const id4HomeStoryTrack = id4HomePage.querySelector(".-id4-home-story-track");
    const id4HomeStoryGroup = id4HomeStoryTrack.querySelector(
        ".-id4-home-story-group",
    );
    const id4HomeStoryLoop = id4HomeStoryGroup.cloneNode(true);
    id4HomeStoryLoop.setAttribute("aria-hidden", "true");
    id4HomeStoryLoop.querySelectorAll("button").forEach((id4HomeButton) => {
        id4HomeButton.tabIndex = -1;
    });
    id4HomeStoryTrack.append(id4HomeStoryLoop);
    id4HomeEnableStorySwipe(
        id4HomePage.querySelector(".-id4-home-stories-viewport"),
    );
    const id4HomeBackdrop = id4HomePage.querySelector(
        ".-id4-home-stories-backdrop",
    );
    id4HomeStoryGroup.querySelectorAll("img").forEach((id4HomeImage) => {
        const id4HomeCard = document.createElement("div");
        for (let id4HomeI = 0; id4HomeI < 2; id4HomeI++) {
            const id4HomeClone = id4HomeImage.cloneNode(true);
            id4HomeClone.alt = "";
            id4HomeCard.append(id4HomeClone);
        }
        id4HomeBackdrop.append(id4HomeCard);
    });
    // Các hồ sơ bác sĩ nằm trong HTML; JS chỉ tạo chấm điều hướng và chạy slider.
    const id4HomeDoctorSlides = [
        ...id4HomePage.querySelectorAll(
            ".-id4-home-doctor-slider .-id4-home-slider-track > article",
        ),
    ];
    id4HomeDoctorSlides.forEach((id4HomeSlide) => {
        const id4HomeDot = document.createElement("button");
        id4HomeDot.type = "button";
        id4HomeDot.dataset.sliderDot = "";
        id4HomeDot.setAttribute(
            "aria-label",
            "Hồ sơ " + id4HomeSlide.querySelector("h3").textContent,
        );
        id4HomePage.querySelector(".-id4-home-doctor-dots").append(id4HomeDot);
    });
    id4HomeCreateSlider(id4HomePage.querySelector(".-id4-home-doctor-slider"));
    const id4HomeDetailDialog = id4HomePage.querySelector(
        "#-id4-home-detail-dialog",
    );

    function id4HomeShowDetail(
        id4HomeTitle,
        id4HomeText,
        id4HomeImage = "",
        id4HomeAlt = "",
        id4HomeDetailUrl = "",
    ) {
        id4HomePage.querySelector("#-id4-home-detail-title").textContent =
            id4HomeTitle;
        id4HomePage.querySelector("#-id4-home-detail-text").textContent =
            id4HomeText;
        const id4HomeImageElement = id4HomePage.querySelector(
            "#-id4-home-detail-image",
        );
        id4HomeImageElement.hidden = !id4HomeImage;
        if (id4HomeImage) id4HomeImageElement.src = id4HomeImage;
        else id4HomeImageElement.removeAttribute("src");
        id4HomeImageElement.alt = id4HomeAlt;
        id4HomeSetDetailLink(
            id4HomePage.querySelector("#-id4-home-story-detail-link"),
            id4HomeDetailUrl,
        );
        id4HomeOpenDialog(id4HomeDetailDialog);
    }
    id4HomePage.querySelectorAll("[data-portrait]").forEach((id4HomeButton) =>
        id4HomeButton.addEventListener("click", () => {
            const id4HomeImg = id4HomeButton.querySelector("img");
            const id4HomeStory = id4HomeContent.stories.find(
                (id4HomeItem) => id4HomeItem.id === id4HomeButton.dataset.portrait,
            );
            id4HomeShowDetail(
                id4HomeStory ? id4HomeStory.title : "Nụ cười cùng nha khoa iD-4",
                id4HomeStory ?
                id4HomeStory.summary :
                "Mỗi nụ cười trở lại là một hành trình khác nhau.",
                id4HomeImg.getAttribute("src"),
                id4HomeImg.alt,
                id4HomeStory ? id4HomeStory.url : "",
            );
        }),
    );
    const id4HomeVideoPlayer = id4HomePage.querySelector(
        "#-id4-home-journey-player",
    );
    const id4HomeVideoOpen = id4HomePage.querySelector("#-id4-home-video-open");
    const id4HomeVideoReset = id4HomePage.querySelector("#-id4-home-video-reset");
    id4HomePage
        .querySelector("#-id4-home-video-open")
        .addEventListener("click", () => {
            const id4HomeVideoUrl = id4HomeGetVideoUrl(
                id4HomeContent.journeyVideoUrl,
            );
            id4HomeVideoPlayer.replaceChildren();
            id4HomeVideoPlayer.hidden = !id4HomeVideoUrl;
            id4HomePage.querySelector("#-id4-home-video-unavailable").hidden =
                Boolean(id4HomeVideoUrl);
            if (id4HomeVideoUrl) {
                const id4HomeVideo = document.createElement("video");
                id4HomeVideo.controls = true;
                id4HomeVideo.playsInline = true;
                id4HomeVideo.preload = "metadata";
                id4HomeVideo.setAttribute("aria-label", "Video mẫu minh họa");
                id4HomeVideo.src = id4HomeVideoUrl;
                id4HomeVideo.addEventListener("error", () => {
                    if (!id4HomeVideo.isConnected) return;
                    id4HomeVideoPlayer.replaceChildren();
                    id4HomeVideoPlayer.hidden = true;
                    id4HomeVideoOpen.hidden = false;
                    id4HomeVideoReset.hidden = true;
                    const id4HomeMessage = id4HomePage.querySelector(
                        "#-id4-home-video-unavailable",
                    );
                    id4HomeMessage.textContent =
                        "Không tải được video. Vui lòng bấm phát để thử lại.";
                    id4HomeMessage.hidden = false;
                    id4HomeVideoOpen.title = "Không tải được video. Bấm để thử lại.";
                });
                id4HomeVideoPlayer.append(id4HomeVideo);
                id4HomeVideoOpen.hidden = true;
                id4HomeVideoReset.hidden = false;
                id4HomeVideo.focus();
                id4HomeVideo.play().catch(() => {});
            }
        });
    id4HomeVideoReset.addEventListener("click", () => {
        const id4HomeVideo = id4HomeVideoPlayer.querySelector("video");
        if (id4HomeVideo) {
            id4HomeVideo.pause();
            id4HomeVideo.removeAttribute("src");
            id4HomeVideo.load();
        }
        id4HomeVideoPlayer.replaceChildren();
        id4HomeVideoPlayer.hidden = true;
        id4HomeVideoOpen.hidden = false;
        id4HomeVideoReset.hidden = true;
        id4HomeVideoOpen.focus();
    });
    const id4HomeTabs = [...id4HomePage.querySelectorAll('[role="tab"]')];

    function id4HomeActivateTab(id4HomeTab, id4HomeMoveFocus = false) {
        id4HomeTabs.forEach((id4HomeItem) => {
            const id4HomeActive = id4HomeItem === id4HomeTab;
            id4HomeItem.setAttribute("aria-selected", String(id4HomeActive));
            id4HomeItem.tabIndex = id4HomeActive ? 0 : -1;
            document.getElementById(
                id4HomeItem.getAttribute("aria-controls"),
            ).hidden = !id4HomeActive;
        });
        if (id4HomeMoveFocus) id4HomeTab.focus();
    }
    id4HomeTabs.forEach((id4HomeTab, id4HomeIndex) => {
        id4HomeTab.addEventListener("click", () => id4HomeActivateTab(id4HomeTab));
        id4HomeTab.addEventListener("keydown", (id4HomeEvent) => {
            let id4HomeNext;
            if (id4HomeEvent.key === "ArrowRight")
                id4HomeNext = (id4HomeIndex + 1) % id4HomeTabs.length;
            if (id4HomeEvent.key === "ArrowLeft")
                id4HomeNext =
                (id4HomeIndex + id4HomeTabs.length - 1) % id4HomeTabs.length;
            if (id4HomeEvent.key === "Home") id4HomeNext = 0;
            if (id4HomeEvent.key === "End") id4HomeNext = id4HomeTabs.length - 1;
            if (id4HomeNext !== undefined) {
                id4HomeEvent.preventDefault();
                id4HomeActivateTab(id4HomeTabs[id4HomeNext], true);
            }
        });
    });

    id4HomePage
        .querySelectorAll("[data-tech], [data-image]")
        .forEach((id4HomeButton) =>
            id4HomeButton.addEventListener("click", () => {
                const id4HomeSource = id4HomeButton.querySelector("img");
                const id4HomeImage = id4HomePage.querySelector(
                    "#-id4-home-enlarged-image",
                );
                id4HomeImage.src = id4HomeSource.getAttribute("src");
                id4HomeImage.alt = id4HomeSource.alt;
                id4HomePage.querySelector("#-id4-home-image-title").textContent =
                    id4HomeSource.alt;
                id4HomeOpenDialog(id4HomePage.querySelector("#-id4-home-image-dialog"));
            }),
        );

}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", id4HomeInit, { once: true });
} else {
    id4HomeInit();
}
