/* global Vue, FileReader */
Vue.component('error', {
  data: function () {
    return {
      showStack: false
    }
  },
  props: ['error'],
  filters: {
    linkify: function (str) {
      return str.linkify({
        format: {
          url: function (value) {
            return value.replace('http://localhost:3333', '')
          }
        }
      })
    }
  },
  template: `<div class="item" :class="error.type">
    <span class="type">
      <span v-show="error.type === 'log' || error.type === 'info' || error.type === 'debug'">
        <i class="fas fa-info-circle blue"></i>
      </span>
      <span v-show="error.type === 'warn'">
        <i class="fas fa-exclamation-triangle yellow"></i>
      </span>
      <span v-show="error.type === 'error'">
        <i class="fas fa-times" data-fa-transform="shrink-3.5" data-fa-mask="fas fa-circle"></i>
      </span>
      {{ error.type }}
    </span>
    <span class="date">{{ error.timestamp }}</span>

    <div class="arguments">
      <span v-for="argument in error.arguments">{{ argument }}</span>
    </div>

    <div class="stack" v-show="showStack">
      <span v-for="stack in error.stack" :inner-html.prop="stack | linkify"></span>
    </div>

    <button @click="showStack = !showStack">{{ (showStack ? 'Hide' : 'Show') }} Stack</button>
  </div>`
})

var app = new Vue({
  el: '#app',
  data: {
    data: [],
    loaded: false,
    filename: '',
    types: {
      log: true,
      info: true,
      debug: true,
      warn: true,
      error: true
    }
  },
  computed: {
    filtered: function () {
      let self = this
      return this.data.filter(function (obj) {
        return self.types[obj.type]
      })
    }
  },
  methods: {
    parseFile: function (event) {
      console.log(event)
      app.filename = event.target.value.split('\\').pop().split('/').pop()
      let files = event.target.files
      let file = files[0]
      let reader = new FileReader()
      reader.onload = function () {
        var data = JSON.parse(this.result)
        Object.assign(app.data, data)
        app.loaded = true
      }
      reader.readAsText(file)
    },
    reset: function () {
      this.data = []
      this.loaded = false
      this.filename = ''
      this.types = {
        log: true,
        info: true,
        debug: true,
        warn: true,
        error: true
      }
    }
  }
})
