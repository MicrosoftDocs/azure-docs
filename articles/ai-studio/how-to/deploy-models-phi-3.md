---
title: How to deploy Phi-3 family of small language models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Phi-3 family of small language models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, build-2024
---

# How to deploy Phi-3 family of small language models with Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn about the Phi-3 family of small language models (SLMs). You also learn to use Azure AI Studio to deploy models from this family as serverless APIs with pay-as-you-go token-based billing.

The Phi-3 family of SLMs is a collection of instruction-tuned generative text models. Phi-3 models are the most capable and cost-effective small language models (SLMs) available, outperforming models of the same size and next size up across various language, reasoning, coding, and math benchmarks.

## Phi-3 family of models

# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

- [Phi-3-mini-4k-Instruct](https://ai.azure.com/explore/models/Phi-3-mini-4k-instruct/version/4/registry/azureml)
- [Phi-3-mini-128k-Instruct](https://ai.azure.com/explore/models/Phi-3-mini-128k-instruct/version/4/registry/azureml)

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.

# [Phi-3-medium](#tab/phi-3-medium)
Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. 

---

## Deploy Phi-3 models as serverless APIs

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An [Azure AI Studio hub](../how-to/create-azure-ai-resource.md).

    > [!IMPORTANT]
    > For Phi-3 family models, the serverless API model deployment offering is only available with hubs created in **East US 2** and **Sweden Central** regions.

- An [Azure AI Studio project](../how-to/create-projects.md).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure AI Studio. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).


### Create a new deployment

To create a deployment:

1. Sign in to [Azure AI Studio](https://ai.azure.com).

1. Select **Model catalog** from the left sidebar.

1. Search for and select the model you want to deploy, for example **Phi-3-mini-4k-Instruct**, to open its Details page.

1. Select **Deploy**.

1. Choose the option **Serverless API** to open a serverless API deployment window for the model.

1. Alternatively, you can initiate a deployment by starting from your project in AI Studio. 

    1. From the left sidebar of your project, select **Components** > **Deployments**.
    1. Select **+ Create deployment**.
    1. Search for and select **Phi-3-mini-4k-Instruct** to open the model's Details page.
    1. Select **Confirm**, and choose the option **Serverless API** to open a serverless API deployment window for the model. 
 
1. Select the project in which you want to deploy your model. To deploy the Phi-3 model, your project must be in the *EastUS2* or *Sweden Central* region. 

1. Select the **Pricing and terms** tab to learn about pricing for the selected model.

1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region. 

1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page. This step requires that your account has the **Azure AI Developer role** permissions on the Resource Group, as listed in the prerequisites.

1. Select **Open in playground** to start interacting with the model. 

1. Return to the Deployments page, select the deployment, and note the endpoint's **Target** URL and the Secret **Key**, which you can use to call the deployment and generate completions. For more information on using the APIs, see [Reference: Chat Completions](../reference/reference-model-inference-chat-completions.md).

1. You can always find the endpoint's details, URL, and access keys by navigating to your **Project overview** page. Then, from the left sidebar of your project, select **Components** > **Deployments**.


### Consume Phi-3  models as a service

Models deployed as serverless APIs can be consumed using the chat API, depending on the type of model you deployed.

1. From your **Project overview** page, go to the left sidebar and select **Components** > **Deployments**.

1. Find and select the deployment you created.

1. Copy the **Target** URL and the **Key** value.

1. Make an API request using the `/v1/chat/completions` API using `<target_url>/v1/chat/completions`. For more information on using the APIs, see the [Reference: Chat Completions](../reference/reference-model-inference-chat-completions.md). 

## Cost and quotas

### Cost and quota considerations for Phi-3 models deployed as serverless APIs

You can find the pricing information on the **Pricing and terms** tab of the deployment wizard when deploying the model. 

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.



## Related content

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
