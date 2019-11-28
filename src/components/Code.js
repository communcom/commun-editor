// @flow
import * as React from "react";
import styled from "styled-components";
import type { SlateNodeProps } from "../types";
import CopyButton from "./CopyButton";

function getCopyText(node) {
  return node.nodes.reduce((memo, line) => `${memo}${line.text}\n`, "");
}

export default function CodeBlock({
  children,
  node,
  readOnly,
  attributes,
}: SlateNodeProps) {
  return (
    <Container {...attributes} spellCheck={false}>
      {readOnly && <CopyButton text={getCopyText(node)} />}
      <Code>{children}</Code>
    </Container>
  );
}

const Code = styled.code`
  display: block;
  overflow-x: auto;
  padding: 0.5em 1em;
  line-height: 1.4em;

  pre {
    -webkit-font-smoothing: initial;
    font-family: ${props => props.theme.fontFamilyMono};
    font-size: 13px;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    -moz-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    color: ${props => props.theme.code};
    margin: 0;
  }
`;

const Container = styled.div`
  position: relative;
  background: ${props => props.theme.codeBackground};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.codeBorder};

  &:hover {
    > span {
      opacity: 1;
    }
  }
`;
