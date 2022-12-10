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
        limparFormulario();
      }
    })
  }

  //Alterar produto
  const alterar = () => {
    fetch("http://localhost:8080/alterar",{
      method:"put",
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
        alert("Produto alterado com sucesso");

        let vetorTemp = [...produtos];
        
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        })
        
        vetorTemp[indice] = objProduto;

        setProdutos(vetorTemp);

        limparFormulario();
      }
    })
  }

  //Remover produto
  const remover = () => {
    fetch("http://localhost:8080/remover/"+objProduto.codigo,{
      method:"delete",
      headers:{
        "Content-type":"application/json",
        "Accept":"application/json"
      }
    })
    .then(retorno => retorno.json())
    .then(retornoConvertido => {
        alert(retornoConvertido.mensagem);
        
        let vetorTemp = [...produtos];
        
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        })
        
        vetorTemp.splice(indice, 1);

        setProdutos(vetorTemp);

        limparFormulario();
    })
  }

  //Limpar formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //Selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar}/>
      <Tabela vetor={produtos} selecionar={selecionarProduto}/>
    </div>
  );
}

export default App;
