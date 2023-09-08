---
title: 'Use your own data with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to import and use your data in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 08/08/2023
recommendations: false
zone_pivot_groups: openai-use-your-data
---

# Quickstart: Chat with Azure OpenAI models using your own data

In this quickstart you can use your own data with Azure OpenAI models. Using Azure OpenAI's models on your data can provide you with a powerful conversational AI platform that enables faster and more accurate communication.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Azure OpenAI requires registration and is currently only available to approved enterprise customers and partners. [See Limited access to Azure OpenAI Service](/legal/cognitive-services/openai/limited-access?context=/azure/ai-services/openai/context/context) for more information. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- An Azure OpenAI resource with a chat model deployed (for example, GPT-3 or GPT-4). For more information about model deployment, see the [resource deployment guide](./how-to/create-resource.md).
- Be sure that you are assigned at least the [Cognitive Services OpenAI Contributor](/azure/role-based-access-control/built-in-roles#cognitive-services-openai-contributor) role for the Azure OpenAI resource. 


> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=OVERVIEW&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Prerequisites)

::: zone pivot="programming-language-studio"

[!INCLUDE [Studio quickstart](includes/use-your-data-studio.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API quickstart](includes/use-your-data-rest.md)]

::: zone-end


## Clean up resources

If you want to clean up and remove an OpenAI or Azure Cognitive Search resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure AI services resources](../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure Cognitive Search resources](/azure/search/search-get-started-portal#clean-up-resources)
- [Azure app service resources](/azure/app-service/quickstart-dotnetcore?pivots=development-environment-vs#clean-up-resources)

## Next steps
- Learn more about [using your data in Azure OpenAI Service](./concepts/use-your-data.md)
- [Chat app sample code on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main).
