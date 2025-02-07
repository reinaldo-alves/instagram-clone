import { useState } from 'react';
import { authCreate, authSignIn, authUpdate, getURL, storagePut, storageRef } from './firebase'
import { abrirModal, fecharModal } from './functions';

interface IProps {
    user: any
    setUser: React.Dispatch<React.SetStateAction<any>>
}

function Login(props: IProps) {
    
    const [file, setFile] = useState<File | null>(null);
    
    function criarConta(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const emailInput = document.getElementById('email-cadastro') as HTMLInputElement;
        const usernameInput = document.getElementById('username-cadastro') as HTMLInputElement;
        const senhaInput = document.getElementById('senha-cadastro') as HTMLInputElement;
        const confsenhaInput = document.getElementById('confsenha-cadastro') as HTMLInputElement;
        const email = emailInput? emailInput.value : '';
        const username = usernameInput? usernameInput.value: '';
        const senha = senhaInput? senhaInput.value: '';
        const confsenha = confsenhaInput? confsenhaInput.value: '';
        if (!email || !username || !senha || !confsenha) {
            alert('Preencha todos os campos corretamente') 
        } else if (senha !== confsenha) {
            alert('As senhas não são iguais')
            senhaInput.value = '';
            confsenhaInput.value = '';
        } else {
            if(file) {
                const uploadStorage = storageRef(`profile/${file.name}`);
                const uploadTask = storagePut(uploadStorage, file)
                uploadTask.on('state_changed', (snapshot) => {console.log(snapshot)}, (error) => {console.log(error)}, () => {
                    getURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        authCreate(email, senha)
                            .then((authUser) => {
                                authUpdate(authUser.user, {
                                    displayName: username,
                                    photoURL: downloadURL
                                })
                                setFile(null);
                                alert('Conta criada com sucesso!');
                                fecharModal('.modalCriarConta');
                            })
                            .catch((error) => {
                                alert(error.message)
                            });
                    })
                })
            } else {
                authCreate(email, senha)
                    .then((authUser) => {
                        authUpdate(authUser.user, {
                            displayName: username,
                            photoURL: 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
                        })
                        setFile(null);
                        alert('Conta criada com sucesso!');
                        fecharModal('.modalCriarConta');
                    })
                    .catch((error) => {
                        alert(error.message)
                    });
            }  
        }
    }

    function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const emailInput = document.getElementById('email-login') as HTMLInputElement;
        const senhaInput = document.getElementById('senha-login') as HTMLInputElement;
        const email = emailInput? emailInput.value : '';
        const senha = senhaInput? senhaInput.value: '';
        authSignIn(email, senha)
            .then((auth) => {
                props.setUser(auth.user);
                alert(`Usuário ${auth.user.email?.split('@')[0]} logado com sucesso!`);
                window.location.href = '/';          
            })
            .catch((error) => {
                alert(error.message)
            });
    }
    
    return (
        <>
            <div className='loginContent'>
                <div className="modalCriarConta">
                    <div onClick={() => fecharModal('.modalCriarConta')} className="close-modal">X</div>
                    <div className="formCriarConta">
                        <h2>Criar Conta</h2>
                        <form onSubmit={(e) => criarConta(e)}>
                            <input id='email-cadastro' type="text" placeholder='E-mail' />
                            <input id='username-cadastro' type="text" placeholder='Nome e sobrenome' />
                            <input id='senha-cadastro' type="password" placeholder='Senha' />
                            <input id='confsenha-cadastro' type="password" placeholder='Confirme sua senha' />
                            <span>Adicione uma foto de perfil (opcional)</span>
                            <input onChange={(e) => setFile(e.target.files? e.target.files[0] : null)} id='foto-cadastro' type="file" name="file" />
                            <input type="submit" value='Criar Conta!' />
                        </form>
                    </div>
                </div>
                
                <div className="imageLogin">
                    <img src="https://fael-atom.github.io/instagram-login-page/images/instagram-celular.png" alt="celular" />
                </div>
                <div className="dataLogin">
                    <div className="formLogin">
                        <img src='https://freelogopng.com/images/all_img/1658587465instagram-name-logo.png' alt='Instagram' />
                        <form onSubmit={(e) => handleLogin(e)}>
                            <input id='email-login' type="text" placeholder='E-mail' />
                            <input id='senha-login' type="password" placeholder='Senha' />
                            <input type="submit" name='action' value='Entrar' />
                        </form>
                    </div>
                    <div className='formSignup'>Não tem uma conta? <span onClick={(e) => abrirModal(e, '.modalCriarConta')}>Cadastre-se</span></div>
                </div>
            </div> 
            <footer>©2023 Desenvolvido por Reinaldo Alves - Todos os direitos reservados</footer>
        </>
    )
}

export default Login