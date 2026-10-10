document.addEventListener("DOMContentLoaded", () => {
  const tipsGrid = document.getElementById("tipsGrid");
  const tipsEmpty = document.getElementById("tipsEmpty");
  const statusFilter = document.getElementById("tipStatusFilter");
  const tipForm = document.getElementById("tipForm");
  const tipModalElement = document.getElementById("tipModal");
  const tipModal = bootstrap.Modal.getOrCreateInstance(tipModalElement);
  const tipModalTitle = document.getElementById("tipModalTitle");
  const tipModalDescription = document.getElementById("tipModalDescription");
  const tipFormMessage = document.getElementById("tipFormMessage");
  const tipPageMessage = document.getElementById("tipPageMessage");
  const saveButton = document.getElementById("saveTipButton");
  const saveButtonLabel = saveButton.querySelector(".save-tip-label");
  const saveSpinner = saveButton.querySelector(".spinner-border");

  let tips = [];
  let editingTipId = null;

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.classList.remove("d-none");
  }

  function hideMessage(element) {
    element.textContent = "";
    element.classList.add("d-none");
  }

  async function readError(response) {
    try {
      const data = await response.json();
      return data.message || data.error || "Something went wrong.";
    } catch {
      return "Something went wrong.";
    }
  }

  function getValidInstagramUrl(value) {
    try {
      const url = new URL(value);
      if (
        !["instagram.com", "www.instagram.com"].includes(url.hostname.toLowerCase()) ||
        !["http:", "https:"].includes(url.protocol) ||
        !/^\/(reel|reels|p|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)
      ) {
        return null;
      }
      return url.href;
    } catch {
      return null;
    }
  }

  function renderTips() {
    const filter = statusFilter.value;
    const filteredTips = tips.filter((tip) => {
      return !filter || (tip.is_active ? "active" : "inactive") === filter;
    });

    tipsGrid.innerHTML = "";
    tipsEmpty.style.display = filteredTips.length ? "none" : "block";

    filteredTips.forEach((tip) => {
      const active = tip.is_active === true;
      const safeUrl = getValidInstagramUrl(tip.reelUrl);
      const title = tip.title || "Instagram Reel";
      const toggleLabel = active ? "Deactivate Reel" : "Activate Reel";

      tipsGrid.insertAdjacentHTML(
        "beforeend",
        `
          <div class="col-12 col-md-6 col-xl-4">
            <article class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <h3 class="h5 card-title mb-0">${escapeHtml(title)}</h3>
                  <span class="badge ${active ? "text-bg-success" : "text-bg-secondary"}">
                    ${active ? "Active" : "Inactive"}
                  </span>
                </div>
                ${
                  safeUrl
                    ? `<a
                         href="${escapeHtml(safeUrl)}"
                         target="_blank"
                         rel="noopener noreferrer"
                         class="text-break mb-3"
                       >${escapeHtml(safeUrl)}</a>`
                    : '<p class="text-danger mb-3">This saved Reel link is invalid.</p>'
                }
                <div class="mt-auto d-flex justify-content-between align-items-center gap-2">
                  <small class="text-muted">Sort order: ${escapeHtml(tip.sort_order ?? 0)}</small>
                  <div class="btn-group" role="group" aria-label="Reel actions">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      data-tip-action="edit"
                      data-tip-id="${escapeHtml(tip._id)}"
                      aria-label="Edit ${escapeHtml(title)}"
                      title="Edit Reel"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm ${active ? "btn-outline-warning" : "btn-outline-success"}"
                      data-tip-action="toggle"
                      data-tip-id="${escapeHtml(tip._id)}"
                      aria-label="${toggleLabel}"
                      title="${toggleLabel}"
                    >
                      <i class="bi ${active ? "bi-toggle-on" : "bi-toggle-off"}"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      data-tip-action="delete"
                      data-tip-id="${escapeHtml(tip._id)}"
                      aria-label="Delete ${escapeHtml(title)}"
                      title="Delete Reel"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        `,
      );
    });
  }

  async function loadTips() {
    tipsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border" role="status" aria-label="Loading"></div>
        <p class="mt-2 mb-0">Loading Instagram Reels...</p>
      </div>
    `;

    try {
      const response = await fetch("/api/tips");
      if (!response.ok) {
        throw new Error(await readError(response));
      }
      const data = await response.json();
      tips = data.tips || [];
      renderTips();
      return true;
    } catch (error) {
      console.error("Load Instagram Reels error:", error);
      tipsGrid.innerHTML = "";
      tipsEmpty.style.display = "none";
      showMessage(tipPageMessage, error.message || "Failed to load Reels.", "danger");
      return false;
    }
  }

  function resetTipForm() {
    editingTipId = null;
    tipForm.reset();
    document.getElementById("tipStatus").value = "true";
    tipModalTitle.textContent = "Add Instagram Reel";
    tipModalDescription.textContent = "Paste a public Instagram Reel link.";
    saveButtonLabel.textContent = "Save Reel";
    hideMessage(tipFormMessage);
  }

  function openEditModal(tip) {
    resetTipForm();
    editingTipId = tip._id;
    tipModalTitle.textContent = "Edit Instagram Reel";
    tipModalDescription.textContent = "Update the Reel link and details.";
    saveButtonLabel.textContent = "Update Reel";
    document.getElementById("tipTitle").value = tip.title || "";
    document.getElementById("tipReelUrl").value = tip.reelUrl || "";
    document.getElementById("tipSortOrder").value = tip.sort_order ?? 0;
    document.getElementById("tipStatus").value = tip.is_active ? "true" : "false";
    tipModal.show();
  }

  async function handleTipAction(action, tipId, button) {
    if (action === "edit") {
      const tip = tips.find((item) => item._id === tipId);
      if (tip) {
        openEditModal(tip);
      }
      return;
    }

    if (
      action === "delete" &&
      !window.confirm("Delete this Instagram Reel? This cannot be undone.")
    ) {
      return;
    }

    button.disabled = true;
    try {
      const response = await fetch(
        action === "toggle"
          ? `/api/tips/${encodeURIComponent(tipId)}/toggle-status`
          : `/api/tips/${encodeURIComponent(tipId)}`,
        { method: action === "toggle" ? "PATCH" : "DELETE" },
      );
      if (!response.ok) {
        throw new Error(await readError(response));
      }

      hideMessage(tipPageMessage);
      if (await loadTips()) {
        showMessage(
          tipPageMessage,
          action === "toggle" ? "Reel status updated." : "Reel deleted.",
          "success",
        );
      }
    } catch (error) {
      console.error(`Instagram Reel ${action} error:`, error);
      showMessage(
        tipPageMessage,
        error.message || `Failed to ${action} Reel.`,
        "danger",
      );
    } finally {
      button.disabled = false;
    }
  }

  tipsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tip-action]");
    if (button) {
      handleTipAction(
        button.dataset.tipAction,
        button.dataset.tipId,
        button,
      );
    }
  });

  document
    .getElementById("addTipButton")
    .addEventListener("click", resetTipForm);

  tipForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(tipFormMessage);

    const reelUrl = getValidInstagramUrl(
      document.getElementById("tipReelUrl").value.trim(),
    );
    if (!reelUrl) {
      showMessage(
        tipFormMessage,
        "Enter a valid Instagram Reel, post, or video link.",
        "danger",
      );
      return;
    }

    const isEditingTip = Boolean(editingTipId);
    saveButton.disabled = true;
    saveSpinner.classList.remove("d-none");

    try {
      const response = await fetch(
        isEditingTip
          ? `/api/tips/${encodeURIComponent(editingTipId)}`
          : "/api/tips",
        {
          method: isEditingTip ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: document.getElementById("tipTitle").value.trim(),
            reelUrl,
            sort_order: document.getElementById("tipSortOrder").value,
            is_active: document.getElementById("tipStatus").value,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(await readError(response));
      }

      tipModal.hide();
      hideMessage(tipPageMessage);
      if (await loadTips()) {
        showMessage(
          tipPageMessage,
          isEditingTip ? "Reel updated successfully." : "Reel added successfully.",
          "success",
        );
      }
    } catch (error) {
      console.error("Save Instagram Reel error:", error);
      showMessage(tipFormMessage, error.message || "Failed to save Reel.", "danger");
    } finally {
      saveButton.disabled = false;
      saveSpinner.classList.add("d-none");
    }
  });

  tipModalElement.addEventListener("hidden.bs.modal", resetTipForm);
  statusFilter.addEventListener("change", renderTips);
  loadTips();
});
