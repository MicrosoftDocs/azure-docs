---
title: Install a plugin from a URL in Azure SRE Agent
description: Install a standalone plugin directly from a GitHub repo URL without registering a marketplace.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Install a plugin from a URL in Azure SRE Agent

In this article, you install a standalone plugin directly from a GitHub repository, with its skills available in your agent. No marketplace registration is required.

## Prerequisites

- An Azure SRE Agent in **Running** state
- **SRE Agent Author** or **Administrator** role on the agent (see [User roles](user-roles.md))
- The **Plugins** page visible under **Builder** in the sidebar
- A GitHub repository containing a plugin (with `plugin.json` and a `skills/` folder)

## Open the Install from URL dialog

In the SRE Agent portal, navigate to **Builder > Plugins** and select **Install from URL** in the toolbar.

## Enter the repository URL

1. In the **GitHub repository URL** field, enter the repo in `owner/repo` format or as a full URL (for example, `dm-chelupati/sre-agent-test-plugin`).
1. If the plugin is in a subfolder, specify the path in the **Path in repo** field.
1. The auth section shows your GitHub connection status. For private repos, expand **Advanced** to enter a personal access token.

## Install

Select **Install**. The agent clones the repository, reads the plugin definition, and imports the skills.

> [!TIP]
> The dialog shows "Plugin installed from URL successfully with N skills" when installation completes.

## Verify in Skill builder

Close the dialog and navigate to **Builder > Skill builder**. The imported skill appears in the list, ready for use.

The plugin also appears in the Plugins grid with a **Standalone** badge, indicating it was installed directly rather than from a marketplace.

## Use the REST API

You can install a plugin directly from a URL via the REST API:

```bash
curl -X POST "https://<agent-endpoint>/api/v2/plugins/install-direct" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceUrl": "myorg/my-plugin",
    "pathInRepo": ""
  }'
```

For private repos, add credentials:

```bash
curl -X POST "https://<agent-endpoint>/api/v2/plugins/install-direct" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceUrl": "myorg/my-private-plugin",
    "credentials": {
      "authMethod": "pat",
      "pat": "ghp_your_token_here"
    }
  }'
```

## Related content

- [Install a plugin from a public marketplace](install-plugin-from-marketplace.md)
- [Add a private marketplace](add-private-marketplace.md)
- [Plugin marketplace](plugin-marketplace.md)
