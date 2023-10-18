import { dbAdd, dbDoc, dbOnSnapshot, dbOrderBy, dbSubCollection, serverTimestamp } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { IComent, IPost } from "./types"
import { useEffect, useState } from "react";
import { abrirModal, convertTime, handleTextareaHeight } from "./functions";
import PostModal from "./PostModal";

function Post(props: IPost) {
    
    const [comentarios, setComentarios] = useState<IComent[]>([]);
    
    useEffect(() => {
        const postsRef = dbDoc('posts', props.id);
        const commentsCol = dbSubCollection(postsRef, 'comentarios');
        const commentQuery = dbOrderBy(commentsCol, 'timestamp', 'asc');
        const unsubscribe = dbOnSnapshot(commentQuery, (querySnapshot) => {
        const comments: IComent[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as IComent["info"]
            comments.push({ id: doc.id, info: data });
        });
        setComentarios(comments);
        });
    }, [])

    const comentar = (id: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elementId = `comentario-${id}`;
        const currentCommentEl = document.getElementById(elementId) as HTMLTextAreaElement;
        const currentComment = currentCommentEl ? currentCommentEl.value : ''
        const postsRef = dbDoc('posts', id);
        const commentsCol = dbSubCollection(postsRef, 'comentarios')
        dbAdd(commentsCol, uuidv4(), {
            nome: props.user?.displayName,
            image: props.user?.photoURL,
            userId: props.user?.uid,
            comentario: currentComment,
            timestamp: serverTimestamp()
        });
        alert('Comentário postado com sucesso!');
        currentCommentEl.value = '';
    }
    
    return (
        <div className="postSingle">

            <PostModal post={props} comentarios={comentarios} />

            <div className="postHeader">
                <img src={props.info.profileImage} alt={props.info.userName} />
                <p><b>{props.info.userName}</b> • {convertTime(props.info.timestamp).toString()}</p>
                <p>•••</p>
            </div>
            <img onClick={(e) => abrirModal(e, `#modal-${props.id}`)} src={props.info.image} alt={props.id} />
            <p><b>{props.info.userName}</b>{props.info.titulo}</p>
            {comentarios.length ? 
                <div className="commentsNumber" onClick={(e) => abrirModal(e, `#modal-${props.id}`)}>{comentarios.length === 1 ? 'Ver 1 comentário' : 'Ver ' + comentarios.length + ' comentários'}</div>
            : <div></div>}
            {props.user?
                <form onSubmit={(e) => comentar(props.id, e)}>
                    <textarea id={`comentario-${props.id}`} placeholder="Adicione um comentário..." onChange={(e) => handleTextareaHeight(`submit-${props.id}`, e)}></textarea>
                    <input id={`submit-${props.id}`} type="submit" value="Comentar" />
                </form>
            : <div></div>}
        </div>
    )
}

export default Post