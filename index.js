// Importamos las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const { Twilio } = require('twilio');
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
  console.log(`Mensaje recibido de ${From}: "${Body}"`);

  // Lógica simple de respuesta
  let respuesta = '';

  if (!Body) {
    respuesta = 'Mensaje vacío. Por favor, escribe algo.';
  } else if (Body.toLowerCase() === 'hola') {
    respuesta = '¡Hola! Bienvenido al chatbot. ¿En qué puedo ayudarte?';
  } else if (Body.toLowerCase() === 'adios') {
    respuesta = 'Gracias por tu consulta. ¡Hasta pronto!';
  } else {
    respuesta = 'Estoy aprendiendo, pero por ahora solo respondo "hola" y "adios". 😊';
  }

  // Generamos la respuesta en formato TwiML (XML especial de Twilio)
  const twiml = new Twilio.twiml.MessagingResponse();
  twiml.message(respuesta);

  // Enviamos la respuesta en formato XML
  res.type('text/xml');
  res.send(twiml.toString());
});

// Puerto dinámico para Render o localmente en 3000
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});