---
title: "Quickstart: Send a search request to the REST API using Java - Bing Entity Search"
titleSuffix: Azure AI services
description: Use this quickstart to send a request to the Bing Entity Search REST API using Java, and receive a JSON response.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-entity-search
ms.topic: quickstart
ms.date: 05/08/2020
ms.devlang: java
ms.custom: devx-track-java, mode-api, devx-track-extended-java
ms.author: aahi
---
# Quickstart: Send a search request to the Bing Entity Search REST API using Java

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Entity Search API and view the JSON response. This simple Java application sends a news search query to the API, and displays the response.

Although this application is written in Java, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

* The [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/).
* The [Gson library](https://github.com/google/gson).


[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../../includes/cognitive-services-bing-entity-search-signup-requirements.md)]

## Create and initialize a project

1. Create a new Java project in your favorite IDE or editor, and import the following libraries:

   ```java
   import java.io.*;
   import java.net.*;
   import java.util.*;
   import javax.net.ssl.HttpsURLConnection;
   import com.google.gson.Gson;
   import com.google.gson.GsonBuilder;
   import com.google.gson.JsonObject;
   import com.google.gson.JsonParser;
   import com.google.gson.Gson;
   import com.google.gson.GsonBuilder;
   import com.google.gson.JsonObject;
   import com.google.gson.JsonParser;
   ```

2. In a new class, create variables for the API endpoint, your subscription key, and a search query. You can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

   ```java
   public class EntitySearch {

      static String subscriptionKey = "ENTER KEY HERE";

      static String host = "https://api.bing.microsoft.com";
      static String path = "/v7.0/search";

      static String mkt = "en-US";
      static String query = "italian restaurant near me";
   //...

   ```

## Construct a search request string

1. Create a function called `search()` that returns a JSON `String`. url-encode your search query, and add it to a parameters string with `&q=`. Add your market to the parameter string with `?mkt=`.

2. Create a URL object with your host, path, and parameters strings.

    ```java
    //...
    public static String search () throws Exception {
        String encoded_query = URLEncoder.encode (query, "UTF-8");
        String params = "?mkt=" + mkt + "&q=" + encoded_query;
        URL url = new URL (host + path + params);
    //...
    ```

## Send a search request and receive a response

1. In the `search()` function created above, create a new `HttpsURLConnection` object with `url.openCOnnection()`. Set the request method to `GET`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

    ```java
    //...
    HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
    connection.setRequestMethod("GET");
    connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
    connection.setDoOutput(true);
    //...
    ```

2. Create a new `StringBuilder`. Use a new `InputStreamReader` as a parameter when instantiating  `BufferedReader` to read the API response.

    ```java
    //...
    StringBuilder response = new StringBuilder ();
    BufferedReader in = new BufferedReader(
        new InputStreamReader(connection.getInputStream()));
    //...
    ```

3. Create a `String` object to store the response from the `BufferedReader`. Iterate through it, and append each line to the string. Then, close the reader and return the response.

    ```java
    String line;

    while ((line = in.readLine()) != null) {
      response.append(line);
    }
    in.close();

    return response.toString();
    ```

## Format the JSON response

1. Create a new function called `prettify` to format the JSON response. Create a new `JsonParser`, call `parse()` on the JSON text, and then store it as a JSON object.

2. Use the Gson library to create a new `GsonBuilder()`, use `setPrettyPrinting().create()` to format the JSON, and then return it.

   ```java
   //...
   public static String prettify (String json_text) {
    JsonParser parser = new JsonParser();
    JsonObject json = parser.parse(json_text).getAsJsonObject();
    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    return gson.toJson(json);
   }
   //...
   ```

## Call the search function

- From the main method of your project, call `search()`, and use `prettify()` to format the text.

    ```java
      public static void main(String[] args) {
        try {
          String response = search ();
          System.out.println (prettify (response));
        }
        catch (Exception e) {
          System.out.println (e);
        }
      }
    ```

## Example JSON response

A successful response is returned in JSON, as shown in the following example:

```json
{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "italian restaurant near me",
    "askUserForLocation": true
  },
  "places": {
    "value": [
      {
        "_type": "LocalBusiness",
        "webSearchUrl": "https://www.bing.com/search?q=sinful+bakery&filters=local...",
        "name": "Liberty's Delightful Sinful Bakery & Cafe",
        "url": "https://www.contoso.com/",
        "entityPresentationInfo": {
          "entityScenario": "ListItem",
          "entityTypeHints": [
            "Place",
            "LocalBusiness"
          ]
        },
        "address": {
          "addressLocality": "Seattle",
          "addressRegion": "WA",
          "postalCode": "98112",
          "addressCountry": "US",
          "neighborhood": "Madison Park"
        },
        "telephone": "(800) 555-1212"
      },

      . . .
      {
        "_type": "Restaurant",
        "webSearchUrl": "https://www.bing.com/search?q=Pickles+and+Preserves...",
        "name": "Munson's Pickles and Preserves Farm",
        "url": "https://www.princi.com/",
        "entityPresentationInfo": {
          "entityScenario": "ListItem",
          "entityTypeHints": [
            "Place",
            "LocalBusiness",
            "Restaurant"
          ]
        },
        "address": {
          "addressLocality": "Seattle",
          "addressRegion": "WA",
          "postalCode": "98101",
          "addressCountry": "US",
          "neighborhood": "Capitol Hill"
        },
        "telephone": "(800) 555-1212"
      },

      . . .
    ]
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](../tutorial-bing-entities-search-single-page-app.md)

* [What is the Bing Entity Search API?](../overview.md)
* [Bing Entity Search API reference](/rest/api/cognitiveservices-bingsearch/bing-entities-api-v7-reference).
