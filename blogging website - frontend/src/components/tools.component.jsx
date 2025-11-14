// importing tools

import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import { uploadImage } from '../common/aws';

const uploadByURL = (e) => {

    let link = new Promise((resolve, reject) => {
        try{
            resolve(e);
        }
        catch(err){
            reject(err);
        }

    })

    return link.then(url => {

        return {
            success: 1,
            file: {
                url
            }
        }

    })
}

const uploadByFile = (file) => {
    return uploadImage(file).then(url => {
        if(url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
}





const tools = {
    header: {
        class: Header,
        config:{
            placeholder: 'Enter a header',
            levels:[2, 3],
            defaultLevel:2

        }
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadByURL,
                uploadByFile: uploadByFile
            }
        }
    },
    list: {
        class: List,
        inlineToolbar: true
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
        },
    },
    marker: Marker,
    inlineCode: InlineCode,
    embed: Embed
};


export { tools };
