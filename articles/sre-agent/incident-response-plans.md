---
title: Incident Response Plans in Azure SRE Agent
description: Learn how to route incidents to specialized custom agents with the right tools, investigation depth, and autonomy level automatically.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incident, response-plans, incident-triggers, routing, filters, automation, custom-agents, severity, priority
#customer intent: As an SRE, I want to route incidents to specialized custom agents automatically so that the right expertise handles each incident type without human routing at 3 AM.
---

# Incident response plans in Azure SRE Agent
Response plans automatically route incidents to specialized custom agents with the right tools, investigation depth, and autonomy level. The right custom agent handles each incident type without human intervention.

> [!VIDEO <VIDEO_URL>/Automated_Incident_Response.mp4]

> [!TIP]
> - The right custom agent handles each incident type automatically - no human routing at 3 AM.
> - Filter by severity, service, title, and type to match precisely the incidents you care about.
> - Turn any plan on or off with one action by pausing routing during maintenance without deleting.
> - See all plans, statuses, and custom agent mappings in a unified grid.

## The problem: one playbook for every fire

Not every incident is the same. A P1 database corruption requires deep log analysis and immediate action. A P3 performance degradation needs a quick metrics check. A deployment rollback needs source code context and deployment history.

Yet most automation treats all incidents identically with the same investigation steps, same tools, same urgency. Your on-call engineer ends up being the router, deciding which runbook to follow, which dashboards to check, and how urgently to respond. At 3 AM, that decision-making overhead directly increases your MTTR.

## How response plans work

Response plans connect incident filters to custom agents. When an incident arrives, your agent evaluates it against active response plans and routes it to the right custom agent automatically.

:::image type="content" source="media/incident-response-plans/incident-trigger-canvas.png" alt-text="Screenshot of the Agent Canvas showing incident trigger nodes connected to a custom agent with edges.":::

Each response plan has two parts:

| Part | What it controls | Example |
|---|---|---|
| **Incident filter** | Which incidents to match | P1 and P2 incidents on `api-gateway` service |
| **Custom agent handler** | How to respond | Use `api-expert` custom agent in Review mode |

### Filter criteria

Define which incidents a response plan matches by using the following filter criteria.

| Criteria | What it filters | Example |
|---|---|---|
| **Severity / Priority** | One or more severity levels | P1 and P2 (multi-select) |
| **Impacted service** | Which service is affected | `api-gateway`, `payment-service` |
| **Incident type** | Classification | Default, Major, Security |
| **Title contains** | Keyword match in incident title | `"CPU spike"`, `"Out of memory"` |

Select **multiple severity levels** in a single plan. Your agent matches incidents at any of the selected levels.

### Custom agent configuration

Each plan specifies how your agent responds.

| Setting | Options | Default |
|---|---|---|
| **Response custom agent** | Any configured custom agent | Preselected when creating from graph |
| **Agent autonomy level** | Autonomous, Review | Autonomous |

- **Autonomous**: Your agent analyzes incidents and independently performs mitigation or resource modifications by using the required permissions.
- **Review**: Your agent diagnoses incidents, then mitigates or modifies resources only after its proposed actions are reviewed and approved.

### Alert reinvestigation cooldown (Azure Monitor only)

For Azure Monitor response plans, control how your agent handles recurring fires of the same alert rule. By default, when the same alert rule fires again within the cooldown window, the new alert merges into the existing investigation thread instead of starting a new one. This approach saves token consumption and keeps your incident list clean.

| Setting | Options | Default |
|---|---|---|
| **Reinvestigation cooldown** | Enable / Disable | Enabled |
| **Cooldown time** | 1-24 hours | 3 hours |

When the cooldown is **enabled** (default):

- Recurring alerts from the same rule merge into the existing thread. Five firings become one investigation, not five.
- If the previous thread was resolved or closed within the cooldown window, the agent reopens it instead of creating a new thread.

When the cooldown is **disabled**:

- Every alert fire creates a new investigation thread, even from the same rule.
- Use this setting for critical alerts where every fire needs a fresh, independent investigation.

> [!WARNING]
> Disabling the cooldown means every fire of a noisy alert rule triggers a new investigation. For rules that fire frequently (such as CPU or memory threshold alerts), this approach can significantly increase token consumption.

## What makes this approach different

Response plans differ from other automation approaches in several key ways.

**Unlike static alert rules**, response plans route to specialized agents. Each plan can point to a different custom agent with different tools and expertise. Database incidents get a database expert, and API incidents get a deployment-aware investigator.

**Unlike manual runbook selection**, your agent makes the routing decision automatically. The right expertise matches the right problem without human judgment at 3 AM.

**Unlike one-size-fits-all automation**, response plans let you tune investigation depth per incident type. Use autonomous mode for P1 outages. Use review mode for lower-severity alerts. Match your response to the severity of the problem.

## Before and after

The following table compares manual incident routing with response plan automation.

|  | Before | After |
|---|---|---|
| **Incident routing** | Human decides which playbook to follow | Agent matches incident to specialized response plan |
| **Tool selection** | Engineer opens relevant dashboards manually | Right custom agent with right tools handles it |
| **Investigation depth** | Same approach for P1 and P4 | Autonomous for critical, review for low-severity |
| **Pausing a plan** | Delete the plan, recreate later | Select **Turn off**. The configuration is preserved |
| **Plan visibility** | Navigate between multiple pages | One grid shows plans, statuses, and custom agent mappings |

## How to create a response plan

You can create and manage response plans in two places:

| Path | Best for |
|---|---|
| **Builder** > **Incident response plans** | Managing all plans in a grid with filtering, search, and one-select enable or disable |
| **Builder** > **Agent Canvas** (canvas) | Visualizing, which triggers route to which custom agents |

From either path, select **New incident response plan** (or the **+** button on a custom agent node in the canvas) to open the create wizard.

> [!WARNING]
> When you first connect an incident platform, the portal automatically creates a default **quickstart** response plan. If you create your own plans, delete the quickstart plan from **Builder** > **Incident response plans**. Overlapping plans can cause the portal to route incidents to the wrong custom agent or process incidents twice.

## Enable and disable plans

You can turn any response plan on or off without deleting it. This feature is useful during maintenance windows, testing, or when you want to temporarily stop routing certain incident types.

1. Go to **Builder** > **Incident response plans**.
1. Select the plan by selecting its checkbox.
1. Select **Turn off** in the toolbar, then a confirmation dialog appears.
1. Select **Yes** to disable the plan.

The plan's status changes to **Off** and the scanner stops matching incidents against it. The portal preserves your filter configuration.

To re-enable, select the plan and select **Turn on**. The plan takes effect immediately with no confirmation needed.

You can also toggle plans from **Builder** > **Agent Canvas** > **Table view** > **Incident response plans** tab, which provides the same controls in the unified grid.

## Unified grid view

The **Table view** in the Agent Canvas shows all your response plans alongside custom agents, scheduled tasks, and tools. Switch to the **Incident response plans** tab to see:

| Column | What it shows |
|---|---|
| **Response plan name** | Plan identifier |
| **Status** | On (green) or Off (red) badge |
| **Custom agent name** | Which custom agent handles matched incidents |
| **Severity** | Severity levels the plan filters on |
| **Incident type** | Type classification |
| **Impacted service** | Service filter |
| **Title contains** | Keyword filter |

Use the **Status** filter to quickly find disabled plans, and use the search box to find plans by name.

## Example: route database vs. API incidents

Your team runs two services: `api-gateway` and `postgres-primary`. API incidents typically involve deployment rollbacks and need source code context. Database incidents require deep log analysis by using Kusto queries.

You create two response plans:

| Trigger | Filter | Custom agent | Mode |
|---|---|---|---|
| `api-high-sev` | P1 + P2 on `api-gateway` | `DeploymentAnalyzer` | Review |
| `db-critical` | P1 on `postgres-primary` | `DatabaseExpert` | Autonomous |

## Get started

| Resource | What you'll learn |
|---|---|
| [Set up an incident trigger](response-plan.md) | Configure response plans to automate incident handling |

## Default settings

When you enable incident management, the system creates a default plan with the following settings:

- Connected to Azure Monitor alerts
- Processes all low priority incidents from all impacted services
- Runs in review mode

You can customize everything from the incident management system to the filters and autonomy level. Supported incident management platforms include PagerDuty and ServiceNow.

## Test a response plan

To ensure your incident response plan behaves the way you expect, test your plan against historical incidents. In test mode, your plan runs against existing incidents so you can see how the agent attempts to mitigate the issue.

When in test mode, the agent always operates in a read-only mode.

You can test both new and existing incident response plans.

# [New plan](#tab/new-plan)

When you create a new incident response plan, follow these steps:

1. Select the **Add custom instructions** checkbox.
1. Enter your custom instructions into the **Custom instructions** box.
1. Select **Generate**.
1. Review the plan generated by the agent.
1. Select the **Test incident response** tab.
1. From the incident dropdown, select an incident you want to test the plan against.
1. Select **Run test**.

# [Existing plan](#tab/existing-plan)

To test an existing incident response plan:

1. Select the **Incident management** tab.
1. Select the incident response plan from the list.
1. Review the filters and autonomy level settings and select **Next**.
1. Review the incidents list you want to model the plan on, and review the custom instructions.
1. Select **Generate** if you made changes or **Skip** if you didn't adjust any filters or instructions.
1. Select the **Test incident response** tab.
1. From the incident dropdown, select an incident you want to test the plan against.
1. Select **Run test**.
1. Review the response generated by the agent to verify that you approve of how the agent responds to the incident.

---

## Related capabilities

| Resource | Description |
|---|---|
| [Incident response](incident-response.md) | Broader incident automation capability |
| [Root cause analysis](root-cause-analysis.md) | Hypothesis-driven investigation |
| [Custom agents](sub-agents.md) | Create specialized agents that work together |