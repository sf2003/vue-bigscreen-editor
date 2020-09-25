import {UID} from "@/utils";
import {VisuallyTableColumn} from "@/components/VisuallyElement/VisuallyTableColumn";
import lodash, {remove} from "lodash";

export class VisuallyTable {
  constructor(tableName) {
    this.id = UID()
    this.name = tableName
    this.x = 200
    this.y = 100
    this.columns = []
  }

  addColumn(column) {
    this.columns.push(column)
  }

  deleteColumn(column) {
    this.columns = lodash.without(this.columns, column)
  }

  static fromJSON(tableObj) {
    const result = new VisuallyTable(tableObj.name)
    result.id = tableObj.id
    result.x = tableObj.x
    result.y = tableObj.y
    result.columns = []
    tableObj.columns.forEach(column => {
      result.columns.push(VisuallyTableColumn.fromJSON(column))
    })
    return result
  }
}
