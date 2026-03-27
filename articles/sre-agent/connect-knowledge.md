---
title: Connect knowledge in Azure SRE Agent
description: Give your agent access to runbooks, documentation, source code, and web resources to improve incident investigation accuracy.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge, knowledge-base, upload, documents, repositories, web-pages, runbooks
#customer intent: As an SRE, I want to connect knowledge sources to my agent so that it can reference runbooks, documentation, and source code during incident investigations.
---

# Connect knowledge in Azure SRE Agent

Your agent comes with built-in Azure observability, but every team has unique context: runbooks, architecture docs, internal wikis, and code repositories. By using the knowledge base, you can manage all these knowledge sources in one place so your agent can reference them during investigations.

> [!TIP]
> **Key takeaways**
>
> - **Builder > Knowledge base** is the central place to manage all knowledge sources, including files, web pages, and repositories.
> - Upload runbooks and docs, add web pages by URL, or connect source code repositories.
> - Your agent references indexed knowledge automatically during investigations.
> - The more relevant knowledge your agent has the faster and more accurate its responses.

## Why knowledge matters

Your agent is powerful out of the box with Azure observability and connected tools. But every team has unique context: runbooks, architecture docs, internal wikis, and code repositories that contain the institutional knowledge needed to resolve incidents quickly.

When your agent has access to this knowledge, it can:

- Reference your team's runbooks during incidents instead of starting from scratch.
- Correlate production problems to specific code changes in your repositories.
- Apply troubleshooting steps your team already documented.

## Knowledge base

Use the **Knowledge base** page in the portal (**Builder** > **Knowledge base**) to manage your agent's knowledge. You can upload files, add web pages, and view connected repositories.

The following table describes the three types of knowledge sources.

| Source type | What it provides | How to add |
|---|---|---|
| **Files** | Runbooks, troubleshooting guides, architecture docs, configuration references | Upload via portal, drag-and-drop, or let your agent create them during conversations |
| **Web pages** | External documentation, status pages, internal wiki URLs | Add by URL. Your agent indexes the content of the given URL. |
| **Repositories** | Source code for root cause analysis, deployment configs, infrastructure-as-code | Connect GitHub or Azure Repos |

Each entry shows its **name**, **indexing status** (Indexed, Pending, or Not indexed), **type**, and **last modified** date.

## Upload documents

Your agent can create and upload knowledge during conversations. Ask it to save a runbook from what you resolved, and it stores the document automatically. You can also upload files directly through the portal.

For supported file formats and size limits, see [Upload knowledge documents: Supported file formats](upload-knowledge-document.md#supported-file-formats). For full details on file types, limits, and agent-generated documents, see [Upload knowledge documents](upload-knowledge-document.md).

## Share files in chat

You can attach files directly in a chat thread by using drag and drop, paste from clipboard, or the **+** button. The thread stores chat attachments and gives your agent immediate context for analysis.

> [!TIP]
> **Want to keep a file permanently?**
>
> After attaching a file in chat, ask your agent: *"Save this to knowledge settings."* The agent reads the file from the thread and uploads a copy to the knowledge base, making it indexed and searchable across all future conversations. The original file stays in the thread too.

The following table compares uploading knowledge documents and sharing files in chat.

| | Upload knowledge | Share files in chat |
|---|---|---|
| **Where** | Builder > Knowledge base, or ask in chat | Chat message input (+, drag/drop, paste) |
| **Storage** | Agent-level: Indexed, searchable across all threads | Thread-level: Available in that conversation |
| **Best for** | Runbooks, architecture docs, procedures you want the agent to reference in every future conversation | Screenshots, logs, config files you need analyzed right now |
| **Promote to knowledge** | Already there | Ask the agent: *"Save this to knowledge settings"* which copies the content to agent-level storage |
| **Formats** | 28 types including documents, data, images | 31 types including code, scripts, infrastructure, web |
| **Size limits** | 16 MB per file, 100 MB per upload | 10 MB per file, 50 MB total, 5 files |

## Connect source code

Connect your GitHub or Azure DevOps repositories so your agent can read code, search for errors, and correlate deployments with incidents. The knowledge base displays repositories with clone and indexing status.

- To connect a GitHub repository, see [Connect source code](connect-source-code.md).
- To connect an Azure DevOps repository, see [Set up an Azure DevOps connector](azure-devops-connector.md).

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Upload knowledge documents](tutorial-upload-knowledge-document.md)

## Related content

- [Upload knowledge documents](upload-knowledge-document.md)
- [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md)
- [Connect source code](connect-source-code.md)
- [Set up an Azure DevOps connector](azure-devops-connector.md)
- [Set up the MCP connector](mcp-connector.md)
- [Set up the Kusto connector](kusto-connector.md)
- [Memory and knowledge](memory.md)
