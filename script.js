const header = document.querySelector("[data-header]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = () => {
  const offset = (header?.offsetHeight ?? 0) + 80;
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= offset)
    .at(-1);

  navLinks.forEach((link) => {
    const isActive = current && link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("is-active", Boolean(isActive));
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("resize", setActiveLink);
setActiveLink();

const form = document.querySelector("[data-brief-form]");
const statusNode = document.querySelector("[data-form-status]");
const outputNode = document.querySelector("[data-brief-output]");

const getValue = (data, key, fallback = "Не указано") => {
  const value = String(data.get(key) || "").trim();
  return value || fallback;
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const brief = [
    "Заявка на подписочный аутсорс чат-ботов",
    "",
    `Имя: ${getValue(data, "name")}`,
    `Формат: ${getValue(data, "plan")}`,
    `Платформа: ${getValue(data, "platform")}`,
    `Главная цель: ${getValue(data, "goal")}`,
    `Трафик: ${getValue(data, "traffic")}`,
    `Keitaro / CRM / стек: ${getValue(data, "stack")}`,
    "",
    "Что нужно собрать:",
    getValue(data, "details"),
  ].join("\n");

  outputNode.value = brief;

  try {
    await navigator.clipboard.writeText(brief);
    statusNode.textContent = "Бриф скопирован. Его можно отправить в Telegram, WhatsApp или почту.";
    outputNode.classList.remove("is-visible");
  } catch {
    statusNode.textContent = "Бриф готов. Выделите текст ниже и отправьте его в удобный мессенджер.";
    outputNode.classList.add("is-visible");
    outputNode.focus();
    outputNode.select();
  }
});
