# DMX 5 Topicmap Panel

## Version History

**3.0** -- May 28, 2023

* BREAKING CHANGES
    * Add component attribute `topicmap`
* Improvements:
    * For maptype implementers: Topicmap Panel protocol is extended by `updateTopic()`, `updateAssoc()`

**2.2** -- Aug 27, 2021

* Improvements:
    * Add component attribute `drop-handler` (Array)

**2.1** -- Jun 15, 2021

* Improvements:
    * For maptype implementers: new action `fetchTopicmapAppendix` allows execution of (possibly async)
      code *after* a topicmap was fetched but *before* it is rendered.
* Fix:
    * Don't wrap toolbar items

**2.0** -- Dec 30, 2020

* BREAKING CHANGES
    * Make use of `dmx-api` 2.0
    * Various `dm5` -> `dmx` renamings
* Improvements:
    * Toolbar CSS: align items at baseline
* Chore:
    * Adapt URLs to `github.com/dmx-systems`
    * Code run through `eslint`

**1.0.1** -- Aug 5, 2020

* Fix imports

**1.0** -- Aug 5, 2020

* Chore:
    * Rename this package `dm5-topicmap-panel` -> `dmx-topicmap-panel`

**0.26** -- Mar 30, 2020

* Improvements:
    * Inject Webclient dependencies into maptype store module
    * Apply white background to all toolbar elements

**0.25** -- Nov 21, 2019

* Improved composability: component does not access app state (`selections`)

**0.24** -- Aug 16, 2019

* Fixes:
    * Deleting a topic/assoc removes it from all loaded topicmaps

**0.23** -- Jul 22, 2019

* Improvements:
    * Make no assumption about the topicmap data format
    * Correct "competing store modules" error message
* Chore:
    * Adapt to `dm5` library ("children" renaming)
    * Change license to `AGPL-3.0`

**0.22** -- Apr 22, 2019

* Fix: support for adding toolbar components after instantiation

**0.21** -- Mar 2, 2019

* Internal refactoring: switch topicmap renderers via dynamic component
* Adapt to Topicmaps REST API change
* Minor style changes

**0.20** -- Jan 29, 2019

* API: promise returned by `showTopicmap` action resolves with topicmap
* Change license to `GPL-3.0-or-later`

**0.19** -- Jan 5, 2019

* Chore: adapt to `dm5` library (class `DMXObject`)

**0.18** -- Dec 21, 2018

* Chore: adapt to `dm5` library (drop getChildTopic())

**0.17** -- Oct 21, 2018

* Rename component prop `object-renderers` to `detail-renderers`. It contains both, `object` renderers and `value` renderers.

**0.16** -- Oct 6, 2018

* Component supports manual mounting in conjunction with manual data update ("props" are mirrored as "data")

**0.15** -- Jul 31, 2018

* Component property `selection` is removed.
  Instead the `showTopicmap` action expects a `selection` parameter.
* Change type URI prefixes `dm4` -> `dmx`
* Add GitLab CI/CD

**0.14** -- Jun 20, 2018

* Feature: multi-selection

**0.13** -- Apr 10, 2018

* Feature: show spinner when topicmap/renderer loads
* Fixes:
    * Sync `writable` flag with topicmap renderer
    * Catch "resize" request when no renderer is mounted

**0.12** -- Apr 7, 2018

* Feature: custom topicmap renderers. The host application can provide custom topicmap models (e.g. geomap) and accompanying renderers (e.g. Leaflet based).
    * New component property `topicmapTypes` to inject custom topicmap models and renderers.
    * Dynamic topicmap renderer switching: when the user switches between topicmaps the needed renderer is mounted dynamically.
    * Lazy loading: e.g. the Leaflet package is loaded only in the moment the first geomap is shown.
* The default topicmap renderer is available as standalone component:
  https://github.com/jri/dm5-cytoscape-renderer

**0.11** -- Mar 25, 2018

* Auto-positioning new topic when no position is given
* Fix: pinning types
* Improved composability:
    * New component property `quillConfig` allows the host application to customize the Quill editor in both ways, setting options, and providing extensions (e.g. formats)
    * Emit `child-topic-reveal` event to signalize "user clicked 'Reveal' button in an in-map detail"

**0.10** -- Mar 10, 2018

* Feature: "Pinning". If pinned topic/assoc details remain visible when topic/assoc is not selected.
    * Pinning states are persistent per-topicmap
* Improved composability:
    * New component property `contextCommands` allows the host application to provide the context menu commands
    * Component emits `object-submit` event to signalize "inline edit has completed"
* Detail buttons appear only on mouse hover

**0.9** -- Feb 21, 2018

* In-map *assoc* details
* Improved composability:
    * For configuration the component relies on explicit properties (instead of context injection): `object`, `writable`, `objectRenderers`, `toolbarCompDefs`. Properties have reasonable defaults.
    * Component emits events (instead of dispatching into host app): `topic-select`, `topic-double-click`, `topic-drag`, `topic-drop-on-topic`, `assoc-select`, `topicmap-click`, `topicmap-contextmenu`
    * Toolbar provides separate `left` and `right` mount points
    * Canvas resize can be triggered from outside
* Fixes:
    * Click events on toolbar background bubble to canvas
    * In-map details do not line wrap at canvas edge

**0.8** -- Feb 3, 2018

* In-map topic details with inline edit capability
* "Semantic Fisheye" layout with animations
* Composability: inject context instead of accessing host app's store

**0.7** -- Jan 13, 2018

* Topic colors customizable via CSS vars

**0.6** -- Oct 19, 2017

* Colored associations
* Detect topic double click

**0.5** -- Oct 3, 2017

* Synchronize initialization
* Visualize topic/assoc selection states

**0.4** -- Jul 17, 2017

**0.3** -- Jun 30, 2017

**0.2** -- Jun 14, 2017

**0.1** -- Apr 28, 2017
