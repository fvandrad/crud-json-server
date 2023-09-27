const postForm = document.getElementById('post-form');
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const cancelButton1 = document.getElementById('cancel-button1');

const postList = document.getElementById('post-list');
const toastLiveExample = document.getElementById('liveToast');
const toastMsg = document.getElementById('toast-msg');
const myModal = document.getElementById('exampleModal');
// const apiUrl = 'http://192.168.15.105:8800/posts';
const apiUrl = 'http://localhost:3000/posts'; // ?_sort=title&_order=asc

// location.reload(true);
myModal.addEventListener('shown.bs.modal', () => {
  postTitleInput.focus()
})


function cancelAndClearForm(event) {
  event.preventDefault();
  clearForm();
}

cancelButton.addEventListener('click', cancelAndClearForm);
cancelButton1.addEventListener('click', cancelAndClearForm);

// Função para carregar os registros
function getAll() {
  return fetch(apiUrl)
    .then((data) => data.json())
    .catch((err) => console.log(err))
  // await console.log(resultadoFinal)
}
async function getPosts() {
  try {
    const response = await fetch(apiUrl);
    console.log(response);
  
    if (!response.ok) {
      throw new Error('Erro na solicitação'); // Tratar erro de resposta HTTP
    }
    
    const data = await response.json();
    console.log(data);

    // console.log(data);
      
    // .then(data => {
    allPosts = data;
    //   // console.log(data);

    //     // data.sort((a, b) => {
    //     //   return a.title.localeCompare(b.title);
    //     // });
      
       postList.innerHTML = `
        <thead>
          <tr>
              <th scope="col">#</th>
              <th scope="col">Título</th>
              <th scope="col" class="visually-hidden">Conteúdo</th>
              <th scope="col"></th>
          </tr>
        </thead>`;

      // const filteredArray = data.filter((item) => {
      //   return item.title.startsWith("Título");
      // });

      // console.log(filteredArray);
      // data = filteredArray;


      data.forEach(post => {
        postList.innerHTML += `
          <tr>
            <th scope="row">${post.id}</th>
            <td>${post.title}</td> 
            <td class="visually-hidden">${post.content}</td>
            <td>
        
            <button title="Excluir" class="delete-button btn btn-outline-danger float-end bi bi-trash" data-id="${post.id}"></button>
            <button title="Editar" class="edit-button btn btn-outline-primary float-end bi bi-pen" data-bs-toggle="modal"
            data-bs-target="#exampleModal" data-id="${post.id}" ></button>
            </td>
          </tr>
        `;
      });
    // });
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Função para preencher o formulário com os dados de um registro
function fillForm(post) {
  postIdInput.value = post.id;
  postTitleInput.value = post.title;
  postContentInput.value = post.content;
  saveButton.textContent = 'Atualizar';
}

// Função para limpar o formulário
function clearForm() {
  postIdInput.value = '';
  postTitleInput.value = '';
  postContentInput.value = '';
  saveButton.textContent = 'Salvar';
  // exampleModal.style.display = 'none';
  // location.reload(true);
  // toastBootstrap.hide();
}

// Event listener para salvar ou atualizar um registro
postForm.addEventListener('submit', event => {
  event.preventDefault();


  const postId = postIdInput.value;
  const postTitle = postTitleInput.value;
  const postContent = postContentInput.value;

  // fetchPosts();
  // console.log(allData);

  let contador = 0;

  for (const objeto of allPosts) {
    if (objeto.title.toUpperCase() === postTitle.toUpperCase() && objeto.id != postId) {
      contador++;
    }
  }

  if (contador) {
    toastMsg.classList.add('text-warning');
    toastMsg.innerHTML = `O título "${postTitle}" já existe.`;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    return;
  }

  if (!postTitle || !postContent) {
    toastMsg.classList.add('text-warning');
    toastMsg.innerHTML = `Por favor, preencha tanto o título quanto o conteúdo.`;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    return;
  }

  if (postTitle && postContent) {
    toastMsg.classList.remove('text-warning');
    toastMsg.classList.add('text-success');
    postId ? toastMsg.innerHTML = `<i class="bi bi-check-lg"></i> Dados atualizados com sucesso!` :
      toastMsg.innerHTML = `<i class="bi bi-check-lg"></i> Dados inserindo com sucesso!`;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    if (!postId) {
      clearForm();
    }
  }

  const requestOptions = {
    method: postId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: postTitle, content: postContent })
  };

  const requestUrl = postId ? `${apiUrl}/${postId}` : apiUrl;
  fetch(requestUrl, requestOptions)
    .then(response => response.json())
    .then(() => {
      getPosts();
      // clearForm();
      cancelButton.click();
    });
});

// Event delegation para lidar com cliques nos botões de editar e excluir
postList.addEventListener('click', event => {
  if (event.target.classList.contains('edit-button')) {
    const postId = event.target.getAttribute('data-id');
    fetch(`${apiUrl}/${postId}`)
      .then(response => response.json())
      .then(post => {
        fillForm(post);
      });
  } else if (event.target.classList.contains('delete-button')) {
    const postId = event.target.getAttribute('data-id');
    if (confirm('Tem certeza que deseja excluir este post?')) {
      toastMsg.classList.add('text-sucess');
      toastMsg.innerHTML = `<i class="bi bi-check-lg"></i> Dados excluidos com sucesso!`;
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastBootstrap.show();
      fetch(`${apiUrl}/${postId}`, { method: 'DELETE' })
        .then(() => {
          getPosts();
          clearForm();
        });
    }
  }
});

// Inicialização: carregar registros ao carregar a página
getPosts();