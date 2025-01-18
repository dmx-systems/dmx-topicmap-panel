<template>
  <div class="dmx-topicmap-panel" v-loading="loading">
    <dmx-toolbar :comp-defs="toolbarCompDefs"></dmx-toolbar>
    <component :is="topicmapRenderer" :topicmap :object :writable :detail-renderers :context-commands :drop-handler
      :quill-config>
    </component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('# dmx-topicmap-panel created', this.props, this.$store)
    this.$store.registerModule('topicmapPanel', require('../topicmap-panel').default)
    this.$store.dispatch('_initTopicmapPanel', this)
  },

  mounted () {
    // console.log('dmx-topicmap-panel mounted')
  },

  props: {
    object:           dmx.DMXObject,        // The selected topic/assoc. Undefined if nothing is selected.
    writable: {                             // True if the current user has WRITE permission for the object.
      type: Boolean,
      required: false
    },
    detailRenderers:  {
      type: Object,
      default () {
        return {}
      }
    },
    topicmap:         Object,
    topicmapTypes:    Object,
    toolbarCompDefs:  Object,
    contextCommands:  Object,
    dropHandler:      Array,
    quillConfig:      Object
  },

  data () {
    return {
      topicmapRenderer: undefined       // current topicmap renderer component, updated in switchTopicmapRenderer()
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
