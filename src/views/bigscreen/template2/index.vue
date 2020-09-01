<template>
  <div class="app-container">
    <grid-layout
      :layout.sync="vueGridItems"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in vueGridItems"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <i
          class="el-icon-close remove"
          @click="removeItem(item.i)"
        />
        <div>{{ item.i }}</div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VueGridLayout from 'vue-grid-layout'

interface VueGridItem {
  x: number,
  y: number,
  w: number,
  h: number,
  i: string,
  data: any
}

@Component({
  name: 'BigScreenTemplate2',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }
})
export default class extends Vue {
  private vueGridItems: VueGridItem[] = [
    { 'x': 0, 'y': 0, 'w': 2, 'h': 2, 'i': '0', data: null },
    { 'x': 2, 'y': 0, 'w': 2, 'h': 4, 'i': '1', data: null },
    { 'x': 4, 'y': 0, 'w': 2, 'h': 5, 'i': '2', data: null },
    { 'x': 6, 'y': 0, 'w': 2, 'h': 3, 'i': '3', data: null },
    { 'x': 8, 'y': 0, 'w': 2, 'h': 3, 'i': '4', data: null },
    { 'x': 10, 'y': 0, 'w': 2, 'h': 3, 'i': '5', data: null },
    { 'x': 0, 'y': 5, 'w': 2, 'h': 5, 'i': '6', data: null },
    { 'x': 2, 'y': 5, 'w': 2, 'h': 5, 'i': '7', data: null },
    { 'x': 4, 'y': 5, 'w': 2, 'h': 5, 'i': '8', data: null },
    { 'x': 6, 'y': 3, 'w': 2, 'h': 4, 'i': '9', data: null },
    { 'x': 8, 'y': 4, 'w': 2, 'h': 4, 'i': '10', data: null },
    { 'x': 10, 'y': 4, 'w': 2, 'h': 4, 'i': '11', data: null },
    { 'x': 0, 'y': 10, 'w': 2, 'h': 5, 'i': '12', data: null },
    { 'x': 2, 'y': 10, 'w': 2, 'h': 5, 'i': '13', data: null },
    { 'x': 4, 'y': 8, 'w': 2, 'h': 4, 'i': '14', data: null },
    { 'x': 6, 'y': 8, 'w': 2, 'h': 4, 'i': '15', data: null },
    { 'x': 8, 'y': 10, 'w': 2, 'h': 5, 'i': '16', data: null },
    { 'x': 10, 'y': 4, 'w': 2, 'h': 2, 'i': '17', data: null },
    { 'x': 0, 'y': 9, 'w': 2, 'h': 3, 'i': '18', data: null },
    { 'x': 2, 'y': 6, 'w': 2, 'h': 2, 'i': '19', data: null }
  ];

  private removeItem(i: string) {
    this.vueGridItems.splice(this.vueGridItems.findIndex(item => item.i === i), 1)
  }
}
</script>

<style scoped lang="scss">
  .vue-grid-layout {
    background: #eee;
  }

  .vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 1px solid black;
  }

  .vue-grid-item {
    transition: background-color .2s linear, box-shadow .2s linear;

    &:hover {
      background-color: #67C23A;
      border: 1px solid black;
      -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
      -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
      box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    }
    .resizing {
      opacity: 0.9;
    }

    .remove {
      opacity: 0.9;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      text-align: center;
    }

    .static {
      background: #cce;
    }

    .text {
      font-size: 24px;
      text-align: center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      height: 100%;
      width: 100%;
    }

    .no-drag {
      height: 100%;
      width: 100%;
    }

    .minMax {
      font-size: 12px;
    }

    .add {
      cursor: pointer;
    }
  }

  .vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
  }
</style>
