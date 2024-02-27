import * as Immutable from "immutable";
import { EditorPlugin } from "@draft-js-plugins/editor";
import { EditorState } from "draft-js";
import { checkReturnForState } from "../modifiers/checkReturnForState";
import { insertEmptyBlock } from "../modifiers/insertEmptyBlock";
import { checkCharacterForState } from "../modifiers/checkCharacterForState";
import { replaceText } from "../util";

type Store = {
  setEditorState?: (state: EditorState) => void;
  getEditorState?: () => EditorState;
};

export const createMarkdownShortcutsPlugin = (
  config = { insertEmptyBlockOnReturnWithModifierKey: true }
): EditorPlugin & {
  store: Store;
} => {
  const store: Store = {};
  return {
    store,
    blockRenderMap: Immutable.Map({
      "code-block": {
        element: "code",
        wrapper: <pre spellCheck="false" />,
      },
    }),
    decorators: [],

    initialize({ setEditorState, getEditorState }) {
      store.setEditorState = setEditorState;
      store.getEditorState = getEditorState;
    },

    handleReturn(ev, editorState) {
      // @ts-ignore
      const newEditorState = checkReturnForState(editorState, ev, config);
      if (editorState !== newEditorState) {
        store.setEditorState?.(newEditorState);
        return "handled";
      }
      return "not-handled";
    },

    handleBeforeInput(character, editorState) {
      if (character.match(/[A-z0-9_*~`]/)) {
        return "not-handled";
      }
      const newEditorState = checkCharacterForState(editorState, character);
      if (editorState !== newEditorState) {
        store.setEditorState?.(newEditorState);
        return "handled";
      }
      return "not-handled";
    },
    handlePastedText(text, html, editorState) {
      if (html) {
        return "not-handled";
      }

      if (!text) {
        return "not-handled";
      }

      let newEditorState = editorState;
      let buffer = [];
      for (let i = 0; i < text.length; i += 1) {
        // eslint-disable-line no-plusplus
        if (text[i].match(/[^A-z0-9_*~`]/)) {
          newEditorState = replaceText(
            newEditorState,
            buffer.join("") + text[i]
          );
          newEditorState = checkCharacterForState(newEditorState, text[i]);
          buffer = [];
        } else if (text[i].charCodeAt(0) === 10) {
          newEditorState = replaceText(newEditorState, buffer.join(""));
          const tmpEditorState = checkReturnForState(
            newEditorState,
            // @ts-ignore
            {},
            config
          );
          if (newEditorState === tmpEditorState) {
            newEditorState = insertEmptyBlock(tmpEditorState);
          } else {
            newEditorState = tmpEditorState;
          }
          buffer = [];
        } else if (i === text.length - 1) {
          newEditorState = replaceText(
            newEditorState,
            buffer.join("") + text[i]
          );
          buffer = [];
        } else {
          buffer.push(text[i]);
        }
      }

      if (editorState !== newEditorState) {
        store.setEditorState?.(newEditorState);
        return "handled";
      }
      return "not-handled";
    },
  };
};
