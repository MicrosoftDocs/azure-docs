---
title: Connect knowledge in Azure SRE Agent
description: Give your agent access to runbooks, documentation, source code, and web resources to improve incident investigation accuracy.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge, knowledge-base, upload, documents, repositories, web-pages, runbooks
#customer intent: As an SRE, I want to connect knowledge sources to my agent so that it can reference runbooks, documentation, and source code during incident investigations.
---

# Connect knowledge in Azure SRE Agent

> [!TIP]
> - Use **Builder → Knowledge base** to manage all knowledge sources, including files, web pages, and repositories.
> - Upload runbooks and docs, add web pages by URL, or connect source code repositories.
> - Your agent automatically references indexed knowledge during investigations.
> - The more relevant knowledge your agent has, the faster and more accurate its responses.

## Why knowledge matters

Your agent is powerful out of the box with Azure observability and connected tools. But every team has unique context including runbooks, architecture docs, internal wikis, and code repositories that contain the tribal knowledge needed to resolve incidents quickly.

When your agent has access to this knowledge, it can:
- Reference your team's runbooks during incidents instead of starting from scratch.
- Correlate production issues to specific code changes in your repositories.
- Apply troubleshooting steps your team already documented.

## Knowledge base: one place for all sources

Use the **Knowledge base** page in the portal (**Builder** > **Knowledge base**) to manage your agent's knowledge. You can upload files, add web pages, and view connected repositories.

Three types of knowledge sources are available:

| Source type | What it provides | How to add |
|---|---|---|
| **Files** | Runbooks, troubleshooting guides, architecture docs, configuration references | Upload via portal, drag-and-drop, or let your agent create them during conversations |
| **Web pages** | External documentation, status pages, internal wiki URLs | Add by URL. Your agent indexes the content of the given URL. |
| **Repositories** | Source code for root cause analysis, deployment configs, infrastructure-as-code | Connect GitHub or Azure Repos |

Each entry shows its **name**, **indexing status** (Indexed, Pending, or Not indexed), **type**, and **last modified** date. When you hover over the **✓ Indexed** status, you see a **Created at** tooltip that shows exactly when the source was indexed.

### Verify data freshness

When a knowledge source is indexed, hover over the **✓ Indexed** status to see the **Created at** tooltip with the exact date and time it was processed. This information helps you confirm your agent is working with the most current version of each document. It's especially useful after updating a runbook or troubleshooting guide.

Knowledge sources display one of three statuses:

| Status | Meaning |
|--|--|
| **✓ Indexed** | Content is processed and is searchable. Hover to see the **Created at** timestamp. |
| **Pending** | Content is being processed. Check back shortly. |
| **⚠ Not indexed** | Processing failed. Try re-uploading or check the source URL. |

## Upload documents

Your agent can create and upload knowledge during conversations. Ask it to save a runbook from what you just resolved, and it stores the document automatically. You can also upload files directly through the portal.

For supported file formats and size limits, see [Upload Knowledge Documents → Supported file formats](upload-knowledge-document.md#supported-file-formats).

For full details on file types, limits, and agent-generated documents, see [Upload Knowledge Documents](upload-knowledge-document.md).

## Share files in chat

You can also attach files directly in chat. Drag and drop, paste from clipboard, or use the **+** button. Chat attachments are stored with the thread and give your agent immediate context for analysis.

> [!TIP]
> After attaching a file in chat, ask your agent: *"Save this to knowledge settings."* The agent reads the file from the thread and uploads a copy to Knowledge settings, making it indexed and searchable across all future conversations. The original stays in the thread too.

| Attribute | Upload Knowledge | Share Files in Chat |
|---|---|---|
| **Where** | Builder → Knowledge settings, or ask in chat | Chat message input (+, drag/drop, paste) |
| **Storage** | Agent-level:  indexed, searchable across all threads | Thread-level: available in that conversation |
| **Best for** | Runbooks, architecture docs, procedures you want the agent to reference in every future conversation | Screenshots, logs, config files you need analyzed right now |
| **Promote to knowledge** | Already there | Ask the agent: *"Save this to knowledge settings"*. The agent then copies the content to agent-level storage. |
| **Formats** | 28 types: documents, data, images | 31 types: adds code, scripts, infrastructure, web |
| **Size limits** | 16 MB per file · 100 MB per upload | 10 MB per file · 50 MB total · 5 files |

For more information, see [Share files in chat](file-attachments.md).

## Connect source code

Connect GitHub or Azure Repos so your agent can search code, correlate errors with recent changes, and reference deployment configurations during investigations.

### Add repositories

From **Builder** > **Knowledge base**, select **Add repository** to open a guided wizard that walks you through three steps:

| Step | What you do |
|------|------------|
| **1. Choose a platform** | Select **GitHub** or **Azure DevOps**. For Azure DevOps, enter your organization name. |
| **2. Authenticate** | Sign in with OAuth or enter a personal access token (PAT). Azure DevOps also supports managed identity. |
| **3. Add repositories** | Browse available repos from the dropdown or enter URLs manually. Add a display name and optional description for each entry. For Azure DevOps, select a project first to filter the repo list. |

You can add multiple repositories in a single session. Select **+** to add rows, then select **Save** when done.

After saving, your repositories appear in the knowledge base list with indexing status. Once indexed, your agent can reference the code in conversations.

### Supported platforms and authentication

| Platform | Auth methods | What you need |
|----------|-------------|--------------|
| **GitHub** | OAuth, Personal access token | GitHub account with repo access. For PAT, create a token with `repo` scope. |
| **Azure DevOps** | OAuth, Personal access token, Managed identity | Azure DevOps organization access. For managed identity, assign a user-assigned managed identity to the agent resource. |

- To learn more about connecting GitHub repositories, see [Connect source code](connect-source-code.md).
- To connect an Azure DevOps repository, see [Set up an Azure DevOps connector](azure-devops-connector.md).

## Get started

| Resource | What you learn |
|----------|-------------------|
| [Upload Knowledge Documents →](upload-knowledge-document.md) | Add runbooks and docs to your agent's knowledge base |
| [Connect to ADX →](kusto-connector.md) | Connect Azure Data Explorer for log queries |
| [Connect GitHub →](connect-source-code.md) | Connect a source code repository |

## Related content

| Capability | What it adds |
|------------|--------------|
| [Upload Knowledge Documents](upload-knowledge-document.md) | Persistent file formats, limits, and agent-generated knowledge |
| [Share Files in Chat](file-attachments.md) | Temporary file attachments for immediate analysis in a conversation |
| [GitHub Connector](github-connector.md) | Source code, issues, pull requests, and workflow access |
| [Azure DevOps Connector](ado-connector.md) | Source code, work items, wiki knowledge, and pipeline access |
| [MCP Connectors](mcp-connectors.md) | Extend to Datadog, Splunk, and other external systems |
