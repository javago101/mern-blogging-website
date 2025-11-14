import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

const useEditor = (config) => {
    const editorRef = useRef(null);
    const holderRef = useRef(null);

    useEffect(() => {
        // Only initialize if not already created
        if (!editorRef.current) {
            editorRef.current = new EditorJS({
                holder: holderRef.current,
                ...config,
            });
        }

        // Cleanup on unmount
        return () => {
            if (editorRef.current?.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []); // Empty deps - only run once

    return holderRef;
};

export default useEditor;
