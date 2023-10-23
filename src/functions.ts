import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { IPost } from "./types";
import fullHeart from "./images/coracao1.png"
import { dbAdd, dbDoc, dbSubCollection, serverTimestamp } from "./firebase";

export function convertTime(time: {seconds: number, nanoseconds: number}) {
    const now = moment();
    const convTime = time ? new Date(time.seconds * 1000) : new Date();
    const diffDays = now.diff(convTime, 'days');
    
    if (diffDays <= 0) {
        const diffHours = now.diff(convTime, 'hours');
        const diffMinutes = now.diff(convTime, 'minutes');
        if (diffMinutes <= 1) {
            return 'agora';
        } else if (diffHours <= 1) {
            return `${diffMinutes}min`
        } else {
            return `${diffHours}h`;
        }  
    } else if (diffDays <= 7) {
        return `${diffDays}d`
    } else {
        const formattedDate = convTime.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'});
        return formattedDate
    }
}

export function fecharModal(selector: string) {
    const modal = document.querySelector(selector) as HTMLElement;
    if(modal){
        modal.style.display = 'none';
    }
}

export function abrirModal(e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>, selector: string){
    e.preventDefault();
    const modal = document.querySelector(selector) as HTMLElement;
    if(modal){
        modal.style.display = 'block';
    }
}

export const handleTextareaHeight = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

export const curtir = (id: string, e: React.MouseEvent<HTMLImageElement, MouseEvent>, post: IPost) => {
    e.preventDefault();
    const elementId = `like-${id}`;
    const elementModalId = `likeModal-${id}`;
    const heartEl = document.getElementById(elementId) as HTMLImageElement;
    const heartModalEl = document.getElementById(elementModalId) as HTMLImageElement;
    if (heartEl.src !== fullHeart || heartModalEl.src !== fullHeart) {
        const postsRef = dbDoc('posts', id);
        const likeCol = dbSubCollection(postsRef, 'curtidas')
        dbAdd(likeCol, uuidv4(), {
            userName: post.user?.displayName,
            userId: post.user?.uid,
            profileImage: post.user?.photoURL,
            timestamp: serverTimestamp()
        });
        heartEl.src = fullHeart;
        heartModalEl.src = fullHeart;
    }
}