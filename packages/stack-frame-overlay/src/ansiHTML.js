/* @flow */
import Anser from 'anser';

const base01 = 'f5f5f5', // Lighter Background (Used for status bars)
  base03 = '969896', // Comments, Invisibles, Line Highlighting
  base05 = '333333', // Default Foreground, Caret, Delimiters, Operators
  base08 = 'ed6a43', // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
  base0B = '183691', // Strings, Inherited Class, Markup Code, Diff Inserted
  base0C = '183691', // Support, Regular Expressions, Escape Characters, Markup Quotes
  base0E = 'a71d5d'; // Keywords, Storage, Selector, Markup Italic, Diff Changed

// Map ANSI colors from what babel-code-frame uses to base16-github
// See: https://github.com/babel/babel/blob/e86f62b304d280d0bab52c38d61842b853848ba6/packages/babel-code-frame/src/index.js#L9-L22
const colors = {
  reset: [base05, 'transparent'],
  black: base05,
  red: base08 /* marker, bg-invalid */,
  green: base0B /* string */,
  yellow: base08 /* capitalized, jsx_tag, punctuator */,
  blue: base0C,
  magenta: base0C /* regex */,
  cyan: base0E /* keyword */,
  gray: base03 /* comment, gutter */,
  lightgrey: base01,
  darkgrey: base03,
};

function ansiHTML(txt: string) {
  const arr = new Anser().ansiToJson(txt, {
    use_classes: true,
  });

  let result = '';
  let open = false;
  for (let index = 0; index < arr.length; ++index) {
    const c = arr[index];
    const { content, fg } = c;
    const contentParts = content.split('\n');
    for (let _index = 0; _index < contentParts.length; ++_index) {
      if (!open) {
        result += '<span data-ansi-line="true">';
        open = true;
      }
      const part = contentParts[_index].replace('\r', '');
      const color = fg == null
        ? null
        : colors[fg.replace(/^ansi-(bright-)?/, '')];
      if (color != null) {
        result += '<span style="color: #' + color + ';">' + part + '</span>';
      } else {
        result += '<span>' + part + '</span>';
      }
      if (_index < contentParts.length - 1) {
        result += '</span>';
        open = false;
        result += '<br/>';
      }
    }
  }
  if (open) {
    result += '</span>';
    open = false;
  }
  return result;
}

export { ansiHTML };
