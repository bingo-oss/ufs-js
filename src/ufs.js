import { StorageBase, ConvertBase } from "./base";

export class StorageClient extends StorageBase {
  constructor(url, options) {
    super(url, options);
  }
}

export class ConvertClient extends ConvertBase {
  constructor(url, appId, options) {
    super(url, appId, options);
  }
}
