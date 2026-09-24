<?php
// ============================================================
//  PAGES/login.php — Página de login
// ============================================================
session_start();

// Se já estiver logado, vai direto para o sistema
if (isset($_SESSION['usuario_id'])) {
    header('Location: principal.html');
    exit;
}

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../config.php';

    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    if ($email === '' || $senha === '') {
        $erro = 'Preencha e-mail e senha.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erro = 'E-mail inválido.';
    } else {
        try {
            $pdo  = getDB();
            $stmt = $pdo->prepare(
                "SELECT usuario_id, nome, email, senha_hash
                 FROM tbUsuarios
                 WHERE email = :email
                 LIMIT 1"
            );
            $stmt->execute([':email' => strtolower($email)]);
            $usuario = $stmt->fetch();

            if (!$usuario || !password_verify($senha, $usuario['senha_hash'])) {
                $erro = 'E-mail ou senha incorretos.';
            } else {
                session_regenerate_id(true);
                $_SESSION['usuario_id']    = $usuario['usuario_id'];
                $_SESSION['usuario_nome']  = $usuario['nome'];
                $_SESSION['usuario_email'] = $usuario['email'];

                header('Location: principal.html');
                exit;
            }
        } catch (PDOException $e) {
            error_log('Erro no login: ' . $e->getMessage());
            $erro = 'Erro interno do servidor. Tente mais tarde.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — PropostaFácil</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../CSS/login.css">
</head>
<body>

  <div class="login-container">
    <h1>Proposta<span>Fácil</span></h1>
    <p class="subtitle">Faça login para continuar</p>

    <?php if ($erro): ?>
      <p class="erro-msg" style="display:block;"><?= htmlspecialchars($erro) ?></p>
    <?php endif; ?>

    <form method="POST" action="login.php">

      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email"
               placeholder="seuemail@gmail.com"
               value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
               required autofocus>
      </div>

      <div class="field">
        <label for="senha">Senha</label>
        <input id="senha" name="senha" type="password"
               placeholder="Sua senha" required>
      </div>

      <button class="btn btn-primary" type="submit">Entrar</button>

    </form>

    <div class="extra-options">
      <a href="passawold.html" class="link">Esqueceu sua senha?</a>
    </div>

    <div class="register">
      Não tem conta? <a href="register.php" class="link">Cadastre-se</a>
    </div>
  </div>

</body>
</html>
