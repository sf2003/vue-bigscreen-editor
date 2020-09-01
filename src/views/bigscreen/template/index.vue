<template>
  <div class="app-container">
    <v-contextmenu
      ref="contextmenu"
      @contextmenu="handleContextmenu"
    >
      <v-contextmenu-item @click="deleteVdrItem">
        <i class="el-icon-delete" />删除
      </v-contextmenu-item>
    </v-contextmenu>

    <el-row :gutter="8">
      <el-col :span="2">
        <div
          class="infinite-list"
          style="overflow:auto"
        >
          <div
            v-for="i in 100"
            :key="`${i}_item`"
            class="infinite-list-item"
          >
            <div class="infinite-list-item-label">
              {{ i }}
            </div>
            <div
              v-waves
              class="infinite-list-item-action"
              @click="addItem"
            >
              <i class="el-icon-plus" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div
          class="root"
        >
          <div
            class="body-div"
            :style="{
              'transform': `scale(${zoom})`,
              'transform-origin': '0 0',
              'height': `${height}px`,
              'width': `${width}px`
            }"
          >
            <vdr
              v-for="item in vdrItemList"
              :key="item.id"
              v-contextmenu:contextmenu
              class-name-handle="my-handle-class"
              class-name-active="my-active-class"
              class-name="my-class"
              :w="item.width"
              :h="item.height"
              :grid="[10, 10]"
              :x="item.x"
              :y="item.y"
              :parent="true"
              :active="item.active"
              @dragging="onDrag"
              @resizing="onResize"
              @activated="onActivated(item)"
              @deactivated="onDeactivated"
            >
              <p>
                X: {{ item.x }}
                <br>
                Y: {{ item.y }}
                <br>
                Width: {{ item.width }}
                <br>
                Height: {{ item.height }}
              </p>
            </vdr>
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="toolbar">
          <label>缩放</label>
          <el-button-group>
            <el-button
              icon="el-icon-zoom-in"
              size="small"
              @click="zoomIn"
            />
            <el-button
              icon="el-icon-zoom-out"
              size="small"
              @click="zoomOut"
            />
            <el-button
              icon="el-icon-refresh-left"
              size="small"
              @click="zoomReset"
            />
          </el-button-group>

          <label id="widthLabel">宽度</label>
          <el-input-number
            v-model="width"
            label="widthLabel"
            controls-position="right"
            size="small"
            :min="1024"
            @change="widthHandleChange"
          />

          <label id="heightLabel">高度</label>
          <el-input-number
            v-model="height"
            label="heightLabel"
            controls-position="right"
            size="small"
            :min="768"
            @change="heightHandleChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import vdr from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import { uid } from '@/utils'
import { VNode } from 'vue'

interface VdrItem {
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  active: boolean
}

@Component({
  name: 'BigScreenTemplate',
  components: {
    vdr
  }
})
export default class extends Vue {
  private vdrItemList: VdrItem[] = [];
  private activeVdrItem: VdrItem | null = null;
  private zoom: number = 1;
  private width: number = 1920;
  private height: number = 1080;
  private deleteTarget: string | number | undefined = undefined;

  mounted() {
    for (let i = 0; i < 5; i++) {
      this.vdrItemList.push({
        id: uid(),
        x: i * 100 + 10,
        y: i * 100 + 10,
        width: 100,
        height: 100,
        active: false
      })
    }
  }

  private onResize(x: number, y: number, width: number, height: number) {
    if (this.activeVdrItem != null) {
      this.activeVdrItem.x = x
      this.activeVdrItem.y = y
      this.activeVdrItem.width = width
      this.activeVdrItem.height = height
      this.activeVdrItem.active = true
    }
  }

  private onDrag(x: number, y: number) {
    if (this.activeVdrItem != null) {
      this.activeVdrItem.x = x
      this.activeVdrItem.y = y
    }
  }

  private onActivated(vdrItem: VdrItem) {
    this.activeVdrItem = vdrItem
  }

  private onDeactivated() {
    if (this.activeVdrItem != null) {
      this.activeVdrItem.active = false
      this.activeVdrItem = null
    }
  }

  private zoomIn() {
    console.log(this.zoom)
    this.zoom += 0.1
  }

  private zoomOut() {
    this.zoom -= 0.1
  }

  private zoomReset() {
    this.zoom = 1
  }

  private widthHandleChange(value: number) {
    this.width = value
  }

  private heightHandleChange(value: number) {
    this.height = value
  }

  private addItem() {
    const newItem = {
      id: uid(),
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      active: true
    }

    this.vdrItemList.push(newItem)

    this.activeVdrItem = newItem
  }

  private deleteVdrItem(vm: any, event: any) {
    if (this.deleteTarget !== undefined) {
      const index = this.vdrItemList.findIndex((value) => value.id === this.deleteTarget)
      this.vdrItemList.splice(index, 1)
      this.deleteTarget = undefined
    }
  }

  private handleContextmenu(vnode: VNode) {
    if (vnode.data) {
      this.deleteTarget = vnode.data.key
    }
  }
}
</script>

<style lang="scss">
  $mainHeight: 765px;

  .root {
    width: 100%;
    height: $mainHeight;
    overflow: auto;
  }

  .body-div {
    background-position-y: 10px;
    position: relative;
    background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 10px 10px / 10px 10px, linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 10px 10px / 10px 10px;
    border: 1px solid red;
    transition: transform .2s linear;
  }

  .my-class {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #c4c4c4;
    border: 1px solid #46a6ff;
    transition: background-color .2s linear, box-shadow .2s linear;
  }

  .my-active-class {
    background-color: #67C23A;
    border: 1px solid black;
    -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  }

  .my-handle-class {
    position: absolute;
    background-color: #1890ff;
    border: 1px solid black;
    height: 14px;
    width: 14px;
    box-model: border-box;
    -webkit-transition: all .2s linear;
    -ms-transition: all .2s linear;
    transition: all .2s linear;
  }

  .my-handle-class-tl {
    top: -14px;
    left: -14px;
    cursor: nw-resize;
  }

  .my-handle-class-tm {
    top: -14px;
    left: 50%;
    margin-left: -7px;
    cursor: n-resize;
  }

  .my-handle-class-tr {
    top: -14px;
    right: -14px;
    cursor: ne-resize;
  }

  .my-handle-class-ml {
    top: 50%;
    margin-top: -7px;
    left: -14px;
    cursor: w-resize;
  }

  .my-handle-class-mr {
    top: 50%;
    margin-top: -7px;
    right: -14px;
    cursor: e-resize;
  }

  .my-handle-class-bl {
    bottom: -14px;
    left: -14px;
    cursor: sw-resize;
  }

  .my-handle-class-bm {
    bottom: -14px;
    left: 50%;
    margin-left: -7px;
    cursor: s-resize;
  }

  .my-handle-class-br {
    bottom: -14px;
    right: -14px;
    cursor: se-resize;
  }

  .my-handle-class-tl:hover,
  .my-handle-class-tm:hover,
  .my-handle-class-tr:hover,
  .my-handle-class-ml:hover,
  .my-handle-class-mr:hover,
  .my-handle-class-bl:hover,
  .my-handle-class-bm:hover,
  .my-handle-class-br:hover {
    background-color: red;
    transform: scale(1.4);
  }

  .toolbar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .infinite-list {
    height: $mainHeight;
    list-style: none;
    padding: 0;
    margin: 0;

    .infinite-list-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      background: #e8f3fe;
      margin: 10px;
      color: #7dbcfc;
      transition: all .2s linear;

      &:hover {
        background-color: #67C23A;
        color: #fff;
        box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
      }

      .infinite-list-item-label {
        flex-grow: 1;
        text-align: center;
      }

      .infinite-list-item-split {
        background-color: #dcdfe6;
        display: inline-block;
        width: 1px;
        height: 40px;
        vertical-align: middle;
        position: relative;
      }

      .infinite-list-item-action {
        height: 100%;
        padding: 0 5px 0 5px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        transition: all .2s linear;

        &:hover {
          background-color: #48a21c;
          color: #fff;
          box-shadow: 0 0 5px 2px rgba(72, 162, 28, 0.75);
        }
      }
    }
  }

</style>
