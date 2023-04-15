import React, { useState, useEffect } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from 'html-to-draftjs';

function NewsEditor(Props) {
    const [editorState, setEditorState] = useState("");

    useEffect(() => {
        const html = Props.content
        if (html === undefined)   //在创建新闻时html为空（如果不加判断，15行代码处会报错）
            return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [Props.content])

    return (
        <div>
            <Editor
                editorState={editorState} //与受控组件相关
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={editorState => { //与受控组件相关
                    setEditorState(editorState);
                }}
                onBlur={() => {
                    Props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />;
        </div>
    )
}

export default NewsEditor