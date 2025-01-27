<template>
  <div class="dmx-toolbar">
    <div class="left">
      <component v-for="compDef in compDefs.left" :is="compDef.comp" :key="compDef.id"></component>
    </div>
    <div class="right">
      <component v-for="compDef in compDefs.right" :is="compDef.comp" :key="compDef.id"></component>
    </div>
  </div>
</template>

<script>
export default {

  created () {
    // console.log('dmx-toolbar created', this.compDefs)
  },

  props: {
    compDefs: Object
  }
}
</script>

<style>
.dmx-toolbar {
  display: flex;              /* arrange children as a row */
  position: absolute;         /* share space with Cytoscape canvas */
  z-index: 1001;              /* render on top of Leaflet container */
  box-sizing: border-box;
  width: 100%;
  padding: 4px 6px 0 4px;
  pointer-events: none;       /* make toolbar click-through */
}

.dmx-toolbar > div,
.dmx-toolbar > div > div {
  display: flex;
}

.dmx-toolbar > div.right {
  flex: auto;
  justify-content: flex-end;
}

.dmx-toolbar > div > * {
  pointer-events: initial;    /* children still act on clicks */
  background-color: white;    /* toolbar elements are opaque */
}
</style>
