---
title: Memory System in SRE Agent Preview
description: Use the SRE Agent memory system to build team knowledge that agents retrieve during incident handling, enabling context-aware responses that improve over time.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 01/17/2026
ms.topic: article
ms.service: azure-sre-agent
ms.collection: ce-skilling-ai-copilot
#customer intent: As an SRE team member, I want to understand how the memory system works so I can add knowledge that helps agents provide better responses during incident handling.
---

# Memory system in SRE Agent preview

The SRE Agent memory system gives agents the knowledge they need to troubleshoot effectively. By adding runbooks, team standards, and service-specific context, you help agents provide better answers during incidents. The system learns from each session to improve over time.

## Memory components

The memory system consists of four complementary components:

| Component | Purpose | Setup | Best for |
|-----------|---------|-------|----------|
| **User Memories** | Quick chat commands for team knowledge | Instant (chat commands) | Team standards, service configurations, workflow patterns |
| **Knowledge Base** | Direct document uploads for runbooks | Quick (file upload) | Static runbooks, troubleshooting guides, internal documentation |
| **Documentation connector** | Automated Azure DevOps synchronization | Configuration required | Living documentation, frequently updated guides |
| **Session insights** | Agent-generated memories from sessions | Automatic | Learned troubleshooting patterns, past incident resolutions |

### How agents retrieve memory

During conversations, agents retrieve information from memory sources through configured tools.

:::image type="content" source="media/memory-system/azure-sre-agent-memory-system-loop.png" alt-text="Diagram of the Azure SRE Agent memory system loop.":::

<!--
```mermaid
flowchart TD
    subgraph Trigger
        A[User Question / Incident / Scheduled Task]
    end
    
    subgraph Memory Sources
        B[User Memories<br/>chat commands]
        C[Knowledge Base<br/>documents]
        D[Documentation Connector<br/>ADO repos]
        E[Session Insights<br/>auto-generated]
    end
    
    subgraph Retrieval
        F[SearchMemory Tool]
    end
    
    A -- > B & C & D & E
    B & C & D & E -- > F
    F -- > G[Agent Reasoning]
    G -- > H[Relevant Context Retrieved]
    H -- > I[Agent Response]
```
-->

### Tool configuration

The `SearchMemory` tool retrieves all memory components. It searches across user memories, knowledge base, session insights, and documentation connector simultaneously.

- SRE Agent (default): `SearchMemory` is built in
- Custom subagents: Add `SearchMemory` tool to your configuration

> [!IMPORTANT]
> Don't store secrets, credentials, API keys, or sensitive data in any memory component. Your team shares memories, and the system indexes them for search.

### Enhanced search parameters

The `SearchNodes` tool supports filtering options for more targeted searches:

| Parameter | Type | Description |
|-----------|------|-------------|
| `entityType` | string | Filter results by entity type, such as `Incident`, `Service`, or `Resource`. |
| `includeNeighbors` | bool | Include connected nodes in the search results. |

**Example:**

```text
Search for all incidents related to "database timeout" and include connected resources
```

When you set `includeNeighbors` to `true`, the search returns not only matching incident nodes but also their connected:

- Resources
- Services
- Related incidents
- Linked documents

By showing the full relationship graph around matching nodes, you get richer context during investigations.

## Quick start

Begin by establishing foundational knowledge with user memories, and then expand to document storage and automated synchronization as your needs grow.

### 1. Start with user memories

Use chat commands to save immediate team knowledge:

```text
#remember Team owns services: app-service-prod, redis-cache-prod, and sql-db-prod

#remember For latency issues, check Redis cache health first

#remember Production deployments happen Tuesdays at 2 PM PST
```

These facts are now available across all conversations.

### 2. Upload key documents

Add critical runbooks and guides to the knowledge base:

1. Open your SRE Agent in the Azure portal.

1. Go to **Settings** > **Knowledge base**.

1. Select **Add file** or drag and drop files into the upload area.

1. Upload `.md` or `.txt` files (up to 16 MB each).

1. The system indexes files and makes them available for retrieval through `SearchMemory`.

### 3. Review session insights

After troubleshooting sessions, check **Settings** > **Session insights** to see what went well and where the agent needs more context. Use the insights to identify knowledge gaps and add targeted memories or documentation.

### 4. Connect repositories (optional)

For teams with existing documentation in Azure DevOps:

1. Go to **Settings** > **Connectors**.

1. Select **Add connector** and select **Documentation connector**.

1. Enter your Azure DevOps repository URL and select a managed identity.

    The connector starts indexing automatically.

## User memories

User memories let you save team facts, standards, and context that agents remember across all conversations. By using simple chat commands (`#remember`, `#forget`, `#retrieve`), you can build a persistent knowledge base that automatically enhances agent responses.

### Chat commands

#### Save information by using `#remember`

Save facts, standards, or context for future conversations.

**Syntax:**

```text
#remember [content to save]
```

**Examples:**

```text
#remember Team owns app-service-prod in East US region
#remember For app-service-prod latency issues, check Redis cache health first
#remember Team uses Kusto for logs. Workspace is "myteam-prod-logs"
```

The system embeds content by using OpenAI, stores it in Azure AI Search, and makes it available for automatic retrieval across all conversations. You see a confirmation: `✅ Agent Memory saved.`

#### Remove memories by using `#forget`

Delete previously saved memories by searching for them.

**Syntax:**

```text
#forget [description of what to forget]
```

**Examples:**

```text
#forget NSG rules information
#forget production environment location
```

The system semantically searches your memories for the best match, shows you the content, and deletes it. You see a confirmation: `✅ Agent Memory forgotten: [deleted content]`

#### Query memories by using `#retrieve`

Explicitly search and display saved memories without triggering agent reasoning.

**Syntax:**

```text
#retrieve [search query]
```

**Examples:**

```text
#retrieve production environment
#retrieve deployment process
```

The system semantically searches memories. It uses the top five matches to synthesize a response. Both the individual memories and the synthesized answer are displayed.

### Scope and storage

- **Shared across the team**: All users of the SRE Agent can access it.

- **Persist across all conversations**: Save it once, and it's available forever.

- **Automatically retrieved when relevant**: Agents search memories semantically during reasoning.

## Knowledge base

The knowledge base provides direct document upload capabilities for runbooks, troubleshooting guides, and internal documentation that agents can retrieve during conversations.

### Supported file types and limits

- **Formats**: `.md` (markdown, recommended), `.txt` (plain text)
- **Per file**: 16 MB maximum (Azure AI Search limit)
- **Per request**: 100 MB total for all files in a single upload

### Upload documents

1. Go to **Settings** > **Knowledge Base**.
1. Select **Add file** or drag and drop files into the upload area.

    The portal automatically validates, uploads, and indexes files.

### Upload via agent tool

The agent can upload documents directly to the knowledge base by using the `UploadKnowledgeDocument` tool. This method is useful when:

- You want to capture troubleshooting steps discovered during an investigation.
- You need to add runbooks generated from incident resolutions.
- You want to programmatically add documentation without UI access.

**Tool: UploadKnowledgeDocument**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fileName` | string | Yes | Filename with extension (for example, `runbook-database-issues.md`). Must be `.md` or `.txt`. |
| `content` | string | Yes | Full document content in plain text or Markdown format. |
| `triggerIndexing` | bool | No | Trigger immediate indexing (default: `true`). Set to `false` for batch uploads. |

**Example usage:**

Ask the agent:

> "Save our troubleshooting steps for the database timeout issue to the knowledge base"

The agent uses `UploadKnowledgeDocument` to:

1. Create a document with an appropriate filename.
1. Format the content in Markdown.
1. Upload the document to Azure Blob Storage.
1. Trigger indexing for immediate searchability.

**Constraints:**

- Maximum file size: 16 MB.
- Supported extensions: `.md` and `.txt` only.
- If a document with the same filename exists, the agent overwrites it.

**Error handling:**

| Error | Resolution |
|-------|------------|
| "Agent memory is disabled" | Enable agent memory in configuration. |
| "Invalid file extension" | Use `.md` or `.txt` extension only. |
| "Document content exceeds maximum size" | Split large documents into smaller files. |

### Manage documents

- **View**: Go to **Settings** > **Knowledge Base** to see all uploaded documents.

- **Update**: To overwrite the previous version, upload a file with the same name.

- **Delete**: Select documents and use the delete action. Changes take effect immediately.

## Session insights

As the agent handles your incidents, it learns. Session insights capture what worked, what didn't, and key learnings from each session. The agent automatically applies that knowledge to help with similar problems in the future.

### Automatic improvement

The agent learns from every session without any manual effort:

* The agent handles an issue autonomously or works with you directly.
* The agent captures symptoms, resolution steps, root cause, and pitfalls.
* These insights become searchable memories.
* Future sessions automatically retrieve relevant past insights.

The result: the agent gets better over time, suggesting proven resolutions and avoiding known pitfalls.

### Discover opportunities

While session insights work automatically, reviewing them can surface valuable patterns you might want to act on.

| Pattern you might discover | Potential action |
|---------------------------|------------------|
| Same issue keeps recurring | Fix the underlying code or configuration |
| Agent lacks context about your service | Create a custom subagent with domain knowledge |
| Troubleshooting steps aren't documented | Update or create a runbook |
| Telemetry gaps made diagnosis harder | Improve logging or add metrics |
| Alert triggered but wasn't actionable | Tune the alert or add runbook links |

Think of session insights as a window into what the agent learns. You might find something worth acting on, or you might just let the agent handle any surfaced problems.

### How it works

Session insights create a continuous improvement loop: the agent captures symptoms, steps, root cause, and pitfalls from each session, then retrieves relevant past insights when similar problems arise. This automatic cycle helps the agent resolve problems faster over time.

<!--
```mermaid
flowchart TD
    subgraph Loop["Automatic Learning Loop"]
        A["Issue arises<br/>Incident, alert, or question"] -- > B["Agent captures insight<br/>symptoms, steps, root cause,<br/>pitfalls, learnings"]
        B -- > C["Insight indexed<br/>Becomes searchable memory"]
        C -- > D["Future sessions benefit<br/>Agent retrieves relevant insights"]
        D -.- >|Similar issue arises| A
    end
    
    Loop -- > E["Automatic: Agent improves over time"]
    Loop -- > F["Optional: Review insights for<br/>code/telemetry/runbook opportunities"]
```
-->

:::image type="content" source="media/memory-system/azure-sre-agent-memory-system-loop.png" alt-text="Diagram of Azure SRE Agent memory system loop.":::

### What the agent captures

The agent captures series of data points from each session to improve future troubleshooting.

| Captured | How the agent uses it |
|----------|----------------------|
| **Symptoms observed** | Recognizes similar patterns in future problems |
| **Steps that worked** | Suggests proven resolution paths |
| **Root cause found** | Jumps to likely causes faster |
| **Pitfalls encountered** | Avoids repeating mistakes |
| **Context you provided** | Remembers facts about your environment |
| **Resources involved** | Connects past problems on same resources |

### When insights are generated

The system generates insights automatically after conversations finish, or you can request them on-demand.

- **Automatically**: After conversations finish (runs periodically, approximately every 30 minutes)
- **On-demand**: Select **Generate Session insights** in the chat footer for immediate results (about 30 seconds)

### Browse insights

Go to **Settings** > **Session insights** to see what the agent learned:

- **Total count** in the header
- **List of insights** with session title and timestamp
- **Detail view** with expandable Timeline and Agent Performance sections
- **Go to Thread** to revisit the original conversation

> [!NOTE]
> While periodic manual browsing of insights can surface recurring patterns worth addressing, the agent benefits from these insights whether you review them or not.

### Insight structure

Each insight includes:

- **Timeline**: Chronological milestones of the troubleshooting session (up to eight)
- **Agent Performance**: What went well, areas for improvement, and key learnings
- **Investigation quality score**: 1-5 rating for investigation completeness

## Related content

- [Documentation connector](./documentation-connector.md)