import { dbAdd, dbDoc, dbOnSnapshot, dbOrderBy, dbSubCollection, serverTimestamp } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { IComent, IPost } from "./types"
import { useEffect, useState } from "react";
import { abrirModal, convertTime, fecharModal } from "./functions";

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

    const comentar = (id: string, e: React.FormEvent<HTMLFormElement>, modal: boolean) => {
        e.preventDefault();
        const elementId = modal ? `comentarioModal-${id}` : `comentario-${id}`;
        const currentCommentEl = document.getElementById(elementId) as HTMLTextAreaElement;
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

    const handleTextareaHeight = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.target.style.height = '1em';
        e.target.style.height = e.target.scrollHeight + 'px';
        const submitEl = document.getElementById(id) as HTMLInputElement;
        if(!e.target.value) {
            submitEl.style.display = 'none'
        } else {
            submitEl.style.display = 'block'
        }
    }
    
    return (
        <div className="postSingle">

            <div className="modalPost" id={`modal-${props.id}`}>
                <div onClick={() => fecharModal(`#modal-${props.id}`)} className="close-modal">X</div>
                <div className="formPost">
                    <img src={props.info.image} alt={props.id} />
                    <div className="modalPostInfo">
                        <div className="postHeaderModal">
                            <img src={props.info.image} alt={props.info.userName} />
                            <p><b>{props.info.userName}</b></p>
                            <p>•••</p>
                        </div>
                        <div className="titleContainer">
                            <p><b>{props.info.userName}</b>{props.info.titulo}</p>
                            <p>{convertTime(props.info.timestamp).toString()}</p>
                        </div>
                        <div className="comments">
                            {comentarios ?
                                comentarios.map((val) => {
                                    return (
                                        <div key={val.id} className="comment-single">
                                            <p><b>{val.info.nome}</b>{val.info.comentario}</p>
                                            <p>{convertTime(val.info.timestamp).toString()}</p>
                                        </div>
                                    )
                                })
                            : ''}
                        </div>
                        {props.user?
                            <form onSubmit={(e) => comentar(props.id, e, true)}>
                                <textarea id={`comentarioModal-${props.id}`} placeholder="Adicione um comentário..." onChange={(e) => handleTextareaHeight(`submitModal-${props.id}`, e)}></textarea>
                                <input id={`submitModal-${props.id}`} type="submit" value="Comentar" />
                            </form>
                        : <div></div>}
                    </div>
                </div>
            </div>

            <div className="postHeader">
                <img src={props.info.image} alt={props.info.userName} />
                <p><b>{props.info.userName}</b> • {convertTime(props.info.timestamp).toString()}</p>
                <p>•••</p>
            </div>
            <img src={props.info.image} alt={props.id} />
            <p><b>{props.info.userName}</b>{props.info.titulo}</p>
            {comentarios.length ? 
                <div className="commentsNumber" onClick={(e) => abrirModal(e, `#modal-${props.id}`)}>{comentarios.length === 1 ? 'Ver 1 comentário' : 'Ver ' + comentarios.length + ' comentários'}</div>
            : <div></div>}
            {props.user?
                <form onSubmit={(e) => comentar(props.id, e, false)}>
                    <textarea id={`comentario-${props.id}`} placeholder="Adicione um comentário..." onChange={(e) => handleTextareaHeight(`submit-${props.id}`, e)}></textarea>
                    <input id={`submit-${props.id}`} type="submit" value="Comentar" />
                </form>
            : <div></div>}
        </div>
    )
}

export default Post