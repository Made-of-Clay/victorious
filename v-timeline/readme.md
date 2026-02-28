# `v-timeline` Component

This web component takes an array of objects via `timelineEl.load(data)`. For each entry, map the data to the following markup:

```
date        time
game        h2>span
player      h2>b
note        .notes
victorious  win-icon
```

Example usage

```html
<v-timeline>
    <template>
        <article>
            <h2><span></span><b></b></h2>
            <time></time>
            <ul class="players">
                <li>
                    player
                    <win-icon></win-icon><!-- only when player is victorious -->
                </li>
            </ul>
            <div class="notes"></div>
            <div class="actions">
                <button>Delete</button>
                <button>Edit</button>
            </div>
        </article>
    </template>
</v-timeline>
```

```js
/**
 * Victory object schema for Firebase operations
 * @typedef {Object} Victory
 * @property {string} [id] Firebase-generated id for updates (undefined for new records)
 * @property {string} date Date of victory
 * @property {string} game Game of victory
 * @property {string} [note] Optional note about victory
 * @property {string|string[]} player Victorious player(s) - Array or String
 * @property {boolean} [victorious] Was the game victorious (for group games)
 */

/** @type Victory[] */
const data = [];

const timelineEl = document.querySelector('v-timeline');
timelineEl.load(data);
```
