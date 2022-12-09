import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './formulario';
import Tabela from './tabela';

function App() {

  //Objeto produto
  const produto = {
    codigo : 0,
    nome : "",
    marca : ""
  }

  //UseState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  //UseEffect
  useEffect(()=>{
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())
    .then(retornoConvertido => setProdutos(retornoConvertido));
  }, []);

  //Obtendo os dados do formulário
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name]:e.target.value})
  }

  //Cadastrar produto
  const cadastrar = () => {
    fetch("http://localhost:8080/cadastrar",{
      method:"post",
      body:JSON.stringify(objProduto),
      headers:{
        "Content-type":"application/json",
        "Accept":"application/json"
      }
    })
    .then(retorno => retorno.json())
    .then(retornoConvertido => {
      if(retornoConvertido.mensagem !== undefined){
        alert(retornoConvertido.mensagem);
      }else{
        setProdutos([...produtos, retornoConvertido]);
        alert("Produto cadastrado com sucesso");
      }
    })
  }

  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar}/>
      <Tabela vetor={produtos}/>
    </div>
  );
}

export default App;
