# Revisão do Sistema de Antônio Pedro do Nascimento Neto

 <b> 1. O sistema está funcionando com as funcionalidades solicitadas? </b>
	<p> Sim, sistema está com o crud alinhado para questões e provas. Questões estão faltando campo para descrição, e faltando indicação se dever ser marcada dou não pelo o aluno. Geração de pdf um pouco escondida mas funcional. Botao de imprimir prova esta imprimindo a pagina html e não somente a prova. </p>

<b> 2. Quais os problemas de qualidade do código e dos testes? </b>
	
    <p>Codigos sem exceptionhandlers, LLM não gerou tratativas de erro. Metodos parecem estar bem escritos. LLM misturou inglê com portugues na hora de escrever os codigos, acredito que por conta da estrutura dos prompts terem sidos em portuuges. Testes com gherkin foram feitos somentes no backend. O colega criou arquivos .bat para executar e testar, tentei localmente e não consegui roda-los. </p>

<b> 3. Como a funcionalidade e a qualidade desse sistema pode ser comparada com as do seu </b>
	
    <p>Meu colega estruturou os prompts inteiramente em português, eu adaptei o prompt sugerido pelo professor e pedi para o gemini reescrever, com apenas um 1 prompt o sistema já estava funcional, meu colega aparenta ter utilizado mais prompts para deixar o sistema funcional. Eu utilizei o next.js com tailwindcss, meu front parece está um pouco mais organizado que o meu colega. Quantos aos handlers, meu agente implementou sozinho sem que eu pedisse para ele fazer  </p>


### HISTÓRICO DO DESENVOLVIMENTO

1. Estratégias de interação utilizada
    <p>Prompts mais simples e escritos em português, organização do repositório ficou um pouco confusa.</p>
2. Situações em que o agente funcionou melhor ou pior
    <p>Na criação do projeto parece ter funcionado bem, na correção do que foi desenvolvido, o agente parece alucinar ou perder o contexto.</p>
3. Tipos de problemas observados (por exemplo, código incorreto ou inconsistências)
    <p>Na planilha do meu colega, ele relata muito que a correção feita pelo agetne não foi efetiva, também retorna que alguns códigos gerados não funcionaram. </p>
4. Avaliação geral da utilidade do agente no desenvolvimento
    <p>Parece ter relativamente contribuído com o desenvolvimento do colega, mas não foi nada de grande ajuda.</p>
5. Comparação com a sua experiência de uso do agente
    <p>Acredito que eu tive uma experiência mais positiva, não tive os mesmos erros de funcionalidades. Meu agente sempre que fazia uma alteração, ele buildava novamente o sistema para encontrar erros e já corrigia automaticamente. Todos meus prompts tiveram alterações válidas.</p>