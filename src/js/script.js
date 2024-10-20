// Seleciona os formulários e elementos das listas de itens, usuários e empréstimos
document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const userForm = document.getElementById('userForm');
    const loanForm = document.getElementById('loanForm');
    const itemList = document.getElementById('itemList');
    const userList = document.getElementById('userList');
    const loanList = document.getElementById('loanList');
    const loanItemSelect = document.getElementById('loanItem');
    const loanUserSelect = document.getElementById('loanUser');

    // Arrays para armazenar os itens, usuários e empréstimos
    let items = [];
    let users = [];
    let loans = [];

    // Adiciona um evento de envio para o formulário de itens
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previne o comportamento padrão de envio do formulário
        // Obtém os valores dos campos do formulário
        const title = document.getElementById('itemTitle').value;
        const author = document.getElementById('itemAuthor').value;
        const year = document.getElementById('itemYear').value;
        const type = document.getElementById('itemType').value;
        const quantity = document.getElementById('itemQuantity').value;
        // Cria um novo item e adiciona ao array de itens
        const item = { id: items.length + 1, title, author, year, type, quantity: parseInt(quantity) };
        items.push(item);
        // Atualiza a lista de itens e limpa o formulário
        updateItems();
        itemForm.reset();
    });

    // Adiciona um evento de envio para o formulário de usuários
    userForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previne o comportamento padrão de envio do formulário
        // Obtém os valores dos campos do formulário
        const name = document.getElementById('userName').value;
        const type = document.getElementById('userType').value;
        // Cria um novo usuário e adiciona ao array de usuários
        const user = { id: users.length + 1, name, type, borrowedItems: 0 };
        users.push(user);
        // Atualiza a lista de usuários e limpa o formulário
        updateUsers();
        userForm.reset();
    });

    // Adiciona um evento de envio para o formulário de empréstimos
    loanForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previne o comportamento padrão de envio do formulário
        // Obtém os IDs dos itens e usuários selecionados
        const itemId = parseInt(loanItemSelect.value);
        const userId = parseInt(loanUserSelect.value);

        // Encontra o item e o usuário correspondentes aos IDs selecionados
        const item = items.find(i => i.id === itemId);
        const user = users.find(u => u.id === userId);

        // Verifica se o item e o usuário existem
        if (!item || !user) return;

        // Verifica se o item está disponível
        if (item.quantity < 1) {
            alert('Item indisponível');
            return;
        }

        // Verifica o limite de empréstimos do usuário
        const maxItems = user.type === 'Aluno' ? 3 : user.type === 'Professor' ? 5 : 0;
        if (user.borrowedItems >= maxItems) {
            alert(`${user.type} já atingiu o limite de empréstimos`);
            return;
        }

        // Atualiza a quantidade do item e o número de empréstimos do usuário
        item.quantity -= 1;
        user.borrowedItems += 1;
        
        // Calcula a data de devolução com base no tipo de usuário
        const returnDays = user.type === 'Aluno' ? 15 : user.type === 'Professor' ? 30 : 0;
        const loanDate = new Date();
        const returnDate = new Date(loanDate);
        returnDate.setDate(loanDate.getDate() + returnDays);    

        // Cria um novo empréstimo e adiciona ao array de empréstimos
        const loan = { id: loans.length + 1, itemId, userId, loanDate, returnDate };
        loans.push(loan);

        // Atualiza a lista de empréstimos e limpa o formulário
        updateLoans();
        loanForm.reset();
    });

    // Função para atualizar a lista de itens
    function updateItems() {
        itemList.innerHTML = ''; // Limpa a lista de itens
        loanItemSelect.innerHTML = '<option value="" disabled selected>Selecione um Item</option>';
        items.forEach(item => {
            // Cria uma nova linha na tabela de itens
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.title}</td>
                <td>${item.author}</td>
                <td data-type="${item.type}">${item.type}</td>
                <td>${item.year}</td>
                <td class="${item.quantity > 0 ? 'item-available' : 'item-unavailable'}">${item.quantity}</td>
                <td>
                    <button onclick="loanItem(${item.id})">Emprestar</button>
                </td>
            `;
            itemList.appendChild(tr);

            // Adiciona o item à lista de itens para empréstimo se estiver disponível
            if (item.quantity > 0) {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.title} (${item.type})`;
                loanItemSelect.appendChild(option);
            }
        });
    }

    // Função para atualizar a lista de usuários
    function updateUsers() {
        userList.innerHTML = ''; // Limpa a lista de usuários
        loanUserSelect.innerHTML = '<option value="" disabled selected>Selecione um Usuário</option>';
        users.forEach(user => {
            // Cria um novo item na lista de usuários
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.type}) - Empréstimos: ${user.borrowedItems}`;
            userList.appendChild(li);

            // Verifica se o usuário é visitante
            if (user.type !== 'Visitante') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                loanUserSelect.appendChild(option);
            }
        });
    }

    // Função para atualizar a lista de emprestimos
    function updateLoans() {
        loanList.innerHTML = ''; // Limpa a lista de emprestimos
        loans.forEach(loan => {
            const item = items.find(i => i.id === loan.itemId);
            const user = users.find(u => u.id === loan.userId);
            // Cria um novo item na lista de emprestimos
            const li = document.createElement('li');
            li.textContent = `${item.title} emprestado para ${user.name} até ${loan.returnDate.toLocaleDateString('pt-BR')}`;
            loanList.appendChild(li);
        });
    }

    // Deixa somente uma seção em ativo
    window.showSection = function(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    };
});
