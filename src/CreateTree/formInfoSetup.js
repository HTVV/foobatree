import * as icons from "../view/elements/Card.icons.js";
import autosize from "https://unpkg.com/autosize@4.0.2/src/autosize.js";

export function formInfoSetup(form_creator, closeCallback) {
  const formContainer = document.createElement("div");
  update();
  return formContainer;

  function update() {
    const formHtml = getHtml(form_creator);

    formContainer.innerHTML = formHtml;
    autosize.update(document.querySelectorAll("textarea"));
    autosize(document.querySelectorAll("textarea"));

    setupEventListeners();
    return formContainer;
  }

  function setupEventListeners() {
    const form = formContainer.querySelector("form");
    form.addEventListener("submit", form_creator.onSubmit);

    const cancel_btn = form.querySelector(".f3-cancel-btn");
    cancel_btn.addEventListener("click", onCancel);

    const main_btn = form.querySelector(".f3-set-main-btn");
    main_btn.addEventListener("click", setMain);

    const edit_btn = form.querySelector(".f3-edit-btn");
    if (edit_btn) edit_btn.addEventListener("click", onEdit);

    const delete_btn = form.querySelector(".f3-delete-btn");
    if (delete_btn && form_creator.onDelete) {
      delete_btn.addEventListener("click", form_creator.onDelete);
    }

    const add_relative_btn = form.querySelector(".f3-add-relative-btn");
    if (add_relative_btn && form_creator.addRelative) {
      add_relative_btn.addEventListener("click", () => {
        if (form_creator.addRelativeActive) form_creator.addRelativeCancel();
        else form_creator.addRelative();
        form_creator.addRelativeActive = !form_creator.addRelativeActive;
        update();
      });
    }

    const remove_relative_btn = form.querySelector(".f3-remove-relative-btn");
    if (remove_relative_btn && form_creator.removeRelative) {
      remove_relative_btn.addEventListener("click", () => {
        if (form_creator.removeRelativeActive)
          form_creator.removeRelativeCancel();
        else form_creator.removeRelative();
        form_creator.removeRelativeActive = !form_creator.removeRelativeActive;
        update();
      });
    }

    const close_btn = form.querySelector(".f3-close-btn");
    close_btn.addEventListener("click", closeCallback);

    const link_existing_relative_select = form.querySelector(
      ".f3-link-existing-relative select"
    );
    if (link_existing_relative_select) {
      link_existing_relative_select.addEventListener(
        "change",
        form_creator.linkExistingRelative.onSelect
      );
    }

    if (form_creator.onFormCreation) {
      form_creator.onFormCreation({
        cont: formContainer,
        form_creator: form_creator,
      });
    }

    if (form_creator.getKinshipInfo) {
      const kinship_info = form_creator.getKinshipInfo();
      if (kinship_info) formContainer.appendChild(kinship_info);
    }

    if (document.getElementById("birth-date-modifier-select")) {
      document
        .getElementById("birth-date-modifier-select")
        .addEventListener("change", function () {
          if (this.value == "between") {
            document.getElementsByClassName("birth2-inputs")[0].style.display =
              "block";
          } else {
            document.getElementsByClassName("birth2-inputs")[0].style.display =
              "none";
          }
        });
    }

    if (document.getElementById("death-date-modifier-select")) {
      document
        .getElementById("death-date-modifier-select")
        .addEventListener("change", function () {
          if (this.value == "between") {
            document.getElementsByClassName("death2-inputs")[0].style.display =
              "block";
          } else {
            document.getElementsByClassName("death2-inputs")[0].style.display =
              "none";
          }
        });
    }

    function onCancel() {
      form_creator.editable = false;
      if (form_creator.onCancel) form_creator.onCancel();
      update();
    }

    function setMain() {
      form_creator.main = !form_creator.main;
      localStorage.setItem("main", form_creator.datum_id);
      update();
    }

    function onEdit() {
      console.log(document.querySelectorAll("textarea"));

      form_creator.editable = !form_creator.editable;
      update();
    }
  }
}

function getHtml(form_creator) {
  return ` 
    <form id="familyForm" class="f3-form ${
      form_creator.editable ? "" : "non-editable"
    }">
      ${closeBtn()}
      ${
        form_creator.title
          ? `<h3 class="f3-form-title">${form_creator.title}</h3>`
          : ""
      }
      <div style="text-align: right; display: ${
        form_creator.new_rel ? "none" : "block"
      }">
        ${setMainBtn()}
        ${
          form_creator.addRelative && !form_creator.no_edit
            ? addRelativeBtn()
            : ""
        }
        ${form_creator.no_edit ? spaceDiv() : editBtn()}
      </div>

      ${genderRadio()}

      ${fields()}
      
      <div class="f3-form-buttons">
        <button type="button" class="f3-cancel-btn">Cancel</button>
        <button type="submit">Submit</button>
      </div>

      ${form_creator.linkExistingRelative ? addLinkExistingRelative() : ""}

      <hr>

      ${form_creator.onDelete ? deleteBtn() : ""}

      ${form_creator.removeRelative ? removeRelativeBtn() : ""}
    </form>
  `;

  function deleteBtn() {
    return `
      <div>
        <button type="button" class="f3-delete-btn" ${
          form_creator.can_delete ? "" : "disabled"
        }>
          Delete
        </button>
      </div>
    `;
  }

  function removeRelativeBtn() {
    return `
      <div>
        <button type="button" class="f3-remove-relative-btn${
          form_creator.removeRelativeActive ? " active" : ""
        }">
          ${
            form_creator.removeRelativeActive
              ? "Cancel Remove Relation"
              : "Remove Relation"
          }
        </button>
      </div>
    `;
  }

  function addRelativeBtn() {
    return `
      <span class="f3-add-relative-btn">
        ${
          form_creator.addRelativeActive
            ? icons.userPlusCloseSvgIcon()
            : icons.userPlusSvgIcon()
        }
      </span>
    `;
  }

  function setMainBtn() {
    return `
      <span class="f3-set-main-btn">
        ${
          form_creator.datum_id == localStorage.getItem("main")
            ? '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/></svg>'
            : '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/></svg>'
        }
      </span>
    `;
  }

  function editBtn() {
    return `
      <span class="f3-edit-btn">
        ${
          form_creator.editable
            ? icons.pencilOffSvgIcon()
            : icons.pencilSvgIcon()
        }
      </span>
    `;
  }

  function genderRadio() {
    if (!form_creator.editable) return "";
    return `
      <div class="f3-radio-group">
        ${form_creator.gender_field.options
          .map(
            (option) => `
          <label>
            <input type="radio" name="${form_creator.gender_field.id}" 
              value="${option.value}" 
              ${
                option.value === form_creator.gender_field.initial_value
                  ? "checked"
                  : ""
              }
              ${form_creator.gender_field.disabled ? "disabled" : ""}
            >
            ${option.label}
          </label>
        `
          )
          .join("")}
      </div>
    `;
  }

  function fields() {
    if (!form_creator.editable) return infoField();
    let fields_html = "";
    form_creator.fields.forEach((field) => {
      if (field.type === "text") {
        fields_html += `
        <div class="f3-form-field">
          <label>${field.label}</label>
          <input type="${field.type}" 
            name="${field.id}" 
            value="${field.initial_value || ""}"
            placeholder="${field.label}">
        </div>`;
      } else if (field.type === "textarea") {
        fields_html += `
        <div class="f3-form-field">
          <label>${field.label}</label>
          <textarea name="${field.id}" 
            placeholder="${field.label}">${field.initial_value || ""}</textarea>
        </div>`;
      } else if (field.type === "select") {
        fields_html += `
        <div class="f3-form-field">
          <label>${field.label}</label>
          <select name="${field.id}" value="${field.initial_value || ""}">
            <option value="">${
              field.placeholder || `Select ${field.label}`
            }</option>
            ${field.options
              .map(
                (option) =>
                  `<option ${
                    option.value === field.initial_value ? "selected" : ""
                  } value="${option.value}">${option.label}</option>`
              )
              .join("")}
          </select>
        </div>`;
      } else if (field.type === "rel_reference") {
        document;
        fields_html += `
        <div class="f3-form-field">
          <label>${field.label} - <i>${field.rel_label}</i></label>
          <input type="text" 
            name="${field.id}" 
            value="${field.initial_value || ""}"
            placeholder="${field.label}">
        </div>`;
      } else if (field.type == "date") {
        console.log()
        fields_html += `
        <div class="f3-form-field">
          <label>${field.label}</label>
          <select id="${field.id.slice(0, 5)}-date-modifier-select">
      <option value="exact" ${field.initial_value?.modifier == "exact" ? "selected" : ""}>Exact</option>
      <option value="circa" ${field.initial_value?.modifier == "circa" ? "selected" : ""}>Circa</option>
      <option value="before" ${field.initial_value?.modifier == "before" ? "selected" : ""}>Before</option>
      <option value="after" ${field.initial_value?.modifier == "after" ? "selected" : ""}>After</option>
      <option value="between" ${field.initial_value?.modifier == "between" ? "selected" : ""}>Between</option>
    </select>
    <br /><br />
    <input
      type="number"
      id="${field.id.slice(0, 5)}DayInput1"
      min="1"
      max="31"
      placeholder="DD"
      value="${field.initial_value?.day1}"
    />
    <input
      type="number"
      id="${field.id.slice(0, 5)}MonthInput1"
      min="1"
      max="12"
      placeholder="MM"
      value="${field.initial_value?.month1}"
    />
    <input type="number" id="${field.id.slice(
      0,
      5
    )}YearInput1" min="0" placeholder="YYYY" value="${field.initial_value?.year1}"/>
    <div class="${field.id.slice(0, 5)}2-inputs" style="display:${field.initial_value?.modifier == "between" ? "block" : "none"};">
      <p style="align-self: flex-start">to</p>
      <input
        type="number"
        id="${field.id.slice(0, 5)}DayInput2"
        min="1"
        max="31"
        placeholder="DD"
        value="${field.initial_value?.day2}"
      />
      <input
        type="number"
        id="${field.id.slice(0, 5)}MonthInput2"
        min="1"
        max="12"
        placeholder="MM"
        value="${field.initial_value?.month2}"
      />
      <input type="number" id="${field.id.slice(
        0,
        5
      )}YearInput2" min="0" placeholder="YYYY" value="${field.initial_value?.year2}"/>
    </div>
        </div>`;
      }
    });
    return fields_html;

    function infoField() {
      let fields_html = "";
      form_creator.fields.forEach((field) => {
        if (field.type === "rel_reference") {
          if (!field.initial_value) return;
          fields_html += `
          <div class="f3-info-field">
            <span class="f3-info-field-label">${field.label} - <i>${
            field.rel_label
          }</i></span>
            <span class="f3-info-field-value">${
              field.initial_value || ""
            }</span>
          </div>`;
        } else if (field.type === "select") {
          if (!field.initial_value) return;
          fields_html += `
          <div class="f3-info-field">
            <span class="f3-info-field-label">${field.label}</span>
            <span class="f3-info-field-value">${
              field.options.find(
                (option) => option.value === field.initial_value
              )?.label || ""
            }</span>
          </div>`;
        } else if (field.type === "date") {
          if (!field.initial_value) return;
          console.log(field.initial_value);
          if (field.id.slice(0, 5) == "birth") {
            const birthDate = field.initial_value;
            if (typeof birthDate == "object") {
              let birthModifier = birthDate.modifier + " ";
              if (birthModifier == "exact ") birthModifier = "";
              if (birthModifier == "between ") {
                birthModifier = "";
                fields_html += `
                <div class="f3-info-field">
                  <span class="f3-info-field-label">${field.label}</span>
                  <span class="f3-info-field-value">Between ${cleanDateString(
                    `${birthModifier}${birthDate.day1}-${birthDate.month1}-${birthDate.year1} and ${birthDate.day2}-${birthDate.month2}-${birthDate.year2}`
                  )}</span>
                </div>`;
              } else {
                if (birthModifier == "circa ") birthModifier = "c. ";
                fields_html += `
                <div class="f3-info-field">
                  <span class="f3-info-field-label">${field.label}</span>
                  <span class="f3-info-field-value">${cleanDateString(
                    `${birthModifier}${birthDate.day1}-${birthDate.month1}-${birthDate.year1}`
                  )}</span>
                </div>`;
              }
            } else {
              fields_html += `
                <div class="f3-info-field">
                  <span class="f3-info-field-label">${field.label}</span>
                  <span class="f3-info-field-value">${field.initial_value}</span>
                </div>`;
            }
          }
          if (field.id.slice(0, 5) == "death") {
            const deathDate = field.initial_value;
            if (typeof deathDate == "object") {
              let deathModifier = deathDate.modifier + " ";
              if (deathModifier == "exact ") deathModifier = "";
              if (deathModifier == "between ") {
                deathModifier = "";
                fields_html += `
                <div class="f3-info-field">
                  <span class="f3-info-field-label">${field.label}</span>
                  <span class="f3-info-field-value">Between ${cleanDateString(
                    `${deathModifier}${deathDate.day1}-${deathDate.month1}-${deathDate.year1} and ${deathDate.day2}-${deathDate.month2}-${deathDate.year2}`
                  )}</span>
                </div>`;
              } else {
                if (deathModifier == "circa ") deathModifier = "c. ";
                fields_html += `
                <div class="f3-info-field">
                  <span class="f3-info-field-label">${field.label}</span>
                  <span class="f3-info-field-value">${cleanDateString(
                    `${deathModifier}${deathDate.day1}-${deathDate.month1}-${deathDate.year1}`
                  )}</span>
                </div>`;
              }
            } else {
              fields_html += `
                <div class="f3-info-field">
                  <span class="f3-info-field-label">${field.label}</span>
                  <span class="f3-info-field-value">${field.initial_value}</span>
                </div>`;
            }
          }
        } else {
          fields_html += `
          <div class="f3-info-field">
            <span class="f3-info-field-label">${field.label}</span>
            <span class="f3-info-field-value${(field.id == "writing" || field.id == "sources") ? " longText" : ""}">${
              field.link
                ? linkify(field.initial_value)
                : field.initial_value || ""
            }</span>
          </div>`;
        }
      });
      return fields_html;
    }
  }

  function addLinkExistingRelative() {
    const title = form_creator.linkExistingRelative.hasOwnProperty("title")
      ? form_creator.linkExistingRelative.title
      : "Profile already exists?";
    const select_placeholder = form_creator.linkExistingRelative.hasOwnProperty(
      "select_placeholder"
    )
      ? form_creator.linkExistingRelative.select_placeholder
      : "Select profile";
    const options = form_creator.linkExistingRelative.options;
    return `
      <div>
        <hr>
        <div class="f3-link-existing-relative">
          <label>${title}</label>
          <select>
            <option value="">${select_placeholder}</option>
            ${options
              .map(
                (option) =>
                  `<option value="${option.value}">${option.label}</option>`
              )
              .join("")}
          </select>
        </div>
      </div>
    `;
  }

  function closeBtn() {
    return `
      <span class="f3-close-btn">
        ×
      </span>
    `;
  }

  function spaceDiv() {
    return `<div style="height: 24px;"></div>`;
  }

  //fixes dates e.g. when only year is given from "--1600" to "1600"
  function cleanDateString(string) {
    const split = string.split(" and ");
    if (split.length > 1) {
      let parta = split[0];
      let partb = split[1];
      partb = partb.replace(/^-+|-+$/g, "").replace(/(-)(?=-*\1)/g, "");
      return parta + " and " + partb;
    }
    return string.replace(/^-+|-+$/g, "").replace(/(-)(?=-*\1)/g, "");
  }
}
