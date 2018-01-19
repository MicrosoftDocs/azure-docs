---
title: Java Quickstart for Azure Cognitive Services, Bing Entity Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Entity Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jaswel

ms.service: cognitive-services
ms.technology: entity-search
ms.topic: article
ms.date: 11/28/2017
ms.author: v-jaswel

---
# Quickstart for Microsoft Bing Entity Search API with Java 
<a name="HOLTop"></a>

This article shows you how to use the [Bing Entity Search](https://docs.microsoft.com/azure/cognitive-services/bing-entities-search/search-the-web) API with Java.

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Entity Search API**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-entity-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Search entities

To run this application, follow these steps.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 *
 * Once you have compiled or downloaded gson-2.8.1.jar, assuming you have placed it in the
 * same folder as this file (EntitySearch.java), you can compile and run this program at
 * the command line as follows.
 *
 * javac EntitySearch.java -cp .;gson-2.8.1.jar
 * java -cp .;gson-2.8.1.jar EntitySearch
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class EntitySearch {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsoft.com";
	static String path = "/bing/v7.0/entities";

	static String mkt = "en-US";
	static String query = "italian restaurant near me";

	public static String search () throws Exception {
        String encoded_query = URLEncoder.encode (query, "UTF-8");
        String params = "?mkt=" + mkt + "&q=" + encoded_query;
		URL url = new URL (host + path + params);

		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
    }

	public static String prettify (String json_text) {
		JsonParser parser = new JsonParser();
		JsonObject json = parser.parse(json_text).getAsJsonObject();
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = search ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Response**

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
        "webSearchUrl": "https://www.bing.com/search?q=Park+Place&filters=local_ypid:%22YN873x5786319842120194005%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Park Place",
        "url": "https://www.restaurantparkplace.com/",
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
        "telephone": "(206) 453-5867"
      },
      {
        "_type": "LocalBusiness",
        "webSearchUrl": "https://www.bing.com/search?q=Pasta+and+Company&filters=local_ypid:%22YN873x2257558900374394159%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Pasta and Company",
        "url": "http://www.pastaco.com/",
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
          "postalCode": "98121",
          "addressCountry": "US",
          "neighborhood": ""
        },
        "telephone": "(206) 322-1644"
      },
      {
        "_type": "LocalBusiness",
        "webSearchUrl": "https://www.bing.com/search?q=Calozzi%27s+Cheesesteaks-Italian&filters=local_ypid:%22YN925x222744375%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Calozzi's Cheesesteaks-Italian",
        "entityPresentationInfo": {
          "entityScenario": "ListItem",
          "entityTypeHints": [
            "Place",
            "LocalBusiness"
          ]
        },
        "address": {
          "addressLocality": "Bellevue",
          "addressRegion": "WA",
          "postalCode": "98008",
          "addressCountry": "US",
          "neighborhood": "Crossroads"
        },
        "telephone": "(425) 221-5116"
      },
      {
        "_type": "Restaurant",
        "webSearchUrl": "https://www.bing.com/search?q=Princi&filters=local_ypid:%22YN873x3764731790710239496%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Princi",
        "url": "http://www.princi.com/",
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
        "telephone": "(206) 624-0173"
      },
      {
        "_type": "Restaurant",
        "webSearchUrl": "https://www.bing.com/search?q=Swedish+Ballard+Cafeteria&filters=local_ypid:%22YN873x9787543113095303180%22&elv=AXXfrEiqqD9r3GuelwApulqDCgnOZrYZ*RB3VGaWfk8gK7yMNsMKZ091jipuxw7sD8M5EX84K6nRW*6aYSd2s*n!ZICJHXshywvARqsAvOi4",
        "name": "Swedish Ballard Cafeteria",
        "url": "http://www.swedish.com/",
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
          "postalCode": "98107",
          "addressCountry": "US",
          "neighborhood": "Ballard"
        }
      }
    ]
  }
}
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Bing Entity Search tutorial](../tutorial-bing-entities-search-single-page-app.md)

## See also 

[Bing Entity Search overview](../search-the-web.md )
[API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference)
