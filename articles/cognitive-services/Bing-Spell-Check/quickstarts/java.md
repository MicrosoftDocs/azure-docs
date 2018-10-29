---
title: "Quickstart: Bing Spell Check API, Java"
titlesuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Bing Spell Check API.
services: cognitive-services
author: v-jaswel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-spell-check
ms.topic: quickstart
ms.date: 09/14/2017
ms.author: v-jaswel
---
# Quickstart for Bing Spell Check API with Java 

This article shows you how to use the [Bing Spell Check API](https://azure.microsoft.com/services/cognitive-services/spell-check/) with Java. The Spell Check API returns a list of words it does not recognize along with suggested replacements. Typically, you would submit text to this API and then either make the suggested replacements in the text or show them to the user of your application so they can decide whether to make the replacements. This article shows how to send a request that contains the text "Hollo, wrld!". The suggested replacements will be "Hello" and "world."

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Spell Check API v7**. The [free trial](https://azure.microsoft.com/try/cognitive-services/#lang) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Get Spell Check results

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import javax.net.ssl.HttpsURLConnection;

public class HelloWorld {

    static String host = "https://api.cognitive.microsoft.com";
    static String path = "/bing/v7.0/spellcheck";

    // NOTE: Replace this example key with a valid subscription key.
    static String key = "ENTER KEY HERE";

    static String mkt = "en-US";
    static String mode = "proof";
    static String text = "Hollo, wrld!";

    public static void check () throws Exception {
		String params = "?mkt=" + mkt + "&mode=" + mode;
        URL url = new URL(host + path + params);
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		connection.setRequestProperty("Content-Length", "" + text.length() + 5);
        connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
        connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        wr.writeBytes("text=" + text);
        wr.flush();
        wr.close();

        BufferedReader in = new BufferedReader(
        new InputStreamReader(connection.getInputStream()));
        String line;
        while ((line = in.readLine()) != null) {
            System.out.println(line);
        }
        in.close();
    }

    public static void main(String[] args) {
        try {
            check ();
        }
        catch (Exception e) {
            System.out.println (e);
        }
    }
}
```

**Response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "_type": "SpellCheck",
   "flaggedTokens": [
      {
         "offset": 0,
         "token": "Hollo",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "Hello",
               "score": 0.9115257530801
            },
            {
               "suggestion": "Hollow",
               "score": 0.858039839213461
            },
            {
               "suggestion": "Hallo",
               "score": 0.597385084464481
            }
         ]
      },
      {
         "offset": 7,
         "token": "wrld",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "world",
               "score": 0.9115257530801
            }
         ]
      }
   ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Spell Check tutorial](../tutorials/spellcheck.md)

## See also

- [Bing Spell Check overview](../proof-text.md)
- [Bing Spell Check API v7 Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference)
