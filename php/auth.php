<?php

class Persona {
  /**
   * Scheme, hostname and port
   */
  protected $audience;

  /**
   * Constructs a new Persona (optionally specifying the audience)
   */
  public function __construct($audience = NULL) {
    $this->audience = $audience ?: $this->guessAudience();
  }

  /**
   * Verify the validity of the assertion received from the user
   *
   * @param string $assertion The assertion as received from the login dialog
   * @return object The response from the Persona online verifier
   */
  public function verifyAssertion($assertion) {
    $postdata = 'assertion=' . urlencode($assertion) . '&audience=' . urlencode($this->audience);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://verifier.login.persona.org/verify");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;

    /***************************************************************
    $url = 'https://verifier.login.persona.org/verify';
    $data = 'assertion='.urlencode($assertion).'&audience='.urlencode($this->audience);

    $params = array(
      'http' => array(
        'method' => 'POST',
        'content' => $data
      ),
      'ssl' => array(
        'verify_peer' => true,
        'verify_host' => true
      )
    );
    $context = stream_context_create($params);
    $result = file_get_contents($url, false, $context);

    return $result;*/
  }

  /**
   * Guesses the audience from the web server configuration
   */
  protected function guessAudience() {
    $audience = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $audience .= $_SERVER['SERVER_NAME'] . ':'.$_SERVER['SERVER_PORT'];
    return $audience;
  }
}

session_start();

if (isset($_POST['assertion'])) {
  $persona = new Persona();
  $verified = $persona->verifyAssertion($_POST['assertion']);
  $decodeverified = json_decode($verified);

  if ($decodeverified != null && $decodeverified->status == 'okay') {
    $_SESSION['user'] = $decodeverified;
  }

  $result = array("result" => $decodeverified, "verified" => $verified);
  header('Content-type: application/json');
  print json_encode($result);
} 
if (isset($_POST['logout'])) {
  session_destroy();

  $result = array("result" => null);
  print json_encode($result);
}