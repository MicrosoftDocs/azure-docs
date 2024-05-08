---
title: Azure OpenAI Extensions for Azure Functions
description: Learn to use the OpenAI triggers and bindings with Azure Functions to do a thing....
ms.topic: reference
ms.date: 04/12/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI extensions for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI extensions for Azure Functions implement a set of triggers and bindings that enable you to easily integrate features and behaviors of the [Azure OpenAI service](../ai-services/openai/overview.md) into your function code executions. 

Azure Functions is an event-driven compute service that provides a set of [triggers and bindings](./functions-triggers-bindings.md) to easily connect with other Azure services. Dapr provides a set of building blocks and best practices for building distributed applications, including microservices, state management, pub/sub messaging, and more.

With the integration between Azure OpenAI and Functions, you can build functions that can:

| Action  | Trigger/binding type |
|---------|-----------|
| Use a standard chat prompt with dynamic data | [Azure OpenAI text completion input binding](functions-bindings-openai-textcompletion-input.md) |
| Respond to an assistant request | [Azure OpenAI assistant trigger](functions-bindings-openai-assistant-trigger.md) |
| Create an assistant | [Azure OpenAI assistant create output binding](functions-bindings-openai-assistantcreate-output.md) |
| Message an assistant | [Azure OpenAI assistant post output binding](functions-bindings-openai-assistantpost-output.md) |
| Get assistant history | [Azure OpenAI assistant query input binding](functions-bindings-openai-assistantquery-input.md) |
| Read text embeddings | [Azure OpenAI embeddings input binding](functions-bindings-openai-embeddings-input.md) |
| Read from a vector database | [Azure OpenAI semantic search input binding](functions-bindings-openai-semanticsearch-input.md) |
| Write to a vector database | [Azure OpenAI semantic search output binding](functions-bindings-openai-semanticsearch-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension
The extension NuGet package you install depends on the C# mode [in-process](functions-dotnet-class-library.md) or [isolated worker process](dotnet-isolated-process-guide.md) you're using in your function app:

### [Isolated process](#tab/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Functions.Worker.Extensions.OpenAI), version {{update to latest}}.

Using the .NET CLI:

```dotnetcli
dotnet add package Functions.Worker.Extensions.OpenAI --prerelease
``` 

### [In-process](#tab/in-process)

This extension is available by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.OpenAI), version {{update to latest}}.

Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.WebJobs.Extensions.OpenAI --prerelease
``` 

---

::: zone-end

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"

## Install bundle

You can add the preview extension by adding or replacing the following code in your `host.json` file:
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

## Next steps

<!-- ## Create your Azure OpenAI Resource

1. Follow the [Azure OpenAI create quickstart](/../ai-services/openai/how-to/create-resource) to create an Azure OpenAI resource.

<!-- https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal -->

<!-- 1. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Resource group**|Choose the resource group where you created your function app in the [previous article](./create-first-function-vs-code-csharp.md). |
    |**Name**|Enter `mySampleOpenAI`.|
  

1. Once the creation has completed, navigate to the Azure OpenAI resource blade in the Azure portal, and, under **Essentials**, select **Click here to view endpoints**. Copy the **endpoint** url and the **keys**. Paste these values into a temporary document for later use.
 -->

<!-- [Learn more about Dapr.](https://docs.dapr.io/) -->
