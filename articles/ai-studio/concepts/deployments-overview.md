---
title: Deploy models, flows, and web apps with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about deploying models, flows, and web apps with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 12/7/2023
ms.reviewer: eur
ms.author: eur
---

# Overview: Deploy models, flows, and web apps with Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Azure AI Studio supports deploying large language models (LLMs), flows, and web apps. Deploying an LLM or flow makes it available for use in a website, an application, or other production environments. This typically involves hosting the model on a server or in the cloud, and creating an API or other interface for users to interact with the model. 

You often hear this interaction with a model referred to as "inferencing". Inferencing is the process of applying new input data to a model to generate outputs. Inferencing can be used in various applications. For example, a chat completion model can be used to autocomplete words or phrases that a person is typing in real-time. A chat model can be used to generate a response to "can you create an itinerary for a single day visit in Seattle?". The possibilities are endless.

## Deploying models

First you might ask:
- "What models can I deploy?" Azure AI Studio supports deploying some of the most popular large language and vision foundation models curated by Microsoft, Hugging Face, and Meta.
- "How do I choose the right model?" Azure AI Studio provides a [model catalog](../how-to/model-catalog.md) that allows you to search and filter models based on your use case. You can also test a model on a sample playground before deploying it to your project.
- "From where in Azure AI Studio can I deploy a model?" You can deploy a model from the model catalog or from your project's deployment page.

Azure AI Studio simplifies deployments. A simple select or a line of code deploys a model and generate an API endpoint for your applications to consume. 

### Azure OpenAI models

Azure OpenAI allows you to get access to the latest OpenAI models with the enterprise features from Azure. Learn more about [how to deploy OpenAI models in AI studio](../how-to/deploy-models-openai.md).

### Open models

The model catalog offers access to a large variety of models across different modalities. Certain models in the model catalog can be deployed as a service with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need.

#### Deploy models with model as a service

This deployment option doesn't require quota from your subscription. You're billed per token in a pay-as-you-go fashion. Learn how to deploy and consume [Llama 2 model family](../how-to/deploy-models-llama.md) with model as a service.

#### Deploy models with hosted managed infrastructure

You can also host open models in your own subscription with managed infrastructure, virtual machines, and number of instances for capacity management. Currently offering a wide range of models from Azure AI, HuggingFace, and Nvidia. Learn more about [how to deploy open models to real-time endpoints](../how-to/deploy-models-open.md).

### Billing for deploying and inferencing LLMs in Azure AI Studio 

The following table describes how you're billed for deploying and inferencing LLMs in Azure AI Studio. See [monitor costs for models offered throughout the Azure Marketplace](../how-to/costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace) to learn more about how to track costs.

| Use case | Azure OpenAI models | Models deployed with pay-as-you-go | Models deployed to real-time endpoints |
| --- | --- | --- | --- |
| Deploying a model from the model catalog to your project | No, you aren't billed for deploying an Azure OpenAI model to your project. | Yes, you're billed per the infrastructure of the endpoint<sup>1</sup> | Yes, you're billed for the infrastructure hosting the model<sup>2</sup> |
| Testing chat mode on Playground after deploying a model to your project | Yes, you're billed based on your token usage | Yes, you're billed based on your token usage | None. |
| Testing a model on a sample playground on the model catalog (if applicable) | Not applicable | None. | None. |
| Testing a model in playground under your project (if applicable) or in the test tab in the deployment details page under your project. | Yes, you're billed based on your token usage | Yes, you're billed based on your token usage | None. | 

<sup>1</sup> A minimal endpoint infrastructure is billed per minute. You aren't billed for the infrastructure hosting the model itself in pay-as-you-go. After the endpoint is deleted, no further charges are made.

<sup>2</sup> Billing is done in a minute-basis depending on the SKU and the number of instances used in the deployment since the moment of creation. After the endpoint is deleted, no further charges are made.

## Deploying flows

What is a flow and why would you want to deploy it? A flow is a sequence of tools that can be used to build a generative AI application. Deploying a flow differs from deploying a model in that you can customize the flow with your own data and other components such as embeddings, vector DB lookup. and custom connections. For a how-to guide, see [Deploying flows with Azure AI Studio](../how-to/flow-deploy.md).

For example, you can build a chatbot that uses your data to generate informed and grounded responses to user queries. When you add your data in the playground, a prompt flow is automatically generated for you. You can deploy the flow as-is or customize it further with your own data and other components. In Azure AI Studio, you can also create your own flow from scratch.

Whichever way you choose to create a flow in Azure AI Studio, you can deploy it quickly and generate an API endpoint for your applications to consume.

## Deploying web apps

The model or flow that you deploy can be used in a web application hosted in Azure. Azure AI Studio provides a quick way to deploy a web app. For more information, see the [chat with your data tutorial](../tutorials/deploy-chat-web-app.md).


## Planning AI safety for a deployed model

For Azure OpenAI models such as GPT-4, Azure AI Studio provides AI safety filter during the deployment to ensure responsible use of AI. AI content safety filter allows moderation of harmful and sensitive contents to promote the safety of AI-enhanced applications. In addition to AI safety filter, Azure AI Studio offers model monitoring for deployed models. Model monitoring for LLMs uses the latest GPT language models to monitor and alert when the outputs of the model perform poorly against the set thresholds of generation safety and quality. For example, you can configure a monitor to evaluate how well the model’s generated answers align with information from the input source ("groundedness") and closely match to a ground truth sentence or document ("similarity"). 

## Optimizing the performance of a deployed model

Optimizing LLMs requires a careful consideration of several factors, including operational metrics (ex. latency), quality metrics (ex. accuracy), and cost. It's important to work with experienced data scientists and engineers to ensure your model is optimized for your specific use case.   

## Next steps

- Learn [how to deploy OpenAI models with Azure AI Studio](../how-to/deploy-models-openai.md).
- Learn [how to deploy Llama 2 family of large language models with Azure AI Studio](../how-to/deploy-models-llama.md).
- Learn [how to deploy how to deploy large language models with Azure AI Studio](../how-to/deploy-models-open.md).
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml).
