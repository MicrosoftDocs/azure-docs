---
title: Create and deploy a model in Microsoft Foundry
description: Steps to create a Microsoft Foundry project and deploy a model for use with your agent.
ms.author: cephalin
ms.topic: include
ms.date: 12/08/2025
ms.service: azure-app-service
---

1. In the [Foundry portal](https://ai.azure.com), make sure the top **New Foundry** radio button is set to active and create a project. 

1. Deploy a model of your choice (see [Microsoft Foundry Quickstart: Create resources](/azure/ai-foundry/quickstarts/get-started-code?view=foundry&preserve-view=true#create-resources)).

1. From top of the model playground, copy the model name.

1. The easiest way to get the Azure OpenAI endpoint is still from the classic portal. Select the **New Foundry** radio button, then **Azure OpenAI**, and then copy the URL in **Azure OpenAI endpoint** for later.

    :::image type="content" source="../../media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/foundry-project-openai-endpoint.png" alt-text="Screenshot showing how to copy the OpenAI endpoint and the foundry project endpoint in the foundry portal.":::
