(() => {
    const header = document.getElementById("header");
    const timelines = document.querySelectorAll(".about-us--timeline");

    if (!header || !timelines.length) return;

    function updateTimelinePin() {
        const { top } = window.getComputedStyle(header);
        const height = header.getBoundingClientRect().height;
        const offset = Math.max(0, height + (Number.parseFloat(top) || 0));

        for (const timeline of timelines) {
            timeline.style.setProperty("--about-us--pin", offset + "px");
        }
    }

    updateTimelinePin();
    window.addEventListener("resize", updateTimelinePin);

    if ("ResizeObserver" in window) {
        new ResizeObserver(updateTimelinePin).observe(header);
    }
})();