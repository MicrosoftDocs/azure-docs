---
title: "Quickstart: Translator Speech API Python"
titlesuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Translator Speech API.
services: cognitive-services
author: v-jaswel
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-speech
ms.topic: quickstart
ms.date: 07/17/2018
ms.author: v-jaswel
---
# Quickstart: Translator Speech API with Python
<a name="HOLTop"></a>

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-translator-speech-deprecation-note.md)]

This article shows you how to use the Translator Speech API to translate words spoken in a .wav file.

## Prerequisites

You will need [Python 3.x](https://www.python.org/downloads/) to run this code.

You will need to install the [websocket-client package](https://pypi.python.org/pypi/websocket-client) for Python.

You will need a .wav file named "speak.wav" in the same folder as the executable you compile from the code below. This .wav file should be in standard PCM, 16bit, 16kHz, mono format. 

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Speech API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

## Translate speech

The following code translates speech from one language to another.

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

# To install this package, run:
#	pip install websocket-client
import websocket

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
key = 'ENTER KEY HERE'

host = 'wss://dev.microsofttranslator.com'
path = '/speech/translate';
params = '?api-version=1.0&from=en-US&to=it-IT&features=texttospeech&voice=it-IT-Elsa'
uri = host + path + params

input_file = 'speak.wav'
output_file = 'speak2.wav'

output = bytearray ()

def on_open (client):
	print ("Connected.")

# r = read. b = binary.
	with open (input_file, mode='rb') as file:
		data = file.read()

	print ("Sending audio.")
	client.send (data, websocket.ABNF.OPCODE_BINARY)
# Make sure the audio file is followed by silence.
# This lets the service know that the audio input is finished.
	print ("Sending silence.")
	client.send (bytearray (32000), websocket.ABNF.OPCODE_BINARY)

def on_data (client, message, message_type, is_last):
	global output
	if (websocket.ABNF.OPCODE_TEXT == message_type):
		print ("Received text data.")
		print (message)
# For some reason, we receive the data as type websocket.ABNF.OPCODE_CONT.
	elif (websocket.ABNF.OPCODE_BINARY == message_type or websocket.ABNF.OPCODE_CONT == message_type):
		print ("Received binary data.")
		print ("Is last? " + str(is_last))
		output = output + message
		if (True == is_last):
# w = write. b = binary.
			with open (output_file, mode='wb') as file:
				file.write (output)
				print ("Wrote data to output file.")
			client.close ()
	else:
		print ("Received data of type: " + str (message_type))

def on_error (client, error):
	print ("Connection error: " + str (error))

def on_close (client):
	print ("Connection closed.")

client = websocket.WebSocketApp(
	uri,
	header=[
		'Ocp-Apim-Subscription-Key: ' + key
	],
	on_open=on_open,
	on_data=on_data,
	on_error=on_error,
	on_close=on_close
)

print ("Connecting...")
client.run_forever()
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
