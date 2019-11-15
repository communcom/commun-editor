// @flow
import * as React from "react";
import { Value, Schema, Node } from "slate";
import { Editor } from "slate-react";
import styled, { ThemeProvider } from "styled-components";
import type { SearchResult } from "./types";
import { light as lightTheme, dark as darkTheme } from "./theme";
import getDataTransferFiles from "./lib/getDataTransferFiles";
import createPlugins from "./plugins";
import commands from "./commands";
import queries from "./queries";
import { createSchema } from "./schema";
import { EMPTY_ARTICLE_VALUE, EMPTY_VALUE } from "./emptyValues";

export { createSchema } from "./schema";

export const theme = lightTheme;

export type Props = {
  id?: string,
  type?: string,
  defaultValue: string,
  placeholder?: string,
  titlePlaceholder?: string,
  autoFocus?: boolean,
  readOnly?: boolean,
  headingsOffset?: number,
  toc?: boolean,
  dark?: boolean,
  schema?: Schema,
  theme?: Object,
  handleLink?: Function,
  uploadImage?: (file: File) => Promise<string>,
  onChange: (value: Value) => void,
  onImageUploadStart?: () => void,
  onImageUploadStop?: () => void,
  onSearchLink?: (term: string) => Promise<SearchResult[]>,
  onClickLink?: (href: string) => void,
  onShowToast?: (error: string, message: string) => void,
  getLinkComponent?: Node => ?React.ComponentType<any>,
  className?: string,
  style?: Object,
  enableToolbar?: boolean,
};

type State = {
  editorValue: Value,
};

export default class CommunEditor extends React.PureComponent<Props, State> {
  static defaultProps = {
    defaultValue: null,
    type: "basic",
    placeholder: undefined,
    titlePlaceholder: undefined,
    tooltip: "span",
    embedRenderer: undefined,
    onImageUploadStart: undefined,
    onImageUploadStop: undefined,
  };

  editor: Editor;
  schema: ?Schema = null;

  constructor(props: Props) {
    super(props);

    const isArticle = props.type === "article";

    this.plugins = createPlugins({
      type: props.type,
      placeholder: props.placeholder,
      titlePlaceholder: isArticle ? props.titlePlaceholder || "..." : undefined,
      getLinkComponent: props.getLinkComponent,
      enableToolbar: props.enableToolbar,
      handleLink: props.handleLink,
      embedRenderer: props.embedRenderer,
    });

    this.schema = createSchema(props.type);

    let value = props.defaultValue;

    if (!value) {
      if (isArticle) {
        value = EMPTY_ARTICLE_VALUE;
      } else {
        value = EMPTY_VALUE;
      }
    }

    this.state = {
      editorValue: Value.fromJSON(value),
    };
  }

  componentDidMount() {
    const { readOnly, autoFocus } = this.props;

    this.scrollToAnchor();

    if (!readOnly && autoFocus) {
      this.focusAtEnd();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.readOnly && !this.props.readOnly && this.props.autoFocus) {
      this.focusAtEnd();
    }
  }

  scrollToAnchor() {
    const { hash } = window.location;

    if (!hash) {
      return;
    }

    try {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      // querySelector will throw an error if the hash begins with a number
      // or contains a period. This is protected against now by safeSlugify
      // however previous links may be in the wild.
      console.warn("Attempted to scroll to invalid hash", err);
    }
  }

  setEditorRef = (ref: Editor) => {
    this.editor = ref;
  };

  value = (): string => {
    return this.state.editorValue;
  };

  handleChange = ({ value }: { value: Value }) => {
    const { readOnly, onChange } = this.props;

    this.setState({ editorValue: value }, () => {
      if (onChange && !readOnly) {
        onChange(value);
      }
    });
  };

  handleDrop = async (ev: SyntheticDragEvent<>) => {
    const { readOnly } = this.props;

    if (readOnly) {
      return;
    }

    // check an image upload callback is defined
    if (!this.editor.props.uploadImage) {
      return;
    }

    // check if this event was already handled by the Editor
    if (ev.isDefaultPrevented()) {
      return;
    }

    // otherwise we'll handle this
    ev.preventDefault();
    ev.stopPropagation();

    const files = getDataTransferFiles(ev);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        await this.insertImageFile(file);
      }
    }
  };

  insertImageFile = (file: window.File) => {
    this.editor.insertImageFile(file);
  };

  cancelEvent = (ev: SyntheticEvent<>) => {
    ev.preventDefault();
  };

  focusAtStart = () => {
    const { editor } = this;
    editor.moveToStartOfDocument().focus();
  };

  focusAtEnd = () => {
    const { editor } = this;
    editor.moveToEndOfDocument().focus();
  };

  render = () => {
    const {
      readOnly,
      className,
      style,
      dark,
      defaultValue,
      autoFocus,
      plugins,
      ...rest
    } = this.props;

    const theme = this.props.theme || (dark ? darkTheme : lightTheme);

    return (
      <div
        style={style}
        className={className}
        onDrop={this.handleDrop}
        onDragOver={this.cancelEvent}
        onDragEnter={this.cancelEvent}
      >
        <ThemeProvider theme={theme}>
          <StyledEditor
            ref={this.setEditorRef}
            plugins={this.plugins}
            value={this.state.editorValue}
            commands={commands}
            queries={queries}
            schema={this.schema}
            readOnly={readOnly}
            spellCheck={!readOnly}
            {...rest}
            onChange={this.handleChange}
          />
        </ThemeProvider>
      </div>
    );
  };
}

const StyledEditor = styled(Editor)`
  color: ${props => props.theme.text};
  font-family: ${props => props.theme.fontFamily};
  font-weight: ${props => props.theme.fontWeight};
  font-size: 1em;
  line-height: 1.7em;
  width: 100%;
  min-height: 100%;
  margin: -1px;
  padding: 1px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
  }

  ul,
  ol {
    margin: 0 0.1em;
    padding-left: 1em;

    ul,
    ol {
      margin: 0.1em;
    }
  }

  p {
    position: relative;
    margin: 0;
  }

  a {
    color: ${props => props.theme.link};
  }

  a:hover {
    text-decoration: ${props => (props.readOnly ? "underline" : "none")};
  }

  li p {
    display: inline;
    margin: 0;
  }

  blockquote {
    border-left: 3px solid ${props => props.theme.quote};
    margin: 0;
    padding-left: 10px;
    font-style: italic;
  }

  b,
  strong {
    font-weight: 600;
  }
`;
