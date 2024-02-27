import { EditorState } from "draft-js";
import { changeCurrentInlineStyle } from "./changeCurrentInlineStyle";

const inlineMatchers: Record<string, RegExp> = {
  BOLD: /(?:^|\s|\n|[^A-z0-9_*~`])(\*{1})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
  UNDER_LINE:
    /(?:^|\s|\n|[^A-z0-9_*~`])(\*{3})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
  RED_UNDER_LINE:
    /(?:^|\s|\n|[^A-z0-9_*~`])(\*{2})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
} as const;

export const handleInlineStyle = (
  editorState: EditorState,
  character: string
) => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  const line = `${text}${character}`;
  let newEditorState = editorState;
  Object.keys(inlineMatchers).some((k) => {
    const re = inlineMatchers[k];
    let matchArr;
    do {
      matchArr = re.exec(line);
      if (matchArr) {
        newEditorState = changeCurrentInlineStyle(newEditorState, matchArr, k);
      }
    } while (matchArr);
    return newEditorState !== editorState;
  });
  return newEditorState;
};
