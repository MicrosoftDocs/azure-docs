---
title: Subagents in Azure SRE Agent
description: Learn how subagents provide specialized domain expertise that you invoke on demand through the /agent command.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: subagents, specialized, delegation, multi-agent
#customer intent: As an SRE, I want to understand subagents so that I can create specialized agents for specific operational domains.
---

# Subagents in Azure SRE Agent
<!-- Video: Subagents__Specialist_AI_Team.mp4 — Replace with the hosted video URL using > [!VIDEO https://...] syntax -->

Subagents are specialist agents that you invoke on demand. Type `/agent` in chat, select your specialist, and ask your question. For example, you can invoke a database expert for SQL problems or a security auditor for threat investigation.

Unlike skills (which are always available), subagents require explicit invocation. This requirement scopes their expertise to specific tasks.

:::image type="content" source="media/sub-agents/portal-sub-agent-canvas-full.png" alt-text="Screenshot of subagent builder canvas showing subagents connected to triggers and tools." lightbox="media/sub-agents/portal-sub-agent-canvas-full.png":::

## How subagents work

Invoke a subagent by using the `/agent` slash command in chat. The subagent receives the full conversation context and works with focused expertise.

The following example shows a basic subagent definition:

```yaml
name: database_expert
system_prompt: |
  You are a database specialist. Analyze query performance,
  diagnose connection issues, and recommend optimizations.
handoff_description: Handles SQL and database troubleshooting
tools:
  - execute_kusto_query
  - azure_cli
connectors:
  - azure_sql
enable_skills: true  # Can use skills for additional expertise
agent_type: Review   # ReadOnly | Review | Autonomous
```

The key properties include:

- `system_prompt`: The expert persona and instructions.
- `handoff_description`: What the orchestrator sees when deciding to delegate.
- `tools`: Available capabilities.
- `enable_skills`: Lets this subagent access skills dynamically.
- `agent_type`: Controls actions (ReadOnly, Review, Autonomous).

> [!TIP]
> **Skills are automatic**: your agent uses them whenever relevant. **Subagents are explicit**: you invoke them by using `/agent` when you need focused expertise.

## Why use subagents

Subagents let you package domain expertise, tools, and knowledge for reuse. Instead of your main agent trying to handle everything, it delegates to specialists.

Consider a database issue: without subagents, your main agent tries generic troubleshooting. With a "Database Expert" subagent, you get focused SQL expertise, database-specific runbooks, and tools tuned for query analysis.

Subagents also enable **handoff chains**. Your incident triage subagent classifies an issue, and hands off to the appropriate domain expert. The domain expert investigates and hands off to a notification router. Each step is specialized.

## Create a subagent

Create subagents in **Builder > Subagent builder**.

1. Go to your Azure SRE Agent in the Azure portal.
1. Select the **Subagent builder** tab.
1. Select **Create**.
1. Select **Subagent**.
1. Provide values for the following settings:

    | Property | Value |
    |--|--|
    | Name | Enter a descriptive name for your subagent. |
    | Instructions | Provide clear, custom instructions that define how the subagent should behave. |
    | Handoff Description | Explain the scenarios when other subagents should transfer processing to this subagent, and why. |
    | Custom Tools (optional) | Choose one or more custom tools for the subagent to use during its operations. |
    | Built-in Tools (optional) | Select any built-in system tools you want the subagent to have access to. |
    | Handoff Agents (optional) | Specify which subagent should take over processing after this subagent completes its tasks. |

    Optionally, you can enable the *Knowledge base* feature. This option allows you to upload files that your subagent can use as reference material when answering queries.

## Knowledge base management

Enhance your subagents' knowledge by uploading documentation, runbooks, and procedural guides.

Examples of files you can add to your agent:

- **Architecture or system design**: Diagrams and documentation that explain system components and data flows.
- **Troubleshooting guides**: Step-by-step instructions to diagnose and resolve common or recurring issues.
- **Runbooks and SOPs**: Detailed workflows for routine operations, maintenance, and incident response.
- **Incident reports and postmortems**: Documentation of past outages, including root cause analysis and lessons learned.
- **Release notes and change logs**: Summaries of product or service updates, including new features, bug fixes, and changes.

### Supported file types

Operational procedures in Markdown (`.md`) or text (`.txt`) format.

### File management workflow

1. Access the knowledge base by going to the **Settings > Knowledge Base > Files** tab.
1. Upload files by dragging and dropping your files or browsing to select files (maximum 50 MB per file).
1. Organize content by adding tags and descriptions for better searchability.
1. Enable subagent access by configuring which subagents can access specific knowledge sources.
1. Monitor usage by tracking how subagents use uploaded knowledge in their responses.

> [!NOTE]
> Uploaded files are automatically indexed and made searchable by your subagents. The system supports up to 1,000 files per subagent instance.

## Subagent builder views

Build subagents in **Builder > Subagent builder**. The following views are available:

| View | Purpose |
|---|---|
| **Canvas view** | Visual diagram showing subagents, tools, and trigger connections |
| **Table view** | List of all subagents with quick access |
| **Test playground** | Interactive testing environment |

## When to use subagents

The following table helps you determine when subagents are the right choice:

| Scenario | Use subagent? | Why |
|---|---|---|
| **Deep domain expertise needed** | Yes | Package SQL expertise, networking knowledge, security best practices |
| **Multi-step workflows** | Yes | Incident triage, deployment validation, backup verification |
| **Specialized tool sets** | Yes | Database-specific tools, cost optimization tools |
| **Simple single operations** | No | Use skills instead for simple, repeatable actions |
| **Read-only queries** | No | Main agent can handle without delegation |

For complete subagent setup, see [Incident response](incident-response.md) for response automation.

## Subagent handoff

When your main agent hands off to a subagent, they share a **single conversation context**. The receiving subagent sees:

- **Full conversation history**: all previous messages, tool calls, and results
- **Subtask reasoning**: what the handoff is asking this subagent to accomplish
- **User's original question**: preserved throughout the handoff chain

> [!NOTE]
> Subagents don't get a "clean slate." They continue the same conversation thread. This approach enables handoff chains where each specialist builds on the previous agent's work.

After completing its work, the subagent hands off to the next agent or returns control to the orchestrator. The conversation context continues to accumulate throughout the chain.

## Subagent patterns

The following table describes common subagent patterns:

| Pattern | Example subagents | Use case |
|---|---|---|
| **Domain Expert** | VM Expert, AKS Expert, Network Expert | Deep expertise in one technology (all VM issues, Kubernetes troubleshooting, VNet/NSG/load balancer) |
| **Task Specialist** | Log Analyzer, Cost Optimizer, Security Scanner | Focused on specific tasks (parse logs, find savings, identify vulnerabilities) |
| **Workflow Executor** | Incident Triage, Deployment Validator, Backup Verifier | Multi-step procedures (classify incidents, post-deploy checks, test backup integrity) |

## Compare skills, subagents, and knowledge files

The following table compares each extensibility concept:

| Feature | Skills | Subagents | Knowledge files |
|---|---|---|---|
| **Access** | Automatic | `/agent` command | Via KB query tool |
| **Tools** | Can attach | Has tools | No tools |
| **Context** | Uses thread context | Shares thread context | Reference only |
| **Best for** | Procedures | Domain specialists | Runbooks, docs |

Use the following guidance to choose the right approach:

- **Skill**: Team-wide procedure with optional execution (AKS troubleshooting guide + Azure CLI)
- **Subagent**: Scoped specialist invoked on demand (PostgreSQL Expert)
- **Knowledge file**: Reference content for context (architecture docs)

## Connect subagents to triggers

Incidents or scheduled tasks can automatically trigger subagents. The canvas view shows these connections visually: triggers appear as nodes connected to subagents, tools are grouped with their parent subagent, and status badges show active or inactive state.

For setup details, see [Incident response](incident-response.md) for connecting subagents to incidents, or [Scheduled tasks](scheduled-tasks.md) for recurring automation.

## Subagent modes

Each subagent can operate in a different mode depending on the level of autonomy you want to grant.

| Mode | Description |
|---|---|
| **ReadOnly** | Can only query and analyze, no actions |
| **Review** | Proposes actions, waits for approval |
| **Autonomous** | Acts without human approval |

Set the mode based on the subagent's risk level:

- Log analysis? ReadOnly (safest)
- Cost optimization recommendations? Review (human approval required)
- Well-tested automation? Autonomous (for trusted operations)

## Test and develop subagents

Test subagents in the **Test playground** before deploying. Go to **Builder > Subagent builder** and select **Test playground** from the view toggle. The split-screen layout lets you edit instructions on the left and test in a live chat on the right, with AI-powered evaluation to score your configuration.

For VS Code users, the SRE Agent MCP server extension lets you edit subagent YAML in your editor with changes syncing to your agent.

:::image type="content" source="media/common/playground-agent-selected.png" alt-text="Screenshot of agent playground with split-screen editor and chat test panel.":::

For full details, see [Agent playground](agent-playground.md).

## Next step

> [!div class="nextstepaction"]
> [Learn about tools](./tools.md)

## Related content

- [Skills](skills.md)
- [Chat from your tools](chat-from-your-tools.md)
