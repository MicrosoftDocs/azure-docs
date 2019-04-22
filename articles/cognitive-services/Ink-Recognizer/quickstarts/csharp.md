---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and C#"
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

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and C#

Use this quickstart to begin using the Ink Recognizer API on digital ink strokes. This C# application sends an API request containing JSON-formatted ink stroke data, and gets the response.

 While this application is written in C#, the API is a RESTful web service compatible with most programming languages.

## Prerequisites

- Any edition of [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/).
- [Newtonsoft.Json](https://www.newtonsoft.com/json)
    - To install Newtonsoft.Json as a NuGet package in Visual studio:
        1. Right click on the **Solution Manager**
        2. Click **Manage NuGet Packages...**
        3. Search for `Newtonsoft.Json` and install the package
- If you are using Linux/MacOS, this application can be ran using [Mono](http://www.mono-project.com/).

Usually you would call the API from a digital inking app. This quickstart sends ink stroke data for the following handwritten sample from a JSON file.

![an image of handwritten text](../media/handwriting-sample.jpg)

The example ink stroke data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

[!INCLUDE [cognitive-services-ink-recognizer-signup-requirements](../../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]


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

2. Create variables for your subscription key and your endpoint. Below is the URIs you can use for anomaly detection. These will be appended to your service endpoint later to create the API request URLs.

    ```csharp
    // Replace the subscriptionKey string value with your valid subscription key.
    const string subscriptionKey = "[YOUR_SUBSCRIPTION_KEY]";
    // Replace the endpoint URL with the correct one for your subscription. 
    // Your endpoint can be found in the Azure portal. For example: https://westus2.api.cognitive.microsoft.com
    const string endpoint = "[YOUR_ENDPOINT_URL]";
    // Replace the dataPath string with a path to the JSON formatted time series data.
    const string dataPath = "[PATH_TO_TIME_SERIES_DATA]";
    const string inkRecognitionUrl = "<url>";
    ```

## Create a function to send requests

1. Create a new async function called `Request` that takes the variables created above.

2. Set the client's security protocol and header information using an `HttpClient` object. Be sure to add your subscription key to the `Ocp-Apim-Subscription-Key` header. Then create a `StringContent` object for the request.
 
3. Send the request with `PostAsync()`. If the request is successful, return the response.  

```csharp
static async Task<string> Request(string baseAddress, string endpoint, string subscriptionKey, string requestData){
    using (HttpClient client = new HttpClient { BaseAddress = new Uri(baseAddress) }){
        System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

        var content = new StringContent(requestData, Encoding.UTF8, "application/json");
        var res = await client.PostAsync(endpoint, content);
        if (res.IsSuccessStatusCode){
            return await res.Content.ReadAsStringAsync();
        }
        else{
            return $"ErrorCode: {res.StatusCode}";
        }
    }
}
```

## Send an ink recognition request

1. Create a new function called `recognizeInk()`. Construct the request and send it by calling the `Request()` function with your endpoint, subscription key, the URL for the API, and the digital ink stroke data.

2. Deserialize the JSON object, and write it to the console. 

```csharp
static void recognizeInk(string requestData){
    System.Console.WriteLine("Sending an ink recognition request");
    var result = Request(
        endpoint,
        latestPointDetectionUrl,
        subscriptionKey,
        requestData).Result;

    dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(result);
    System.Console.WriteLine(jsonObj);
}
```

## Load your digital ink data and send the request

1. In the main method of your application, load your JSON data with `File.ReadAllText()`. 

2. Call the Ink recognition function created above. Use `System.Console.ReadKey()` to keep the console window open after running the application.

```csharp
static void Main(string[] args){

    var requestData = File.ReadAllText(dataPath);

    recognizeInk(requestData);

    System.Console.ReadKey();
}
```

### Example response

A successful response is returned in JSON format. Click the links below to view the JSON response on GitHub:

* TBD

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://dev.cognitive.microsoft.com/docs/services/inkrecognizer)

* [What is the Ink Recognizer API?](../overview.md)
