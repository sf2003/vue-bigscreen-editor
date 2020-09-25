import {UID} from "@/utils";

export class VisuallyTableColumn {
  constructor(columnObject) {
    this.id = UID()
    this.name = columnObject.name
    this.type = columnObject.type
  }

  static fromJSON(columnObj) {
    const result = new VisuallyTableColumn(columnObj)
    result.id = columnObj.id
    return result
  }
}
