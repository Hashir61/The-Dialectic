/* Site behaviour: date, menu, theme, reading progress, copy link, search.
   No libraries, no tracking. All text from the search index is inserted
   with textContent, never as HTML. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- colour theme toggle ---------- */
  var toggle = document.querySelector("[data-theme-toggle]");
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function labelToggle() {
    if (!toggle) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
  }
  if (toggle) {
    labelToggle();
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      labelToggle();
    });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("primary-nav");
  if (menuBtn && nav) {
    var label = menuBtn.querySelector(".menu-label");
    function setMenu(open) {
      menuBtn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
    }
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.matchMedia("(min-width: 60em)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- homepage: show the small brand once the nameplate scrolls away ---------- */
  var brand = document.querySelector("[data-brand-hidden]");
  var nameplate = document.getElementById("nameplate");
  if (brand && nameplate && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      brand.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { rootMargin: "-64px 0px 0px 0px" }).observe(nameplate);
  } else if (brand) {
    brand.classList.add("is-visible");
  }

  /* ---------- reading progress on essays ---------- */
  var bar = document.querySelector("[data-progress]");
  var body = document.querySelector(".prose");
  if (bar && body) {
    var ticking = false;
    function update() {
      var rect = body.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var done = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      bar.style.transform = "scaleX(" + done.toFixed(4) + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- copy link ---------- */
  var copyBtn = document.querySelector("[data-copy-link]");
  var copyStatus = document.querySelector("[data-copy-status]");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var url = copyBtn.getAttribute("data-copy-link");
      function done(ok) {
        copyBtn.textContent = ok ? "Link copied" : "Copy link";
        if (copyStatus) copyStatus.textContent = ok ? "Link copied to clipboard." : "Copying failed. Select the address bar to copy the link.";
        setTimeout(function () { copyBtn.textContent = "Copy link"; }, 2400);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------- search ---------- */
  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  var status = document.querySelector("[data-search-status]");
  if (input && results) {
    var index = null;
    var decoder = new DOMParser();
    function plain(s) {
      // decode any HTML entities safely (DOMParser documents are inert)
      return decoder.parseFromString(String(s || ""), "text/html").documentElement.textContent || "";
    }
    function norm(s) {
      return plain(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }
    function render(query) {
      results.textContent = "";
      var q = norm(query).trim();
      if (!q) { status.textContent = ""; return; }
      var terms = q.split(/\s+/).filter(Boolean);
      var scored = [];
      index.forEach(function (item) {
        var t = norm(item.title), sec = norm(item.section), d = norm(item.dek), x = norm(item.text);
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          var term = terms[i], hit = 0;
          if (t.indexOf(term) > -1) hit += 6;
          if (sec.indexOf(term) > -1) hit += 4;
          if (d.indexOf(term) > -1) hit += 3;
          if (x.indexOf(term) > -1) hit += 1;
          if (!hit) return;          // every word must appear somewhere
          score += hit;
        }
        if (t.indexOf(q) > -1) score += 8;  // whole phrase in the title
        scored.push({ item: item, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      status.textContent = scored.length === 0
        ? "No essays match \u201c" + query.trim() + "\u201d. Try fewer or different words."
        : scored.length + (scored.length === 1 ? " essay matches " : " essays match ") + "\u201c" + query.trim() + "\u201d.";
      scored.slice(0, 50).forEach(function (r) {
        var it = r.item;
        var li = el("li");
        var art = el("article", "row");
        var txt = el("div", "row-text");
        if (it.section) txt.appendChild(el("p", "kicker", plain(it.section)));
        var h = el("h2", "row-title");
        var a = el("a", null, plain(it.title));
        a.href = it.url;          // relative URL produced by the site itself
        h.appendChild(a);
        txt.appendChild(h);
        if (it.dek) txt.appendChild(el("p", "dek", plain(it.dek)));
        txt.appendChild(el("p", "meta", plain(it.date)));
        art.appendChild(txt);
        li.appendChild(art);
        results.appendChild(li);
      });
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    status.textContent = "Loading the index\u2026";
    fetch(document.body.getAttribute("data-search-index"), { credentials: "same-origin" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        index = Array.isArray(data) ? data : [];
        status.textContent = index.length ? "" : "There are no essays to search yet.";
        if (initial && index.length) render(initial);
        var timer;
        input.addEventListener("input", function () {
          clearTimeout(timer);
          timer = setTimeout(function () {
            render(input.value);
            var u = new URL(window.location.href);
            if (input.value.trim()) u.searchParams.set("q", input.value.trim()); else u.searchParams.delete("q");
            history.replaceState(null, "", u);
          }, 140);
        });
      })
      .catch(function () {
        status.textContent = "The search index could not be loaded. Refresh the page to try again.";
      });
    var form = input.closest("form");
    if (form) form.addEventListener("submit", function (e) {
      if (index) { e.preventDefault(); render(input.value); }
    });
  }

  if (reduceMotion) root.classList.add("reduce-motion");
})();
