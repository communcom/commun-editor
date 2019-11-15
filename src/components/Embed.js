// @flow
import React from "react";
import styled from "styled-components";

import type { SlateNodeProps } from "../types";

const Wrapper = styled.div`
  margin: 10px 0;

  ${({ isSelected }) => (isSelected ? "box-shadow: 0 0 0 2px #61c2fe;" : null)}
`;

export default function Embed({
  node,
  attributes,
  isFocused,
  isSelected,
  embedRenderer,
}: SlateNodeProps) {
  const data = node.data.toJS();

  console.log("Embed props:", data.embed);

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
