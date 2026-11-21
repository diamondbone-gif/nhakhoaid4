(() => {
    "use strict";

    // THÊM VIDEO: dán link YouTube vào một dòng mới trong danh sách bên dưới.
    // 'https://youtu.be/ID_VIDEO',
    // Có thể thêm nội dung riêng bằng dạng:
    // { url: 'https://youtu.be/ID_VIDEO', title: 'Tiêu đề', description: 'Mô tả', image: 'anh-bia.jpg' },
    // Chỉ url là bắt buộc. Ảnh bìa mặc định lấy từ YouTube.
    const videos = [{
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            category: "CÂU CHUYỆN KHÁCH HÀNG",
            title: "Làm đẹp nụ cười của Naomi",
            description: "Naomi Threadgate · Thay đổi nụ cười, Hà Nội",
        },
        {
            url: "https://www.youtube.com/watch?v=hbGfx3y4VSQ",
            category: "RĂNG SỨ THẨM MỸ",
            title: "Răng sứ và mặt dán sứ của Nils",
            description: "Nils Sengers · Mão răng và mặt dán veneer",
        },
        {
            url: "https://www.youtube.com/watch?v=hbGfx3y4VSQ",
            category: "CẢI THIỆN NỤ CƯỜI",
            title: "Làm đẹp nụ cười của Christine",
            description: "Christine Fensom · Cải thiện nụ cười",
        },
        {
            url: "https://www.youtube.com/watch?v=hbGfx3y4VSQ",
            category: "DU LỊCH NHA KHOA",
            title: "Từ Úc đến Việt Nam: Chuyến đi có đáng giá không?",
            description: "Bệnh nhân người Úc · Du lịch nha khoa",
        },
        {
            url: "https://www.youtube.com/watch?v=hbGfx3y4VSQ",
            category: "DÁN SỨ VENEER",
            title: "8 lớp phủ veneer, từ Paris đến Hà Nội",
            description: "Bệnh nhân Paris · Veneer, Hà Nội",
        },
        {
            url: "https://www.youtube.com/watch?v=hbGfx3y4VSQ",
            category: "ĐÁNH GIÁ DỊCH VỤ",
            title: "“Quyết định tuyệt vời nhất từ trước đến nay”",
            description: "Review du lịch nha khoa · Đà Nẵng",
        },
    ];

    const gallery = document.querySelector(".video-gallery");
    const dialog = document.querySelector(".video-dialog");
    const title = document.querySelector("#video-dialog-title");
    const player = document.querySelector(".video-player");
    const external = document.querySelector(".video-external");
    let activeCard;

    function getYouTubeId(href) {
        if (typeof href !== "string") return null;
        let url;
        try {
            url = new URL(href.trim());
        } catch {
            return null;
        }
        if (url.protocol !== "https:") return null;
        const path = url.pathname.split("/");
        let id;
        if (url.hostname === "youtu.be") {
            id = path[1];
        } else if (
            [
                "www.youtube.com",
                "youtube.com",
                "m.youtube.com",
                "www.youtube-nocookie.com",
            ].includes(url.hostname)
        ) {
            if (url.pathname === "/watch") id = url.searchParams.get("v");
            if (["embed", "shorts", "live"].includes(path[1])) id = path[2];
        }
        return /^[\w-]{11}$/.test(id == null ? "" : id) ? id : null;
    }

    const grid = gallery == null ? undefined : gallery.querySelector(".video-grid");
    if (!grid ||
        !dialog ||
        !title ||
        !player ||
        !external ||
        grid.dataset.videoInitialized
    )
        return;
    grid.dataset.videoInitialized = "true";

    for (const entry of videos) {
        const video = typeof entry === "string" ? { url: entry } : entry;
        const id = getYouTubeId(video.url);
        if (!id) {
            console.warn("Bỏ qua đường dẫn YouTube không hợp lệ:", video.url);
            continue;
        }

        const card = document.createElement("a");
        card.className = "video-card";

        const thumb = document.createElement("div");
        thumb.className = "video-thumb";
        const image = document.createElement("img");
        image.alt = "";
        image.decoding = "async";
        thumb.append(image);

        const copy = document.createElement("div");
        copy.className = "video-copy";
        const category = document.createElement("span");
        category.className = "video-category";
        category.textContent = (video.category == null ? undefined : video.category.trim()) || "";
        category.hidden = !category.textContent;
        const heading = document.createElement("h2");
        const description = document.createElement("p");
        copy.append(category, heading, description);
        card.append(thumb, copy);
        const number = grid.children.length + 1;
        const youtubeImage = "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";

        card.href = video.url.trim();
        heading.id = "video-title-" + number;
        heading.textContent = (video.title == null ? undefined : video.title.trim()) || "Video khách hàng " + number;
        card.setAttribute("aria-labelledby", heading.id);
        description.textContent = (video.description == null ? undefined : video.description.trim()) || "";
        description.hidden = !description.textContent;

        image.loading = number > 3 ? "lazy" : "eager";
        image.addEventListener("error", () => {
            if (image.src !== youtubeImage) {
                image.src = youtubeImage;
            } else {
                image.hidden = true;
            }
        });
        image.src = (video.image == null ? undefined : video.image.trim()) || youtubeImage;
        grid.append(card);
    }

    gallery.addEventListener("click", (event) => {
        if (
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        )
            return;
        const card = event.target.closest("a.video-card");
        if (!card || typeof dialog.showModal !== "function") return;
        const id = getYouTubeId(card.href);
        if (!id) return;
        event.preventDefault();
        activeCard = card;
        title.textContent = card.querySelector("h2").textContent;
        external.href = "https://www.youtube.com/watch?v=" + id;

        const frame = document.createElement("iframe");
        frame.src =
            "https://www.youtube-nocookie.com/embed/" +
            id +
            "?autoplay=1&playsinline=1&rel=0";
        frame.title = title.textContent;
        frame.allow =
            "autoplay; encrypted-media; picture-in-picture; web-share; fullscreen";
        frame.allowFullscreen = true;
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        player.replaceChildren(frame);
        dialog.showModal();
    });

    dialog
        .querySelector(".video-close")
        .addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const { left, right, top, bottom } = dialog.getBoundingClientRect();
        if (
            event.clientX < left ||
            event.clientX >= right ||
            event.clientY < top ||
            event.clientY >= bottom
        )
            dialog.close();
    });
    dialog.addEventListener("close", () => {
        player.replaceChildren();
        if (activeCard != null) activeCard.focus({ preventScroll: true });
        activeCard = null;
    });
})();