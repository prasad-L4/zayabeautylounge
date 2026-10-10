document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("categoriesGrid");
  const emptyState = document.getElementById("categoriesEmpty");
  const filter = document.getElementById("categoryStatusFilter");
  const form = document.getElementById("categoryForm");
  const modalElement = document.getElementById("categoryModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  const pageMessage = document.getElementById("categoryPageMessage");
  const formMessage = document.getElementById("categoryFormMessage");
  const imageInput = document.getElementById("categoryImage");
  const imagePreview = document.getElementById("categoryImagePreview");
  const imageHelp = document.getElementById("categoryImageHelp");
  const saveButton = document.getElementById("saveCategoryButton");
  const saveLabel = saveButton.querySelector(".save-category-label");
  const saveSpinner = saveButton.querySelector(".spinner-border");
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  let categories = [];
  let editingId = null;

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

  async function errorMessage(response) {
    try {
      const data = await response.json();
      return data.message || data.error || "Something went wrong.";
    } catch {
      return "Something went wrong.";
    }
  }

  function renderCategories() {
    const status = filter.value;
    const filtered = categories.filter(
      (category) =>
        !status || (category.is_active ? "active" : "inactive") === status,
    );
    grid.innerHTML = "";
    emptyState.style.display = filtered.length ? "none" : "block";

    filtered.forEach((category) => {
      const active = category.is_active === true;
      const title = category.title || category.name;
      grid.insertAdjacentHTML(
        "beforeend",
        `
          <div class="col-12 col-md-6 col-xl-4">
            <article class="card h-100 shadow-sm">
              <img
                src="${escapeHtml(category.image)}"
                alt="${escapeHtml(category.alt_text || title)}"
                class="card-img-top"
                style="height: 220px; object-fit: cover"
              />
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <div>
                    <h3 class="h5 card-title mb-1">${escapeHtml(title)}</h3>
                  </div>
                  <span class="badge ${active ? "text-bg-success" : "text-bg-secondary"}">
                    ${active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p class="small text-muted mb-3">${escapeHtml(category.alt_text || "No alt text")}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">Sort order: ${escapeHtml(category.sort_order ?? 0)}</small>
                  <div class="btn-group" role="group" aria-label="Category actions">
                    <a
                      class="btn btn-sm btn-outline-primary"
                      href="/admin/service-form?category=${encodeURIComponent(category.name)}"
                      title="Add service in this category"
                      aria-label="Add service in ${escapeHtml(category.name)}"
                    ><i class="bi bi-plus-lg"></i></a>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      data-action="edit"
                      data-id="${escapeHtml(category._id)}"
                      title="Edit category"
                      aria-label="Edit ${escapeHtml(category.name)}"
                    ><i class="bi bi-pencil-square"></i></button>
                    <button
                      type="button"
                      class="btn btn-sm ${active ? "btn-outline-warning" : "btn-outline-success"}"
                      data-action="toggle"
                      data-id="${escapeHtml(category._id)}"
                      title="${active ? "Deactivate" : "Activate"} category"
                      aria-label="${active ? "Deactivate" : "Activate"} ${escapeHtml(category.name)}"
                    ><i class="bi ${active ? "bi-toggle-on" : "bi-toggle-off"}"></i></button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      data-action="delete"
                      data-id="${escapeHtml(category._id)}"
                      title="Delete category"
                      aria-label="Delete ${escapeHtml(category.name)}"
                    ><i class="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        `,
      );
    });
  }

  async function loadCategories() {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border" role="status" aria-label="Loading"></div>
        <p class="mt-2 mb-0">Loading categories...</p>
      </div>
    `;
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error(await errorMessage(response));
      }
      const data = await response.json();
      categories = data.categories || [];
      renderCategories();
      return true;
    } catch (error) {
      console.error("Load categories error:", error);
      grid.innerHTML = "";
      emptyState.style.display = "none";
      showMessage(pageMessage, error.message || "Failed to load categories.", "danger");
      return false;
    }
  }

  function resetForm() {
    editingId = null;
    form.reset();
    document.getElementById("categoryStatus").value = "true";
    document.getElementById("categoryModalTitle").textContent = "Add Category";
    document.getElementById("categoryModalDescription").textContent =
      "Add a new service category.";
    saveLabel.textContent = "Save Category";
    imageHelp.textContent =
      "Required for new categories. JPG, PNG, or WebP; maximum 2MB.";
    imageInput.required = true;
    imagePreview.removeAttribute("src");
    imagePreview.classList.add("d-none");
    hideMessage(formMessage);
  }

  function openEditModal(category) {
    resetForm();
    editingId = category._id;
    document.getElementById("categoryModalTitle").textContent = "Edit Category";
    document.getElementById("categoryModalDescription").textContent =
      "Update the category details.";
    saveLabel.textContent = "Update Category";
    imageHelp.textContent =
      "Choose a new image only if you want to replace the current one. Maximum 2MB.";
    imageInput.required = false;
    document.getElementById("categoryTitle").value =
      category.title || category.name || "";
    document.getElementById("categoryAltText").value = category.alt_text || "";
    document.getElementById("categorySortOrder").value = category.sort_order ?? 0;
    document.getElementById("categoryStatus").value = category.is_active
      ? "true"
      : "false";
    imagePreview.src = category.image;
    imagePreview.classList.remove("d-none");
    modal.show();
  }

  async function runAction(action, id, button) {
    if (
      action === "delete" &&
      !window.confirm("Delete this category? This cannot be undone.")
    ) {
      return;
    }
    button.disabled = true;
    try {
      const response = await fetch(
        action === "toggle"
          ? `/api/categories/${encodeURIComponent(id)}/toggle-status`
          : `/api/categories/${encodeURIComponent(id)}`,
        { method: action === "toggle" ? "PATCH" : "DELETE" },
      );
      if (!response.ok) {
        throw new Error(await errorMessage(response));
      }
      hideMessage(pageMessage);
      if (await loadCategories()) {
        showMessage(
          pageMessage,
          action === "toggle"
            ? "Category status updated successfully."
            : "Category deleted successfully.",
          "success",
        );
      }
    } catch (error) {
      console.error(`Category ${action} error:`, error);
      showMessage(pageMessage, error.message || `Failed to ${action} category.`, "danger");
    } finally {
      button.disabled = false;
    }
  }

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }
    const category = categories.find((item) => item._id === button.dataset.id);
    if (button.dataset.action === "edit") {
      if (category) {
        openEditModal(category);
      }
    } else {
      runAction(button.dataset.action, button.dataset.id, button);
    }
  });

  document.getElementById("addCategoryButton").addEventListener("click", resetForm);
  filter.addEventListener("change", renderCategories);

  imageInput.addEventListener("change", () => {
    const image = imageInput.files[0];
    if (!image) {
      return;
    }
    if (!allowedTypes.includes(image.type) || image.size > 2 * 1024 * 1024) {
      showMessage(
        formMessage,
        "Choose a JPG, PNG, or WebP image no larger than 2MB.",
        "danger",
      );
      imageInput.value = "";
      return;
    }
    hideMessage(formMessage);
    imagePreview.src = URL.createObjectURL(image);
    imagePreview.classList.remove("d-none");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(formMessage);
    const image = imageInput.files[0];
    if (!image && !editingId) {
      showMessage(formMessage, "Please choose a category image.", "danger");
      return;
    }
    if (image && (!allowedTypes.includes(image.type) || image.size > 2 * 1024 * 1024)) {
      showMessage(
        formMessage,
        "Choose a JPG, PNG, or WebP image no larger than 2MB.",
        "danger",
      );
      return;
    }

    const isEditing = Boolean(editingId);
    saveButton.disabled = true;
    saveSpinner.classList.remove("d-none");
    try {
      const response = await fetch(
        isEditing ? `/api/categories/${encodeURIComponent(editingId)}` : "/api/categories",
        {
          method: isEditing ? "PUT" : "POST",
          body: new FormData(form),
        },
      );
      if (!response.ok) {
        throw new Error(await errorMessage(response));
      }
      modal.hide();
      hideMessage(pageMessage);
      if (await loadCategories()) {
        showMessage(
          pageMessage,
          isEditing ? "Category updated successfully." : "Category created successfully.",
          "success",
        );
      }
    } catch (error) {
      console.error("Save category error:", error);
      showMessage(formMessage, error.message || "Failed to save category.", "danger");
    } finally {
      saveButton.disabled = false;
      saveSpinner.classList.add("d-none");
    }
  });

  modalElement.addEventListener("hidden.bs.modal", resetForm);
  loadCategories();
});
