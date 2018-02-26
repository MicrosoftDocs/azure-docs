---
title: Java Quickstart for Azure Cognitive Services, Microsoft Translator Text API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jaswel

ms.service: cognitive-services
ms.technology: translator-text
ms.topic: article
ms.date: 09/14/2017
ms.author: v-jaswel

---
# Quickstart for Microsoft Translator Text API with Java 
<a name="HOLTop"></a>

This article shows you how to use the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method to translate text from one language to another. For information on how to use the other Translator Text APIs, see [this Github repository](https://github.com/MicrosoftTranslator/Translator-Text-API-Quickstarts/tree/master/Java).

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Text API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Translate"></a>

## Translate text

The following code translates source text from one language to another, using the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/Translate";

	static String target = "fr-fr";
	static String text = "Hello";

	public static String Translate () throws Exception {
        String encoded_query = URLEncoder.encode (text, "UTF-8");
        String params = "?to=" + target + "&text=" + text;
		URL url = new URL (host + path + params);

		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
    }

	public static void main(String[] args) {
		try {
			String response = Translate ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Translate response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Salut</string>
```

## Next steps

> [!div class="nextstepaction"]
> [Translator Text tutorial](../tutorial-wpf-translation-csharp.md)

## See also 

[Translator Text overview](../translator-info-overview.md)</br>
[API Reference](http://docs.microsofttranslator.com/text-translate.html)
