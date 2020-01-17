import React , { useEffect , useState }from 'react';

import api from './services/api';

import './global.css';
import './app.css';
import './sidebar.css';
import './main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {
  
  const [devs,setDevs] = useState([]);

  async function handleAddDev(data){
    const response = await api.post('/devs',data)
    setDevs([...devs,response.data])
  }

  useEffect(()=>{
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs()
  },[]);

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onsubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev =>(
              <DevItem key={dev.github_username}dev={dev}/>
            ))}

        </ul>
      </main>
    </div>
  );
}

export default App;
