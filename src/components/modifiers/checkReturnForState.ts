import { insertEmptyBlock } from "./insertEmptyBlock";
import { handleNewCodeBlock } from "./handleNewCodeBlock";
import { changeCurrentBlockType } from "./changeCurrentBlockType";
import { insertText } from "./insertText";
import { handleInlineStyle } from "./handleInlineStyle";
import { EditorState } from "draft-js";

export function checkReturnForState(
  editorState: EditorState,
  ev: React.KeyboardEvent<{
    preventDefault: () => void;
    stopPropagation: () => void;
  }>,
  {
    insertEmptyBlockOnReturnWithModifierKey,
  }: {
    insertEmptyBlockOnReturnWithModifierKey: boolean;
  }
) {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();
  const text = currentBlock.getText();

  if (
    newEditorState === editorState &&
    insertEmptyBlockOnReturnWithModifierKey &&
    (ev.ctrlKey ||
      ev.shiftKey ||
      ev.metaKey ||
      ev.altKey ||
      (/^header-/.test(type) &&
        selection.isCollapsed() &&
        selection.getEndOffset() === text.length))
  ) {
    newEditorState = insertEmptyBlock(editorState);
  }
  if (
    newEditorState === editorState &&
    type !== "code-block" &&
    /^```([\w-]+)?$/.test(text)
  ) {
    newEditorState = handleNewCodeBlock(editorState);
  }
  if (newEditorState === editorState && type === "code-block") {
    if (/```\s*$/.test(text)) {
      newEditorState = changeCurrentBlockType(
        newEditorState,
        type,
        text.replace(/\n```\s*$/, "")
      );
      newEditorState = insertEmptyBlock(newEditorState);
    } else {
      newEditorState = insertText(editorState, "\n");
    }
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, "\n");
  }
  return newEditorState;
}
