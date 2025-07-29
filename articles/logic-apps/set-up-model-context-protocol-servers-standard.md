---
title: Call Standard Workflows as MCP Servers from AI Agents
description: Learn how to set up Standard logic apps as Model Context Protocol (MCP) servers that you can call from AI agents.
services: logic-apps
ms.suite: integration
ms.author: kewear
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 08/06/2025
ms.update-cycle: 180-days
#CustomerIntent: I want to call Standard logic app workflows in Azure Logic Apps as Model Context Protocol (MCP) servers as tools from AI agents.
---

# Set up Standard logic apps as MCP servers for AI agent use in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> The following capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

AI agents interpret requests and fulfill them by using prebuilt *tools*, which are operations that agents call to perform tasks, such as send an email, query a database, or trigger a workflow. In Azure Logic Apps, you can jumpstart building these tools by reconfiguring Standard logic apps as custom Model Context Protocol (MCP) servers.

MCP is an open standard that lets AI agents work with external systems and tools in a secure, discoverable, and structured way. This standard defines how to describe, run, and authenticate access to tools so that agents can interact with real-world systems such as databases, APIs, and business workflows. An MCP server works like a bridge between an AI agent and the tools that the agent can use.

:::image type="content" source="media/set-up-model-context-protocol-servers-standard/agent-tools.png" alt-text="Conceptual diagram that shows an agent and interactions with related components." lightbox="media/set-up-model-context-protocol-servers-standard/agent-tools.png":::

For more information, see the following articles:

- [What is an AI Agent?](/articles/ai-foundry/agents/overview#what-is-an-ai-agent)
- [Introduction - Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro)

The following table describes the benefits that you get when you set up Standard logic app workflows as custom MCP servers:

| Benefit | Description |
|---------|-------------|
| Resusability | You can call existing workflows, connectors, and codeful functions from an AI agent, which gives you the opportunity for extra return on your investments. |
| Flexibility | Azure Logic Apps provides 1,400+ connectors that provide access and ways to work with enterprise assets and resources whether they in the cloud or on premises. |
| Access points | Azure Logic Apps supports various connectivity models for running your MCP server. For you can run your server in the cloud, exposed as a private endpoint, or connected to virtual networks and on-premises resources. |
| Security | When you expose your logic app as an MCP server, make sure that you set up a strong security posture and meet your enterprise security requirements. You can use Microsoft Entra ID with EasyAuth for authentication and authorization and to secure your MCP server and Standard workflows. |
| Monitoring, governance, and compliance | Azure Logic Apps provides workflow run history and integration with Application Insights or Log Analytics for your needs around monitoring, diagnostics and troubleshooting, reporting, traceability, and auditing. |

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [app registration](/entra/identity-platform/app-objects-and-service-principals?tabs=browser#application-registration) to use in the EasyAuth setup for your logic app.

  This app registration is an identity that your logic app uses to delegate identity and access management functions to MIcrosoft Entra ID.

  To create an app registration, follow these steps:

  1. In the [Azure portal](https://portal.azure.com) search box, enter **app registrations**.

  1. On the **App registrations** page toolbar, select **New registration**.

  1. On the **Register an application** page, provide the following information:

     | Property | Required | Description |
     |----------|----------|-------------|
     | **Name** | Yes | The name for your app registration. |
     | **Supported account types** | Yes | The accounts that can use or access your logic app. |
     | **Redirect URI** | No | Skip this section. |
     
   1. When you're done, select **Register**.

   1. On the app registration page, copy and save the **Directory (tenant) ID** for later use.

   1. On the app registration sidebar, under **Manage**, select **Expose an API**.

   1. Next to **Application ID URI**, select **Add**. Keep the default value, and select **Save**.

   1. Under **Scopes defined by this API**, select **Add a scope** to provide granular permissions to your app's users.

      1. On the **Add a scope pane**, provide the following information:

         | Property | Required | Description |
         |----------|----------|-------------|
         | **Scope name** | Yes | A relevant name for the permissions scope that uses the following format:<br><br> `<*resource*>.<*operation*>.<*constraint*> <br><br>For more information, see [Scopes and permissions in the Microsoft identity platform](/entra/identity-platform/scopes-oidc). |
         | **Who can consent** | Yes | Select **Admins and users**. |

         For more information, see [Add a scope](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).

      1. When you're done, select **Add scope**.

   For more information, see [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).

- The Standard logic app resource and workflows that you want to set up as an MCP server.

## Set up your 

## Related content
