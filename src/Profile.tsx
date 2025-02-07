import { alternarAbas } from './functions';
import { IoMdGrid } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { BsGearWide } from "react-icons/bs";
import { GoTag } from "react-icons/go";
import { FiAlertCircle } from "react-icons/fi";
import { IPost } from './types';
import { User } from 'firebase/auth';

interface IProps {
    user: User
    posts: Array<IPost>
    showProfile: boolean
    setShowProfile: React.Dispatch<React.SetStateAction<boolean>>
}

function Profile(props: IProps) {
       
    const userPostsArray = props.posts.filter((item: IPost) => item.info.email === props.user.email);

    const postNumber = userPostsArray.length
    
    return (
        <>
            <section className='perfil-descricao'>
                <div className='center'>
                    <div className='img-perfil-wraper'>
                        <img className='img-perfil' src={props.user.photoURL || ''} alt={props.user.email?.split('@')[0] || ''} />
                    </div>
                    <div className='texto-perfil'>
                        <div className='nome-perfil'>
                            <span>{props.user.email?.split('@')[0]}</span>
                            <div className='perfil-buttons'>
                                <a className='btn-primario' href="#">Editar Perfil</a>
                                <a className='icon' href="#"><BsGearWide /></a>
                            </div>
                        </div>
                    </div>
                    <br /><br />
                    <div className='info-perfil'>
                        <p><b>{Number(postNumber)}</b> publicações</p>
                        <p><b>500</b> seguidores</p>
                        <p><b>90</b> seguindo</p>
                    </div>
                    <div className='descricao-perfil'>
                        <h3>{props.user.displayName},</h3>
                        <p>Este é o seu perfil no Instagram. Aproveite!</p>
                    </div>
                    <div className='clear'></div>
                </div>
            </section>

            <section className='feed'>
                <div className='center'>
                    <div className='line-feed'>
                        <div id='line-publicacoes' className='single-line-name' onClick={(e) => alternarAbas('line-publicacoes')}>
                            <div style={{display: 'block', width: '100px'}} className='line-marcacao'></div>
                            <div className='title-wraper' style={{fontWeight: 'bold'}}>
                                <IoMdGrid />
                                <p>Publicações</p>
                            </div>
                        </div>
                        <div id='line-salvos' className='single-line-name' onClick={(e) => alternarAbas('line-salvos')}>
                            <div style={{width: '65px'}} className='line-marcacao'></div>
                            <div className='title-wraper'>
                                <CiBookmark />
                                <p>Salvos</p>
                            </div>
                        </div>
                        <div id='line-marcados' className='single-line-name' onClick={(e) => alternarAbas('line-marcados')}>
                            <div style={{width: '88px'}} className='line-marcacao'></div>
                            <div className='title-wraper'>
                                <GoTag />
                                <p>Marcados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='profile-posts' id='publicacoes'>
                <div className='center'>
                    {!postNumber?
                        <div className='sem-publicacoes'>
                            <FiAlertCircle />
                            <p>Não há publicações</p>
                        </div>
                    :
                        userPostsArray.map((item: IPost, index: number) => (
                            <div key={index} className='publicacao-single'>
                                <img src={item.info.image} alt={item.id} />
                            </div>
                        ))
                    }
                </div>
            </section>

            <section className='profile-posts' id='salvos'>
                <div className='center'>
                    <div className='sem-publicacoes'>
                        <FiAlertCircle />
                        <p>Não há publicações salvas</p>
                    </div>
                </div>
            </section>

            <section className='profile-posts' id='marcados'>
                <div className='center'>
                <div className='sem-publicacoes'>
                        <FiAlertCircle />
                        <p>Não há publicações marcadas</p>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Profile