document.addEventListener("DOMContentLoaded", () => {
  const postersGrid = document.getElementById("postersGrid");
  const postersEmpty = document.getElementById("postersEmpty");
  const statusFilter = document.getElementById("posterStatusFilter");
  const posterForm = document.getElementById("posterForm");
  const posterModalElement = document.getElementById("posterModal");
  const posterModal = bootstrap.Modal.getOrCreateInstance(posterModalElement);
  const posterModalTitle = document.getElementById("posterModalTitle");
  const posterModalDescription = document.getElementById("posterModalDescription");
  const posterFormMessage = document.getElementById("posterFormMessage");
  const posterPageMessage = document.getElementById("posterPageMessage");
  const imageInput = document.getElementById("posterImage");
  const imageHelp = document.getElementById("posterImageHelp");
  const imagePreview = document.getElementById("posterImagePreview");
  const saveButton = document.getElementById("savePosterButton");
  const saveButtonLabel = saveButton.querySelector(".save-poster-label");
  const saveSpinner = saveButton.querySelector(".spinner-border");

  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxFileSize = 2 * 1024 * 1024;
  let posters = [];
  let editingPosterId = null;

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

  function renderPosters() {
    const status = statusFilter.value;
    const filteredPosters = posters.filter((poster) => {
      if (!status) {
        return true;
      }
      return (poster.is_active ? "active" : "inactive") === status;
    });

    postersGrid.innerHTML = "";
    postersEmpty.style.display = filteredPosters.length ? "none" : "block";

    filteredPosters.forEach((poster) => {
      const title = poster.title || "Untitled Poster";
      const image = poster.image || "";
      const active = poster.is_active === true;
      const toggleLabel = active ? "Deactivate poster" : "Activate poster";

      postersGrid.insertAdjacentHTML(
        "beforeend",
        `
          <div class="col-12 col-md-6 col-xl-4" data-poster-id="${escapeHtml(poster._id)}">
            <article class="card h-100 shadow-sm">
              <img
                src="${escapeHtml(image)}"
                alt="${escapeHtml(poster.alt_text || title)}"
                class="card-img-top"
                style="height: 220px; object-fit: cover"
              />
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <h3 class="h5 card-title mb-2">${escapeHtml(title)}</h3>
                  <span class="badge ${active ? "text-bg-success" : "text-bg-secondary"}">
                    ${active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p class="card-text text-muted mb-2">
                  ${escapeHtml(poster.alt_text || "No alt text")}
                </p>
                <div class="d-flex justify-content-between align-items-center gap-2">
                  <small class="text-muted">Sort order: ${escapeHtml(poster.sort_order ?? 0)}</small>
                  <div class="btn-group" role="group" aria-label="Poster actions">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      data-poster-action="edit"
                      data-poster-id="${escapeHtml(poster._id)}"
                      aria-label="Edit ${escapeHtml(title)}"
                      title="Edit poster"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm ${active ? "btn-outline-warning" : "btn-outline-success"}"
                      data-poster-action="toggle"
                      data-poster-id="${escapeHtml(poster._id)}"
                      aria-label="${toggleLabel}"
                      title="${toggleLabel}"
                    >
                      <i class="bi ${active ? "bi-toggle-on" : "bi-toggle-off"}"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      data-poster-action="delete"
                      data-poster-id="${escapeHtml(poster._id)}"
                      aria-label="Delete ${escapeHtml(title)}"
                      title="Delete poster"
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

  async function loadPosters() {
    postersGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border" role="status" aria-label="Loading"></div>
        <p class="mt-2 mb-0">Loading posters...</p>
      </div>
    `;

    try {
      const response = await fetch("/api/posters");
      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = await response.json();
      posters = data.posters || [];
      renderPosters();
      return true;
    } catch (error) {
      console.error("Load posters error:", error);
      postersGrid.innerHTML = "";
      postersEmpty.style.display = "none";
      showMessage(posterPageMessage, error.message || "Failed to load posters.", "danger");
      return false;
    }
  }

  function resetPosterForm() {
    editingPosterId = null;
    posterForm.reset();
    document.getElementById("posterStatus").value = "true";
    posterModalTitle.textContent = "Add Poster";
    posterModalDescription.textContent =
      "Enter the poster details and upload an image.";
    imageHelp.textContent =
      "Required for new posters. JPG, PNG, or WebP; maximum 2MB.";
    imageInput.required = true;
    imagePreview.removeAttribute("src");
    imagePreview.classList.add("d-none");
    hideMessage(posterFormMessage);
  }

  function openEditModal(poster) {
    resetPosterForm();
    editingPosterId = poster._id;
    posterModalTitle.textContent = "Edit Poster";
    posterModalDescription.textContent = "Update the poster details.";
    imageHelp.textContent =
      "Choose a new image only if you want to replace the current one. JPG, PNG, or WebP; maximum 2MB.";
    imageInput.required = false;
    document.getElementById("posterTitle").value = poster.title || "";
    document.getElementById("posterSortOrder").value = poster.sort_order ?? 0;
    document.getElementById("posterAltText").value = poster.alt_text || "";
    document.getElementById("posterStatus").value = poster.is_active
      ? "true"
      : "false";
    if (poster.image) {
      imagePreview.src = poster.image;
      imagePreview.classList.remove("d-none");
    }
    posterModal.show();
  }

  async function handlePosterAction(action, posterId, button) {
    if (action === "edit") {
      const poster = posters.find((item) => item._id === posterId);
      if (poster) {
        openEditModal(poster);
      }
      return;
    }

    if (
      action === "delete" &&
      !window.confirm("Delete this poster? This cannot be undone.")
    ) {
      return;
    }

    button.disabled = true;
    try {
      const endpoint =
        action === "toggle"
          ? `/api/posters/${encodeURIComponent(posterId)}/toggle-status`
          : `/api/posters/${encodeURIComponent(posterId)}`;
      const response = await fetch(endpoint, {
        method: action === "toggle" ? "PATCH" : "DELETE",
      });
      if (!response.ok) {
        throw new Error(await readError(response));
      }

      hideMessage(posterPageMessage);
      if (await loadPosters()) {
        showMessage(
          posterPageMessage,
          action === "toggle"
            ? "Poster status updated successfully."
            : "Poster deleted successfully.",
          "success",
        );
      }
    } catch (error) {
      console.error(`Poster ${action} error:`, error);
      showMessage(
        posterPageMessage,
        error.message || `Failed to ${action} poster.`,
        "danger",
      );
    } finally {
      button.disabled = false;
    }
  }

  postersGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-poster-action]");
    if (!button) {
      return;
    }
    handlePosterAction(
      button.dataset.posterAction,
      button.dataset.posterId,
      button,
    );
  });

  document
    .getElementById("addPosterButton")
    .addEventListener("click", resetPosterForm);

  posterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(posterFormMessage);

    const image = imageInput.files[0];
    if (!image && !editingPosterId) {
      showMessage(posterFormMessage, "Please choose a poster image.", "danger");
      return;
    }
    const isEditingPoster = Boolean(editingPosterId);
    if (image && !allowedImageTypes.includes(image.type)) {
      showMessage(posterFormMessage, "Choose a JPG, PNG, or WebP image.", "danger");
      return;
    }
    if (image && image.size > maxFileSize) {
      showMessage(posterFormMessage, "Image size must not exceed 2MB.", "danger");
      return;
    }

    saveButton.disabled = true;
    saveButtonLabel.textContent = "Saving...";
    saveSpinner.classList.remove("d-none");

    try {
      const response = await fetch(
        isEditingPoster
          ? `/api/posters/${encodeURIComponent(editingPosterId)}`
          : "/api/posters",
        {
          method: isEditingPoster ? "PUT" : "POST",
          body: new FormData(posterForm),
        },
      );
      if (!response.ok) {
        throw new Error(await readError(response));
      }

      posterModal.hide();
      hideMessage(posterFormMessage);
      hideMessage(posterPageMessage);
      if (await loadPosters()) {
        showMessage(
          posterPageMessage,
          isEditingPoster
            ? "Poster updated successfully."
            : "Poster saved successfully.",
          "success",
        );
      }
    } catch (error) {
      console.error("Save poster error:", error);
      showMessage(posterFormMessage, error.message || "Failed to save poster.", "danger");
    } finally {
      saveButton.disabled = false;
      saveButtonLabel.textContent = "Save Poster";
      saveSpinner.classList.add("d-none");
    }
  });

  posterModalElement.addEventListener("hidden.bs.modal", () => {
    resetPosterForm();
  });

  statusFilter.addEventListener("change", renderPosters);
  loadPosters();
});
