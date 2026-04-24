---
title: Connect knowledge in Azure SRE Agent
description: Give your agent access to runbooks, documentation, source code, and web content so it can investigate incidents with the context your team already has.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge, knowledge-base, upload, documents, repositories, web-pages, runbooks
#customer intent: As an SRE, I want to connect knowledge sources to my agent so that it can reference runbooks, documentation, and source code during incident investigations.
---

# Connect knowledge in Azure SRE Agent

Azure SRE Agent is more effective when it can use the same context your team uses to troubleshoot systems. Connect runbooks, documentation, web pages, and repositories so your agent can reference them during investigations instead of starting from scratch.

> [!TIP]
> - Use **Builder > Knowledge base** to manage files, web pages, and repositories in one place.
> - Indexed knowledge is automatically available during investigations and chat.
> - You can upload documents directly, attach files in chat, or connect repositories for source-aware analysis.
> - The most useful knowledge sources are the ones your team already depends on, such as runbooks, architecture notes, troubleshooting guides, and source code.

## Why knowledge matters

Your agent already has built-in Azure context through observability tools and connected systems. What it doesn't have by default is your team's internal knowledge. That knowledge includes the runbook that explains a common recovery step, the architecture note that identifies a shared dependency, or the repository that reveals which deployment introduced a regression.

When you connect that knowledge, your agent can:

- Reference team runbooks during an incident.
- Reuse troubleshooting steps your team already documented.
- Correlate symptoms with source code and deployment context.
- Answer questions by using the same documents and references humans use.

## Manage knowledge in the knowledge base

Use **Builder > Knowledge base** to manage your agent's knowledge sources.

The page shows each source with its:

- **Name**
- **Status**
- **Type**
- **Last modified** date

Three source types are available:

| Source type | What it provides | How to add it |
|---|---|---|
| **Files** | Runbooks, troubleshooting guides, architecture documents, and reference material | Upload through the portal or ask the agent to save a document during chat |
| **Web pages** | External documentation, internal wiki URLs, and status pages | Add the page URL so the agent can index the content |
| **Repositories** | Source code, deployment files, and infrastructure definitions | Connect GitHub or Azure DevOps repositories |

## Check indexing status and freshness

Each knowledge source shows one of the following states:

| Status | Meaning |
|---|---|
| **Indexed** | The content is processed and searchable |
| **Pending** | The content is still being processed |
| **Not indexed** | Processing failed or the source couldn't be indexed |

When a source is indexed, hover over the status indicator to see the **Created at** timestamp. This timestamp is useful when you want to confirm that the latest version of a runbook or document is processed.

## Upload documents

Upload documents when you want knowledge to stay available across future conversations.

Typical examples include:

- Incident runbooks
- Escalation guides
- Architecture references
- Troubleshooting checklists

You can upload files through the portal, or you can ask the agent to save content from a conversation into the knowledge base.

For supported file formats and limits, see [Upload knowledge documents](upload-knowledge-document.md#supported-file-formats).

For the full workflow, see [Upload knowledge documents](upload-knowledge-document.md).

## Share files in chat

Use chat attachments when you want to give the agent immediate context in a single conversation. This approach is useful for screenshots, logs, configuration files, and other materials that help with active troubleshooting.

> [!TIP]
> If a file you attach in chat should become long-term knowledge, ask the agent to save it to Knowledge settings. The agent can upload a copy so the content becomes indexed and searchable in later conversations.

The following table compares long-term knowledge uploads with temporary chat attachments:

| Scenario | Upload to Knowledge base | Share in chat |
|---|---|---|
| **Best for** | Runbooks, procedures, and documents you want available in future conversations | Files you want the agent to analyze right now |
| **Storage scope** | Agent-level and searchable across future conversations | Thread-level and available in the current conversation |
| **How to add** | Upload in the portal or ask the agent to save content | Drag and drop, paste from clipboard, or use **+** in chat |
| **Can become long-term knowledge** | Already long-term knowledge | Yes, if you ask the agent to save it |

For more information, see [Share files in chat](file-attachments.md).

## Add web pages

Add web pages when important guidance lives outside uploaded files or repositories.

Good candidates include:

- Internal wiki articles
- Public product documentation
- Service status pages
- Team-maintained reference pages

After you add a URL, the agent indexes the page content so it can reference that information during future investigations.

## Connect repositories

Connect GitHub or Azure DevOps repositories when your agent needs source-aware context.

Connected repositories help the agent:

- Search for error patterns in source code
- Correlate incidents with recent code changes
- Reference deployment and configuration files
- Use repository content during root cause analysis

To connect source code, see [Connect source code](connect-source-code.md).

## Choose the right knowledge source

Use the source type that matches the kind of context you need:

| If you need to connect... | Use... |
|---|---|
| A runbook or troubleshooting guide stored as a file | [Upload knowledge documents](upload-knowledge-document.md) |
| A screenshot, log, or file for one active investigation | [Share files in chat](file-attachments.md) |
| A GitHub or Azure DevOps repository | [Connect source code](connect-source-code.md) |
| External systems such as Datadog or Splunk | [MCP connectors](mcp-connectors.md) |

## Related content

| Capability | What it adds |
|---|---|
| [Upload knowledge documents](upload-knowledge-document.md) | Add persistent files and agent-generated knowledge |
| [Share files in chat](file-attachments.md) | Provide temporary files for immediate analysis |
| [Connect source code](connect-source-code.md) | Add repository context for investigations and root cause analysis |
| [GitHub connector](github-connector.md) | Extend repository access with GitHub-specific capabilities |
| [Azure DevOps connector](ado-connector.md) | Connect repositories, work items, wiki content, and pipelines |
| [MCP connectors](mcp-connectors.md) | Extend your agent to external tools and systems |
