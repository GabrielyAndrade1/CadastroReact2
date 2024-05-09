import { useEffect, useRef, useState } from "react";

function Tarefas() {
    const [listaTarefas, setListaTarefas] = useState(pegaTarefasCadastradas);
    const [descricaoEditada, setDescricaoEditada]= useState("");
    const [indiceEditado, setIndiceEditado]=useState(null);
    const descricaoTarefaInputRef = useRef();

    // console.log(listaTarefas);
    function pegaTarefasCadastradas() {
        let tarefasLocalStorage = JSON.parse(localStorage.getItem("tarefa"));
        if (!tarefasLocalStorage) {
            tarefasLocalStorage = [];
        }
        return tarefasLocalStorage;
    }

    function adicionarTarefa() {
        console.log(descricaoTarefaInputRef.current.value);
        // let tarefasCadastradas = pegaTarefasCadastradas();
        listaTarefas.push(
            {
                descricao: descricaoTarefaInputRef.current.value,
                finalizado: false
            }
        );

        // tarefasCadastradas.push(listaTarefas);
        localStorage.setItem("tarefa", JSON.stringify(listaTarefas));
        descricaoTarefaInputRef.current.value = "";
        setListaTarefas(listaTarefas.slice());
        console.log('Cadastrado');
    }

    function atualizarTarefa(tarefaAtual) {
        tarefaAtual.finalizado = !tarefaAtual.finalizado;
        setListaTarefas(listaTarefas.slice());
    }

    function pegaEstilo(tarefaAtual) {
        if (tarefaAtual.finalizado) {
            return 'line-through';
        }
        return 'none';
    }

    function apagar(id){
        const novasTarefas = listaTarefas.filter(tarefa => tarefa.id !== id);
        novasTarefas.splice(id,1);
        localStorage.setItem('tarefa',JSON.stringify(novasTarefas));
        location.reload();
    }
    
    function editar(id) {
        const tarefaSelecionada = listaTarefas.find((_, index) => index === id);
        if (tarefaSelecionada) {
            setDescricaoEditada(tarefaSelecionada.descricao);
            setIndiceEditado(id);
        }
    }
    
    function salvarEdicao() {
        if (indiceEditado !== null) {
            const novasTarefas = listaTarefas.map((tarefa, index) => {
                if (index === indiceEditado) {
                    return { ...tarefa, descricao: descricaoEditada };
                }
                return tarefa;
            });
            setListaTarefas(novasTarefas);
            localStorage.setItem('tarefa', JSON.stringify(novasTarefas));
            setIndiceEditado(null);
            setDescricaoEditada("");
        }
    }
    

    return (
        <div>
            <input type = "text" ref={descricaoTarefaInputRef} value = {descricaoEditada} onChange={(e)=> setDescricaoEditada(e.target.value)}/>
            <button style={{ margin: '5px', backgroundColor: 'white', color:'black' }} onClick={adicionarTarefa}>Cadastrar</button>
            <button style={{ margin: '5px', backgroundColor: 'white', color: 'black' }} onClick={salvarEdicao}>Salvar</button>
            <br />
            <div>
                {
                    listaTarefas.map((tarefaAtual, id) => {
                        return <div style={
                            {
                                margin: '10px',
                                color: 'white',
                                backgroundColor: 'purple',
                                textDecoration: pegaEstilo(tarefaAtual)
                            }
                        } onClick={() => atualizarTarefa(tarefaAtual)} key={id}>{tarefaAtual.descricao}
                        <button style={{ margin: '5px' , backgroundColor:'white',color:'black'}} onClick={()=> editar(id)}>Editar</button>
                        <button style={{ margin: '5px', backgroundColor:'white', color: 'black'}} onClick={()=> apagar(id)}>Apagar</button>
                        </div>
                    }) 
                }
            </div>
        </div>
    );
}
export default Tarefas;