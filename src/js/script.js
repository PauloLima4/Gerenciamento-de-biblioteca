document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const userForm = document.getElementById('userForm');
    const loanForm = document.getElementById('loanForm');
    const itemList = document.getElementById('itemList');
    const userList = document.getElementById('userList');
    const loanList = document.getElementById('loanList');
    const loanItemSelect = document.getElementById('loanItem');
    const loanUserSelect = document.getElementById('loanUser');

    let items = [];
    let users = [];
    let loans = [];

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('itemTitle').value;
        const author = document.getElementById('itemAuthor').value;
        const year = document.getElementById('itemYear').value;
        const type = document.getElementById('itemType').value;
        const quantity = document.getElementById('itemQuantity').value;
        const item = { id: items.length + 1, title, author, year, type, quantity: parseInt(quantity) };
        items.push(item);
        updateItems();
        itemForm.reset();
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const type = document.getElementById('userType').value;
        const user = { id: users.length + 1, name, type, borrowedItems: 0 };
        users.push(user);
        updateUsers();
        userForm.reset();
    });

    loanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemId = parseInt(loanItemSelect.value);
        const userId = parseInt(loanUserSelect.value);

        const item = items.find(i => i.id === itemId);
        const user = users.find(u => u.id === userId);

        if (!item || !user) return;

        if (item.quantity < 1) {
            alert('Item indisponível');
            return;
        }

        const maxItems = user.type === 'Aluno' ? 3 : user.type === 'Professor' ? 5 : 0;
        if (user.borrowedItems >= maxItems) {
            alert(`${user.type} já atingiu o limite de empréstimos`);
            return;
        }

        item.quantity -= 1;
        user.borrowedItems += 1;

        const returnDays = user.type === 'Aluno' ? 15 : user.type === 'Professor' ? 30 : 0;
        const loanDate = new Date();
        const returnDate = new Date(loanDate);
        returnDate.setDate(loanDate.getDate() + returnDays);

        const loan = { id: loans.length + 1, itemId, userId, loanDate, returnDate, returned: false };
        loans.push(loan);
        updateLoans();
        updateItems();
        updateUsers();
        loanForm.reset();
    });

    function updateItems() {
        itemList.innerHTML = '';
        loanItemSelect.innerHTML = '<option value="" disabled selected>Selecione um Item</option>';
        items.forEach(item => {
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

            if (item.quantity > 0) {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.title} (${item.type})`;
                loanItemSelect.appendChild(option);
            }
        });
    }

    function updateUsers() {
        userList.innerHTML = '';
        loanUserSelect.innerHTML = '<option value="" disabled selected>Selecione um Usuário</option>';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.type}) - Empréstimos: ${user.borrowedItems}`;
            userList.appendChild(li);

            if (user.type !== 'Visitante') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                loanUserSelect.appendChild(option);
            }
        });
    }

    function updateLoans() {
        loanList.innerHTML = '';
        loans.forEach(loan => {
            const item = items.find(i => i.id === loan.itemId);
            const user = users.find(u => u.id === loan.userId);
            const li = document.createElement('li');
            li.innerHTML = `${item.title} emprestado para ${user.name} até ${loan.returnDate.toLocaleDateString('pt-BR')}
                <button onclick="returnItem(${loan.id})">Devolver</button>`;
            loanList.appendChild(li);
        });
    }

    window.showSection = function(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    };

    window.loanItem = function(itemId) {
        const item = items.find(i => i.id === itemId);
        const userId = parseInt(prompt('Digite o ID do Usuário:'));

        const user = users.find(u => u.id === userId);

        if (!item || !user) return;

        if (item.quantity < 1) {
            alert('Item indisponível');
            return;
        }

        const maxItems = user.type === 'Aluno' ? 3 : user.type === 'Professor' ? 5 : 0;
        if (user.borrowedItems >= maxItems) {
            alert(`${user.type} já atingiu o limite de empréstimos`);
            return;
        }

        item.quantity -= 1;
        user.borrowedItems += 1;

        const returnDays = user.type === 'Aluno' ? 15 : user.type === 'Professor' ? 30 : 0;
        const loanDate = new Date();
        const returnDate = new Date(loanDate);
        returnDate.setDate(loanDate.getDate() + returnDays);

        const loan = { id: loans.length + 1, itemId, userId, loanDate, returnDate, returned: false };
        loans.push(loan);
        updateLoans();
        updateItems();
        updateUsers();
    };

    window.returnItem = function(loanId) {
        const loan = loans.find(l => l.id === loanId);
        if (!loan) return;

        loan.returned = true;

        const item = items.find(i => i.id === loan.itemId);
        const user = users.find(u => u.id === loan.userId);

        item.quantity += 1;
        user.borrowedItems -= 1;

        const now = new Date();
        const returnDate = new Date(loan.returnDate);
        let fine = 0;
        if (now > returnDate) {
            const diffTime = Math.abs(now - returnDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * 2; // Multa de 2 unidades por dia de atraso
        }

        alert(`Item devolvido. Multa por atraso: ${fine} unidades`);
        updateLoans();
        updateItems();
        updateUsers();
    };
});
