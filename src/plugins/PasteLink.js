/* eslint-disable flowtype/require-valid-file-annotation */

export default function PasteLink(handleLink) {
  return {
    normalizeNode(node, editor, next) {
      if (
        node.type !== "block" &&
        node.type === "link" &&
        node.text === node.data.get("href")
      ) {
        const { startBlock } = editor.value;

        handleLink(node, embed => {
          if (editor.value.startBlock !== startBlock) {
            return;
          }

          const embedObj = {
            type: "embed",
            text: "",
            isVoid: true,
            data: {
              embed,
            },
          };

          editor.moveToEndOfNode(startBlock).insertBlock(embedObj);
        });
      }

      return next();
    },
  };
}
