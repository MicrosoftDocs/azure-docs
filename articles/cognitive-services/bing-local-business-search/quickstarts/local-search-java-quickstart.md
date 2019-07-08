---
title: Quickstart - Send a query to the Bing Local Business Search API using Java | Microsoft Docs
titleSuffix: Azure Cognitive Services
description: Use this article to start using the Bing Local Business Search API in Java.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 11/01/2018
ms.author: rosh
---

# Quickstart: Send a query to the Bing Local Business Search API using Java

Use this quickstart to begin sending requests to the Bing Local Business Search API, which is an Azure Cognitive Service. While this simple application is written in Java, the API is a RESTful Web service compatible with any programming language capable of making HTTP requests and parsing JSON.

This example application gets local response data from the API for the search query `hotel in Bellevue`.

## Prerequisites

* The [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with Bing Search APIs. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You will need the access key provided when you activate your free trial.  See also [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

This example application gets local response data from the query for a *hotel in Bellevue*.

## Create the request 

The following code creates a `WebRequest`, sets the access key header, and adds a query string for "hotel in Bellevue".  It then sends the request and assigns the response to a string to contain the JSON text.

```
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

## Run the complete application

The Bing Local Business Search API returns results from the Bing search engine.
1. Download or install the gson library.
2. Create a new Java project in your favorite IDE or editor.
3. Add the code provided below.
4. Replace the subscriptionKey value with an access key valid for your subscription.
5. Run the program.

```
package localSearch;
import java.net.*;
import java.util.*;
import java.io.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 *
 * Once you have compiled or downloaded gson-2.8.1.jar, assuming you have placed it in the
 * same folder as this file (localSearch.java), you can compile and run this program at
 * the command line as follows.
 *
 * javac localSearch.java -classpath .;gson-2.8.1.jar -encoding UTF-8
 * java -cp .;gson-2.8.1.jar localSearch
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class LocalSearchCls {

	// ***********************************************
	// *** Update or verify the following values. ***
	// **********************************************

	    // Replace the subscriptionKey string value with your valid subscription key.
	    static String subscriptionKey = "YOUR-ACCESS-KEY";

	    static String host = "https://api.cognitive.microsoft.com/bing";
	    static String path = "/v7.0/localbusinesses/search";

	    static String searchTerm = "Hotel in Bellevue";

	    public static SearchResults SearchLocal (String searchQuery) throws Exception {
	        // construct URL of search request (endpoint + query string)
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

	            SearchResults result = SearchLocal(searchTerm);

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
- [Local Business Search quickstart](local-quickstart.md)
- [Local Business Search Node quickstart](local-search-node-quickstart.md)
- [Local Business Search Python quickstart](local-search-python-quickstart.md)
