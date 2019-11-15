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
          console.log("NEW EMBED:", embed);

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

          // ;

          console.log("startBlock:", startBlock.toJS());

          // const range = editor.value.document
          //   .createRange()
          //   .moveToRangeOfNode(editor.value.startBlock);
          // console.log("range:", range.toJS());

          editor.moveToEndOfNode(startBlock).insertBlock(embedObj);

          // editor.insertBlockAtRange(range, {
          //   type: "embed",
          //   text: "",
          //   isVoid: true,
          //   data: {
          //     kek: "lol",
          //     embed,
          //   },
          // });

          // editor.splitBlock(10);
          // editor.setBlocks({
          //   type: "embed",
          //   text: "",
          //   isVoid: true,
          //   attributes: {
          //     kek: "lol",
          //     embed,
          //   },
          // });
        });
      }

      return next();
    },
  };
}
