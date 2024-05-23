---
title: Create a project and use the chat playground in Azure AI Studio
titleSuffix: Azure AI Studio
description: Use this article to learn how to create a project, deploy a chat model, and use it in the chat playground in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: tutorial
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Quickstart: Create a project and use the chat playground in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this [Azure AI Studio](https://ai.azure.com) quickstart, you create a project, deploy a chat model, and use it in the chat playground in Azure AI Studio.

The steps in this quickstart include:

1. Create an Azure AI Studio project.
1. Deploy an Azure OpenAI model.
1. Chat in the playground without your data.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- You need an Azure AI Studio hub or permissions to create one. Your user role must be **Azure AI Developer**, **Contributor**, or **Owner** on the hub. For more information, see [hubs](../concepts/ai-resources.md) and [Azure AI roles](../concepts/rbac-ai-studio.md).
    - If your role is **Contributor** or **Owner**, you can [create a hub in this tutorial](#create-a-project-in-azure-ai-studio). 
    - If your role is **Azure AI Developer**, the hub must already be created. 

- Your subscription needs to be below your [quota limit](../how-to/quota.md) to [deploy a new model in this tutorial](#deploy-a-chat-model). Otherwise you already need to have a [deployed chat model](../how-to/deploy-models-openai.md).

## Create a project in Azure AI Studio

Your project is used to organize your work and save state. 

[!INCLUDE [Create project](../includes/create-projects.md)]

## Deploy a chat model

[!INCLUDE [Deploy chat model](../includes/deploy-chat-model.md)]

## Chat in the playground without your data

In the [Azure AI Studio](https://ai.azure.com) playground you can observe how your model responds with and without your data. In this quickstart, you test your model without your data. 

[!INCLUDE [Chat without your data](../includes/chat-without-data.md)]

Next, you can add your data to the model to help it answer questions about your products. Try the [Deploy an enterprise chat web app](../tutorials/deploy-chat-web-app.md) and [Build and deploy a question and answer copilot with prompt flow in Azure AI Studio](../tutorials/deploy-copilot-ai-studio.md) tutorials to learn more.

## Related content

- [Build a custom chat app in Python using the prompt flow SDK](./get-started-code.md).
- [Deploy an enterprise chat web app](../tutorials/deploy-chat-web-app.md).
- [Build and deploy a question and answer copilot with prompt flow in Azure AI Studio](../tutorials/deploy-copilot-ai-studio.md).
