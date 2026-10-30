# Controle Inteligente de Estoque

Aplicação web para cadastrar, acompanhar e organizar os produtos de um estoque. Feita com HTML, CSS e JavaScript puros, sem bibliotecas ou frameworks.

## Funcionalidades

- **Cadastro de produtos** com nome, categoria, quantidade, quantidade mínima e preço unitário
- **Edição e exclusão** de produtos, com botão para cancelar a edição e confirmação antes de excluir
- **Validação dos dados**, impedindo nomes repetidos, quantidades negativas ou não inteiras e preços menores ou iguais a zero
- **Mensagens de sucesso e erro** após cada ação
- **Indicadores** com o total de produtos, os produtos sem estoque, os produtos em estoque crítico e o valor total do estoque
- **Situação do estoque** de cada produto:
  - *Sem estoque*: quantidade igual a zero
  - *Estoque crítico*: quantidade maior que zero e menor ou igual à quantidade mínima
  - *Estoque normal*: quantidade acima da quantidade mínima
- **Pesquisa** de produtos pelo nome
- **Filtros** por categoria e por situação do estoque
- **Ordenação** por nome, quantidade ou preço
- **Produtos prioritários**: lista dos 5 produtos com menor quantidade
- **Dados salvos no navegador** (`localStorage`), que continuam disponíveis depois de fechar a página
- **Layout responsivo** para computador, tablet e celular

## Como executar

1. Clone o repositório:

   ```bash
   git clone git@github.com:vitordanielsilvaleao-png/controle-estoque.git
   ```

2. Abra o arquivo `index.html` no navegador.

Não é preciso instalar nada.

## Estrutura do projeto

```
controle-estoque/
├── index.html      # Estrutura da página
├── css/
│   └── style.css   # Estilos e responsividade
└── js/
    └── script.js   # Regras de negócio e manipulação do DOM
```

## Tecnologias

- HTML5
- CSS3 (Grid, Flexbox e media queries)
- JavaScript (manipulação do DOM, métodos de array como `map()`, `filter()`, `reduce()`, `find()` e `sort()`, `Intl.NumberFormat` e `localStorage`)

## Observação

Os produtos ficam salvos apenas no navegador em que foram cadastrados. Limpar os dados do navegador ou abrir a página em outro navegador ou computador mostra a lista vazia.
