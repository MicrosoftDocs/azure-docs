---
title: Overview of Azure SRE Agent
description: Learn how Azure SRE Agent automates incident triage, scheduled operations, and site reliability workflows with integrations for PagerDuty, Grafana, ServiceNow, and GitHub.
author: craigshoemaker
ms.topic: overview
ms.date: 06/16/2026
ms.author: cshoe
ms.service: azure-sre-agent
---

# Overview of Azure SRE Agent

Azure SRE Agent safely automates operational work and reduces toil, so your team spends less time on incident triage and manual runbooks and more time building.

It connects your observability tools, incident platforms, and source code repositories into a single automated workflow. When something breaks at 3 AM, instead of jumping between Grafana, PagerDuty, and Slack, you get one investigation with answers already in it, including what changed, what's affected, and what to do next.

The agent proposes changes and your team approves. No change deploys without human sign-off.

Every investigation the agent runs builds institutional knowledge that persists across conversations and accumulates over time, whether you're a team of twenty or the only person who knows how the system works.

## SRE Agent in action

Picture alerts firing at 2:47 AM for your payment-service from Azure Monitor, PagerDuty, or any connected monitoring platform.

Within minutes, SRE Agent:

- Queries Application Insights and identifies a memory trend that started 40 minutes before the alert
- Correlates the trend with a deployment event from your GitHub repository two hours earlier
- Identifies the specific commit and proposes two mitigations: restart the affected pod and adjust the memory scaling threshold (HPA)
- Creates a ticket in ServiceNow, PagerDuty, or your incident channel with the full investigation summary prefilled

A notification surfaces the proposed mitigation. The on-call engineer reviews the summary and approves with a single action, with no runbook required and no context-switching. The investigation resolves in 7 minutes in a single thread, with no war room and no tab-switching between Grafana, PagerDuty, and Slack.

## Azure service management capabilities

SRE Agent can manage the full range of Azure services your team relies on:

- **Compute services**: Virtual machines, App Service, Container Apps, Azure Kubernetes Service (AKS), Azure Functions, and more.

- **Storage services**: Blob storage, file shares, managed disks, and storage accounts.

- **Networking services**: Virtual networks, load balancers, application gateways, and network security groups.

- **Database services**: Azure SQL Database, Cosmos DB, PostgreSQL, MySQL, and Redis.

- **Monitoring and management**: Azure Monitor, Log Analytics, Application Insights, and Resource Manager.

You can automate any Azure CLI operation through SRE Agent using runbooks, subagents, and [agent hooks](agent-hooks.md).

## Primary use cases

- **Automate incidents**: When an alert fires, the agent queries your monitoring tools, correlates signals across systems, identifies probable root cause, and proposes mitigations. This process reduces mean time to recovery (MTTR), improves service availability, and catches failure patterns before they become incidents.

- **Automate scheduled workflows**: Run proactive health checks, compliance sweeps, and routine operational tasks on a defined schedule. Results surface in your connected incident platform or notification channel.

- **Investigate and advise**: Ask natural-language questions about your environment, such as "what changed in the last hour?" or "why is this service degraded?", and get grounded answers with source citations.

## How does SRE Agent work?

SRE Agent combines fine-tuned Azure expertise with full customization capabilities. Out of the box, it understands and manages Azure resources with intelligent defaults for common operational tasks.

The agent operates through five extension primitives:

- **Skills**: Discrete capabilities, including marketplace runbooks and Azure CLI scripts, that extend the agent's operational reach without requiring custom code.

- **Subagents**: Purpose-built agents for specific operational domains. Five subagents ship built-in (architecture, logs and metrics, source code, root cause analysis, and scanning), and you can build additional custom subagents or compose them for cross-domain investigations.

- **Python tools**: Custom logic, data transformations, and API integrations for scenarios that require code rather than configuration.

- **MCP servers**: Connect to 40+ pre-built connectors (Datadog, Prometheus, Grafana, New Relic, Splunk, Elasticsearch, Dynatrace, AWS CloudWatch, GCP Stackdriver, and more) or any custom tool through the Model Context Protocol standard.

- **Agent hooks**: Event-triggered automations that run at defined points in the agent lifecycle, either before investigation or after resolution. Two executor types are supported: command hooks run deterministic CLI operations, and prompt hooks produce LLM-evaluated structured JSON output. Use hooks to enforce policies, emit telemetry, or integrate with external approval workflows. See [agent hooks](agent-hooks.md).

- **Permission gate**: A pre-execution safety layer that evaluates every proposed tool call before it runs. Operators can require human approval, enforce policy rules, or block disallowed operations, ensuring your team remains in control even during fully automated workflows. Audit telemetry routes to your own Application Insights instance for compliance visibility.

For the full primitive taxonomy, including RBAC scoping, cost attribution, and audit trail patterns, see [Subagents and extensibility](sub-agents.md) and [Agent hooks](agent-hooks.md).

## Knowledge that never leaves

Every investigation teaches your agent something new, and that knowledge stays even when you don't. It captures root causes, resolution steps, preferences, and operational patterns. If you're the only one who knows how the system works, that's no longer a single point of failure. For teams, new members ramp up faster, on-call quality stays consistent regardless of who's paged, and your collective expertise grows automatically.

> [!TIP]
> **Team example:** A new engineer joins on-call. The agent already knows deployment patterns, past incidents, and team procedures, delivering consistent quality from day one.
>
> **Solo example:** You go on vacation. The agent carries your operational context so whoever covers doesn't start from scratch.

## Integrations

Azure SRE Agent integrates with your operational ecosystem in the following ways:

:::row:::
:::column:::

**Monitoring and observability:**

- Azure Monitor (metrics, logs, alerts, workbooks)
- Application Insights
- Log Analytics
- Grafana

**Incident management:**

- Azure Monitor Alerts
- PagerDuty
- ServiceNow

:::column-end:::
:::column:::

**Source control and CI/CD:**

- GitHub (repositories, issues)
- Azure DevOps (repos, work items)

**Data sources:**

- Azure Data Explorer (Kusto) clusters
- Model Context Protocol (MCP) servers

**Communication and notifications:**

- Slack
- Microsoft Teams

:::column-end:::
:::row-end:::

## Get started

Get started working with Azure SRE Agent by scheduling a task, handling an incident, or building a custom agent.

# [Schedule a task](#tab/task)

Use scheduled tasks to automate routine operational work (health checks, cleanup, and compliance sweeps) without writing infrastructure code.

1. Select the **Schedule tasks** tab.

1. Enter task details.

1. Define the schedule to run your task.

1. Craft custom agent instructions for the task.

1. Select **Create scheduled task**.

1. Results from your scheduled task surface in your connected incident platform or notification channel.

# [Handle an incident](#tab/incident)

When an alert fires, SRE Agent:

1. Receives the alert from PagerDuty, ServiceNow, or Azure Monitor Alerts.

1. Queries your observability stack (Grafana, Application Insights, Log Analytics) for correlated signals.

1. Generates a root cause hypothesis and proposes mitigations.

1. Creates or updates a ticket in ServiceNow, PagerDuty, or your incident channel with the full investigation summary, proposed mitigations, and an approval action.

**To enable incident handling:**

1. Connect your incident management platform: [ServiceNow](servicenow-incidents.md), [PagerDuty](pagerduty-incidents.md), or use Azure Monitor alerts.

1. Create an incident response plan with instructions for how the agent should handle incidents in your environment.

1. Connect your source code repositories (GitHub or Azure DevOps) for deployment correlation.

1. Send a test incident to validate enrichment, root cause analysis, and automation flow.

> [!NOTE]
> SRE Agent proposes mitigations but doesn't apply them without human approval, so you always control what runs.

# [Build a custom agent](#tab/subagent)

Use the agent builder to extend SRE Agent for your environment. Start with the primitive that fits your use case:

| Primitive | Use when | Docs |
|-----------|----------|------|
| **Skills** | You want to add a discrete capability from the marketplace | [Skills](skills.md) |
| **Subagents** | You need a specialized agent for a specific operational domain | [Subagents](sub-agents.md) |
| **Python tools** | You need custom logic, transformations, or API calls | [Python code execution](python-code-execution.md) |
| **MCP servers** | You need to connect an external data source or platform | [MCP integrations](mcp-connectors.md) |
| **Hooks** | You need event-triggered automations at lifecycle points | [Agent hooks](agent-hooks.md) |

Builder capabilities are scoped by RBAC. See [Security overview](security-overview.md) for role definitions and audit trail configuration.

---

## Value over time

SRE Agent delivers progressive value as it learns your environment, your patterns, and your operational history.

| Milestone | What happens |
|-----------|-------------|
| **Day 1** | Connect your tools, triage your first incident, and get immediate diagnostic value from built-in Azure knowledge. |
| **Week 1** | The agent learns your environment topology, common failure patterns, and escalation preferences. Investigations get faster and more accurate. |
| **Month 1** | Institutional knowledge compounds. Teams report catching failure patterns before they escalate. New team members contribute from their first on-call shift with no tribal knowledge required. |

Organizations using Azure SRE Agent report significant reductions in mean time to recovery and operational overhead across early pilots.

## Evaluate for your organization

Whether you're evaluating for a team or running operations solo, start with the progressive value table in the preceding section. Then explore:

| Resource | What you find |
|----------|---------------|
| [Pricing and billing](pricing-billing.md) | Usage-based pricing, free tier eligibility, and capacity planning |
| [Security overview](security-overview.md) | Data handling, privacy, network integration |
| [Create and set up](create-agent.md) | How to run a structured pilot |
| [Team setup and roles](create-agent.md) | Administrator vs. Standard User roles, phased rollout guide |

## Considerations

Keep the following considerations in mind as you use Azure SRE Agent:

- English is the only supported language in the chat interface.
- For more information about how Azure SRE Agent manages data, see the [Microsoft privacy policy](https://www.microsoft.com/privacy/privacystatement).
- Availability varies by region and tenant configuration.
- Costs are usage-based. See [Pricing and billing](pricing-billing.md) for the current rate model and free tier details.
- As with any AI system, SRE Agent might occasionally produce incorrect conclusions or propose mitigations that don't apply to your environment. Always review proposed actions before approving.

When you create an agent, the following resources are also automatically created for you:

- Azure Application Insights
- Log Analytics workspace
- Managed Identity

These resources support agent observability and identity management. You can view and manage them in your Azure subscription.

## Next step

> [!div class="nextstepaction"]
> [Create an agent and connect it to your Azure resources](create-agent.md)
