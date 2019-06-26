---
title: "Quickstart: Search for videos using the Bing Video Search SDK for Java"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to send video search requests using the Bing Video Search SDK for Java.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-video-search
ms.topic: quickstart
ms.date: 06/26/2019
ms.author: aahi
---
# Quickstart: Perform a video search with the Bing Video Search SDK for Java

Use this quickstart to begin searching for news with the Bing Video Search SDK for Java. While Bing Video Search has a REST API compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-java-sdk-samples/tree/master/Search/BingVideoSearch), with additional annotations, and features.

## Prerequisites

* The [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html)

* The [Gson library](https://github.com/google/gson)

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](../../../../includes/cognitive-services-bing-video-search-signup-requirements.md)]

Install the Bing Video Search SDK dependencies by using Maven, Gradle, or another dependency management system. The Maven POM file requires the following declaration:

```xml
  <dependencies>
    <dependency>
      <groupId>com.microsoft.azure.cognitiveservices</groupId>
      <artifactId>azure-cognitiveservices-videosearch</artifactId>
      <version>0.0.1-beta-SNAPSHOT</version>
    </dependency>
  </dependencies> 
```

## Create and initialize a project


Create a new Java project in your favorite IDE or editor, and import the following libraries.

    ```java
    import com.microsoft.azure.cognitiveservices.videosearch.*;
    import com.microsoft.azure.cognitiveservices.videosearch.VideoObject;
    import com.microsoft.rest.credentials.ServiceClientCredentials;
    import okhttp3.Interceptor;
    import okhttp3.OkHttpClient;
    import okhttp3.Request;
    import okhttp3.Response;
    import java.io.IOException;
    import java.util.ArrayList;
    import java.util.List; 
    ```

## Create a search client

1. Implement the `VideoSearchAPIImpl` client, which requires your API endpoint, and an instance of the `ServiceClientCredentials` class.

    ```java
    public static VideoSearchAPIImpl getClient(final String subscriptionKey) {
        return new VideoSearchAPIImpl("https://api.cognitive.microsoft.com/bing/v7.0/",
                new ServiceClientCredentials() {
                //...
                }
    )};
    ```

    To implement `ServiceClientCredentials`, follow these steps:

    1. override the `applyCredentialsFilter()` function, with a `OkHttpClient.Builder` object as a parameter. 
        
        ```java
        //...
        new ServiceClientCredentials() {
                @Override
                public void applyCredentialsFilter(OkHttpClient.Builder builder) {
                //...
                }
        //...
        ```
    
    2. Within `applyCredentialsFilter()`, call `builder.addNetworkInterceptor()`. Create a new `Interceptor` object, and override its `intercept()` method to take a `Chain` interceptor object.

        ```java
        //...
        builder.addNetworkInterceptor(
            new Interceptor() {
                @Override
                public Response intercept(Chain chain) throws IOException {
                //...    
                }
            });
        ///...
        ```

    3. Within the `intercept` function, create variables for your request. Use `Request.Builder()` to build your request. Add your subscription key to the `Ocp-Apim-Subscription-Key` header, and return `chain.proceed()` on the request object.
            
        ```java
        //...
        public Response intercept(Chain chain) throws IOException {
            Request request = null;
            Request original = chain.request();
            Request.Builder requestBuilder = original.newBuilder()
                    .addHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            request = requestBuilder.build();
            return chain.proceed(request);
        }
        //...
        ```

## Send a search request and receive the response 

1. Create a function called `VideoSearch()` that takes your subscription key as a string. Instantiate the search client created earlier.
    
    ```java
    public static void VideoSearch(String subscriptionKey){
        VideoSearchAPIImpl client = VideoSDK.getClient(subscriptionKey);
        //...
    }
    ```
2. Within `VideoSearch()`, Send a video search request using the client, with `SwiftKey` as the search term. If the Video Search API returned a result, get the first result and print its id, name, and URL, along with the total number of videos returned. 
    
    ```java
    VideosInner videoResults = client.searchs().list("SwiftKey");

    if (videoResults == null){
        System.out.println("Didn't see any video result data..");
    }
    else{
        if (videoResults.value().size() > 0){
            VideoObject firstVideoResult = videoResults.value().get(0);

            System.out.println(String.format("Video result count: %d", videoResults.value().size()));
            System.out.println(String.format("First video id: %s", firstVideoResult.videoId()));
            System.out.println(String.format("First video name: %s", firstVideoResult.name()));
            System.out.println(String.format("First video url: %s", firstVideoResult.contentUrl()));
        }
        else{
            System.out.println("Couldn't find video results!");
        }
    }
    ```

3. Call the search method from your main method.

    ```java
    public static void main(String[] args) {
        VideoSDK.VideoSearch("YOUR-SUBSCRIPTION-KEY");
    }
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a single page web app](../tutorial-bing-video-search-single-page-app.md)

## See also 

* [What is the Bing Video Search API?](../overview.md)
* [Cognitive services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)