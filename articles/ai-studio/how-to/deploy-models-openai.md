---
title: How to deploy Azure OpenAI models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Azure OpenAI models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 05/07/2024
ms.reviewer: fasantia
ms.author: mopeakande
author: msakande
---

# How to deploy Azure OpenAI models with Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn to create Azure OpenAI model deployments in Azure AI Studio and consume the deployments with prompt flow.

Azure OpenAI service offers a diverse set of models with different capabilities and price points. When you deploy Azure OpenAI models in Azure AI Studio, you can consume the deployments, using prompt flow or another tool. Model availability varies by region. To learn more about the details of each model see [Azure OpenAI Service models](../../ai-services/openai/concepts/models.md).

## Deploy an Azure OpenAI model from the model catalog

To modify and interact with an Azure OpenAI model in the [Azure AI Studio](https://ai.azure.com) playground, first you need to deploy a base Azure OpenAI model to your project. Once the model is deployed and available in your project, you can consume its REST API endpoint as-is or customize it further with your own data and other components (embeddings, indexes, etcetera).  

Use the following steps to deploy an Azure OpenAI model, such as *gpt-4*, to a real-time endpoint in Azure AI Studio.

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the left sidebar.
1. Select a model you want to deploy from the Azure AI Studio [model catalog](../how-to/model-catalog.md). 
1. Select **Deploy** to open the deployment window.
1. Select the Azure AI Studio hub to use. For Azure OpenAI models, the Azure AI Content safety filter is on by default. 
1. Select **Deploy**.

1. Alternatively, you can initiate deployment by starting from your project in AI Studio

    1. Select **Components** > **Deployments**.
    1. Select **+ Create deployment**.
    1. Search for and select the model you want to deploy.
    1. Select **Confirm** to open the deployment window.
    1. Select **Deploy**.

1. You land on the deployment details page. Select **Open in playground**.
1. Select **View Code** to obtain code samples that can be used to consume the deployed model in your application.

## Regional availability and quota limits of a model

For Azure OpenAI models, the default quota for models varies by model and region. Certain models might only be available in some regions. For more information on availability and quota limits, see [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits).

## Quota for deploying and inferencing a model

For Azure OpenAI models, deploying and inferencing consumes quota that is assigned to your subscription on a per-region, per-model basis in units of Tokens-per-Minute (TPM). When you sign up for Azure AI Studio, you receive default quota for most of the available models. Then, you assign TPM to each deployment as it is created, thus reducing the available quota for that model by the amount you assigned. You can continue to create deployments and assign them TPMs until you reach your quota limit. 

Once you reach your quota limit, the only way for you to create new deployments of that model is to:

- Request more quota by submitting a [quota increase form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4xPXO648sJKt4GoXAed-0pURVJWRU4yRTMxRkszU0NXRFFTTEhaT1g1NyQlQCN0PWcu).
- Adjust the allocated quota on other model deployments to free up tokens for new deployments on the [Azure OpenAI Portal](https://oai.azure.com/portal).

To learn more about quota, see [Azure AI Studio quota](./quota.md) and [Manage Azure OpenAI Service quota](../../ai-services/openai/how-to/quota.md?tabs=rest).

## Related content

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)