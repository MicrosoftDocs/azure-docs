---
title: Create a Foundry agent with OpenAPI tool
description: Steps to create a Foundry agent in the portal and configure it with an OpenAPI tool to call your web app.
ms.author: cephalin
ms.topic: include
ms.date: 12/08/2025
ms.service: azure-app-service
---

1. In the [Foundry portal](https://ai.azure.com), make sure the top **New Foundry** radio button is set to active and create a project. 

1. In the home page, copy the **Project endpoint** for later.

1. Select **Start building** > **Create agent** and follow the prompt.

1. In the new agent's playground, create an OpenAPI tool to call your web app by selecting **Tools** > **Add** > **Custom** > **OpenAPI tool** > **Create**. In the **Setup** pane, add an action with the OpenAPI spec tool. Use the OpenAPI schema that you get from the deployed web app and **anonymous** authentication. For detailed steps, see [How to use the OpenAPI spec tool](/azure/ai-foundry/agents/how-to/tools/openapi?view=foundry&preserve-view=true).

    Your application code is already configured to include the server's `url` and `operationId`, which are needed by the agent. For more information, see [Connect to OpenAPI Specification](/azure/ai-foundry/agents/how-to/tools/openapi?view=foundry&preserve-view=true#prerequisites).

1. Be sure to select **Save**.

1. Select **Try in playground** and test your Foundry agent with prompts like "*Show me all the tasks*" and "*Please add a task.*"

    If you get a valid response, the agent is making tool calls to the OpenAPI endpoint on your deployed web app.
