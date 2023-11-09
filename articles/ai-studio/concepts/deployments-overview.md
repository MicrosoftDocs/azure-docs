---
title: Deploy models, flows, and web apps with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about deploying models, flows, and web apps with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Overview: Deploy models, flows, and web apps with Azure AI Studio

Azure AI Studio supports deploying large language models (LLMs), flows, and web apps. Deploying an LLM or flow makes it available for use in a website, an application, or other production environments. This typically involves hosting the model on a server or in the cloud, and creating an API or other interface for users to interact with the model. 

You often hear this interaction with a model referred to as "inferencing". Inferencing is the process of applying new input data to a model to generate outputs. Inferencing can be used in various applications. For example, a chat completion model can be used to autocomplete words or phrases that a person is typing in real-time. A chat model can be used to generate a response to "can you create an itinerary for a single day visit in Seattle?". The possibilities are endless.

## Deploying models

First you might ask:
- "What models can I deploy?" Azure AI Studio supports deploying some of the most popular large language and vision foundation models curated by Microsoft, Hugging Face, and Meta.
- "How do I choose the right model?" Azure AI Studio provides a [model catalog](../how-to/model-catalog.md) that allows you to search and filter models based on your use case. You can also test a model on a sample playground before deploying it to your project.
- "From where in Azure AI Studio can I deploy a model?" You can deploy a model from the model catalog or from your project's deployment page.

Azure AI Studio simplifies deployments. A simple select or a line of code deploys a model and generate an API endpoint for your applications to consume. For a how-to guide, see [Deploying models with Azure AI Studio](../how-to/deploy-models.md).

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


## Regional availability and quota limits of a model

For Azure OpenAI models, the default quota for models varies by model and region. Certain models might only be available in some regions. For more information, see [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits).

## Quota for deploying and inferencing a model

For Azure OpenAI models, deploying and inferencing consumes quota that is assigned to your subscription on a per-region, per-model basis in units of Tokens-per-Minutes (TPM). When you sign up for Azure AI Studio, you receive default quota for most available models. Then, you assign TPM to each deployment as it is created, and the available quota for that model will be reduced by that amount. You can continue to create deployments and assign them TPM until you reach your quota limit. 

Once that happens, you can only create new deployments of that model by:

- Request more quota by submitting a [quota increase form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4xPXO648sJKt4GoXAed-0pURVJWRU4yRTMxRkszU0NXRFFTTEhaT1g1NyQlQCN0PWcu).
- Adjust the allocated quota on other model deployments to free up tokens for new deployments on [Azure OpenAI Portal](https://oai.azure.com/portal).

To learn more, see [Manage Azure OpenAI Service quota documentation](../../ai-services/openai/how-to/quota.md?tabs=rest).

For other models such as Llama and Falcon models, deploying and inferencing can be done by consuming Virtual Machine (VM) core quota that is assigned to your subscription a per-region basis. When you sign up for Azure AI Studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once that happens, you can request for quota increase.  

## Billing for deploying and inferencing LLMs in Azure AI Studio 

The following table describes how you're billed for deploying and inferencing LLMs in Azure AI Studio.

| Use case | Azure OpenAI models | Open source and Meta models |
| --- | --- | --- |
| Deploying a model from the model catalog to your project | No, you aren't billed for deploying an Azure OpenAI model to your project. | Yes, you're billed for deploying (hosting) an open source or a Meta model |
| Testing chat mode on Playground after deploying a model to your project | Yes, you're billed based on your token usage | Not applicable |
| Consuming a deployed model inside your application | Yes, you're billed based on your token usage | Yes, you're billed for scoring your hosted open source or Meta model |
| Testing a model on a sample playground on the model catalog (if applicable) | Not applicable | No, you aren't billed without deploying (hosting) an open source or a Meta model |
| Testing a model in playground under your project (if applicable) or in the test tab in the deployment details page under your project. | Not applicable | Yes, you're billed for scoring your hosted open source or Meta model. |


## Next steps

- Learn how you can build generative AI applications in the [Azure AI Studio](../what-is-ai-studio.md).
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml).
