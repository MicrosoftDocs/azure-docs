---
title: 'Use your own data to generate text using Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to import and use your data in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 05/04/2023
recommendations: false
zone_pivot_groups: openai-use-your-data
---

# Quickstart: Generate text with Azure OpenAI Service using your own data

Use this article to start using your own text data with Azure OpenAI models. Using Azure OpenAI's models 
on your data can provide you with a powerful conversational AI platform that enables faster and 
more accurate communication in compliance with your organizational policies.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](./how-to/create-resource.md).
- An [Azure Cognitive Search resource](/azure/search/search-create-service-portal). 
- An [Azure storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM)

<!-- Add a feedback button here that says "I had trouble with the prerequisites." -->

::: zone pivot="programming-language-studio"

[!INCLUDE [Studio quickstart](includes/use-your-data-studio.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API quickstart](includes/use-your-data-rest.md)]

::: zone-end


## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Cognitive Services resources](../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure cognitive search resources](/azure/search/search-get-started-portal#clean-up-resources)
    
## Next steps
* Learn more about [using your data in Azure OpenAI Service](./concepts/using-your-data.md)
* [Chat app sample code on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/sawidder/new-readme/README.md).