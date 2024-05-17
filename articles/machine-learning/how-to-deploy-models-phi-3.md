---
title: How to deploy Phi-3 family of small language models with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to deploy Phi-3 family of small language models with Azure Machine Learning.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 5/21/2024
ms.author: kritifaujdar
author: fkriti
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: [references_regions]
---

# How to deploy Phi-3 family of small language models with Azure Machine Learning studio

In this article, you learn about the Phi-3 family of small language models (SLMs). You also learn to use Azure Machine Learning studio to deploy models from this family as serverless APIs with pay-as-you-go token-based billing.

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

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Deploy Phi-3 models as serverless APIs

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

### Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.
- An Azure Machine Learning workspace. If you don't have a workspace, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create one.

    > [!IMPORTANT]
    > For Phi-3 family models, the serverless API model deployment offering is only available with workspaces created in **East US 2** and **Sweden Central** regions.

- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __Azure AI Developer role__ on the resource group. For more information on permissions, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

### Create a new deployment

To create a deployment:

1. Go to [Azure Machine Learning studio](https://ml.azure.com/home).
1. Select the workspace in which you want to deploy your models. To use the serverless API model deployment offering, your workspace must belong to the **East US 2** or **Sweden Central** region.
1. Choose the model you want to deploy, for example **Phi-3-medium-128k-Instruct**, from the [model catalog](https://ml.azure.com/model/catalog).
1. On the model's overview page in the model catalog, select **Deploy** and then **Serverless API with Azure AI Content Safety**.

   Alternatively, you can initiate deployment by going to your workspace and selecting **Endpoints** > **Serverless endpoints** > **Create**. Then, you can select a model.

1. In the deployment wizard, select the **Pricing and terms** tab to learn about pricing for the selected model.
1. Give the deployment a name. This name becomes part of the deployment API URL. This URL must be unique in each Azure region. 
1. Select **Deploy**. Wait until the deployment is ready and you're redirected to the Deployments page. This step requires that your account has the **Azure AI Developer role** permissions on the resource group, as listed in the prerequisites. 
1. Take note of the **Target URI** and the secret **Key**, which you can use to call the deployment and generate completions. For more information on using the APIs, see [Reference: Chat Completions](../ai-studio/reference/reference-model-inference-chat-completions.md).
1. Select the **Test** tab to start interacting with the model. 
1. You can always find the endpoint's details, URI, and access keys by navigating to **Workspace** > **Endpoints** > **Serverless endpoints**.

### Consume Phi-3  models as a service

Models deployed as serverless APIs can be consumed using the chat API, depending on the type of model you deployed.

1. In the **workspace**, select **Endpoints** > **Serverless endpoints**.
1. Find and select the deployment you created.
1. Copy the **Target** URI and the **Key** token values.
1. Make an API request using the `/v1/chat/completions` API using `<target_url>/v1/chat/completions`. For more information on using the APIs, see the [Reference: Chat Completions](../ai-studio/reference/reference-model-inference-chat-completions.md). 

## Cost and quotas

### Cost and quota considerations for Phi-3 models deployed as serverless APIs

You can find the pricing information on the **Pricing and terms** tab of the deployment wizard when deploying the model. 

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per workspace. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.



## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Plan and manage costs for Azure AI Studio](concept-plan-manage-cost.md)