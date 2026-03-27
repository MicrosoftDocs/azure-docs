---
title: "Tutorial: Share files and screenshots in Azure SRE Agent"
description: Learn how to share screenshots, logs, and runbooks with your Azure SRE Agent using the file picker, drag and drop, and clipboard paste.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to share files and screenshots with my agent so that I can provide visual and textual context during incident triage without leaving the conversation.
---

# Tutorial: Share files and screenshots in Azure SRE Agent

In this tutorial, you share files and screenshots with your Azure SRE Agent using three upload methods: the file picker, drag and drop, and clipboard paste. You also ask the agent to analyze uploaded content so you can see how it handles different file types.

For more information about how the agent processes different file types, see [File attachments](file-attachments.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Attach a file using the file picker
> - Ask the agent to analyze an uploaded file
> - Drag and drop a file into chat
> - Paste a screenshot from your clipboard

**Estimated time**: 5 minutes

## Prerequisites

Before you begin, make sure you have the following resources:

- An Azure SRE Agent in **Running** state.
- A test image file (any screenshot or PNG/JPG).
- A test text file (`.txt`, `.md`, `.json`, or `.log`).

## Attach a file using the file picker

Use the file picker to select a file from your local machine and attach it to a chat message.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. Select **New chat thread** in the left sidebar.
1. Select the **+** (plus) button next to the message input.
1. Select **Attach file** from the menu.
1. In the file dialog, choose a text file, such as a runbook, config file, or log file.

The file appears as a pill below the message input, showing a document icon, the file name, and size.

:::image type="content" source="media/file-attachments/file-attach-pill.png" alt-text="Screenshot of a file attachment pill showing a document icon, file name, file size, and remove button below the chat input." lightbox="media/file-attachments/file-attach-pill.png":::

At this point, confirm the following settings:

- The attachment pill appears with the file name and size.
- An **X** button lets you remove the file before sending.

## Ask the agent to analyze the file

After you attach a file, ask the agent a question about the file content. The agent reads the file and provides analysis based on the file type.

1. With the file attached, type a question about the file. For example, if you uploaded a runbook:

   ```text
   I uploaded our production runbook. If I see 500 errors with "Connection refused to database", what should I do?
   ```

1. Select **Send**.

Your message appears with a file card showing the file name, size, and a download arrow. The agent reads the file, identifies the relevant section, and responds with structured guidance.

:::image type="content" source="media/file-attachments/file-attach-runbook-analysis.png" alt-text="Screenshot of a chat message showing an uploaded runbook file with the agent reading the file content and providing step-by-step troubleshooting based on the runbook." lightbox="media/file-attachments/file-attach-runbook-analysis.png":::

At this point, confirm the following items:

- The agent references specific content from your file.
- For a runbook, the agent identifies the matching incident and walks through the mitigation steps.
- For a log file, the agent identifies errors and patterns.

## Drag and drop a file

Drag and drop provides a quick way to attach files without navigating the file picker.

1. Find a file on your desktop. A `.json`, `.yaml`, or `.log` file works well.
1. Drag the file onto the chat area.

   A semi-transparent overlay appears with an upload arrow icon, confirming the drop target.

1. Release the file. The overlay disappears and an attachment pill appears.
1. Type your question and select **Send**.

At this point, confirm the following state:

- The agent reads the file and provides relevant analysis.

## Paste a screenshot from your clipboard

During incident response, you can paste a screenshot directly from your clipboard. The agent uses multimodal vision to analyze the image content.

1. Take a screenshot on your machine:
   - **macOS:** Cmd+Shift+4, then select an area.
   - **Windows:** Win+Shift+S, then select an area.
1. Select the chat message input.
1. Paste with **Cmd+V** (macOS) or **Ctrl+V** (Windows).

   The screenshot appears as an attachment pill.

1. Type a question like the following example and select **Send**:

   ```text
   What do you see in this screenshot?
   ```

At this point, confirm the following items:

- The agent describes the contents of your screenshot using multimodal vision analysis.
- The agent can identify charts, error messages, UI elements, and text in images.

> [!NOTE]
> Clipboard paste only captures images. When you paste text from a text editor, the text is entered directly in the chat input and isn't attached as a file.

## Verify

After you complete all the steps, confirm the following conditions:

- You uploaded a file using the file picker and the agent analyzed its contents.
- You dragged and dropped a file into the chat and the agent responded with relevant analysis.
- You pasted a clipboard screenshot and the agent described the image contents.
- Uploaded files persist in the thread and can be downloaded from sent messages.

> [!TIP]
> To save an attached file permanently, ask your agent: *"Save this to knowledge settings."* This command stores a copy in the knowledge base where it's indexed and searchable across all future conversations. For more information, see [Upload knowledge documents](upload-knowledge-document.md).

## Next step

> [!div class="nextstepaction"]
> [Learn about file attachments](./file-attachments.md)

## Related content

- [File attachments](file-attachments.md)
- [Upload knowledge documents](upload-knowledge-document.md)
- [Memory and knowledge](memory.md)
