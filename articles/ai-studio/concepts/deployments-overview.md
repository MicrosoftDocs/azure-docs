---
title: Deploy models, flows, and web apps with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about deploying models, flows, and web apps by using Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: fasantia
ms.author: mopeakande
author: msakande
---

# Overview: Deploy models, flows, and web apps with Azure AI Studio

Azure AI Studio supports deploying large language models (LLMs), flows, and web apps. Deploying an LLM or flow makes it available for use in a website, an application, or other production environments. This effort typically involves hosting the model on a server or in the cloud, and creating an API or other interface for users to interact with the model.

The process of interacting with a deployed model is called *inferencing*. Inferencing involves applying new input data to a model to generate outputs.

You can use inferencing in various applications. For example, you can use a chat completion model to automatically complete words or phrases that a person is typing in real time. You can also use a chat model to generate a response to the question "Can you create an itinerary for a single-day visit in Seattle?" The possibilities are endless.

## Deploying models

First, you might ask:

- "What models can I deploy?"

   Azure AI Studio supports deploying some of the most popular large language and vision foundation models curated by Microsoft, Hugging Face, Meta, and more.
- "How do I choose the right model?"

   Azure AI Studio provides a [model catalog](../how-to/model-catalog-overview.md) where you can search and filter models based on your use case. You can also test a model in a sample playground before deploying it to your project.
- "From where in Azure AI Studio can I deploy a model?"

   You can deploy a model from the model catalog or from your project's deployment page.

Azure AI Studio simplifies deployments. A simple selection or a line of code deploys a model and generates an API endpoint for your applications to consume.

### Azure OpenAI models

With Azure OpenAI Service, you can get access to the latest OpenAI models that have enterprise features from Azure. [Learn more about how to deploy Azure OpenAI models in AI Studio](../how-to/deploy-models-openai.md).

### Open models

The model catalog offers access to a large variety of models across modalities. You can deploy certain models in the model catalog as a service with pay-as-you-go billing. This capability provides a way to consume the models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that your organization needs.

#### Deploy models as serverless APIs

Model deployment as a serverless API doesn't require a quota from your subscription. This option allows you to deploy your model as a service (MaaS). You use a serverless API deployment and are billed per token in a pay-as-you-go fashion. For more information about deploying a model as a serverless API, see [Deploy models as serverless APIs](../how-to/deploy-models-serverless.md).

#### Deploy models with a hosted, managed infrastructure

You can host open models in your own subscription with a managed infrastructure, virtual machines, and the number of instances for capacity management. There's a wide range of models from Azure OpenAI, Hugging Face, and NVIDIA. [Learn more about how to deploy open models to real-time endpoints](../how-to/deploy-models-open.md).

### Billing for deploying and inferencing LLMs in Azure AI Studio

The following table describes how you're billed for deploying and inferencing LLMs in Azure AI Studio. To learn more about how to track costs, see [Monitor costs for models offered through Azure Marketplace](../how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace).

| Use case | Azure OpenAI models | Models deployed as serverless APIs (pay-as-you-go) | Models deployed with managed compute |
| --- | --- | --- | --- |
| Deploying a model from the model catalog to your project | No, you aren't billed for deploying an Azure OpenAI model to your project. | Yes, you're billed according to the infrastructure of the endpoint.<sup>1</sup> | Yes, you're billed for the infrastructure that hosts the model.<sup>2</sup> |
| Testing chat mode in a playground after deploying a model to your project | Yes, you're billed based on your token usage. | Yes, you're billed based on your token usage. | None |
| Testing a model in a sample playground on the model catalog (if applicable) | Not applicable | None | None |
| Testing a model in a playground under your project (if applicable), or on the test tab on the deployment details page under your project. | Yes, you're billed based on your token usage. | Yes, you're billed based on your token usage. | None |

<sup>1</sup> A minimal endpoint infrastructure is billed per minute. You aren't billed for the infrastructure that hosts the model in pay-as-you-go. After you delete the endpoint, no further charges accrue.

<sup>2</sup> Billing is on a per-minute basis, depending on the product tier and the number of instances used in the deployment since the moment of creation. After you delete the endpoint, no further charges accrue.

## Deploying flows

What is a flow and why would you want to deploy it? A flow is a sequence of tools that you can use to build a generative AI application. Deploying a flow differs from deploying a model in that you can customize the flow with your own data and other components such as embeddings, vector database lookup, and custom connections. For a how-to guide, see [Deploy a flow for real-time inference](../how-to/flow-deploy.md).

For example, you can build a chatbot that uses your data to generate informed and grounded responses to user queries. When you add your data in the playground, a prompt flow is automatically generated for you. You can deploy the flow as is or customize it. In Azure AI Studio, you can also create your own flow from scratch.

Whichever way you choose to create a flow in Azure AI Studio, you can deploy it quickly and generate an API endpoint for your applications to consume.

## Deploying web apps

The model or flow that you deploy can be used in a web application hosted on Azure. Azure AI Studio provides a quick way to deploy a web app. For more information, see the [Azure AI Studio enterprise chat tutorial](../tutorials/deploy-chat-web-app.md).

## Planning AI safety for a deployed model

For Azure OpenAI models such as GPT-4, Azure AI Studio provides a safety filter during the deployment to ensure responsible use of AI. A safety filter allows moderation of harmful and sensitive content to promote the safety of AI-enhanced applications.

Azure AI Studio also offers model monitoring for deployed models. Model monitoring for LLMs uses the latest GPT language models to monitor and alert when the outputs of a model perform poorly against the set thresholds of generation safety and quality. For example, you can configure a monitor to evaluate how well the model's generated answers align with information from the input source (*groundedness*) and closely match to a ground-truth sentence or document (*similarity*).

## Optimizing the performance of a deployed model

Optimizing LLMs requires a careful consideration of several factors, including operational metrics (for example, latency), quality metrics (for example, accuracy), and cost. It's important to work with experienced data scientists and engineers to ensure that your model is optimized for your specific use case.

## Related content

- [Deploy Azure OpenAI models with Azure AI Studio](../how-to/deploy-models-openai.md)
- [Deploy Meta Llama 3.1 models with Azure AI Studio](../how-to/deploy-models-llama.md)
- [Deploy large language models with Azure AI Studio](../how-to/deploy-models-open.md)
- [Azure AI Studio FAQ](../faq.yml)
