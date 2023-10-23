import { User } from 'firebase/auth';

export interface IPost {
  id: string,
  info: {
    image: string,
    timestamp: {
      seconds: number;
      nanoseconds: number;
    },
    titulo: string,
    userName: string,
    profileImage: string
  },
  user?: User | null
}

export interface IComent {
  id: string,
  info: {
    nome: string,
    image: string,
    comentario: string,
    timestamp: {
      seconds: number;
      nanoseconds: number;
    }
  }
}

export interface ILike {
  id: string,
  info: {
    userName: string,
    userId: string,
    profileImage: string,
    timestamp: {
      seconds: number;
      nanoseconds: number;
    }
  }
}