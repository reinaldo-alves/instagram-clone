import { dbAdd, dbDoc, dbOnSnapshot, dbOrderBy, dbSubCollection, serverTimestamp } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { IComent, ILike, IPost } from "./types"
import { useEffect, useState } from "react";
import { abrirModal, convertTime, curtir, fecharModal, handleTextareaHeight } from "./functions";
import PostModal from "./PostModal";
import emptyHeart from "./images/coracao.png"
import fullHeart from "./images/coracao1.png"
import commentIcon from "./images/comment.png"

function Post(props: IPost) {
    
    const [comentarios, setComentarios] = useState<IComent[]>([]);
    const [curtidas, setCurtidas] = useState<ILike[]>([]);
    
    useEffect(() => {
        const postsRef = dbDoc('posts', props.id);
        const commentsCol = dbSubCollection(postsRef, 'comentarios');
        const commentQuery = dbOrderBy(commentsCol, 'timestamp', 'asc');
        const unsubscribeCom = dbOnSnapshot(commentQuery, (querySnapshot) => {
        const comments: IComent[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as IComent["info"]
            comments.push({ id: doc.id, info: data });
        });
        setComentarios(comments);
        });
        const likeCol = dbSubCollection(postsRef, 'curtidas');
        const likeQuery = dbOrderBy(likeCol, 'timestamp', 'desc');
        const unsubscribeLik = dbOnSnapshot(likeQuery, (querySnapshot) => {
        const likes: ILike[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as ILike["info"]
            likes.push({ id: doc.id, info: data });
        });
        setCurtidas(likes);
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
            comentario: currentComment,
            timestamp: serverTimestamp()
        });
        alert('Comentário postado com sucesso!');
        currentCommentEl.value = '';
    }

    const jaCurtiu = curtidas.some((item: ILike) => item.info.userId === props.user?.uid)
   
    return (
        <div className="postSingle">

            <div className="modalLikes" id={`likesModal-${props.id}`}>
                <div onClick={() => fecharModal(`#likesModal-${props.id}`)} className="close-modal">X</div>
                <div className="formLikes">
                    <h2>Curtidas</h2>
                    <ul>
                        {curtidas.map((val) => (
                            <div key={val.id} className="commentBox" style={{alignItems: 'center'}}>
                                <img src={val.info.profileImage} alt={val.info.userName} />
                                <p><b>{val.info.userName}</b></p>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>

            <PostModal post={props} comentarios={comentarios} curtidas={curtidas} />

            <div className="postHeader">
                <img src={props.info.profileImage} alt={props.info.userName} />
                <p><b>{props.info.userName}</b> • {convertTime(props.info.timestamp).toString()}</p>
                <p>•••</p>
            </div>
            <img src={props.info.image} alt={props.id} />
            <div className="post-btn">
                <img id={`like-${props.id}`} onClick={(e) => curtir(props.id, e, props)} src={jaCurtiu? fullHeart : emptyHeart} alt="like" />
                <img onClick={(e) => abrirModal(e, `#modal-${props.id}`)} src={commentIcon} alt="comment" />
            </div>
            {curtidas.length ? 
                <div className="likedby" onClick={(e) => abrirModal(e, `#likesModal-${props.id}`)}>Curtido por <b>{curtidas[0].info.userName}</b>{curtidas.length > 1 ? ' e outros' : ''}</div>
            : <div></div>}
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