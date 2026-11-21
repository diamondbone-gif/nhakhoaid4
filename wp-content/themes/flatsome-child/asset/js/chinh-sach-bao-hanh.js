const reducedWarrantyMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
);

document.querySelectorAll(".id4-solution--warranty-panel").forEach((panel) => {
    const tabs = [...panel.querySelectorAll("details")];
    let requestedTab = tabs.find((tab) => tab.open);
    let activeAnimation;

    async function animateTab(tab, expand) {
        const content = tab.querySelector(".id4-solution--warranty-copy");
        const style = getComputedStyle(content);
        const collapsed = {
            height: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
        };
        const start = tab.open ?
            {
                height: style.height,
                paddingTop: style.paddingTop,
                paddingBottom: style.paddingBottom,
            } :
            collapsed;
        if (activeAnimation) {
            activeAnimation.cancel();
            activeAnimation = undefined;
        }
        content.removeAttribute("data-warranty-animating");
        tab.open = true;

        if (reducedWarrantyMotion.matches || !content.getAnimations) {
            tab.open = expand;
            return true;
        }

        const full = getComputedStyle(content);
        const fullHeight = full.height;
        const end = expand ?
            {
                height: fullHeight,
                paddingTop: full.paddingTop,
                paddingBottom: full.paddingBottom,
            } :
            collapsed;
        for (const [edge, size] of[["from", start], ["to", end]]) {
            content.style.setProperty("--id4-warranty-" + edge + "-height", size.height);
            content.style.setProperty("--id4-warranty-" + edge + "-padding-top", size.paddingTop);
            content.style.setProperty("--id4-warranty-" + edge + "-padding-bottom", size.paddingBottom);
        }

        content.setAttribute("data-warranty-animating", expand ? "open" : "close");
        const animation = content.getAnimations().find(
            (item) => item.animationName === "id4-warranty-toggle",
        );
        activeAnimation = animation;

        if (animation) {
            try {
                await animation.finished;
            } catch {
                if (activeAnimation !== animation) return false;
            }
        }

        tab.open = expand;
        content.removeAttribute("data-warranty-animating");
        activeAnimation = undefined;
        return true;
    }

    tabs.forEach((tab) => {
        tab.querySelector("summary").addEventListener("click", async(event) => {
            event.preventDefault();
            requestedTab = requestedTab === tab ? undefined : tab;
            const next = requestedTab;
            const current = tabs.find((item) => item.open);
            if (current && current !== next && !(await animateTab(current, false)))
                return;
            if (next) await animateTab(next, true);
        });
    });
});