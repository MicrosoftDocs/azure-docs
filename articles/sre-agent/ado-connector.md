---
title: Azure DevOps connector in Azure SRE Agent
description: Connect Azure DevOps for source code analysis, work item management, and wiki knowledge with OAuth or managed identity authentication.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to understand Azure DevOps connector capabilities so that I can decide which connector type and authentication method to use for my team's needs.
---

# Azure DevOps connector in Azure SRE Agent

Connect Azure DevOps so your agent can search your code, create work items, and index your wiki as a knowledge source.

> [!TIP]
> **Quick overview**
>
> - Two connector types: **Azure DevOps OAuth** for live code and work items, **Documentation connector** for wiki knowledge.
> - OAuth supports **User account** (Microsoft Entra ID) and **Managed identity** authentication.
> - A single connector covers your entire Azure DevOps organization, including all projects and repos.
> - Wiki content is indexed for semantic search and autosyncs every 24 hours.

## Two connector types

Azure DevOps has two connector types because they serve different purposes.

| Connector | What it does | Auth options |
|---|---|---|
| **Azure DevOps OAuth** | Live source code access, work items, pipelines, semantic code search | User account (OAuth) or Managed identity |
| **Documentation connector** | Indexes wiki pages and docs into a searchable knowledge base | Managed identity or PAT |

You can use both together. Use the OAuth connector for live code investigations and the documentation connector for wiki-based knowledge.

## Azure DevOps OAuth connector

The OAuth connector gives your agent live access to source code, work items, and pipelines across your entire Azure DevOps organization.

### Authentication types

Choose the authentication method that fits your team's needs.

| Method | How it works | Best for |
|---|---|---|
| **User account** | Sign in with your Microsoft Entra ID account. The agent accesses Azure DevOps through your permissions. Tokens refresh automatically. | The interactive setup is recommended for most users |
| **Managed identity** | Use the agent's managed identity to authenticate. Supports Federated Identity Credentials (FIC) for cross-tenant access. | Automated setup, service accounts, cross-tenant access |

> [!TIP]
> **OAuth tokens refresh automatically**
>
> Azure DevOps OAuth tokens expire after approximately one hour, but your agent refreshes them automatically before expiration using a 5-minute buffer. Each refresh generates a new refresh token, creating a self-sustaining renewal chain. Your connector stays connected through multihour investigations with no manual reauthentication required.
>
> **When you need to reauthenticate:** if the refresh token expires (lifetime varies by Microsoft Entra ID policy), if an admin revokes the app authorization, or if you set up your connector before version 26.2.247.0 (one reauthentication enables autorefresh going forward).

### What the agent can do

The OAuth connector gives your agent the following capabilities.

**Source code analysis:**

- Search code across all repos in your organization by using the Azure DevOps Search API.
- Read file contents by path and branch.
- Correlate Azure resource errors with source code locations (with confidence scoring).
- Perform semantic code searches to find code related to an incident by using natural language.

**Work item management:**

- Create work items (Task, Bug, Epic, Feature) with area path, iteration, priority, and severity.
- Link work items to Azure resources for traceability.

**Repository mapping:**

- Find and link Azure Repos to Azure resources.
- Identify infrastructure-as-code files (Bicep, Terraform, ARM templates) in linked repos.

## Documentation connector (wiki knowledge)

Index your Azure DevOps wiki pages so your agent can search them during investigations. When your agent encounters an issue, it searches your indexed wiki for relevant troubleshooting guides, architecture docs, and runbooks.

### How it works

The documentation connector processes your wiki content through the following steps:

1. **Crawls** all pages from your specified Azure DevOps wiki URL (or a specific subsection).
1. **Chunks and embeds** document content into a vector search index.
1. **Semantic search** - during investigations, your agent finds relevant passages and cites the original wiki page.
1. **Auto-syncs every 24 hours** to pick up wiki updates.

### Supported content

The documentation connector supports the following content types:

- Wiki pages (Azure DevOps Wiki format)
- Git repository files including 15 supported formats: `.md`, `.txt`, `.rst`, `.adoc`, `.asciidoc`, `.wiki`, `.textile`, `.org`, `.htm`, `.html`, `.json`, `.yaml`, `.yml`, `.xml`, `.csv`
- Scoped indexing that points to a subpage to index only a specific section of your wiki

## Get started

Use the following resources to set up your Azure DevOps connector.

| Resource | What you learn |
|---|---|
| [Connect source code](connect-source-code.md) | Step-by-step guide for connecting GitHub and Azure DevOps repositories |
| [Set up an Azure DevOps connector](azure-devops-connector.md) | Detailed Azure DevOps connector tutorial |

## Next step

> [!div class="nextstepaction"]
> [Set up an Azure DevOps connector](azure-devops-connector.md)

## Related content

- [Root cause analysis](root-cause-analysis.md): How source code context improves investigation accuracy.
- [Memory and knowledge](memory.md): How indexed knowledge integrates with your agent's persistent memory.
- [Upload knowledge documents](upload-knowledge-document.md): Upload documents directly instead of connecting a wiki.
- [Connectors](connectors.md): Overview of all connector types.
