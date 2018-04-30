---
title: Java Quickstart for Bing Visual Search API | Microsoft Docs
titleSuffix: Bing Web Search APIs - Cognitive Services
description: Shows how to quickly get started using the Visual Search API to get insights about an image.
services: cognitive-services
author: swhite-msft
manager: rosh

ms.service: cognitive-services
ms.technology: bing-visual-search
ms.topic: article
ms.date: 4/19/2018
ms.author: scottwhi
---

# Your first Bing Visual Search query in Java

Bing Visual Search API lets you send a request to Bing to get insights about an image. To call the API, send an HTTP POST  request to https:\/\/api.cognitive.microsoft.com/bing/v7.0/images/visualsearch. The response contains JSON objects that you parse to get the insights.

This article includes a simple console application that sends a Bing Visual Search API request and displays the JSON search results. While this application is written in Java, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

For this quickstart, you may use a [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) subscription key or a paid subscription key.

## Running the application

To run this application, follow these steps:

1. Download or install the [gson library](https://github.com/google/gson). You may also obtain it via Maven.
2. Create a new Java project in your favorite IDE or editor.
3. Add the provided code in a file named `VisualSearch.java`.
4. Replace the `subscriptionKey` value with your subscription key.
4. Replace the `insightsToken` value with an insights token from an /images/search response.
5. Run the program.

```java
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package visualsearch;

import java.net.*;
import java.util.*;
import java.io.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.2
 *
 * Once you have compiled or downloaded gson-2.8.2.jar, assuming you have placed it in the
 * same folder as this file (VisualSearch.java), you can compile and run this program at
 * the command line as follows.
 *
 * javac VisualSearch.java -classpath .;gson-2.8.2.jar -encoding UTF-8
 * java -cp .;gson-2.8.2.jar VisualSearch
 */

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.nio.charset.StandardCharsets;

/**
 *
 * @author microsoft
 */
public class VisualSearch {

    // Replace the subscriptionKey string value with your valid subscription key.
    static String subscriptionKey = "<YOUR-SUBSCRIPTION-KEY-GOES-HERE>";

    // Verify the endpoint URI. At this writing, only one endpoint is used for Bing
    // search APIs. In the future, regional endpoints may be available.  If you
    // encounter unexpected authorization errors, double-check this value against
    // the endpoint for your Bing Web search instance in your Azure dashboard.
    static String endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch";

    static String insightsToken = "<YOUR-INSIGHTS-TOKEN-GOES-HERE>";

    static String boundary = "boundary_ABC123DEF456";

    
    
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        try {
            System.out.println("Getting image insights for token: " + insightsToken);

            String body = BuildBody(insightsToken, boundary);
            SearchResults result = GetInsights(body, boundary);

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

    
    public static String BuildBody(String token, String boundary) throws Exception {
        final String startBoundary = "--" + boundary;
        final String endBoundary = "--" + boundary + "--";
        final String CRLF = "\r\n";
        final String postBodyHeader = "Content-Disposition: form-data; name=\"knowledgeRequest\"" + CRLF + CRLF;

        String requestBody = startBoundary + CRLF;
        requestBody += postBodyHeader;
        requestBody += "{\"imageInfo\":{\"imageInsightsToken\":\"" + token + "\"}}" + CRLF + CRLF;
        requestBody += endBoundary + CRLF;
        
        return requestBody;
    }

    public static SearchResults GetInsights(String body, String boundary) throws Exception {
        // construct URL of search request (endpoint + query string)
        URL url = new URL(endpoint);
        HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();
        connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
        connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream os = connection.getOutputStream();
        os.write(body.getBytes(StandardCharsets.UTF_8));
        
        
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

> [!div class="nextstepaction"]
> [Bing Visual Search single-page app tutorial](../tutorial-bing-visual-search-single-page-app.md)

## See also 

[Bing Visual Search overview](../overview.md)  
[Try it](https://aka.ms/bingvisualsearchtryforfree)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-visual-search-api)  
[Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)

