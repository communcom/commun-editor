// @flow

export const EMPTY_VALUE = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "",
          },
        ],
      },
    ],
  },
};

export const EMPTY_ARTICLE_VALUE = {
  document: {
    nodes: [
      {
        object: "block",
        type: "heading1",
        nodes: [
          {
            object: "text",
            text: "",
          },
        ],
      },
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "",
          },
        ],
      },
    ],
  },
};
