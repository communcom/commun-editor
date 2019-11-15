// @flow
import * as React from "react";
import { Node, Editor } from "slate";
import TrailingBlock from "@wikifactory/slate-trailing-block";
import EditCode from "@wikifactory/slate-edit-code";
import EditBlockquote from "@wikifactory/slate-edit-blockquote";
import InsertImages from "slate-drop-or-paste-images";
import PasteLinkify from "slate-paste-linkify";
import CollapseOnEscape from "slate-collapse-on-escape";

import Placeholder from "./plugins/Placeholder";
import EditList from "./plugins/EditList";
import CollapsableHeadings from "./plugins/CollapsableHeadings";
import KeyboardBehavior from "./plugins/KeyboardBehavior";
import Ellipsis from "./plugins/Ellipsis";
import Embeds from "./plugins/Embeds";
import Chrome from "./plugins/Chrome";
import Markify from "./plugins/Markify";
import PasteLink from "./plugins/PasteLink";
import Nodes from "./nodes";
import Marks from "./marks";

export default function createPlugins({
  type,
  placeholder,
  titlePlaceholder,
  getLinkComponent,
  enableToolbar,
  handleLink,
  embedRenderer,
}: {
  type: string,
  placeholder?: string,
  titlePlaceholder?: string,
  getLinkComponent?: Node => ?React.ComponentType<any>,
  enableToolbar?: boolean,
  handleLink?: Function,
  embedRenderer?: Function,
}) {
  const plugins = [];

  if (handleLink) {
    plugins.push(PasteLink(handleLink));
  }

  plugins.push(
    Nodes({ embedRenderer }),
    Marks,
    PasteLinkify({
      type: "link",
      collapseTo: "end",
    })
  );

  if (titlePlaceholder) {
    plugins.push(
      Placeholder({
        placeholder: titlePlaceholder,
        when: (editor, node) =>
          !editor.readOnly &&
          node.object === "block" &&
          node.type === "heading1" &&
          node.text === "" &&
          editor.value.document.nodes.first() === node,
      })
    );
  }

  if (placeholder) {
    plugins.push(
      Placeholder({
        placeholder,
        when: (editor: Editor, node: Node) => {
          if (editor.readOnly) {
            return false;
          }

          const isEmptyParagraph =
            node.object === "block" &&
            node.type === "paragraph" &&
            node.text === "";

          if (isEmptyParagraph) {
            const textNodes = editor.value.document.getBlocksByType(
              "paragraph"
            );

            if (node === textNodes.first() && textNodes.size === 1) {
              return true;
            }
          }

          return false;
        },
      })
    );
  }

  plugins.push(
    Markify(),
    InsertImages({
      extensions: ["png", "jpg", "jpeg", "gif", "webp"],
      insertImage: (editor, file) => editor.insertImageFile(file),
    }),
    EditCode({
      containerType: "code",
      lineType: "code-line",
      exitBlocktype: "paragraph",
      allowMarks: false,
      selectAll: true,
    }),
    EditBlockquote({
      type: "block-quote",
      typeDefault: "paragraph",
    }),
    Embeds({ getComponent: getLinkComponent }),
    CollapseOnEscape({ toEdge: "end" }),
    CollapsableHeadings(),
    EditList,
    KeyboardBehavior(),
    Ellipsis(),
    TrailingBlock({ type: "paragraph" })
  );

  if (enableToolbar) {
    plugins.push(Chrome());
  }

  return plugins;
}
