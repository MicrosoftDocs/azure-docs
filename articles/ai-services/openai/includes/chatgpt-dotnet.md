---
title: 'Quickstart: Use Azure OpenAI Service with the C# SDK'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the C# SDK.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 11/15/2023
keywords:
---

[Source code](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.OpenAI/) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)| [Retrieval Augmented Generation (RAG) enterprise chat template](/dotnet/azure/ai/get-started-app-chat-template) |

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- The [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).


> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=DOTNET&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites)

## Set up

[!INCLUDE [Create a new .NET application](./dotnet-new-application.md)]

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=DOTNET&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up)

## Create a sample application

From the project directory, open the *program.cs* file and replace with the following code:

### Without response streaming

```csharp
using Azure;
using Azure.AI.OpenAI;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string key = GetEnvironmentVariable("AZURE_OPENAI_KEY");

OpenAIClient client = new(new Uri(endpoint), new AzureKeyCredential(key));

var chatCompletionsOptions = new ChatCompletionsOptions()
{
    DeploymentName = "gpt-35-turbo", //This must match the custom deployment name you chose for your model
    Messages =
    {
        new ChatMessage(ChatRole.System, "You are a helpful assistant."),
        new ChatMessage(ChatRole.User, "Does Azure OpenAI support customer managed keys?"),
        new ChatMessage(ChatRole.Assistant, "Yes, customer managed keys are supported by Azure OpenAI."),
        new ChatMessage(ChatRole.User, "Do other Azure AI services support this too?"),
    },
    MaxTokens = 100
};

Response<ChatCompletions> response = client.GetChatCompletions(chatCompletionsOptions);

Console.WriteLine(response.Value.Choices[0].Message.Content);

Console.WriteLine();
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

```cmd
dotnet run program.cs
```

## Output

```output
Yes, many of the Azure AI services support customer managed keys. Some examples include Text Analytics, Speech Services, and Translator. However, it's important to note that not all services support customer managed keys, so it's best to check the documentation for each individual service to see if it is supported.
```

This will wait until the model has generated its entire response before printing the results. Alternatively, if you want to asynchronously stream the response and print the results, you can replace the contents of *program.cs* with the code in the next example.

### Async with streaming

```csharp
using Azure;
using Azure.AI.OpenAI;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string key = GetEnvironmentVariable("AZURE_OPENAI_KEY");

OpenAIClient client = new(new Uri(endpoint), new AzureKeyCredential(key));

var chatCompletionsOptions = new ChatCompletionsOptions()
{
    DeploymentName= "gpt-35-turbo", //This must match the custom deployment name you chose for your model
    Messages =
    {
        new ChatMessage(ChatRole.System, "You are a helpful assistant."),
        new ChatMessage(ChatRole.User, "Does Azure OpenAI support customer managed keys?"),
        new ChatMessage(ChatRole.Assistant, "Yes, customer managed keys are supported by Azure OpenAI."),
        new ChatMessage(ChatRole.User, "Do other Azure AI services support this too?"),
    },
    MaxTokens = 100
};

await foreach (StreamingChatCompletionsUpdate chatUpdate in client.GetChatCompletionsStreaming(chatCompletionsOptions))
{
    if (chatUpdate.Role.HasValue)
    {
        Console.Write($"{chatUpdate.Role.Value.ToString().ToUpperInvariant()}: ");
    }
    if (!string.IsNullOrEmpty(chatUpdate.ContentUpdate))
    {
        Console.Write(chatUpdate.ContentUpdate);
    }
}
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=DOTNET&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Create-dotnet-application)

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
