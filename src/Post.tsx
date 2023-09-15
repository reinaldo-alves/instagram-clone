import { IPost } from "./types"

function Post(props: IPost) {
    
    const comentar = (id: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(id)
    }
    
    return (
        <div className="postSingle">
            <img src={props.info.image} alt={props.id} />
            <p><b>{props.info.userName}</b>: {props.info.titulo}</p>
            <form onSubmit={(e) => comentar(props.id, e)}>
            <textarea></textarea>
            <input type="submit" value="Comentar!" />
            </form>
        </div>
    )
}

export default Post