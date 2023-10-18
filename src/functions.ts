import moment from "moment";

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
