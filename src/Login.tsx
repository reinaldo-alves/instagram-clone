import { authCreate, authSignIn, authUpdate } from './firebase'
import { abrirModal, fecharModal } from './functions';

interface IProps {
    user: any
    setUser: React.Dispatch<React.SetStateAction<any>>
}

function Login(props: IProps) {
    
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
                fecharModal('.modalCriarConta');
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
                alert(`Usuário ${auth.user.displayName} logado com sucesso!`);
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
                            <input id='email-cadastro' type="text" placeholder='Seu e-mail...' />
                            <input id='username-cadastro' type="text" placeholder='Seu username...' />
                            <input id='senha-cadastro' type="password" placeholder='Sua senha...' />
                            <input type="submit" value='Criar Conta!' />
                        </form>
                    </div>
                </div>
                
                <div className="imageLogin">
                    <img src="https://gifs.eco.br/wp-content/uploads/2023/07/imagens-de-celular-instagram-png-1.png" alt="celular" />
                </div>
                <div className="dataLogin">
                    <div className="formLogin">
                        <img src='https://freelogopng.com/images/all_img/1658587465instagram-name-logo.png' />
                        <form onSubmit={(e) => handleLogin(e)}>
                            <input id='email-login' type="text" placeholder='E-mail' />
                            <input id='senha-login' type="password" placeholder='Senha' />
                            <input type="submit" name='action' value='Entrar' />
                        </form>
                    </div>
                    <div className='formSignup'>Não tem uma conta? <a onClick={(e) => abrirModal(e, '.modalCriarConta')} href="#">Cadastre-se</a></div>
                </div>
            </div> 
            <footer>©2023 Desenvolvido por Reinaldo Alves - Todos os direitos reservados</footer>
        </>
    )
}

export default Login