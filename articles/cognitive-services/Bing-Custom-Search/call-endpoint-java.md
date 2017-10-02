---
title: "Bing Custom Search: Call endpoint by using Java | Microsoft Docs"
description: Describes how to call Bing Custom Search endpoint with Java
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (Java)

Call Bing Custom Search endpoint using Java by performing these steps:
1. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).
2. Install [Java](https://www.java.com).
3. Download apache [http components](http://hc.apache.org/httpcomponents-client-ga/) and place in your class path.
4. Using your Java IDE of choice create a package called com.contoso.BingCustomSearch.
5. Copy the code below.
6. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID.

``` Java
package com.contoso.BingCustomSearch;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class BingCustomSearch {
    public static void main(String[] args) throws IOException {
        String subscriptionKey = "YOUR-SUBSCRIPTION-KEY";
        String customConfigId = "YOUR-CUSTOM-CONFIG-ID";
        String searchTerm = args.length > 0 ? args[0]: "microsoft";

        String url = "https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?" +
                "q=" + searchTerm +
                "&customconfig=" + customConfigId;

        HttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet(url);
        request.addHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

        HttpResponse response = client.execute(request);
        BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

        String line = "";
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
    }
}
```
