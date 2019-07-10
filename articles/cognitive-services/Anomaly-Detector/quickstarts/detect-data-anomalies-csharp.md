---
title: "Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and C#"
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API to detect abnormalities in your data series either as a batch or on streaming data.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: quickstart
ms.date: 03/26/2019
ms.author: aahi
---

# Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and C# 

Use this quickstart to start using the Anomaly Detector API's two detection modes to detect anomalies in your time series data. This C# application sends two API requests containing JSON-formatted time series data, and gets the responses.

| API request                                        | Application output                                                                                                                         |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Detect anomalies as a batch                        | The JSON response containing the anomaly status (and other data) for each data point in the time series data, and the positions of any detected anomalies. |
| Detect the anomaly status of the latest data point | The JSON response containing the anomaly status (and other data) for the latest data point in the time series data.                                                                                                                                         |

 While this application is written in C#, the API is a RESTful web service compatible with most programming languages.

## Prerequisites

- Any edition of [Visual Studio 2017 or later](https://visualstudio.microsoft.com/downloads/),

- The [Json.NET](https://www.newtonsoft.com/json) framework, available as a NuGet package. To install Newtonsoft.Json as a NuGet package in Visual Studio:
    
    1. Right click your project in **Solution Explorer**.
    2. Select **Manage NuGet Packages**.
    3. Search for *Newtonsoft.Json* and install the package.

- If you're using Linux/MacOS, this application can be run by using [Mono](https://www.mono-project.com/).

- A JSON file containing time series data points. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

## Create a new application

1. In Visual Studio, create a new console solution and add the following packages. 

    ```csharp
    using System;
    using System.IO;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    ```

2. Create variables for your subscription key and your endpoint. Below are the URIs you can use for anomaly detection. These will be appended to your service endpoint later to create the API request URLs.

    |Detection method  |URI  |
    |---------|---------|
    |Batch detection    | `/anomalydetector/v1.0/timeseries/entire/detect`        |
    |Detection on the latest data point     | `/anomalydetector/v1.0/timeseries/last/detect`        |
    
    ```csharp
    // Replace the subscriptionKey string value with your valid subscription key.
    const string subscriptionKey = "[YOUR_SUBSCRIPTION_KEY]";
    // Replace the endpoint URL with the correct one for your subscription. 
    // Your endpoint can be found in the Azure portal. For example: https://westus2.api.cognitive.microsoft.com
    const string endpoint = "[YOUR_ENDPOINT_URL]";
    // Replace the dataPath string with a path to the JSON formatted time series data.
    const string dataPath = "[PATH_TO_TIME_SERIES_DATA]";
    const string latestPointDetectionUrl = "/anomalydetector/v1.0/timeseries/last/detect";
    const string batchDetectionUrl = "/anomalydetector/v1.0/timeseries/entire/detect";
    ```

## Create a function to send requests

1. Create a new async function called `Request` that takes the variables created above.

2. Set the client's security protocol and header information using an `HttpClient` object. Be sure to add your subscription key to the `Ocp-Apim-Subscription-Key` header. Then create a `StringContent` object for the request.

3. Send the request with `PostAsync()`, and then return the response.

```csharp
static async Task<string> Request(string apiAddress, string endpoint, string subscriptionKey, string requestData){
    using (HttpClient client = new HttpClient { BaseAddress = new Uri(apiAddress) }){
        System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

        var content = new StringContent(requestData, Encoding.UTF8, "application/json");
        var res = await client.PostAsync(endpoint, content);
        return await res.Content.ReadAsStringAsync();
    }
}
```

## Detect anomalies as a batch

1. Create a new function called `detectAnomaliesBatch()`. Construct the request and send it by calling the `Request()` function with your endpoint, subscription key, the URL for batch anomaly detection, and the time series data.

2. Deserialize the JSON object, and write it to the console.

3. If the response contains `code` field, print the error code and error message. 

4. Otherwise, find the positions of anomalies in the data set. The response's `isAnomaly` field contains an array of boolean values, each of which indicates whether a data point is an anomaly. Convert this to a string array with the response object's `ToObject<bool[]>()` function. Iterate through the array, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

```csharp
static void detectAnomaliesBatch(string requestData){
    System.Console.WriteLine("Detecting anomalies as a batch");

    var result = Request(
        endpoint,
        batchDetectionUrl,
        subscriptionKey,
        requestData).Result;

    dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(result);
    System.Console.WriteLine(jsonObj);

    if (jsonObj["code"] != null){
        System.Console.WriteLine($"Detection failed. ErrorCode:{jsonObj["code"]}, ErrorMessage:{jsonObj["message"]}");
    }
    else{
        bool[] anomalies = jsonObj["isAnomaly"].ToObject<bool[]>();
        System.Console.WriteLine("\nAnomalies detected in the following data positions:");
        for (var i = 0; i < anomalies.Length; i++){
            if (anomalies[i])
            {
                System.Console.Write(i + ", ");
            }
        }
    }
}
```

## Detect the anomaly status of the latest data point

1. Create a new function called `detectAnomaliesLatest()`. Construct the request and send it by calling the `Request()` function with your endpoint, subscription key, the URL for latest point anomaly detection, and the time series data.

2. Deserialize the JSON object, and write it to the console.

```csharp
static void detectAnomaliesLatest(string requestData){
    System.Console.WriteLine("\n\nDetermining if latest data point is an anomaly");
    var result = Request(
        endpoint,
        latestPointDetectionUrl,
        subscriptionKey,
        requestData).Result;

    dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(result);
    System.Console.WriteLine(jsonObj);
}
```

## Load your time series data and send the request

1. In the main method of your application, load your JSON time series data with `File.ReadAllText()`. 

2. Call the anomaly detection functions created above. Use `System.Console.ReadKey()` to keep the console window open after running the application.

```csharp
static void Main(string[] args){

    var requestData = File.ReadAllText(dataPath);

    detectAnomaliesBatch(requestData);
    detectAnomaliesLatest(requestData);

    System.Console.ReadKey();
}
```

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://westus2.dev.cognitive.microsoft.com/docs/services/AnomalyDetector/operations/post-timeseries-entire-detect)
