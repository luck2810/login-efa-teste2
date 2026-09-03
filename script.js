import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/* ==========================================================================
   FIREBASE
   ========================================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyCqxlREb8FG0LjG3KrgjWPg_lSVI6Dzdgk",
    authDomain: "efa-education-for-all.firebaseapp.com",
    projectId: "efa-education-for-all",
    storageBucket: "efa-education-for-all.firebasestorage.app",
    messagingSenderId: "953168018936",
    appId: "1:953168018936:web:ab343c774b45afeb332a0d",
    measurementId: "G-X0SYQY8H1D"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       SELETORES DE ACESSIBILIDADE
       ====================================================================== */

    const btnReduzirTexto = document.getElementById('btn-reduzir-texto');
    const btnAumentarTexto = document.getElementById('btn-aumentar-texto');
    const btnFonteDislexia = document.getElementById('btn-fonte-dislexia');
    const btnModoFoco = document.getElementById('btn-modo-foco');
    const btnAlternarTema = document.getElementById('btn-alternar-tema');


    /* ======================================================================
       SELETORES DE BUSCA E FILTROS
       ====================================================================== */

    const campoBusca = document.getElementById('campo-busca');
    const filtroPerfil = document.getElementById('filtro-perfil');
    const cardsAulas = document.querySelectorAll('.card-aula');
    const mensagemVazia = document.getElementById('mensagem-vazia');


    /* ======================================================================
       SELETORES DO LOGIN
       ====================================================================== */

    const btnLoginGoogle = document.getElementById('btn-login-google');
    const usuarioLogado = document.getElementById('usuario-logado');
    const fotoUsuario = document.getElementById('foto-usuario');
    const nomeUsuario = document.getElementById('nome-usuario');
    const btnSair = document.getElementById('btn-sair');


    /* ======================================================================
       1. CONTROLE DE TAMANHO DE FONTE
       ====================================================================== */

    let tamanhoAtual = 16;

    const TAMANHO_MIN = 12;
    const TAMANHO_MAX = 24;


    btnAumentarTexto.addEventListener('click', () => {

        if (tamanhoAtual < TAMANHO_MAX) {

            tamanhoAtual += 2;

            document.documentElement.style.setProperty(
                '--tamanho-base',
                `${tamanhoAtual}px`
            );
        }

    });


    btnReduzirTexto.addEventListener('click', () => {

        if (tamanhoAtual > TAMANHO_MIN) {

            tamanhoAtual -= 2;

            document.documentElement.style.setProperty(
                '--tamanho-base',
                `${tamanhoAtual}px`
            );
        }

    });


    /* ======================================================================
       2. FONTE PARA DISLEXIA
       ====================================================================== */

    btnFonteDislexia.addEventListener('click', () => {

        const estaAtivo = document.body.classList.toggle('fonte-dislexia');

        btnFonteDislexia.setAttribute('aria-pressed', String(estaAtivo));

    });


    /* ======================================================================
       3. MODO FOCO
       ====================================================================== */

    btnModoFoco.addEventListener('click', () => {

        const estaAtivo = document.body.classList.toggle('modo-foco-ativo');

        btnModoFoco.setAttribute('aria-pressed', String(estaAtivo));

        btnModoFoco.textContent = estaAtivo
            ? 'Desativar Modo Foco'
            : 'Ativar Modo Foco';

        executarFiltros();

    });


    /* ======================================================================
       4. ALTERNAR TEMA
       ====================================================================== */

    btnAlternarTema.addEventListener('click', () => {

        const temaAtual = document.documentElement.getAttribute('data-theme');

        if (temaAtual === 'dark') {

            document.documentElement.removeAttribute('data-theme');

        } else {

            document.documentElement.setAttribute('data-theme', 'dark');

        }

    });


    /* ======================================================================
       5. BUSCA + FILTRO DE PERFIL
       ====================================================================== */

    function executarFiltros() {

        const termoBusca = campoBusca.value.toLowerCase().trim();

        const perfilSelecionado = filtroPerfil.value;

        const modoFocoAtivo =
            document.body.classList.contains('modo-foco-ativo');

        let cardsVisiveis = 0;


        cardsAulas.forEach(card => {

            const tituloCard = (
                card.getAttribute('data-titulo') || ''
            ).toLowerCase();

            const perfisCard = (
                card.getAttribute('data-perfis') || ''
            ).split(' ');


            const correspondeTexto =
                tituloCard.includes(termoBusca);

            const correspondePerfil =
                perfilSelecionado === 'todos'
                || perfisCard.includes(perfilSelecionado);


            if (correspondeTexto && correspondePerfil) {

                cardsVisiveis++;

                card.style.display = 'flex';

                if (modoFocoAtivo) {

                    card.classList.add('foco-visivel');

                } else {

                    card.classList.remove('foco-visivel');

                }

            } else {

                card.style.display = 'none';

                card.classList.remove('foco-visivel');

            }

        });


        if (cardsVisiveis === 0) {

            mensagemVazia.classList.remove('sr-only');

            mensagemVazia.style.display = 'block';

        } else {

            mensagemVazia.classList.add('sr-only');

            mensagemVazia.style.display = 'none';

        }

    }


    campoBusca.addEventListener('input', executarFiltros);

    filtroPerfil.addEventListener('change', executarFiltros);


    /* ======================================================================
       6. LOGIN COM GOOGLE
       ====================================================================== */

    btnLoginGoogle.addEventListener('click', async () => {

        try {

            await signInWithPopup(auth, provider);

        } catch (erro) {

            console.error('Erro ao fazer login:', erro);

            if (erro.code === 'auth/popup-closed-by-user') {
                return;
            }

            alert(
                'Não foi possível entrar com Google. Verifique a configuração do Firebase.'
            );

        }

    });


    /* ======================================================================
       7. DETECTAR USUÁRIO LOGADO
       ====================================================================== */

    onAuthStateChanged(auth, (usuario) => {

        if (usuario) {

            nomeUsuario.textContent =
                usuario.displayName || 'Usuário';


            if (usuario.photoURL) {

                fotoUsuario.src = usuario.photoURL;

                fotoUsuario.alt =
                    `Foto de ${usuario.displayName || 'usuário'}`;

                fotoUsuario.hidden = false;

            } else {

                fotoUsuario.src = '';

                fotoUsuario.alt = '';

                fotoUsuario.hidden = true;

            }


            usuarioLogado.hidden = false;

            btnLoginGoogle.hidden = true;

        } else {

            usuarioLogado.hidden = true;

            btnLoginGoogle.hidden = false;

        }

    });


    /* ======================================================================
       8. SAIR DA CONTA
       ====================================================================== */

    btnSair.addEventListener('click', async () => {

        try {

            await signOut(auth);

        } catch (erro) {

            console.error('Erro ao sair da conta:', erro);

            alert('Não foi possível sair da conta.');

        }

    });

});
