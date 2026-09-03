import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/* =========================================================
   FIREBASE
========================================================= */

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


/* =========================================================
   QUANDO A PÁGINA CARREGAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("JavaScript carregado corretamente");


    /* =====================================================
       SELETORES
    ===================================================== */

    const btnReduzirTexto =
        document.getElementById("btn-reduzir-texto");

    const btnAumentarTexto =
        document.getElementById("btn-aumentar-texto");

    const btnFonteDislexia =
        document.getElementById("btn-fonte-dislexia");

    const btnModoFoco =
        document.getElementById("btn-modo-foco");

    const btnAlternarTema =
        document.getElementById("btn-alternar-tema");


    const campoBusca =
        document.getElementById("campo-busca");

    const filtroPerfil =
        document.getElementById("filtro-perfil");

    const cardsAulas =
        document.querySelectorAll(".card-aula");

    const mensagemVazia =
        document.getElementById("mensagem-vazia");


    const btnLoginGoogle =
        document.getElementById("btn-login-google");

    const usuarioLogado =
        document.getElementById("usuario-logado");

    const fotoUsuario =
        document.getElementById("foto-usuario");

    const nomeUsuario =
        document.getElementById("nome-usuario");

    const btnSair =
        document.getElementById("btn-sair");


    /* =====================================================
       TAMANHO DO TEXTO
    ===================================================== */

    let tamanhoAtual = 16;

    if (btnAumentarTexto) {

        btnAumentarTexto.addEventListener("click", () => {

            if (tamanhoAtual < 24) {

                tamanhoAtual += 2;

                document.documentElement.style.setProperty(
                    "--tamanho-base",
                    tamanhoAtual + "px"
                );

            }

        });

    }


    if (btnReduzirTexto) {

        btnReduzirTexto.addEventListener("click", () => {

            if (tamanhoAtual > 12) {

                tamanhoAtual -= 2;

                document.documentElement.style.setProperty(
                    "--tamanho-base",
                    tamanhoAtual + "px"
                );

            }

        });

    }


    /* =====================================================
       FONTE PARA DISLEXIA
    ===================================================== */

    if (btnFonteDislexia) {

        btnFonteDislexia.addEventListener("click", () => {

            const ativo =
                document.body.classList.toggle("fonte-dislexia");

            btnFonteDislexia.setAttribute(
                "aria-pressed",
                ativo
            );

        });

    }


    /* =====================================================
       TEMA ESCURO
    ===================================================== */

    if (btnAlternarTema) {

        btnAlternarTema.addEventListener("click", () => {

            const temaAtual =
                document.documentElement.getAttribute("data-theme");

            if (temaAtual === "dark") {

                document.documentElement.removeAttribute("data-theme");

                localStorage.setItem("tema", "light");

            } else {

                document.documentElement.setAttribute(
                    "data-theme",
                    "dark"
                );

                localStorage.setItem("tema", "dark");

            }

        });

    }


    /* =====================================================
       CARREGAR TEMA SALVO
    ===================================================== */

    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {

        document.documentElement.setAttribute(
            "data-theme",
            "dark"
        );

    }


    /* =====================================================
       BUSCA E FILTROS
    ===================================================== */

    function executarFiltros() {

        if (!campoBusca || !filtroPerfil) return;

        const termoBusca =
            campoBusca.value.toLowerCase().trim();

        const perfilSelecionado =
            filtroPerfil.value;

        let quantidadeVisivel = 0;


        cardsAulas.forEach((card) => {

            const titulo =
                (card.getAttribute("data-titulo") || "")
                    .toLowerCase();

            const perfis =
                (card.getAttribute("data-perfis") || "")
                    .split(" ");


            const encontrouTexto =
                titulo.includes(termoBusca);

            const encontrouPerfil =
                perfilSelecionado === "todos" ||
                perfis.includes(perfilSelecionado);


            if (encontrouTexto && encontrouPerfil) {

                card.style.display = "flex";

                quantidadeVisivel++;

            } else {

                card.style.display = "none";

            }

        });


        if (mensagemVazia) {

            if (quantidadeVisivel === 0) {

                mensagemVazia.classList.remove("sr-only");
                mensagemVazia.style.display = "block";

            } else {

                mensagemVazia.classList.add("sr-only");
                mensagemVazia.style.display = "none";

            }

        }

    }


    if (campoBusca) {

        campoBusca.addEventListener(
            "input",
            executarFiltros
        );

    }


    if (filtroPerfil) {

        filtroPerfil.addEventListener(
            "change",
            executarFiltros
        );

    }


    /* =====================================================
       MODO FOCO
    ===================================================== */

    if (btnModoFoco) {

        btnModoFoco.addEventListener("click", () => {

            const ativo =
                document.body.classList.toggle("modo-foco-ativo");

            btnModoFoco.setAttribute(
                "aria-pressed",
                ativo
            );

            btnModoFoco.textContent = ativo
                ? "Desativar Modo Foco"
                : "Ativar Modo Foco";

        });

    }


    /* =====================================================
       LOGIN COM GOOGLE
    ===================================================== */

    if (btnLoginGoogle) {

        btnLoginGoogle.addEventListener("click", async () => {

            try {

                btnLoginGoogle.disabled = true;

                await signInWithPopup(auth, provider);

            } catch (erro) {

                console.error("Erro no login:", erro);

                if (
                    erro.code !== "auth/popup-closed-by-user"
                ) {

                    alert(
                        "Erro ao entrar:\n" +
                        erro.message
                    );

                }

            } finally {

                btnLoginGoogle.disabled = false;

            }

        });

    }


    /* =====================================================
       VERIFICAR USUÁRIO LOGADO
    ===================================================== */

    onAuthStateChanged(auth, (usuario) => {

        if (usuario) {

            console.log(
                "Usuário logado:",
                usuario.email
            );


            if (nomeUsuario) {

                nomeUsuario.textContent =
                    usuario.displayName || "Usuário";

            }


            if (fotoUsuario) {

                if (usuario.photoURL) {

                    fotoUsuario.src = usuario.photoURL;

                    fotoUsuario.alt =
                        "Foto de " +
                        (usuario.displayName || "usuário");

                    fotoUsuario.hidden = false;

                } else {

                    fotoUsuario.hidden = true;

                }

            }


            if (usuarioLogado) {

                usuarioLogado.hidden = false;

            }


            if (btnLoginGoogle) {

                btnLoginGoogle.hidden = true;

            }

        } else {

            console.log("Nenhum usuário logado");


            if (usuarioLogado) {

                usuarioLogado.hidden = true;

            }


            if (btnLoginGoogle) {

                btnLoginGoogle.hidden = false;

            }

        }

    });


    /* =====================================================
       SAIR DA CONTA
    ===================================================== */

    if (btnSair) {

        btnSair.addEventListener("click", async () => {

            try {

                await signOut(auth);

            } catch (erro) {

                console.error("Erro ao sair:", erro);

                alert("Não foi possível sair da conta.");

            }

        });

    }

});
