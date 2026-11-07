---
title: Add a private marketplace to Azure SRE Agent
description: Learn how to register a private GitHub repository as a plugin marketplace in Azure SRE Agent and install plugins to make skills available in your agent.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 10/28/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Add a private marketplace to Azure SRE Agent

In this article, you register a private GitHub repository as a marketplace source, install a plugin from it, and make its skills available in your agent.

## Prerequisites

- An Azure SRE Agent in **Running** state
- **SRE Agent Author** or **Administrator** role on the agent (see [User roles](user-roles.md))
- Access to **Build + setup** > **Extensions** > **Plugins**
- A private GitHub repository containing a `marketplace.json` manifest with at least one plugin
- GitHub credentials with read access to the repository (OAuth, PAT, or GitHub App for GHE)

## Open the add marketplace dialog

In the SRE Agent portal, go to **Build + setup** > **Extensions** > **Plugins** and select **Connect marketplace** in the toolbar.

## Enter the private repository URL

In the **Marketplace URL or owner/repo** field, enter your private repo (for example, `myorg/internal-skills` or `https://github.com/myorg/internal-skills`).

The auth section appears below, showing whether your agent's GitHub identity can access the repo.

## Authenticate

1. **If your agent's GitHub OAuth identity has access to the repo** (same org or authorized OAuth App), you're ready. Skip to the next section.

1. **If the repo is in an org your agent can't reach**, expand the **Advanced** section and enter a personal access token with read access to the repository.

    > [!NOTE]
    > PATs are only supported for github.com. For GitHub Enterprise (`*.ghe.com`) hosts, use a GitHub App instead (see below).

1. Create your PAT at [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens) with **Contents: Read** scope on the target repository.

    **For GitHub Enterprise** (`*.ghe.com`), the dialog shows a GitHub App registration form instead:

    - **Client ID**: the App's client ID
    - **Private key URI (Key Vault)**: the RSA Key Vault key URI (`/keys/`), not a secret URI
    - **Key Vault identity**: the managed identity with **Key Vault Crypto User** access to that key

    For key import and role assignment instructions, see [Set up GitHub BYO App](setup-github-byo-app.md#step-3-store-private-key-in-key-vault).

1. Select **Configure GitHub App** to register the connection.

## Add the marketplace

Select **Add**. The marketplace clones in the background. After a few moments, plugins from your private repo appear in the grid alongside any public marketplace plugins.

## Install a plugin

Select a plugin card to open its detail page. Review the skills it contains, and then select **Install**.

> [!TIP]
> After installation, the plugin shows "installed successfully with N skills." The skill is available in **Build + setup > Extensions > Skill builder**.

> [!WARNING]
> The credential you configured for authentication is shared across all plugin installs from this marketplace. Any user with the Author or Administrator role on the agent can install, even without personal GitHub access to the repo. For more information, see [Plugin marketplace](plugin-marketplace.md).

> [!TIP]
> If the clone fails, verify your credentials have read access to the repository. For PATs, check the **Contents: Read** scope. For OAuth, ensure the OAuth App is authorized on the repo's organization.

## Use the REST API

You can add a private marketplace and manage installations through the REST API:

```bash
# Add a private marketplace with PAT
curl -X POST "https://<agent-endpoint>/api/v2/plugins/marketplaces" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": { "name": "my-private-marketplace" },
    "spec": {
      "sourceType": "github",
      "sourceUrl": "myorg/private-skills",
      "owner": { "name": "myorg" },
      "credentials": {
        "authMethod": "pat",
        "pat": "ghp_your_token_here"
      }
    }
  }'
```

Omit the `credentials` field when the agent's host-level GitHub identity already has access.

```bash
# List marketplaces
curl "https://<agent-endpoint>/api/v2/plugins/marketplaces" \
  -H "Authorization: Bearer $TOKEN"

# Remove a marketplace (keep installed plugins)
curl -X DELETE "https://<agent-endpoint>/api/v2/plugins/marketplaces/my-private-marketplace" \
  -H "Authorization: Bearer $TOKEN"

# Remove a marketplace and delete its installed plugins
curl -X DELETE "https://<agent-endpoint>/api/v2/plugins/marketplaces/my-private-marketplace?deleteInstallations=true" \
  -H "Authorization: Bearer $TOKEN"
```

## Related content

- [Install a plugin from a public marketplace](install-plugin-from-marketplace.md)
- [Install a plugin from a URL](install-plugin-from-url.md)
- [Plugin marketplace](plugin-marketplace.md)
