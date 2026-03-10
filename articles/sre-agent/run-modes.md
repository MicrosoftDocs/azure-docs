---
title: Run Modes in Azure SRE Agent
description: Learn how run modes control whether your agent asks for approval before taking actions or acts autonomously.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: run modes, review, autonomous, triggers, incident response, scheduled tasks, approval
#customer intent: As an SRE, I want to understand run modes so that I can control whether my agent acts autonomously or requires approval.
---

# Run modes in Azure SRE Agent
<!-- Video: Agent_Autonomy__Your_Control.mp4 — Replace with the hosted video URL using > [!VIDEO https://...] syntax -->

Run modes control whether your agent **asks for approval** before taking actions or **acts on its own**.

> [!NOTE]
> Run modes control the **approval workflow**, deciding whether the agent should ask before acting. [Permissions](permissions.md) control **resource access**, determining whether the agent can reach a resource. Both conditions must be satisfied for the agent to act.

## Two modes

:::image type="content" source="media/run-modes/run-modes-comparison.svg" alt-text="Screenshot of a comparison of review mode where the agent proposes and the user decides versus autonomous mode where the agent executes immediately.":::

The following table summarizes the two available modes:

| Mode | What happens | Best for |
|---|---|---|
| **Review** | Agent proposes an action; you approve or deny | Production systems, critical infrastructure |
| **Autonomous** | Agent executes immediately and reports what it did | Non-production environments, trusted recurring tasks |

## Review mode

Review is the default mode. Your agent investigates, identifies a fix, and asks for your approval before executing.

The following example shows what you see in review mode:

```console
I found that app-service-prod is running slowly due to high memory usage.

Proposed action: Restart App Service 'app-service-prod'
This may cause brief downtime (30-60 seconds).

[Approve] [Deny]
```

Select **Approve** to execute the proposed action, or **Deny** to stop it.

## Autonomous mode

In autonomous mode, your agent investigates and executes actions without waiting for approval. Use this mode when you trust the agent to handle the situation.

The following example shows what you see in autonomous mode:

```console
I found app-service-staging was running slowly.

Done: I've restarted app-service-staging. Memory usage is now normal.
```

## Where to configure run modes

Set run modes **per trigger and per scheduled task**. You don't set run modes at the agent level.

| Automation type | Default mode | Options |
|---|---|---|
| **Incident response plan** | Review | Review, Autonomous |
| **Scheduled task** | Autonomous | Review, Autonomous |

Set the **Agent autonomy level** when you create or edit a trigger or task:

:::image type="content" source="media/run-modes/portal-trigger-review-autonomous-modes.png" alt-text="Edit incident trigger dialog showing Agent autonomy level with Autonomous and Review options.":::

### Global mode ceiling

Your agent has a global mode in **Settings > Basics** that sets the **maximum autonomy** available to any trigger or task. The global mode defaults to **Review**.

| Global setting | What triggers can use |
|---|---|
| Review (default) | Review only |
| Autonomous | Review or Autonomous |

Most teams leave the global setting at **Review** and set individual triggers to Autonomous only for specific, trusted scenarios.

## Recommendations

The following table provides guidance for choosing the right mode based on your scenario:

| Scenario | Recommended mode |
|---|---|
| Production incidents | Review |
| Staging/dev incidents | Autonomous |
| Daily health checks | Autonomous |
| Cost and usage reports | Autonomous |
| Security alerts | Review |

Start with review mode. Observe what the agent recommends for two to four weeks. When you find patterns you consistently approve, switch those specific triggers to Autonomous.

## How permissions interact with run modes

The agent behaves differently depending on the assigned permissions, the execution mode, and the type of action it attempts to make. In all cases, if the agent doesn't have the required permissions, it requests temporary access through [Microsoft Entra OBO flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow).

### Read-only actions

The following table details how the agent behaves when it attempts a read-only operation that requires elevated permissions.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Uses its permissions to perform the action |
| No | Review | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Autonomous | Uses its permissions to perform the action |
| No | Autonomous | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

### Write actions

The following table details how the agent behaves when it attempts a write operation.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Prompts for consent to take action, and then uses its permissions to perform the action once consent is granted |
| No | Review | Prompts for consent to take action, and then prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Autonomous | Uses its permissions to perform the action |
| No | Autonomous | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

## Next step

> [!div class="nextstepaction"]
> [Execute mitigations](./execute-mitigations.md)

## Related content

- [Agent permissions](permissions.md)
- [User roles](user-roles.md)
- [Incident response](incident-response.md)
- [Scheduled tasks](scheduled-tasks.md)
