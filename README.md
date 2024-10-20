# Este projeto é um sistema simples de gestão de biblioteca desenvolvido usando HTML, CSS e JavaScript. O objetivo é fornecer uma interface web onde usuários podem gerenciar itens da biblioteca (livros, revistas e DVDs), usuários (alunos, professores e visitantes), e realizar empréstimos e devoluções.

Funcionalidades
- Gerenciamento de Itens
- Adicionar novos itens (livros, revistas, DVDs) à biblioteca.
- Listar itens disponíveis com informações como título, autor/diretor, tipo, ano de publicação, quantidade disponível.
- Botão para realizar empréstimos.
- Gerenciamento de Usuários
- Adicionar novos usuários (alunos, professores, visitantes).
- Listar usuários com o número de empréstimos realizados.
- Empréstimos e Devoluções
- Registrar novos empréstimos, verificando a disponibilidade do item e o limite de empréstimos permitido para cada tipo de usuário.
- Calcular automaticamente o prazo de devolução com base no tipo de usuário (15 dias para alunos, 30 dias para professores).
- Gerir a devolução de itens, atualizando a quantidade disponível e o número de empréstimos do usuário.
- Calcular multas em caso de atraso na devolução.
  
**Estrutura dos Arquivos**

*index.html*
Este arquivo HTML contém a estrutura principal do sistema, incluindo:
- Seções para gerenciamento de itens, usuários e empréstimos.
- Formulários para adicionar novos itens e usuários.
- Tabelas para listar itens e empréstimos.

*style.css*
- Este arquivo CSS estiliza a interface, tornando-a responsiva e visualmente atraente. Usamos Flexbox e cores distintas para categorizar itens e melhorar a experiência do usuário.

*script.js*
- Este arquivo JavaScript gerencia a lógica do sistema, incluindo adição de itens e usuários, registro de empréstimos, devoluções e cálculo de multas.
