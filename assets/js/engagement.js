(async function () {
  const CONFIG = {
    firebase: {
      apiKey: "REPLACE_ME",
      authDomain: "REPLACE_ME",
      projectId: "REPLACE_ME",
      appId: "REPLACE_ME"
    },
    giscus: {
      repo: "hashir61/The-Dialectic",
      repoId: "R_kgDOUmPXDg",
      category: "General",
      categoryId: "DIC_kwDOUmPXDs4DGjls"
    }
  };

  const postId = document.body.dataset.postId || location.pathname.replace(/\//g, "-");
  const box = document.getElementById("engagement");
  const btn = document.getElementById("like-btn");
  const countEl = document.getElementById("like-count");
  const labelEl = btn.querySelector(".like-label");
  const mount = document.getElementById("giscus-mount");
  const notSet = (o) => Object.values(o).some((v) => String(v).includes("REPLACE_ME"));

  const footnotes = document.querySelector(".footnotes");
  if (box && footnotes) footnotes.insertAdjacentElement("afterend", box);

  function getTheme() {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "dark") return "dark";
    if (stored === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function sendGiscusTheme(theme) {
    const frame = document.querySelector("iframe.giscus-frame");
    if (!frame) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme === "dark" ? "dark" : "light" } } },
      "https://giscus.app"
    );
  }
  new MutationObserver(() => sendGiscusTheme(getTheme()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => sendGiscusTheme(getTheme()));

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

  let remote = null;
  if (!notSet(CONFIG.firebase)) {
    try {
      const v = "10.12.2";
      const [appMod, fs] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/" + v + "/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/" + v + "/firebase-firestore.js")
      ]);
      const app = appMod.initializeApp(CONFIG.firebase);
      const db = fs.getFirestore(app);
      remote = { fs, ref: fs.doc(db, "likes", postId) };
    } catch (e) { console.warn("Likes: Firebase failed.", e); }
  }

  async function readCount() {
    if (remote) {
      try {
        const snap = await remote.fs.getDoc(remote.ref);
        return snap.exists() ? (snap.data().count || 0) : 0;
      } catch (e) {}
    }
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
    if (remote) {
      try { await remote.fs.setDoc(remote.ref, { count: remote.fs.increment(1) }, { merge: true }); }
      catch (e) {}
    } else {
      try { localStorage.setItem(localCountKey, String(current)); } catch (e) {}
    }
  });

  if (!notSet(CONFIG.giscus)) {
    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    const attrs = {
      "data-repo": CONFIG.giscus.repo,
      "data-repo-id": CONFIG.giscus.repoId,
      "data-category": CONFIG.giscus.category,
      "data-category-id": CONFIG.giscus.categoryId,
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "0",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": getTheme(),
      "data-lang": "en"
    };
    Object.keys(attrs).forEach((k) => s.setAttribute(k, attrs[k]));
    s.crossOrigin = "anonymous";
    s.async = true;
    mount.appendChild(s);
  }
})();
