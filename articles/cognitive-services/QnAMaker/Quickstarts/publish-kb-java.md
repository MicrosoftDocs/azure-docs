---
title: "Quickstart: Java Publish Knowledge Base - QnA Maker"
titleSuffix: Azure Cognitive Services 
description: How to publish a knowledge base in Java for QnA Maker.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 09/12/2018
ms.author: diberry
---

# Quickstart: Publish a knowledge base in Java

The following code publishes an existing knowledge base, using the [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) method.

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-java-repo-note.md)]

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
1. Save this file as PublishKB.java.
2. Run:
	javac PublishKB.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar PublishKB
*/

public class PublishKB {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

// Replace this with a valid knowledge base ID.
	static String kb = "ENTER ID HERE";

	static String host = "https://westus.api.cognitive.microsoft.com";
	static String service = "/qnamaker/v4.0";
	static String method = "/knowledgebases/";

	public static String PrettyPrint (String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

// Send an HTTP POST request.
	public static String Post (URL url, String content) throws Exception {
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

		if (connection.getResponseCode() == 204)
		{
			return "{'result' : 'Success.'}";
		}
		else {
			StringBuilder response = new StringBuilder ();
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getErrorStream(), "UTF-8"));

			String line;
			while ((line = in.readLine()) != null) {
				response.append(line);
			}
			in.close();

			return response.toString();
		}
	}

// Sends the request to publish the knowledge base.
	public static String PublishKB (String kb) throws Exception {
		URL url = new URL(host + service + method + kb);
		System.out.println ("Calling " + url.toString() + ".");
		return Post(url, "");
    }

	public static void main(String[] args) {
		try {
			String response = PublishKB (kb);
			System.out.println (PrettyPrint (response));
		}
		catch (Exception e) {
			System.out.println (e.getCause().getMessage());
		}
	}
}
```

## The publish a knowledge base response

A successful response is returned in JSON, as shown in the following example:

```json
{
  "result": "Success."
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)