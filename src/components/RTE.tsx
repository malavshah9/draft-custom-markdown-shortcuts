import { useRef, useState } from "react";
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import { createMarkdownShortcutsPlugin } from "./plugins/MarkdownShortcut";

import "draft-js/dist/Draft.css";
import styles from "./rte.module.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";

const styleMap = {
  RED_UNDER_LINE: {
    textDecoration: "underline",
    textDecorationColor: "red",
    color: "red",
  },
  UNDER_LINE: {
    textDecoration: "underline",
  },
};

const plugins = [createMarkdownShortcutsPlugin()];

export function RTE() {
  const rteRef = useRef(null);
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      return EditorState.createWithContent(
        convertFromRaw(JSON.parse(savedContent))
      );
    }
    return EditorState.createEmpty();
  });

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onSaveClick = () => {
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    alert("Content saved successfully!");
  };

  return (
    <div ref={rteRef} className={styles.editorWithButtonContainer}>
      <button onClick={onSaveClick} className={styles.save}>
        Save
      </button>

      <div className={styles.root}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Write something here..."
          plugins={plugins}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
}
