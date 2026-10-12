<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'msg' => 'Método no permitido.']));
}

// Honeypot
if (!empty($_POST['_gotcha'])) {
    exit(json_encode(['ok' => true]));
}

function limpiar($val) {
    return htmlspecialchars(strip_tags(trim((string)$val)), ENT_QUOTES, 'UTF-8');
}

$nombre   = limpiar($_POST['nombre']   ?? '');
$empresa  = limpiar($_POST['empresa']  ?? '');
$email    = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL) ?? '');
$telefono = limpiar($_POST['telefono'] ?? '');
$servicio = limpiar($_POST['servicio'] ?? '');
$proyecto = limpiar($_POST['proyecto'] ?? '');

if (!$nombre || !$email || !$proyecto || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'msg' => 'Datos incompletos o inválidos.']));
}

$to      = 'contacto@stackbitcr.com';
$subject = '=?UTF-8?B?' . base64_encode('Nuevo proyecto — Stackbit') . '?=';

$cuerpo  = "Nombre:   $nombre\n";
$cuerpo .= $empresa  ? "Empresa:  $empresa\n"   : '';
$cuerpo .= "Correo:   $email\n";
$cuerpo .= $telefono ? "Teléfono: $telefono\n"  : '';
$cuerpo .= $servicio ? "Servicio: $servicio\n"  : '';
$cuerpo .= "\nDescripción del proyecto:\n$proyecto\n";
$cuerpo .= "\n— Enviado desde Stackbit Web\n";

$headers  = "From: Stackbit <no-reply@stackbitcr.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";

$enviado = mail($to, $subject, $cuerpo, $headers);

if (!$enviado) {
    http_response_code(500);
    exit(json_encode(['ok' => false, 'msg' => 'No se pudo enviar. Escríbenos por WhatsApp.']));
}

exit(json_encode(['ok' => true, 'msg' => '¡Listo! Te respondemos pronto.']));
