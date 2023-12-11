---
title: How to deploy Azure OpenAI models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Azure OpenAI models with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 12/11/2023
ms.author: eur
---

# How to deploy Azure OpenAI models with Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Azure OpenAI Service offers a diverse set of models with different capabilities and price points. Model availability varies by region. You can create Azure OpenAI model deployments in Azure AI Studio and consume them with prompt flow or your favorite tool. To learn more about the details of each model see [Azure OpenAI Service models](../../ai-services/openai/concepts/models.md).

## Deploying an Azure OpenAI model from the model catalog

To modify and interact with an Azure OpenAI model in the [Azure AI Studio](https://ai.azure.com) playground, first you need to deploy a base Azure OpenAI model to your project. Once the model is deployed and available in your project, you can consume its REST API endpoint as-is or customize further with your own data and other components (embeddings, indexes, etcetera).  
 
1. Choose a model you want to deploy from Azure AI Studio [model catalog](../how-to/model-catalog.md). Alternatively, you can initiate deployment by selecting **+ Create** from `your project`>`deployments` 

1. Select **Deploy** to project on the model card details page. 

1. Choose the project you want to deploy the model to. For Azure OpenAI models, the Azure AI Content Safety filter is automatically turned on.   

1. Select **Deploy**.

1. You land in the playground. Select **View Code** to obtain code samples that can be used to consume the deployed model in your application. 


## Regional availability and quota limits of a model

For Azure OpenAI models, the default quota for models varies by model and region. Certain models might only be available in some regions. For more information, see [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits).

## Quota for deploying and inferencing a model

For Azure OpenAI models, deploying and inferencing consumes quota that is assigned to your subscription on a per-region, per-model basis in units of Tokens-per-Minutes (TPM). When you sign up for Azure AI Studio, you receive default quota for most available models. Then, you assign TPM to each deployment as it is created, and the available quota for that model will be reduced by that amount. You can continue to create deployments and assign them TPM until you reach your quota limit. 

Once that happens, you can only create new deployments of that model by:

- Request more quota by submitting a [quota increase form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4xPXO648sJKt4GoXAed-0pURVJWRU4yRTMxRkszU0NXRFFTTEhaT1g1NyQlQCN0PWcu).
- Adjust the allocated quota on other model deployments to free up tokens for new deployments on the [Azure OpenAI Portal](https://oai.azure.com/portal).

See [Azure AI Studio quota](./quota.md) and [Manage Azure OpenAI Service quota](../../ai-services/openai/how-to/quota.md?tabs=rest) to learn more about quota.

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)