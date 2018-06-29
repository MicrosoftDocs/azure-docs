---
title: Update Knowledge Base, Java Quickstart - Azure Cognitive Services | Microsoft Docs
description: How to update a knowledge base in Java for QnA Maker.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 06/18/2018
ms.author: nolachar
---

# Update a knowledge base in Java

The following code updates an existing knowledge base, using the [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) method.

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

// Java does not natively support HTTP PATCH requests, so Apache HttpClient is required.
/*
 * HttpClient: http://hc.apache.org/downloads.cgi
 * Maven info:
 *    <dependency>
 *      <groupId>org.apache.httpcomponents</groupId>
 *      <artifactId>httpclient</artifactId>
 *      <version>4.5.5</version>
 *    </dependency>
 */
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

/* NOTE: To compile and run this code:
1. Save this file as UpdateKB.java.
2. Run:
	javac UpdateKB.java -cp .;gson-2.8.1.jar;httpclient-4.5.5.jar;httpcore-4.4.9.jar;commons-logging-1.2.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar;httpclient-4.5.5.jar;httpcore-4.4.9.jar;commons-logging-1.2.jar UpdateKB
*/

public class UpdateKB {

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

// We'll serialize these classes into JSON for our request to the server.
// For the JSON request schema, see:
// https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600
	public static class Request {
		Add add;
		Delete delete;
		Update update;
	}

	public static class Add {
		Question[] qnaList;
		String[] urls;
		File[] files;
	}

	public static class Delete {
		Integer[] ids;
	}

	public static class Update {
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

// Send an HTTP PATCH request. We use Apache HttpClient to do this, as HttpsURLConnection does not support PATCH.
	public static Response Patch (URL url, String content) throws Exception {
		HttpPatch patch = new HttpPatch(url.toString());
		// HttpPatch implements HttpMessage, which includes addHeader. See:
		// https://hc.apache.org/httpcomponents-client-ga/httpclient/apidocs/org/apache/http/client/methods/HttpPatch.html
		// http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/HttpMessage.html
		patch.addHeader("Content-Type", "application/json");
		// Note: Adding the Content-Length header causes the exception:
		// "Content-Length header already present."
		patch.addHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
		// HttpPatch implements HttpEntityEnclosingRequest, which includes setEntity. See:
		// http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/HttpEntityEnclosingRequest.html
		HttpEntity entity = new ByteArrayEntity(content.getBytes("UTF-8"));
        patch.setEntity(entity);

		CloseableHttpClient httpClient = HttpClients.createDefault();
		CloseableHttpResponse response = httpClient.execute(patch);

		// CloseableHttpResponse implements HttpMessage, which includes getAllHeaders. See:
		// https://hc.apache.org/httpcomponents-client-ga/httpclient/apidocs/org/apache/http/client/methods/CloseableHttpResponse.html
		// Header implements NameValuePair. See:
		// http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/Header.html
		// http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/NameValuePair.html
		Map<String, List<String>> headers = new HashMap<String, List<String>>();
		for (Header header : response.getAllHeaders()) {
			List<String> list = new ArrayList<String>() {
				{
					add(header.getValue());
				}
			};
			headers.put(header.getName(), list);
		}

		// CloseableHttpResponse implements HttpResponse, which includes getEntity. See:
		// http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/HttpResponse.html
		// HttpEntity implements getContent, which returns an InputStream. See:
		// http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/HttpEntity.html
		StringBuilder output = new StringBuilder ();
		BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "UTF-8"));
		String line;
		while ((line = reader.readLine()) != null) {
			output.append(line);
		}
		reader.close();

		return new Response (headers, output.toString());
	}

// Sends the request to update the knowledge base.
	public static Response UpdateKB (String kb, Request req) throws Exception {
		URL url = new URL(host + service + method + kb);
		System.out.println ("Calling " + url.toString() + ".");
		String content = new Gson().toJson(req);
		return Patch(url, content);
    }

// Checks on the status of the request to update the knowledge base.
	public static Response GetStatus (String operation) throws Exception {
		URL url = new URL (host + service + operation);
		System.out.println ("Calling " + url.toString() + ".");
		return Get(url);
    }

// Returns a sample request to update a knowledge base.
	public static Request GetRequest () {
		Request req = new Request ();

		Question q = new Question();
		q.id = 0;
		q.answer = "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa";
		q.source = "Custom Editorial";
		q.questions = new String[]{"How do I programmatically update my Knowledge Base?"};

		Metadata md = new Metadata();
		md.name = "category";
		md.value = "api";
		q.metadata = new Metadata[]{md};

		req.add = new Add ();
		req.add.qnaList = new Question[]{q};
		req.add.urls = new String[]{"https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",     "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"};

		return req;
	}

	public static void main(String[] args) {
		try {
// Send the request to update the knowledge base.
			Response response = UpdateKB (kb, GetRequest ());
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

## The update knowledge base response

A successful response is returned in JSON, as shown in the following example:

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:48Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:50Z",
  "resourceLocation": "/knowledgebases/140a46f3-b248-4f1b-9349-614bfd6e5563",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
Press any key to continue.
```

## Get request status

You can call the [Operation](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails) method to check the status of a request to create or update a knowledge base. To see how this method is used, see the sample code for the [Create](#Create) or [Update](#Update) method.

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)