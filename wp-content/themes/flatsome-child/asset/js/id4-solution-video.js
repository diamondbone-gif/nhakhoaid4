(() => {
    "use strict";

    function getYouTubeEmbedUrl(link) {
        let url;
        try {
            url = new URL(link);
        } catch {
            return null;
        }

        if (url.protocol !== "https:" && url.protocol !== "http:") return null;

        let videoId;
        if (url.hostname === "youtu.be") {
            const match = url.pathname.match(/^\/([\w-]{11})\/?$/);
            if (match) videoId = match[1];
        } else if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
            if (url.pathname === "/watch") {
                videoId = url.searchParams.get("v");
            } else {
                const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})\/?$/);
                if (match) videoId = match[1];
            }
        }

        if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null;
        return new URL("https://www.youtube.com/embed/" + videoId + "?playsinline=1");
    }

    function id4HomeInit() {
        const id4HomePage = document.getElementById("-id4-home-part-06");
        if (!id4HomePage || id4HomePage.dataset.id4Initialized) return;
        id4HomePage.dataset.id4Initialized = "true";

        const id4HomeVideoPlayer = id4HomePage.querySelector("#-id4-home-journey-player");
        if (!id4HomeVideoPlayer || !id4HomeVideoPlayer.matches("iframe")) return;

        const embedUrl = getYouTubeEmbedUrl(id4HomeVideoPlayer.dataset.youtubeUrl);
        if (!embedUrl) return;

        id4HomeVideoPlayer.src = embedUrl.href;
        if ("IntersectionObserver" in window) {
            const id4HomeVideoObserver = new IntersectionObserver((entries, observer) => {
                if (!entries.some((entry) => entry.intersectionRatio >= 0.51)) return;
                observer.disconnect();
                const id4HomeVideoUrl = new URL(id4HomeVideoPlayer.src);
                id4HomeVideoUrl.searchParams.set("autoplay", "1");
                id4HomeVideoUrl.searchParams.set("mute", "1");
                id4HomeVideoPlayer.src = id4HomeVideoUrl.href;
            }, { threshold: 0.51 });
            id4HomeVideoObserver.observe(id4HomeVideoPlayer);
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", id4HomeInit, { once: true });
    } else {
        id4HomeInit();
    }
})();