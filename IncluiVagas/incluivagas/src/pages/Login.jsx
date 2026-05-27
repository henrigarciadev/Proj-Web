import "./Login.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from 'react-router-dom';


function Login() {

    const [email, setEmail] = useState("");

    const [senha, setSenha] = useState("");

    async function fazerLogin() {

        try {

            const usuario = await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

            alert("Login realizado!");

            console.log(usuario.user.email);

        } catch (erro) {

            if (erro.code === "auth/invalid-credential") {

                alert("Email ou senha incorretos");

            }
            else {

                alert("Erro ao fazer login");

            }

            console.log(erro);

        }

    }

    return (

        <div className="container">

            <nav className="navbar">

                <h1>IncluiVagas</h1>

                <ul>
                    <li>HOME</li>
                    <li>EMPRESAS</li>
                    <li>SERVIÇOS</li>
                    <li className="login-nav">LOGIN</li>
                </ul>

            </nav>

            <div className="login-box">

                <div className="user-icon">
                    👤
                </div>

                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <div className="options">

                    <label>
                        <input type="checkbox" />
                        Lembrar usuário
                    </label>

                    <span>Esqueceu senha?</span>

                </div>

                <button onClick={fazerLogin}>
                    LOGIN
                </button>

                <span className="cadastro-texto">
                Não é cadastrado? <Link to="/cadastro">Registrar-se</Link>
                </span>

            </div>

        </div>

    );
}

export default Login;