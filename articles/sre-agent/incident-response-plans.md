---
title: Incident Response Plans in Azure SRE Agent
description: Learn how to route incidents to specialized subagents with the right tools, investigation depth, and autonomy level automatically.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/04/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incident, response-plans, incident-triggers, routing, filters, automation, subagents, severity, priority
#customer intent: As an SRE, I want to route incidents to specialized subagents automatically so that the right expertise handles each incident type without human routing at 3 AM.
---

# Incident response plans in Azure SRE Agent
Response plans automatically route incidents to specialized subagents with the right tools, investigation depth, and autonomy level. The right subagent handles each incident type without human intervention.

> [!VIDEO <VIDEO_URL>/Automated_Incident_Response.mp4]

> [!TIP]
> - The right subagent handles each incident type automatically - no human routing at 3 AM.
> - Filter by severity, service, title, and type to match precisely the incidents you care about.
> - Select multiple severity levels per plan instead of creating separate plans for each.
> - See your routing visually on the Subagent builder canvas.

## The problem: one playbook for every fire

Not every incident is the same. A P1 database corruption requires deep log analysis and immediate action. A P3 performance degradation needs a quick metrics check. A deployment rollback needs source code context and deployment history.

Yet most automation treats all incidents identically with the same investigation steps, same tools, same urgency. Your on-call engineer ends up being the router, deciding which runbook to follow, which dashboards to check, and how urgently to respond. At 3 AM, that decision-making overhead directly increases your MTTR.

## How response plans work

Response plans connect incident filters to subagents. When an incident arrives, your agent evaluates it against active response plans and routes it to the right subagent automatically.

:::image type="content" source="media/incident-response-plans/incident-trigger-canvas.png" alt-text="Screenshot of the Subagent builder canvas showing incident trigger nodes connected to a subagent with edges.":::

Each response plan has two parts:

| Part | What it controls | Example |
|---|---|---|
| **Incident filter** | Which incidents to match | P1 and P2 incidents on `api-gateway` service |
| **Subagent handler** | How to respond | Use `api-expert` subagent in Review mode |

### Filter criteria

Define which incidents a response plan matches by using the following filter criteria.

| Criteria | What it filters | Example |
|---|---|---|
| **Severity / Priority** | One or more severity levels | P1 and P2 (multi-select) |
| **Impacted service** | Which service is affected | `api-gateway`, `payment-service` |
| **Incident type** | Classification | Default, Major, Security |
| **Title contains** | Keyword match in incident title | `"CPU spike"`, `"Out of memory"` |

Select **multiple severity levels** in a single plan. Your agent matches incidents at any of the selected levels.

### Subagent configuration

Each plan specifies how your agent responds.

| Setting | Options | Default |
|---|---|---|
| **Response subagent** | Any configured subagent | Pre-selected when creating from graph |
| **Agent autonomy level** | Autonomous, Review | Review |

- **Autonomous** — Your agent analyzes incidents and independently performs mitigation or resource modifications by using the required permissions.
- **Review** — Your agent diagnoses incidents, then mitigates or modifies resources only after its proposed actions are reviewed and approved.

## What makes this different

Response plans differ from other automation approaches in several key ways.

**Unlike static alert rules**, response plans route to specialized agents. Each plan can point to a different subagent with different tools and expertise. Database incidents get a database expert, and API incidents get a deployment-aware investigator.

**Unlike manual runbook selection**, your agent makes the routing decision automatically. The right expertise matches the right problem without human judgment at 3 AM.

**Unlike one-size-fits-all automation**, response plans let you tune investigation depth per incident type. Use autonomous mode for P1 outages. Use review mode for lower-severity alerts. Match your response to the severity of the problem.

| Capability | What it contributes |
|---|---|
| [Subagents](sub-agents.md) | Specialized agents for different incident types |
| [Run modes](run-modes.md) | Control autonomy per response plan |
| [Connectors](connectors.md) | Data sources your agents query during investigation |
| [Memory](memory.md) | Your agent learns from past resolutions per incident category |

## Before and after

The following table compares manual incident routing with response plan automation.

|  | Before | After |
|---|---|---|
| **Incident routing** | Human decides which playbook to follow | Agent matches incident to specialized response plan |
| **Tool selection** | Engineer opens relevant dashboards manually | Right subagent with right tools handles it |
| **Investigation depth** | Same approach for P1 and P4 | Autonomous for critical, review for low-severity |
| **Severity handling** | One rule per severity level | Multiple severities per plan |

## Create a response plan

Create response plans from the **Subagent builder** canvas. This graph view shows you exactly which triggers route to which subagents.

Go to **Builder** > **Subagent builder**, select the **+** button on the subagent you want to handle matching incidents, and select **Add incident trigger**.

> [!WARNING]
> When you connect an incident platform, the system automatically creates a default **quickstart** response plan. If you create your own triggers through the Subagent builder, delete the quickstart plan from **Builder** > **Incident response plans**. Overlapping plans can cause incidents to be routed to the wrong subagent or processed twice.

> [!NOTE]
> You might also see an **Incident response plans** section under Builder. Use the **Subagent builder** path instead. It provides the same functionality with a visual graph that shows your trigger-to-subagent routing at a glance.

## Example: route database vs. API incidents

Your team runs two services: `api-gateway` and `postgres-primary`. API incidents typically involve deployment rollbacks and need source code context. Database incidents require deep log analysis by using Kusto queries.

You create two response plans:

| Trigger | Filter | Subagent | Mode |
|---|---|---|---|
| `api-high-sev` | P1 + P2 on `api-gateway` | `DeploymentAnalyzer` | Review |
| `db-critical` | P1 on `postgres-primary` | `DatabaseExpert` | Autonomous |

When a P1 database incident fires, the `DatabaseExpert` subagent investigates immediately by using its Kusto tools which means that no human decides which playbook to follow. When a P2 API incident fires, the `DeploymentAnalyzer` subagent checks recent deployments and proposes a fix for your review.

Each incident gets specialized handling, and the routing is visible on the Subagent builder canvas.

## Get started

For a step-by-step guide, see [Tutorial: Set up an incident trigger](response-plan.md).

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

When creating a new incident response plan, follow these steps:

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

## Next step

> [!div class="nextstepaction"]
> [Set up an incident trigger](./response-plan.md)

## Related content

- [Incident response](incident-response.md)
- [Root cause analysis](root-cause-analysis.md)
- [Subagents](sub-agents.md)
