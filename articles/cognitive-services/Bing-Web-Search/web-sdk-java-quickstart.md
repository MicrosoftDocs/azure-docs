---
title: "Quickstart: Use the Bing Web Search SDK for Java"
description: Setup for Web Search SDK console application.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 08/16/2018
ms.author: v-gedod, erhopf
---

# Quickstart: Use the Bing Web Search SDK for Java

This quickstart uses the Bing Web Search SDK to instantiate a client and make calls to the Bing Web Search API. After completing this guide, your Java app will make four calls to the Bing Web Search API, illustrating how requests can be configured to return

Source code for the [Bing Web Search SDK for Java sample](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master/Search/BingWebSearch) is available on GitHub.

## Prerequisites

* Install Bing Web Search SDK dependencies using Maven, Gradle, or your favorite dependency management system. The Maven POM file requires:
  ```
  <dependencies>
    <dependency>
      <groupId>com.microsoft.azure.cognitiveservices</groupId>
      <artifactId>azure-cognitiveservices-websearch</artifactId>
      <version>0.0.1-beta-SNAPSHOT</version>
    </dependency>
  </dependencies>
  ```

## Set up your client and call the Bing Web Search API

Let's start by adding imports to the class implementation:

```
import com.microsoft.azure.cognitiveservices.websearch.*;
import com.microsoft.azure.cognitiveservices.websearch.implementation.SearchResponseInner;
import com.microsoft.azure.cognitiveservices.websearch.implementation.WebSearchAPIImpl;
import com.microsoft.rest.credentials.ServiceClientCredentials;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
```

Implement the `WebSearchAPIImpl` client, which requires an instance of `ServiceClientCredentials`:

```
public static WebSearchAPIImpl getClient(final String subscriptionKey) {
    return new WebSearchAPIImpl("https://api.cognitive.microsoft.com/bing/v7.0/",
            new ServiceClientCredentials() {
                @Override
                public void applyCredentialsFilter(OkHttpClient.Builder builder) {
                    builder.addNetworkInterceptor(
                            new Interceptor() {
                                @Override
                                public Response intercept(Chain chain) throws IOException {
                                    Request request = null;
                                    Request original = chain.request();
                                    // Request customization: add request headers
                                    Request.Builder requestBuilder = original.newBuilder()
                                            .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                                    request = requestBuilder.build();
                                    return chain.proceed(request);
                                }
                            });
                }
            });
}

```

This method searches for a single query, "Xbox", and prints `name`, and `URL` for first web, image, news, and videos results.

```
public static void WebSearchResultTypesLookup(String subscriptionKey)
{
    WebSearchAPIImpl client = getClient(subscriptionKey);

    try
    {
        SearchResponseInner webData = client.webs().search("Yosemite");
        System.out.println("\r\nSearched for Query# \" Yosemite \"");

        // Web pages
        if (webData.webPages().value().size() > 0)
        {
            // Find the first web page
            WebPage firstWebPagesResult = webData.webPages().value().get(0);

            if (firstWebPagesResult != null)
            {
                System.out.println(String.format("Webpage Results#%d", webData.webPages().value().size()));
                System.out.println(String.format("First web page name: %s ", firstWebPagesResult.name()));
                System.out.println(String.format("First web page URL: %s ", firstWebPagesResult.url()));
            }
            else
            {
                System.out.println("Couldn't find web results!");
            }
        }
        else
        {
            System.out.println("Didn't see any Web data..");
        }

        // Images
        if (webData.images().value().size() > 0)
        {
            // Find the first image result
            ImageObject firstImageResult = webData.images().value().get(0);

            if (firstImageResult != null)
            {
                System.out.println(String.format("Image Results#%d", webData.images().value().size()));
                System.out.println(String.format("First Image result name: %s ", firstImageResult.name()));
                System.out.println(String.format("First Image result URL: %s ", firstImageResult.contentUrl()));
            }
            else
            {
                System.out.println("Couldn't find first image results!");
            }
        }
        else
        {
            System.out.println("Didn't see any image data..");
        }

        // News
        if (webData.news().value().size() > 0)
        {
            // Find the first news result
            NewsArticle firstNewsResult = webData.news().value().get(0);

            if (firstNewsResult != null)
            {
                System.out.println(String.format("News Results#%d", webData.news().value().size()));
                System.out.println(String.format("First news result name: %s ", firstNewsResult.name()));
                System.out.println(String.format("First news result URL: %s ", firstNewsResult.url()));
            }
            else
            {
                System.out.println("Couldn't find any News results!");
            }
        }
        else
        {
            System.out.println("Didn't see first news data..");
        }

        // Videos
        if (webData.videos() != null && webData.videos().value().size() > 0)
        {
            // Find the first video result
            VideoObject firstVideoResult = webData.videos().value().get(0);

            if (firstVideoResult != null)
            {
                System.out.println(String.format("Video Results#%s", webData.videos().value().size()));
                System.out.println(String.format("First Video result name: %s ", firstVideoResult.name()));
                System.out.println(String.format("First Video result URL: %s ", firstVideoResult.contentUrl()));
            }
            else
            {
                System.out.println("Couldn't find first video results!");
            }
        }
        else
        {
            System.out.println("Didn't see any video data..");
        }
    }

    catch (ErrorResponseException ex)
    {
        System.out.println("Encountered exception. " + ex.getLocalizedMessage());
    }

}

```

This method searches for "Best restaurants in Seattle", verifies the results, and prints the `name` and `URL` for the first result:

```
public static void WebResultsWithCountAndOffset(String subscriptionKey)
{
    WebSearchAPIImpl client = getClient(subscriptionKey);

    try
    {
        SearchResponseInner webData = client.webs().search(
                "Best restaurants in Seattle", null, null, null, null, null, 10, null, 20, null, "en-us", null,
                        null, null, SafeSearch.STRICT, null, null, null);
        System.out.println("\r\nSearched for Query# \" Best restaurants in Seattle \"");

        if (webData.webPages().value().size() > 0)
        {
            // Find the first web page
            WebPage firstWebPagesResult = webData.webPages().value().get(0);

            if (firstWebPagesResult != null)
            {
                System.out.println(String.format("Web Results#%d", webData.webPages().value().size()));
                System.out.println(String.format("First web page name: %s ", firstWebPagesResult.name()));
                System.out.println(String.format("First web page URL: %s ", firstWebPagesResult.url()));
            }
            else
            {
                System.out.println("Couldn't find first web result!");
            }
        }
        else
        {
            System.out.println("Didn't see any Web data..");
        }
    }
    catch (ErrorResponseException ex)
    {
        System.out.println("Encountered exception. " + ex.getLocalizedMessage());
    }
}

```

This method searches for "Microsoft" with response filters assigned to `news`, and prints details for the first news item.

```
public static void WebSearchWithResponseFilter(String subscriptionKey)
{
    WebSearchAPIImpl client = getClient(subscriptionKey);

    try
    {
        List<AnswerType> responseFilterstrings = new ArrayList<AnswerType>();
        responseFilterstrings.add(AnswerType.NEWS);
        SearchResponseInner webData = client.webs().search(
        "Best restaurants in Seattle", null, null, null, null, null, 10, null, 20, null, "en-us", null,
                null, responseFilterstrings, SafeSearch.STRICT, null, null, null);

        System.out.println("\\r\\nSearched for Query# \" Microsoft \" with response filters \"news\"");

        // News
        if (webData.news() != null && webData.news().value().size() > 0)
        {
            // Find the first news result
            NewsArticle firstNewsResult = webData.news().value().get(0);

            if (firstNewsResult != null)
            {
                System.out.println(String.format("News Results#%d", webData.news().value().size()));
                System.out.println(String.format("First news result name: %s ", firstNewsResult.name()));
                System.out.println(String.format("First news result URL: %s ", firstNewsResult.url()));
            }
            else
            {
                System.out.println("Couldn't find first News results!");
            }
        }
        else
        {
            System.out.println("Didn't see any News data..");
        }

    }
    catch (ErrorResponseException ex)
    {
        System.out.println("Encountered exception. " + ex.getLocalizedMessage());
    }
}

```

This method searches for "Niagara Falls", using the `answerCount` and `promote` parameters, and prints the results.

```
public static void WebSearchWithAnswerCountPromoteAndSafeSearch(String subscriptionKey)
{
    WebSearchAPIImpl client = getClient(subscriptionKey);

    try
    {
        List<AnswerType> promoteAnswertypeStrings = new ArrayList<AnswerType>();
        promoteAnswertypeStrings.add(AnswerType.VIDEOS);
        SearchResponseInner webData = client.webs().search(
            "Niagara Falls", null, null, null, null, null, 10, null, 20, null, "en-us", null,
            promoteAnswertypeStrings, null, SafeSearch.STRICT, null, null, null);
        System.out.println("\r\nSearched for Query# \" Niagara Falls \"");

        if (webData.videos().value().size() > 0)
        {
            VideoObject firstVideosResult = webData.videos().value().get(0);

            if (firstVideosResult != null)
            {
                System.out.println(String.format("Video Results#%d", webData.videos().value().size()));
                System.out.println(String.format("First Video result name: %s ", firstVideosResult.name()));
                System.out.println(String.format("First Video result URL: %s ", firstVideosResult.contentUrl()));
            }
            else
            {
                System.out.println("Couldn't find videos results!");
            }
        }
        else
        {
            System.out.println("Didn't see any data..");
        }
    }
    catch (ErrorResponseException ex)
    {
        System.out.println("Encountered exception. " + ex.getLocalizedMessage());
    }
}

```

Add the previous methods to a class with main function to run the code:
```
package javaWebSDK;
import com.microsoft.azure.cognitiveservices.websearch.*;
public class webSDK{

	public static void main(String [ ] args) {

		WebSearchResultTypesLookup("YOUR-SUBSCRIPTION-KEY");
		WebResultsWithCountAndOffset("YOUR-SUBSCRIPTION-KEY");
		WebSearchWithResponseFilter("YOUR-SUBSCRIPTION-KEY");
		WebSearchWithAnswerCountPromoteAndSafeSearch("YOUR-SUBSCRIPTION-KEY");

	}
    // Add methods previously documented.
}
```


## Next steps

* Review the [Cognitive Services Java SDK samples](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples).
