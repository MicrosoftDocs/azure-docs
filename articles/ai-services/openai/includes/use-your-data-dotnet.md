---
#services: cognitive-services
manager: nitinme
author: travisw
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/07/2024
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

[!INCLUDE [Create a new .NET application](./dotnet-new-application.md)]

From the project directory, open the *Program.cs* file and replace its contents with the following code:

### Without response streaming

```csharp
using Azure;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using OpenAI.Chat;
using System.Text.Json;
using static System.Environment;

string azureOpenAIEndpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string azureOpenAIKey = GetEnvironmentVariable("AZURE_OPENAI_API_KEY");
string deploymentName = GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_ID");
string searchEndpoint = GetEnvironmentVariable("AZURE_AI_SEARCH_ENDPOINT");
string searchKey = GetEnvironmentVariable("AZURE_AI_SEARCH_API_KEY");
string searchIndex = GetEnvironmentVariable("AZURE_AI_SEARCH_INDEX");

#pragma warning disable AOAI001
AzureOpenAIClient azureClient = new(
    new Uri(azureOpenAIEndpoint),
    new AzureKeyCredential(azureOpenAIKey));
ChatClient chatClient = azureClient.GetChatClient(deploymentName);

ChatCompletionOptions options = new();
options.AddDataSource(new AzureSearchChatDataSource()
{
    Endpoint = new Uri(searchEndpoint),
    IndexName = searchIndex,
    Authentication = DataSourceAuthentication.FromApiKey(searchKey),
});

ChatCompletion completion = chatClient.CompleteChat(
    [
        new UserChatMessage("What are my available health plans?"),
    ], options);

Console.WriteLine(completion.Content[0].Text);

AzureChatMessageContext onYourDataContext = completion.GetAzureMessageContext();

if (onYourDataContext?.Intent is not null)
{
    Console.WriteLine($"Intent: {onYourDataContext.Intent}");
}
foreach (AzureChatCitation citation in onYourDataContext?.Citations ?? [])
{
    Console.WriteLine($"Citation: {citation.Content}");
}
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](/azure/key-vault/general/overview). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

```cmd
dotnet run program.cs
```

## Output

```output
Contoso Electronics offers two health plans: Northwind Health Plus and Northwind Standard [doc1]. Northwind Health Plus is a comprehensive plan that provides coverage for medical, vision, and dental services, prescription drug coverage, mental health and substance abuse coverage, and coverage for preventive care services. It also offers coverage for emergency services, both in-network and out-of-network. On the other hand, Northwind Standard is a basic plan that provides coverage for medical, vision, and dental services, prescription drug coverage, and coverage for preventive care services. However, it does not offer coverage for emergency services, mental health and substance abuse coverage, or out-of-network services [doc1].

Intent: ["What are the available health plans?", "List of health plans available", "Health insurance options", "Types of health plans offered"]

Citation:
Contoso Electronics plan and benefit packages

Thank you for your interest in the Contoso electronics plan and benefit packages. Use this document to

learn more about the various options available to you...// Omitted for brevity
```

This will wait until the model has generated its entire response before printing the results. Alternatively, if you want to asynchronously stream the response and print the results, you can replace the contents of *Program.cs* with the code in the next example.

### Async with streaming

```csharp
using Azure;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using OpenAI.Chat;
using static System.Environment;

string azureOpenAIEndpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string azureOpenAIKey = GetEnvironmentVariable("AZURE_OPENAI_API_KEY");
string deploymentName = GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_ID");
string searchEndpoint = GetEnvironmentVariable("AZURE_AI_SEARCH_ENDPOINT");
string searchKey = GetEnvironmentVariable("AZURE_AI_SEARCH_API_KEY");
string searchIndex = GetEnvironmentVariable("AZURE_AI_SEARCH_INDEX");

#pragma warning disable AOAI001

AzureOpenAIClient azureClient = new(
    new Uri(azureOpenAIEndpoint),
    new AzureKeyCredential(azureOpenAIKey));
ChatClient chatClient = azureClient.GetChatClient(deploymentName);

ChatCompletionOptions options = new();
options.AddDataSource(new AzureSearchChatDataSource()
{
    Endpoint = new Uri(searchEndpoint),
    IndexName = searchIndex,
    Authentication = DataSourceAuthentication.FromApiKey(searchKey),
});

var chatUpdates = chatClient.CompleteChatStreamingAsync(
    [
        new UserChatMessage("What are my available health plans?"),
    ], options);

AzureChatMessageContext onYourDataContext = null;
await foreach (var chatUpdate in chatUpdates)
{
    if (chatUpdate.Role.HasValue)
    {
        Console.WriteLine($"{chatUpdate.Role}: ");
    }

    foreach (var contentPart in chatUpdate.ContentUpdate)
    {
        Console.Write(contentPart.Text);
    }

    if (onYourDataContext == null)
    {
        onYourDataContext = chatUpdate.GetAzureMessageContext();
    }
}

Console.WriteLine();
if (onYourDataContext?.Intent is not null)
{
    Console.WriteLine($"Intent: {onYourDataContext.Intent}");
}
foreach (AzureChatCitation citation in onYourDataContext?.Citations ?? [])
{
    Console.Write($"Citation: {citation.Content}");
}
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=dotnet&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-dotnet-application)
