---
title: Call and response - Java Quickstart for Azure Cognitive Services, Bing Image Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Image Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: jerrykindall

ms.service: cognitive-services
ms.technology: bing-search
ms.topic: article
ms.date: 9/21/2017
ms.author: v-jerkin

---
# Call and response: your first Bing Image Search query in Java

The Bing Image Search API provides an experience similar to Bing.com/Images by letting you send a user search query to Bing and get back a list of relevant images.

This article includes a simple console application that performs a Bing Image Search API query and displays the returned raw search results, which are in JSON format. While this application is written in Java, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Running the application

To run this application, follow these steps.

1. Download or install the [gson library](https://github.com/google/gson). You may also obtain it via Maven.
2. Create a new Java project in your favorite IDE or editor.
3. Add the provided code in a file named `BingImageSearch.java`.
4. Replace the `subscriptionKey` value with an access key valid for your subscription.
5. Run the program.

```java
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
 * same folder as this file (BingImageSearch.java), you can compile and run this program at
 * the command line as follows.
 *
 * javac BingImageSearch.java -classpath .;gson-2.8.1.jar -encoding UTF-8
 * java -cp .;gson-2.8.1.jar BingImageSearch
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class BingImageSearch {

// ***********************************************
// *** Update or verify the following values. ***
// **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    static String subscriptionKey = "enter key here";

    // Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
    // search APIs.  In the future, regional endpoints may be available.  If you
    // encounter unexpected authorization errors, double-check this value against
    // the endpoint for your Bing Web search instance in your Azure dashboard.
    static String host = "https://api.cognitive.microsoft.com";
    static String path = "/bing/v7.0/images/search";

    static String searchTerm = "puppies";

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

## JSON response

A sample response follows. To limit the length of the JSON, only a single result is shown, and other parts of the response have been truncated. 

```json
{
  "_type": "Images",
  "instrumentation": {},
  "readLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=puppies",
  "webSearchUrl": "https://www.bing.com/images/search?q=puppies&FORM=OIIARP",
  "totalEstimatedMatches": 955,
  "nextOffset": 1,
  "value": [
    {
      "webSearchUrl": "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&q=puppies&id=F68CC526226E163FD1EA659747ADCB8F9FA3CD96&simid=608055280844016271",
      "name": "So cute - Puppies Wallpaper (14749028) - Fanpop",
      "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OIP.jHrihoDNkXGS1t5e89jNfwEsDh&pid=Api",
      "datePublished": "2014-02-01T21:55:00.0000000Z",
      "contentUrl": "http://images4.fanpop.com/image/photos/14700000/So-cute-puppies-14749028-1600-1200.jpg",
      "hostPageUrl": "http://www.fanpop.com/clubs/puppies/images/14749028/title/cute-wallpaper",
      "contentSize": "394455 B",
      "encodingFormat": "jpeg",
      "hostPageDisplayUrl": "www.fanpop.com/clubs/puppies/images/14749028/title/cute-wallpaper",
      "width": 1600,
      "height": 1200,
      "thumbnail": {
        "width": 300,
        "height": 225
      },
      "imageInsightsToken": "ccid_jHrihoDN*mid_F68CC526226E163FD1EA659747ADCB8F9FA3CD96*simid_608055280844016271*thid_OIP.jHrihoDNkXGS1t5e89jNfwEsDh",
      "insightsMetadata": {
        "recipeSourcesCount": 0
      },
      "imageId": "F68CC526226E163FD1EA659747ADCB8F9FA3CD96",
      "accentColor": "8D613E"
    }
  ],
  "queryExpansions": [
    {
      "text": "Shih Tzu Puppies",
      "displayText": "Shih Tzu",
      "webSearchUrl": "https://www.bing.com/images/search?q=Shih+Tzu+Puppies&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Shih+Tzu%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
      "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Shih+Tzu+Puppies&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Shih+Tzu%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
      "thumbnail": {
        "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Shih+Tzu+Puppies&pid=Api&mkt=en-US&adlt=moderate&t=1"
      }
    }
  ],
  "pivotSuggestions": [
    {
      "pivot": "puppies",
      "suggestions": [
        {
          "text": "Dog",
          "displayText": "Dog",
          "webSearchUrl": "https://www.bing.com/images/search?q=Dog&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dog%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
          "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Dog&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dog%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
          "thumbnail": {
            "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Dog&pid=Api&mkt=en-US&adlt=moderate&t=1"
          }
        }
      ]
    }
  ],
  "similarTerms": [
    {
      "text": "cute",
      "displayText": "cute",
      "webSearchUrl": "https://www.bing.com/images/search?q=cute&FORM=IDINTS",
      "thumbnail": {
        "url": "https://tse2.mm.bing.net/th?q=cute&pid=Api&mkt=en-US&adlt=moderate"
      }
    }
  ],
  "relatedSearches": [
    {
      "text": "Cute Puppies",
      "displayText": "Cute Puppies",
      "webSearchUrl": "https://www.bing.com/images/search?q=Cute+Puppies&FORM=IRPATC",
      "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Cute+Puppies",
      "thumbnail": {
        "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Cute+Puppies&pid=Api&mkt=en-US&adlt=moderate&t=1"
      }
    }
  ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../tutorial-bing-image-search-single-page-app.md)

## See also 

[Bing Image Search overview](../overview.md)  
[Try it](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api)  
[Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)
