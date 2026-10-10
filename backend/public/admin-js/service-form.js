document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("serviceForm");

  if (!serviceForm) return;

  // ========================================
  // QUILL EDITOR
  // ========================================

  const quill = new Quill("#serviceContentEditor", {
    theme: "snow",

    placeholder: "Write the service content...",

    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
      ],
    },
  });

  // ========================================
  // ELEMENTS
  // ========================================

  const titleInput = document.getElementById("serviceTitle");

  const categoryInput = document.getElementById("serviceCategory");

  const priceInput = document.getElementById("servicePrice");

  const durationInput = document.getElementById("serviceDuration");

  const shortDescriptionInput = document.getElementById("shortDescription");

  const contentInput = document.getElementById("serviceContent");

  const imageInput = document.getElementById("serviceImage");

  const imagePreview = document.getElementById("serviceImagePreview");

  const saveButton = serviceForm.querySelector(".save-service-btn");

  const saveButtonText = document.getElementById("saveButtonText");

  const shortDescriptionCount = document.getElementById(
    "shortDescriptionCount",
  );

  // Optional image count element
  const imageCount = document.getElementById("imageCount");

  // ========================================
  // SEO ELEMENTS
  // ========================================

  const metaTitleInput = document.getElementById("metaTitle");

  const metaDescriptionInput = document.getElementById("metaDescription");

  const metaTitleCount = document.getElementById("metaTitleCount");

  const metaDescriptionCount = document.getElementById("metaDescriptionCount");

  // ========================================
  // TAG ELEMENTS
  // ========================================

  const serviceTagInput = document.getElementById("serviceTagInput");

  const serviceTagsContainer = document.getElementById("serviceTagsContainer");

  // ========================================
  // EDIT MODE
  // ========================================

  const params = new URLSearchParams(window.location.search);

  const serviceId = params.get("id");

  const isEditMode = Boolean(serviceId);

  // ========================================
  // IMAGE STATE
  // ========================================

  // Existing images already stored in database
  let existingImages = [];

  // Newly selected files
  let selectedImages = [];

  // Existing images removed by admin
  let removedImages = [];

  // ========================================
  // SEO / TAG STATE
  // ========================================

  let serviceTags = [];

  // ========================================
  // LOAD SERVICE
  // ========================================

  loadCategories()
    .then(() => {
      const requestedCategory = params.get("category");
      if (!isEditMode && requestedCategory) {
        const categoryOption = Array.from(categoryInput.options).find(
          (option) => option.dataset.name === requestedCategory,
        );
        if (categoryOption) {
          categoryInput.value = categoryOption.value;
        }
      }

      if (isEditMode) {
        loadService(serviceId);
      } else {
        updateImageCount();
        updateMetaCounters();
        renderTags();
      }
    })
    .catch((error) => {
      console.error("Load service categories error:", error);
      alert("Failed to load categories. Please refresh and try again.");
    });

  // ========================================
  // SHORT DESCRIPTION COUNTER
  // ========================================

  if (shortDescriptionInput && shortDescriptionCount) {
    const updateCounter = () => {
      shortDescriptionCount.textContent = `${shortDescriptionInput.value.length} / 180`;
    };

    shortDescriptionInput.addEventListener("input", updateCounter);

    updateCounter();
  }

  async function loadCategories() {
    const response = await fetch("/api/categories");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load categories.");
    }

    const selectedValue = categoryInput.value;
    categoryInput.innerHTML = '<option value="">Select category</option>';
    (data.categories || [])
      .filter((category) => category.is_active)
      .forEach((category) => {
        const option = document.createElement("option");
        option.value = category._id;
        option.dataset.name = category.name;
        option.textContent = category.name;
        categoryInput.appendChild(option);
      });

    if (selectedValue) {
      categoryInput.value = selectedValue;
    }
  }

  // ========================================
  // META TITLE COUNTER
  // ========================================

  if (metaTitleInput && metaTitleCount) {
    const updateMetaTitleCounter = () => {
      metaTitleCount.textContent = `${metaTitleInput.value.length} / 60`;
    };

    metaTitleInput.addEventListener("input", updateMetaTitleCounter);

    updateMetaTitleCounter();
  }

  // ========================================
  // META DESCRIPTION COUNTER
  // ========================================

  if (metaDescriptionInput && metaDescriptionCount) {
    const updateMetaDescriptionCounter = () => {
      metaDescriptionCount.textContent = `${metaDescriptionInput.value.length} / 160`;
    };

    metaDescriptionInput.addEventListener(
      "input",
      updateMetaDescriptionCounter,
    );

    updateMetaDescriptionCounter();
  }

  // ========================================
  // IMAGE SELECTION
  // ========================================

  if (imageInput) {
    imageInput.addEventListener("change", () => {
      const files = Array.from(imageInput.files);

      if (files.length === 0) {
        return;
      }

      const maxSize = 2 * 1024 * 1024;

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      // ====================================
      // CHECK TOTAL IMAGE COUNT
      // ====================================

      const currentCount = existingImages.length + selectedImages.length;

      if (currentCount + files.length > 10) {
        alert(
          `You can have a maximum of 10 images. You currently have ${currentCount}.`,
        );

        imageInput.value = "";

        return;
      }

      // ====================================
      // VALIDATE IMAGES
      // ====================================

      for (const file of files) {
        if (file.size > maxSize) {
          alert(`"${file.name}" is larger than 2MB.`);

          imageInput.value = "";

          return;
        }

        if (!allowedTypes.includes(file.type)) {
          alert(`"${file.name}" is not a supported image format.`);

          imageInput.value = "";

          return;
        }
      }

      // ====================================
      // ADD FILES TO STATE
      // ====================================

      selectedImages.push(...files);

      // Reset input so the same image
      // can be selected again if needed
      imageInput.value = "";

      renderImages();
    });
  }

  // ========================================
  // RENDER ALL IMAGES
  // ========================================

  function renderImages() {
    imagePreview.innerHTML = "";

    const totalImages = existingImages.length + selectedImages.length;

    // ====================================
    // NO IMAGES
    // ====================================

    if (totalImages === 0) {
      resetImagePreview();
      updateImageCount();
      return;
    }

    // ====================================
    // EXISTING IMAGES
    // ====================================

    existingImages.forEach((image, index) => {
      const imageItem = document.createElement("div");

      imageItem.className = "service-preview-item existing-image";

      imageItem.innerHTML = `
          <img
            src="${escapeHtml(image)}"
            alt="Service image"
          />

          <button
            type="button"
            class="service-preview-remove"
            data-type="existing"
            data-index="${index}"
            title="Remove image"
            aria-label="Remove image"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;

      imagePreview.appendChild(imageItem);
    });

    // ====================================
    // NEWLY SELECTED IMAGES
    // ====================================

    selectedImages.forEach((file, index) => {
      const imageItem = document.createElement("div");

      imageItem.className = "service-preview-item new-image";

      const imageURL = URL.createObjectURL(file);

      imageItem.innerHTML = `
          <img
            src="${imageURL}"
            alt="New service image"
          />

          <button
            type="button"
            class="service-preview-remove"
            data-type="new"
            data-index="${index}"
            title="Remove image"
            aria-label="Remove image"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;

      imagePreview.appendChild(imageItem);
    });

    updateImageCount();
  }

  // ========================================
  // REMOVE IMAGE
  // ========================================

  imagePreview.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".service-preview-remove");

    if (!removeButton) return;

    const type = removeButton.dataset.type;

    const index = Number(removeButton.dataset.index);

    // ====================================
    // REMOVE EXISTING IMAGE
    // ====================================

    if (type === "existing") {
      const image = existingImages[index];

      if (image) {
        removedImages.push(image);
      }

      existingImages.splice(index, 1);
    }

    // ====================================
    // REMOVE NEW IMAGE
    // ====================================

    if (type === "new") {
      selectedImages.splice(index, 1);
    }

    renderImages();
  });

  // ========================================
  // TAGS
  // ========================================

  if (serviceTagInput) {
    serviceTagInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      const tag = serviceTagInput.value.trim();

      if (!tag) return;

      // Prevent duplicate tags
      const exists = serviceTags.some(
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase(),
      );

      if (exists) {
        serviceTagInput.value = "";
        return;
      }

      serviceTags.push(tag);

      serviceTagInput.value = "";

      renderTags();
    });
  }

  // ========================================
  // RENDER TAGS
  // ========================================

  function renderTags() {
    if (!serviceTagsContainer) {
      return;
    }

    serviceTagsContainer.innerHTML = "";

    serviceTags.forEach((tag, index) => {
      const tagElement = document.createElement("div");

      tagElement.className = "service-tag";

      tagElement.innerHTML = `
          <span>
            ${escapeHtml(tag)}
          </span>

          <button
            type="button"
            class="remove-tag-btn"
            data-index="${index}"
            title="Remove tag"
            aria-label="Remove tag"
          >
            <i class="bi bi-x"></i>
          </button>
        `;

      serviceTagsContainer.appendChild(tagElement);
    });
  }

  // ========================================
  // REMOVE TAG
  // ========================================

  if (serviceTagsContainer) {
    serviceTagsContainer.addEventListener("click", (event) => {
      const button = event.target.closest(".remove-tag-btn");

      if (!button) return;

      const index = Number(button.dataset.index);

      serviceTags.splice(index, 1);

      renderTags();
    });
  }

  // ========================================
  // FORM SUBMIT
  // ========================================

  serviceForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      // ====================================
      // VALIDATE IMAGES
      // ====================================

      const totalImages = existingImages.length + selectedImages.length;

      if (totalImages === 0) {
        alert("Please add at least one service image.");

        return;
      }

      // ====================================
      // GET QUILL CONTENT
      // ====================================

      const content = quill.root.innerHTML;

      const plainText = quill.getText().trim();

      if (!plainText) {
        alert("Please enter service content.");

        return;
      }

      contentInput.value = content;

      // ====================================
      // CREATE FORMDATA
      // ====================================

      const formData = new FormData();

      formData.append("title", titleInput.value.trim());

      formData.append(
        "categoryId",
        categoryInput.selectedOptions[0]?.dataset.legacy
          ? ""
          : categoryInput.value,
      );

      formData.append(
        "category",
        categoryInput.selectedOptions[0]?.dataset.name || "",
      );

      formData.append("price", priceInput ? priceInput.value.trim() : "");

      formData.append(
        "duration",
        durationInput ? durationInput.value.trim() : "",
      );

      formData.append("shortDescription", shortDescriptionInput.value.trim());

      formData.append("content", content);

      // ====================================
      // STATUS
      // ====================================

      const selectedStatus = document.querySelector(
        'input[name="status"]:checked',
      );

      formData.append(
        "status",
        selectedStatus ? selectedStatus.value : "published",
      );

      // ====================================
      // SEO
      // ====================================

      formData.append(
        "metaTitle",
        metaTitleInput ? metaTitleInput.value.trim() : "",
      );

      formData.append(
        "metaDescription",
        metaDescriptionInput ? metaDescriptionInput.value.trim() : "",
      );

      // ====================================
      // TAGS
      // ====================================

      formData.append("tags", JSON.stringify(serviceTags));

      // ====================================
      // ADD NEW IMAGES
      // ====================================

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // ====================================
      // ADD REMOVED EXISTING IMAGES
      // ====================================

      removedImages.forEach((image) => {
        formData.append("removedImages", image);
      });

      // ====================================
      // CREATE / UPDATE
      // ====================================

      let url = "/api/services";

      let method = "POST";

      if (isEditMode) {
        url = `/api/services/${serviceId}`;

        method = "PUT";
      }

      // ====================================
      // DISABLE SAVE BUTTON
      // ====================================

      saveButton.disabled = true;

      saveButtonText.textContent = isEditMode ? "Updating..." : "Saving...";

      // ====================================
      // SEND REQUEST
      // ====================================

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      alert(
        data.message ||
          (isEditMode
            ? "Service updated successfully."
            : "Service created successfully."),
      );

      // ====================================
      // REDIRECT
      // ====================================

      window.location.href = "/admin/services";
    } catch (error) {
      console.error("Service form error:", error);

      alert(error.message);

      saveButton.disabled = false;

      saveButtonText.textContent = isEditMode
        ? "Update Service"
        : "Save Service";
    }
  });

  // ========================================
  // LOAD SERVICE FOR EDIT
  // ========================================

  async function loadService(id) {
    try {
      const response = await fetch(`/api/services/${id}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load service.");
      }

      const service = data.service;

      // ====================================
      // PAGE TITLE
      // ====================================

      const formPageTitle = document.getElementById("formPageTitle");

      const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

      if (formPageTitle) {
        formPageTitle.textContent = "Edit Service";
      }

      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = "Edit Service";
      }

      saveButtonText.textContent = "Update Service";

      // ====================================
      // FORM VALUES
      // ====================================

      titleInput.value = service.title || "";

      const categoryOption = Array.from(categoryInput.options).find(
        (option) =>
          option.value === String(service.categoryId || "") ||
          option.dataset.name === service.category,
      );
      categoryInput.value = categoryOption ? categoryOption.value : "";

      if (service.category && !categoryOption) {
        const legacyOption = document.createElement("option");
        legacyOption.value = service.category;
        legacyOption.dataset.name = service.category;
        legacyOption.dataset.legacy = "true";
        legacyOption.textContent = `${service.category} (category unavailable)`;
        legacyOption.selected = true;
        categoryInput.appendChild(legacyOption);
      }

      if (priceInput) {
        priceInput.value = service.price ?? "";
      }

      if (durationInput) {
        durationInput.value = service.duration ?? "";
      }

      shortDescriptionInput.value = service.shortDescription || "";

      // ====================================
      // SHORT DESCRIPTION COUNTER
      // ====================================

      if (shortDescriptionCount) {
        shortDescriptionCount.textContent = `${shortDescriptionInput.value.length} / 180`;
      }

      // ====================================
      // CONTENT
      // ====================================

      if (service.content) {
        quill.root.innerHTML = service.content;

        contentInput.value = service.content;
      }

      // ====================================
      // STATUS
      // ====================================

      const statusRadio = document.querySelector(
        `input[name="status"][value="${service.status}"]`,
      );

      if (statusRadio) {
        statusRadio.checked = true;
      }

      // ====================================
      // SEO VALUES
      // ====================================

      if (metaTitleInput) {
        metaTitleInput.value = service.metaTitle || "";
      }

      if (metaDescriptionInput) {
        metaDescriptionInput.value = service.metaDescription || "";
      }

      // ====================================
      // SEO COUNTERS
      // ====================================

      updateMetaCounters();

      // ====================================
      // TAGS
      // ====================================

      serviceTags = Array.isArray(service.tags) ? [...service.tags] : [];

      renderTags();

      // ====================================
      // EXISTING IMAGES
      // ====================================

      existingImages = Array.isArray(service.images) ? [...service.images] : [];

      selectedImages = [];

      removedImages = [];

      renderImages();
    } catch (error) {
      console.error("Load service error:", error);

      alert(error.message);

      window.location.href = "/admin/services";
    }
  }

  // ========================================
  // META COUNTERS
  // ========================================

  function updateMetaCounters() {
    if (metaTitleInput && metaTitleCount) {
      metaTitleCount.textContent = `${metaTitleInput.value.length} / 60`;
    }

    if (metaDescriptionInput && metaDescriptionCount) {
      metaDescriptionCount.textContent = `${metaDescriptionInput.value.length} / 160`;
    }
  }

  // ========================================
  // IMAGE COUNT
  // ========================================

  function updateImageCount() {
    if (!imageCount) return;

    const totalImages = existingImages.length + selectedImages.length;

    imageCount.textContent = `${totalImages} / 10 images`;
  }

  // ========================================
  // RESET IMAGE PREVIEW
  // ========================================

  function resetImagePreview() {
    imagePreview.innerHTML = `
      <div class="image-placeholder">
        <i class="bi bi-images"></i>

        <strong>No images selected</strong>

        <span>JPG, PNG or WebP</span>
      </div>
    `;
  }

  // ========================================
  // ESCAPE HTML
  // ========================================

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
