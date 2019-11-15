// @flow
import React from "react";
import type { SlateNodeProps } from "../types";

export default function ListItem({ children, attributes }: SlateNodeProps) {
  return <li {...attributes}>{children}</li>;
}
