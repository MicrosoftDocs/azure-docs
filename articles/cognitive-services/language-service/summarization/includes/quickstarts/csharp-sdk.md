---
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 08/18/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

# [Document summarization](#tab/document-summarization)

[Reference documentation](/dotnet/api/azure.ai.textanalytics?preserve-view=true&view=azure-dotnet-preview) | [Additional samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.TextAnalytics_5.2.0-beta.3/sdk/textanalytics/Azure.AI.TextAnalytics/samples) |  [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0-beta.3) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) 

# [Conversation summarization](#tab/conversation-summarization)

[Reference documentation](/dotnet/api/overview/azure/ai.language.conversations-readme) | [Additional samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Language.Conversations_1.1.0-beta.1/sdk/cognitivelanguage/Azure.AI.Language.Conversations/samples) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.Language.Conversations/1.1.0-beta.1) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Language.Conversations_1.1.0-beta.1/sdk/cognitivelanguage/Azure.AI.Language.Conversations/src/)

---

Use this quickstart to create a text summarization application with the client library for .NET. In the following example, you will create a C# application that can summarize documents or text-based customer service conversations.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint.  After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-net/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**.NET%20runtime%20version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20using%20document%20summarization%20and%20conversation%20summarization%20(preview)%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart%3Fpivots%3Dprogramming-language-csharp)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md)%0A*%20Section:%20**Prerequisites**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

## Setting up

### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This will create a "Hello World" project with a single C# source file: *program.cs*.

# [Document summarization](#tab/document-summarization)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Make sure **Include prerelease** is checked. Select version `5.2.0-beta.3`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

# [Conversation summarization](#tab/conversation-summarization)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.Language.Conversations`. Make sure **Include prerelease** is checked. Select version `1.1.0-beta.1`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

---

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-net/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**.NET%20runtime%20version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20using%20document%20summarization%20and%20conversation%20summarization%20(preview)%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart%3Fpivots%3Dprogramming-language-csharp)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md)%0A*%20Section:%20**Set-up-the-environment**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

## Code example

Copy the following code into your *program.cs* file. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. Then run the code.  

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

# [Document summarization](#tab/document-summarization)

```csharp
using Azure;
using System;
using Azure.AI.TextAnalytics;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Example
{
    class Program
    {
        private static readonly AzureKeyCredential credentials = new AzureKeyCredential("replace-with-your-key-here");
        private static readonly Uri endpoint = new Uri("replace-with-your-endpoint-here");

        // Example method for summarizing text
        static async Task TextSummarizationExample(TextAnalyticsClient client)
        {
            string document = @"The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured text document. 
                These sentences collectively convey the main idea of the document. This feature is provided as an API for developers. 
                They can use it to build intelligent solutions based on the relevant information extracted to support various use cases. 
                In the public preview, extractive summarization supports several languages. It is based on pretrained multilingual transformer models, part of our quest for holistic representations. 
                It draws its strength from transfer learning across monolingual and harness the shared nature of languages to produce models of improved quality and efficiency." ;
        
            // Prepare analyze operation input. You can add multiple documents to this list and perform the same
            // operation to all of them.
            var batchInput = new List<string>
            {
                document
            };
        
            TextAnalyticsActions actions = new TextAnalyticsActions()
            {
                ExtractSummaryActions = new List<ExtractSummaryAction>() { new ExtractSummaryAction() }
            };
        
            // Start analysis process.
            AnalyzeActionsOperation operation = await client.StartAnalyzeActionsAsync(batchInput, actions);
            await operation.WaitForCompletionAsync();
            // View operation status.
            Console.WriteLine($"AnalyzeActions operation has completed");
            Console.WriteLine();
        
            Console.WriteLine($"Created On   : {operation.CreatedOn}");
            Console.WriteLine($"Expires On   : {operation.ExpiresOn}");
            Console.WriteLine($"Id           : {operation.Id}");
            Console.WriteLine($"Status       : {operation.Status}");
        
            Console.WriteLine();
            // View operation results.
            await foreach (AnalyzeActionsResult documentsInPage in operation.Value)
            {
                IReadOnlyCollection<ExtractSummaryActionResult> summaryResults = documentsInPage.ExtractSummaryResults;
        
                foreach (ExtractSummaryActionResult summaryActionResults in summaryResults)
                {
                    if (summaryActionResults.HasError)
                    {
                        Console.WriteLine($"  Error!");
                        Console.WriteLine($"  Action error code: {summaryActionResults.Error.ErrorCode}.");
                        Console.WriteLine($"  Message: {summaryActionResults.Error.Message}");
                        continue;
                    }
        
                    foreach (ExtractSummaryResult documentResults in summaryActionResults.DocumentsResults)
                    {
                        if (documentResults.HasError)
                        {
                            Console.WriteLine($"  Error!");
                            Console.WriteLine($"  Document error code: {documentResults.Error.ErrorCode}.");
                            Console.WriteLine($"  Message: {documentResults.Error.Message}");
                            continue;
                        }
        
                        Console.WriteLine($"  Extracted the following {documentResults.Sentences.Count} sentence(s):");
                        Console.WriteLine();
        
                        foreach (SummarySentence sentence in documentResults.Sentences)
                        {
                            Console.WriteLine($"  Sentence: {sentence.Text}");
                            Console.WriteLine();
                        }
                    }
                }
            }
        
        }

        static async Task Main(string[] args)
        {
            var client = new TextAnalyticsClient(endpoint, credentials);
            await TextSummarizationExample(client);
        }
    }
}

```

### Output

```console
AnalyzeActions operation has completed

Created On   : 9/16/2021 8:04:27 PM +00:00
Expires On   : 9/17/2021 8:04:27 PM +00:00
Id           : 2e63fa58-fbaa-4be9-a700-080cff098f91
Status       : succeeded

Extracted the following 3 sentence(s):

Sentence: The extractive summarization feature in uses natural language processing techniques to locate key sentences in an unstructured text document.

Sentence: This feature is provided as an API for developers.

Sentence: They can use it to build intelligent solutions based on the relevant information extracted to support various use cases.
```

# [Conversation summarization](#tab/conversation-summarization)

```csharp
using System;
using Azure;
using Azure.Core;
using Azure.AI.Language.Conversations;
using System.Text.Json;

namespace Example
{
    class Program
    {
        private static readonly AzureKeyCredential credentials = new AzureKeyCredential("replace-with-your-key-here");
        private static readonly Uri endpoint = new Uri("replace-with-your-endpoint-here");

        static void Main(string[] args)
        {

            ConversationAnalysisClient client = new ConversationAnalysisClient(endpoint, credentials);
            summarization(client);
        }
        public static void summarization(ConversationAnalysisClient client)
        {
            var data = new
            {
                analysisInput = new
                {
                    conversations = new[]
            {
            new
            {
                conversationItems = new[]
                {
                    new
                    {
                        text = "Hello, you’re chatting with Rene. How may I help you?",
                        id = "1",
                        participantId = "Agent",
                    },
                    new
                    {
                        text = "Hi, I tried to set up wifi connection for Smart Brew 300 coffee machine, but it didn’t work.",
                        id = "2",
                        participantId = "Customer",
                    },
                    new
                    {
                        text = "I’m sorry to hear that. Let’s see what we can do to fix this issue. Could you please try the following steps for me? First, could you push the wifi connection button, hold for 3 seconds, then let me know if the power light is slowly blinking on and off every second?",
                        id = "3",
                        participantId = "Agent",
                    },
                    new
                    {
                        text = "Yes, I pushed the wifi connection button, and now the power light is slowly blinking?",
                        id = "4",
                        participantId = "Customer",
                    },
                    new
                    {
                        text = "Great. Thank you! Now, please check in your Contoso Coffee app. Does it prompt to ask you to connect with the machine?",
                        id = "5",
                        participantId = "Agent",
                    },
                    new
                    {
                        text = "No. Nothing happened.",
                        id = "6",
                        participantId = "Customer",
                    },
                    new
                    {
                        text = "I’m very sorry to hear that. Let me see if there’s another way to fix the issue. Please hold on for a minute.",
                        id = "7",
                        participantId = "Agent",
                    }
                },
                id = "1",
                language = "en",
                modality = "text",
            },
        }
                },
                tasks = new[]
        {
        new
        {
            parameters = new
            {
                summaryAspects = new[]
                {
                    "issue",
                    "resolution",
                }
            },
            kind = "ConversationalSummarizationTask",
            taskName = "1",
        },
    },
            };

            Operation<BinaryData> analyzeConversationOperation = client.AnalyzeConversation(WaitUntil.Started, RequestContent.Create(data));
            analyzeConversationOperation.WaitForCompletion();

            using JsonDocument result = JsonDocument.Parse(analyzeConversationOperation.Value.ToStream());
            JsonElement jobResults = result.RootElement;
            foreach (JsonElement task in jobResults.GetProperty("tasks").GetProperty("items").EnumerateArray())
            {
                JsonElement results = task.GetProperty("results");

                Console.WriteLine("Conversations:");
                foreach (JsonElement conversation in results.GetProperty("conversations").EnumerateArray())
                {
                    Console.WriteLine($"Conversation: #{conversation.GetProperty("id").GetString()}");
                    Console.WriteLine("Summaries:");
                    foreach (JsonElement summary in conversation.GetProperty("summaries").EnumerateArray())
                    {
                        Console.WriteLine($"Text: {summary.GetProperty("text").GetString()}");
                        Console.WriteLine($"Aspect: {summary.GetProperty("aspect").GetString()}");
                    }
                    Console.WriteLine();
                }
            }
        }
    }
}

```

### Output

```console
Conversations:
Conversation: #1
Summaries:
Text: Customer tried to set up wifi connection for Smart Brew 300 coffee machine, but it didn't work
Aspect: issue
Text: Asked customer to try the following steps | Asked customer for the power light | Helped customer to connect to the machine
Aspect: resolution
```

---

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-net/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**.NET%20runtime%20version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20using%20document%20summarization%20and%20conversation%20summarization%20(preview)%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart%3Fpivots%3Dprogramming-language-csharp)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md)%0A*%20Section:%20**Code-example**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-net/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**.NET%20runtime%20version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20using%20document%20summarization%20and%20conversation%20summarization%20(preview)%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart%3Fpivots%3Dprogramming-language-csharp)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsummarization%2Fquickstart.md)%0A*%20Section:%20**Clean-up-resources**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>
