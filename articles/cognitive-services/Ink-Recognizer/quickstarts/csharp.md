---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and C#"
titleSuffix: Azure Cognitive Services
description: This quickstart shows how to use the Ink Recognizer API to start recognizing digital ink strokes.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: quickstart
ms.date: 12/17/2019
ms.author: aahi
---

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and C#

Use this quickstart to begin sending digital ink strokes to the Ink Recognizer API. This C# application sends an API request containing JSON-formatted ink stroke data, and gets the response.

While this application is written in C#, the API is a RESTful web service compatible with most programming languages.

Typically you would call the API from a digital inking app. This quickstart sends ink stroke data for the following handwritten sample from a JSON file.

![an image of handwritten text](../media/handwriting-sample.jpg)

The source code for this quickstart can be found on [GitHub](https://go.microsoft.com/fwlink/?linkid=2089502).

## Prerequisites

- Any edition of [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/).
- [Newtonsoft.Json](https://www.newtonsoft.com/json)
    - To install Newtonsoft.Json as a NuGet package in Visual studio:
        1. Right click on the **Solution Manager**
        2. Click **Manage NuGet Packages...**
        3. Search for `Newtonsoft.Json` and install the package
- If you are using Linux/MacOS, this application can be ran using [Mono](https://www.mono-project.com/).

- The example ink stroke data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Vision/InkRecognition/quickstart/example-ink-strokes.json).

### Create an Ink Recognizer resource

[!INCLUDE [creating-an-ink-recognizer-resource](../includes/setup-instructions.md)]

## Create a new application

1. In Visual Studio, create a new console solution and add the following packages. 
    
    [!code-csharp[import statements](~/cognitive-services-rest-samples/dotnet/Vision/InkRecognition/quickstart/recognizeInk.cs?name=imports)]

2. Create variables for your subscription key and endpoint, and the example JSON file. The endpoint will later be combined with `inkRecognitionUrl` to access the API. 

    [!code-csharp[endpoint file and key variables](~/cognitive-services-rest-samples/dotnet/Vision/InkRecognition/quickstart/recognizeInk.cs?name=vars)]

## Create a function to send requests

1. Create a new async function called `Request` that takes the variables created above.

2. Set the client's security protocol and header information using an `HttpClient` object. Be sure to add your subscription key to the `Ocp-Apim-Subscription-Key` header. Then create a `StringContent` object for the request.
 
3. Send the request with `PutAsync()`. If the request is successful, return the response.  
    
    [!code-csharp[request example method](~/cognitive-services-rest-samples/dotnet/Vision/InkRecognition/quickstart/recognizeInk.cs?name=request)]

## Send an ink recognition request

1. Create a new function called `recognizeInk()`. Construct the request and send it by calling the `Request()` function with your endpoint, subscription key, the URL for the API, and the digital ink stroke data.

2. Deserialize the JSON object, and write it to the console. 
    
    [!code-csharp[request to recognize ink data](~/cognitive-services-rest-samples/dotnet/Vision/InkRecognition/quickstart/recognizeInk.cs?name=recognize)]

## Load your digital ink data

Create a function called `LoadJson()` to load the ink data JSON file. Use a `StreamReader` and `JsonTextReader` to create a `JObject` and return it.

[!code-csharp[load the JSON file](~/cognitive-services-rest-samples/dotnet/Vision/InkRecognition/quickstart/recognizeInk.cs?name=loadJson)]

## Send the API request

1. In the main method of your application, load your JSON data with the function created above. 

2. Call the `recognizeInk()` function created above. Use `System.Console.ReadKey()` to keep the console window open after running the application.
    
    [!code-csharp[file main method](~/cognitive-services-rest-samples/dotnet/Vision/InkRecognition/quickstart/recognizeInk.cs?name=main)]


## Run the application and view the response

Run the application. A successful response is returned in JSON format. You can also find the JSON response on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Vision/InkRecognition/quickstart/example-response.json).


## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://go.microsoft.com/fwlink/?linkid=2089907)


To see how the Ink Recognition API works in a digital inking app, take a look at the following sample applications on GitHub:
* [C# and Universal Windows Platform(UWP)](https://go.microsoft.com/fwlink/?linkid=2089803)  
* [C# and Windows Presentation Foundation(WPF)](https://go.microsoft.com/fwlink/?linkid=2089804)
* [Javascript web-browser app](https://go.microsoft.com/fwlink/?linkid=2089908)       
* [Java and Android mobile app](https://go.microsoft.com/fwlink/?linkid=2089906)
* [Swift and iOS mobile app](https://go.microsoft.com/fwlink/?linkid=2089805)
