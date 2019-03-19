---
title: Detect anomalies in your time series data using the Anomaly Detector REST API and Java | Microsoft Docs
description: Use the Anomaly Detector API to detect abnormalities in your data series as a batch.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: article
ms.date: 03/01/2019
ms.author: aahi
---

# Detect anomalies in your time series data using the Anomaly Detector REST API and Java

Use this quickstart to start using the Anomaly Detector API's two detection modes to detect anomalies in your time series data. This Java application sends two API requests containing JSON-formatted time series data, and gets the responses. 

| API request                                        | Application output                                                                                                                         |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Detect anomalies as a batch                        | The JSON response containing the anomaly status (and other data) for each data point in the time series data, and the positions of any detected anomalies. |
| Detect the anomaly status of the latest data point | The JSON response containing the anomaly status (and other data) for the latest data point in the time series data.                                                                                                                                         |

 While this application is written in Java, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

- The [Java&trade; Development Kit(JDK) 7](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or later.

- Import these libraries from the Maven Repository
    - [JSON in Java](https://mvnrepository.com/artifact/org.json/json) package
    - [Apache HttpClient](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) package

- A JSON file containing time series data points. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

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

2. Create variables for your subscription key, and your endpoint. Below are the URLs you can use for anomaly detection. These will later be appended to your endpoint to create the API request URLs.

    |Detection method  |URL  |
    |---------|---------|
    |Batch detection    | `/anomalydetector/v1.0/timeseries/entire/detect`        |
    |Detection on the latest data point     | `/anomalydetector/v1.0/timeseries/last/detect`        |

    ```java
    // Replace the subscriptionKey string value with your valid subscription key.
    static final String subscriptionKey = "[YOUR_SUBSCRIPTION_KEY]";
    //replace the endpoint URL with the correct one for your subscription. Your endpoint can be found in the Azure portal. For example: https://westus2.api.cognitive.microsoft.com
    static final String endpoint = "[YOUR_ENDPOINT_URL]";
    // Replace the dataPath string with a path to the JSON formatted time series data.
    static final String dataPath = "[PATH_TO_TIME_SERIES_DATA]";
    static final String latestPointDetectionUrl = "/anomalydetector/v1.0/timeseries/last/detect";
    static final String batchDetectionUrl = "/anomalydetector/v1.0/timeseries/entire/detect";
    ```

3. Read in the JSON data file

    ```java
    String requestData = new String(Files.readAllBytes(Paths.get(dataPath)), "UTF-8");
    ```

## Create a function to send requests


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

## Detect anomalies as a batch

```java
static void detectAnomaliesBatch(String requestData) {
    System.out.println("Detecting anomalies as a batch");
    String result = sendRequest(batchDetectionUrl, endpoint, subscriptionKey, requestData);
    if (result != null) {
        System.out.println(result);
        JSONObject jsonObj = new JSONObject(result);
        JSONArray jsonArray = jsonObj.getJSONArray("isAnomaly");
        System.out.println("Anomalies found in the following data positions:");
        for (int i = 0; i < jsonArray.length(); ++i) {
            if (jsonArray.getBoolean(i))
                System.out.print(i + ", ");
        }
        System.out.println();
    }
}
```

## Get the anomaly status of the latest data point

```java
static void detectAnomaliesLatest(String requestData) {
    System.out.println("Determining if latest data point is an anomaly");
    String result = sendRequest(latestPointDetectionUrl, endpoint, subscriptionKey, requestData);
    System.out.println(result);
}
```

## Load your time series data and send the request

```java
public static void main(String[] args) throws Exception {
    String requestData = new String(Files.readAllBytes(Paths.get(dataPath)), "UTF-8");
    detectAnomaliesBatch(requestData);
    detectAnomaliesLatest(requestData);
}
```

### Example of time series data

 Click [here](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json) to see sample time series data.

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

## Next steps

> [!div class="nextstepaction"]
> [Visualize anomalies using Python](../tutorials/visualize-anomalies-using-python.md)
> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect)