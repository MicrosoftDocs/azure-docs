---
title: "Quickstart: Project Answer Search, Java"
titlesuffix: Azure Cognitive Services
description: Start using Project Answer Search in Java.
services: cognitive-services
author: mikedodaro
manager: nitinme

ms.service: cognitive-services
ms.subservice: answer-search
ms.topic: quickstart
ms.date: 04/13/2018
ms.author: rosh
---

# Quickstart: Project Answer Search query in Java
This article uses Java to demonstrate the Bing Answer Search API, part of Microsoft Cognitive Services on Azure. The API is a REST Web service compatible with any programming language that can make HTTP requests and parse JSON.
 
The example code uses Java with minimal external dependencies.  You can also run it on Linux or Mac OS X using Mono.

## Prerequisites

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

## Request 

The following code creates a `WebRequest`, sets the access key header, and adds a query string for "Gibraltar".  It then sends the request and assigns the response to a string to contain the JSON text.

```
    static String host = "https://api.labs.cognitive.microsoft.com";
    static String path = "/answerSearch/v7.0/search";

    // construct URL of search request (endpoint + query string)

	URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchQuery, "UTF-8") + &mkt=en-us");
	HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();
	connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);

	// receive JSON body
	InputStream stream = connection.getInputStream();
	String response = new Scanner(stream).useDelimiter("\\A").next();

	// construct result object for return
	SearchResults results = new SearchResults(new HashMap<String, String>(), response);
```

## Complete code

The Bing Answer Search API returns results from the Bing search engine.
1. Download or install the gson library.
2. Create a new Java project in your favorite IDE or editor.
3. Add the code provided below.
4. Replace the subscriptionKey value with an access key valid for your subscription.
5. Run the program.

```
package knowledgeAPI;
import java.io.InputStream;
import java.net.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import javax.net.ssl.HttpsURLConnection;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class KnowledgeSrch {

	    // Replace the subscriptionKey string value with your valid subscription key.
	    static String subscriptionKey = "YOUR-ACCESS-KEY";

	    static String host = "https://api.labs.cognitive.microsoft.com";
	    static String path = "/answerSearch/v7.0/search";

	    static String searchTerm = "Gibraltar";

	    public static SearchResults SearchKnowledge (String searchQuery) throws Exception {

	        URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchQuery, "UTF-8") + "&mkt=en-us");
	        
            HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();
	        connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);

	        // receive JSON body
	        InputStream stream = connection.getInputStream();
	        String response = new Scanner(stream).useDelimiter("\\A").next();

	        // construct result object for return
	        SearchResults results = new SearchResults(new HashMap<String, String>(), response);

	        // extract Bing-related HTTP headers
	        Map<String, List<String>> headers = connection.getHeaderFields();
	        for (String header : headers.keySet()) {
	            if (header == null) continue;      // may have null key
	            if (header.startsWith("BingAPIs-") || header.startsWith("X-MSEdge-")) {
	                results.relevantHeaders.put(header, headers.get(header).get(0));
	            }
	        }

	        stream.close();
	        return results;
	    }

	    // pretty-printer for JSON; uses GSON parser to parse and re-serialize
	    public static String prettify(String json_text) {
	        JsonParser parser = new JsonParser();
	        JsonObject json = parser.parse(json_text).getAsJsonObject();
	        Gson gson = new GsonBuilder().setPrettyPrinting().create();
	        return gson.toJson(json);
	    }

	    public static void main (String[] args) {
	        try {
	            System.out.println("Searching the Web for: " + searchTerm);

	            SearchResults result = SearchKnowledge(searchTerm);

	            System.out.println("\nRelevant HTTP Headers:\n");
	            for (String header : result.relevantHeaders.keySet())
	                System.out.println(header + ": " + result.relevantHeaders.get(header));

	            System.out.println("\nJSON Response:\n");
	            System.out.println(prettify(result.jsonResponse));
	        }
	        catch (Exception e) {
	            e.printStackTrace(System.out);
	            System.exit(1);
	        }
	    }
	}

	// Container class for search results encapsulates relevant headers and JSON data
	class SearchResults{
	    HashMap<String, String> relevantHeaders;
	    String jsonResponse;
	    SearchResults(HashMap<String, String> headers, String json) {
	        relevantHeaders = headers;
	        jsonResponse = json;
	    }
}

```

## Next steps
- [C# quickstart](c-sharp-quickstart.md)
- [Java quickstart](java-quickstart.md)
- [Node quickstart](node-quickstart.md)
