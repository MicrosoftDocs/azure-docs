---
title: "Quickstart: Translator Speech API Node.js"
titlesuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Translator Speech API.
services: cognitive-services
author: v-jaswel
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-speech
ms.topic: quickstart
ms.date: 3/5/2018
ms.author: v-jaswel
---
# Quickstart: Translator Speech API with Node.js 
<a name="HOLTop"></a>

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-translator-speech-deprecation-note.md)]

This article shows you how to use the Translator Speech API to translate words spoken in a .wav file.

## Prerequisites

You need [Node.js 6](https://nodejs.org/en/download/) to run this code.

You need to install the [Websocket package](https://www.npmjs.com/package/websocket) for Node.js.

You need a .wav file named "speak.wav" in the same folder as the executable you compile from the code below. This .wav file should be in standard PCM, 16 bit, 16 kHz, mono format. You can obtain such a .wav file from the [Text to Speech API](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-apis#text-to-speech).

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Speech API**. You need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

## Translate speech

The following code translates speech from one language to another.

1. Create a new Node.js project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```nodejs
/* To install this dependency, run:
npm install websocket
*/
var wsClient = require('websocket').client;
var fs = require('fs');
/* To install this dependency, run:
npm install stream-buffers
*/
var streamBuffers = require('stream-buffers');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
let key = 'ENTER KEY HERE';

let host = 'wss://dev.microsofttranslator.com';
let path = '/speech/translate';
let params = '?api-version=1.0&from=en-US&to=it-IT&features=texttospeech&voice=it-IT-Elsa';
let uri = host + path + params;

/* The input .wav file is in PCM 16bit, 16kHz, mono format.
You can obtain such a .wav file using the Text to Speech API. See:
https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-apis#text-to-speech
*/
let input_path = 'speak.wav';

let output_path = 'speak2.wav';

function receive(message) {
	console.log ("Received message of type: " + message.type + ".");

	if (message.type == 'utf8') {
		var result = JSON.parse(message.utf8Data)
		console.log("Response type: " + result.type + ".");
		console.log("Recognized input as: " + result.recognition);
		console.log("Translation: " + result.translation);
	}
	else if (message.type == 'binary') {
/* This is needed to make sure message.binaryData is defined. See:
https://stackoverflow.com/questions/17546953/cant-access-object-property-even-though-it-exists-returns-undefined
*/
		let binary_data = JSON.parse (JSON.stringify (message.binaryData));

		if (binary_data.type == 'Buffer') {
/* Put the binary data in a Buffer - do not write it directly to the file. */
			let buffer = new Buffer(binary_data.data, 'binary');
/* Write the contents of the Buffer to the file. */
			fs.writeFile (output_path, buffer, 'binary', function (error) {
/* fs.writeFile calls the error-handling function even if there is no error, in which case error === null. See:
https://stackoverflow.com/questions/44473868/node-js-fs-writefile-err-returns-null
*/
				if (error !== null) {
					console.log ("Error: " + error);
				}
			});
		}
	}
}

function send(connection, filename) {
	
	var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
		frequency: 100,
		chunkSize: 32000
	});

/* Make sure the audio file is followed by silence.
This lets the service know that the audio file is finished.
At 32 bytes per millisecond, this is 100 seconds of silence. */
	myReadableStreamBuffer.put(fs.readFileSync(filename));
	myReadableStreamBuffer.put(new Buffer(3200000));
	myReadableStreamBuffer.stop();

	myReadableStreamBuffer.on('data', function (data) {
		connection.sendBytes(data);
	});

	myReadableStreamBuffer.on('end', function () {
		console.log('Closing connection.');
		connection.close(1000);
	});
}

function connect() {
	var ws = new wsClient();

	ws.on('connectFailed', function (error) {
		console.log('Connection error: ' + error.toString());
	});
							
	ws.on('connect', function (connection) {
		console.log('Connected.');

		connection.on('message', receive);
		
		connection.on('close', function (reasonCode, description) {
			console.log('Connection closed: ' + reasonCode);
		});

		connection.on('error', function (error) {
			console.log('Connection error: ' + error.toString());
		});
		
		send(connection, input_path);
	});

	ws.connect(uri, null, null, { 'Ocp-Apim-Subscription-Key' : key });
}

connect();
```

**Translate speech response**

A successful result is the creation of a file named "speak2.wav". The file contains the translation of the words spoken in "speak.wav".

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Translator Speech tutorial](../tutorial-translator-speech-csharp.md)

## See also 

[Translator Speech overview](../overview.md)
[API Reference](https://docs.microsoft.com/azure/cognitive-services/translator-speech/reference)
