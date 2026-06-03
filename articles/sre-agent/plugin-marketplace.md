---
title: Plugin Marketplace in Azure SRE Agent
description: Browse, discover, and install community-built skills and MCP integrations from curated plugin marketplaces, including private repos and GitHub Enterprise.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 06/02/2026
ms.custom: plugins, marketplace, skills, MCP, connectors, extend, community
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: plugins, marketplace, skills, MCP, install, community, connectors, extend, private repo, GitHub Enterprise
#customer intent: As an SRE, I want to install community and internal skills from GitHub-hosted marketplaces so that I can extend my agent without building everything from scratch.
---

# Plugin marketplace in Azure SRE Agent

The plugin marketplace in Azure SRE Agent lets you install agent skills and MCP integrations from curated GitHub-hosted repositories. It supports public and private repos, including GitHub Enterprise. Each installation is pinned to a specific git commit, so updates are always explicit.

## Why organizations use the plugin marketplace

SRE and platform teams build operational skills for their services: investigation runbooks, compliance checks, cost analysis playbooks, deployment verification procedures. These skills are valuable beyond the team that wrote them. Other teams running similar infrastructure benefit from the same automation.

Sharing skills across an organization requires a consistent way to package them, distribute them, control who can access them, and manage versions across multiple agents. A platform team maintaining skills for 10 service teams needs to publish once and let each team install on their own schedule, without changes propagating unexpectedly.

The Plugin Marketplace provides this distribution model for Azure SRE Agent.

## What is a plugin in Azure SRE Agent?

A plugin is a portable, installable package of agent capabilities stored in a GitHub repository. A plugin can contain:

| Component | What it adds to your agent |
|-----------|---------------------------|
| **Skills** | Investigation runbooks, troubleshooting playbooks, operational procedures |
| **MCP servers** | Tool integrations that configure as connectors with pre-filled endpoints and auth |

A marketplace is a GitHub repo that bundles multiple plugins under a single `marketplace.json` manifest. Teams publish a marketplace, and other teams browse and install from it. Each plugin is installed independently, each pinned to a specific version.

## What the plugin marketplace does

**Discover and install plugins from GitHub repositories.** Register a marketplace by pointing to a GitHub repo. Two well-known public marketplaces can be registered:

- [Azure SRE Agent Plugins](https://github.com/Azure/sre-agent-plugins): official SRE Agent skills and integrations
- [Claude Plugins](https://github.com/anthropics/claude-plugins-official): Anthropic's reference Claude plugins

To get started, add a marketplace URL in **Builder > Plugins > Add marketplace**. The repository is cloned in the background. A status banner on the Plugins page tracks the clone, and a completion toast appears when the plugins are ready to browse.

**Private repos and GitHub Enterprise.** Marketplaces can be hosted in private GitHub repos, including GitHub Enterprise. Authentication is handled per-marketplace using the same methods as the [GitHub Connector](github-connector.md). Auth is configured once per marketplace and all plugins within it inherit the credentials.

### Shared credential boundary for private marketplaces

> [!WARNING]
> The credential you provide when registering a private marketplace (OAuth token, PAT, or GitHub App) is stored at the marketplace level and shared across all installs:
>
> - **All plugins inherit the marketplace credential.** Every install from that marketplace clones the repo using the stored credential, not the installing user's personal GitHub identity.
> - **GitHub checks the stored credential, not each user.** GitHub validates that the credential can read the repo. SRE Agent does not re-check individual users' GitHub permissions at install time.
> - **SRE Agent RBAC controls who can install.** Any user with the **Author** or **Administrator** role on the agent can browse and install from any registered marketplace.
>
> **Example:** User A registers a private marketplace with their PAT. User B has the Author role on the agent but no personal access to that GitHub repo. User B can still install plugins from it because the install uses User A's stored PAT. To prevent this, remove User B's Author role on the agent.

**Version pinning.** Each plugin installation is pinned to the exact git commit at install time. Changes to the source repo after installation have no effect until you explicitly update. This enables production stability (upstream merges don't change your agent's behavior), staged rollouts (update dev first, then production), and version diversity (different agents can run different versions of the same plugin).

**Install from URL.** You can also install a plugin directly from a GitHub repo URL without registering a marketplace. This is useful for one-off plugins or quick testing. The plugin is installed as a standalone with the same version pinning and authentication support.

**MCP connectors are set up separately from install.** Installing a plugin records its MCP server requirements but does not provision the connector. The plugin's detail page surfaces a non-blocking **Connector setup required** banner when a required server has no matching connector yet. Matching is loose: a connector is associated with a plugin by URL/command (or, for legacy entries, by name), so renaming a connector still keeps the link as long as the endpoint stays the same.

## Author a marketplace

To create your own marketplace, structure your GitHub repository with a manifest file in one of these locations:

| File path |
|-----------|
| `marketplace.json` (root) |
| `.plugin/marketplace.json` |
| `.github/plugin/marketplace.json` |
| `.claude-plugin/marketplace.json` |

For single-plugin repositories, a `plugin.json` file works in the same locations (`.plugin/plugin.json`, `plugin.json` at root, `.github/plugin/plugin.json`, or `.claude-plugin/plugin.json`).

### MCP server configurations for plugins

If your plugin integrates with an external tool server (like Datadog, Dynatrace, or Elasticsearch), include an `.mcp.json` file describing the server. The agent records these requirements at install time and surfaces them on the plugin's detail page so you can set up the matching connectors. Plugins that only contain skills don't need this file.

`.mcp.json` is resolved from the same conventional locations as the manifest:

| File path |
|-----------|
| `.mcp.json` (root) |
| `.plugin/.mcp.json` |
| `.github/plugin/.mcp.json` |
| `.claude-plugin/.mcp.json` |

Two formats are supported: [nested and flat](#mcp-config-formats). The portal detects both automatically.

## Before and after

The following table compares the manual workflow to the marketplace experience.

|  | Before | After |
|---|---|---|
| **Discovery** | Browse GitHub repos manually | Search curated catalogs with filters |
| **Installing skills** | Copy SKILL.md content, create skill manually | Select skills, select **Import selected** |
| **MCP setup** | Find and parse `.mcp.json`, configure connector by hand | **Add as connector** with prefilled settings |
| **Update awareness** | Manually check source repos for changes | One-select update check with SHA-256 hash comparison |
| **Provenance** | No tracking once skill is created | Source, version, and content hash recorded |
| **Time per skill** | 10 to 15 minutes | ~30 seconds |

## Marketplace formats

Your marketplace repository needs a manifest file in one of two supported locations.

| Format | File path |
|---|---|
| GitHub Copilot | `.github/plugin/marketplace.json` |
| Other formats | `.claude-plugin/marketplace.json` |

Standalone `plugin.json` files (at the repository root, `.github/plugin/`, or `.claude-plugin/`) also work for single-plugin repositories.

## MCP config formats

Plugins can include MCP server configurations in `.mcp.json`. The portal supports two formats.

### Nested format (standard)

The nested format wraps server definitions inside a `mcpServers` object.

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"],
      "env": { "API_KEY": "${API_KEY}" }
    }
  }
}
```

**Flat format**:

```json
{
  "my-server": {
    "command": "node",
    "args": ["server.js"],
    "env": { "API_KEY": "${API_KEY}" }
  }
}
```

> [!NOTE]
> The `env` values in `.mcp.json` are placeholder references. Users configure actual secrets when setting up the connector. Never commit real API keys or secrets to marketplace repositories.

MCP servers are classified as:

- **Supported**: has a command (stdio) or a URL with authentication headers
- **Unsupported**: anything else (no command and no URL+headers combination)

## Related content

- [GitHub Connector](github-connector.md)
- [MCP connectors](mcp-connector.md)
- [Skills](skills.md)
