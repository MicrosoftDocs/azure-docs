---
title: "Step 4: Set Up Incident Response in Azure SRE Agent"
description: Connect your incident platform and create response plans so your agent automatically investigates incoming incidents.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incident response, pagerduty, azure monitor, execution plan, getting started
#customer intent: As a site reliability engineer, I want to connect my incident platform and create response plans so that my agent automatically investigates and responds to incidents.
---

# Step 4: Set up incident response in Azure SRE Agent
**Estimated time**: 10 minutes

Connect your incident platform and create a response plan. When incidents arrive, your agent automatically investigates and generates detailed execution plans.

## What you accomplish

By the end of this step, your agent:

- Receives incidents from Azure Monitor, PagerDuty, or ServiceNow
- Automatically investigates matching incidents
- Generates AI execution plans from your instructions
- Collects evidence and provides recommendations

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create your agent](create-agent.md) first. |
| **Incident platform** | Azure Monitor (default), PagerDuty, or ServiceNow. |

> [!TIP]
> While not required, completing [Step 2: Add knowledge](first-value.md) and [Step 3: Connect source code](connect-source-code.md) significantly enhances incident response. Your agent references your runbooks and correlates problems to specific code changes, turning generic investigations into team-specific root cause analysis.

## Connect your incident platform

Choose and configure the incident platform your team uses.

### Azure Monitor (default)

Azure Monitor connects automatically when you create your agent. No additional configuration is needed.

### PagerDuty or ServiceNow

To connect PagerDuty or ServiceNow as your incident platform:

1. Select **Settings** in the left sidebar.
1. Select **Incident platform**.
1. Choose your platform from the dropdown:
   - **PagerDuty**: Enter your REST API access key.
   - **ServiceNow**: Enter your instance URL and credentials.
1. Select **Save**.

Your agent now receives incidents from your platform.

## Create a response plan

Create response plans from the **Subagent builder** canvas. You can see which triggers route to which subagents.

1. Select **Builder** in the left sidebar.
1. Select **Subagent builder**.
1. Find the subagent you want to handle incidents and select the **+** button on its left side.
1. Select **Add incident trigger**.
1. Configure the trigger: set a name, select severity levels (for example, P1 and P2), choose the impacted service, and optionally add a title keyword filter.
1. Choose the autonomy level (**Review** is recommended to start).
1. Preview matching incidents, and then select **Create**.

Your trigger appears as a node connected to the subagent on the canvas.

> [!TIP]
> When you first connect an incident platform, the system might automatically create a default **quickstart** response plan. If you set up your own triggers through the Subagent builder, **delete the default plan** from **Builder** > **Incident response plans** to avoid conflicts. Two overlapping plans can cause incidents to be handled by the wrong subagent or duplicated.

For the full step-by-step guide with screenshots, see the [Set up an incident trigger tutorial](response-plan.md).

:::image type="content" source="media/tutorial-incident-response/incident-response-plans.png" alt-text="Response plans displayed on the subagent builder canvas.":::

## What happens when an incident arrives

When an incident matches your plan, the agent handles it automatically.

1. **Retrieves incident details** from your platform.
1. **Searches memory** for similar past incidents and relevant documentation.
1. **Executes the plan** by running commands and collecting evidence.
1. **Summarizes findings** with timestamps and recommendations.

:::image type="content" source="media/tutorial-incident-response/sample-app-memory-search-results.png" alt-text="Memory search showing past incidents and relevant documentation.":::

### Example findings

The following example shows findings from a container app incident:

> **Summary:**
>
> - Container restarted around 01:27Z with memory dropping sharply.
> - Current config: 2 Gi memory, 1 CPU, minReplicas=2, maxReplicas=4.
>
> **Likely cause:** Transient container restart (OOM or deployment).
>
> **Recommended actions:**
>
> 1. Increase minReplicas to 3-4 to reduce restart impact.
> 1. Review container health probes.

Your agent provides actionable recommendations based on evidence, not generic advice.

## Next step

> [!div class="nextstepaction"]
> [Step 5: Automate actions](./automate-actions.md)

## Related content

- [Incident response](incident-response.md)
- [Incident response plans](incident-response-plans.md)
- [Tutorial: Set up response plans](response-plan.md)
- [Tutorial: Create a scheduled task](create-scheduled-task.md)
