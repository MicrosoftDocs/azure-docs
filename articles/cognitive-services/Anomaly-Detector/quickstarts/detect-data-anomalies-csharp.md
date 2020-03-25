---
title: "Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and C#"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Anomaly Detector API to detect abnormalities in your data series either as a batch or on streaming data.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: quickstart
ms.date: 03/24/2020
ms.author: aahi
---

# Quickstart: Detect anomalies in your time series data using the Anomaly Detector REST API and C# 

Use this quickstart to start using the Anomaly Detector API's two detection modes to detect anomalies in your time series data. This C# application sends two API requests containing JSON-formatted time series data, and gets the responses.

| API request                                        | Application output                                                                                                                                         |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Detect anomalies as a batch                        | The JSON response containing the anomaly status (and other data) for each data point in the time series data, and the positions of any detected anomalies. |
| Detect the anomaly status of the latest data point | The JSON response containing the anomaly status (and other data) for the latest data point in the time series data.                                        |

 While this application is written in C#, the API is a RESTful web service compatible with most programming languages. You can find the source code for this quickstart on [GitHub](https://github.com/Azure-Samples/AnomalyDetector/blob/master/quickstarts/csharp-detect-anomalies.cs).

## Prerequisites

- Any edition of [Visual Studio 2017 or later](https://visualstudio.microsoft.com/downloads/),
- An Anomaly detector key and endpoint
- The [Json.NET](https://www.newtonsoft.com/json) framework, available as a NuGet package. To install Newtonsoft.Json as a NuGet package in Visual Studio:
    
    1. Right click your project in **Solution Explorer**.
    2. Select **Manage NuGet Packages**.
    3. Search for *Newtonsoft.Json* and install the package.

- If you're using Linux/MacOS, this application can be run by using [Mono](https://www.mono-project.com/).

- A JSON file containing time series data points. The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

### Create an Anomaly Detector resource

[!INCLUDE [anomaly-detector-resource-creation](../../../../includes/cognitive-services-anomaly-detector-resource-cli.md)]

## Create a new application

1. In Visual Studio, create a new console solution and add the following packages. 

    [!code-csharp[using statements](~/samples-anomaly-detector/quickstarts/csharp-detect-anomalies.cs?name=usingStatements)]


2. Create variables for your subscription key and your endpoint. Below are the URIs you can use for anomaly detection. These will be appended to your service endpoint later to create the API request URLs.

    | Detection method                   | URI                                              |
    |------------------------------------|--------------------------------------------------|
    | Batch detection                    | `/anomalydetector/v1.0/timeseries/entire/detect` |
    | Detection on the latest data point | `/anomalydetector/v1.0/timeseries/last/detect`   |
        
    [!code-csharp[initial variables for endpoint, key and data file](~/samples-anomaly-detector/quickstarts/csharp-detect-anomalies.cs?name=vars)]

## Create a function to send requests

1. Create a new async function called `Request` that takes the variables created above.

2. Set the client's security protocol and header information using an `HttpClient` object. Be sure to add your subscription key to the `Ocp-Apim-Subscription-Key` header. Then create a `StringContent` object for the request.

3. Send the request with `PostAsync()`, and then return the response.

    [!code-csharp[Request method](~/samples-anomaly-detector/quickstarts/csharp-detect-anomalies.cs?name=requestMethod)]

## Detect anomalies as a batch

1. Create a new function called `detectAnomaliesBatch()`. Construct the request and send it by calling the `Request()` function with your endpoint, subscription key, the URL for batch anomaly detection, and the time series data.

2. Deserialize the JSON object, and write it to the console.

3. If the response contains `code` field, print the error code and error message. 

4. Otherwise, find the positions of anomalies in the data set. The response's `isAnomaly` field contains an array of boolean values, each of which indicates whether a data point is an anomaly. Convert this to a string array with the response object's `ToObject<bool[]>()` function. Iterate through the array, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

    [!code-csharp[Detect anomalies batch](~/samples-anomaly-detector/quickstarts/csharp-detect-anomalies.cs?name=detectAnomaliesBatch)]


## Detect the anomaly status of the latest data point

1. Create a new function called `detectAnomaliesLatest()`. Construct the request and send it by calling the `Request()` function with your endpoint, subscription key, the URL for latest point anomaly detection, and the time series data.

2. Deserialize the JSON object, and write it to the console.

    [!code-csharp[Detect anomalies latest](~/samples-anomaly-detector/quickstarts/csharp-detect-anomalies.cs?name=detectAnomaliesLatest)]
 
## Load your time series data and send the request

1. In the main method of your application, load your JSON time series data with `File.ReadAllText()`. 

2. Call the anomaly detection functions created above. Use `System.Console.ReadKey()` to keep the console window open after running the application.

    [!code-csharp[Main method](~/samples-anomaly-detector/quickstarts/csharp-detect-anomalies.cs?name=main)]

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:
* [Example batch detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/batch-response.json)
* [Example latest point detection response](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/latest-point-response.json)

[!INCLUDE [anomaly-detector-next-steps](../includes/quickstart-cleanup-next-steps.md)]
