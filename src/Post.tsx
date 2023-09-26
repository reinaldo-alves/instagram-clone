import { dbAdd, dbDoc, dbOnSnapshot, dbOrderBy, dbSubCollection, serverTimestamp } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { IComent, IPost } from "./types"
import { useEffect, useState } from "react";

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
        const currentCommentEl = document.getElementById(`comentario-${id}`) as HTMLTextAreaElement;
        const currentComment = currentCommentEl ? currentCommentEl.value : ''
        const postsRef = dbDoc('posts', id);
        const commentsCol = dbSubCollection(postsRef, 'comentarios')
        dbAdd(commentsCol, uuidv4(), {
            nome: props.user,
            comentario: currentComment,
            timestamp: serverTimestamp()
        });
        alert('Comentário postado com sucesso!');
        currentCommentEl.value = '';
    }
    
    return (
        <div className="postSingle">
            <img src={props.info.image} alt={props.id} />
            <p><b>{props.info.userName}</b>: {props.info.titulo}</p>
            <div className="comments">
                {comentarios.length? <h2>Últimos Comentários:</h2> : <div></div>}
                {comentarios ?
                    comentarios.map((val) => {
                        return (
                            <div className="comment-single">
                                <p><b>{val.info.nome}</b>: {val.info.comentario}</p>
                            </div>
                        )
                    })
                : ''} 
            </div>
            {props.user?
                <form onSubmit={(e) => comentar(props.id, e)}>
                    <textarea id={`comentario-${props.id}`}></textarea>
                    <input type="submit" value="Comentar!" />
                </form>
            : <div></div>}
        </div>
    )
}

export default Post