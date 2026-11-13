(() => {
    "use strict";

    function id4HomeInit() {
        const id4HomePage = document.getElementById("-id4-home-part-01");
        if (!id4HomePage || id4HomePage.dataset.id4Initialized) return;
        id4HomePage.dataset.id4Initialized = "true";

        // WordPress may wrap standalone controls and images in formatting paragraphs.
        id4HomePage
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

        const id4HomeContent = {
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
        };

        function id4HomeCreateSlider(id4HomeRoot) {
            if (!id4HomeRoot) return;
            const id4HomeTrack = id4HomeRoot.querySelector(".-id4-home-slider-track");
            const id4HomeSlides = [...id4HomeTrack.children].filter((slide) =>
                slide.matches(".-id4-home-slider-slide"),
            );
            if (!id4HomeSlides.length) {
                id4HomeRoot.hidden = true;
                return;
            }
            const id4HomePrevious = id4HomeRoot.querySelector("[data-slider-prev]");
            const id4HomeNext = id4HomeRoot.querySelector("[data-slider-next]");
            const id4HomeDots = [
                ...id4HomeRoot.querySelectorAll("[data-slider-dot]"),
            ];
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
                    (id4HomePosition !== 0 &&
                        id4HomePosition !== id4HomeSlides.length + 1)
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
                    (id4HomePosition === 0 ||
                        id4HomePosition === id4HomeSlides.length + 1)
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
            id4HomeNext.addEventListener("click", () =>
                id4HomeGoTo(id4HomeIndex + 1),
            );
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
                if (
                    Math.abs(id4HomeDx) > 45 &&
                    Math.abs(id4HomeDx) > Math.abs(id4HomeDy)
                )
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
                if (!document.querySelector(".-id4-home-part dialog[open]"))
                    document.body.classList.remove("-id4-home-dialog-open");
            });
        });

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
            id4HomeDialog.querySelector(
                "#-id4-home-gallery-dialog-title",
            ).textContent = id4HomeComparison.title;
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
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", id4HomeInit, { once: true });
    } else {
        id4HomeInit();
    }
})();