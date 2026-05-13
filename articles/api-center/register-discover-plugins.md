---
title: Register Plugins in Your API Center
description: Learn how to register plugins in Azure API Center to create a centralized plugins registry for your organization. 
ms.service: azure-api-center
ms.topic: how-to
ms.date: 05/08/2026
ai-usage: ai-assisted


ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
# Customer intent: As an API program manager, I want to register plugins in my API Center inventory so developers can discover and use them.
ms.custom:
---

# Register and discover plugins in your API inventory

This article describes how to use Azure API Center to register plugins as part of your API inventory. Plugins are reusable capabilities that AI agents can discover and consume to extend their functionality.

In API Center, you register a plugin by bundling together one or more skills and/or MCP servers that are already registered in your API inventory. By registering a plugin, you create a higher-level abstraction that simplifies the discovery and use of related skills and MCP servers by developers and AI systems.

## Prerequisites

- An API center. If you don't have an API center yet, see the quickstart to [Create an API center](set-up-api-center.md).
- One or more [registered skills](register-discover-skills.md) or [registered MCP servers](register-discover-mcp-server.md) that you want to bundle into a plugin. 

## Register a plugin in your API center

To register a plugin in your API center:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API center.
1. In the sidebar menu, under **Inventory**, select **Assets**.
1. Select **+ Register an asset** > **Plugin**.

    :::image type="content" source="media/register-discover-plugins/register-plugin.png" alt-text="Screenshot of registering a plugin in the portal.":::
1. In the **Register a plugin** form, enter the information described in the following table:

    | Field | Description |
    |-------|-------------|
    | **Title** |Enter a descriptive name for the plugin. |
    | **Identifier** | API Center automatically generates an identifier based on the title. You can edit this identifier if needed. |
    | **Summary** | Optionally enter a brief summary of what the plugin does. |
    | **Description** | Optionally enter a more detailed description of the plugin's capabilities, use cases, and behavior. |
    | **Version** | Optionally enter the version of the plugin. |
    | **Skills** | To add skills to the plugin, select **+ Add skill** and choose from the list of registered skills in your API inventory. |
    | **MCP servers** | To add MCP servers to the plugin, select **+ Add MCP server** and choose from the list of registered MCP servers in your API inventory. |

1. Select **Create** to register the plugin in your API center.

After registration, the plugin appears in your inventory on the **Inventory** > **Assets** page.

## Discover plugins in the API Center portal

Set up your [API Center portal](set-up-api-center-portal.md) so that developers and other stakeholders in your organization can discover plugins in your API inventory. From the API Center portal, users can:

* Browse and filter plugins in the inventory.
* View detailed information about each plugin.

[!INCLUDE [assess-ai-assets](includes/assess-ai-assets.md)]

## Configure plugin discovery and use through the marketplace endpoint

The API Center [plugin marketplace endpoint](enable-api-center-plugin-marketplace.md) exposes the catalog of registered plugins by using the API Center data API, allowing discovery and use by developers. Developers can add the marketplace to their GitHub Copilot CLI or Claude Code development environment to browse and install plugins from your API center.

## Related content

* [Synchronize API assets from a Git repo](synchronize-assets-git.md)
* [Register and discover MCP servers in your API inventory](register-discover-mcp-server.md)
* [Set up your API Center portal](set-up-api-center-portal.md)
* [Key concepts in Azure API Center](key-concepts.md)