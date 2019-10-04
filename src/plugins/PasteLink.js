/* eslint-disable flowtype/require-valid-file-annotation */

export default function PasteLink(handleLink) {
  return {
    normalizeNode(node, editor, next) {
      if (
        node.type !== "block" &&
        node.type === "link" &&
        node.text === node.data.get("href")
      ) {
        handleLink(node);
      }

      return next();
    },
  };
}
