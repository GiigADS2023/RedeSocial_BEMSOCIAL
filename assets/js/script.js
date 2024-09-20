class FormPost {
    constructor(idForm, idTextarea, idUlPost, idMediaPreview) {
        this.form = document.getElementById(idForm);
        this.textarea = document.getElementById(idTextarea);
        this.ulPost = document.getElementById(idUlPost);
        this.mediaPreview = document.getElementById(idMediaPreview);
        this.mediaFile = null;
        this.addSubmit();
        this.addMediaHandlers();
        this.updateNewPostHeight(); // Chamada inicial
    }

    onSubmit(func) {
        this.form.addEventListener('submit', func);
    }

    formValidate(value) {
        return value && value.length >= 3;
    }

    getTime() {
        const time = new Date();
        const hour = time.getHours();
        const minute = time.getMinutes();
        return `${hour}h ${minute}min`;
    }

    addSubmit() {
        this.onSubmit((event) => {
            event.preventDefault();

            if (this.formValidate(this.textarea.value)) {
                const time = this.getTime();
                const newPost = document.createElement('li');
                newPost.classList.add('post');

                let mediaHTML = "";
                if (this.mediaFile) {
                    const mediaType = this.mediaFile.type.startsWith('video') ? 'video' : 'img';
                    mediaHTML = `<${mediaType} src="${URL.createObjectURL(this.mediaFile)}" controls></${mediaType}>`;
                }

                newPost.innerHTML = `
                    <div class="infoUserPost">
                        <div class="imgUserPost"></div>
                        <div class="nameAndHour">
                            <strong>Nome Completo</strong>
                            <p>${time}</p>
                        </div>
                    </div>
                    <p>${this.textarea.value}</p>
                    ${mediaHTML}
                    <div class="actionBtnPost">
                        <button type="button" class="filesPost like"><img src="./assets/images/heart.svg" alt="Curtir">Curtir</button>
                        <button type="button" class="filesPost comment"><img src="./assets/images/comment.svg" alt="Comentar">Comentar</button>
                        <button type="button" class="filesPost share"><img src="./assets/images/share.svg" alt="Compartilhar">Compartilhar</button>
                    </div>
                `;

                this.ulPost.append(newPost);
                this.textarea.value = "";
                this.clearMediaPreview();
            } else {
                alert('Verifique o campo digitado.');
            }
        });
    }

    clearMediaPreview() {
        this.mediaPreview.innerHTML = "";
        this.mediaFile = null; // Limpa a mídia após postar
        this.updateNewPostHeight(); // Atualiza a altura ao limpar
    }

    updateNewPostHeight() {
        const newPostContainer = document.querySelector('.newPost');
        if (this.mediaFile) {
            newPostContainer.classList.add('has-media');
        } else {
            newPostContainer.classList.remove('has-media');
        }
    }

    addMediaHandlers() {
        const imageButton = document.getElementById('addImage');
        const gifButton = document.getElementById('addGif');
        const videoButton = document.getElementById('addVideo');

        const mediaInputHandler = (type) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = type;

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.mediaFile = file;
                    const mediaType = file.type.startsWith('video') ? 'video' : 'img';
                    this.mediaPreview.innerHTML = `<${mediaType} src="${URL.createObjectURL(file)}" controls></${mediaType}>`;
                    this.updateNewPostHeight(); // Atualiza a altura aqui
                }
            };

            input.click();
        };

        imageButton.addEventListener('click', () => mediaInputHandler('image/*'));
        gifButton.addEventListener('click', () => mediaInputHandler('image/gif'));
        videoButton.addEventListener('click', () => mediaInputHandler('video/*'));
    }
}

// Instanciando o formulário com pré-visualização
const postForm = new FormPost('formPost', 'textarea', 'posts', 'mediaPreview');