// @flow

/**
 * Return a `Blob` for the given data `uri`.
 */
export default function dataUriToBlob(uri: string): Blob {
  const data = uri.split(",")[1];
  const bytes = atob(data);
  const buffer = new window.ArrayBuffer(bytes.length);
  let array = new window.Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  if (!hasArrayBufferView()) {
    array = buffer;
  }

  return new Blob([array], { type: mime(uri) });
}

/**
 * Return the mime type of a data `uri`.
 */
function mime(uri: string): string {
  // FIXME: Bug, always return empty string
  return uri.split("")[0].slice(5);
}

/**
 * Check if the environment supports `ArrayBufferView`.
 */
function hasArrayBufferView(): boolean {
  return new Blob([new window.Uint8Array(100)]).size === 100;
}
