---
title: Upload Knowledge Documents to Azure SRE Agent
description: Create and upload runbooks, troubleshooting guides, and documentation to the knowledge base during conversations to capture institutional knowledge automatically.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge-base, upload, documents, runbooks, troubleshooting, automated-knowledge, agent-tool, knowledge-management
#customer intent: As an SRE, I want my agent to upload knowledge documents during conversations so that incident resolutions become reusable institutional knowledge.
---

# Upload knowledge documents to Azure SRE Agent
<!-- > [!VIDEO <VIDEO_URL_FOR_AGENT_KNOWLEDGE_BASE>]
Replace <VIDEO_URL_FOR_AGENT_KNOWLEDGE_BASE> with the hosted URL for the Agent's Knowledge Base video. -->

Your agent captures institutional knowledge during conversations by uploading runbooks, troubleshooting guides, and documentation directly to the knowledge base. When your agent discovers a fix or resolves an incident, it generates structured documents and indexes them for semantic search, so every future investigation benefits from past resolutions.

> [!TIP]
> Your agent creates and uploads runbooks during conversations without manual file management. The system indexes documents for semantic search, making them available to all future investigations. Incident resolutions automatically become institutional knowledge.

## How your agent captures knowledge

Your agent can upload documents to the knowledge base during conversations by using the **Upload Knowledge Document** tool. When your agent discovers a fix, creates a troubleshooting guide, or synthesizes investigation findings, it stores that knowledge directly and makes it searchable for every future conversation.

```text
Create a runbook from the steps we just followed to fix this database
connection pool exhaustion issue and save it to the knowledge base.
```

Your agent generates a structured runbook and uploads it in seconds. The document is indexed automatically and becomes searchable for future investigations.

:::image type="content" source="media/upload-knowledge-document/agent-generated-guide.png" alt-text="Agent generating and uploading a troubleshooting guide during a conversation" lightbox="media/upload-knowledge-document/agent-generated-guide.png":::

## Before and after

The following table compares knowledge capture workflows before and after using the **Upload Knowledge Document** tool.

| Area | Before | After |
|------|--------|-------|
| **Knowledge capture** | Post-incident: engineer writes runbook (maybe) | Your agent captures the fix as it happens |
| **Time to document** | 30-60 minutes to write a runbook | Seconds: your agent generates and uploads inline |
| **Knowledge freshness** | Runbooks go stale within weeks | Knowledge base grows with every resolution |
| **Accessibility** | Knowledge stuck in engineer's head or chat thread | Searchable by your agent across all future conversations |
| **Format consistency** | Varies by author | Structured, consistent documentation every time |

## What makes this different

Unlike manual uploads, your agent creates knowledge proactively. You don't need to remember to document what you learned. Your agent does it as part of the conversation.

Unlike chat history, uploaded documents are indexed for semantic search. When a similar issue occurs months later, your agent finds the relevant runbook automatically through intelligent retrieval, not by scrolling through old threads.

Unlike wiki connectors, uploaded documents don't require external services. The knowledge lives directly in your agent's knowledge base, available instantly without syncing delays.

## How it works

The **Upload Knowledge Document** tool accepts three parameters.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **File name** | Yes | Name with `.md` or `.txt` extension (for example, `database-pool-runbook.md`) |
| **Content** | Yes | Full document text in Markdown or plain text format |
| **Trigger indexing** | Optional (default: `true`) | Whether to make the document searchable immediately |

When your agent uploads a document:

1. The agent validates the filename and content (maximum 16 MB per file).
1. The agent stores the document in your agent's knowledge base.
1. The agent indexes the content for semantic search.
1. The agent confirms the upload with a success message.

> [!NOTE]
> If a document with the same filename already exists, the new content replaces it. Upload with the same name to refresh the content.

## Supported file formats

The Upload Knowledge Document tool supports text-based formats that your agent generates inline.

| Format | Extension | Best for |
|--------|-----------|----------|
| Markdown | `.md` | Runbooks, troubleshooting guides with formatting and headers |
| Plain text | `.txt` | Simple notes, logs, raw documentation |

> [!NOTE]
> When you upload files through the API or CLI, you can use more text formats, including CSV, JSON, YAML, and log files. The upload API supports binary formats (PDF, Word, Excel, PowerPoint) and images. The agent tool focuses on `.md` and `.txt` formats because your agent generates text content during conversations.

:::image type="content" source="media/upload-knowledge-document/add-file-dialog.png" alt-text="The Add file dialog in the Knowledge Base showing supported formats and drag-and-drop upload" lightbox="media/upload-knowledge-document/add-file-dialog.png":::

## Example: capture incident knowledge

During an incident investigation, ask your agent:

```text
We just resolved the high CPU issue on web-app-prod. It was caused by a
memory leak in the connection pool. Create a troubleshooting guide from
what we learned and upload it to the knowledge base.
```

Your agent generates a structured troubleshooting guide with:

- **Scoping steps**: How to identify the problem
- **Quick mitigations**: Immediate actions to reduce impact
- **Root cause analysis**: What to investigate
- **Resolution steps**: The fix that worked
- **Prevention**: How to avoid recurrence

The next time a similar CPU problem occurs, your agent automatically references this document during investigation, turning one engineer's experience into shared team knowledge.

## Prerequisites

Before you use the Upload Knowledge Document tool, make sure you meet the following requirements.

| Requirement | Details |
|-------------|---------|
| Agent version | 26.1.57.0 or later |
| Knowledge base | Enabled on your agent |
| Write permissions | Your agent needs write access to the knowledge base |
| Run mode | Review or Autonomous (write actions require approval in Review mode) |

## Limits

The following limits apply to uploaded knowledge documents.

| Limit | Value |
|-------|-------|
| Maximum file size | 16 MB per document |
| Supported extensions | `.md` and `.txt` |
| Filename characters | Letters, numbers, hyphens, underscores, dots (no `/`, `\`, `?`, `#`) |
| Maximum filename length | 1,024 characters |

## When to use something else

The following table describes scenarios where a different approach is more appropriate.

| Scenario | Better approach |
|----------|----------------|
| Connecting live wiki content that stays in sync | [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md) |
| Uploading binary files (PDF, Word, images) | Upload manually through **Builder > Knowledge base > Add file** |
| Bulk importing many documents at once | Use the `srectl doc upload --file <path>` CLI command |

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Upload a knowledge document](./tutorial-upload-knowledge-document.md)

## Related content

- [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md)
- [Root cause analysis](root-cause-analysis.md)
- [Tutorial: Upload knowledge documents](tutorial-upload-knowledge-document.md)
