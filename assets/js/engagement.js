(async function () {
  const postId = document.body.dataset.postId || location.pathname.replace(/\//g, "-");
  const box = document.getElementById("engagement");
  const btn = document.getElementById("like-btn");
  const countEl = document.getElementById("like-count");
  const labelEl = btn.querySelector(".like-label");
  const mount = document.getElementById("giscus-mount");

  const footnotes = document.querySelector(".footnotes");
  if (box && footnotes) footnotes.insertAdjacentElement("afterend", box);

  function getTheme() {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "dark") return "dark";
    if (stored === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  const likedKey = "liked:" + postId;
  const localCountKey = "likes-local:" + postId;
  let liked = false;
  try { liked = localStorage.getItem(likedKey) === "1"; } catch (e) {}

  function render(n) {
    countEl.textContent = n;
    btn.setAttribute("aria-pressed", String(liked));
    btn.disabled = liked;
    labelEl.textContent = liked ? "Liked" : "Like";
  }

  async function readCount() {
    try { return parseInt(localStorage.getItem(localCountKey) || "0", 10); } catch (e) { return 0; }
  }

  let current = await readCount();
  render(current);

  btn.addEventListener("click", async () => {
    if (liked) return;
    liked = true;
    current += 1;
    render(current);
    try { localStorage.setItem(likedKey, "1"); } catch (e) {}
    try { localStorage.setItem(localCountKey, String(current)); } catch (e) {}
  });

  const s = document.createElement("script");
  s.src = "https://utteranc.es/client.js";
  s.setAttribute("repo", "Hashir61/The-Dialectic");
  s.setAttribute("issue-term", "pathname");
  s.setAttribute("theme", getTheme() === "dark" ? "github-dark" : "github-light");
  s.setAttribute("crossorigin", "anonymous");
  s.async = true;
  mount.appendChild(s);

  new MutationObserver(() => {
    const frame = document.querySelector("iframe.utterances-frame");
    if (!frame) return;
    frame.contentWindow.postMessage(
      { type: "set-theme", theme: getTheme() === "dark" ? "github-dark" : "github-light" },
      "https://utteranc.es"
    );
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const frame = document.querySelector("iframe.utterances-frame");
    if (!frame) return;
    frame.contentWindow.postMessage(
      { type: "set-theme", theme: getTheme() === "dark" ? "github-dark" : "github-light" },
      "https://utteranc.es"
    );
  });

})();
