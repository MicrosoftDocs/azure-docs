---
title: Create an agent in Microsoft Foundry
description: Steps to create an agent in the Microsoft Foundry portal and add an OpenAPI tool.
ms.author: cephalin
ms.topic: include
ms.date: 12/03/2025
ms.service: azure-app-service
---

> [!NOTE]
> These steps use the new Foundry portal.

1. In the [Foundry portal](https://ai.azure.com/), in the top right menu, select **New Foundry**.
1. If this is your first time in the new Foundry portal, select the project name and select **Create new project**.
1. Give your project a name and select **Create**.
1. Select **Start building**, then **Create agent**.
1. Give your agent a name and select **Create**. When the agent is ready, you should see the agent playground.

    Note the [models you can use and the available regions](/azure/ai-foundry/agents/concepts/model-region-support?view=foundry&tabs=global-standard&preserve-view=true). 

1. In the agent playground, expand **Tools** and select **Add** > **Custom** > **OpenAPI tool** > **Create**.
1. Give the tool a name and a description. In the **OpenAPI 3.0+ schema** box, paste the schema that you copied earlier.
1. Select **Create tool**.
1. Select **Save**.

> [!TIP]
> In this tutorial, the OpenAPI tool is configured to call your app anonymously without authentication. For production scenarios, you should secure the tool with managed identity authentication. For step-by-step instructions, see [Secure OpenAPI endpoints for Foundry Agent Service](../../configure-authentication-ai-foundry-openapi-tool.md).
