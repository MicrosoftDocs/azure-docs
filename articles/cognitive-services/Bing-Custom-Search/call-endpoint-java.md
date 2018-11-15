---
title: "Quickstart: Call your Bing Custom Search endpoint using Java | Microsoft Docs"
titlesuffix: Azure Cognitive Services
description: This quickstart shows how to request search results from your custom search instance by using Java to call the Bing Custom Search endpoint. 
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 05/07/2018
ms.author: v-brapel
---

# Quickstart: Call your Bing Custom Search endpoint using Java

Use this quickstart to begin requesting search results from your Bing Custom Search instance. While this application is written in Java, the Bing Custom Search API is a RESTful web service compatible with most programming languages.

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.

- The latest [Java Development Kit](https://www.oracle.com/technetwork/java/javase/downloads/index.html)  

- The [Gson library](https://github.com/google/gson)

You must have a [Cognitive Services API account](../cognitive-services-apis-create-account) with access to the Bing Custom Search API. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search) for free. Before continuing, You will need the access key provided after activating your free trial, or a paid subscription key from your Azure dashboard.

## Create and initialize the application

1. Create a new Java project in your favorite IDE or editor, and import the following libraries.

    ```java
    import java.io.InputStream;
    import java.net.URL;
    import java.net.URLEncoder;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.Scanner;
    import javax.net.ssl.HttpsURLConnection;
    import com.google.gson.Gson;
    import com.google.gson.GsonBuilder;
    import com.google.gson.JsonObject;
    import com.google.gson.JsonParser;
    ```

2. create a class named `CustomSrchJava`, and create variables for your subscription key, custom search endpoint, and your search instance's Custom Configuration ID. 
    ```java
    public class CustomSrchJava {
        static String host = "https://api.cognitive.microsoft.com";
        static String path = "/bingcustomsearch/v7.0/search";
        static String subscriptionKey = "YOUR-SUBSCRIPTION-KEY"; 
        static String customConfigId = "YOUR-CUSTOM-CONFIG-ID";
        static String searchTerm = "Microsoft";  
    ...
    ```

3. Create another class named `SearchResults` to contain the response from your Bing Custom Search instance.

    ```csharp
    class SearchResults{
        HashMap<String, String> relevantHeaders;
        String jsonResponse;
        SearchResults(HashMap<String, String> headers, String json) {
            relevantHeaders = headers;
            jsonResponse = json;
        }
    }
    ```

4. Create a function named `prettify()` to format the JSON response from the Bing Custom Search API.

```java
    // pretty-printer for JSON; uses GSON parser to parse and re-serialize
    public static String prettify(String json_text) {
        JsonParser parser = new JsonParser();
        JsonObject json = parser.parse(json_text).getAsJsonObject();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(json);
    }
```

## Making and sending a search request 

1. Create a function named `SearchWeb()` that sends a request and returns a `SearchResults` object. Create the request url by combining your Custom Configuration ID, query, and  endpoint information. Add your Subcription key to the `Ocp-Apim-Subscription-Key` header.

    ```java
    public class CustomSrchJava {
    ...
        public static SearchResults SearchWeb (String searchQuery) throws Exception {
            // construct the URL for your search request (endpoint + query string)
            URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchTerm, "UTF-8") + "&CustomConfig=" + customConfigId);
            HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();
            connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
    ...
    ```

2. Create a stream and store the JSON response in a `SearchResults` object.

    ```java
    public class CustomSrchJava {
    ...
        public static SearchResults SearchWeb (String searchQuery) throws Exception {
            ...
            // receive the JSON body
            InputStream stream = connection.getInputStream();
            String response = new Scanner(stream).useDelimiter("\\A").next();
        
            // construct result object for return
            SearchResults results = new SearchResults(new HashMap<String, String>(), response);
            
            stream.close();
            return results;
        }
    ```

3. In the main method of your application, call `SearchWeb()` with your search term, 

    ```java
    System.out.println("\nJSON Response:\n");
    System.out.println(prettify(result.jsonResponse));
    ```

## Full application code

To run this example, follow these steps:

1. Using your Java IDE of choice, create a package.  
  
2. Create a file named CustomSrchJava.java in the package and copy the following code into it. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your subscription key and configuration ID.  
  
    ```java
    import java.io.InputStream;
    import java.net.URL;
    import java.net.URLEncoder;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.Scanner;
    
    import javax.net.ssl.HttpsURLConnection;
    
    import com.google.gson.Gson;
    import com.google.gson.GsonBuilder;
    import com.google.gson.JsonObject;
    import com.google.gson.JsonParser;
    
    public class CustomSrchJava {    	
    	static String host = "https://api.cognitive.microsoft.com";
        static String path = "/bingcustomsearch/v7.0/search";
        static String subscriptionKey = "YOUR-SUBSCRIPTION-KEY"; 
        static String customConfigId = "YOUR-CUSTOM-CONFIG-ID";  
    
        static String searchTerm = "Microsoft";  // Replace with search term specific to your search scenario.
    
        public static SearchResults SearchWeb (String searchQuery) throws Exception {
            // construct URL of search request (endpoint + query string)
            URL url = new URL(host + path + "?q=" +  URLEncoder.encode(searchTerm, "UTF-8") + "&CustomConfig=" + customConfigId);
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
                System.out.println("Invalid Custom Search subscription key!");
                System.out.println("Please paste yours into the source code.");
                System.exit(1);
            }
    
            try {
                System.out.println("Searching your slice of the Web for: " + searchTerm);
    
                SearchResults result = SearchWeb(searchTerm);
    
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
  
4. Run the program.
    
## Next steps
- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)