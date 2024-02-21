import React, { useEffect, useRef, useState } from "react";
import { Modifier, SelectionState, ContentBlock } from 'draft-js';

import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import Toolbar from "./Toolbar";
// import "./DraftEditor.css";

const DraftEditor = () => {
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            convertFromRaw({
                blocks: [
                    {
                        key: "3eesq",
                        text: "A Text-editor with super cool features built in Draft.js.",
                        type: "unstyled",
                        depth: 0,
                        inlineStyleRanges: [
                            {
                                offset: 19,
                                length: 6,
                                style: "BOLD",
                            },
                            {
                                offset: 25,
                                length: 5,
                                style: "ITALIC",
                            },
                            {
                                offset: 30,
                                length: 8,
                                style: "UNDERLINE",
                            },
                        ],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: "9adb5",
                        text: "Tell us a story!",
                        type: "header-one",
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
                entityMap: {},
            })
        )
    );
    const editor = useRef(null);

    useEffect(() => {
        focusEditor();
    }, []);

    const focusEditor = () => {
        editor.current.focus();
    };

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        console.log(newState + " new state");
        if (newState) {
            setEditorState(newState);
            console.log(editorState);
            return true;
        }
        return false;
    };

    // FOR INLINE STYLES
    const styleMap = {
        CODE: {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
            fontSize: 16,
            padding: 2,
        },
        HIGHLIGHT: {
            backgroundColor: "#F7A5F7",
        },
        UPPERCASE: {
            textTransform: "uppercase",
        },
        LOWERCASE: {
            textTransform: "lowercase",
        },
        CODEBLOCK: {
            fontFamily: '"fira-code", "monospace"',
            fontSize: "inherit",
            background: "#ffeff0",
            fontStyle: "italic",
            lineHeight: 1.5,
            padding: "0.3rem 0.5rem",
            borderRadius: " 0.2rem",
        },
        SUPERSCRIPT: {
            verticalAlign: "super",
            fontSize: "80%",
        },
        SUBSCRIPT: {
            verticalAlign: "sub",
            fontSize: "80%",
        },
    };

    // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
    const myBlockStyleFn = (contentBlock) => {
        const text = contentBlock.getText();
        if (text.startsWith('# ')) {
            return 'bold';
        } else if (text.startsWith('## ')) {
            return 'italic';
        } else if (text.startsWith('### ')) {
            return 'underline';
        }
        const type = contentBlock.getType();
        switch (type) {
            case "blockQuote":
                return "superFancyBlockquote";
            case "leftAlign":
                return "leftAlign";
            case "rightAlign":
                return "rightAlign";
            case "centerAlign":
                return "centerAlign";
            case "justifyAlign":
                return "justifyAlign";
            default:
                break;
        }
    };

    const changeHandler = (editorState) => {
        const contentState = editorState.getCurrentContent();
        console.log(contentState)
        const blocks = contentState.getBlockMap();
        let newEditorState = editorState;

        blocks.forEach((contentBlock, blockKey) => {
            const text = contentBlock.getText();
            if (text.startsWith('# ')) {
                myBlockStyleFn(contentBlock);
                const newText = text.substring(2); // Remove '# ' from the beginning
                let newContentState = Modifier.replaceText(
                    contentState,
                    new SelectionState({
                        anchorKey: blockKey,
                        anchorOffset: 0,
                        focusKey: blockKey,
                        focusOffset: 2, // Length of '# '
                    }),
                    newText
                );
                // const newSelectionState = new SelectionState({
                //     anchorKey: blockKey,
                //     anchorOffset: 0,
                //     focusKey: blockKey,
                //     focusOffset: newText.length,
                // });
                newEditorState = EditorState.push(newEditorState, newContentState, 'replace-text');

                // newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'BOLD', newSelectionState);


                // const newEditorStateWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD', newSelectionState);
                // newEditorState = EditorState.forceSelection(newEditorStateWithBold, newSelectionState);
            }
        });
        setEditorState(newEditorState);


        // const newEditorStateWithBold = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        // const newEditorStateWithBold = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');
        // setEditorState(newEditorStateWithBold);
    }

    return (
        <div className="editor-wrapper" onClick={focusEditor}>
            <Toolbar editorState={editorState} setEditorState={setEditorState} />
            <div className="editor-container">
                <Editor
                    ref={editor}
                    placeholder="Write Here"
                    handleKeyCommand={handleKeyCommand}
                    editorState={editorState}
                    customStyleMap={styleMap}
                    blockStyleFn={myBlockStyleFn}
                    onChange={changeHandler}
                />
            </div>
        </div>
    );
};

export default DraftEditor;
