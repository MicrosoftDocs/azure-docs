---
title: "Step 2: Add Your Team's Knowledge to Azure SRE Agent"
description: Upload runbooks and documentation so your agent uses your team's procedures instead of generic advice.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/06/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: knowledge base, runbooks, documentation, upload, getting started
#customer intent: As a site reliability engineer, I want to upload my team's documentation to my agent so that it provides relevant, team-specific answers during investigations.
---

# Step 2: Add your team's knowledge to Azure SRE Agent
**Estimated time**: 5 minutes

Upload your runbooks and documentation so your agent uses your team's procedures, not generic advice.

## What you accomplish

By the end of this step, your agent:

- Uses your runbooks when troubleshooting
- References your documentation in responses
- Shows **Sources** to prove which document it used

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create your agent](create-agent.md) first. |
| **Documentation files** | Runbooks, playbooks, or troubleshooting guides (`.md`, `.txt`). |

> [!NOTE]
> This step covers **file uploads**, which is the fastest way to add knowledge. Your agent can also reference documentation from **Azure DevOps repositories** and **GitHub repositories** through connectors (see **Builder** > **Connectors**), and non-Microsoft data sources through [MCP connectors](chat-from-your-tools.md).

## Open the knowledge base

Go to the knowledge base in the agent portal.

1. Select **Builder** in the left sidebar.
1. Select **Knowledge base**.

An empty state appears that prompts you to add a knowledge source.

## Upload your files

Add your first documentation files to the knowledge base.

1. Select **Add file**.
1. Select your documentation files, such as runbooks, escalation procedures, and query references.
1. Wait for indexing to complete (usually instant).

| Supported formats | Maximum size |
|---|---|
| Markdown (`.md`), Text (`.txt`) | 16 MB per file, 100 MB per upload |

> [!TIP]
> Upload your most-used runbooks first. You can always add more later. If you don't have runbooks yet, your agent can [create them for you during conversations](upload-knowledge-document.md). It turns investigation findings into documented procedures automatically.

## Verify the knowledge base

Confirm your agent can access the uploaded documentation.

Ask your agent about something in your uploaded file:

```text
What runbooks or procedures do you have in your knowledge base?
```

You should see the following results:

1. A "Searching your knowledge base..." indicator.
1. **Sources** showing your uploaded file name.
1. Content from your document, not generic examples.

:::image type="content" source="media/first-value/knowledge-base-queries-view.png" alt-text="Agent response showing sources from the knowledge base.":::

### Understand the difference

Without a knowledge base, the agent responds with generic answers:

> "I don't have specific information about your team's procedures..."

With your knowledge base, the agent references your documented procedures:

> "Based on your knowledge base, I found the following procedures..."

## Recommended documents

The following table lists common document types to upload and the value they provide.

| Document type | Example | Value |
|---|---|---|
| Troubleshooting guides | `http-500-errors.md` | First response steps |
| Query references | `loki-queries.md` | Team's proven queries |
| Escalation paths | `on-call.md` | Who to contact |
| Runbooks | `deployment-rollback.md` | Step-by-step procedures |

## Next step

> [!div class="nextstepaction"]
> [Step 3: Connect source code](./connect-source-code.md)

## Related content

- [Upload knowledge documents](upload-knowledge-document.md)
- [Azure DevOps Wiki knowledge](azure-devops-wiki-knowledge.md)
- [Memory and knowledge](memory.md)
- [Connectors](connectors.md)
- [Tutorial: Set up an Azure DevOps connector](azure-devops-connector.md)
