---
title: Azure OpenAI extension for Azure Functions
description: Learn to configure the Azure OpenAI extension to be able to integrate your Azure Functions code executions with Azure OpenAI APIs.
ms.topic: reference
ms.custom:
  - build-2024
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - devx-track-ts
  - build-2025
ms.collection: 
  - ce-skilling-ai-copilot
ms.date: 05/14/2024
ms.update-cycle: 180-days
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI extension for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI extension for Azure Functions implements a set of triggers and bindings that enable you to easily integrate features and behaviors of [Azure OpenAI in Foundry Models](/azure/ai-services/openai/overview) into your function code executions. 

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
+ Azure Cosmos DB for MongoDB vCore: [Microsoft.Azure.Functions.Worker.Extensions.OpenAI.CosmosDBSearch](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI.CosmosDBSearch)
+ Azure Cosmos DB for NoSQL: [Microsoft.Azure.Functions.Worker.Extensions.OpenAI.CosmosDBSearch](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI.CosmosDBNoSQLSearch)
+ Azure Data Explorer: [Microsoft.Azure.Functions.Worker.Extensions.OpenAI.Kusto](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.OpenAI.Kusto)

### [In-process](#tab/in-process)

Add the Azure OpenAI extension to your project by installing the [Microsoft.Azure.WebJobs.Extensions.OpenAI](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI) NuGet package, which you can do using the .NET CLI:

```dotnet
dotnet add package Microsoft.Azure.WebJobs.Extensions.OpenAI --prerelease
```

When using a vector database for storing content, you should also install at least one of these NuGet packages:

+ Azure AI Search: [Microsoft.Azure.WebJobs.Extensions.OpenAI.AzureAISearch](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI.AzureAISearch)
+ Azure Cosmos DB for MongoDB vCore: [Microsoft.Azure.WebJobs.Extensions.OpenAI.CosmosDBSearch](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI.CosmosDBSearch)
+ Azure Cosmos DB for NoSQL: [Microsoft.Azure.WebJobs.Extensions.OpenAI.CosmosDBSearch](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI.CosmosDBNoSQLSearch)
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

## Connecting to OpenAI

To use the Azure OpenAI binding extension, you need to specify a connection to OpenAI. This connection is defined using application settings, and the `AIConnectionName` property of the trigger or binding. You can also use environment variables to define key-based connections. 

We recommend that you use managed identity-based connections and the `AIConnectionName` property. 

### [AIConnectionName Property](#tab/ai-connection-name)

The OpenAI bindings have an `AIConnectionName` property that you can use to specify the `<ConnectionNamePrefix>` for this group of app settings that define the connection to Azure OpenAI:

| Setting name |   Description |
|---|---|
| `<CONNECTION_NAME_PREFIX>__endpoint` | Sets the URI endpoint of the Azure OpenAI in Foundry Models. This setting is always required. |
| `<CONNECTION_NAME_PREFIX>__clientId` | Sets the specific user-assigned identity to use when obtaining an access token. Requires that `<CONNECTION_NAME_PREFIX>__credential` is set to `managedidentity`. The property accepts a client ID corresponding to a user-assigned identity assigned to the application. It's invalid to specify both a Resource ID and a client ID. If not specified, the system-assigned identity is used. This property is used differently in [local development scenarios](functions-reference.md#local-development-with-identity-based-connections), when `credential` shouldn't be set. |
|  `<CONNECTION_NAME_PREFIX>__credential` | Defines how an access token is obtained for the connection. Use `managedidentity` for managed identity authentication. This value is only valid when a managed identity is available in the hosting environment. |
|  `<CONNECTION_NAME_PREFIX>__managedIdentityResourceId` | When `credential` is set to `managedidentity`, this property can be set to specify the resource Identifier to be used when obtaining a token. The property accepts a resource identifier corresponding to the resource ID of the user-defined managed identity. It's invalid to specify both a resource ID and a client ID. If neither are specified, the system-assigned identity is used. This property is used differently in [local development scenarios](functions-reference.md#local-development-with-identity-based-connections), when `credential` shouldn't be set. |
| `<CONNECTION_NAME_PREFIX>__key` | Sets the shared secret key required to access the endpoint of Azure OpenAI using key-based authentication. As a security best practice, you should always use Microsoft Entra ID with managed identities for authentication. | 

Consider these managed identity connection settings when then `AIConnectionName` property is set to `myAzureOpenAI`:

+ `myAzureOpenAI__endpoint=https://contoso.openai.azure.com/`
+ `myAzureOpenAI__credential=managedidentity`
+ `myAzureOpenAI__clientId=aaaaaaaa-bbbb-cccc-1111-222222222222`

At runtime, these settings are collectively interpreted by the host as a single `myAzureOpenAI` setting like this:

```json
"myAzureOpenAI":
{
    "endpoint": "https://contoso.openai.azure.com/",
    "credential": "managedidentity",
    "clientId": "aaaaaaaa-bbbb-cccc-1111-222222222222"
}
```

When using managed identities, make sure to add your identity to the [Cognitive Services OpenAI User](../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-user) role.

When running locally, you must add these settings to the *local.settings.json* project file. For more information, see [Local development with identity-based connections](functions-reference.md#local-development-with-identity-based-connections).

### [Environment variables](#tab/envars)

To support legacy apps and for providers other than Azure OpenAI, you can also define key-based authentication to OpenAI using these environment variables. 

| Variable name |   Description |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | Sets the URI endpoint of your Azure OpenAI instance. Don't use with `Open_API_Key`. |
| `AZURE_OPENAI_KEY` | Sets the shared secret key required to access your Azure OpenAI endpoint (`AZURE_OPENAI_ENDPOINT`) using key-based authentication.  |
| `Open_API_Key` | Sets the shared secret key required to access the `https://api.openai.com` endpoint using key-based authentication.  |

You can set these variables in your app settings. 

When running locally, you must add these settings to the *local.settings.json* project file. 

---

For more information, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings). 

 
<!---Include this section if there are any host.json settings defined by the extension:
## host.json settings
-->

## Related content

+ [Azure OpenAI extension samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples)
