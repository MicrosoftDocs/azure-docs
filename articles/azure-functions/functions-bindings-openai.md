---
title: Azure OpenAI extension for Azure Functions
description: Learn to configure the Azure OpenAI extension to be able to integrate your Azure Functions code executions with Azure OpenAI APIs.
ms.topic: reference
ms.custom:
  - build-2024
ms.date: 05/14/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI extension for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI extension for Azure Functions implements a set of triggers and bindings that enable you to easily integrate features and behaviors of the [Azure OpenAI service](../ai-services/openai/overview.md) into your function code executions. 

Azure Functions is an event-driven compute service that provides a set of [triggers and bindings](./functions-triggers-bindings.md) to easily connect with other Azure services. 

With the integration between Azure OpenAI and Functions, you can build functions that can:

| Action  | Trigger/binding type |
|---------|-----------|
| Use a standard text prompt for content completion | [Azure OpenAI text completion input binding](functions-bindings-openai-textcompletion-input.md) |
| Respond to an assistant request to call a function | [Azure OpenAI assistant trigger](functions-bindings-openai-assistant-trigger.md) |
| Create an assistant | [Azure OpenAI assistant create output binding](functions-bindings-openai-assistantcreate-output.md) |
| Message an assistant | [Azure OpenAI assistant post input binding](functions-bindings-openai-assistantpost-input.md) |
| Get assistant history | [Azure OpenAI assistant query input binding](functions-bindings-openai-assistantquery-input.md) |
| Read text embeddings | [Azure OpenAI embeddings input binding](functions-bindings-openai-embeddings-input.md) |
| Write to a vector database | [Azure OpenAI embeddings store output binding](functions-bindings-openai-embeddingsstore-output.md) |
| Read from a vector database | [Azure OpenAI semantic search input binding](functions-bindings-openai-semanticsearch-input.md) |

::: zone pivot="programming-language-csharp"
## Install extension
The extension NuGet package you install depends on the C# mode [in-process](functions-dotnet-class-library.md) or [isolated worker process](dotnet-isolated-process-guide.md) you're using in your function app:

### [Isolated process](#tab/isolated-process)

Add the Azure OpenAI extension to your project by installing the [Microsoft.Azure.Functions.Worker.Extensions.OpenAI](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI) NuGet package, which you can do using the .NET CLI:

```dotnet
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.OpenAI  --prerelease
```
When using a vector database for storing content, you should also install at least one of these NuGet packages:

+ Azure AI Search: [Microsoft.Azure.Functions.Worker.Extensions.OpenAI.AzureAISearch](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI.AzureAISearch)
+ Azure Cosmos DB for MongoDB: [Microsoft.Azure.Functions.Worker.Extensions.OpenAI.CosmosDBSearch](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI.CosmosDBSearch)
+ Azure Data Explorer: [Microsoft.Azure.Functions.Worker.Extensions.OpenAI.Kusto](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI.Kusto)

### [In-process](#tab/in-process)

Add the Azure OpenAI extension to your project by installing the [Microsoft.Azure.WebJobs.Extensions.OpenAI](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI) NuGet package, which you can do using the .NET CLI:

```dotnet
dotnet add package Microsoft.Azure.WebJobs.Extensions.OpenAI --prerelease
```

When using a vector database for storing content, you should also install at least one of these NuGet packages:

+ Azure AI Search: [Microsoft.Azure.WebJobs.Extensions.OpenAI.AzureAISearch](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI.AzureAISearch)
+ Azure Cosmos DB for MongoDB: [Microsoft.Azure.WebJobs.Extensions.OpenAI.CosmosDBSearch](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI.CosmosDBSearch)
+ Azure Data Explorer: [Microsoft.Azure.WebJobs.Extensions.OpenAI.Kusto](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI.Kusto)

---

::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"

## Install bundle

You can add the preview extension by adding or replacing the following code in your `host.json` file, which specifically targets a preview version of the 4.x bundle that contains the OpenAI extension:
<!---verify this bundle info-->
```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
``` 

---

::: zone-end

<!---Include this section if there are any host.json settings defined by the extension:
## host.json settings
-->

## Related content

+ [Azure OpenAI extension samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples)
