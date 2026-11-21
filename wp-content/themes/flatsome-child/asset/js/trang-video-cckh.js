const cckhTopics = {
    all: "Tất cả câu chuyện",
    implant: "Phục hồi toàn hàm",
    porcelain: "Răng sứ thẩm mỹ",
    international: "Khách hàng quốc tế",
};

// Mỗi danh sách bên dưới tương ứng với một tab chuyên đề.
// Add one story to its topic with url and title.
// Tab Tất cả câu chuyện tự tổng hợp các mục từ ba tab.
const cckhStoriesByTopic = {
    // Phục hồi toàn hàm
    implant: [{
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Tìm lại khả năng ăn nhai sau nhiều năm mất răng",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Tìm lại nụ cười trọn vẹn",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Ăn nhai thoải mái sau phục hồi Implant",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Lấy lại nụ cười và chất lượng cuộc sống",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Giải pháp phục hồi răng cho người lớn tuổi",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Tự tin ăn nhai sau thời gian dài mất răng",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Hành trình phục hồi răng toàn hàm",
        },
    ],
    // Răng sứ thẩm mỹ
    porcelain: [{
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Nụ cười tự tin trong mỗi cuộc gặp",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Nụ cười tự nhiên với mặt dán veneer",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Giữ nét hài hòa cho nụ cười",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Tự tin giao tiếp với nụ cười rạng rỡ",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Nụ cười sáng và trẻ trung hơn",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Nụ cười tự nhiên, phù hợp khuôn mặt",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Tìm lại niềm vui với nụ cười",
        },
    ],
    // Khách hàng quốc tế
    international: [{
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Hành trình làm răng tại Việt Nam",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Trải nghiệm điều trị Implant tại iD-4",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Về Việt Nam để phục hồi răng toàn hàm",
        },
        {
            url: "https://www.youtube.com/watch?v=sC2M4jaTke4",
            title: "Một chuyến đi, một nụ cười mới",
        },
    ],
};

const cckhStories = Object.entries(cckhStoriesByTopic).flatMap(([cckhTopic, cckhEntries]) =>
    cckhEntries.map((cckhStory) => ({...cckhStory, topic: cckhTopic })),
);

const cckhPageSize = 15;
const cckhInitialCount = 9;
const cckhRevealCount = 6;
let cckhSelectedTopic = "all";
let cckhPage = 1;
let cckhVisibleCount = cckhInitialCount;
let cckhPaginationRevealed = false;

const cckhTopicBar = document.querySelector(".cckh-topics");
const cckhGrid = document.querySelector(".cckh-grid");
const cckhPages = document.querySelector(".cckh-pages");
const cckhMore = document.querySelector(".cckh-more");
const cckhStatus = document.querySelector("#cckh-status");
const cckhPlayer = document.querySelector(".cckh-player");
const cckhPlayerTitle = document.querySelector("#cckh-video-title");
const cckhPlayerContent = document.querySelector(".cckh-player-content");
const cckhPlayerExternal = document.querySelector(".cckh-player-external");

function cckhYoutubeVideoId(cckhValue) {
    let cckhUrl;
    try {
        cckhUrl = new URL(cckhValue);
    } catch {
        return null;
    }
    if (cckhUrl.protocol !== "https:" && cckhUrl.protocol !== "http:") return null;

    const [cckhRoute, cckhPathId] = cckhUrl.pathname.split("/").slice(1);
    let cckhVideoId;
    if (cckhUrl.hostname === "youtu.be") {
        cckhVideoId = cckhRoute;
    } else if (
        ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(cckhUrl.hostname)
    ) {
        if (cckhRoute === "watch") cckhVideoId = cckhUrl.searchParams.get("v");
        if (["shorts", "live", "embed"].includes(cckhRoute)) cckhVideoId = cckhPathId;
    }
    if (!/^[A-Za-z0-9_-]{11}$/.test(cckhVideoId == null ? "" : cckhVideoId)) return null;
    return cckhVideoId;
}

function cckhOpenVideo(cckhStory, cckhVideoId) {
    cckhPlayerTitle.textContent = cckhStory.title;
    cckhPlayerExternal.href = "https://www.youtube.com/watch?v=" + cckhVideoId;
    const cckhFrame = document.createElement("iframe");
    cckhFrame.src =
        "https://www.youtube-nocookie.com/embed/" +
        cckhVideoId +
        "?autoplay=1&playsinline=1&rel=0";
    cckhFrame.title = cckhStory.title;
    cckhFrame.allow = "autoplay; encrypted-media; picture-in-picture";
    cckhFrame.referrerPolicy = "strict-origin-when-cross-origin";
    cckhFrame.allowFullscreen = true;
    cckhPlayerContent.replaceChildren(cckhFrame);
    cckhPlayer.showModal();
}

cckhPlayer.querySelector(".cckh-player-close").addEventListener("click", () => cckhPlayer.close());
cckhPlayer.addEventListener("click", (cckhEvent) => {
    if (cckhEvent.target !== cckhPlayer) return;
    const { left: cckhLeft, right: cckhRight, top: cckhTop, bottom: cckhBottom } = cckhPlayer.getBoundingClientRect();
    if (
        cckhEvent.clientX < cckhLeft ||
        cckhEvent.clientX >= cckhRight ||
        cckhEvent.clientY < cckhTop ||
        cckhEvent.clientY >= cckhBottom
    ) {
        cckhPlayer.close();
    }
});
cckhPlayer.addEventListener("close", () => cckhPlayerContent.replaceChildren());

function cckhMakeCard(cckhStory) {
    const cckhCard = document.createElement("button");
    cckhCard.type = "button";
    cckhCard.className = "cckh-card";
    cckhCard.innerHTML =
        '<img alt="" loading="lazy" decoding="async"><span class="cckh-card-content"><span class="cckh-badge"></span><strong class="cckh-card-title"></strong></span>';
    const cckhVideoId = cckhYoutubeVideoId(cckhStory.url);
    const cckhThumbnail = cckhCard.querySelector("img");
    if (cckhVideoId) {
        const cckhThumbnailBase = "https://i.ytimg.com/vi/" + cckhVideoId;
        cckhThumbnail.addEventListener("error", () => {
            cckhThumbnail.src = cckhThumbnailBase + "/hqdefault.jpg";
        }, { once: true });
        cckhThumbnail.src = cckhThumbnailBase + "/mqdefault.jpg";
        cckhCard.addEventListener("click", () => cckhOpenVideo(cckhStory, cckhVideoId));
    } else {
        cckhThumbnail.remove();
    }
    cckhCard.querySelector(".cckh-badge").textContent = cckhTopics[cckhStory.topic];
    cckhCard.querySelector(".cckh-card-title").textContent = cckhStory.title;
    return cckhCard;
}

function cckhRender() {
    const cckhMatching =
        cckhSelectedTopic === "all" ?
        cckhStories :
        cckhStories.filter((cckhStory) => cckhStory.topic === cckhSelectedTopic);
    const cckhPageCount = Math.ceil(cckhMatching.length / cckhPageSize);
    const cckhOffset = (cckhPage - 1) * cckhPageSize;
    const cckhPageStories = cckhMatching.slice(cckhOffset, cckhOffset + cckhPageSize);
    const cckhShown = cckhPageStories.slice(0, cckhVisibleCount);
    cckhGrid.replaceChildren(...cckhShown.map(cckhMakeCard));
    cckhMore.hidden = cckhShown.length === cckhPageStories.length;
    cckhStatus.textContent =
        "Hiển thị " +
        cckhShown.length +
        " câu chuyện. Trang " +
        cckhPage +
        " trên " +
        Math.max(1, cckhPageCount) +
        ".";
    cckhPages.hidden = !cckhPaginationRevealed || cckhPageCount <= 1;
    cckhPages.replaceChildren();

    for (let cckhNumber = 1; cckhNumber <= cckhPageCount; cckhNumber += 1) {
        const cckhButton = document.createElement("button");
        cckhButton.type = "button";
        cckhButton.textContent = String(cckhNumber);
        cckhButton.setAttribute("aria-label", "Trang " + cckhNumber);
        if (cckhNumber === cckhPage) cckhButton.setAttribute("aria-current", "page");
        cckhButton.addEventListener("click", () => {
            if (cckhPage === cckhNumber) return;
            cckhPage = cckhNumber;
            cckhVisibleCount = cckhInitialCount;
            cckhRender();
            cckhPages.children[cckhNumber - 1].focus({ preventScroll: true });
            cckhTopicBar.scrollIntoView({ block: "start" });
        });
        cckhPages.append(cckhButton);
    }
}

Object.entries(cckhTopics).forEach(([cckhKey, cckhLabel]) => {
    const cckhButton = document.createElement("button");
    cckhButton.type = "button";
    cckhButton.textContent = cckhLabel;
    cckhButton.setAttribute("aria-pressed", String(cckhKey === cckhSelectedTopic));
    cckhButton.addEventListener("click", () => {
        if (cckhKey === cckhSelectedTopic) return;
        cckhTopicBar
            .querySelector('[aria-pressed="true"]')
            .setAttribute("aria-pressed", "false");
        cckhButton.setAttribute("aria-pressed", "true");
        cckhSelectedTopic = cckhKey;
        cckhPaginationRevealed = false;
        cckhPage = 1;
        cckhVisibleCount = cckhInitialCount;
        cckhRender();
    });
    cckhTopicBar.append(cckhButton);
});

cckhMore.addEventListener("click", () => {
    const cckhPreviousCount = cckhGrid.children.length;
    cckhVisibleCount += cckhRevealCount;
    cckhPaginationRevealed = true;
    cckhRender();
    const cckhFirstNewCard = cckhGrid.children[cckhPreviousCount];
    if (cckhFirstNewCard != null) cckhFirstNewCard.focus({ preventScroll: true });
});

cckhRender();