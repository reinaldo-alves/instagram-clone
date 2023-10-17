import { useState } from 'react';
import { storageRef, storagePut, getURL, dbCollection, dbAdd, serverTimestamp, authSignOut } from './firebase'
import { v4 as uuidv4 } from 'uuid';
import { abrirModal, fecharModal } from './functions';

interface IProps {
    user: any
    setUser: React.Dispatch<React.SetStateAction<any>>
}

function Header(props: IProps) {
    
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    function handleLogout(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        authSignOut((val) => {
            props.setUser(null);
            alert('Você escolheu sair!');
            window.location.href = '/';
        })
    }

    function uploadPost(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const tituloPostInput = document.getElementById('titulo-upload') as HTMLInputElement;
        const tituloPost = tituloPostInput? tituloPostInput.value : '';
        if(file) {
            const uploadStorage = storageRef(`images/${file.name}`);
            const uploadTask = storagePut(uploadStorage, file)
            uploadTask.on('state_changed', (snapshot) => {
                const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                setProgress(progress);
            }, (error) => {console.log(error)}, () => {
                getURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const postsRef = dbCollection('posts');
                    dbAdd(postsRef, uuidv4(), {
                        titulo: tituloPost,
                        image: downloadURL,
                        userName: props.user,
                        timestamp: serverTimestamp()
                    })
                    setProgress(0);
                    setFile(null);
                    alert('Upload realizado com sucesso!')
                    const formUpload = document.getElementById('form-upload') as HTMLFormElement;
                    if(formUpload){
                        formUpload.reset();
                    }
                    fecharModal('.modalUpload');
                })
            })

        }

    }
    
    return (
        <header>
            <div className="modalUpload">
                <div onClick={() => fecharModal('.modalUpload')} className="close-modal">X</div>
                <div className="formUpload">
                    <h2>Fazer Upload</h2>
                    <form id='form-upload' onSubmit={(e) => uploadPost(e)}>
                        <progress id='progress-upload' value={progress}></progress>
                        <input id='titulo-upload' type="text" placeholder='Nome da sua foto...' />
                        <input onChange={(e) => setFile(e.target.files? e.target.files[0] : null)} type="file" name='file' />
                        <input type="submit" value='Postar no Instagram!' />
                    </form>
                </div>
            </div>
            
            <div className="center">
                <div className="header_logo">
                    <a href=''><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' /></a>
                </div>
                <div className='header_logadoInfo'>
                    <span>Olá, <b>{props.user}</b></span>
                    <a onClick={(e) => abrirModal(e, '.modalUpload')} href="#">Postar!</a>
                    <a onClick={(e) => handleLogout(e)} href="#">Sair</a>
                </div>
            </div>
        </header> 
    )
}

export default Header