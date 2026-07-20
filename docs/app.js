/* Loads topics.json, fetches each markdown file in content/,
   renders it with marked, and builds the sidebar navigation.
   To add a topic: create content/<id>.md and add an entry to topics.json. */

async function loadSite() {
  const contentEl = document.getElementById("content");
  const tocEl = document.getElementById("toc");

  let topics;
  try {
    const res = await fetch("topics.json", { cache: "no-store" });
    topics = await res.json();
  } catch (err) {
    contentEl.innerHTML =
      "<p class='loading'>Could not load <code>topics.json</code>. " +
      "If you opened this file directly, serve it instead " +
      "(e.g. <code>python -m http.server</code>) or view it on GitHub Pages.</p>";
    return;
  }

  marked.setOptions({ gfm: true });

  const sections = await Promise.all(
    topics.map(async (t) => {
      try {
        const res = await fetch("content/" + t.file, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status);
        const md = await res.text();
        return { topic: t, html: marked.parse(md) };
      } catch (err) {
        return {
          topic: t,
          html: "<p class='loading'>Missing file: <code>content/" + t.file + "</code></p>",
        };
      }
    })
  );

  contentEl.innerHTML = "";

  for (const { topic, html } of sections) {
    const section = document.createElement("section");
    section.className = "topic";
    section.id = topic.id;
    section.innerHTML = html;
    contentEl.appendChild(section);

    const link = document.createElement("a");
    link.href = "#" + topic.id;
    link.textContent = topic.title;
    tocEl.appendChild(link);
  }

  // Add words section last
  let words = [];
  try {
    const res = await fetch("words.json", { cache: "no-store" });
    words = await res.json();

    const wordsSection = document.createElement("section");
    wordsSection.className = "topic";
    wordsSection.id = "words";
    wordsSection.innerHTML = "<h2>Vocabulary</h2>";

    const wordsList = document.createElement("ul");
    wordsList.className = "words-list";
    words.forEach(word => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${word.swedish}</strong> — ${word.english}`;
      wordsList.appendChild(li);
    });

    wordsSection.appendChild(wordsList);
    contentEl.appendChild(wordsSection);

    const wordsLink = document.createElement("a");
    wordsLink.href = "#words";
    wordsLink.textContent = "Vocabulary";
    tocEl.appendChild(wordsLink);
  } catch (err) {
    console.log("words.json not found or error loading");
  }

  // Highlight the topic currently in view.
  const links = tocEl.querySelectorAll("a");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          links.forEach((l) =>
            l.classList.toggle("active", l.hash === "#" + entry.target.id)
          );
        }
      }
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  contentEl.querySelectorAll(".topic").forEach((s) => observer.observe(s));
}

loadSite();
