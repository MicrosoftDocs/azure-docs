---
title: "Quickstart: Check spelling with the REST API and Java - Bing Spell Check"
titleSuffix: Azure Cognitive Services
description: Get started using the Bing Spell Check REST API to check spelling and grammar.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 05/21/2020
ms.author: aahi
---

# Quickstart: Check spelling with the Bing Spell Check REST API and Java

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple Java application sends a request to the API and returns a list of suggested corrections. 

Although this application is written in Java, the API is a RESTful web service compatible with most programming languages. The source code for this application is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/java/Search/BingSpellCheck.java).

## Prerequisites

* The Java Development Kit(JDK) 7 or later.

* Import the [gson-2.8.5.jar](https://libraries.io/maven/com.google.code.gson%3Agson) or the most current [Gson](https://github.com/google/gson) version. For command-line execution, add the `.jar` to your Java folder with the main class.

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]

## Create and initialize an application

1. Create a new Java Project in your favorite IDE or editor with a class name of your choosing, and then import the following packages:

    ```java
    import java.io.*;
    import java.net.*;
    import com.google.gson.*;
    import javax.net.ssl.HttpsURLConnection;
    ```

2. Create variables for the API endpoint's host, path, and your subscription key. Then, create variables for your market, the text you want to spell check, and a string for the spell check mode. You can use the global endpoint in the following code, or use the [custom subdomain](../../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```java
    static String host = "https://api.cognitive.microsoft.com";
    static String path = "/bing/v7.0/spellcheck";

    static String key = "<ENTER-KEY-HERE>";

    static String mkt = "en-US";
    static String mode = "proof";
    static String text = "Hollo, wrld!";
    ```

## Create and send an API request

1. Create a function called `check()` to create and send the API request. Within this function, add the code specified in the next steps. Create a string for the request parameters:

   1. Assign your market code to the `mkt` parameter with the `=` operator. 

   1. Add the `mode` parameter with the `&` operator, and then assign the spell-check mode. 

   ```java
   public static void check () throws Exception {
	   String params = "?mkt=" + mkt + "&mode=" + mode;
      // add the rest of the code snippets here (except prettify() and main())...
   }
   ```

2. Create a URL by combining the endpoint host, path, and parameters string. Create a new `HttpsURLConnection` object.

    ```java
    URL url = new URL(host + path + params);
    HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
    ```

3. Open a connection to the URL. Set the request method to `POST` and add your request parameters. Be sure to add your subscription key to the `Ocp-Apim-Subscription-Key` header.

    ```java
	connection.setRequestMethod("POST");
	connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
	connection.setDoOutput(true);
    ```

4. Create a new `DataOutputStream` object and send the request to the API.

    ```java
        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        wr.writeBytes("text=" + text);
        wr.flush();
        wr.close();
    ```

## Format and read the API response

1. Add the `prettify()` method to your class, which formats the JSON for a more readable output.

    ``` java
    // This function prettifies the json response.
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonElement json = parser.parse(json_text);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }
    ```

1. Create a `BufferedReader` and read the response from the API. Print it to the console.
    
    ```java
	BufferedReader in = new BufferedReader(
	new InputStreamReader(connection.getInputStream()));
	String line;
	while ((line = in.readLine()) != null) {
		System.out.println(prettify(line));
	}
	in.close();
    ```

## Call the API

In the main function of your application, call your `check()` method created previously.
```java
    	public static void main(String[] args) {
    		try {
    			check();
    		}
    		catch (Exception e) {
    			System.out.println (e);
    		}
    	}
```

## Run the application

Build and run your project. If you're using the command line, use the following commands to build and run the application:

1. Build the application:

   ```bash
   javac -classpath .;gson-2.2.2.jar\* <CLASS_NAME>.java
   ```

2. Run the application:

   ```bash
   java -cp .;gson-2.2.2.jar\* <CLASS_NAME>
   ```

## Example JSON response

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
> [Create a single-page web app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
