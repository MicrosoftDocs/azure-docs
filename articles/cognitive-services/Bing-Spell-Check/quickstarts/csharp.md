---
title: "Quickstart: Check spelling with the REST API and C# - Bing Spell Check"
titleSuffix: Azure AI services
description: "Get started using the Bing Spell Check REST API and C# to check spelling and grammar."
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 05/21/2020
ms.author: aahi
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api
---

# Quickstart: Check spelling with the Bing Spell Check REST API and C#

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple C# application sends a request to the API and returns a list of suggested corrections. 

Although this application is written in C#, the API is a RESTful Web service compatible with most programming languages. The source code for this application is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/dotnet/Search/BingAutosuggestv7.cs).

## Prerequisites

* Any edition of [Visual Studio 2017 or later](https://www.visualstudio.com/downloads/).
* The Newtonsoft.Json NuGet package. 
     
   To install this package in Visual studio:

     1. In **Solution Explorer**, right-click the Solution file.
     1. Select **Manage NuGet Packages for Solution**.
     1. Search for *Newtonsoft.Json* and install the package.

* If you're using Linux/MacOS, you can run this application by using [Mono](https://www.mono-project.com/).

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]

## Create and initialize a project

1. Create a new console solution named SpellCheckSample in Visual Studio. Then, add the following namespaces into the main code file:
    
    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using Newtonsoft.Json;
    ```

2. Create variables for the API endpoint, your subscription key, and the text to be spell checked. You can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```csharp
    namespace SpellCheckSample
    {
        class Program
        {
            static string host = "https://api.cognitive.microsoft.com";
            static string path = "/bing/v7.0/spellcheck?";
            static string key = "<ENTER-KEY-HERE>";
            //text to be spell-checked
            static string text = "Hollo, wrld!";
        }
    }
    ```

3. Create a string for your search parameters: 

   1. Assign your market code to the `mkt` parameter with the `=` operator. The market code is the code of the country/region you make the request from. 

   1. Add the `mode` parameter with the `&` operator, and then assign the spell-check mode. The mode can be either `proof` (catches most spelling/grammar errors) or `spell` (catches most spelling errors, but not as many grammar errors).
    
    ```csharp
    static string params_ = "mkt=en-US&mode=proof";
    ```

## Create and send a spell check request

1. Create an asynchronous function called `SpellCheck()` to send a request to the API. Create a `HttpClient`, and add your subscription key to the `Ocp-Apim-Subscription-Key` header. Within the function, follow the next steps.

    ```csharp
    async static void SpellCheck()
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);

        HttpResponseMessage response = null;
        // add the rest of the code snippets here (except for main())...
    }
    ```

2. Create the URI for your request by appending your host, path, and parameters.
    
    ```csharp
    string uri = host + path + params_;
    ```

3. Create a list with a `KeyValuePair` object containing your text, and use it to create a `FormUrlEncodedContent` object. Set the header information, and use `PostAsync()` to send the request.

    ```csharp
    var values = new Dictionary<string, string>();
    values.Add("text", text);
    var content = new FormUrlEncodedContent(values);
    content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
    response = await client.PostAsync(uri, new FormUrlEncodedContent(values));
    ```

## Get and print the API response

### Get the client ID header

If the response contains an `X-MSEdge-ClientID` header, get the value and print it.

``` csharp
string client_id;
if (response.Headers.TryGetValues("X-MSEdge-ClientID", out IEnumerable<string> header_values))
{
    client_id = header_values.First();
    Console.WriteLine("Client ID: " + client_id);
}
```

### Get the response

Get the response from the API. Deserialize the JSON object, and print it to the console.

```csharp
string contentString = await response.Content.ReadAsStringAsync();

dynamic jsonObj = JsonConvert.DeserializeObject(contentString);
Console.WriteLine(jsonObj);
```

## Call the spell check function

In the `Main()` function of your project, call `SpellCheck()`.

```csharp
static void Main(string[] args)
{
    SpellCheck();
    Console.ReadLine();
}
```

## Run the application

Build and run your project. If you're using Visual Studio, press **F5** to debug the file.

## Example JSON response

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "_type": "SpellCheck",
   "flaggedTokens": [
      {
         "offset": 0,
         "token": "Hollo",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "Hello",
               "score": 0.9115257530801
            },
            {
               "suggestion": "Hollow",
               "score": 0.858039839213461
            },
            {
               "suggestion": "Hallo",
               "score": 0.597385084464481
            }
         ]
      },
      {
         "offset": 7,
         "token": "wrld",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "world",
               "score": 0.9115257530801
            }
         ]
      }
   ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
