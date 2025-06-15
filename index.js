// Importamos las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio'); // ✅ Corrección aquí
const dotenv = require('dotenv');

// Cargamos las variables de entorno desde .env
dotenv.config();

// Creamos la aplicación de Express
const app = express();

// Middleware para recibir datos de Twilio (form-urlencoded)
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor del chatbot funcionando 👋');
});

// Webhook de Twilio: donde se reciben los mensajes de WhatsApp
app.post('/whatsapp', (req, res) => {
  const { Body, From } = req.body;

  // Registro en consola para depuración
  console.log(`📩 Mensaje recibido de ${From || 'desconocido'}: "${Body || 'vacío'}"`);

  // Si no hay cuerpo del mensaje
  if (!Body) {
    console.log('⚠️ Mensaje vacío recibido.');
    return res.type('text/xml').send('<Response><Message>Mensaje vacío. Por favor, escribe algo.</Message></Response>');
  }

  // Lógica simple de respuesta
  let respuesta = '';

  const lowerBody = Body.toLowerCase().trim();

  if (lowerBody === 'hola') {
    respuesta = '¡Hola! Bienvenido al chatbot. ¿En qué puedo ayudarte?';
  } else if (lowerBody === 'adios') {
    respuesta = 'Gracias por tu consulta. ¡Hasta pronto!';
  } else {
    respuesta = 'Estoy aprendiendo, pero por ahora solo respondo "hola" y "adios". 😊';
  }

  // ✅ Usamos twilio.twiml.MessagingResponse() correctamente
  const twimlResponse = new twilio.twiml.MessagingResponse();
  twimlResponse.message(respuesta);

  // Enviamos la respuesta en formato XML
  res.type('text/xml');
  res.send(twimlResponse.toString());
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log(`🚫 Acceso a ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// Puerto dinámico para Render o localmente en 3000
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});