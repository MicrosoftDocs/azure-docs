---
title: "Tutorial: Upload Knowledge Documents to Azure SRE Agent"
description: Upload knowledge documents to your Azure SRE Agent's Knowledge settings through conversation and the portal UI so the agent can reference them in future investigations.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge-base, upload, documents, runbooks, knowledge-management
#customer intent: As an SRE, I want to upload knowledge documents to my agent so that it can reference them during future investigations.
---

# Tutorial: Upload knowledge documents to Azure SRE Agent
In this tutorial, you upload knowledge documents to your Azure SRE Agent's Knowledge settings by using two methods: asking the agent to create a runbook from an investigation and uploading a file through the portal UI.

Your agent can capture knowledge discovered during investigations and store it for future use, so it automatically builds institutional knowledge. For more information, see [Upload knowledge documents](upload-knowledge-document.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Turn an investigation into a structured runbook and save it to Knowledge settings
> - Upload a file manually through the portal UI
> - Verify that uploaded documents are indexed and available
> - Confirm that the agent retrieves uploaded knowledge in new conversations

**Estimated time**: 15 minutes

## Prerequisites

Before you begin, make sure you have the following resources and permissions:

- An Azure SRE Agent in **Running** state.
- Write permissions on the agent.
- Agent run mode set to **Review** or **Autonomous**.

## Start from an investigation

The best knowledge documents come from real investigations. Instead of creating content from scratch, capture what your agent already learned.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the left sidebar under **Chats**, find a previous investigation thread where your agent diagnosed or resolved an issue, and select it.

If you don't have an investigation thread yet, start a new chat and ask your agent to investigate something:

```text
Investigate high memory usage on our container apps
```

Wait for the investigation to complete, and then continue with the next step.

## Create a runbook from the investigation

In the same investigation thread, ask your agent to turn its findings into a runbook and save it to Knowledge settings. Be specific about the filename.

```text
Create a runbook from the investigation we just did. Include the root cause
analysis, the diagnostic steps, mitigations, and escalation triggers.
Save it to Knowledge settings as high-memory-runbook.md
```

Your agent performs the following actions:

1. Synthesizes the investigation context into a structured runbook.
1. Generates sections like Root Cause Analysis, Diagnostic Steps, Mitigations, and Escalation Triggers.
1. Saves the document to Knowledge settings and confirms the upload.

The agent confirms the document was saved and provides a download link. Your runbook is now stored in Knowledge settings and is indexed for search.

At this point, confirm the following information:

- The agent generated a structured runbook from the investigation.
- The agent confirmed the document was saved.

## Verify in Knowledge settings

Go to **Knowledge settings** to confirm your document is indexed.

1. In the left sidebar, select **Builder** to expand the section.
1. Select **Knowledge settings**.

The **Knowledge settings** page displays your documents in a table with columns for **File Name**, **Status**, **Type**, and **Last modified**. The **Status** column shows **Indexed** when the document is indexed and ready for search.

:::image type="content" source="media/tutorial-upload-knowledge-document/knowledge-base-page.png" alt-text="Screenshot of Knowledge settings page showing uploaded files with Indexed status, columns for File Name, Status, Type, and Last modified.":::

If the status shows **Pending**, select **Refresh**. Indexing typically finishes within a few seconds.

## Upload a file through the portal

You can also upload files directly. This method is useful for existing runbooks, documentation, or reference materials your team already has.

1. On the **Knowledge settings** page, select **Add file**.
1. Drag a file into the drop zone, or select **browse for files** to choose one.
1. Select **Add file** to upload.

:::image type="content" source="media/tutorial-upload-knowledge-document/step-04-upload-dialog-empty.png" alt-text="Upload dialog showing a drag-and-drop zone with supported file formats and 100-MB maximum size.":::

The portal accepts many file types for **Knowledge settings**, including text files, documents, and images. For the complete list of supported extensions and size limits, see [Upload knowledge documents](upload-knowledge-document.md).

Maximum file size is 16 MB per file, with up to 100 MB per upload.

## Test retrieval in a new conversation

Confirm that the agent can find and use the uploaded documents.

1. Select **New chat thread** in the sidebar.
1. Ask a question that your uploaded documents should answer.

For example:

```text
What are the steps for troubleshooting high memory usage on container apps?
```

Your agent searches **Knowledge settings**, finds your uploaded runbook, and references it in the response. This confirmation shows the knowledge is indexed and retrievable.

## Delete a knowledge document

To remove a document from **Knowledge settings**, use the following steps.

1. Go to **Builder** > **Knowledge settings**.
1. In the documents list, select one or more documents by using the checkboxes.
1. Select **Delete** in the toolbar.
1. A confirmation dialog lists the documents to remove. Select **Delete** to confirm.

Deleted documents are removed from the agent's **Knowledge settings** and no longer appear in search results.

> [!NOTE]
> You can't edit knowledge documents in place. To update a document, upload a new version with the same filename to replace the previous version.

## Troubleshooting

Use the following table to resolve common issues with knowledge document uploads.

| Error | Cause | Fix |
|---|---|---|
| "Agent memory is disabled. Can't upload documents." | Knowledge settings aren't enabled on your agent. | Contact your administrator to enable Knowledge settings. |
| "I don't have write access to your Knowledge settings" | Agent can't locate the upload tool. | Rephrase your request: "Save it to Knowledge settings as filename.md" |
| "Invalid file extension. Only .md and .txt files are allowed." | Filename doesn't end in `.md` or `.txt` (chat upload). | Use a `.md` or `.txt` extension when asking the agent to save. |
| "Document content exceeds maximum size of 16MB" | Content is too large for a single document. | Split into multiple smaller documents. |
| "File name can't be empty" | No filename provided. | Include a filename in your prompt (for example, `runbook.md`). |

## Related content

| Resource | Description |
|----------|-------------|
| [Upload knowledge documents](upload-knowledge-document.md) | How uploading knowledge documents works and why it matters. |
| [Skills](skills.md) | How skills and knowledge work together. |
| [Azure DevOps Repos connector](azure-devops-connector.md) | Connect live wiki content as a knowledge source. |
