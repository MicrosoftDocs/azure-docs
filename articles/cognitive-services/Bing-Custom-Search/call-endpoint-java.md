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

This example shows how to request search results from your custom search instance using Java. To create this example follow these steps:

1. Create your custom instance (see [Define a custom search instance](define-your-custom-view.md)).
2. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).  

  >[!NOTE]  
  >Existing Bing Custom Search customers who have a preview key provisioned on or before October 15, 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure.  

3. Install [Java](https://www.java.com).
4. Download Apache [http components](http://www-us.apache.org/dist//httpcomponents/httpclient/binary/httpcomponents-client-4.5.3-bin.tar.gz) and place in your class path.
5. Using your Java IDE of choice create a package called com.contoso.BingCustomSearch.
6. Create the file BingCustomSearch.java and copy the following code to it.
7. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID (see step 1).

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

### Next steps
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)