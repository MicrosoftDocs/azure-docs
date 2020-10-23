---
title: Search for GIF images using the Bing Image Search API
titleSuffix: Azure Cognitive Services
description: The Bing Image Search API enables you to also search across the entire Web for the most relevant .gif images.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: conceptual
ms.date: 04/24/2018
ms.author: aahi
ms.custom: seodec2018
---

# Search for GIF images 

The Bing Image Search API enables you to also search across the entire Web for the most relevant .gif images.  Developers can integrate engaging gifs in various conversation scenarios. 

The following URL is a query for animated .gif images.
```
https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=interesting&imageType=AnimatedGif&mkt=en-us
```
The [q](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#query) parameter specifies the search terms.  The previous query also specifies `animatedGif` using the [imageType](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#imagetype) filter parameter.

To see examples of results, use the following URL to search bing.com.
```
https://www.bing.com/images/search?q=interesting&qft=%20filterui%3Aphoto-animatedgif

```
## Query parameters

For more information about query parameters and options, see the [Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#query-parameters). An example follows under the heading [Example search for animated gif using Java](#gifExample).

## Tips and suggestions

- You can specify [maxFileSize](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#maxfilesize) and [minFileSize](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#minfilesize) parameters. We recommend setting the maxFileSize=2000000 as majority of gifs in our index are under 2MB.  This also helps to control the data size if bandwidth is a concern, such as in mobile cellular scenarios.
- To help improve perceived performance, load the thumbnail first before loading the source url.  
- For first-run or landing page experience where you don't have a user query yet, try using our trending gif searches to help from the [trending images API](trending-images.md).
- There are three settings for the [safeSearch](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#safesearch) parameter.  The `strict` option blocks adult content.
- See [mkt](supported-countries-markets.md) for full list of languages and locations supported.
- *AnimatedGifHttps* only returns animated gif images that are from an https address. For security, many applications require connection to external web links over https. For example, the Apple App Store requires connection to web services over HTTPS, which encrypts user data secure while in transit.

<a name="gifExample"></a>

## Example search for animated gif using Java

The following URL searches for animated .gif images: `q=interesting`
```
https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=interesting&imageType=AnimatedGif&mkt=en-us

```
As shown in the following example, the URL query requires [Ocp-Apim-Subscription-Key](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference#headers) header.

The following Java example builds and sends the request.

```
package gifSearch;
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
 * Once you have compiled or downloaded gson-2.8.1.jar, assuming you have placed it in the
 * same folder as this file (BingImageSearch.java), you can compile and run this program at
 * the command line as follows.
 *
 * javac GIFsearch.java -classpath .;gson-2.8.1.jar -encoding UTF-8
 * java -cp .;gson-2.8.1.jar GIFsearch
 */


public class GIFsearch {

	// Replace the subscriptionKey string value with your valid subscription key.
    static String subscriptionKey = "YOUR-ACCESS-KEY";

    static String host = "https://api.cognitive.microsoft.com";
    static String path = "/bing/v7.0/images/search";

    static String searchTerm = "interesting";

    public static SearchResults SearchImages (String searchQuery) throws Exception {
        // construct URL of search request (endpoint + query string)
        URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchQuery, "UTF-8") + "&imageType=AnimatedGif&mkt=en-us");
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

```

## Results
The code gets the following results as JSON objects:

```json
    {
      "webSearchUrl": "https://www.bing.com/images/search?view\u003ddetai...",
      "name": "Very Interesting GIF - Thats Very Interesting - ...",
      "thumbnailUrl": "https://tse1.mm.bing.net/th?id\u003dOIP.yJX6Vz345JPK...",
      "datePublished": "2017-03-12T01:35:00.0000000Z",
      "contentUrl": "https://media.contoso.co/images/c895fa573df8e493ca8d0dec7d93b/raw",
      "hostPageUrl": "https://www.contoso.co/view/thats-very-interesting-christi...",
      "contentSize": "1295633 B",
      "encodingFormat": "animatedgif",
      "hostPageDisplayUrl": "https://www.contoso.co/view/thats-very-christian...",
      "width": 440,
      "height": 186,
      "thumbnail": {
        "width": 474,
        "height": 200
      },
      "imageInsightsToken": "ccid_yJX6Vz34*mid_9FF0FFA42AADA1357F042443D2103B40EA...",
      "insightsMetadata": {
        "recipeSourcesCount": 0,
        "bestRepresentativeQuery": {
          "text": "That\u0027s Very Interesting",
          "displayText": "That\u0027s Very Interesting",
          "webSearchUrl": "https://www.bing.com/images/search?q\u003dThat..."
        },
        "pagesIncludingCount": 19,
        "availableSizesCount": 2
      },
      "imageId": "9FF0FFA42AADA1357F042443D21030EAAA225F",
      "accentColor": "62452D"
    },

```

## Next steps
- [C# quickstart](quickstarts/csharp.md)
- [Tutorial Image Search single-page application](tutorial-bing-image-search-single-page-app.md)
