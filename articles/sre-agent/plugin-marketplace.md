---
title: Plugin Marketplace in Azure SRE Agent
description: Browse, discover, and install community-built skills and MCP integrations from curated plugin marketplaces in Azure SRE Agent.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
ms.custom: plugins, marketplace, skills, MCP, connectors, extend, community
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to browse and install skills from curated marketplaces so that I can extend my agent quickly without manual configuration.
---

# Plugin marketplace in Azure SRE Agent

The Plugin Marketplace lets you browse, install, and update agent skills from curated GitHub-hosted catalogs. Instead of manually copying skill files and configuring connectors, you can discover plugins with search and filtering, preview their content, and import them with a single select.

> [!TIP]
> **Key highlights**
>
> - Browse and install agent skills from curated GitHub-hosted marketplaces in minutes.
> - One-select skill import with live content preview—no manual copy-pasting.
> - MCP plugins autoconfigure as connectors with prefilled settings.
> - SHA-256 content hashing lets you check for upstream skill changes with one select.

## The problem: extending your agent is manual work

When your team finds useful investigation runbooks, MCP tool integrations, or specialized skills built by other teams, the adoption process is entirely manual. You browse GitHub repositories, read individual SKILL.md files, copy content field by field, create skills one by one, and configure MCP connectors by hand. There's no central catalog, no version tracking, and no way to know when a skill source is updated.

For platform teams managing multiple agents, this workflow doesn't scale. Sharing skills across teams means pointing people to a repository and hoping they copy the right files. When a source publishes improvements, nobody knows until something breaks.

## How the Plugin Marketplace works

The Plugin Marketplace adds a discovery and management layer to your agent's skill ecosystem. The following steps describe the end-to-end workflow.

1. **Register marketplace sources**: Add curated GitHub repositories as plugin marketplaces. Start with the official Azure SRE Agent Plugins catalog, or add your team's own repository. Multiple plugin manifest formats are supported, including `.github/plugin/marketplace.json` and `.claude-plugin/marketplace.json`.

1. **Browse and search**: Explore available plugins with search, filtering, and live previews. Each plugin card shows its name, description, version, author, and badges indicating skill availability and MCP requirements.

1. **Preview before installing**: Select any plugin to see its full details: skill list with content preview, MCP server configurations, and a direct **View source** link to the plugin's folder on GitHub.

1. **Import with a click**: Select the skills you want, select **Import selected**, and the skills are created in your agent immediately. The system automatically handles name conflicts with existing skills.

1. **MCP plugins bridge to connectors**: When a plugin includes MCP server configurations, each server gets an **Add as connector** button that opens the connector wizard pre-filled with the right command, arguments, URL, and custom headers.

1. **Track and update**: Every imported skill records its source, version, and an SHA-256 content hash. Select **Check for updates** on any installed plugin to compare against the latest version in the source repository. When updates are available, review a side-by-side diff before applying changes.

## What makes this approach different

The Plugin Marketplace improves on existing workflows in several ways.

**Unlike browsing GitHub directly**, the marketplace provides structured discovery with searchable catalogs, skill previews, and compatibility badges and not just repository file listings.

**Unlike manual skill creation**, imported plugins maintain provenance. You always know which repository a skill came from, what version you installed, and whether updates are available.

**Unlike copy-pasting MCP configurations**, the marketplace detects `.mcp.json` files automatically, classifies servers as supported or unsupported, and prefills the connector wizard. This functionality handles both flat and nested MCP config formats.

## Before and after

The following table compares the manual workflow to the marketplace experience.

|  | Before | After |
|---|---|---|
| **Discovery** | Browse GitHub repos manually | Search curated catalogs with filters |
| **Installing skills** | Copy SKILL.md content, create skill manually | Select skills, select **Import selected** |
| **MCP setup** | Find and parse `.mcp.json`, configure connector by hand | **Add as connector** with prefilled settings |
| **Update awareness** | Manually check source repos for changes | One-select update check with SHA-256 hash comparison |
| **Provenance** | No tracking once skill is created | Source, version, and content hash recorded |
| **Time per skill** | 10–15 minutes | ~30 seconds |

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
      "env": { "API_KEY": "<YOUR_API_KEY>" }
    }
  }
}
```

### Flat format

The flat format defines servers as top-level keys.

```json
{
  "my-server": {
    "command": "node",
    "args": ["server.js"],
    "env": { "API_KEY": "<YOUR_API_KEY>" }
  }
}
```

### MCP server classification

You can classify MCP servers into two categories based on their configuration.

- **Supported**: Uses a command (stdio) or a URL with authentication headers.
- **Unsupported**: Requires OAuth or has a bare URL without headers. The browse view filters out unsupported servers by default.

## Next step

> [!div class="nextstepaction"]
> [Set up an MCP connector](mcp-connector.md)

## Related content

- [Connectors](connectors.md): Learn how your agent connects to external data sources and tools.
- [Skills](skills.md): Understand what skills are and how the agent uses them.
- [Set up an MCP connector](mcp-connector.md): Connect your agent to MCP tool servers.
