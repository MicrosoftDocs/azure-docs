---
title: Install a Plugin From a Public Marketplace
description: Learn how to add a public plugin marketplace to your Azure SRE Agent, browse available plugins, and install one with its skills.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Install a plugin from a public marketplace

In this article, you register a public marketplace, browse available plugins, and install one with its skills available for use. For more information, see [Plugin marketplace](plugin-marketplace.md).

## Prerequisites

- An Azure SRE Agent in **Running** state
- **SRE Agent Author** or **Administrator** role on the agent (see [User roles](user-roles.md))
- The **Plugins** page visible under **Builder** in the sidebar

## Open the Plugins page

In the SRE Agent portal, expand **Builder** in the sidebar and select **Plugins**.

## Add a marketplace

1. Select **Add marketplace** in the toolbar.
1. In the **Marketplace URL or owner/repo** field, enter `Azure/sre-agent-plugins`.
1. Confirm the auth section shows your GitHub connection status.
1. Select **Add**.

The marketplace clones in the background. After a few moments, plugin cards appear in the grid.

## Preview a plugin before installation

Select a plugin card to open its detail page. You can see:

- The plugin name, author, and a link to the source repository
- Available skills (select a skill name to preview its content)
- MCP server requirements, if any

Plugins that include MCP servers require connector setup before installation. The detail page guides you through configuring each connector.

## Install the plugin

Select **Install**. The plugin's skills are imported into your agent and pinned to the current git commit.

> [!TIP]
> After installation, the plugin card shows an **Installed** badge. The imported skills appear in **Builder > Skill builder**.

## Verify the installed plugin in Skill builder

Go to **Builder > Skill builder** to confirm the imported skill is listed and available.

## Use the REST API to install plugins

You can also add a marketplace and list plugins via the REST API:

```bash
# Add a marketplace
curl -X POST "https://<agent-endpoint>/api/v2/plugins/marketplaces" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": { "name": "sre-agent-plugins" },
    "spec": {
      "sourceType": "github",
      "sourceUrl": "Azure/sre-agent-plugins",
      "owner": { "name": "Azure" }
    }
  }'

# List installations
curl "https://<agent-endpoint>/api/v2/plugins/installations" \
  -H "Authorization: Bearer $TOKEN"
```

## Related content

- [Install a plugin from a URL](install-plugin-from-url.md)
- [Add a private marketplace](add-private-marketplace.md)
- [Plugin marketplace](plugin-marketplace.md)
