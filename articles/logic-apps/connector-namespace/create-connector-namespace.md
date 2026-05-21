---
title: Create and manage connector namespaces in Azure
description: Connector namespaces in Azure let you organize connections, triggers, and MCP servers. Learn how to create and manage one in the Azure portal today.
author: wsilveiranz
ms.author: wsilveira
ms.reviewer: ecfan
ms.date: 05/18/2026
ms.topic: how-to
ms.service: azure-logic-apps
# Customer intent: As a developer, I want to set up a connector namespace so that I can manage connections, triggers, and MCP servers for my integrations.
ms.custom: ai-assisted
---

# Create and manage connector namespaces in Azure (preview)

> [!IMPORTANT]
>
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Connector Namespace is a fully managed service that hosts a catalog of connectors - reusable, typed integrations to SaaS, data, and line-of-business systems. Each connector exposes actions, event triggers, and AI-agent tools through a shared connection model. The namespace handles:

-  Authentication 
-  Credential management 
-  End systems polling 
-  Webhook delivery
-  Model Context Protocol (MCP) server hosting

With that, your applications and AI agents can integrate with external services without writing custom API client code or tool wrappers.

This article shows you how to create a connector namespace resource in Azure, use the Azure portal to manage your namespaces, and create the essential components needed for your integrations.

## Prerequisites

* An Azure account and subscription. If you don't have one, [create a free Azure account](https://azure.microsoft.com/free/).

* Permissions to create resources and resource groups in your Azure subscription.

* Access to the [Azure portal](https://portal.azure.com).

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

   :::image type="content" source="media\create-connector-namespace\connector-namespace-overview-page.png" alt-text="Azure portal homepage icons for Azure services with resources section showing no recently viewed resources.":::


## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)