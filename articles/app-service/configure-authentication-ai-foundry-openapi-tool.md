---
title: Secure OpenAPI tool calls from Foundry Agent Service
description: Configure Microsoft Entra authentication to secure Microsoft Foundry tool calls with managed identity, step by step.
ms.topic: how-to
ms.date: 12/04/2025
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Secure OpenAPI endpoints for Foundry Agent Service

This article shows you how to secure your App Service OpenAPI endpoints when they're called by Foundry Agent Service. When you add your App Service app as an OpenAPI tool in Microsoft Foundry, you can configure it to call your APIs anonymously without authentication, which is easier for development and testing. However, for production environments, you should use Microsoft Entra authentication with managed identity. This guide walks you through configuring managed identity authentication to enable secure, token-based communication between Microsoft Foundry and your app.

## Prerequisites

- An App Service app with OpenAPI endpoints. If you need to add OpenAPI functionality to your app, see one of the following tutorials:
  - [Add an App Service app as a tool in Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md)
  - [Add an App Service app as a tool in Foundry Agent Service (Java)](tutorial-ai-integrate-azure-ai-agent-java.md)
  - [Add an App Service app as a tool in Foundry Agent Service (Python)](tutorial-ai-integrate-azure-ai-agent-python.md)
  - [Add an App Service app as a tool in Foundry Agent Service (Node.js)](tutorial-ai-integrate-azure-ai-agent-node.md)

- A Microsoft Foundry project where you'll add your app as an OpenAPI tool.

## Find your Microsoft Foundry project's managed identity IDs

You need both the object ID and the application ID of your Microsoft Foundry project's managed identity to configure App Service authentication. A system-assigned managed identity is automatically created for your Microsoft Foundry project when you create it. This identity is what Foundry Agent Service uses to authenticate with your app.

# [New Foundry portal](#tab/new-foundry)

1. In the [Foundry portal](https://ai.azure.com) make sure you select **New Foundry** in the top right corner. Note the new Foundry portal doesn't show agents created in the classic portal. 

1. From the top right menu, select **Operate** > **Admin**. Then select your project's parent resource in the **Parent resource** column.

1. In the parent resource's details page, select **Manage this resource in the Azure Portal**.

    > [!NOTE]
    > Before you move on, make sure you're on a Foundry resource page, *not* a Foundry project resource page.

1. In the Foundry resource's left menu, select **Resource Management** > **Identity**.

1. Under **System assigned**, copy the value of **Object (principal) ID** for later.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. In the search box, search for the object ID you copied and select it in the search results.

1. On the **Overview** page, copy the value of **Application ID**. 

    Note the **Object ID** is the same as the one shown in the system-assigned managed identity. You need both the application ID and the object ID for configuring App Service authentication.

# [Classic Foundry portal](#tab/classic)

1. In the [Foundry portal](https://ai.azure.com), navigate to your project and select **Overview**.

1. In the **Project details** section on the right, select the link next to **Resource group** to open the resource group in the Azure portal.

1. In the resource group, find and select the Foundry resource (*not* the Foundry project resource).

1. In the Foundry resource's left menu, select **Resource Management** > **Identity**.

1. Under **System assigned**, copy the value of **Object (principal) ID** for later.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. In the search box, search for the object ID you copied and select it in the search results.

1. On the **Overview** page, copy the value of **Application ID**. 

    Note the **Object ID** is the same as the one shown in the system-assigned managed identity. You need both the application ID and the object ID for configuring App Service authentication.

---

## Configure Microsoft Entra authentication for your app

1. In the Azure portal, navigate to your App Service app.

1. On your app's left menu, select **Settings** > **Authentication**, and then select **Add identity provider**.

1. On the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to create a new app registration.

1. Under **Additional checks**, for **Client application requirement**, select **Allow requests from specific client applications**.

1. Select the pencil widget and add the **application ID** that you copied in [Find your Microsoft Foundry project's managed identity IDs](#find-your-microsoft-foundry-projects-managed-identity-ids).

1. For **Identity requirement**, select **Allow requests from specific identities**.

1. Select the pencil widget and add the **object ID** that you copied in [Find your Microsoft Foundry project's managed identity IDs](#find-your-microsoft-foundry-projects-managed-identity-ids).

1. For **Tenant requirement** accept the default value. If not, be sure to select the tenant where your Microsoft Foundry project (or rather its identity) is created.

1. For **Unauthenticated requests**, select **HTTP 401 Unauthorized: recommended for APIs**.

1. Select **Add** to create the identity provider.

   :::image type="content" source="media/configure-authentication-ai-foundry-openapi-tool/entra-auth-configuration.png" alt-text="Screenshot showing the configuration of a new Microsoft authentication provider in the App Service.":::

## Update the app registration Application ID URI

After enabling authentication, you need to update the app registration's Application ID URI to match your App Service app's URL.

1. After the Microsoft provider configuration completes, select it in the **Identity provider** column to open the app registration page.

1. In the left menu, select **Manage** > **Expose an API**.

1. Next to **Application ID URI**, select **Edit**.

1. Change the value to your App Service app's URL in the following format: `https://<suffix>.azurewebsites.net`.

    You can find the app's hostname on the **Overview** page in **Default domain**.

1. Select **Save**.

> [!WARNING]
> If you delete your App Service app, you must also delete the app registration and clean up any authentication resources that reference the Application ID URI. Failing to do so creates a security vulnerability: if someone else creates an app with the same URL, they could potentially gain unauthorized access to resources that trust the orphaned app registration. Always remove app registrations and their associated permissions when decommissioning an app.

## Configure the OpenAPI tool in Microsoft Foundry

> [!NOTE]
> This section assumes you already completed one of the tutorials in the [Prerequisites](#prerequisites) section, where you added your app as an OpenAPI tool in Microsoft Foundry using anonymous authentication. You now update the tool to use managed identity authentication.

# [New Foundry portal](#tab/new-foundry)

1. Back in the [Foundry portal](https://ai.azure.com), select your agent.

1. Find the OpenAPI tool and select **...** > **Edit**.

1. The **OpenAPI 3.0+ schema** box should have the schema from your App Service app. If not, paste in your OpenAPI schema. For more information, see [How to use OpenAPI with Foundry Agent Service](/azure/ai-services/agents/how-to/tools/openapi-spec).

1. For **Authentication method**, select **Managed identity**.

1. For **Audience**, enter your App Service app's URL. This URL must match the **Application ID URI** that you configured earlier.

1. Select **Update tool**.

# [Classic Foundry portal](#tab/classic)

1. Back in the [Foundry portal](https://ai.azure.com), select your agent.

1. Find the OpenAPI tool and select it to edit.

1. In the **Define the schema for this tool** page, paste your OpenAPI schema. For more information, see [How to use OpenAPI with Foundry Agent Service](/azure/ai-services/agents/how-to/tools/openapi-spec).

1. For **Authentication method**, select **Managed Identity**.

1. For **Audience**, enter your App Service app's URL. This URL must match the **Application ID URI** that you configured earlier.

1. Save the tool.

---

> [!TIP]
> Foundry Agent Service uses the system-assigned managed identity to authenticate with your app. Because you added the identity's client ID as an allowed client application and an allowed identity in your app's authentication provider configuration, the agent service is authorized to call your app's APIs.

## Test the agent

1. In the Foundry portal, select your agent and select **Try in playground**.

1. Chat with the agent to test your OpenAPI endpoints. For example:

   - Show me all the tasks.
   - Create a task called "Buy groceries."
   - Update that task to "Buy groceries and cook dinner."

If the authentication is configured correctly, the agent successfully calls your app's APIs through the OpenAPI tool.

## Related content

- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](configure-authentication-provider-aad.md)
- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-services/agents/overview)
