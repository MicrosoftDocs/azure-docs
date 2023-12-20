---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021
---

# [Document summarization](#tab/document-summarization)

[Reference documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet&preserve-view=true) | [More samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.TextAnalytics_5.3.0/sdk/textanalytics/Azure.AI.TextAnalytics/samples) |  [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.3.0) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics) 

# [Conversation summarization](#tab/conversation-summarization)

[Reference documentation](/dotnet/api/overview/azure/ai.language.conversations-readme?view=azure-dotnet&preserve-view=true) | [More samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Language.Conversations_1.1.0/sdk/cognitivelanguage/Azure.AI.Language.Conversations/samples) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.Language.Conversations/1.1.0) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Language.Conversations_1.1.0/sdk/cognitivelanguage/Azure.AI.Language.Conversations/src/)

---

Use this quickstart to create a text summarization application with the client library for .NET. In the following example, you'll create a C# application that can summarize documents or text-based customer service conversations.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint.  After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the API. You paste your key and endpoint into the code later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you'll need a Language resource with the standard (S) pricing tier.



## Setting up

[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]



### Create a new .NET Core application

Using the Visual Studio IDE, create a new .NET Core console app. This creates a "Hello World" project with a single C# source file: *program.cs*.

# [Document summarization](#tab/document-summarization)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.TextAnalytics`. Make sure **Include prerelease** is checked. Select version `5.3.0`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

# [Conversation summarization](#tab/conversation-summarization)

Install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse** and search for `Azure.AI.Language.Conversations`. Make sure **Include prerelease** is checked. Select version `1.1.0`, and then **Install**. You can also use the [Package Manager Console](/nuget/consume-packages/install-use-packages-powershell#find-and-install-a-package).

---



## Code example

Copy the following code into your *program.cs* file. Then run the code.  

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
        // This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
        static string languageKey = Environment.GetEnvironmentVariable("LANGUAGE_KEY");
        static string languageEndpoint = Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT");

        private static readonly AzureKeyCredential credentials = new AzureKeyCredential(languageKey);
        private static readonly Uri endpoint = new Uri(languageEndpoint);

        // Example method for summarizing text
        static async Task TextSummarizationExample(TextAnalyticsClient client)
        {
            string document = @"The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured text document. 
                These sentences collectively convey the main idea of the document. This feature is provided as an API for developers. 
                They can use it to build intelligent solutions based on the relevant information extracted to support various use cases. 
                Extractive summarization supports several languages. It is based on pretrained multilingual transformer models, part of our quest for holistic representations. 
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


