import { useState } from 'react';
import { storageRef, storagePut, getURL, dbCollection, dbAdd, serverTimestamp, authSignOut } from './firebase'
import { v4 as uuidv4 } from 'uuid';
import { abrirModal, fecharModal } from './functions';
import { User } from 'firebase/auth';
import { GoHome } from "react-icons/go";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

interface IProps {
    user: User
    setUser: React.Dispatch<React.SetStateAction<any>>
    setShowProfile: React.Dispatch<React.SetStateAction<boolean>>
}

function Header(props: IProps) {
    
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    function handleLogout(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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
                        userName: props.user.displayName,
                        profileImage: props.user.photoURL,
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
        } else {
            alert('Adicione uma imagem válida')
        }
    }
    
    return (
        <aside>
            <div className="modalUpload">
                <div onClick={() => fecharModal('.modalUpload')} className="close-modal">X</div>
                <div className="formUpload">
                    <h2>Postar Foto</h2>
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
                    <a className='logo-name' href='/'><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='Instagram' /></a>
                    <a className='logo-pict' href='/'><img src='https://w7.pngwing.com/pngs/309/975/png-transparent-instagram-instagram-logo-logo-instagram-icon-thumbnail.png' alt='Instagram' /></a>
                </div>
                <div className='header_icons'>
                    <div className="option-item" onClick={() => props.setShowProfile(false)}>
                        <GoHome />
                        <span>Home</span>
                    </div>
                    <div className="option-item" onClick={(e) => abrirModal(e, '.modalUpload')} >
                        <FaRegPlusSquare />
                        <span>Postar</span>
                    </div>
                    <div className="option-item" onClick={(e) => handleLogout(e)} >
                        <MdLogout />
                        <span>Sair</span>
                    </div>
                    <div className="option-item" onClick={() => props.setShowProfile(true)}>
                        <img src={props.user.photoURL || ''} alt={props.user.displayName || ''} />
                        <span>Perfil</span>
                    </div>
                </div>
            </div>
        </aside> 
    )
}

export default Header