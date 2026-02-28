/**
 * Lightweight timeline web component that can render arbitrary markup for each
 * item. Consumers supply a `<template>` child describing a single entry’s
 * structure; `load()` provides the data.
 *
 * Entries should follow the “Victory” schema defined in the README.  At a
 * minimum the component will map that data into the following selectors:
 *
 *   date        -> <time> (textContent only)
 *   game        -> <h2> <span>
 *   player      -> <h2> <b> (string or array)
 *   note        -> .notes
 *   victorious  -> add <win-icon> when truthy
 *
 * If the template contains an element with the class `.players` the
 * component will clear it and populate it with one `<li>` per player value
 * (array or string) from the `player` field.  A `<win-icon>` is appended to
 * those list items only when the entry’s `victorious` property is truthy.
 *
 * The component does **not** perform any date formatting; it simply assigns
 * the supplied string to `textContent`.  Consumers are free to include their
 * own formatting filter inside the template.
 *
 * Usage example (from the README):
 *
 * ```html
 * <v-timeline>
 *   <template>
 *     <article>
 *       <h2><span></span><b></b></h2>
 *       <time></time>
 *       <ul class="players">
 *         <li>
 *           player
 *           <win-icon></win-icon><!-- only when player is victorious -->
 *         </li>
 *       </ul>
 *       <div class="notes"></div>
 *       <div class="actions">
 *         <button>Delete</button>
 *         <button>Edit</button>
 *       </div>
 *     </article>
 *   </template>
 * </v-timeline>
 *
 * <script>
 * /** @type {Victory[]} *
 * const data = [];
 * document.querySelector('v-timeline').load(data);
 * </script>
 * ```
 *
 * @typedef {Object} Victory
 * @property {string} [id] Firebase id (unused)
 * @property {string} date ISO date string
 * @property {string} game name of the game played
 * @property {string} [note] optional note
 * @property {string|string[]} player victorious player(s)
 * @property {boolean} [victorious] whether the listed player(s) won
 */

class VTimeline extends HTMLElement {
	#template = null; // HTMLTemplateElement|null
	#data = []; // Victory[]

	connectedCallback() {
		// cache the template so we don't have to re-query every render
		if (!this.#template) {
			const tpl = this.querySelector("template");
			if (tpl instanceof HTMLTemplateElement) {
				this.#template = tpl;
			} else if (tpl) {
				console.warn("v-timeline: <template> is not a template element");
			}
		}
	}

	/**
	 * Replace the contents of the timeline with the supplied array of entries.
	 *
	 * @param {Victory[]} data
	 */
	load(data) {
		if (!Array.isArray(data)) {
			throw new TypeError("v-timeline.load expects an array");
		}
		this.#data = data;
		this.#render();
	}

	#render() {
		// remove everything except the original template node
		for (const child of this.children) {
			if (child !== this.#template) {
				this.removeChild(child);
			}
		}

		if (!this.#template) return;

		for (const entry of this.#data) {
			const clone = this.#template.content.cloneNode(true);
			this.#populate(clone, entry);
			this.appendChild(clone);
		}
	}

	/**
	 * Fill a cloned template fragment with entry data.
	 * @param {DocumentFragment} fragment
	 * @param {Victory} entry
	 */
	#populate(fragment, entry) {
		// date -> <time>
		const timeEl = fragment.querySelector("time");
		if (timeEl && entry.date != null) {
			timeEl.textContent = entry.date;
		}

		// game -> h2 span
		const spanEl = fragment.querySelector("h2 span");
		if (spanEl && entry.game != null) {
			spanEl.textContent = entry.game;
		}

		// player -> h2 b
		const bEl = fragment.querySelector("h2 b");
		if (bEl && entry.player != null) {
			if (Array.isArray(entry.player)) {
				bEl.textContent = entry.player.join(", ");
			} else {
				bEl.textContent = entry.player;
			}
		}

		// notes
		const notesEl = fragment.querySelector(".notes");
		if (notesEl && entry.note != null) {
			notesEl.textContent = entry.note;
		}

		// players list (optional)
		const listEl = fragment.querySelector(".players");
		if (listEl && entry.player != null) {
			// clear any existing content (template may have a sample li)
			listEl.textContent = "";
			const players = Array.isArray(entry.player)
				? entry.player
				: [entry.player];
			for (const p of players) {
				const li = document.createElement("li");
				li.textContent = p;
				if (entry.victorious) {
					const icon = document.createElement("win-icon");
					li.appendChild(icon);
				}
				listEl.appendChild(li);
			}
		}
	}
}

if (!customElements.get("v-timeline")) {
	customElements.define("v-timeline", VTimeline);
}
