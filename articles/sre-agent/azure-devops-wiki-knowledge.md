---
title: Azure DevOps Wiki Knowledge in Azure SRE Agent
description: Connect your Azure DevOps wikis as knowledge sources so your agent references runbooks, procedures, and documentation during investigations.
ms.topic: feature-guide
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to connect my Azure DevOps wikis to SRE Agent so that my team's runbooks and procedures surface automatically during investigations.
---

# Azure DevOps wiki knowledge in Azure SRE Agent
Connect your Azure DevOps wikis so your agent references your team's runbooks and procedures during investigations. Wiki content is indexed and searchable, and your agent finds the right page automatically. The connector supports both managed identity and personal access token (PAT) authentication.

## The problem: knowledge goes unused during incidents

Your team invests hundreds of hours writing runbooks, troubleshooting guides, and operational procedures in Azure DevOps wikis. But when an incident fires at 3 AM, nobody searches the wiki. The on-call engineer opens a dozen tabs, checks Azure Monitor, and either figures it out from memory or escalates. The documentation written for exactly this situation goes untouched.

The knowledge exists. The problem is access - not to the wiki, but to the right page at the right time, in the context of the actual problem.

## How SRE Agent solves this problem

Connect your Azure DevOps wiki once, and your agent automatically searches it during every investigation:

1. **Indexes your wiki pages** — Crawls and indexes all pages from your Azure DevOps wiki.
1. **Searches contextually** — When you ask a question or an incident fires, your agent searches your wiki alongside other knowledge sources.
1. **References specific pages** — Responses include citations linking back to the original wiki page.
1. **Picks up updates** — Reconnect or refresh the connector to re-index updated wiki content.

## Before and after

| Scenario | Before | After |
|---|---|---|
| **Incident response** | On-call person doesn't search wiki during incidents | Your agent searches wiki automatically for every query |
| **Knowledge access** | Knowledge in wiki goes unused at 3 AM | Runbooks surface exactly when needed |
| **Onboarding** | New team members don't know which wiki page to check | Your agent finds the relevant page regardless of experience |
| **Search quality** | Wiki search requires knowing the right keywords | Your agent understands context and finds related content |

## What makes this different

Unlike static file uploads, your wiki stays alive. When your team updates a runbook in Azure DevOps, your agent picks up the changes. You don't need to re-upload files.

Unlike full-text wiki search, your agent understands context. It doesn't match keywords. Instead, it correlates your question with relevant wiki content, combining it with live telemetry from Azure Monitor, logs from Kusto, and other connected sources.

Unlike external MCP-based wiki access, the built-in Documentation connector requires no external server setup. You provide the wiki URL and authentication, and your agent handles the rest.

## How it works

The Documentation connector (`Azure DevOps` service type) crawls your wiki pages and indexes them for search. When your agent receives a query, it searches the indexed content alongside other knowledge sources, such as uploaded files, web pages, and connected repositories.

The connector supports two types of Azure DevOps content:

| Content type | URL pattern | What gets indexed |
|---|---|---|
| Wiki | `https://dev.azure.com/{org}/{project}/_wiki/wikis/{wiki-name}` | All wiki pages (Markdown) |
| Wiki (scoped) | `.../_wiki/wikis/{wiki-name}/{pageId}/Page-Name` | Specific page and its subpages |
| Git repository | `https://dev.azure.com/{org}/{project}/_git/{repo}` | Text files (Markdown, docs, code) |
| Legacy wiki | `https://{org}.visualstudio.com/{project}/_wiki/wikis/{wiki-name}` | Same as above (legacy URL format) |

> [!NOTE]
> When you include a page ID in the wiki URL, the connector indexes only that page and its subpages. This approach is useful for targeting specific sections like `/Operations` or `/Runbooks` without indexing your entire wiki.

## How documentation syncing works

Once connected, your agent keeps your documentation index up to date automatically. You don't need to manually re-upload anything.

| Aspect | Details |
|---|---|
| **Sync frequency** | Auto-crawls every 24 hours |
| **Supported formats** | `.md`, `.txt`, `.rst`, `.adoc`, `.asciidoc`, `.wiki`, `.textile`, `.org`, `.htm`, `.html`, `.json`, `.yaml`, `.yml`, `.xml`, `.csv` (15 file formats) |
| **Indexing process** | Documents are chunked, embedded, and indexed for semantic search |
| **Updates** | Changes in your repository are picked up on the next sync cycle with no manual action required |

Your agent processes each document by splitting it into semantically meaningful chunks, generating vector embeddings, and storing them in a search index. When a query arrives, your agent performs a semantic search across all indexed chunks and retrieves the most relevant passages, regardless of exact keyword matches.

Your team can update runbooks, add new procedures, or reorganize wiki pages, and your agent reflects those changes within 24 hours.

## Prerequisites

| Requirement | Details |
|---|---|
| Azure DevOps wiki | A wiki in your Azure DevOps project with content |
| Authentication | Managed identity (recommended) or personal access token (PAT) |
| Permissions | Read access to the wiki |

## Authentication options

The following table describes the available authentication methods for the Azure DevOps wiki connector.

| Method | Best for | How it works |
|---|---|---|
| **Managed identity** | Production environments | Uses your agent's system-assigned or user-assigned managed identity. Requires adding the identity as a user in your Azure DevOps organization. |
| **Personal access token (PAT)** | Quick setup, testing | Generate a PAT in Azure DevOps with Code (Read) scope. |

## Example: use a runbook during an incident

After connecting your operations wiki, ask your agent:

```text
Our payment service is returning 503 errors. What does our runbook say to do?
```

Your agent searches your wiki, finds the "Payment Service Troubleshooting" page, and responds with the documented procedure. The response includes a citation linking back to the original wiki page in Azure DevOps.

## Next step

> [!div class="nextstepaction"]
> [Connect an Azure DevOps wiki](./connect-devops-wiki.md)

## Related content

- [Memory and knowledge](memory.md)
- [Diagnose with external observability tools](diagnose-observability.md)
- [Connectors](connectors.md)
- [Tutorial: Set up Azure DevOps connector](azure-devops-connector.md)
