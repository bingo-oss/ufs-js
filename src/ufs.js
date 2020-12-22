import { StorageBase, ConvertBase } from "./base";

// 兼容startsWith和endsWith
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function(prefix) {
      return this.slice(0, prefix.length) === prefix;
  };
}

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function(suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

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
