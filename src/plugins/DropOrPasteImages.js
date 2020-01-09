// @flow

import { getEventTransfer, getEventRange } from "slate-react";
import isImage from "is-image";
import isUrl from "is-url";
import type { Change, Range } from "slate";

import loadImageFile from "../utils/loadImageFile";
import getExtension from "../utils/getExtension";

type PluginOptions = {
  extensions?: string[],
  insertImage: Function,
};

type SlateTransfer = {
  files: FileList,
  html: string,
  text: string,
};

/**
 * Insert images on drop or paste.
 */
export default function DropOrPasteImages(options: PluginOptions = {}): Object {
  const { insertImage } = options;

  if (!insertImage) {
    throw new Error('You must supply an "insertImage" function');
  }

  /**
   * On drop or paste.
   */
  function onInsert(event: Object, change: Change, next: Function) {
    const { editor } = change;
    const transfer = getEventTransfer(event);
    const range = getEventRange(event, editor);

    if (transfer.type === "files") {
      return onInsertFiles(options, event, change, next, transfer, range);
    }

    if (event.type === "drop") {
      switch (transfer.type) {
        case "html":
          return onInsertHtml(options, event, change, next, transfer, range);
        case "text":
          return onInsertText(options, event, change, next, transfer, range);
        default:
      }
    }

    return next();
  }

  return {
    onDrop: onInsert,
    onPaste: onInsert,
  };
}

/**
 * On drop or paste files.
 */
function onInsertFiles(
  options: PluginOptions,
  event: Object,
  change: Change,
  next: Function,
  transfer: SlateTransfer,
  range: Range
) {
  const { extensions } = options;
  const { files } = transfer;

  for (const file of files) {
    if (extensions) {
      const [, ext] = file.type.split("/");

      if (!extensions.includes(ext)) {
        continue;
      }
    }

    if (range) {
      change.select(range);
    }

    asyncApplyChange(options, change, file);
  }
}

/**
 * On drop or paste html.
 */
function onInsertHtml(
  options: PluginOptions,
  event: Object,
  change: Change,
  next: Function,
  transfer: SlateTransfer,
  range: Range
) {
  const { extensions } = options;
  const { editor } = change;
  const { html } = transfer;
  const parser = new DOMParser();
  const doc = (parser.parseFromString(html, "text/html"): any);
  const firstChild = doc.body.firstChild;

  if (firstChild.nodeName.toLowerCase() !== "img") {
    return next();
  }

  const { src } = firstChild;

  if (extensions && !extensions.includes(getExtension(src))) {
    return next();
  }

  loadAndApply(options, editor, range, src);
}

/**
 * On drop or paste text.
 */
function onInsertText(
  options: PluginOptions,
  event: Object,
  change: Change,
  next: Function,
  transfer: SlateTransfer,
  range: Range
) {
  const { editor } = change;
  const { text } = transfer;

  if (!isUrl(text)) {
    return next();
  }

  if (!isImage(text)) {
    return next();
  }

  loadAndApply(options, editor, range, text);
}

function loadAndApply(options, editor, range, url) {
  loadImageFile(url).then(file => {
    editor.change(change => {
      if (range) {
        change.select(range);
      }

      asyncApplyChange(options, change, file);
    });
  });
}

/**
 * Apply the change for a given file and update the editor with the result.
 */
async function asyncApplyChange(options, change: Change, file: Blob) {
  const { insertImage } = options;
  const { editor } = change;

  await new Promise(resolve => {
    resolve(insertImage(change, file));
  });

  editor.onChange(change);
}
