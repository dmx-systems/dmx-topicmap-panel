import Vue from 'vue'

let topicmapPanel         // Component instance
let topicmapTypes         // Registered topicmap types
let topicmapCache = {}    // Loaded topicmaps, keyed by ID:
                          //   {
                          //     topicmapId: Topicmap         # a dm5.Topicmap
                          //   }

let topicmapTopic         // Topicmap topic of the displayed topicmap

let store

const state = {
  loading: true
}

const actions = {

  /**
   * @returns   a promise resolved once topicmap rendering is complete.
   */
  showTopicmap ({dispatch}, {topicmapTopic, writable, selection}) {
    // console.log('showTopicmap', topicmapTopic.id)
    state.loading = true
    return switchTopicmapRenderer(topicmapTopic)
      .then(() => getTopicmap(topicmapTopic.id, dispatch))
      .then(topicmap => dispatch('renderTopicmap', {topicmap, writable, selection}))
      .then(topicmap => {
        state.loading = false
        return topicmap
      })
      .catch(error => {
        // TODO: handle error at higher level?
        console.error(`Rendering topicmap ${topicmapTopic.id} failed`, error)
      })
  },

  clearTopicmapCache () {
    topicmapCache = {}
  },

  resizeTopicmapRenderer () {
    // empty dummy action to catch a "resize" request when no renderer is mounted yet
  },

  // Module internal (dispatched from dm5-topicmap-panel component)

  _initTopicmapPanel (_, _topicmapPanel) {
    topicmapPanel = _topicmapPanel
    topicmapTypes = _topicmapPanel.topicmapTypes
    store         = _topicmapPanel.$store
    // Note: we need the real store object here.
    // The store-like context object ("_") does not have the un/registerModule() functions.
  }
}

export default {
  state,
  actions
}

// Topicmap Renderer Switching

/**
 * Switches to the topicmap renderer needed for the given topicmap.
 * If no renderer switch is needed nothing is performed and the returned promise is resolved immediately.
 *
 * @return  A promise resolved once the topicmap renderer is ready.
 */
function switchTopicmapRenderer (_topicmapTopic) {
  return new Promise(resolve => {
    const oldTypeUri = topicmapTopic && getTopicmapTypeUri(topicmapTopic)
    const newTypeUri = getTopicmapTypeUri(_topicmapTopic)
    if (oldTypeUri !== newTypeUri) {
      // console.log(`switching renderer from '${oldTypeUri}' to '${newTypeUri}'`)
      const topicmapType = getTopicmapType(newTypeUri)
      getRenderer(topicmapType).then(renderer => {
        // 1) switch store module
        oldTypeUri && store.unregisterModule(oldTypeUri)
        store.registerModule(newTypeUri, renderer.storeModule)
        // 2) mount renderer
        topicmapPanel.topicmapRenderer = renderer.comp
        //
        resolve()
      })
    } else {
      resolve()
    }
    topicmapTopic = _topicmapTopic
  })
}

function getTopicmapTypeUri (topicmapTopic) {
  const child = topicmapTopic.childs['dmx.topicmaps.topicmap_type_uri']
  if (!child) {
    throw Error(`topicmap topic ${topicmapTopic.id} has no dmx.topicmaps.topicmap_type_uri child topic`)
  }
  return child.value
}

function getTopicmapType (topicmapTypeUri) {
  if (!topicmapTypes) {
    throw Error(`no topicmap types passed to dm5-topicmap-panel`)
  }
  const topicmapType = topicmapTypes[topicmapTypeUri]
  if (!topicmapType) {
    throw Error(`topicmap type '${topicmapTypeUri}' is not known to dm5-topicmap-panel`)
  }
  return topicmapType
}

function getRenderer (topicmapType) {
  return new Promise(resolve => {
    const rendererFunc = topicmapType.renderer
    if (typeof rendererFunc !== 'function') {
      throw Error(`topicmap renderer is expected to be a function, got ${typeof rendererFunc}
        (topicmap type '${topicmapType.uri}')`)
    }
    const p = rendererFunc()
    if (!(p instanceof Promise)) {
      throw Error(`topicmap renderer function is expected to return a Promise, got ${p.constructor.name} (${p})
        (topicmap type '${topicmapType.uri}')`)
    }
    p.then(module => {
      const renderer = module.default
      if (!renderer.storeModule) {
        throw Error(`no store module set for topicmap type '${topicmapType.uri}'`)
      }
      if (!renderer.comp) {
        throw Error(`no renderer component set for topicmap type '${topicmapType.uri}'`)
      }
      resolve(renderer)
    })
    // TODO: support actual component too (besides factory function)
  })
}

// Topicmap Loading

// TODO: store promises in topicmap cache
function getTopicmap (id, dispatch) {
  var p   // a promise for a dm5.Topicmap
  const topicmap = topicmapCache[id]
  if (topicmap) {
    p = Promise.resolve(topicmap)
  } else {
    // console.log('Fetching topicmap', id)
    p = dispatch('fetchTopicmap', id).then(topicmap => {
      if (Array.isArray(topicmap)) {
        throw Error(`${topicmap.length} renderers competed for fetching topicmap ${id}`)
      }
      topicmapCache[topicmap.id] = topicmap
      return topicmap
    })
  }
  return p
}
