---
title: "Quickstart: Publish Knowledge Base - REST, C# -  QnA Maker"
titleSuffix: Azure Cognitive Services 
description: This quickstart walks you through publishing your KB which pushes the latest version of the tested knowledge base to a dedicated Azure Search index representing the published knowledge base. It also creates an endpoint that can be called in your application or chat bot.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 10/01/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically publish a knowledge base using C#. 
---

# Quickstart: Publish a QnA Maker knowledge base in C#

This quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.

This quickstart calls QnA Maker APIs:
* [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) - this API doesn't require any information in the body of the request.

## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* QnA Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-csharp.md).

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-csharp-repo-note.md)]

## Create knowledge base project

[!INCLUDE [Create Visual Studio Project](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-create-project.md)] 

## Add required dependencies

[!INCLUDE [Add required dependencies to code file](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-required-dependencies.md)] 

## Add required constants

[!INCLUDE [Add required constants to code file](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-required-constants.md)]  

## Add knowledge base ID

[!INCLUDE [Add knowledge base ID as constant](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-kb-id.md)] 

## Add supporting functions and structures

Add the following code block inside the Program class:

```csharp
static string PrettyPrint(string s)
{
    return JsonConvert.SerializeObject(JsonConvert.DeserializeObject(s), Formatting.Indented);
}
```

## Add POST request to publish KB

The following code makes an HTTPS request to the QnA Maker API to publish a KB and receives the response:

```csharp
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

Build and run the program. It will automatically send the request to the QnA Maker API to publish the KB, then the response is printed to the console window.

Once your knowledge base is published, you can query it from the endpoint with a client application or chat bot. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
