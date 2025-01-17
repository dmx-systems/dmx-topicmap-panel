<template>
  <div class="dmx-topicmap-panel" v-loading="loading">
    <dmx-toolbar :comp-defs="toolbarCompDefs_"></dmx-toolbar>
    <component :is="topicmapRenderer" :topicmap="topicmap_" :object="object_" :writable="writable_"
      :detail-renderers="detailRenderers" :context-commands="contextCommands" :drop-handler="dropHandler"
      :quill-config="quillConfig">
    </component>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  created () {
    // console.log('# dmx-topicmap-panel created', this.props, this.$store)
    this.$store.registerModule('topicmapPanel', require('../topicmap-panel').default)
    this.$store.dispatch('_initTopicmapPanel', this)
  },

  mounted () {
    // console.log('dmx-topicmap-panel mounted')
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/detail-renderers').default
  ],

  props: {
    topicmap:        Object,
    toolbarCompDefs: Object,
    topicmapTypes:   Object,
    contextCommands: Object,
    dropHandler:     Array,
    quillConfig:     Object
  },

  data () {
    return {
      topicmapRenderer: undefined,          // current topicmap renderer component, updated in switchTopicmapRenderer()
      // mirror props (mirroring the *dynamic* props is sufficient)
      // Note: making `toolbarCompDefs` dynamic allows components to be added *after* dmx-topicmap-panel instantiation.
      topicmap_:        this.topicmap,
      object_:          this.object,
      writable_:        this.writable,
      toolbarCompDefs_: this.toolbarCompDefs
    }
  },

  computed: mapState({
    loading: state => state.topicmapPanel.loading
  }),

  components: {
    'dmx-toolbar': require('./dmx-toolbar').default
  }
}
</script>
