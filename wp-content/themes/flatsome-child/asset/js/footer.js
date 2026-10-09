/* JS riêng footer: chỉ mở/đóng popup liên hệ. Nạp một lần với defer. */
(() => {
    "use strict";
    const id4HomeFooter = document.querySelector(".-id4-home-footer");
    const id4HomeFooterDialog = document.querySelector(
        "#-id4-home-contact-dialog",
    );
    if (!id4HomeFooter || !id4HomeFooterDialog) return;
    id4HomeFooter.querySelectorAll("[data-contact]").forEach((id4HomeButton) =>
        id4HomeButton.addEventListener("click", () => {
            if (!id4HomeFooterDialog.open) id4HomeFooterDialog.showModal();
            document.body.classList.add("-id4-home-dialog-open");
        }),
    );
    const id4HomeFooterClose = id4HomeFooterDialog.querySelector(
        ".-id4-home-dialog-close",
    );
    if (id4HomeFooterClose)
        id4HomeFooterClose.addEventListener("click", () =>
            id4HomeFooterDialog.close(),
        );
    id4HomeFooterDialog.addEventListener("click", (id4HomeEvent) => {
        const id4HomeBox = id4HomeFooterDialog.getBoundingClientRect();
        if (
            id4HomeEvent.target === id4HomeFooterDialog &&
            (id4HomeEvent.clientX < id4HomeBox.left ||
                id4HomeEvent.clientX > id4HomeBox.right ||
                id4HomeEvent.clientY < id4HomeBox.top ||
                id4HomeEvent.clientY > id4HomeBox.bottom)
        )
            id4HomeFooterDialog.close();
    });
    id4HomeFooterDialog.addEventListener("close", () => {
        if (![...document.querySelectorAll("dialog")].some(
                (id4HomeDialog) => id4HomeDialog.open,
            ))
            document.body.classList.remove("-id4-home-dialog-open");
    });
})();