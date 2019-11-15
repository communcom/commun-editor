// @flow
import { Block } from "slate";
import type { Change, Node } from "slate";

function removeInlines(
  change: Change,
  error: { code: string, node: Node, child: Node }
) {
  if (error.code === "child_object_invalid") {
    change.unwrapInlineByKey(error.child.key, error.child.type);
  }
}

function articleNormalize(editor, { code, node, child, index }) {
  switch (code) {
    case "child_max_invalid": {
      const type = index === 0 ? "heading1" : "paragraph";
      return editor.setNodeByKey(child.key, type);
    }
    case "child_min_invalid": {
      const missingTitle = index === 0;
      const firstNode = editor.value.document.nodes.get(0);
      if (!firstNode) {
        editor.insertNodeByKey(node.key, 0, Block.create("heading1"));
      } else {
        editor.setNodeByKey(firstNode.key, { type: "heading1" });
      }

      const secondNode = editor.value.document.nodes.get(1);
      if (!secondNode) {
        editor.insertNodeByKey(node.key, 1, Block.create("paragraph"));
      } else {
        editor.setNodeByKey(secondNode.key, { type: "paragraph" });
      }

      if (missingTitle) {
        setImmediate(() => editor.moveFocusToStartOfDocument());
      }

      return editor;
    }
    default:
  }
}

function commentNormalize(editor, { code, node, child, index }) {
  if (code === "child_type_invalid") {
    return editor.setNodeByKey(child.key, "paragraph");
  }

  if (code === "child_min_invalid") {
    const block = Block.create("paragraph");
    return editor.insertNodeByKey(node.key, index, block);
  }
}

export function createSchema(type = "basic") {
  let normalize = undefined;

  const nodes = [
    {
      match: [
        { type: "paragraph" },
        { type: "heading1" },
        { type: "heading2" },
        { type: "heading3" },
        { type: "heading4" },
        { type: "heading5" },
        { type: "heading6" },
        { type: "block-quote" },
        { type: "code" },
        { type: "horizontal-rule" },
        { type: "image" },
        { type: "bulleted-list" },
        { type: "ordered-list" },
        { type: "block-toolbar" },
        { type: "link" },
        { type: "embed" },
      ],
      min: 1,
    },
  ];

  switch (type) {
    case "article":
      nodes.unshift({ match: { type: "heading1" }, min: 1, max: 1 });
      normalize = articleNormalize;
      break;
    case "comment":
      normalize = commentNormalize;
      break;
    default:
  }

  return {
    blocks: {
      heading1: {
        nodes: [{ match: { object: "text" } }],
        marks: [""],
        normalize: removeInlines,
      },
      heading2: {
        nodes: [{ match: { object: "text" } }],
        marks: [""],
        normalize: removeInlines,
      },
      heading3: {
        nodes: [{ match: { object: "text" } }],
        marks: [""],
        normalize: removeInlines,
      },
      heading4: {
        nodes: [{ match: { object: "text" } }],
        marks: [""],
        normalize: removeInlines,
      },
      heading5: {
        nodes: [{ match: { object: "text" } }],
        marks: [""],
        normalize: removeInlines,
      },
      heading6: {
        nodes: [{ match: { object: "text" } }],
        marks: [""],
        normalize: removeInlines,
      },
      code: {
        marks: [""],
      },
      "horizontal-rule": {
        isVoid: true,
      },
      image: {
        isVoid: true,
      },
      link: {
        nodes: [{ match: { object: "text" } }],
      },
      "block-toolbar": {
        isVoid: true,
      },
      "list-item": {
        parent: [{ type: "bulleted-list" }, { type: "ordered-list" }],
        nodes: [
          {
            match: [
              { object: "text" },
              { type: "image" },
              { type: "paragraph" },
              { type: "bulleted-list" },
              { type: "ordered-list" },
            ],
          },
        ],
      },
      embed: {
        isVoid: true,
      },
    },
    document: {
      nodes,
      normalize,
    },
  };
}
