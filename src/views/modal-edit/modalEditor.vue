<template>
  <div class="app-container">
    <div id="outer">
      <div class="tableList-button">
        <el-button @click="addTable">Add Table</el-button>
        <el-button @click="doSave">Save</el-button>
      </div>
      <div id="playground">
        <template v-for="table in tables">
          <EleTable :plumb-instance="plumbInstance" :node="table" playground-id="playground" @deleteNode="deleteNode"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import jsPlumb from 'jsplumb'
import * as lodash from 'lodash'
import $ from 'jquery'
import EleTable from "@/components/VisuallyElement/EleTable";
import {VisuallyTable} from "@/components/VisuallyElement/VisuallyTable";
import tools from "@/components/VisuallyElement/tools";
import 'jquery-ui/ui/widgets/draggable'
import "jquery-contextmenu"
import "jquery-contextmenu/dist/jquery.contextMenu.min.css"

export default {
  name: "modalEditor",
  components: {EleTable},
  data() {
    return {
      plumbInstance: null,
      tables: [],
      connections: []
    }
  },

  created() {
    const _this = this
    this.plumbInstance = jsPlumb.jsPlumb.getInstance()
    this.plumbInstance.importDefaults(tools.defaultOption)
    this.plumbInstance.ready(() => {
      _this.plumbInstance.bind("connection", _this.connected);
      _this.plumbInstance.bind("connectionDetached", _this.connectionDetached);
      _this.plumbInstance.bind("connectionMoved", _this.connectionMoved);
      _this.plumbInstance.bind("beforeDrop", _this.beforeDrop);
    })
  },

  mounted() {
    const _this = this
    const {tables, connections} = JSON.parse('{"tables":[{"id":"4006d172-6b80-44ca-98b8-92873bb5955c","name":"1","x":140,"y":256,"columns":[{"id":"30fe83df-f8bb-4d14-996c-e0709660b714","name":"column1","type":"varchar"},{"id":"d0690327-eaff-4bcf-adc7-7898c8a67282","name":"column2","type":"integer"},{"id":"6a33c260-2241-4b1f-b07a-2fbefa627e46","name":"column3","type":"varchar"}]},{"id":"df1a4733-2056-4405-b652-d741655130c7","name":"2","x":580,"y":139,"columns":[{"id":"19ef1138-3dc0-4705-896b-993e7d7c4369","name":"column1","type":"integer"},{"id":"0f570954-4b8b-48d1-b884-cde73e022a6a","name":"column2","type":"varchar"}]},{"id":"ff3dc1c8-f110-4ba4-b5a7-41bf3d927439","name":"3","x":577,"y":388,"columns":[{"id":"532d25fb-9b96-44fa-843a-854a76a82e8d","name":"column1","type":"varchar"},{"id":"b47f4266-7e4b-4b3c-a5da-9b7a2b27f422","name":"column2","type":"varchar"},{"id":"cba89a85-f3f9-4903-a3f5-e9e522e09063","name":"column3","type":"varchar"},{"id":"77b7a952-3e3b-4095-a8e2-98bc26675811","name":"column4","type":"varchar"}]},{"id":"f79fe39f-16bc-4ac5-93c6-1cd464770bdd","name":"4","x":903,"y":497,"columns":[{"id":"35b504b0-a347-4735-9920-6b47851f2ccc","name":"column1","type":"integer"},{"id":"290e84fc-512f-4913-ae71-2c904b44c7c3","name":"column2","type":"varchar"}]}],"connections":[{"id":"con_8","sourceId":"4006d172-6b80-44ca-98b8-92873bb5955c","targetId":"df1a4733-2056-4405-b652-d741655130c7","connectionOptions":{}},{"sourceId":"ff3dc1c8-f110-4ba4-b5a7-41bf3d927439","targetId":"f79fe39f-16bc-4ac5-93c6-1cd464770bdd","connectionOptions":{}},{"sourceId":"4006d172-6b80-44ca-98b8-92873bb5955c","targetId":"ff3dc1c8-f110-4ba4-b5a7-41bf3d927439","connectionOptions":{}}]}')
    tables.forEach(table => {
      this.tables.push(VisuallyTable.fromJSON(table))
    })

    this.connections = connections
    this.plumbInstance.setContainer('playground')
    this.$nextTick(() => {
      _this.draw()
    })
  },

  methods: {
    addTable() {
      this.$prompt('请输入实体名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.tableNameCheck
      }).then(({value}) => {
        this.tables.push(new VisuallyTable(value))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    tableNameCheck(tableName) {
      if (tableName !== null && lodash.trim(tableName) !== '') {
        return '请输入实体名称'
      } else if (this.tables.findIndex(table => table.name === tableName) > -1) {
        return '该实体已存在'
      } else {
        return true
      }
    },

    deleteNode(nodeId) {
      lodash.remove(this.tables, function (node) {
        return node.id === nodeId
      })
    },

    draw() {
      this.connections.forEach(edge => {
        this.plumbInstance.connect({
          source: $(`#${edge.sourceId} .connector`),
          target: $(`#${edge.targetId} .connector`),
          ...tools.connectOption
        })
      })
    },

    connected(info) {
      const connection = info.connection
      connection.bind('dblclick', this.connectionDblclick)

      const sourceNode = $(`#${info.sourceId}`).parent().attr('id')
      const targetNode = $(`#${info.targetId}`).parent().attr('id')

      connection.addClass(connection.id)
      const editConnection = () => {
        console.log( {source: sourceNode, target: targetNode})
      }

      const deleteConnection = () => {
        let cons = this.plumbInstance.getConnections({source: info.sourceId, target: info.targetId});
        console.log(cons)
        this.plumbInstance.deleteConnection(cons[0]);
      }

      $(`.${connection.id}`).contextMenu({
        selector: 'path',
        zIndex: 100,
        items: {
          edit: {
            name: '关联设定', icon: 'edit', callback: editConnection
          },
          delete: {
            name: '解除关联', icon: 'delete', callback: deleteConnection
          }
        }
      });

      const sourceToTarget = this.connections.findIndex(connect => connect.sourceId === sourceNode && connect.targetId === targetNode)
      if (sourceToTarget < 0) {
        this.connections.push({
          sourceId: connection.source.parentNode.id,
          targetId: connection.target.parentNode.id,
          connectionOptions: {}
        })
      }
    },

    connectionDetached(info) {
      lodash.remove(this.connections, function (connect) {
        const sourceNode = $(`#${info.sourceId}`).parent().attr('id')
        const targetNode = $(`#${info.targetId}`).parent().attr('id')
        return connect.sourceId === sourceNode && connect.targetId === targetNode
      })
    },

    connectionMoved(info) {
      console.log(info)
    },

    beforeDrop(info) {
      if (info.sourceId === info.targetId) {
        return false
      }

      if (this.checkConnectExists(info)) {
        return false
      }

      if (!this.checkTableConnectable(info)) {
        return false
      }

      return true
    },

    connectionDblclick(connection, originalEvent) {
      const sourceNode = $(`#${connection.sourceId}`).parent().attr('id')
      const targetNode = $(`#${connection.targetId}`).parent().attr('id')
      const sourceToTarget = this.connections.find(connect => connect.sourceId === sourceNode && connect.targetId === targetNode)
      console.log(sourceToTarget)
    },

    checkConnectExists(info) {
      const sourceNode = $(`#${info.sourceId}`).parent().attr('id')
      const targetNode = $(`#${info.targetId}`).parent().attr('id')
      const sourceToTarget = this.connections.findIndex(connect => connect.sourceId === sourceNode && connect.targetId === targetNode)
      const targetToSource = this.connections.findIndex(connect => connect.sourceId === targetNode && connect.targetId === sourceNode)

      return sourceToTarget >= 0 || targetToSource >= 0;
    },

    checkTableConnectable(info) {
      const sourceNode = $(`#${info.sourceId}`).parent().attr('id')
      const targetNode = $(`#${info.targetId}`).parent().attr('id')
      const sourceTable = this.tables.find(table => table.id === sourceNode)
      const targetTable = this.tables.find((table => table.id === targetNode))
      return sourceTable && targetTable && sourceTable.columns.length > 0 && targetTable.columns.length > 0;
    },

    doSave() {
      console.log(JSON.stringify({tables: this.tables, connections: this.connections}))
    }
  }
}
</script>

<style lang="scss">
#outer {
  display: flex;
  flex-direction: row;
}

.tableList-button {
  width: 240px;
  height: calc(100vh - 108px);
  margin-right: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  user-select: none;
}

#playground {
  width: 100%;
  height: calc(100vh - 108px);
  position: relative;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .dagre {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.jtk-connector {
  cursor: pointer;

  &.active {
    z-index: 999;

    path {
      stroke: #4a90e2;
      fill: #4a90e2;
      stroke-width: 2px;
    }
  }
}
</style>
