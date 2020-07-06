---
title: "Quickstart: Create knowledge base - REST, C# - QnA Maker"
description: This C# REST-based quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
ms.date: 12/16/2019
ROBOTS: NOINDEX,NOFOLLOW
ms.custom: RESTCURL2020FEB27
ms.topic: how-to
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically create a knowledge base using C#.
---

# Quickstart: Create a knowledge base in QnA Maker using C# with REST

This quickstart walks you through programmatically creating and publishing a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/knowledge-base.md). The model for the knowledge base is defined in the JSON sent in the body of the API request.

This quickstart calls QnA Maker APIs:
* [Create KB](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/create)
* [Get Operation Details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails)

[Reference documentation](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase) | [C# Sample](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp/blob/master/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* You must have a [QnA Maker resource](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key and endpoint (which includes the resource name), select **Quickstart** for your resource in the Azure portal.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE.

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `qna-maker-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```dotnetcli
dotnet new console -n qna-maker-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```dotnetcli
dotnet build
```

The build output should contain no warnings or errors.

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

## Add the required dependencies

At the top of Program.cs, replace the single using statement with the following lines to add necessary dependencies to the project:

[!code-csharp[Add the required dependencies](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=1-11 "Add the required dependencies")]

## Add the required constants

At the top of the Program class, add the required constants to access QnA Maker.

Set the following values in environment variables:

* `QNA_MAKER_SUBSCRIPTION_KEY` - The **key** is a 32 character string and is available in the Azure portal, on the QnA Maker resource, on the Quickstart page. This is not the same as the prediction endpoint key.
* `QNA_MAKER_ENDPOINT` - The **endpoint** is the URL for authoring, in the format of `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`. This is not the same URL used to query the prediction endpoint.

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=17-26 "Add the required constants")]

## Add the KB definition

After the constants, add the following KB definition:

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=28-58 "Add the knowledge base definition")]

## Add supporting functions and structures
Add the following code block inside the Program class:

[!code-csharp[Add supporting functions and structures](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=60-99 "Add supporting functions and structures")]

## Add a POST request to create KB

The following code makes an HTTPS request to the QnA Maker API to create a KB and receives the response:

[!code-csharp[Add PostCreateKB to request via POST](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=145-165 "Add PostCreateKB to request via POST")]

[!code-csharp[Add a POST request to create KB](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=101-122 "Add a POST request to create KB")]

This API call returns a JSON response that includes the operation ID. Use the operation ID to determine if the KB is successfully created.

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
}
```

## Add GET request to determine creation status

Check the status of the operation.

[!code-csharp[Add GetStatus to request via GET](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=167-187 "Add GetStatus to request via GET")]

[!code-csharp[Add GET request to determine creation status](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=124-143 "Add GET request to determine creation status")]

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

## Add CreateKB method

The following method creates the KB and repeats checks on the status.  The _create_ **Operation ID** is returned in the POST response header field **Location**, then used as part of the route in the GET request. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails. When the operation succeeds, the KB ID is returned in **resourceLocation**.

[!code-csharp[Add CreateKB method](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=189-254 "Add CreateKB method")]

## Add the CreateKB method to Main

Change the Main method to call the CreateKB method:

[!code-csharp[Add CreateKB method](~/samples-qnamaker-csharp/documentation-samples/quickstarts/create-knowledge-base/QnaQuickstartCreateKnowledgebase/Program.cs?range=256-265 "Add CreateKB method")]

## Build and run the program

Build and run the program. It will automatically send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page.


[!INCLUDE [Clean up files and KB](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)