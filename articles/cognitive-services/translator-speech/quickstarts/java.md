---
title: Java Quickstart for Azure Cognitive Services, Microsoft Translator Speech API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Microsoft Translator Speech API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jaswel

ms.service: cognitive-services
ms.technology: translator-speech
ms.topic: article
ms.date: 3/5/2018
ms.author: v-jaswel

---
# Quickstart for Microsoft Translator Speech API with Java 
<a name="HOLTop"></a>

This article shows you how to use the Microsoft Translator Speech API to translate words spoken in a .wav file.

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You will need the [javax.websocket-api-1.1.jar](http://central.maven.org/maven2/javax/websocket/javax.websocket-api/1.1/) and [tyrus-standalone-client-1.9.jar](http://repo1.maven.org/maven2/org/glassfish/tyrus/bundles/tyrus-standalone-client/1.9/) files.

You will need a .wav file named "speak.wav" in the same folder as the executable you compile from the code below. This .wav file should be in standard PCM, 16bit, 16kHz, mono format. You can obtain such a .wav file from the [Translator Text Speak API](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Speak).

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Speech API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

## Translate speech

The following code translates speech from one language to another.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

Config.java:

```java
import java.util.*;

import javax.websocket.ClientEndpointConfig;

public class Config extends ClientEndpointConfig.Configurator {
	// **********************************************
	// *** Update or verify the following values. ***
	// **********************************************

	// Replace the subscriptionKey string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

    @Override
    public void beforeRequest (Map<String,List<String>> headers) {
		headers.put("Ocp-Apim-Subscription-Key", Arrays.asList (key));
    }
}
```

Client.java:

```java
import java.io.*;
import java.net.*;
import java.util.*;

import javax.websocket.ClientEndpoint;
import javax.websocket.CloseReason;
import javax.websocket.ContainerProvider;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

/* Useful reference links:
	https://docs.oracle.com/javaee/7/api/javax/websocket/Session.html
	https://docs.oracle.com/javaee/7/api/javax/websocket/RemoteEndpoint.Basic.html
	https://docs.oracle.com/javaee/7/api/javax/websocket/OnMessage.html
	http://www.oracle.com/technetwork/articles/java/jsr356-1937161.html
*/

@ClientEndpoint(configurator = Config.class)
public class Client {
	static String host = "wss://dev.microsofttranslator.com";
	static String path = "/speech/translate";
	static String params = "?api-version=1.0&from=en-US&to=it-IT&features=texttospeech&voice=it-IT-Elsa";
	static String uri = host + path + params;

	static String input_path = "speak.wav";
	static String output_path = "speak2.wav";

    Session session = null;

	@OnOpen
	public void onOpen(Session session) {
		this.session = session;
		System.out.println ("Connected.");
		SendAudio ();
	}

	@OnMessage
	public void onTextMessage(String message, Session session){
		System.out.println ("Text message received.");
		System.out.println (message);
	}

/*
Use the following signature to receive the message in parts:
	public void onBinaryMessage(byte[] buffer, boolean last, Session session)
Use the following signature to receive the entire message:
	public void onBinaryMessage(byte[] buffer, Session session)
See:
	https://docs.oracle.com/javaee/7/api/javax/websocket/OnMessage.html
*/
	@OnMessage
	public void onBinaryMessage(byte[] buffer, Session session) {
		try {
			System.out.println ("Binary message received.");
			FileOutputStream stream = new FileOutputStream(output_path);
			stream.write(buffer);
			stream.close();
			System.out.println ("Message contents written to file.");
			Close ();
		} catch (Exception e) {
			e.printStackTrace ();
		}
	}

	@OnError
	public void onError(Session session, Throwable e) {
		System.out.println ("Error message received: " + e.getMessage ());
	}

	@OnClose
	public void myOnClose (CloseReason reason) {
		System.out.println ("Close message received: " + reason.getReasonPhrase());
	}

	public void SendAudio() {
		try {
			File file = new File(input_path);
			FileInputStream stream = new FileInputStream (file);
			byte buffer[] = new byte[(int)file.length()];
			stream.read(buffer);
			stream.close();
			sendMessage (buffer);
		} catch (Exception e) {
			e.printStackTrace ();
		}
	}

	public void sendMessage(byte[] message) {
		try {
			System.out.println ("Sending audio.");
			OutputStream stream = this.session.getBasicRemote().getSendStream();
			stream.write (message);
/* Make sure the audio file is followed by silence.
 * This lets the service know that the audio input is finished. */
			System.out.println ("Sending silence.");
			byte silence[] = new byte[3200000];
			stream.write (silence);
			stream.flush();
		} catch (Exception e) {
			e.printStackTrace ();
		}
	}

    public void Connect () throws Exception {
        try {
			System.out.println("Connecting.");
			WebSocketContainer container = ContainerProvider.getWebSocketContainer();
/* Some code samples show container.connectToServer as returning a Session, but this seems to be false. */
			container.connectToServer(this, new URI(uri));
		} catch (Exception e) {
			e.printStackTrace ();
        }
    }

	public void Close () throws Exception {
        try {
			System.out.println("Closing connection.");
			this.session.close ();
		} catch (Exception e) {
			e.printStackTrace ();
        }
	}
}
```

Speak.java:

```java
/*
Download javax.websocket-api-1.1.jar from:
	http://central.maven.org/maven2/javax/websocket/javax.websocket-api/1.1/
Download tyrus-standalone-client-1.9.jar from:
	http://repo1.maven.org/maven2/org/glassfish/tyrus/bundles/tyrus-standalone-client/1.9/

Compile and run with:
	javac Config.java -cp .;javax.websocket-api-1.1.jar
	javac Client.java -cp .;javax.websocket-api-1.1.jar;tyrus-standalone-client-1.9.jar
	javac Speak.java
	java -cp .;javax.websocket-api-1.1.jar;tyrus-standalone-client-1.9.jar Speak
*/

public class Speak {
	public static void main(String[] args) {
		try {
			Client client = new Client ();
			client.Connect ();
			// Wait for the reply.
			System.out.println ("Press any key to exit the application at any time.");
			System.in.read();
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Translate speech response**

A successful result is the creation of a file named "speak2.wav". The file contains the translation of the words spoken in "speak.wav".

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Translator Speech tutorial](../tutorial-translator-speech-csharp.md)

## See also 

[Translator Speech overview](../overview.md)
[API Reference](http://docs.microsofttranslator.com/speech-translate.html)
