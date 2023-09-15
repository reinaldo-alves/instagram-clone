import './App.css';
import { useEffect, useState } from 'react';
import Header from './Header';
import Post from './Post'
import { dbCollection, dbOnSnapshot, dbOrderBy } from './firebase';
import { IPost } from './types';

function App() {

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([] as Array<IPost>);

  useEffect(() => {
    const dbQuery = dbOrderBy(dbCollection("posts"), 'timestamp');
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
            <Post info={val.info} id={val.id} />
          )
        })
      }
    </div>
  );
}

export default App;