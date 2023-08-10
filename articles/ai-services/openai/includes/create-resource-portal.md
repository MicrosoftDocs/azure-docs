---
title: 'Create and manage Azure OpenAI Service deployments in the Azure portal'
titleSuffix: Azure OpenAI
description: Learn how to use the Azure portal to create an Azure OpenAI resource and manage deployments with the Azure OpenAI Service.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 08/14/2023
keywords: 
---

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure Open AI in the desired Azure subscription.

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Create a resource

The following steps show how to create an Azure OpenAI resource in the Azure portal.

1. Sign in with your Azure subscription in the Azure portal.

1. Browse to the [Azure OpenAI Service Create Page](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI).

1. On the **Create** page, provide the following information:

   | Field | Description |
   |---|---|
   | **Subscription** | Select the Azure subscription used in your Azure OpenAI Service onboarding application. |
   | **Resource group** | The Azure resource group to contain your Azure OpenAI resource. You can create a new group or use a pre-existing group. |
   | **Region** | The location of your instance. Different locations can introduce latency, but they don't affect the runtime availability of your resource. |
   | **Name** | A descriptive name for your Azure AI services resource, such as _MyOpenAIResource_. |
   | **Pricing Tier** | Only one pricing tier is available for the service currently. |

   :::image type="content" source="../media/create-resource/create.png" alt-text="Screenshot that shows how to create an Azure OpenAI resource in the Azure portal." lightbox="../media/create-resource/create.png":::

## Deploy a model

Before you can generate text or inference, you need to deploy a model. You can select from one of several available models in Azure OpenAI Studio.

To deploy a model, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).

1. Select the subscription and Azure OpenAI resource to work with.

1. Under **Management** select **Deployments**.

1. Select **Create new deployment** and configure the following fields:

   | Field | Description |
   |---|---|
   | **Select a model** | Model availability varies by region. For a list of available models per region, see [Model summary table and region availability](../concepts/models.md#model-summary-table-and-region-availability). |
   | **Deployment name** | Choose a name carefully. The deployment name is used in your code to call the model via the client libraries and the REST APIs. |
   | **Advanced options** | - For the **Content Filter**, assign a content filter to your deployment.<br> - For the **Tokens per Minute Rate Limit**, adjust the Tokens per Minute (TPM) to set the effective rate limit for your deployment. You can modify this value at any time via the [**Quotas**](../how-to/quota.md) menu. |

   1. Select a model from the drop-down list.

   1. Enter a deployment name to help you identify the model.

   1. For your first deployment, leave the **Advanced options** set to the defaults.

The deployments table displays a new entry that corresponds to this newly created model. Your deployment status changes to _succeeded_ when the deployment is complete and ready for use.
