---
title: How to deploy open models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy open models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 12/11/2023
ms.reviewer: fasantia
ms.author: mopeakande
author: msakande
---

# How to deploy large language models with Azure AI Studio 

Deploying a large language model (LLM) makes it available for use in a website, an application, or other production environments. This typically involves hosting the model on a server or in the cloud, and creating an API or other interface for users to interact with the model. You can invoke the deployment for real-time inference for chat, copilot, or another generative AI application.

## Deploy open models

Follow the steps below to deploy an open model such as `distilbert-base-cased` to a real-time endpoint in Azure AI Studio.

1. Choose a model you want to deploy from the Azure AI Studio [model catalog](../how-to/model-catalog.md). Alternatively, you can initiate deployment by selecting **+ Create** from `your project`>`deployments` 

1. Select **Deploy** to project on the model card details page. 

1. Choose the project you want to deploy the model to. 

1. Select **Deploy**. 

1. You land on the deployment details page. Select **Consume** to obtain code samples that can be used to consume the deployed model in your application. 

## Delete the deployment endpoint

Deleting deployments and its associated endpoint isn't supported via the Azure AI SDK. To delete deployments in Azure AI Studio, select the **Delete** button on the top panel of the deployment details page.

## Quota considerations

Deploying and inferencing with real-time endpoints can be done by consuming Virtual Machine (VM) core quota that is assigned to your subscription a per-region basis. When you sign up for Azure AI Studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once that happens, you can request for quota increase.  

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
