// js/header.js - Universal Resort Header Sync
(function() {
    function getStoredGuest() {
        try {
            const stored = localStorage.getItem("swargatil_user");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    function syncHeader() {
        const headerActions = document.querySelector(".header-actions");
        if (!headerActions) return;
        const guest = getStoredGuest();

        if (guest) {
            headerActions.innerHTML = `
                <span class="header-user-pill" title="${guest.full_name || guest.username}">
                    <i class="fa fa-user-circle" style="color:#e0ac1c;"></i> ${guest.full_name || guest.username}
                </span>
                <button class="box" type="button" onclick="logoutUniversalGuest()" style="background:#555; color:#fff; font-size:13px; padding:6px 12px;">Logout</button>
                <a href="feedback.html"><button class="box box-feedback" type="button">Feedback</button></a>
                <a href="admin.html"><button class="box box-admin" type="button" style="margin-left: 2px;">Admin</button></a>
            `;
        }
    }

    window.logoutUniversalGuest = function() {
        localStorage.removeItem("swargatil_user");
        localStorage.removeItem("swargatil_admin");
        window.location.reload();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", syncHeader);
    } else {
        syncHeader();
    }
})();
