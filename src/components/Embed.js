// @flow
import React from "react";
import styled from "styled-components";

import type { SlateNodeProps } from "../types";

const Wrapper = styled.div`
  margin: 10px 0;

  ${({ isSelected }) => (isSelected ? "box-shadow: 0 0 0 2px #6a80f5;" : null)}
`;

export default function Embed({
  node,
  attributes,
  isFocused,
  isSelected,
  embedRenderer,
}: SlateNodeProps) {
  const data = node.data.toJS();

  return (
    <Wrapper
      className="embed"
      isSelected={isFocused || isSelected}
      {...attributes}
    >
      {embedRenderer(data.embed)}
    </Wrapper>
  );
}
