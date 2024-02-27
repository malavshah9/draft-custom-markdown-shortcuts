import { EditorState, RichUtils } from "draft-js";
import { changeCurrentBlockType } from "./changeCurrentBlockType";

const sharps = (len: number) => {
  let ret = "";
  while (ret.length < len) {
    ret += "#";
  }
  return ret;
};

const blockTypes = [null, "header-one"];

export const handleBlockType = (
  editorState: EditorState,
  character: string
) => {
  const currentSelection = editorState.getSelection();
  const key = currentSelection.getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  const position = currentSelection.getAnchorOffset();
  const line = [text.slice(0, position), character, text.slice(position)].join(
    ""
  );
  const blockType = RichUtils.getCurrentBlockType(editorState);

  if (line.indexOf(`${sharps(1)} `) === 0 && blockType !== "code-block") {
    return changeCurrentBlockType(
      editorState,
      blockTypes[1],
      line.replace(/^#+\s/, "")
    );
  }

  return editorState;
};
