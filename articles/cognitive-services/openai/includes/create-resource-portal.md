---
title: 'How-to create an Azure OpenAI Service resource using the Azure portal'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI by creating your first resource and deploying a model through the Azure portal.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 02/02/2023
keywords: 
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

## Create a resource

Resources in Azure can be created several different ways:

- Within the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI)
- Using the REST APIs, Azure CLI, PowerShell or client libraries
- Via ARM templates

This guide walks you through the Azure portal creation experience.

1. Navigate to the create page: [Azure OpenAI Service Create Page](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI)
1. On the **Create** page provide the following information:

    |Field| Description   |
    |--|--|
    | **Subscription** | Select the Azure subscription used in your OpenAI onboarding application|
    | **Resource group** | The Azure resource group that will contain your OpenAI resource. You can create a new group or add it to a pre-existing group. |
    | **Region** | The location of your instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource.|
    | **Name** | A descriptive name for your cognitive services resource. For example, *MyOpenAIResource*. |
    | **Pricing Tier** | Only 1 pricing tier is available for the service currently |

    :::image type="content" source="../media/create-resource/create.png" alt-text="Screenshot of the resource creation blade for an OpenAI Resource in the Azure portal." lightbox="../media/create-resource/create.png":::

## Deploy a model

Before you can generate text or inference, you need to deploy a model. You can select from one of several available models in Azure OpenAI Studio.

Davinci is the most capable model family and can perform any task the other models can perform and often with less instruction. For applications requiring a lot of understanding of the content, like summarization for a specific audience and creative content generation, Davinci is going to produce the best results.

To deploy a model, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).
1. Select the subscription and OpenAI resource to work with. 
1. Select **Manage deployments in your resource** > **Go to Deployments** under **Manage your deployments and models**. You might first need to scroll down on the landing page.

    :::image type="content" source="../media/create-resource/deployment.png" alt-text="Screenshot of Azure OpenAI Studio page with the 'Go to Deployments' button highlighted." lightbox="../media/create-resource/deployment.png":::

1. Select **Create new deployment** from the **Management** > **Deployments** page.
1. Select a model from the drop-down. For getting started in the East US region, we recommend the `text-davinci-003` model. In other regions you should start with the `text-davinci-002` model. Some models are not available in all regions. For a list of available models per region, see [Model Summary table and region availability](../concepts/models.md#model-summary-table-and-region-availability).
1. Enter a model name to help you identify the model. Choose a name carefully. The model name will be used as the deployment name via OpenAI client libraries and API. 
1. Select **Create** to deploy the model. 

The deployments table displays a new entry that corresponds to this newly created model. Your deployment status will move to succeeded when the deployment is complete and ready for use.