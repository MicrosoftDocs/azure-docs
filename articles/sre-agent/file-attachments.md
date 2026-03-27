---
title: File attachments in Azure SRE Agent
description: Share screenshots, logs, config files, and code directly in chat for AI-powered multimodal analysis in Azure SRE Agent.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to attach files to my agent chat so that I can share visual and textual context during incident triage without leaving the conversation.
---

# File attachments in Azure SRE Agent

By using file attachments, you can share screenshots, log files, configuration files, and documents directly in your Azure SRE Agent chat. The agent automatically applies the right analysis based on file type: multimodal vision for images, workspace tools for text and code, and Python for binary documents.

> [!TIP]
> - Drag and drop files, use the file picker, or paste clipboard screenshots directly into chat.
> - The agent automatically applies the right analysis: multimodal vision for images, workspace tools for text and code, and Python for binary documents.
> - Supports images, text, data files, and documents (31 file types total).
> - Up to five files per message, 10 MB each, 50 MB total per message.

## The problem

During incident triage, SREs need to share visual context with the agent including a Grafana dashboard showing a latency spike, an error screenshot from the Azure portal, or a log file with the relevant stack trace. With text-only chat, users must describe what they see or copy and paste raw text, losing the visual context that often holds the diagnostic insight.

Configuration review has the same friction. When you ask the agent to review a Kubernetes manifest or Bicep template, you copy and paste the file contents into chat, losing syntax context and file metadata. Log files get truncated. Binary documents like incident postmortem PDFs can't be shared at all.

## How it works

You can attach files to your chat messages by using three methods: the file picker, drag and drop, or clipboard paste.

### File picker

Select the **+** (plus) button next to the message input and select **Attach file**. A system file dialog opens where you can select one or more files.

:::image type="content" source="media/file-attachments/file-attach-plus-menu.png" alt-text="Screenshot of the plus menu showing the Attach file option with a paperclip icon at the bottom of the menu." lightbox="media/file-attachments/file-attach-plus-menu.png":::

### Drag and drop

Drag files from your desktop or file manager onto the chat area. A semi-transparent overlay with an upload arrow appears to confirm the drop target.

### Clipboard paste

Copy a screenshot to your clipboard (Cmd+Shift+4 on macOS, Win+Shift+S on Windows), and then paste (Cmd+V or Ctrl+V) in the chat input. The pasted image attaches automatically. Regular text paste works normally and isn't intercepted.

### Attached file previews

Attached files appear as pills below the message input, showing the file name, size, and a thumbnail preview for images. Remove individual files before sending by selecting the **X** button on each pill.

:::image type="content" source="media/file-attachments/file-attach-pill.png" alt-text="Screenshot of a file attachment pill showing a document icon, file name grubify-runbook.md, file size 1.9 KB, and remove button." lightbox="media/file-attachments/file-attach-pill.png":::

### How the agent processes different file types

The agent automatically determines how to process each file based on its type.

| File type | How the agent processes it | Example use case |
|---|---|---|
| Images (.png, .jpg, .jpeg, .gif, .webp, .svg) | Sent directly to the LLM for multimodal vision analysis | Screenshot of an error dashboard, architecture diagram |
| Text and code (.txt, .md, .json, .csv, .log, .yaml, .yml, .xml) | Saved to the agent workspace and read with file tools | Log file analysis, config file review, query results |
| Binary documents (.pdf, .docx, .pptx) | Saved to workspace and parsed using Python tools | Incident postmortem PDF, runbook document |

Sent messages display file cards with the file name, size, and a download link so you can retrieve uploaded files later in the thread.

:::image type="content" source="media/file-attachments/file-attach-runbook-analysis.png" alt-text="Screenshot of a chat message showing an uploaded runbook file with the agent reading all 58 lines and providing structured troubleshooting based on the runbook content." lightbox="media/file-attachments/file-attach-runbook-analysis.png":::

## What makes this approach different

File attachments provide capabilities that set them apart from text-only interactions.

- **Automatic file type detection.** Drop any supported file and the agent determines the right processing approach—vision for images, file tools for text, Python for binary documents. No manual selection needed.

- **Native clipboard integration.** During incident response, speed matters. Screenshot a dashboard, paste into chat, and ask "what do you see?" The entire round trip takes seconds.

- **Workspace persistence.** The agent workspace saves uploaded files for the duration of the thread. The agent can reference them across multiple messages, run tools against them, and you can download them from the chat history. To save a file permanently to knowledge settings (where it's indexed and searchable across all threads) ask your agent: *"Save this to knowledge settings as [filename].md"*

## Before and after

The following table compares common workflows with and without file attachments.

| Scenario | Before | After |
|---|---|---|
| **Sharing a screenshot** | Describe the chart verbally or paste a URL | Drop the screenshot into chat—agent analyzes it visually |
| **Reviewing a log file** | Copy and paste text, lose formatting | Upload the .log file—agent parses it with tools |
| **Config file review** | Copy and paste YAML/JSON into chat | Upload the file—agent reads it with full context |
| **Runbook reference** | Recall steps from memory during incidents | Upload runbook—agent follows and applies it to the situation |
| **Binary documents** | Can't share PDFs or Office docs | Upload directly—agent uses Python to extract content |

## Get started

All agents support file attachments. New agents you create through the setup wizard have this capability enabled by default.

## Related content

- [Tools overview](tools.md)
- [Deep investigation](deep-investigation.md)
- [Python tools](python-code-execution.md)
