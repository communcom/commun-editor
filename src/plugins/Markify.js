/* eslint-disable no-cond-assign,flowtype/require-valid-file-annotation */

const MENTION_RX = /(?:^|[^\w/\\])(@[a-z][a-z0-9.-]+[a-z0-9])/;
const TAG_RX = /(?:^|[^\w/\\])(#[A-Za-z0-9]+)/;

export default () => ({
  onChange: (editor, next) => {
    const { document } = editor.value;

    if (process.browser && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-underscore-dangle
      window._editor = editor;
    }

    editor.value.texts.forEach(textNode => {
      const { text } = textNode;

      if (!text) {
        return;
      }

      if (
        textNode
          .getMarks()
          .some(mark => mark.type === "mention" || mark.type === "tag")
      ) {
        const range = document.createRange().moveToRangeOfNode(textNode);

        editor.removeMarkAtRange(range, "mention");
        editor.removeMarkAtRange(range, "tag");
      }

      function markByRx(rx, markName) {
        let remainText = text;
        let index = 0;
        let match;

        while ((match = remainText.match(rx))) {
          const offset = index + match.index + match[0].indexOf(match[1]);

          const range = document
            .createRange()
            .moveStartTo(textNode.key, offset)
            .moveEndTo(textNode.key, offset + match[1].length);

          editor.addMarkAtRange(range, markName);

          index = offset + match[1].length;
          remainText = text.substr(index);
        }
      }

      markByRx(MENTION_RX, "mention");
      markByRx(TAG_RX, "tag");
    });

    return next();
  },
});
