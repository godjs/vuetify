// Styles
import '../../stylus/components/_windows.styl'

// Components
import { ItemGroupInstance } from '../VItemGroup/VItemGroup'

// Directives
import Touch from '../../directives/touch'

// Types
import { VNode, VNodeDirective } from 'vue/types/vnode'

/* @vue/component */
export const WindowInstance = ItemGroupInstance.extend({
  name: 'v-window',

  directives: { Touch },

  props: {
    mandatory: {
      type: Boolean,
      default: true
    },
    reverse: {
      type: Boolean,
      default: undefined
    },
    touchless: Boolean,
    value: {
      required: false
    },
    vertical: Boolean
  },

  data () {
    return {
      internalHeight: undefined as undefined | string,
      isActive: false,
      isBooted: false,
      isReverse: false
    }
  },

  computed: {
    computedTransition (): string {
      if (!this.isBooted) return ''

      const axis = this.vertical ? 'y' : 'x'
      const direction = this.internalReverse === !this.$vuetify.rtl
        ? '-reverse'
        : ''

      return `v-window-${axis}${direction}-transition`
    },
    internalIndex (): number {
      return this.items.findIndex((item, i) => {
        return this.internalValue === this.getValue(item, i)
      })
    },
    internalReverse (): boolean {
      if (this.reverse !== undefined) return this.reverse

      return this.isReverse
    }
  },

  watch: {
    internalIndex: 'updateReverse'
  },

  methods: {
    genContainer (): VNode {
      return this.$createElement('div', {
        staticClass: 'v-window__container',
        class: {
          'v-window__container--is-active': this.isActive
        },
        style: {
          height: this.internalHeight
        }
      }, this.$slots.default)
    },
    init () {
      ItemGroupInstance.options.methods.init.call(this)

      // Ensure no entry animation
      this.isBooted = true
    },
    next () {
      this.isReverse = false
      const nextIndex = (this.internalIndex + 1) % this.items.length
      const item = this.items[nextIndex]

      this.internalValue = this.getValue(item, nextIndex)
    },
    prev () {
      this.isReverse = true
      const lastIndex = (this.internalIndex + this.items.length - 1) % this.items.length
      const item = this.items[lastIndex]

      this.internalValue = this.getValue(item, lastIndex)
    },
    updateReverse (val: number, oldVal: number) {
      this.isReverse = val < oldVal
    }
  },

  render (h): VNode {
    const data = {
      staticClass: 'v-window',
      directives: [] as VNodeDirective[]
    }

    if (!this.touchless) {
      data.directives.push({
        name: 'touch',
        value: {
          left: this.next,
          right: this.prev
        }
      } as VNodeDirective)
    }

    return h('div', data, [this.genContainer()])
  }
})

export default WindowInstance.extend({
  provide (): object {
    return {
      windowGroup: this
    }
  }
})
