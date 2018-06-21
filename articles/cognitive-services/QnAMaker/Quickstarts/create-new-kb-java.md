---
title: Create a new knowledge base - quickstart Java - for Microsoft QnA Maker API (v4) - Azure Cognitive Services | Microsoft Docs
description: Create a knowledge base in Java to hold your FAQs or product manuals, so you can get started with QnA Maker.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 06/15/2018
ms.author: nolachar
---

# Create a new knowledge base in Java

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft QnA Maker API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

## Create knowledge base

The following code creates a new knowledge base, using the [Create](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.lang.reflect.Type;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *    <dependency>
 *      <groupId>com.google.code.gson</groupId>
 *      <artifactId>gson</artifactId>
 *      <version>2.8.1</version>
 *    </dependency>
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

/* NOTE: To compile and run this code:
1. Save this file as CreateKB.java.
2. Run:
	javac CreateKB.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar CreateKB
*/

public class CreateKB {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://westus.api.cognitive.microsoft.com";
	static String service = "/qnamaker/v4.0";
	static String method = "/knowledgebases/create";

// We'll serialize these classes into JSON for our request to the server.
// For the JSON request schema, see:
// https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff
	public static class KB {
		String name;
		Question[] qnaList;
		String[] urls;
		File[] files;
	}

	public static class Question {
		Integer id;
		String answer;
		String source;
		String[] questions;
		Metadata[] metadata;
	}

	public static class Metadata {
		String name;
		String value;
	}

	public static class File {
		String fileName;
		String fileUri;
	}

// This class contains the headers and body of the HTTP response.
	public static class Response {
		Map<String, List<String>> Headers;
		String Response;

		public Response(Map<String, List<String>> headers, String response) {
			this.Headers = headers;
			this.Response = response;
		}
	}

	public static String PrettyPrint (String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

// Send an HTTP GET request.
	public static Response Get (URL url) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));

		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return new Response (connection.getHeaderFields(), response.toString());
    }

// Send an HTTP POST request.
	public static Response Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return new Response (connection.getHeaderFields(), response.toString());
	}

// Sends the request to create the knowledge base.
	public static Response CreateKB (KB kb) throws Exception {
		URL url = new URL (host + service + method);
		System.out.println ("Calling " + url.toString() + ".");
		String content = new Gson().toJson(kb);
		return Post(url, content);
    }

// Checks the status of the request to create the knowledge base.
	public static Response GetStatus (String operation) throws Exception {
		URL url = new URL (host + service + operation);
		System.out.println ("Calling " + url.toString() + ".");
		return Get(url);
    }

// Returns a sample request to create a knowledge base.
	public static KB GetKB () {
		KB kb = new KB ();
		kb.name = "Example Knowledge Base";

		Question q = new Question();
		q.id = 0;
		q.answer = "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa";
		q.source = "Custom Editorial";
		q.questions = new String[]{"How do I programmatically update my Knowledge Base?"};

		Metadata md = new Metadata();
		md.name = "category";
		md.value = "api";
		q.metadata = new Metadata[]{md};

		kb.qnaList = new Question[]{q};

		kb.urls = new String[]{"https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",     "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"};

		return kb;
	}

	public static void main(String[] args) {
		try {
// Send the request to create the knowledge base.
			Response response = CreateKB (GetKB ());
			String operation = response.Headers.get("Location").get(0);
			System.out.println (PrettyPrint (response.Response));
// Loop until the request is completed.
			Boolean done = false;
			while (true != done) {
// Check on the status of the request.
				response = GetStatus (operation);
				System.out.println (PrettyPrint (response.Response));
				Type type = new TypeToken<Map<String, String>>(){}.getType();
				Map<String, String> fields = new Gson().fromJson(response.Response, type);
				String state = fields.get ("operationState");
// If the request is still running, the server tells us how long to wait before checking the status again.
				if (state.equals("Running") || state.equals("NotStarted")) {
					String wait = response.Headers.get ("Retry-After").get(0);
					System.out.println ("Waiting " + wait + " seconds...");
					Thread.sleep (Integer.parseInt(wait) * 1000);
				}
				else {
					done = true;
				}
			}
		}
		catch (Exception e) {
			System.out.println (e.getCause().getMessage());
		}
	}
}
```

## The create knowledge base response

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Running",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:30Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:52:30Z",
  "lastActionTimestamp": "2018-04-13T01:52:46Z",
  "resourceLocation": "/knowledgebases/b0288f33-27b9-4258-a304-8b9f63427dad",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "e88b5b23-e9ab-47fe-87dd-3affc2fb10f3"
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)