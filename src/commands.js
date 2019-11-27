// @flow
import { Editor, Block, KeyUtils } from "slate";

const commands = {
  wrapLink(editor: Editor, href: string) {
    if (!editor.isLinkActive()) {
      editor.wrapInline({ type: "link", data: { href } });
    }
  },

  unwrapLink(editor: Editor) {
    editor.unwrapInline("link");
  },

  async insertImageFile(editor: Editor, file: window.File) {
    const { type, uploadImage } = editor.props;

    if (!uploadImage) {
      return;
    }

    if (type === "article") {
      return processImageInsertIntoArticle(editor, file);
    } else {
      return processImageInsertIntoBasic(editor, file);
    }
  },
};

async function processImageInsertIntoBasic(editor: Editor, file: window.File) {
  const { uploadImage, showToast, onLinkFound } = editor.props;

  if (!onLinkFound) {
    return;
  }

  try {
    const url = await uploadImage(file);

    if (url) {
      onLinkFound({
        type: "image",
        content: url,
      });
    }
  } catch (err) {
    console.error("Uploading failed:", err);

    if (showToast) {
      showToast(`Image uploading failed: ${err.message}`);
    }
  }
}

async function processImageInsertIntoArticle(
  editor: Editor,
  file: window.File
) {
  const { uploadImage, showToast } = editor.props;

  const key = KeyUtils.create();

  // load the file as a data URL
  const placeholderSrc = URL.createObjectURL(file);
  const node = Block.create({
    key,
    type: "image",
    isVoid: true,
    data: {
      src: placeholderSrc,
      alt: "",
      loading: true,
    },
  });

  editor
    .insertBlock(node)
    .insertBlock("paragraph")
    .onChange(editor);

  let imageUrl = null;

  try {
    imageUrl = await uploadImage(file);
  } catch (err) {
    // if there was an error during upload, remove the placeholder image
    tryRemoveNodeWithoutSaving(editor, key);

    if (showToast) {
      showToast(`Image uploading failed: ${err.message}`);
    }
    return;
  }

  if (!imageUrl) {
    tryRemoveNodeWithoutSaving(editor, key);
    return;
  }

  try {
    editor.withoutSaving(editor =>
      editor.setNodeByKey(key, {
        data: {
          src: imageUrl,
          alt: "",
          loading: false,
        },
      })
    );
  } catch (err) {}
}

function tryRemoveNodeWithoutSaving(editor: Editor, key) {
  try {
    editor.withoutSaving(editor => editor.removeNodeByKey(key));
  } catch (err) {}
}

export default commands;
