---
title: Create and manage connector namespaces for integration
titleSuffix: Azure Connector Namespace
description: Learn to create connector namespaces in Azure so you can organize and manage reusable connections, triggers, actions, and MCP servers so your solutions can access and use other services, systems, apps, and data.
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
# Customer intent: As a backend developer who works with Azure, I want to create connector namespaces so I can organize and manage reusable connections, triggers, actions, and MCP servers that my solutions can access and use other services, systems, apps, and data.
---

# Create and manage connector namespaces for integrating your solutions in Azure (preview)

> [!IMPORTANT]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is available in select Azure regions only.

When you build solutions that need to connect with other services, systems, apps, and data, you usually have to set up and manage the authentication, credential management, end system polling, webhook delivery, and Model Context Protocol (MCP) server hosting yourself. Azure Connector Namespace is a fully managed service that removes overhead and complexity by handling these security and management tasks for you.

When you create a connector namespace resource, you get a managed environment and a connector catalog so you can create and organize resuable connections, event triggers, actions, AI agent tools, and MCP server tools that your solutions can use when integrating with other components. This connector namespace makes it easy for your solutions to work with other components without needing custom API client code or tool wrappers.

This guide shows how to create and manage a connector namespace resource in the Azure portal, and then create the components that your solutions need for easier integration.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/free/).

- Permissions to create resources and resource groups in your Azure subscription.

- Access to the [Azure portal](https://portal.azure.com).

## Create a connector namespace resource

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the homepage, select **Create a resource**.

1. In the search box, enter **Connector Namespace**.

1. From the search results, select **Connector Namespace**.

1. Select **Create** to start creating the namespace.

1. On the creation page, provide these details:

   | Setting            | Description                                                                                 |
   |--------------------|---------------------------------------------------------------------------------------------|
   | **Subscription**   | Select your Azure subscription.                                                            |
   | **Resource group** | Select an existing resource group or select **Create new**, then enter a name for it.       |
   | **Namespace name** | Enter a unique name for the connector namespace.                                           |
   | **Region**         | Choose the Azure region where you want to create the namespace.                            |

1. Select **Create** to deploy the connector namespace resource.

   :::image type="content" source="media\create-connector-namespace\connector-namespace-create-blade.png" alt-text="Create Connector Namespace blade in Azure portal .":::

## Connect to your namespace in the portal

1. After creating the connector namespace resource, go to **Connector Namespace list** in the Azure portal.

1. Select **Connect to Namespace** to open the connector namespace portal in a new browser tab.

   :::image type="content" source="media\create-connector-namespace\connector-namespace-portal-sign-in.png" alt-text="Connector Namespace portal sign in page.":::

1. When redirected, sign in by using your Microsoft account associated with the connector namespace.

1. On the sign-in page, select your account to continue.

## Manage connections, triggers, and MCP servers in your namespace

1. After signing in, open your connector namespace from the list displayed.

1. Use the namespace portal to create and manage:

   - **Connections** to link external services such as GitHub, Outlook, or SQL Server.
   - **Triggers** that automate workflows with event-driven actions.
   - **MCP servers** that expose connector tools for AI agents.

   :::image type="content" source="media\create-connector-namespace\connector-namespace-overview-page.png" alt-text="Azure portal homepage icons for Azure services with resources section showing no recent resources.":::


## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
