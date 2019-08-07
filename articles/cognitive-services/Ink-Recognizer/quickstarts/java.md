---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and Java"
titleSuffix: Azure Cognitive Services
description: Use the Ink Recognizer API to start recognizing digital ink strokes.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: quickstart
ms.date: 05/02/2019
ms.author: aahi
---

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and Java

Use this quickstart to begin using the Ink Recognizer API on digital ink strokes. This Java application sends an API request containing JSON-formatted ink stroke data, and gets the response.

While this application is written in Java, the API is a RESTful web service compatible with most programming languages.

Typically you would call the API from a digital inking app. This quickstart sends ink stroke data for the following handwritten sample from a JSON file.

![an image of handwritten text](../media/handwriting-sample.jpg)

The source code for this quickstart can be found on [GitHub](https://go.microsoft.com/fwlink/?linkid=2089904).

## Prerequisites

- The [Java&trade; Development Kit(JDK) 7](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or later.

- Import these libraries from the Maven Repository
    - [JSON in Java](https://mvnrepository.com/artifact/org.json/json) package
    - [Apache HttpClient](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) package

- The example ink stroke data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/java/InkRecognition/quickstart/example-ink-strokes.json).

[!INCLUDE [cognitive-services-ink-recognizer-signup-requirements](../../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]

## Create a new application

1. Create a new Java project in your favorite IDE or editor, and import the following libraries.

    ```java
    import org.apache.http.HttpEntity;
    import org.apache.http.client.methods.CloseableHttpResponse;
    import org.apache.http.client.methods.HttpPost;
    import org.apache.http.entity.StringEntity;
    import org.apache.http.impl.client.CloseableHttpClient;
    import org.apache.http.impl.client.HttpClients;
    import org.apache.http.util.EntityUtils;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;
    ```

2. Create variables for your subscription key and your endpoint. Below is the URI you can use for ink recognition. It will be appended to your service endpoint later to create the API request URL.

    ```java
    // Replace the subscriptionKey string value with your valid subscription key.
    static final String subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
    // Replace the dataPath string with a path to the JSON formatted ink stroke data file.
    static final String dataPath = "PATH_TO_INK_STROKE_DATA";
    
    static final String endpoint = "https://api.cognitive.microsoft.com";
    static final String inkRecognitionUrl = "/inkrecognizer/v1.0-preview/recognize";
    ```

## Create a function to send requests

1. Create a new function called `sendRequest()` that takes the variables created above. Then perform the following steps.

2. Create a `CloseableHttpClient` object that can send requests to the API. Send the request to an `HttpPut` request object by combining your endpoint, and the Ink Recognizer URL.

3. Use the request's `setHeader()` function to set the `Content-Type` header to `application/json`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

4. Use the request's `setEntity()` function to the data to be sent.   

5. Use the client's `execute()` function to send the request, and save it to a `CloseableHttpResponse` object. 

6. Create an `HttpEntity` object to store the response content. Get the content with `getEntity()`. If the response isn't empty, return it.
    
    ```java
    static String sendRequest(String apiAddress, String endpoint, String subscriptionKey, String requestData) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPut request = new HttpPut(endpoint + apiAddress);
            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            request.setEntity(new StringEntity(requestData));
            try (CloseableHttpResponse response = client.execute(request)) {
                HttpEntity respEntity = response.getEntity();
                if (respEntity != null) {
                    return EntityUtils.toString(respEntity, "utf-8");
                }
            } catch (Exception respEx) {
                respEx.printStackTrace();
            }
        } catch (IOException ex) {
            System.err.println("Exception recognizing ink: " + ex.getMessage());
            ex.printStackTrace();
        }
        return null;
    }
    ```

## Send an ink recognition request

Create a method called `recognizeInk()` to recognize your ink stroke data. Call the `sendRequest()` method created above with your endpoint, url, subscription key, and json data. Get the result, and print it to the console.

```java
static void recognizeInk(String requestData) {
    System.out.println("Sending an ink recognition request");
    String result = sendRequest(inkRecognitionUrl, endpoint, subscriptionKey, requestData);
    System.out.println(result);
}
```

## Load your digital ink data and send the request

1. In the main method of your application, read in the JSON file containing the data that will be added to the requests.

2. Call the ink recognition function created above.
    
    ```java
    public static void main(String[] args) throws Exception {
        String requestData = new String(Files.readAllBytes(Paths.get(dataPath)), "UTF-8");
        recognizeInk(requestData);
    }
    ```

## Run the application and view the response

Run the application. A successful response is returned in JSON format. You can also find the JSON response on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/java/InkRecognition/quickstart/example-response.json).

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://go.microsoft.com/fwlink/?linkid=2089907)


To see how the Ink Recognition API works in a digital inking app, take a look at the following sample applications on GitHub:
* [C# and Universal Windows Platform(UWP)](https://go.microsoft.com/fwlink/?linkid=2089803)  
* [C# and Windows Presentation Foundation(WPF)](https://go.microsoft.com/fwlink/?linkid=2089804)
* [Javascript web-browser app](https://go.microsoft.com/fwlink/?linkid=2089908)       
* [Java and Android mobile app](https://go.microsoft.com/fwlink/?linkid=2089906)
* [Swift and iOS mobile app](https://go.microsoft.com/fwlink/?linkid=2089805)
