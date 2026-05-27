---
title: Create and manage connector namespaces for integration
titleSuffix: Azure Connector Namespace
description: Create connector namespaces so your solutions can easily work with other services, systems, apps, and data. Create, organize, and manage reusable connections, triggers, actions, and MCP servers that your solutions need for integration.
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: ecfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
# Customer intent: As a backend developer who works with Azure, I want to create connector namespaces so I can organize and manage reusable connections, triggers, actions, and MCP servers that my solutions need to access and integrate with other services, systems, apps, and data.
---

# Create and manage connector namespaces for integrating your solutions in Azure (preview)

> [!IMPORTANT]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is available in select Azure regions only.

When you build solutions that need to connect with other services, systems, apps, and data, you usually have to set up and manage the authentication, credential management, end system polling, webhook delivery, and Model Context Protocol (MCP) server hosting yourself. Azure Connector Namespace is a fully managed service that removes overhead and complexity by handling these security and management tasks for you.

When you create a connector namespace resource, you get a managed environment and a connector catalog so you can create and organize resuable connections, event triggers, actions, AI agent tools, and MCP server tools that your solutions can use to integrate with other components. Connector namespaces make integration easy so your solutions can work with other components without needing custom API client code or tool wrappers.

This guide shows how to create and manage a connector namespace resource in the Azure portal, and then create the components that your solutions can use for integration.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Permissions to create resources and resource groups in your Azure subscription.

## Create a connector namespace resource

1. In the [Azure portal](https://portal.azure.com) search box, enter `connector namespace`, and select **Connector Namespace**.

1. On the **Connector Namespaces** page toolbar, select **Create**.

1. On the creation pane, provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Subscription** | Your Azure subscription. |
   | **Resource group** | An existing resource group or to create a new one, select **Create new**, and then enter a name. |
   | **Namespace name** | A unique name with 2-64 characters for your connector namespace resource. <br><br>**Tip**: Use only alphanumeric, hyphen, or underscore characters. |
   | **Region** | The Azure region where you want to create the connector namespace. |

1. When you finish, select **Create** to deploy the connector namespace resource to Azure.

   :::image type="content" source="media\create-connector-namespace\connector-namespace-create-pane.png" alt-text="Screenshot shows the Azure portal and the open pane to create a connector namespace." lightbox"media\create-connector-namespace\connector-namespace-create-pane.png":::

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
