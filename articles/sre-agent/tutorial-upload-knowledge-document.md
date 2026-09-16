---
title: "Tutorial: Upload Knowledge Documents to Azure SRE Agent"
description: Upload knowledge documents to your Azure SRE Agent's Knowledge settings through conversation and the portal UI so the agent can reference them in future investigations.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge-base, upload, documents, runbooks, knowledge-management
#customer intent: As an SRE, I want to upload knowledge documents to my agent so that it can reference them during future investigations.
---

# Tutorial: Upload knowledge documents in Azure SRE Agent

In this tutorial, you upload knowledge documents to your Azure SRE Agent so it can reference them during future investigations. You learn how to save investigation results directly into Knowledge settings through chat and how to upload existing files through the portal UI.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Turn an investigation into a reusable runbook and save it to Knowledge settings
> - Verify that uploaded content is indexed and searchable
> - Upload individual files or folders through the portal
> - Test that your agent can retrieve the uploaded content in a new conversation

**Estimated time**: 10 minutes

## Prerequisites

- An Azure SRE Agent in **Running** state
- Write permissions on the agent
- Agent run mode set to **Review** or **Autonomous**

## Step 1: Start from an investigation

The best knowledge documents come from real investigations. Instead of creating content from scratch, capture what your agent already learned.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the left sidebar under **Chats**, find a previous investigation thread - any conversation where your agent diagnosed or resolved an issue - and select it.

If you don't have an investigation thread yet, start a new chat and ask your agent to investigate something:

```text
Investigate high memory usage on our container apps
```

Wait for the investigation to complete, and then continue with Step 2.

## Step 2: Ask your agent to create a runbook

In the same investigation thread, ask your agent to turn its findings into a runbook and save it to Knowledge settings. Be specific about the filename.

```text
Create a runbook from the investigation we just did. Include the root cause
analysis, the diagnostic steps, mitigations, and escalation triggers.
Save it to Knowledge settings as high-memory-runbook.md
```

Your agent:
1. Synthesizes the investigation context into a structured runbook.
1. Generates sections like Root Cause Analysis, Diagnostic Steps, Mitigations, and Escalation Triggers.
1. Saves the document to Knowledge settings and confirms the upload.

The agent confirms the document was saved and provides a download link. Your runbook is now stored in Knowledge settings and is indexed for search.

### Checkpoint

- Agent generated a structured runbook from the investigation.
- Agent confirmed the document was saved.

## Step 3: Verify in Knowledge settings

1. In the left sidebar, select **Builder** to expand the section.
1. Select **Knowledge settings**.

The **Knowledge settings** page displays your documents in a table with columns for **File Name**, **Status**, **Type**, and **Last modified**. The **Status** column shows **✓ Indexed** when the document is indexed and ready for search.

If the status shows **Pending**, select **Refresh**. Indexing typically completes within a few seconds.

### Checkpoint

- Navigated to **Builder → Knowledge settings**
- Document appears with **✓ Indexed** status

## Step 4: Upload files through the portal

You can upload individual files or entire folders directly. This method is useful for existing runbooks, documentation, or reference materials your team already has.

### Upload individual files

1. On the **Knowledge sources** page, select **Add file**.
1. Drag a file into the drop zone, or select **browse for files** to choose one.
1. Select **Add file** to upload.

### Upload a folder

You can also drag an entire folder - including nested subfolders - onto the drop zone.

1. On the **Knowledge sources** page, select **Add file**.
1. Drag a folder from your file manager directly onto the drop zone.
1. The portal extracts all supported files from the folder and its subfolders, then lists them in the dialog.
1. Review the file list - remove any files you don't want by selecting the delete icon next to each file.
1. Select **Add file** to upload all listed files.

The portal automatically filters out files with unsupported extensions. For the complete list of supported extensions and size limits, see the [Upload Knowledge Documents capability page](upload-knowledge-document.md).

Maximum file size is 16 MB per file, with up to 100 MB per upload.

> [!NOTE]
> When you upload a folder, the portal doesn't preserve the folder structure - files from subfolders appear as individual documents. If files in different subfolders share the same name, only the first file is uploaded.

### Checkpoint

- Selected **Add file** and saw the upload dialog.
- Uploaded a file or dragged a folder successfully.
- Files appear in **Knowledge sources** with **✓ Indexed** status.

## Step 5: Test retrieval in a new conversation

Start a new chat thread and ask a question that your uploaded documents should answer:

```text
What are the steps for troubleshooting high memory usage on container apps?
```

Your agent searches **Knowledge settings**, finds your uploaded runbook, and references it in the response. This process confirms the knowledge is indexed and retrievable.

### Checkpoint

- Started a new chat thread
- Asked a question related to the uploaded content
- Agent referenced the uploaded document in its response

## Delete a knowledge document

1. Go to **Builder** → **Knowledge settings**.
1. In the documents list, select one or more documents by using the checkboxes.
1. Select **Delete** in the toolbar.
1. A confirmation dialog lists the documents to remove. Select **Delete** to confirm.

When you delete documents, you remove them from the agent's Knowledge settings and they no longer appear in search results.

> [!NOTE]
> You can't edit knowledge documents in place. To update a document, upload a new version with the same filename. The new version replaces the previous version.

## What you learned

- Your agent can turn real investigations into structured runbooks and save them to Knowledge settings.
- You can upload files manually through the portal UI in **Builder → Knowledge settings**. It supports many formats, including PDF, Office documents, and images.
- The system indexes uploaded documents for semantic search, and they're available in all future conversations.
- To update documents, upload them by using the same filename.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "Agent memory is disabled. Cannot upload documents." | Knowledge settings aren't enabled on your agent | Contact your administrator to enable Knowledge settings |
| "I don't have write access to your Knowledge settings" | Agent couldn't locate the upload tool | Rephrase your request: "Save it to Knowledge settings as filename.md" |
| "Invalid file extension. Only .md and .txt files are allowed." | Filename doesn't end in `.md` or `.txt` (chat upload) | Use a `.md` or `.txt` extension when asking the agent to save |
| "Document content exceeds maximum size of 16MB" | Content too large for a single document | Split into multiple smaller documents |
| "File name cannot be empty" | No filename provided | Include a filename in your prompt (e.g., `runbook.md`) |

## Related

| Resource | What you learn |
|----------|-------------------|
| [Upload knowledge documents](upload-knowledge-document.md) | How this works and why it matters |
| [Create a Skill](create-skill.md) | Build procedural skills that complement knowledge documents |
| [Skills](skills.md) | How skills and knowledge work together |
| [ADO wiki Knowledge](ado-connector.md) | Connect live wiki content as a knowledge source |
