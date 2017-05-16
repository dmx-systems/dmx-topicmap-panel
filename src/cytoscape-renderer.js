import cytoscape from 'cytoscape'
import dm5 from 'dm5'

// Note: the topicmap is not vuex state. (This store module provides no state at all, only actions.)
// In conjunction with Cytoscape the topicmap is not considered reactive data.
// We have to bind topicmap data to the Cytoscape graph model manually anyways.
// (This is because Cytoscape deploys a canvas, not a DOM).

var topicmap            // topicmap to render (a Topicmap object)

var cy = initialize()   // the Cytoscape instance
var events = false      // tracks Cytoscape event listener registration, which is lazy

const actions = {

  renderTopicmap ({dispatch}, _topicmap) {
    topicmap = _topicmap
    eventListeners(dispatch)
    refresh()
  },

  addTopicAndSelect (_, id) {
    console.log('addTopicAndSelect', id)
    const node = cy.add(cyNode(topicmap.getTopic(id)))
    node.select()
  },

  // WebSocket messages

  _addTopicToTopicmap (_, {topicmapId, topic}) {
    if (topicmapId === topicmap.id) {
      cy.add(cyNode(new dm5.TopicmapTopic(topic)))  // TODO: instantiation should be done by the websocket dispatcher
    }
  },

  _setTopicPosition (_, {topicmapId, topicId, pos}) {
    if (topicmapId === topicmap.id) {
      cy.getElementById(topicId).position(pos)
    }
  }
}

export default {
  actions
}

// Cytoscape

function initialize() {
  return cytoscape({
    container: document.getElementById('cytoscape-renderer'),
    style: [
      {
        selector: 'node',
        style: {
          'shape': 'rectangle',
          'background-color': 'hsl(210, 100%, 90%)',
          'padding': '3px',
          'width': 'label',
          'height': 'label',
          'label': 'data(label)',
          'text-valign': 'center'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': 'rgb(178, 178, 178)',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': 13,
          'text-margin-y': '-10',
          'text-rotation': 'autorotate'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 2,
          'border-color': 'red'
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': 'red'
        }
      }
    ],
    layout: {
      name: 'preset'
    },
    wheelSensitivity: 0.2
  })
}

// lazy registration of Cytoscape event listeners
function eventListeners(dispatch) {
  if (!events) {
    cy.on('select', 'node', e => {
      dispatch('onTopicSelect', e.target.id())
    })
    cy.on('select', 'edge', e => {
      dispatch('onAssocSelect', e.target.id())
    })
    cy.on('tapstart', 'node', e => {
      var node = e.target
      var drag = false
      node.one('tapdrag', e => {
        drag = true
      })
      cy.one('tapend', e => {
        if (drag) {
          dispatch('onTopicDragged', {
            id: node.id(),
            pos: node.position()
          })
        }
      })
    })
    cy.on('tap', e => {
      if (e.target === cy) {
        dispatch('onBackgroundTap', {
          model:  e.position,
          render: e.renderedPosition
        })
      }
    })
    events = true
  }
}

function refresh () {
  console.log('refresh')
  var elems = []
  topicmap.forEachTopic(topic => {
    elems.push(cyNode(topic))
  })
  topicmap.forEachAssoc(assoc => {
    elems.push(cyEdge(assoc))
  })
  cy.add(elems)
}

/**
 * @param   topic   A TopicmapTopic
 */
function cyNode (topic) {
  return {
    data: {
      id:    topic.id,
      label: topic.value
    },
    position: topic.getPosition()
  }
}

function cyEdge (assoc) {
  return {
    data: {
      id:     assoc.id,
      label:  assoc.value,
      source: assoc.role1.topic_id,
      target: assoc.role2.topic_id
    }
  }
}