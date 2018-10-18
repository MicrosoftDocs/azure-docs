---
title: "Quickstart: Project URL Preview, Java"
titlesuffix: Azure Cognitive Services
description: Script sample to get started using the Project URL Preview with Java.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: project-url-preview
ms.topic: quickstart
ms.date: 04/24/2018
ms.author: rosh, v-gedod
---
# Quickstart: URL Preview with Java

The following Java example creates a Url Preview for the SwiftKey Web site: https://swiftkey.com/en.

## Prerequisites

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

## Request 

The following code creates a `WebRequest`, sets the access key header, and adds a query string for "https://swiftkey.com/en".  It then sends the request and assigns the response to a string to contain the JSON text.

````
    // construct URL of search request (endpoint + query string)

    static String host = "https://api.labs.cognitive.microsoft.com";
    static String path = "/urlpreview/v7.0/search";

    static String searchTerm = "https://swiftkey.com/en";

	URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchQuery, "UTF-8") + &mkt=en-us");
	HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();
	connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);

	// receive JSON body
	InputStream stream = connection.getInputStream();
	String response = new Scanner(stream).useDelimiter("\\A").next();

	// construct result object for return
	SearchResults results = new SearchResults(new HashMap<String, String>(), response);
````

## Complete code

The Bing Answer Search API returns results from the Bing search engine.
1. Download or install the gson library.
2. Create a new Java project in your favorite IDE or editor.
3. Add the code provided below.
4. Replace the subscriptionKey value with an access key valid for your subscription.
5. Run the program.

````
package UrlPreviewpkg;

import java.net.*;
import java.util.*;
import java.io.*;
import javax.net.ssl.HttpsURLConnection;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 *
 * When you have compiled or downloaded gson-2.8.1.jar and have placed it in the
 * same folder as this file (BingImageSearch.java), you can compile and run this program at
 * the command line as follows.
 *
 * javac UrlPreviewcls.java -classpath .;gson-2.8.1.jar -encoding UTF-8
 * java -cp .;gson-2.8.1.jar UrlPreview
 */

public class UrlPreview 
{
	// Replace the subscriptionKey string value with your valid subscription key.
    static String subscriptionKey = "YOUR-ACCESS-KEY";

    static String host = "https://api.labs.cognitive.microsoft.com";
    static String path = "/urlpreview/v7.0/search";

    static String searchTerm = "https://swiftkey.com/en";

    public static SearchResults SearchImages (String searchQuery) throws Exception {
        // construct URL of search request (endpoint + query string)
        URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchQuery, "UTF-8"));
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
        if (subscriptionKey.length() != 32) {
            System.out.println("Invalid Bing Search API subscription key!");
            System.out.println("Please paste yours into the source code.");
            System.exit(1);
        }

        try {
            System.out.println("Searching the Web for: " + searchTerm);

            SearchResults result = SearchImages(searchTerm);

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
//Container class for search results encapsulates relevant headers and JSON data
class SearchResults{
 HashMap<String, String> relevantHeaders;
 String jsonResponse;
 SearchResults(HashMap<String, String> headers, String json) {
     relevantHeaders = headers;
     jsonResponse = json;
 }
}

````

## Next steps
- [C# quickstart](csharp.md)
- [JavaScript quickstart](javascript.md)
- [Node quickstart](node-quickstart.md)
- [PYthon quickstart](python-quickstart.md)