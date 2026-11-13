(() => {
    "use strict";

    function cnktInit() {
        const cnktPage = document.getElementById("cnkt--part-07");
        if (!cnktPage || cnktPage.dataset.cnktInitialized) return;
        cnktPage.dataset.cnktInitialized = "true";

        // WordPress may wrap standalone controls and images in formatting paragraphs.
        cnktPage
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

        const cnktDialogs = [...cnktPage.querySelectorAll("dialog")];

        function cnktOpenDialog(cnktDialog) {
            cnktDialogs.forEach((cnktItem) => {
                if (cnktItem.open) cnktItem.close();
            });
            cnktDialog.showModal();
            document.body.classList.add("cnkt--dialog-open");
        }
        cnktDialogs.forEach((cnktDialog) => {
            cnktDialog
                .querySelector(".cnkt--dialog-close")
                .addEventListener("click", () => cnktDialog.close());
            cnktDialog.addEventListener("click", (cnktEvent) => {
                const cnktBox = cnktDialog.getBoundingClientRect();
                if (
                    cnktEvent.target === cnktDialog &&
                    (cnktEvent.clientX < cnktBox.left ||
                        cnktEvent.clientX > cnktBox.right ||
                        cnktEvent.clientY < cnktBox.top ||
                        cnktEvent.clientY > cnktBox.bottom)
                )
                    cnktDialog.close();
            });
            cnktDialog.addEventListener("close", () => {
                if (!document.querySelector(".cnkt--part dialog[open]"))
                    document.body.classList.remove("cnkt--dialog-open");
            });
        });

        const cnktTabs = [...cnktPage.querySelectorAll('[role="tab"]')];

        function cnktActivateTab(cnktTab, cnktMoveFocus = false) {
            cnktTabs.forEach((cnktItem) => {
                const cnktActive = cnktItem === cnktTab;
                cnktItem.setAttribute("aria-selected", String(cnktActive));
                cnktItem.tabIndex = cnktActive ? 0 : -1;
                cnktPage.querySelector("#" + cnktItem.getAttribute("aria-controls")).hidden = !cnktActive;
            });
            if (cnktMoveFocus) cnktTab.focus();
        }
        cnktTabs.forEach((cnktTab, cnktIndex) => {
            cnktTab.addEventListener("click", () => cnktActivateTab(cnktTab));
            cnktTab.addEventListener("keydown", (cnktEvent) => {
                let cnktNext;
                if (cnktEvent.key === "ArrowRight")
                    cnktNext = (cnktIndex + 1) % cnktTabs.length;
                if (cnktEvent.key === "ArrowLeft")
                    cnktNext =
                    (cnktIndex + cnktTabs.length - 1) % cnktTabs.length;
                if (cnktEvent.key === "Home") cnktNext = 0;
                if (cnktEvent.key === "End") cnktNext = cnktTabs.length - 1;
                if (cnktNext !== undefined) {
                    cnktEvent.preventDefault();
                    cnktActivateTab(cnktTabs[cnktNext], true);
                }
            });
        });

        cnktPage
            .querySelectorAll("[data-tech], [data-image]")
            .forEach((cnktButton) =>
                cnktButton.addEventListener("click", () => {
                    const cnktSource = cnktButton.querySelector("img");
                    const cnktImage = cnktPage.querySelector(
                        "#cnkt--enlarged-image",
                    );
                    cnktImage.src = cnktSource.getAttribute("src");
                    cnktImage.alt = cnktSource.alt;
                    cnktPage.querySelector("#cnkt--image-title").textContent =
                        cnktSource.alt;
                    cnktOpenDialog(cnktPage.querySelector("#cnkt--image-dialog"));
                }),
            );
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", cnktInit, { once: true });
    } else {
        cnktInit();
    }
})();