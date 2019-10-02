// @flow
import * as React from "react";
import { Node, Editor } from "slate";
import TrailingBlock from "@wikifactory/slate-trailing-block";
import EditCode from "@wikifactory/slate-edit-code";
import EditBlockquote from "@wikifactory/slate-edit-blockquote";
import EditTable from "@domoinc/slate-edit-table";
import InsertImages from "slate-drop-or-paste-images";
import PasteLinkify from "slate-paste-linkify";
import CollapseOnEscape from "slate-collapse-on-escape";

import Placeholder from "./plugins/Placeholder";
import EditList from "./plugins/EditList";
import CollapsableHeadings from "./plugins/CollapsableHeadings";
import KeyboardBehavior from "./plugins/KeyboardBehavior";
import KeyboardShortcuts from "./plugins/KeyboardShortcuts";
import MarkdownShortcuts from "./plugins/MarkdownShortcuts";
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
        when: (editor: Editor, node: Node) => {
          if (editor.readOnly) return false;
          if (node.object !== "block") return false;
          if (node.type !== "paragraph") return false;
          if (node.text !== "") return false;
          if (editor.value.document.getBlocks().size > 1) return false;
          return true;
        },
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
    EditTable({
      typeTable: "table",
      typeRow: "table-row",
      typeCell: "table-cell",
      typeContent: "paragraph",
    }),
    Embeds({ getComponent: getLinkComponent }),
    CollapseOnEscape({ toEdge: "end" }),
    CollapsableHeadings(),
    EditList,
    KeyboardBehavior(),
    KeyboardShortcuts(),
    MarkdownShortcuts(),
    Ellipsis(),
    TrailingBlock({ type: "paragraph" })
  );

  if (enableToolbar) {
    plugins.push(Chrome());
  }

  return plugins;
}
