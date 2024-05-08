---
title: Work with OpenAI using Azure Functions in Visual Studio Code
description: Learn how to connect Azure Functions to OpenAI by adding an output binding to your Visual Studio Code project.
ms.date: 3/4/2024
ms.topic: quickstart
author: dbandaru
ms.author: dbandaru
ms.reviewer: 
zone_pivot_groups: programming-languages-set-functions-temp
ms.devlang: csharp, python, javascript
# ms.devlang: csharp, javascript
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
---

# Work with OpenAI Azure Functions to do Chat Completions using Visual Studio Code

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to use Visual Studio Code to connect [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) to the function you created in the previous quickstart article. The output binding that you add to this function writes data from the HTTP request to a table in Azure SQL Database. 

::: zone pivot="programming-language-csharp"
Before you begin, you must complete the [quickstart: Create a C# function in Azure using Visual Studio Code](create-first-function-vs-code-csharp.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.
::: zone-end


## Create your Azure OpenAI Resource

1. Follow the [Azure OpenAI create quickstart](/../ai-services/openai/how-to/create-resource) to create an Azure OpenAI resource.

<!-- https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal -->

1. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Resource group**|Choose the resource group where you created your function app in the [previous article](./create-first-function-vs-code-csharp.md). |
    |**Name**|Enter `mySampleOpenAI`.|
  

1. Once the creation has completed, navigate to the Azure OpenAI resource blade in the Azure portal, and, under **Essentials**, select **Click here to view endpoints**. Copy the **endpoint** url and the **keys**. Paste these values into a temporary document for later use.

## Requirements
To complete this article and walkthrough, you will need the following:

- .NET 6 SDK or greater (Visual Studio 2022 recommended)
- Azure Functions Core Tools v4.x
- Update settings in Azure Function or the local.settings.json file for local development with the following keys:
    -  For Azure, AZURE_OPENAI_ENDPOINT - Azure OpenAI resource (e.g. https://***.openai.azure.com/) set.
    - For Azure, assign the user or function app managed identity Cognitive Services OpenAI User role on the Azure OpenAI resource. It is strongly recommended to use managed identity to avoid overhead of secrets maintenance, however if there is a need for key based authentication add the setting AZURE_OPENAI_KEY and its value in the settings.
    - For non- Azure, OPENAI_API_KEY - An OpenAI account and an API key saved into a setting.If using environment variables, Learn more in .env readme.
    - Update CHAT_MODEL_DEPLOYMENT_NAME and EMBEDDING_MODEL_DEPLOYMENT_NAME keys to Azure Deployment names or override default OpenAI model names.
    - If using user assigned managed identity, add AZURE_CLIENT_ID to environment variable settings with value as client id of the managed identity.
    - Visit binding specific samples README for additional settings that might be required for each binding.
- Azure Storage emulator such as Azurite running in the background
- The target language runtime (e.g. dotnet, nodejs, powershell, python, java) installed on your machine. Refer the official supported versions.


## Register binding extensions

Because you're using an Azure OpenAI output binding, you must have the corresponding bindings extension installed before you run the project. 

::: zone pivot="programming-language-csharp"

With the exception of HTTP and timer triggers, bindings are implemented as extension packages. Run the following [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to add the Azure OpenAI extension package to your project.

# [Isolated worker model](#tab/isolated-process)
```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.OpenAI
```
# [In-process model](#tab/in-process)
```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.OpenAI
```
---
::: zone-end

Now, you can add the Azure OpenAI output binding to your project.

## Add code to use the output binding


# [Isolated worker model](#tab/isolated-process)

Replace the existing `HttpExample` class with the following code:

:::code language="csharp" source="~/functions-openai-extension/samples/textcompletion/python/function_app.py" range=17-47 ::: 


## Run the function locally

1. Install and start Azurite for local development storage. For instructions on how to work with Azurite: https://learn.microsoft.com/azure/storage/common/storage-use-azurite


1. Run your function by starting the local Azure Functions runtime host from the LocalFunctionProj folder.

```bash
dotnet build && cd bin/debug/net6.0 && func start
```

1. To send a request the function insert the name in the following post request and send the post request.

```bash
POST http://localhost:7071/api/whois/{name}

```

::: zone-end


## Clean up resources

In Azure, *resources* refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group.

You created resources to complete these quickstarts. You may be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). If you don't need the resources anymore, here's how to delete them:

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

## Next steps

You've created your text completion with Azure Functions and OpenAI. Now you can learn more about developing Functions using the OpenAI Binding in the reference section.


