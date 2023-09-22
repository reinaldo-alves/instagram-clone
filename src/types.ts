export interface IPost {
    id: string,
    info: {
      image: string,
      timestamp: any,
      titulo: string,
      userName: string
    },
    user?: string | null
  }

export interface IComent {
  id: string,
  info: {
    nome: string,
    comentario: string
  }
}