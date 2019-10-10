import { StorageBase, ConvertBase } from "./base";

/**
 * @class StorageClient
 */
export class StorageClient extends StorageBase {
  constructor(url, options) {
    super(url, options);
  }
}

/**
 * @class ConvertClient
 */
export class ConvertClient extends ConvertBase {
  constructor(url, appId, options) {
    super(url, appId, options);
  }
}
