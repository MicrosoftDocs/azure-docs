---
title: "Quickstart: Update knowledge base - REST, C# -  QnA Maker"
titleSuffix: Azure Cognitive Services
description: This quickstart walks you through updating your sample QnA Maker knowledge base (KB), programmatically. The JSON definition you use to update a KB allows you to add, change or delete question and answer pairs. 
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 10/01/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically modify a knowledge base using C#. 
---

# Quickstart: Update a QnA Maker knowledge base in C#

This quickstart walks you through programmatically updating an existing QnA Maker knowledge base (KB).  This JSON allows you to update a KB by adding new data sources, changing data sources, or deleting data sources.

This API is equivalent to editing, then using the **Save and train** button in the QnA Maker portal.

This quickstart calls QnA Maker APIs:
* [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) - The model for the knowledge base is defined in the JSON sent in the body of the API request. 
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

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

## Add the KB update definition

After the constants, add the following KB update definition. The update definition has three sections:

* add
* update
* delete

Each section can be used in the same single request to the API. 

```csharp
static string new_kb = @"
{
    'add': {
        'qnaList': [
            {
            'id': 1,
            'answer': 'You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle',
            'source': 'Custom Editorial',
            'questions': [
                'How can I change the default message from QnA Maker?'
            ],
            'metadata': []
            }
        ],
        'urls': []
    },
    'update' : {
        'name' : 'QnA Maker FAQ from quickstart - updated'
    },
    'delete': {
        'ids': [
            0
        ]
    }
}
";
```

## Add supporting functions and structures

[!INCLUDE [Add supporting functions and structures](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-support-functions.md)] 

## Add PATCH request to update KB

The following code makes an HTTPS request to the QnA Maker API to update question and answer groups in a KB and receives the response:

```csharp
async static Task<Response> PatchUpdateKB(string kb, string new_kb)
{
    string uri = host + service + method + kb;
    Console.WriteLine("Calling " + uri + ".");

    using (var client = new HttpClient())
    using (var request = new HttpRequestMessage())
    {
        request.Method = new HttpMethod("PATCH");
        request.RequestUri = new Uri(uri);

        request.Content = new StringContent(new_kb, Encoding.UTF8, "application/json");
        request.Headers.Add("Ocp-Apim-Subscription-Key", key);

        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();
        return new Response(response.Headers, responseBody);
    }
}
```

## Add GET request to determine creation status

The update of a KB adds, updates, and deletes question and answer pairs. 

```csharp
async static Task<Response> GetStatus(string operation)
{
    string uri = host + service + operation;
    Console.WriteLine("Calling " + uri + ".");

    using (var client = new HttpClient())
    using (var request = new HttpRequestMessage())
    {
        request.Method = HttpMethod.Get;
        request.RequestUri = new Uri(uri);
        request.Headers.Add("Ocp-Apim-Subscription-Key", key);

        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();
        return new Response(response.Headers, responseBody);
    }
}
```

This API call returns a JSON response that includes the operation status: 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:22:53Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

Repeat the call until success or failure: 

```JSON
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:23:08Z",
  "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add UpdateKB method
The following method updates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

```csharp
async static void UpdateKB(string kb, string new_kb)
{
    try
    {
        // Starts the QnA Maker operation to update the knowledge base.
        var response = await PatchUpdateKB(kb, new_kb);

        // Retrieves the operation ID, so the operation's status can be
        // checked periodically.
        var operation = response.headers.GetValues("Location").First();

        // Displays the JSON in the HTTP response returned by the 
        // PostUpdateKB(string, string) method.
        Console.WriteLine(PrettyPrint(response.response));

        // Iteratively gets the state of the operation updating the
        // knowledge base. Once the operation state is something other
        // than "Running" or "NotStarted", the loop ends.
        var done = false;
        while (true != done)
        {
            // Gets the status of the operation.
            response = await GetStatus(operation);
            // Displays the JSON in the HTTP response returned by the
            // GetStatus(string) method.
            Console.WriteLine(PrettyPrint(response.response));

            // Deserialize the JSON into key-value pairs, to retrieve the
            // state of the operation.
            var fields = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.response);

            // Gets and checks the state of the operation.
            String state = fields["operationState"];
            if (state.CompareTo("Running") == 0 || state.CompareTo("NotStarted") == 0)
            {
                // QnA Maker is still updating the knowledge base. The thread is
                // paused for a number of seconds equal to the Retry-After
                // header value, and then the loop continues.
                var wait = response.headers.GetValues("Retry-After").First();
                Console.WriteLine("Waiting " + wait + " seconds...");
                Thread.Sleep(Int32.Parse(wait) * 1000);
            }
            else
            {
                // QnA Maker has completed updating the knowledge base.
                done = true;
            }
        }
    }
    catch(Exception ex)
    {
        // An error occurred while updating the knowledge base. Ensure that
        // you included your QnA Maker subscription key and knowledge base ID
        // where directed in the sample.
        Console.WriteLine("An error occurred while updating the knowledge base." + ex.InnerException);
    }
    finally
    {
        Console.WriteLine("Press any key to continue.");
    }
}
```

## Add the UpdateKB method to Main

Change the Main method to call the UpdateKB method:

```csharp
static void Main(string[] args)
{
    // Invoke the UpdateKB() method to update a knowledge base, periodically
    // checking the status of the QnA Maker operation until the
    // knowledge base is updated.
    UpdateKB(kb, new_kb);

    // The console waits for a key to be pressed before closing.
    Console.ReadLine();
}
```


## Build and run the program

Build and run the program. It will automatically send the request to the QnA Maker API to update the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

Once your knowledge base is updated, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)