<?php
session_start();

$erro = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    if ($email == "joaoguilhermme3@gmail.com" && $senha == "78952") {
        $_SESSION["usuario"] = $email;

        header("Location: index.php");
        exit;
    } else {
        $erro = true;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Login - PropostaFácil</title>
  <link rel="stylesheet" href="../CSS/login.css">
</head>

<body>

<div class="login-container">

  <h1>Proposta<span>Fácil</span></h1>
  <p class="subtitle">Acesse sua conta para continuar</p>

  <?php if ($erro): ?>
    <p class="erro-msg">Email ou senha incorretos!</p>
  <?php endif; ?>

  <form method="POST">

    <div class="field">
      <label>Email</label>
      <input name="email" type="email" required>
    </div>

    <div class="field">
      <label>Senha</label>
      <input name="senha" type="password" required>
    </div>

    <button class="btn btn-primary" type="submit">Entrar</button>

  </form>

</div>

</body>
</html>
