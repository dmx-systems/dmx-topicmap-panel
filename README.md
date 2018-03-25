# DeepaMehta 5 Topicmap Panel

## Version History

**0.11** -- Mar 25, 2018

* Auto-positioning new topic when no position is given
* Fix: pinning types
* Improved composability:
    * New `quill-config` property allows parent component to customize the Quill editor in both ways, setting options, and providing extensions (e.g. formats)
    * Emit `child-topic-reveal` event to signalize "user clicked 'Reveal' button in an in-map detail"

**0.10** -- Mar 10, 2018

* Feature: "Pinning". If pinned topic/assoc details remain visible when topic/assoc is not selected.
    * Pinning states are persistent per-topicmap
* Improved composability:
    * New prop `context-commands` allows parent component to provide the context menu commands
    * Component emits `object-submit` event to signalize "inline edit has completed"
* Detail buttons appear only on mouse hover

**0.9** -- Feb 21, 2018

* In-map *assoc* details
* Improved composability:
    * Component relies on explicit props (instead of context injection): `object`, `writable`, `objectRenderers`, `toolbarCompDefs`. Props have reasonable defaults
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

------------
Jörg Richter  
Mar 25, 2018
