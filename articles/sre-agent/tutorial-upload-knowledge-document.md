---
title: "Tutorial: Upload Knowledge Documents to Azure SRE Agent"
description: Upload knowledge documents to your Azure SRE Agent knowledge base through conversation and the portal UI so the agent can reference them in future investigations.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge-base, upload, documents, runbooks, knowledge-management
#customer intent: As an SRE, I want to upload knowledge documents to my agent so that it can reference them during future investigations.
---

# Tutorial: Upload knowledge documents to Azure SRE Agent
In this tutorial, you upload knowledge documents to your Azure SRE Agent's knowledge base using two methods: by asking the agent to create a runbook from an investigation, and by uploading a file through the portal UI.

Your agent can capture knowledge discovered during investigations and store it for future use, building institutional knowledge automatically. For more information, see [Upload knowledge documents](upload-knowledge-document.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Turn an investigation into a structured runbook and save it to the knowledge base
> - Upload a file manually through the portal UI
> - Verify that uploaded documents are indexed and available
> - Confirm that the agent retrieves uploaded knowledge in new conversations

**Estimated time**: 15 minutes

## Prerequisites

Before you begin, make sure you have the following:

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

Wait for the investigation to complete, then continue with the next step.

## Create a runbook from the investigation

In the same investigation thread, ask your agent to turn its findings into a runbook and save it to the knowledge base. Be specific about the filename.

```text
Create a runbook from the investigation we just did. Include the root cause
analysis, the diagnostic steps, mitigations, and escalation triggers.
Save it to the knowledge base as high-memory-runbook.md
```

Your agent performs the following actions:

1. Synthesizes the investigation context into a structured runbook.
1. Generates sections like Root Cause Analysis, Diagnostic Steps, Mitigations, and Escalation Triggers.
1. Saves the document to the knowledge base and confirms the upload.

:::image type="content" source="media/tutorial-upload-knowledge-document/step-02-runbook-saved.png" alt-text="Agent confirming the runbook was saved to the knowledge base as java-app-high-memory-runbook.md.":::

The agent confirms the document was saved and provides a download link. Your runbook is now stored in the knowledge base and will be indexed for search.

> [!TIP]
> Specify a filename with a `.md` or `.txt` extension. This controls how the document is named in the knowledge base and makes it easy to find later.

> [!NOTE]
> If your agent is in **Review** mode, it asks for your approval before executing the upload. Select **Approve** to proceed.

At this point, confirm the following:

- The agent generated a structured runbook from the investigation.
- The agent confirmed the document was saved.

## Verify the document in the knowledge base

Navigate to the knowledge base to confirm your document was indexed.

1. In the left sidebar, select **Builder** to expand the section.
1. Select **Knowledge base**.

The knowledge base page displays your documents in a table with columns for **File Name**, **Status**, **Type**, and **Last modified**. The **Status** column shows **Indexed** when the document is indexed and ready for search.

:::image type="content" source="media/tutorial-upload-knowledge-document/knowledge-base-page.png" alt-text="Knowledge base page showing uploaded files with Indexed status, columns for File Name, Status, Type, and Last modified.":::

If the status shows **Pending**, select **Refresh**. Indexing typically completes within a few seconds.

## Upload a file through the portal

You can also upload files directly. This method is useful for existing runbooks, documentation, or reference materials your team already has.

1. On the **Knowledge base** page, select **Add file**.
1. Drag a file into the drop zone, or select **browse for files** to choose one.
1. Select **Add a file** to upload.

:::image type="content" source="media/tutorial-upload-knowledge-document/step-04-upload-dialog-empty.png" alt-text="Upload dialog showing a drag-and-drop zone with supported file formats and 100-MB maximum size.":::

The portal accepts the following file types:

- **Text**: `.md`, `.txt`, `.csv`, `.json`, `.xml`, `.yaml`, `.yml`, `.log`, `.ini`, `.cfg`, `.conf`, `.config`, `.properties`
- **Documents**: `.pdf`, `.docx`, `.pptx`, `.xlsx`, `.doc`, `.ppt`, `.xls`
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.webp`, `.tiff`, `.tif`

Maximum file size is 16 MB per file, with up to 100 MB per upload.

## Test retrieval in a new conversation

Confirm that the agent can find and use the uploaded documents.

1. Select **New chat thread** in the sidebar.
1. Ask a question that your uploaded documents should answer.

For example:

```text
What are the steps for troubleshooting high memory usage on container apps?
```

Your agent searches the knowledge base, finds your uploaded runbook, and references it in the response. This confirms the knowledge is indexed and retrievable.

## Capture knowledge after incidents

After resolving any issue, ask your agent to preserve what it learned:

```text
Create a runbook from the steps we just used to resolve this incident.
Include the root cause, investigation steps, and the fix.
Save it as incident-12345-resolution.md in the knowledge base.
```

Over time, this builds a searchable library of institutional knowledge. Every past incident becomes a resource for future ones.

### Update existing documents

Upload a document with the same filename to replace the previous version:

```text
Update the high-memory-runbook.md document in the knowledge base.
Add a new section about container memory limits as a common cause.
```

### Batch uploads via CLI

Import multiple documents at once using the CLI:

```bash
# Upload a single file
srectl doc upload --file ./runbooks/high-memory-guide.md

# Upload all .md and .txt files in a folder (recursive)
srectl doc upload --file ./runbooks
```

## Troubleshooting

Use the following table to resolve common issues with knowledge document uploads.

| Error | Cause | Fix |
|---|---|---|
| "Agent memory is disabled. Cannot upload documents." | Knowledge base isn't enabled on your agent. | Contact your administrator to enable the knowledge base. |
| "I don't have write access to your knowledge base" | Agent couldn't locate the upload tool. | Rephrase your request: "Save it to the knowledge base as filename.md" |
| "Invalid file extension. Only .md and .txt files are allowed." | Filename doesn't end in `.md` or `.txt` (chat upload). | Use a `.md` or `.txt` extension when asking the agent to save. |
| "Document content exceeds maximum size of 16MB" | Content too large for a single document. | Split into multiple smaller documents. |
| "File name cannot be empty" | No filename provided. | Include a filename in your prompt (for example, `runbook.md`). |

## Next step

> [!div class="nextstepaction"]
> [Learn about memory and knowledge](./memory.md)

## Related content

- [Upload knowledge documents (capability)](upload-knowledge-document.md)
- [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md)
- [Memory and knowledge](memory.md)
