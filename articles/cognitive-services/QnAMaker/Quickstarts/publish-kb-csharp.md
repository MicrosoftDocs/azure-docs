---
title: "Quickstart: C# Publish Knowledge Base - Qna Maker"
titleSuffix: Azure Cognitive Services 
description: This quickstart walks you through publishing your KB which pushes the latest version of the tested knowledge base to a dedicated Azure Search index representing the published knowledge base. It also creates an endpoint that can be called in your application or chat bot.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 09/27/2018
ms.author: diberry
---

# Quickstart: Publish a knowledge base in C#

This quickstart walks you through publishing your knowledge base (KB), which pushes the latest version of the tested knowledge base to a dedicated Azure Search index representing the published knowledge base. It also creates an endpoint that can be called in your application or chat bot.

This quickstart calls Qna Maker APIs:
* [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe)

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-csharp-repo-note.md)]

## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [Qna Maker service](../how-to/set-up-qnamaker-service-azure). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* Qna Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-csharp.md).

## Create knowledge base project

1. Open Visual Studio 2017 Community edition.
1. Create a new **Console App (.Net Core)** project and name the project `QnaMakerQuickstartPublishKB`. Accept the defaults for the remaining settings.
1. In the Solution Explorer, right-click on the project name, **QnaMakerQuickstartPublishKB**, then select **Manage NuGet Packages...**.
1. In the NuGet window, select **Browser**, then search for **Newtonsoft.JSON** and install the package. This package is used to parse the JSON returned from the QnaMaker HTTP response.

## Add required dependencies

At the top of **Program.cs**, replace the single _using_ statement with the following lines to add necessary dependencies to the project:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

// NOTE: Install the Newtonsoft.Json NuGet package.
using Newtonsoft.Json;
```

## Add required constants

At the top of the Program class, add the following constants to access QnA Maker:

```csharp

static string host = "https://westus.api.cognitive.microsoft.com";
static string service = "/qnamaker/v4.0";
static string method = "/knowledgebases/";

// NOTE: Replace this with a valid subscription key.
static string key = "<your-qna-maker-subscription-key>";

// NOTE: Replace this with a valid knowledge base ID.
static string kb = "<your-qna-maker-kb-id>";
```

The first three constants are used to create the full URL for the API. The last two constant provides authentication to the API and access to the specific KB.

## Add supporting functions and structures

Add the following code block inside the Program class:

```csharp
static string PrettyPrint(string s)
{
    return JsonConvert.SerializeObject(JsonConvert.DeserializeObject(s), Formatting.Indented);
}
```

## Add POST request to publish KB

The following code makes an HTTPS request to the Qna Maker API to publish a KB and receives the response:

```
async static void PublishKB()
{
    string responseText;

    var uri = host + service + method + kb;
    Console.WriteLine("Calling " + uri + ".");
    using (var client = new HttpClient())
    using (var request = new HttpRequestMessage())
    {
        request.Method = HttpMethod.Post;
        request.RequestUri = new Uri(uri);
        request.Headers.Add("Ocp-Apim-Subscription-Key", key);

        var response = await client.SendAsync(request);

        // successful status doesn't return an JSON so create one
        if (response.IsSuccessStatusCode)
        {
            responseText = "{'result' : 'Success.'}";
        }
        else
        {
            responseText =  await response.Content.ReadAsStringAsync();
        }
    }
    Console.WriteLine(PrettyPrint(responseText));
    Console.WriteLine("Press any key to continue.");
}
```

The API call returns a 204 status for a successful publish without any content in the body of the response. The code adds content for 204 responses.

For any other response, that response is returned unaltered.
 
## Add the PublishKB method to Main

Change the Main method to call the CreateKB method:

```csharp
static void Main(string[] args)
{

    // Call the PublishKB() method to publish a knowledge base.
    PublishKB();

    // The console waits for a key to be pressed before closing.
    Console.ReadLine();
}
```

## Build and run the program

Build and run the program. It will automatically send the request to the Qna Maker API to publish the KB, then the response is printed to the console window.

Once your knowledge base is published, you can query it from the endpoint with a client application or chat bot. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)