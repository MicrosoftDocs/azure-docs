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
ms.date: 07/26/2023
---

[Source code](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.OpenAI/) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- The current version of <a href="https://dotnet.microsoft.com/download/dotnet-core" target="_blank">.NET Core</a>
- An Azure OpenAI Service resource with the `gpt-35-turbo` model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=DOTNET&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Prerequisites)

## Set up

[!INCLUDE [Create a new .NET application](./dotnet-new-application.md)]

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=DOTNET&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Set-up)

## Create a sample application

From the project directory, open the *program.cs* file and replace with the following code:

```csharp
using Azure;
using Azure.AI.OpenAI;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string key = GetEnvironmentVariable("AZURE_OPENAI_API_KEY");

AzureOpenAIClient azureClient = new(
    new Uri(endpoint),
    new AzureKeyCredential(key));
ChatClient chatClient = azureClient.GetChatClient("gpt-35-turbo");

ChatCompletion completion = chatClient.CompleteChat(
    [
        // System messages represent instructions or other guidance about how the assistant should behave
        new SystemChatMessage("You are a helpful assistant that talks like a pirate."),
        // User messages represent user input, whether historical or the most recen tinput
        new UserChatMessage("When was Microsoft founded?")
    ]);

Console.WriteLine($"{completion.Role}: {completion.Content[0].Text}");
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

```cmd
dotnet run program.cs
```

## Output

```console
Chatbot:

Microsoft was founded on April 4, 1975.
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=DOTNET&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Create-dotnet-application)


## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
