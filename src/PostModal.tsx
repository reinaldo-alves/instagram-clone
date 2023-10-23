import { dbAdd, dbDoc, dbSubCollection, serverTimestamp } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { IComent, ILike, IPost } from "./types"
import { abrirModal, convertTime, curtir, fecharModal, handleTextareaHeight } from "./functions";
import emptyHeart from "./images/coracao.png"
import fullHeart from "./images/coracao1.png"
import commentIcon from "./images/comment.png"

interface IProps {
    post: IPost,
    comentarios: Array<IComent>,
    curtidas: Array<ILike>
}

function PostModal(props: IProps) {

    const comentar = (id: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elementId = `comentarioModal-${id}`;
        const currentCommentEl = document.getElementById(elementId) as HTMLTextAreaElement;
        const currentComment = currentCommentEl ? currentCommentEl.value : ''
        const postsRef = dbDoc('posts', id);
        const commentsCol = dbSubCollection(postsRef, 'comentarios')
        dbAdd(commentsCol, uuidv4(), {
            nome: props.post.user?.displayName,
            image: props.post.user?.photoURL,
            userId: props.post.user?.uid,
            comentario: currentComment,
            timestamp: serverTimestamp()
        });
        alert('Comentário postado com sucesso!');
        currentCommentEl.value = '';
    }

    const jaCurtiu = props.curtidas.some((item: ILike) => item.info.userId === props.post.user?.uid)
    
    return (
        <div className="modalPost" id={`modal-${props.post.id}`}>
            <div onClick={() => fecharModal(`#modal-${props.post.id}`)} className="close-modal">X</div>
            <div className="formPost">
                <img src={props.post.info.image} alt={props.post.id} />
                <div className="modalPostInfo">
                    <div className="postHeaderModal">
                        <img src={props.post.info.profileImage} alt={props.post.info.userName} />
                        <p><b>{props.post.info.userName}</b></p>
                        <p>•••</p>
                    </div>
                    <div style={{padding: '10px 0'}} className="commentBox">
                        <img src={props.post.info.profileImage} alt={props.post.info.userName} />
                        <div className="titleContainer">
                            <p><b>{props.post.info.userName}</b>{props.post.info.titulo}</p>
                            <p>{convertTime(props.post.info.timestamp).toString()}</p>
                        </div>
                    </div>
                    <div className="comments">
                        {props.comentarios ?
                            props.comentarios.map((val) => {
                                return (
                                    <div key={val.id} className="commentBox">
                                        <img src={val.info.image} alt={val.info.nome} />
                                        <div className="comment-single">
                                            <p><b>{val.info.nome}</b>{val.info.comentario}</p>
                                            <p>{convertTime(val.info.timestamp).toString()}</p>
                                        </div>
                                    </div>
                                )
                            })
                        : ''}
                    </div>
                    <div className="curtidaContainer">
                    <div className="post-btn">
                        <img id={`likeModal-${props.post.id}`} onClick={(e) => curtir(props.post.id, e, props.post)} src={jaCurtiu? fullHeart : emptyHeart} alt="like" />
                        <img src={commentIcon} alt="comment" />
                    </div>
                    {props.curtidas.length ? 
                        <div className="likedby" onClick={(e) => abrirModal(e, `#likesModal-${props.post.id}`)}>Curtido por <b>{props.curtidas[0].info.userName}</b>{props.curtidas.length > 1 ? ' e outros' : ''}</div>
                    : <div></div>}
                    </div>
                    {props.post.user?
                        <form onSubmit={(e) => comentar(props.post.id, e)}>
                            <textarea id={`comentarioModal-${props.post.id}`} placeholder="Adicione um comentário..." onChange={(e) => handleTextareaHeight(`submitModal-${props.post.id}`, e)}></textarea>
                            <input id={`submitModal-${props.post.id}`} type="submit" value="Comentar" />
                        </form>
                    : <div></div>}
                </div>
            </div>
        </div>
    )
}

export default PostModal