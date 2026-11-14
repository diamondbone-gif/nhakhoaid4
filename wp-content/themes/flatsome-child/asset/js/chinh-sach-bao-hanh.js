const reducedWarrantyMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
);
const warrantyDuration = 760;

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
        const start = tab.open ? {
                height: style.height,
                paddingTop: style.paddingTop,
                paddingBottom: style.paddingBottom,
            } :
            collapsed;
        if (activeAnimation) {
            activeAnimation.cancel();
        }
        tab.open = true;

        if (reducedWarrantyMotion.matches || !content.animate) {
            tab.open = expand;
            return true;
        }

        const full = getComputedStyle(content);
        const end = expand ? {
                height: full.height,
                paddingTop: full.paddingTop,
                paddingBottom: full.paddingBottom,
            } :
            collapsed;
        const animation = content.animate(
            [
                {...start, overflow: "hidden" },
                {...end, overflow: "hidden" },
            ], {
                duration: warrantyDuration,
                easing: "cubic-bezier(.45, 0, .55, 1)",
                fill: "forwards",
            },
        );
        activeAnimation = animation;

        try {
            await animation.finished;
        } catch {
            return false;
        }

        tab.open = expand;
        animation.cancel();
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