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
import Nodes from "./nodes";
import Marks from "./marks";

export default function createPlugins({
  placeholder,
  getLinkComponent,
  enableToolbar,
}: {
  placeholder?: string,
  getLinkComponent?: Node => ?React.ComponentType<any>,
  enableToolbar?: boolean,
}) {
  const plugins = [];

  plugins.push(
    Nodes,
    Marks,
    PasteLinkify({
      type: "link",
      collapseTo: "end",
    })
  );

  if (placeholder) {
    plugins.push(
      Placeholder({
        placeholder,
        when: (editor: Editor, node: Node) =>
          !editor.readOnly &&
          node.object === "block" &&
          node.type === "paragraph" &&
          node.text === "" &&
          editor.value.document.getBlocks().size <= 1,
      })
    );
  }

  plugins.push(
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
