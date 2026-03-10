---
title: Execute Mitigations in Azure SRE Agent
description: Learn how your agent diagnoses issues and fixes them by restarting services, scaling resources, hardening security settings, and collecting diagnostics with the level of control you choose.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/04/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: mitigation, remediation, actions, restart, scale, security-hardening, memory-dump
#customer intent: As an SRE, I want my agent to execute mitigations so that I can resolve incidents faster without manually navigating the Azure portal.
---

# Execute mitigations in Azure SRE Agent
Your agent diagnoses problems and fixes them. It restarts services, scales resources, hardens security settings, and collects diagnostics, all with the level of control you choose.

> [!VIDEO <VIDEO_URL>/Azure_SRE_Agent__Verified_Fix.mp4]

> [!TIP]
> - Ask your agent to fix a problem. It proposes a solution, you approve it, and it executes the fix.
> - Full audit trail: who triggered it, what changed, and whether it worked.
> - Choose your level of trust: Review mode (approve each action) or Autonomous mode (agent handles it).

## The problem: diagnosis without action wastes time

You identified the problem. Now what? You go to the Azure portal, find the right blade, confirm the resource, click through confirmation dialogs, wait for the operation to complete, and then verify it worked. The investigation took five minutes. The fix takes another ten.

This friction exists across your operational workflows:

- **Daily operations**: Scale resources for expected load, restart services during maintenance windows.
- **Compliance checks**: Harden security settings across dozens of storage accounts.
- **On-call response**: Execute well-known fixes quickly so engineers can get back to sleep.
- **Proactive optimization**: Adjust SKUs based on usage patterns before problems occur.

## How your agent closes the loop

When your agent identifies an issue, it doesn't stop at telling you what's wrong. It proposes a specific remediation action and, depending on your [run mode](run-modes.md), either waits for your approval or executes the action immediately.

The agent follows a consistent pattern: **diagnose → identify action → check permissions → execute (or propose) → verify the fix worked**. Every action is logged with who triggered it, what changed, why, and whether it succeeded.

:::image type="content" source="media/execute-mitigations/notification-paths.svg" alt-text="Diagram that shows agent response paths: execute fix, create work item, or send notification.":::

After investigating, your agent can take direct action, create tracking items, or notify your team — each with full context.

## What makes this different from scripts

Scripts are rigid. They run the same action regardless of context. Your agent reasons about the situation first. It considers what it found during investigation, what it remembers from past incidents, and what your [skills](skills.md) and [knowledge base](memory.md) recommend. The same symptom might lead to a restart in one case and a scale-up in another, because the agent adapts based on evidence.

[Run modes](run-modes.md) give you graduated trust. Start in **Review** mode where the agent proposes and you approve. Move to **Autonomous** when you're confident in the pattern. Use **ReadOnly** for monitoring-only agents that never take action.

## What your agent can do

Your agent can execute any Azure action through Azure CLI commands. If you can run it in `az`, your agent can run it too. This capability includes managing any resource type, modifying configurations, creating resources, and running any Azure operation.

| Command type | What it enables |
|---|---|
| **Read commands** | Query any Azure resource - `az webapp list`, `az containerapp show`, `az vm list`, `az network vnet show`. Runs immediately, no approval needed. |
| **Write commands** | Modify any Azure resource: `az webapp restart`, `az containerapp update`, `az vm resize`, `az role assignment create`. Requires approval in Review mode. |

The agent's actions are constrained only by the permissions assigned to its managed identity. If you grant Contributor on a resource group, your agent can manage everything in that group. If you grant a custom role with specific actions, your agent is limited to those actions.

### Safety guardrails

The agent enforces safety constraints at the command level.

- **Delete operations blocked** — The agent never runs `delete` and `remove` commands. It returns an error that directs users to the Azure portal for deletions.
- **Key Vault commands blocked** — The agent blocks all `az keyvault` commands to prevent credential exposure.
- **Management locks respected** — Before modifying any resource, the agent checks for Azure management locks. Resources with ReadOnly locks can't be modified.
- **Subscription validation** — The agent validates subscription IDs in commands for correct GUID format before execution.

## Before and after

The following table compares the manual mitigation process with the agent-assisted approach.

|  | Before | After |
|---|---|---|
| **Fix execution** | Navigate to Azure portal, find resource, click through blades | Ask agent, approve, done |
| **Verification** | Manually check if fix worked | Agent verifies and reports result |
| **Audit** | Hope someone documented what they did | Full audit trail in Application Insights |
| **Knowledge** | One engineer knows the fix | Agent applies learned patterns consistently |

## Permission requirements

By default, agents have **Reader** access and can't take actions. You explicitly grant write permissions by assigning roles to your agent's managed identity.

| Scope | What the agent can act on | Recommended for |
|---|---|---|
| **Resource** | A single resource only | Maximum restriction, start here |
| **Resource Group** | All resources in one group | Production workloads |
| **Subscription** | Any resource in the subscription | Development and testing only |

> [!WARNING]
> The agent checks Azure management locks before modifying any resource. You can't modify resources with ReadOnly locks, regardless of permissions or run mode. Delete and remove operations are blocked entirely. You can use the Azure portal for deletions.

## Alternative response paths

Direct mitigations aren't the only option. Many teams prefer to route findings to work items or ticketing systems instead of executing actions directly. Work items are especially helpful when human review is required or change management processes apply.

| Response path | How it works | Best for |
|---|---|---|
| **Direct mitigation** | Agent executes restart, scale, or hardening | Trusted patterns, nonproduction |
| **Create work item** | Agent creates GitHub issue or Azure DevOps work item | Human-in-the-loop, change management |
| **Send notification** | Agent posts to Teams or sends email | Awareness without action |
| **Trigger workflow** | Agent dispatches GitHub Actions or Logic Apps | CI/CD integration, multistep processes |

Configure work item creation and notifications through [connectors](connectors.md). For example, connect a GitHub MCP server to let your agent create issues, or connect Azure DevOps to create work items automatically.

For more information, see [Send notifications](send-notifications.md) and [Workflow automation](workflow-automation.md) for chaining these response types together.

## Example: incident-triggered mitigation

The following example shows how your agent handles a memory incident at 3:47 AM while you sleep.

**3:47 AM** — PagerDuty fires an alert: "High memory on prod-api"

Your agent (in Review mode) handles everything:

1. **Acknowledges the incident** — PagerDuty shows "Acknowledged by SRE Agent."

1. **Investigates automatically**:
    - Queries App Insights: memory at 94%, trending up over 2 hours.
    - Checks deployment history: no recent deploys.
    - Recalls from memory: "Last time this happened, restart resolved it."

1. **Proposes a fix** — Posts to the incident thread:

    ```console
    Memory at 94% on prod-api (App Service).
    Recommended action: Restart the App Service.

    Evidence:
    - Memory climbing since 1:30 AM
    - No recent deployments
    - Past incident: restart resolved similar issue on 2026-01-15

    [Approve] [Deny]
    ```

1. **You approve** (or in Autonomous mode, the agent executes immediately).

1. **Agent executes and verifies**:

    ```console
    ✓ Restarted prod-api
    ✓ Memory now at 42%
    ✓ Incident resolved
    ```

**What happened:** You clicked **Approve** and the agent handled investigation, action, and verification.

## Audit trail

The system records every mitigation action along with the full context.

| Field | Captured information |
|---|---|
| **Identity** | The agent and managed identity |
| **Action** | The exact operation performed |
| **Timestamp** | When the operation executed |
| **Trigger** | The diagnosis or condition that led to the action |
| **Result** | Success or failure, with post-action verification |

You can query the audit trail in Application Insights through **Monitor > Logs** in the agent portal. The system logs every `az` command as an `AgentAzCliExecution` custom event. For more information, see [Audit agent actions](audit-agent-actions.md).

## Next step

> [!div class="nextstepaction"]
> [Automate workflows](./workflow-automation.md)

## Related content

- [Run modes](run-modes.md)
- [Scheduled tasks](scheduled-tasks.md)
- [Workflow automation](workflow-automation.md)
- [Audit agent actions](audit-agent-actions.md)
- [Permissions](permissions.md)
