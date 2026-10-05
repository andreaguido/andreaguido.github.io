(function () {
  // Abstract / BibTeX panels
  document.querySelectorAll("[data-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.dataset.toggle);
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Copy BibTeX
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = document.getElementById(btn.dataset.copy).textContent;
      var done = function () {
        btn.classList.add("done");
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(function () {
          btn.classList.remove("done");
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        done();
      }
    });
  });

  // Topic filters
  var papers = Array.prototype.slice.call(document.querySelectorAll(".paper"));
  var groups = document.querySelectorAll("#research .group");
  var chips = document.querySelectorAll(".chip");
  var empty = document.querySelector("#research .empty");

  chips.forEach(function (chip) {
    var f = chip.dataset.filter;
    var n = f === "all" ? papers.length : papers.filter(function (p) {
      return p.dataset.topics.split(" ").indexOf(f) !== -1;
    }).length;
    chip.querySelector(".count").textContent = n;

    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.toggle("active", c === chip); });
      papers.forEach(function (p) {
        p.hidden = f !== "all" && p.dataset.topics.split(" ").indexOf(f) === -1;
      });
      var anyShown = false;
      groups.forEach(function (g) {
        var shown = g.querySelectorAll(".paper:not([hidden])").length > 0;
        g.hidden = !shown;
        anyShown = anyShown || shown;
      });
      empty.hidden = anyShown;
    });
  });
})();

// Light/dark toggle: overrides the OS preference and remembers the choice
(function () {
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function isDark() { return root.dataset.theme ? root.dataset.theme === "dark" : mq.matches; }
  function sync() { btn.querySelector("i").className = isDark() ? "fa-solid fa-sun" : "fa-solid fa-moon"; }
  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });
  mq.addEventListener("change", sync);
  sync();
})();
