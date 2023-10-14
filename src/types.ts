export interface IPost {
    id: string,
    info: {
      image: string,
      timestamp: {
        seconds: number;
        nanoseconds: number;
      },
      titulo: string,
      userName: string
    },
    user?: string | null
  }

export interface IComent {
  id: string,
  info: {
    nome: string,
    comentario: string,
    timestamp: {
      seconds: number;
      nanoseconds: number;
    }
  }
}