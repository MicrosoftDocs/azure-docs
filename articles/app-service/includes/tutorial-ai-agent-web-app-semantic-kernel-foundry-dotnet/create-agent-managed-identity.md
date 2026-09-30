---
title: Create a Foundry agent with managed identity
description: Steps to create a Foundry agent and configure its OpenAPI tool to use managed identity.
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 08/27/2026
ms.service: azure-app-service
---

1. In the [Foundry portal](https://ai.azure.com), create a project.

1. On the home page, copy the **Project endpoint** for later use.

1. Select **Start building** and follow the prompt.

1. Select **Tools** > **Add** > **Add tools** > **Custom** > **OpenAPI tool** > **Create**. In the **Setup** pane, add an action with the OpenAPI spec tool.

1. Paste the OpenAPI schema that you copied from the authenticated App Service app.

1. For **Authentication method**, select **Managed identity**.

1. For **Audience**, paste the **Foundry OpenAPI managed identity audience** value from the AZD output. It resembles:

    ```text
    api://<generated-client-id>
    ```

1. Save the tool and agent.

#### Allow the parent Foundry resource to call the task API

1. In the Foundry portal, select **Manage** in the top menu.

1. In **Project details**, select the **Parent resource** for your project, and then select **Open in Azure portal**.

1. Copy the system-assigned identity's **Object (principal) ID**. Find that identity in Microsoft Entra ID, and copy its **Application ID**. For detailed steps, see [Find the parent Foundry resource identity](../../configure-authentication-ai-foundry-openapi-tool.md#find-the-parent-foundry-resources-managed-identity-ids).

1. In the Codespace terminal, store the application ID in the AZD environment and update the App Service authentication configuration:

    ```bash
    azd env set AZURE_AI_FOUNDRY_ACCOUNT_CLIENT_ID <application-id>
    azd provision
    ```
