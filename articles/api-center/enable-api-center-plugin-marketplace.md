---
title: Enable Discovery of Plugins from API Center Plugin Marketplace
description: Enable discovery of registered plugins through the API Center plugin marketplace endpoint. Developers can configure it in GitHub Copilot or Claude Code to discover and install plugins from your inventory.

ms.service: azure-api-center
ms.topic: how-to
ms.date: 05/12/2026
 
ms.custom: 
# Customer intent: As an API program manager, I want to create a plugin marketplace from my API center so AI developers can find and install plugins from my inventory.
---

# Enable discovery of API center plugins from a plugin marketplace


This article shows how to enable discovery of plugins through a plugin marketplace endpoint in [Azure API Center](overview.md). The plugin marketplace endpoint uses the API Center data plane API to catalog the AI plugins such as MCP servers and skills available in the API center inventory. 

Developers can add the plugin marketplace to their GitHub Copilot CLI or Claude Code development environment to discover and install plugins from your API center.

## Prerequisites

- An API center in your Azure subscription. If you don't have one, see [Quickstart: Create your API center](set-up-api-center.md).

- One or more [registered plugins](register-discover-plugins.md) in your API center inventory.

- The API center portal enabled and set up for your API center. For details, see [Set up and customize your API Center portal](set-up-api-center-portal.md). The access method you choose for the portal determines how developers will authenticate when they access the plugin marketplace. 

- [GitHub Copilot CLI](https://github.com/github/copilot-cli) or [Claude Code](https://www.anthropic.com/claude) installed in your development environment.

## Enable plugin marketplace endpoint

To enable the plugin marketplace endpoint by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), go to your API center.    
1. In the sidebar menu, under **Consumption**, select **Data API settings**.
1. Under **Plugin marketplace endpoint**, select **Enable plugin marketplace endpoint**.

The marketplace endpoint is of the following form:

```
https://<service name>.data.<region>.azure-apicenter.ms/workspaces/default/plugins/marketplace.git
```

## Clone the plugin marketplace endpoint locally

You can confirm that the plugin marketplace endpoint is enabled for your API center by cloning it locally. 

To clone it, use a command similar to the following in your terminal, replacing the service name and region with the values from your API center:

```bash
git clone https://myapicenter.data.eastus.azure-apicenter.ms/workspaces/default/plugins/marketplace.git
```

The `marketplace` folder of the cloned repository contains folders for marketplace configuration in Claude Code and GitHub Copilot CLI, and folders for each plugin in your API center inventory. For example:

```
marketplace/
    .claude-plugin/
    .github/
    plugins/
        plugin1/
        plugin2/
        ...
```

Each plugin folder contains JSON files with the plugin metadata and configuration.

## Add plugin marketplace to GitHub Copilot CLI 

Developers can add the plugin marketplace from your API center's marketplace endpoint to GitHub Copilot CLI by using the `plugin marketplace add` command. For example, add it in a GitHub Copilot CLI session with a command similar to the following. Replace the service name and region with the values from your API center:

```bash
/plugin marketplace add https://myapicenter.data.eastus.azure-apicenter.ms/workspaces/default/plugins/marketplace.git
```

Follow the prompts to add the plugin marketplace to your GitHub Copilot CLI. 

After adding the marketplace, use the `/plugin marketplace browse` command to see the plugins from your API center inventory. 

```bash
/plugin marketplace browse myapicenter
```

Add a plugin from the marketplace to a GitHub Copilot CLI session with the `/plugin install` command. For example:

```bash
/plugin install plugin-name@myapicenter
```

For more information about installing plugins from the marketplace in GitHub Copilot CLI, see [GitHub Copilot CLI documentation](https://docs.github.com/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing).

## Add plugin marketplace to Claude Code

Developers can add the plugin marketplace from their API center's marketplace endpoint by using the `/plugin marketplace add` command. For example, add it in a Claude Code session with a command similar to the following command. Replace the service name and region with the values from your API center:

```bash
/plugin marketplace add https://myapicenter.data.eastus.azure-apicenter.ms/workspaces/default/plugins/marketplace.git
```

Follow the prompts to add the plugin marketplace.

After you add the marketplace, use the `/plugin` command to see the plugins from your API center inventory. 

Add a plugin from the marketplace to a Claude Code session with the `/plugin install` command. For example:

```bash
/plugin install plugin-name@myapicenter
```

For more information about installing plugins from the marketplace in Claude Code, see [Claude Code documentation](https://code.claude.com/docs/en/discover-plugins).

## Related content

* [Set up and customize your API Center portal](set-up-api-center-portal.md)
* [Discover and consume APIs - VS Code extension](discover-apis-vscode-extension.md)
* [Discover APIs with the Azure API Center MCP server](discover-catalog-mcp-server.md)

