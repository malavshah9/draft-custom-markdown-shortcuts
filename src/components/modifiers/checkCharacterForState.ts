import { EditorState } from "draft-js";
import { handleBlockType } from "./handleBlockType";
import { handleInlineStyle } from "./handleInlineStyle";

export function checkCharacterForState(
  editorState: EditorState,
  character: string
) {
  let newEditorState = handleBlockType(editorState, character);
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();

  if (editorState === newEditorState && type !== "code-block") {
    newEditorState = handleInlineStyle(editorState, character);
  }
  return newEditorState;
}
