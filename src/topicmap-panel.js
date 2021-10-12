// Responsibilities:
//   - fetching topicmaps
//   - caching topicmaps
//   - switching topicmap type renderers
//   - triggering topicmap rendering

import dmx from 'dmx-api'
import axios from 'axios'
import Vue from 'vue'

let topicmapPanel         // Component instance
let topicmapTypes         // Registered topicmap types
let topicmapCache = {}    // Loaded topicmaps, keyed by ID:
                          //   {
                          //     topicmapId: topicmap         # e.g. a dmx.Topicmap, Geomap, ...
                          //   }
                          // Note: to the Topicmap Panel the structure of a topicmap object is completely opaque.
                          // Only the corresponding topicmap renderer interprets it.

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

  // WebSocket messages

  _processDirectives (_, directives) {
    directives.forEach(dir => {
      switch (dir.type) {
      case 'UPDATE_TOPIC':
        updateTopic(new dmx.Topic(dir.arg))
        break
      case 'UPDATE_ASSOC':
        updateAssoc(new dmx.Assoc(dir.arg))
        break
      case 'DELETE_TOPIC':
        deleteTopic(dir.arg.id)
        break
      case 'DELETE_ASSOC':
        deleteAssoc(dir.arg.id)
        break
      }
    })
  },

  // Module internal (dispatched from dmx-topicmap-panel component)

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
        const storeModule = renderer.storeModule
        const _storeModule = typeof storeModule === 'function' ? storeModule({store, dmx, axios, Vue}) : storeModule
        store.registerModule(newTypeUri, _storeModule)
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
  const child = topicmapTopic.children['dmx.topicmaps.topicmap_type_uri']
  if (!child) {
    throw Error(`topicmap topic ${topicmapTopic.id} has no dmx.topicmaps.topicmap_type_uri child topic`)
  }
  return child.value
}

function getTopicmapType (topicmapTypeUri) {
  if (!topicmapTypes) {
    throw Error('no topicmap types passed to dmx-topicmap-panel')
  }
  const topicmapType = topicmapTypes[topicmapTypeUri]
  if (!topicmapType) {
    throw Error(`unknown topicmap type '${topicmapTypeUri}'`)
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
  let p   // a promise for a dmx.Topicmap
  const topicmap = topicmapCache[id]
  if (topicmap) {
    p = Promise.resolve(topicmap)
  } else {
    // console.log('Fetching topicmap', id)
    p = dispatch('fetchTopicmap', id).then(topicmap => {
      if (Array.isArray(topicmap)) {
        throw Error(`${topicmap.length} store modules competed for fetching topicmap ${id}`)
      }
      topicmapCache[id] = topicmap
      return topicmap
    }).then(topicmap => {
      return dispatch('fetchTopicmapAppendix', topicmap)
    }).then(() => {
      return topicmapCache[id]
    })
  }
  return p
}

// Process directives

function updateTopic (topic) {
  // update state
  Object.keys(topicmapCache).forEach(topicmapId => {
    topicmapCache[topicmapId].updateTopic(topic)
  })
  // Note: the view is updated by the particular renderer
}

function updateAssoc (assoc) {
  // update state
  Object.keys(topicmapCache).forEach(topicmapId => {
    topicmapCache[topicmapId].updateAssoc(assoc)
  })
  // Note: the view is updated by the particular renderer
}

/**
 * Processes a DELETE_TOPIC directive.
 */
function deleteTopic (id) {
  // update state
  Object.keys(topicmapCache).forEach(topicmapId => {
    // Note: topicmap.removeAssocsWithPlayer() is not called. The assocs will be removed while processing
    // the DELETE_ASSOC directives as received along with the DELETE_TOPIC directive.
    topicmapCache[topicmapId].removeTopic(id)
  })
  // Note: the view is updated by the particular renderer
}

/**
 * Processes a DELETE_ASSOC directive.
 */
function deleteAssoc (id) {
  // update state
  Object.keys(topicmapCache).forEach(topicmapId => {
    // Note: topicmap.removeAssocsWithPlayer() is not called. The assocs will be removed while processing
    // the DELETE_ASSOC directives as received along with the DELETE_ASSOC directive.
    topicmapCache[topicmapId].removeAssoc(id)
  })
  // Note: the view is updated by the particular renderer
}
