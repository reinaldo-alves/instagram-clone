import { useState } from 'react';
import { authCreate, authSignIn, authUpdate, storageRef, storagePut, getURL, dbCollection, dbAdd, serverTimestamp } from './firebase'
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    user: any
    setUser: React.Dispatch<React.SetStateAction<any>>
}

function Header(props: IProps) {
    
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    
    function abrirModalCriarConta(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>){
        e.preventDefault();
        const modal = document.querySelector('.modalCriarConta') as HTMLElement;
        if(modal){
            modal.style.display = 'block';
        }
    }

    function abrirModalUpload(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>){
        e.preventDefault();
        const modal = document.querySelector('.modalUpload') as HTMLElement;
        if(modal){
            modal.style.display = 'block';
        }
    }

    function fecharModalCriar() {
        const modal = document.querySelector('.modalCriarConta') as HTMLElement;
        if(modal){
            modal.style.display = 'none';
        }
    }

    function fecharModalUpload() {
        const modal = document.querySelector('.modalUpload') as HTMLElement;
        if(modal){
            modal.style.display = 'none';
        }
    }

    function criarConta(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const emailInput = document.getElementById('email-cadastro') as HTMLInputElement;
        const usernameInput = document.getElementById('username-cadastro') as HTMLInputElement;
        const senhaInput = document.getElementById('senha-cadastro') as HTMLInputElement;
        const email = emailInput? emailInput.value : '';
        const username = usernameInput? usernameInput.value: '';
        const senha = senhaInput? senhaInput.value: '';
        authCreate(email, senha)
            .then((authUser) => {
                authUpdate(authUser.user, {
                    displayName: username
                })
                alert('Conta criada com sucesso!');
                fecharModalCriar();
            })
            .catch((error) => {
                alert(error.message)
            });
    }

    function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const emailInput = document.getElementById('email-login') as HTMLInputElement;
        const senhaInput = document.getElementById('senha-login') as HTMLInputElement;
        const email = emailInput? emailInput.value : '';
        const senha = senhaInput? senhaInput.value: '';
        authSignIn(email, senha)
            .then((auth) => {
                props.setUser(auth.user.displayName);
                alert(`Usuário ${auth.user.displayName} logado com sucesso!`)                
            })
            .catch((error) => {
                alert(error.message)
            });
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
                })
            })

        }

    }
    
    return (
        <header>
            <div className="modalCriarConta">
                <div className="formCriarConta">
                    <div onClick={() => fecharModalCriar()} className="close-modal">X</div>
                    <h2>Criar Conta</h2>
                    <form onSubmit={(e) => criarConta(e)}>
                        <input id='email-cadastro' type="text" placeholder='Seu e-mail...' />
                        <input id='username-cadastro' type="text" placeholder='Seu username...' />
                        <input id='senha-cadastro' type="password" placeholder='Sua senha...' />
                        <input type="submit" value='Criar Conta!' />
                    </form>
                </div>
            </div>

            <div className="modalUpload">
                <div className="formUpload">
                    <div onClick={() => fecharModalUpload()} className="close-modal">X</div>
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
            {props.user ? 
                <div className='header_logadoInfo'>
                <span>Olá, <b>{props.user}</b></span>
                <a onClick={(e) => abrirModalUpload(e)} href="#">Postar!</a>
                </div>
            :  
                <div className="header_loginForm">
                <form onSubmit={(e) => handleLogin(e)}>
                    <input id='email-login' type="text" placeholder='Login...' />
                    <input id='senha-login' type="password" placeholder='Senha...' />
                    <input type="submit" name='action' placeholder='Entrar!' />
                </form>
                <div className="btn_criarConta">
                    <a onClick={(e) => abrirModalCriarConta(e)} href="#">Criar Conta!</a>
                </div>
                </div>
            }
            </div>
        </header> 
    )
}

export default Header