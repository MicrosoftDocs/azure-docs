---
title: Upload Knowledge Documents to Azure SRE Agent
description: Create and upload runbooks, troubleshooting guides, and documentation to Knowledge settings during conversations to capture institutional knowledge automatically.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge-base, upload, documents, runbooks, troubleshooting, automated-knowledge, agent-tool, knowledge-management
#customer intent: As an SRE, I want my agent to upload knowledge documents during conversations so that incident resolutions become reusable institutional knowledge.
---

# Upload knowledge documents in Azure SRE Agent


> [!TIP]
> - Your agent creates and uploads runbooks during conversations with no manual file management.
> - Attach 31 file types in chat, including `.kql`, `.bicep`, `.tf`, `.har`, `.py`, and `.xlsx`, for immediate analysis context.
> - Upload 28 file types to Knowledge settings for persistent, indexed storage across all future conversations
> - Incident resolutions become institutional knowledge automatically

## The problem: knowledge dies with the conversation

Every incident your team resolves generates valuable knowledge: what went wrong, what commands fixed it, and what to check first next time. But that knowledge lives in chat threads, engineer memory, and postmortems that nobody reads at 3 AM.

Your team has runbooks, but they go stale. The fix discovered during last night's incident? It's in someone's head, or buried in a conversation that scrolls out of view by next week. The next time the same issue occurs, a different engineer starts from scratch.

## How your agent solves this problem

Your agent can upload documents to Knowledge settings during conversations by using the **Upload Knowledge Document** tool. When your agent discovers a fix, creates a troubleshooting guide, or synthesizes investigation findings, it stores that knowledge directly and makes it searchable for every future conversation.

```text
"Create a runbook from the steps we just followed to fix this database
connection pool exhaustion issue and save it to Knowledge settings."
```

Your agent generates a structured runbook and uploads it in seconds. The document is indexed automatically and becomes searchable for future investigations.

## Before and after

|  | Before | After |
|---|--------|-------|
| **Knowledge capture** | Post-incident: engineer writes runbook (maybe) | Your agent captures the fix as it happens |
| **Time to document** | 30 to 60 minutes to write a runbook | Seconds. Your agent generates and uploads inline. |
| **Knowledge freshness** | Runbooks go stale within weeks | Knowledge settings grows with every resolution |
| **Accessibility** | Knowledge stuck in engineer's head or chat thread | Searchable by your agent across all future conversations |
| **Format consistency** | Varies by author | Structured, consistent documentation every time |

## What makes this different

**Unlike manual uploads**, your agent creates knowledge proactively. You don't need to remember to document what you learned because your agent does it as part of the conversation.

**Unlike chat history**, uploaded documents are indexed for semantic search. When a similar issue occurs months later, your agent finds the relevant runbook automatically through intelligent retrieval, not by scrolling through old threads.

**Unlike wiki connectors**, uploaded documents don't require external services. The knowledge lives directly in your agent's Knowledge settings, available instantly without syncing delays.

## How it works

The **Upload Knowledge Document** tool accepts three parameters:

| Parameter | Required | Description |
|-----------|----------|-------------|
| **File name** | Yes | Name with `.md` or `.txt` extension (for example, `database-pool-runbook.md`) |
| **Content** | Yes | Full document text in Markdown or plain text format |
| **Trigger indexing** | Optional (default: `true`) | Whether to make the document searchable immediately |

When your agent uploads a document:

1. **Validates** the filename and content (up to 16 MB per file).
1. **Stores** the document in your agent's Knowledge settings.
1. **Indexes** the content for semantic search.
1. **Confirms** the upload with a success message.

> [!NOTE]
> If a document with the same filename already exists, the new content replaces it. This process makes it easy for your agent to update knowledge. Upload with the same name to refresh the content.

## Supported file formats

Your agent handles files through three methods, each supporting different formats.

### Chat attachments

Drag files into any chat to give your agent immediate context for analysis - troubleshooting scripts, configuration files, network traces, and more.

| Category | Extensions |
|----------|-----------|
| **Images** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg` |
| **Documents** | `.txt`, `.md`, `.pdf`, `.docx`, `.pptx`, `.xlsx` |
| **Data and configuration** | `.json`, `.csv`, `.log`, `.yaml`, `.yml`, `.xml`, `.ini`, `.conf`, `.env` |
| **Web and network** | `.html`, `.har` |
| **Code and scripts** | `.ts`, `.js`, `.py`, `.sh`, `.sql`, `.kql` |
| **Infrastructure** | `.bicep`, `.tf` |

**Limits:** 10 MB per file · 50 MB total per message · 5 files per message

### Knowledge settings uploads

To persist documents for your agent to reference in future conversations, upload files through **Builder → Knowledge settings → Add file**. The system indexes uploaded files for semantic search.

| Category | Extensions |
|----------|-----------|
| **Images** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.bmp`, `.tiff`, `.tif` |
| **Documents** | `.txt`, `.md`, `.pdf`, `.docx`, `.pptx`, `.xlsx`, `.doc`, `.ppt`, `.xls` |
| **Data and configuration** | `.json`, `.csv`, `.log`, `.yaml`, `.yml`, `.xml`, `.ini`, `.conf`, `.cfg`, `.config`, `.properties` |

**Limits:** 16 MB per file · 100 MB per upload

#### Folder uploads

To upload all supported files at once, drag an entire folder onto the upload drop zone. This process includes files in nested subfolders. The portal automatically extracts every file from the folder hierarchy and filters out unsupported file types.

**How folder uploads work:**

1. The system extracts all files from nested subfolders into a flat list.
1. The system includes only files with supported extensions and silently filters unsupported types.
1. The system deduplicates files with duplicate names from different subfolders and keeps only the first file.
1. The system uploads and indexes each file individually for search.

> [!NOTE]
> Uploaded files appear as individual documents in Knowledge sources. The original folder hierarchy isn't maintained. A file at `runbooks/networking/dns-troubleshooting.md` appears as `dns-troubleshooting.md`.

Knowledge settings uploads accept legacy Office formats (`.doc`, `.ppt`, `.xls`) and additional image formats (`.bmp`, `.tiff`, `.tif`) that chat attachments don't. Chat attachments support code, scripts, infrastructure, and web formats that knowledge settings doesn't.

### Agent-generated documents

When your agent creates documents during conversations (by using the **Upload Knowledge Document** tool), it generates `.md` or `.txt` files and saves them directly to Knowledge settings. This process happens when you ask your agent to "save this as a runbook."

## Example: capturing incident knowledge

During an incident investigation, ask your agent:

```text
We just resolved the high CPU issue on web-app-prod. It was caused by a
memory leak in the connection pool. Create a troubleshooting guide from
what we learned and upload it to Knowledge settings.
```

Your agent generates a structured troubleshooting guide with:
- **Scoping steps**: How to identify the issue.
- **Quick mitigations**: Immediate actions to reduce impact.
- **Root cause analysis**: What to investigate.
- **Resolution steps**: The fix that worked.
- **Prevention**: How to avoid recurrence.

The next time a similar CPU issue occurs, your agent automatically references this document during investigation, turning one engineer's experience into shared team knowledge.

## What you need

| Requirement | Details |
|-------------|---------|
| Agent version | 26.1.57.0 or later |
| Knowledge settings | Enabled on your agent |
| Write permissions | Your agent needs write access to Knowledge settings |
| Run mode | Review or Autonomous. Write actions require approval in Review mode. |

## Limits

| Attribute | Chat attachments | Knowledge settings uploads | Agent tool |
|---|---|---|---|
| **Maximum file size** | 10 MB | 16 MB | 16 MB |
| **Maximum total** | 50 MB per message | 100 MB per upload | N/A |
| **Maximum files** | 5 per message | No limit (total size capped at 100 MB) | 1 per action |
| **Folder upload** | Not supported | ✓ Drag folders to upload all files at once | Not supported |
| **Supported extensions** | 31 | 28 | 2 (`.md`, `.txt`) |
| **Filename characters** | N/A | Letters, numbers, hyphens, underscores, dots | Same |
| **Maximum filename length** | N/A | 1,024 characters | Same |

## When to use something else

| Scenario | Better approach |
|----------|----------------|
| Connecting live wiki content that stays in sync | [ADO Wiki Knowledge](ado-connector.md) |
| Uploading binary files (PDF, Word, images) | Upload through **Builder → Knowledge settings → Add file** |
| Bulk importing many documents at once | Upload multiple files through **Builder → Knowledge settings → Add file** |
| Keeping code repositories up to date automatically | Connect a GitHub or ADO connector |

## Related capabilities

| Capability | What it adds |
|------------|--------------|
| [ADO wiki knowledge](ado-connector.md) | Connect live wiki content that updates automatically |
| [Root cause analysis](root-cause-analysis.md) | Investigate issues and capture the findings |
