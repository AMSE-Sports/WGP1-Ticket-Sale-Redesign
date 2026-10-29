/* A visual guide only: existing registration and consent validation stay authoritative. */
(() => {
  "use strict";
  const form = document.getElementById("visitor-form");
  const screen = document.getElementById("screen-visitor");
  if (!form || !screen) return;
  const copy = {
    th: { next:"ถัดไป: {field}", done:"กรอกครบแล้ว", ready:"ครบแล้ว! พร้อมยืนยัน", count:"ครบ {done}/{total}", go:"ไปช่องถัดไป", confirm:"ไปยืนยัน" },
    en: { next:"Next: {field}", done:"Completed", ready:"All set! Ready to confirm", count:"{done}/{total} complete", go:"Next field", confirm:"Review and confirm" },
    zh: { next:"下一项：{field}", done:"已完成", ready:"已填完，可以确认了！", count:"已完成 {done}/{total}", go:"前往下一项", confirm:"前往确认" },
    ja: { next:"次：{field}", done:"入力済み", ready:"入力完了！確認できます", count:"{done}/{total} 完了", go:"次の項目へ", confirm:"確認へ" },
    ko: { next:"다음: {field}", done:"완료", ready:"모두 입력했어요! 확인해 주세요", count:"{done}/{total} 완료", go:"다음 항목", confirm:"확인하기" },
    fr: { next:"Ensuite : {field}", done:"Complété", ready:"Tout est prêt ! Vous pouvez confirmer", count:"{done}/{total} complétés", go:"Champ suivant", confirm:"Vérifier et confirmer" },
    es: { next:"Siguiente: {field}", done:"Completado", ready:"¡Todo listo! Ya puede confirmar", count:"{done}/{total} completados", go:"Siguiente campo", confirm:"Revisar y confirmar" },
    de: { next:"Als Nächstes: {field}", done:"Ausgefüllt", ready:"Alles ausgefüllt! Bitte bestätigen", count:"{done}/{total} ausgefüllt", go:"Nächstes Feld", confirm:"Prüfen und bestätigen" },
    ru: { next:"Далее: {field}", done:"Заполнено", ready:"Всё готово! Можно подтвердить", count:"Заполнено {done}/{total}", go:"Следующее поле", confirm:"Проверить и подтвердить" },
    pt: { next:"Próximo: {field}", done:"Preenchido", ready:"Tudo pronto! Pode confirmar", count:"{done}/{total} preenchidos", go:"Próximo campo", confirm:"Rever e confirmar" },
    ar: { next:"التالي: {field}", done:"مكتمل", ready:"اكتملت البيانات! يمكنك التأكيد", count:"اكتمل {done}/{total}", go:"الحقل التالي", confirm:"مراجعة وتأكيد" },
    it: { next:"Avanti: {field}", done:"Compilato", ready:"Tutto pronto! Puoi confermare", count:"{done}/{total} compilati", go:"Campo successivo", confirm:"Rivedi e conferma" }
  };
  const status = document.createElement("div");
  status.className = "visitor-guide";
  const live = document.createElement("div");
  live.className = "visitor-guide-copy";
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  const message = document.createElement("span");
  const count = document.createElement("small");
  live.append(message, count);
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "visitor-guide-next";
  status.append(live, nextButton);
  screen.querySelector(".page-head").append(status);

  const field = (id, key) => ({ controls:[document.getElementById(id)], key });
  const group = (name, key) => ({ controls:[...form.querySelectorAll(`input[name="${name}"]`)], key, group:true });
  function requiredFields() {
    const fields = [field("v-first","firstName"),field("v-last","lastName"),field("v-age","ageGroup"),field("v-gender","gender"),field("v-country","nationality")];
    if (isMinorAgeGroup(document.getElementById("v-age").value)) fields.push(field("g-name","guardianName"),field("g-relation","relationship"),field("g-phone","guardianPhone"),field("g-confirm","guardianTitle"));
    fields.push(group("v-previous","previousAttendance"),group("v-source","sourceTitle"),field("v-privacy","consentTitle"));
    const email = document.getElementById("v-email");
    if (!email.disabled && email.value.trim()) fields.push(field("v-email","marketingEmail"));
    return fields;
  }
  function complete(item) {
    if (item.group) return item.controls.some(control => control.checked);
    const control = item.controls[0];
    if (control.id === "v-country") return Boolean(control.dataset.countryCode) && control.validity.valid;
    if (control.type === "checkbox") return control.checked;
    return Boolean(control.value.trim()) && control.validity.valid;
  }
  const allFields = [...requiredFields(),field("g-name","guardianName"),field("g-relation","relationship"),field("g-phone","guardianPhone"),field("g-confirm","guardianTitle"),field("v-email","marketingEmail")];
  const wrappers = new Map();
  allFields.forEach(item => {
    const control = item.controls[0];
    const wrapper = item.group ? control.closest("fieldset") : control.closest("label");
    if (!wrapper || wrappers.has(wrapper)) return;
    wrapper.classList.add("guided-field");
    const badge = document.createElement("span");
    badge.className = "guided-field-status";
    badge.setAttribute("aria-hidden", "true");
    wrapper.append(badge);
    wrappers.set(wrapper, badge);
  });
  let pending = null;
  let busy = false;
  const setText = (node, value) => { if (node.textContent !== value) node.textContent = value; };
  function refresh() {
    if (busy) return;
    busy = true;
    try {
      const words = copy[currentLanguage] || copy.en;
      const fields = requiredFields();
      pending = fields.find(item => !complete(item)) || null;
      wrappers.forEach((badge, wrapper) => { wrapper.classList.remove("guide-complete","guide-current"); setText(badge, ""); badge.removeAttribute("title"); });
      const mark = item => {
        const control = item.controls[0];
        const wrapper = item.group ? control.closest("fieldset") : control.closest("label");
        const done = complete(item);
        wrapper.classList.toggle("guide-complete", done);
        wrapper.classList.toggle("guide-current", item === pending);
        const badge = wrappers.get(wrapper);
        if (done) { setText(badge,"✓"); badge.title = words.done; }
        else if (item === pending) setText(badge,"→");
      };
      fields.forEach(mark);
      form.querySelectorAll(".form-section,.guardian-panel").forEach(section => {
        const items = fields.filter(item => section.contains(item.controls[0]));
        section.classList.toggle("guide-section-complete", items.length > 0 && items.every(complete));
      });
      const done = fields.filter(complete).length;
      const label = pending ? t(pending.key).replace(/\s*\*\s*$/, "") : "";
      setText(message, pending ? words.next.replace("{field}", label) : "✓ " + words.ready);
      setText(count, words.count.replace("{done}",localizedNumber(done)).replace("{total}",localizedNumber(fields.length)));
      setText(nextButton, pending ? words.go : words.confirm);
      status.classList.toggle("guide-all-complete", !pending);
    } finally { busy = false; }
  }
  function focusNext() {
    refresh();
    const target = pending ? pending.controls[0] : form.querySelector(".finish-action");
    target.focus({ preventScroll:true });
    const rectangle = target.getBoundingClientRect();
    if (rectangle.top < 0 || rectangle.bottom > innerHeight) target.scrollIntoView({ block:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  nextButton.addEventListener("click",focusNext);
  form.addEventListener("input",refresh);
  form.addEventListener("change",refresh);
  form.addEventListener("focusout",event => {
    if (event.target.id === "v-country" && event.target.value.trim()) validateCountrySelection();
    refresh();
  });
  form.addEventListener("keydown",event => {
    if (event.key !== "Enter" || event.defaultPrevented || event.isComposing || event.target.tagName !== "INPUT" || event.target.type === "checkbox" || event.target.type === "radio") return;
    if (event.target.id === "v-country") validateCountrySelection();
    refresh();
    if (pending) { event.preventDefault(); focusNext(); }
  });
  window.WGP1_VISITOR_GUIDE = { refresh };
  refresh();
})();
