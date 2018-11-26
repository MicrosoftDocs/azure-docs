---
title: "Quickstart: Identify language from text, C# - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to detect the language of provided text using .NET Core and the Translator Text REST API.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 11/26/2018
ms.author: erhopf
---

# Quickstart: Detect text language with the Translator Text REST API (C#)

In this quickstart, you'll learn how to detect the language of provided text using .NET Core and the Translator Text REST API.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

## Prerequisites

* [.NET SDK](https://www.microsoft.com/net/learn/dotnet/hello-world-tutorial)
* [Json.NET NuGet Package](https://www.nuget.org/packages/Newtonsoft.Json/)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Service

## Create a .NET Core project

Open a new command prompt (or terminal session) and run these commands:

```console
dotnet new console -o detect-sample
cd detect-sample
```

The first command does two things. It creates a new .NET console application, and creates a directory named `detect-sample`. The second command changes to the directory for your project.

Next, you'll need to install Json.Net. From your project's directory, run:

```console
dotnet add package Newtonsoft.Json --version 11.0.2
```

## Add required namespaces to your project

The `dotnet new console` command that you ran earlier created a project, including `Program.cs`. This file is where you'll put your application code. Open `Program.cs`, and replace the existing using statements. These statements ensure that you have access to all the types required to build and run the sample app.

```csharp
using System;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
```

## Create a function to detect the source text's language

Within the `Program` class, create a function called `Detect`. This class encapsulates the code used to call the Detect resource and prints the result to console.

```csharp
static void Detect()
{
  /*
   * The code for your call to the translation service will be added to this
   * function in the next few sections.
   */
}
```

## Set the subscription key, host name, and path

Add these lines to the `Detect` function.

```csharp
string host = "https://api.cognitive.microsofttranslator.com";
string route = "/detect?api-version=3.0";
string subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
```

Next, we need to create and serialize the JSON object that includes the text that will undergo language detection.

```csharp
System.Object[] body = new System.Object[] { new { Text = @"Salve mondo!" } };
var requestBody = JsonConvert.SerializeObject(body);
```

## Instantiate the client and make a request

These lines instantiate the `HttpClient` and the `HttpRequestMessage`:

```csharp
using (var client = new HttpClient())
using (var request = new HttpRequestMessage())
{
  // In the next few sections you'll add code to construct the request.
}
```

## Construct the request and print the response

Inside the `HttpRequestMessage` you'll:

* Declare the HTTP method
* Construct the request URI
* Insert the request body (serialized JSON object)
* Add required headers
* Make an asynchronous request
* Print the response

Add this code to the `HttpRequestMessage`:

```csharp
// Set the method to POST
request.Method = HttpMethod.Post;

// Construct the full URI
request.RequestUri = new Uri(host + route);

// Add the serialized JSON object to your request
request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");

// Add the authorization header
request.Headers.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

// Send request, get response
var response = client.SendAsync(request).Result;
var jsonResponse = response.Content.ReadAsStringAsync().Result;

// Print the response
Console.WriteLine(jsonResponse);
Console.WriteLine("Press any key to continue.");
```

## Put it all together

The last step is to call `Detect()` in the `Main` function. Locate `static void Main(string[] args)` and add these lines:

```csharp
Detect();
Console.ReadLine();
```

## Run the sample app

That's it, you're ready to run your sample app. From the command line (or terminal session), navigate to your project directory and run:

```console
dotnet run
```

## Sample response

```json
[
  {
    "language": "it",
    "score": 1.0,
    "isTranslationSupported": true,
    "isTransliterationSupported": false,
    "alternatives": [
      {
        "language": "pt",
        "score": 1.0,
        "isTranslationSupported": true,
        "isTransliterationSupported": false
      },
      {
        "language": "en",
        "score": 1.0,
        "isTranslationSupported": true,
        "isTransliterationSupported": false
      }
    ]
  }
]
```

## Clean up resources

Make sure to remove any confidential information from your sample app's source code, like subscription keys.

## Next steps

Explore the sample code for this quickstart and others, including translation and transliteration, as well as other sample Translator Text projects on GitHub.

> [!div class="nextstepaction"]
> [Explore C# examples on GitHub](https://aka.ms/TranslatorGitHub?type=&language=c%23)

## See also

* [Translate text](quickstart-csharp-translate.md)
* [Transliterate text](quickstart-csharp-transliterate.md)
* [Get alternate translations](quickstart-csharp-dictionary.md)
* [Get a list of supported languages](quickstart-csharp-languages.md)
* [Determine sentence lengths from an input](quickstart-csharp-sentences.md)
