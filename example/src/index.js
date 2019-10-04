// @flow
import * as React from "react";
import { debounce } from "lodash";
import ReactDOM from "react-dom";
import Editor from "../../src";

const element = document.getElementById("main");

// const defaultValue = JSON.parse(localStorage.getItem("saved"));

const defaultValue = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "A line of text in a paragraph.",
          },
        ],
      },
    ],
  },
};

class GoogleEmbed extends React.Component<*> {
  render() {
    const { attributes, node } = this.props;
    return <p {...attributes}>Google Embed ({node.data.get("href")})</p>;
  }
}

class Example extends React.Component<*, { readOnly: boolean, dark: boolean }> {
  state = {
    readOnly: false,
    dark: localStorage.getItem("dark") === "enabled",
  };

  handleToggleReadOnly = () => {
    this.setState({ readOnly: !this.state.readOnly });
  };

  handleToggleDark = () => {
    const dark = !this.state.dark;
    this.setState({ dark });
    localStorage.setItem("dark", dark ? "enabled" : "disabled");
  };

  handleChange = debounce(value => {
    localStorage.setItem("saved", value);
  }, 250);

  render() {
    const { body } = document;
    if (body) body.style.backgroundColor = this.state.dark ? "#181A1B" : "#FFF";

    return (
      <div style={{ marginTop: "60px" }}>
        <p>
          <button type="button" onClick={this.handleToggleReadOnly}>
            {this.state.readOnly ? "Editable" : "Read Only"}
          </button>
          <button type="button" onClick={this.handleToggleDark}>
            {this.state.dark ? "Light Theme" : "Dark Theme"}
          </button>
        </p>
        <Editor
          id="example"
          readOnly={this.state.readOnly}
          defaultValue={defaultValue}
          onChange={this.handleChange}
          onClickLink={href => console.log("Clicked link: ", href)}
          onShowToast={(error, message) => window.alert(error || message)}
          onSearchLink={async term => {
            console.log("Searched link: ", term);
            return [
              {
                title: term,
                url: "localhost",
              },
            ];
          }}
          uploadImage={file => {
            console.log("File upload triggered: ", file);

            // Delay to simulate time taken to upload
            return new Promise(resolve => {
              setTimeout(() => resolve("http://lorempixel.com/400/200/"), 1500);
            });
          }}
          getLinkComponent={node => {
            if (node.data.get("href").match(/google/)) {
              return GoogleEmbed;
            }
          }}
          dark={this.state.dark}
          autoFocus
          toc
        />
      </div>
    );
  }
}

if (element) {
  ReactDOM.render(<Example />, element);
}
