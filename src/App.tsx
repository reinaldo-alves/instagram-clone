import './App.css';
import { useEffect, useState } from 'react';
import Header from './Header';
import Post from './Post'
import { authOnStateChanged, dbCollection, dbOnSnapshot, dbOrderBy } from './firebase';
import { IPost } from './types';

function App() {

  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState([] as Array<IPost>);

  useEffect(() => {
    authOnStateChanged((val) => {
      if(val !== null) {
        setUser(val.displayName)
      }
    })
    const dbQuery = dbOrderBy(dbCollection("posts"), 'timestamp', 'desc');
    const unsubscribe = dbOnSnapshot(dbQuery, (querySnapshot) => {
      const posts: IPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as IPost["info"]
        posts.push({ id: doc.id, info: data });
      });
      setPosts(posts);
    });
  }, [])

  return (
    <div className="App">
      <Header user={user} setUser={setUser}/>
      {
        posts.map((val) => {
          return (
            <Post key={val.id} user={user} info={val.info} id={val.id} />
          )
        })
      }
    </div>
  );
}

export default App;

//Corrigir deformação da imagem no modal da postagem (pegar dicas no youtube clone)