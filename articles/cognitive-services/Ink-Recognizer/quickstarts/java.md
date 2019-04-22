---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and Java"
description: Use the Ink Recognizer API to start recognizing digital ink strokes.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: article
ms.date: 05/02/2019
ms.author: aahi
---

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and Java

Use this quickstart to begin using the Ink Recognizer API on digital ink strokes. This Java application sends an API request containing JSON-formatted ink stroke data, and gets the response.

 While this application is written in Java, the API is a RESTful web service compatible with most programming languages.

## Prerequisites

- The [Java&trade; Development Kit(JDK) 7](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or later.

- Import these libraries from the Maven Repository
    - [JSON in Java](https://mvnrepository.com/artifact/org.json/json) package
    - [Apache HttpClient](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) package

- A JSON file containing digital ink strokes. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

Usually you would call the API from an app that accepts digital inking. This quickstart simulates sending ink stroke data by using a JSON file with the ink strokes for the following drawn square. 

![an image of handwritten text](../media/handwriting-sample.jpg)


The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

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
    import org.json.JSONArray;
    import org.json.JSONObject;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Paths;
    ```

2. Create variables for your subscription key and your endpoint. Below is the URI you can use for ink recognition. These will be appended to your service endpoint later to create the API request URLs.

    ```java
    // Replace the subscriptionKey string value with your valid subscription key.
    static final String subscriptionKey = "[YOUR_SUBSCRIPTION_KEY]";
    //replace the endpoint URL with the correct one for your subscription. Your endpoint can be found in the Azure portal. 
    //For example: https://westus2.api.cognitive.microsoft.com
    static final String endpoint = "[YOUR_ENDPOINT_URL]";
    // Replace the dataPath string with a path to the JSON formatted time series data.
    static final String dataPath = "[PATH_TO_TIME_SERIES_DATA]";
    static final String inkRecognitionUrl = "<url>";
    ```

3. Read in the JSON data file

    ```java
    String requestData = new String(Files.readAllBytes(Paths.get(dataPath)), "UTF-8");
    ```

## Create a function to send requests

1. Create a new function called `sendRequest()` that takes the variables created above. Then perform the following steps.

2. Create a `CloseableHttpClient` object that can send requests to the API. Send the request to an `HttpPost` request object by combining your endpoint, and an Anomaly Detector URL.

3. Use the request's `setHeader()` function to set the `Content-Type` header to `application/json`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header.

4. Use the request's `setEntity()` function to the data to be sent.   

5. Use the client's `execute()` function to send the request, and save it to a `CloseableHttpResponse` object. 

6. Create an `HttpEntity` object to store the response content. Get the content with `getEntity()`. If the response isn't empty, return it.

```java
static String sendRequest(String apiAddress, String endpoint, String subscriptionKey, String requestData) {
    try (CloseableHttpClient client = HttpClients.createDefault()) {
        HttpPost request = new HttpPost(endpoint + apiAddress);
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
        System.err.println("Exception on Anomaly Detector: " + ex.getMessage());
        ex.printStackTrace();
    }
    return null;
}
```

## Send an ink recognition request

1. Create a method called `recognizeInk()` to detect recognize your ink stroke data. Call the `sendRequest()` method created above with your endpoint, url, subscription key, and json data. Get the result, and print it to the console.

```java
static void recognizeInk(String requestData) {
    System.out.println("Sending an ink recognition request");
    String result = sendRequest(inkRecognition, endpoint, subscriptionKey, requestData);
    System.out.println(result);
}
```

## Load your digital ink data and send the request

1. In the main method of your application, read in the JSON file containing the data that will be added to the requests.

2. Call the two anomaly detection functions created above.
    
    ```java
    public static void main(String[] args) throws Exception {
        String requestData = new String(Files.readAllBytes(Paths.get(dataPath)), "UTF-8");
        detectAnomaliesBatch(requestData);
        detectAnomaliesLatest(requestData);
    }
    ```

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://dev.cognitive.microsoft.com/docs/services/inkrecognizer)


* [What is the Ink Recognizer API?](overview.md)
* Start sending digital ink stroke data using:
    * [C#](quickstarts/csharp.md)
    * [Java](quickstarts/java.md)
    * [JavaScript](quickstarts/javascript.md)