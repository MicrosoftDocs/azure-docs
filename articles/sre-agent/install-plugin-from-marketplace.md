---
title: "Tutorial: Install a Marketplace Plugin in Azure SRE Agent"
description: Learn how to browse, install, and configure plugins from the marketplace in Azure SRE Agent to extend your agent with community-built skills.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
ms.custom: plugins, marketplace, skills, install, MCP, connectors, tutorial
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to install plugins from the marketplace so that I can quickly extend my agent with community-built skills and MCP integrations.
---

# Tutorial: Install a marketplace plugin in Azure SRE Agent
The Plugin Marketplace lets you discover and install community-built skills and MCP integrations from curated GitHub-hosted catalogs. In this tutorial, you add a marketplace source, browse available plugins, import skills, and optionally configure MCP connectors—all from the portal.

**Estimated time**: 5 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Add a marketplace source to your agent
> - Browse, search, and filter available plugins
> - Preview skill content and import skills
> - Configure MCP plugins as connectors with prefilled settings
> - Check installed plugins for updates

## Prerequisites

- An Azure SRE Agent in **Running** state with Agent Space configured
- **Contributor** role or higher on the SRE Agent resource
- Internet access to GitHub (the marketplace resolves plugins from public GitHub repositories)
- The **Plugins** page must be visible in your sidebar under **Builder**. If you don't see it, you might need to enable workspace tooling features for your agent space.

## Open the Plugin Marketplace

Go to the Plugin Marketplace to access the plugin browser.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent space.
1. In the sidebar, expand **Builder**.
1. Select **Plugins**.

The portal opens the **Plugins** page with the heading "Plugins" and the description "Import skills from plugin marketplaces." You see two tabs: **Browse** (selected) and **Installed**.

## Add a marketplace

Register a marketplace source so that your agent can discover available plugins.

1. Select **Add marketplace** (the **+** button next to "Marketplaces").
1. In the dialog, select the **Well-known marketplaces** dropdown.
1. Select **Azure SRE Agent Plugins**.
1. Select **Resolve**. The system fetches the marketplace manifest from GitHub and shows a preview with the marketplace name, description, and plugin count.
1. Select **Add**.

A marketplace card appears in the Marketplaces section, and the plugin browser loads the available plugins.

> [!TIP]
> You can also enter any GitHub `owner/repo` path or URL in the **Marketplace URL or owner/repo** field. This approach works with any repository that has a valid `marketplace.json` in the supported locations (`.github/plugin/` or `.claude-plugin/`). For more information, see [Plugin Marketplace](plugin-marketplace.md).

## Browse available plugins

Use the plugin browser to explore, search, and filter the catalog.

1. Explore the plugin cards. Each card shows the plugin name, description, version, author, and badges:
   - **Skills** (green): The plugin has importable skills.
   - **Requires MCP** (blue): The plugin needs MCP connectors to be configured.
   - **Unsupported MCP** (orange): The plugin uses an MCP server type that's not supported yet.
1. Use the **Search plugins...** field to filter by name or description.
1. Toggle the filter checkboxes to show or hide plugins without skills or with unsupported MCP types.

## Preview and import skills

Preview skill content before importing, and then import the skills you want by using a single action.

1. Select a plugin card to open the detail dialog.
1. Review the plugin information: name, version, author, description, and a **View source** link pointing to the plugin's GitHub folder.
1. Select the **eye icon** next to any skill to preview its content before importing.
1. Select the skills you want by using individual checkboxes, or select **Select all**.
1. Select **Import selected**.

A confirmation message appears: "Successfully imported N skills." You can now use the imported skills in your agent.

> [!NOTE]
> If an imported skill name matches an existing skill that you didn't import from a plugin, the system automatically prefixes the new skill with the plugin name to avoid conflicts.

## Configure MCP connectors

If your plugin includes MCP server configurations, set up the corresponding connectors to enable those tools.

> [!NOTE]
> This section applies only when the plugin detail dialog shows MCP server configurations in an orange section. If your plugin doesn't include MCP configurations, skip to [Verify](#verify).

1. For each MCP server listed, select **Add as connector**.
1. The connector wizard opens prefilled with the server's configuration:
   - Connection type (Local for command-based servers, Remote for URL-based)
   - Command, arguments, and environment variables (or URL and headers)
1. Review the prefilled settings and adjust if needed.
1. Complete the connector wizard.

Your MCP connector appears in the **Connectors** list with the server name from the plugin.

## Verify

After you complete the installation, confirm the following conditions:

1. Switch to the **Installed** tab on the **Plugins** page.
1. Find your installed plugin card and verify it shows:
   - Plugin name and version
   - Source marketplace badge
   - Link to the source repository
   - Badges for each imported skill
1. Select **Check for updates** (sync icon) to verify the plugin is current. The plugin shows **Up to date** with a checkmark.

## Next step

> [!div class="nextstepaction"]
> [Learn about the Plugin Marketplace](plugin-marketplace.md)

## Related content

- [Plugin Marketplace](plugin-marketplace.md): Understand marketplace formats and MCP configuration options.
- [Set up an MCP connector](mcp-connector.md): Connect your agent to MCP tool servers.
- [Skills](skills.md): Learn how your agent uses imported skills during conversations.
- [Connectors](connectors.md): Explore how your agent connects to external data sources and tools.
