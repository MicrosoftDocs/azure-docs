---
title: How to deploy open models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy open models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 05/06/2024
ms.reviewer: fasantia
ms.author: mopeakande
author: msakande
---

# How to deploy large language models with Azure AI Studio 

Deployment of a large language model (LLM) makes it available for use in a website, an application, or other production environment. Deployment typically involves hosting the model on a server or in the cloud and creating an API or other interface for users to interact with the model. You can invoke the deployment for real-time inference of generative AI applications such as chat and copilot.

## Deploy open models

Use the following steps to deploy an open model such as *distilbert-base-cased* to a real-time endpoint in Azure AI Studio.

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Model catalog** from the left sidebar.
1. Select a model you want to deploy from the Azure AI Studio [model catalog](../how-to/model-catalog.md). 
1. Select **Deploy** to open the deployment window. 
1. Choose the project you want to deploy the model to. 
1. Select **Deploy**.

1. Alternatively, you can initiate deployment by starting from your project in AI Studio

    1. Select **Components** > **Deployments**.
    1. Select **+ Create deployment**.
    1. Search for and select the model you want to deploy.
    1. Select **Confirm** to open the deployment window.
    1. Select **Deploy**.

1. You land on the deployment details page. Select **Consume** to obtain code samples that can be used to consume the deployed model in your application. 

## Delete the deployment endpoint

To delete deployments in Azure AI Studio, select the **Delete** button on the top panel of the deployment details page.

## Quota considerations

To deploy and perform inferencing with real-time endpoints, you consume Virtual Machine (VM) core quota that is assigned to your subscription on a per-region basis. When you sign up for Azure AI Studio, you receive a default VM quota for several VM families available in the region. You can continue to create deployments until you reach your quota limit. Once that happens, you can request for a quota increase.  

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
