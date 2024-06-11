---
title: "Quickstart: Use SDK to create and manage project - custom question answering"
description: This quickstart shows you how to create and manage your project using custom question answering.
ms.service: azure-ai-language
ms.topic: quickstart
ms.date: 12/19/2023
author: jboback
ms.author: jboback
recommendations: false
ms.devlang: csharp
# ms.devlang: csharp, python
ms.custom: devx-track-python, devx-track-csharp, language-service-question-answering, mode-api, devx-track-dotnet
zone_pivot_groups: custom-qna-quickstart
---

# Quickstart: custom question answering

> [!NOTE]
> [Azure Open AI On Your Data](../../../openai/concepts/use-your-data.md) utilizes large language models (LLMs) to produce similar results to Custom Question Answering. If you wish to connect an existing Custom Question Answering project to Azure Open AI On Your Data, please check out our [guide](../how-to/azure-openai-integration.md).

> [!NOTE]
> Are you looking to migrate your workloads from QnA Maker? See our [migration guide](../how-to/migrate-qnamaker-to-question-answering.md) for information on feature comparisons and migration steps.

Get started with the custom question answering client library. Follow these steps to install the package and try out the example code for basic tasks.

::: zone pivot="studio"
[!INCLUDE [Studio quickstart](../includes/studio.md)]
::: zone-end

::: zone pivot="rest"
[!INCLUDE [REST quickstart](../includes/rest.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# client library quickstart](../includes/sdk-csharp.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python client library quickstart](../includes/sdk-python.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)



## Explore the REST API

To learn about automating your custom question answering pipeline consult the REST API documentation. Currently authoring functionality is only available via REST API:

* [Authoring API reference](/rest/api/cognitiveservices/questionanswering/question-answering-projects)
* [Authoring API cURL examples](../how-to/authoring.md)
* [Runtime API reference](/rest/api/cognitiveservices/questionanswering/question-answering)

## Next steps

* [Tutorial: Create an FAQ bot](../tutorials/bot-service.md)
