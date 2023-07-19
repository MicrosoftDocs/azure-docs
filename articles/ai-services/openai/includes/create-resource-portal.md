---
title: 'How-to create an Azure OpenAI Service resource using the Azure portal'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI by creating your first resource and deploying a model through the Azure portal.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/08/2023
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
    | **Name** | A descriptive name for your Azure AI services resource. For example, *MyOpenAIResource*. |
    | **Pricing Tier** | Only 1 pricing tier is available for the service currently |

    :::image type="content" source="../media/create-resource/create.png" alt-text="Screenshot of the resource creation blade for an OpenAI Resource in the Azure portal." lightbox="../media/create-resource/create.png":::

## Deploy a model

Before you can generate text or inference, you need to deploy a model. You can select from one of several available models in Azure OpenAI Studio.

To deploy a model, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).
2. Select the subscription and Azure OpenAI resource to work with.
3. Under **Management** select **Deployments**.
4. Select **Create new deployment**.

    |Field|Description|
    |--|--|
    | Select a model | Model availability varies by region.For a list of available models per region, see [Model Summary table and region availability](../concepts/models.md#model-summary-table-and-region-availability).|
    | Deployment name | Choose a name carefully. The deployment name will be used in your code to call the model via the client libraries and REST API |
    | Advanced Options| Content Filter - Assign a content filter to your deployment.<br> Tokens per Minute Rate Limit - Adjust the Tokens per Minute (TPM) to set the effective rate limit for your deployment. You can modify this value at any time via the [**Quotas**](../how-to/quota.md) menu |

5. Select a model from the drop-down.
6. Enter a deployment name to help you identify the model.
7. For your first deployment leave the Advanced Options set to the defaults.

The deployments table displays a new entry that corresponds to this newly created model. Your deployment status will move to succeeded when the deployment is complete and ready for use.
