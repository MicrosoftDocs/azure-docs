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

## 1: Create your connector namespace

To create a connector namespace by using the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter `connector namespace`, and select **Connector Namespace**.

1. On the **Connector Namespaces** page toolbar, select **Create**.

1. On the creation pane, provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Subscription** | Your Azure subscription. |
   | **Resource group** | An existing resource group or to create a new one, select **Create new**, and then enter a name. |
   | **Namespace name** | A unique name with 2-64 characters for your connector namespace resource. <br><br>**Tip**: Use only alphanumeric, hyphen, or underscore characters. |
   | **Region** | The Azure region where you want to create the connector namespace. |

   > [!NOTE]
   >
   > The **Identity** section shows that by default, the system assigned managed identity is enabled for your new connector namespace resource. You can also add any existing user assigned managed identities to your resource. Currently, during preview, managed identity authentication for connections isn't available yet but is planned for later release.

1. When you finish, select **Create** to deploy the connector namespace resource to Azure.

   :::image type="content" source="media\create-connector-namespace\connector-namespace-create-pane.png" alt-text="Screenshot shows the Azure portal and the open pane to create a connector namespace." lightbox"media\create-connector-namespace\connector-namespace-create-pane.png":::

   After deployment completes, the **Connector Namespaces** page shows your connector namespace. If not, on the page toolbar, select **Refresh**.

1. Continue to the next section to sign in to your connector namespace.

## 2: Sign in to the Connector namespaces portal

1. If you navigated away from the **Connector Namespaces** page in the [Azure portal](https://portal.azure.com), in the portal search box, enter `connector namespace`, and select **Connector Namespace**.

1. From the **Connector Namespaces** page, select your namespace resource.

   The Azure portal redirects you to the Connector Namespaces portal.

1. Under **Welcome**, select **Sign in with Microsoft**, for example:

   :::image type="content" source="media\create-connector-namespace\connector-namespace-portal-sign-in.png" alt-text="Screenshot shows the Connector Namespaces portal and sign in section." lightbox="media\create-connector-namespace\connector-namespace-portal-sign-in.png":::

1. On the sign-in page, select the Microsoft account associated with your connector namespace.

   The Connector Namespaces portal opens and shows your connector namespaces.

1. From the connector namespaces list, select your namespace.

   The portal shows the main information page for your namespace.

1. Continue to the next section so you can manage your connector namespace along with any connections, triggers, actions, or MCP servers.

## 3: Manage your connector namespace

connections, triggers, and MCP servers in your namespace

1. Use the namespace portal to create and manage:

   - **Connections** to link external services such as GitHub, Outlook, or SQL Server.
   - **Triggers** that automate workflows with event-driven actions.
   - **MCP servers** that expose connector tools for AI agents.

   :::image type="content" source="media\create-connector-namespace\connector-namespace-overview-page.png" alt-text="Azure portal homepage icons for Azure services with resources section showing no recent resources.":::

## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
