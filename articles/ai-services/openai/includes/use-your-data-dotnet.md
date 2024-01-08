---
#services: cognitive-services
manager: nitinme
author: travisw
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/29/2023
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

[!INCLUDE [Create a new .NET application](./dotnet-new-application.md)]

From the project directory, open the *Program.cs* file and replace its contents with the following code:

### Without response streaming

```csharp
using Azure;
using Azure.AI.OpenAI;
using System.Text.Json;
using static System.Environment;

string azureOpenAIEndpoint = GetEnvironmentVariable("AOAIEndpoint");
string azureOpenAIKey = GetEnvironmentVariable("AOAIKey");
string searchEndpoint = GetEnvironmentVariable("SearchEndpoint");
string searchKey = GetEnvironmentVariable("SearchKey");
string searchIndex = GetEnvironmentVariable("SearchIndex");
string deploymentName = GetEnvironmentVariable("AOAIDeploymentId");

var client = new OpenAIClient(new Uri(azureOpenAIEndpoint), new AzureKeyCredential(azureOpenAIKey));

var chatCompletionsOptions = new ChatCompletionsOptions()
{
    Messages =
    {
        new ChatMessage(ChatRole.User, "What are the differences between Azure Machine Learning and Azure AI services?"),
    },
    AzureExtensionsOptions = new AzureChatExtensionsOptions()
    {
        Extensions =
        {
            new AzureCognitiveSearchChatExtensionConfiguration()
            {
                SearchEndpoint = new Uri(searchEndpoint),
                SearchKey = new AzureKeyCredential(searchKey),
                IndexName = searchIndex,
            },
        }
    }
};

Response<ChatCompletions> response = client.GetChatCompletions(deploymentName, chatCompletionsOptions);

ChatMessage responseMessage = response.Value.Choices[0].Message;

Console.WriteLine($"Message from {responseMessage.Role}:");
Console.WriteLine("===");
Console.WriteLine(responseMessage.Content);
Console.WriteLine("===");

Console.WriteLine($"Context information (e.g. citations) from chat extensions:");
Console.WriteLine("===");
foreach (ChatMessage contextMessage in responseMessage.AzureExtensionsContext.Messages)
{
    string contextContent = contextMessage.Content;
    try
    {
        var contextMessageJson = JsonDocument.Parse(contextMessage.Content);
        contextContent = JsonSerializer.Serialize(contextMessageJson, new JsonSerializerOptions()
        {
            WriteIndented = true,
        });
    }
    catch (JsonException)
    {}
    Console.WriteLine($"{contextMessage.Role}: {contextContent}");
}
Console.WriteLine("===");
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

```cmd
dotnet run program.cs
```

## Output

```output
Answer from assistant:
===
Azure Machine Learning is a cloud-based service that provides tools and services to build, train, and deploy machine learning models. It offers a collaborative environment for data scientists, developers, and domain experts to work together on machine learning projects. Azure Machine Learning supports various programming languages, frameworks, and libraries, including Python, R, TensorFlow, and PyTorch [^1^].
===
Context information (e.g. citations) from chat extensions:
===
tool: {
  "citations": [
    {
      "content": "...",
      "id": null,
      "title": "...",
      "filepath": "...",
      "url": "...",
      "metadata": {
        "chunking": "orignal document size=1011. Scores=3.6390076 and None.Org Highlight count=38."
      },
      "chunk_id": "2"
    },
    ...
  ],
  "intent": "[\u0022What are the differences between Azure Machine Learning and Azure AI services?\u0022]"
}
===
```

This will wait until the model has generated its entire response before printing the results. Alternatively, if you want to asynchronously stream the response and print the results, you can replace the contents of *Program.cs* with the code in the next example.

### Async with streaming

```csharp
using Azure;
using Azure.AI.OpenAI;
using System.Text.Json;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AOAIEndpoint");
string key = GetEnvironmentVariable("AOAIKey");

var client = new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(key));

string azureOpenAIEndpoint = GetEnvironmentVariable("AOAIEndpoint");
string azureOpenAIKey = GetEnvironmentVariable("AOAIKey");
string searchEndpoint = GetEnvironmentVariable("SearchEndpoint");
string searchKey = GetEnvironmentVariable("SearchKey");
string searchIndex = GetEnvironmentVariable("SearchIndex");
string deploymentName = GetEnvironmentVariable("AOAIDeploymentId");

var client = new OpenAIClient(new Uri(azureOpenAIEndpoint), new AzureKeyCredential(azureOpenAIKey));

var chatCompletionsOptions = new ChatCompletionsOptions()
{
    Messages =
    {
        new ChatMessage(ChatRole.User, "What are the differences between Azure Machine Learning and Azure AI services?"),
    },
    AzureExtensionsOptions = new AzureChatExtensionsOptions()
    {
        Extensions =
        {
            new AzureCognitiveSearchChatExtensionConfiguration()
            {
                SearchEndpoint = new Uri(searchEndpoint),
                SearchKey = new AzureKeyCredential(searchKey),
                IndexName = searchIndex,
            },
        }
    }
};

Response<StreamingChatCompletions> response = await client.GetChatCompletionsStreamingAsync(
    deploymentName,
    chatCompletionsOptions);

using StreamingChatCompletions streamingChatCompletions = response.Value;

await foreach (StreamingChatChoice streamingChatChoice in streamingChatCompletions.GetChoicesStreaming())
{
    await foreach (ChatMessage chatMessage in streamingChatChoice.GetMessageStreaming())
    {
        if (chatMessage.Role != default)
        {
            Console.WriteLine($"Message from {chatMessage.Role}: ");
        }
        if (chatMessage.Content != default)
        {
            Console.Write(chatMessage.Content);
        }
        if (chatMessage.AzureExtensionsContext != default)
        {
            Console.WriteLine($"Context information (e.g. citations) from chat extensions:");
            foreach (var contextMessage in chatMessage.AzureExtensionsContext.Messages)
            {
                string contextContent = contextMessage.Content;
                try
                {
                    var contextMessageJson = JsonDocument.Parse(contextMessage.Content);
                    contextContent = JsonSerializer.Serialize(contextMessageJson, new JsonSerializerOptions()
                    {
                        WriteIndented = true,
                    });
                }
                catch (JsonException)
                {}
                Console.WriteLine($"{contextMessage.Role}: {contextContent}");
            }
        }
    }
}
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=dotnet&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-dotnet-application)
