---
title: Overview of Azure SRE Agent
description: Learn how Azure SRE Agent automates incident triage, scheduled operations, and site reliability workflows with integrations for PagerDuty, ServiceNow, and GitHub.
author: craigshoemaker
ms.topic: overview
ms.date: 08/26/2026
ms.author: cshoe
ms.service: azure-sre-agent
---

# Overview of Azure SRE Agent

During incidents, you often find context scattered across alerts, dashboards, tickets, and repositories. Azure SRE Agent connects to your Azure resources, observability tools, incident platforms, and source code repositories so you can investigate issues with more operational context in one place. Use it to gather signals, compare current issues with previous investigations, and run governed automation within configured permissions, run modes, and policies.

## What you can do

Azure SRE Agent helps your team investigate incidents and respond faster. It gathers context, identifies probable causes, and suggests or, when configured, executes mitigations.

For example, during a memory-related incident, SRE Agent can:

- **Detect memory trends**: Query Application Insights to identify a memory trend that began 40 minutes before the alert
- **Correlate deployments**: Link the trend to a GitHub repository deployment event two hours earlier
- **Propose mitigations**: Identify the specific commit and propose restarting the affected pod or adjusting the memory scaling threshold (horizontal pod autoscaler, or HPA)
- **Prefill incident tickets**: Create a ServiceNow, PagerDuty, or incident-channel ticket with the full investigation summary prefilled

These configured workflows notify the appropriate people while SRE Agent works on a proposed mitigation. In Review mode, an SRE Agent administrator reviews the summary with attached runbook context and approves actions that require approval. The investigation stays in one thread, reducing tool switching. Whether the agent applies a mitigation automatically or waits for approval depends on your configured [run mode](run-modes.md).

This pattern applies across configured Azure services and integrations, including compute, storage, networking, data, and related monitoring and management services. Extend it with permitted Azure CLI operations through skills, approved runbooks, or custom agents. Use [agent hooks](agent-hooks.md) to add governance checkpoints that can allow or block actions.

The agent's work follows three patterns:

- **Automate incidents**: On alert, the agent queries your monitoring tools, correlates signals across systems, identifies probable root cause, and proposes mitigations.

- **Automate scheduled workflows**: Schedule proactive health checks, compliance sweeps, and routine operational tasks. Results surface in your connected incident platform or notification channel.

- **Investigate and advise**: Ask natural-language questions about your environment, such as "what changed in the last hour?" or "why is this service degraded?", and get grounded, source-cited answers.

## How it works

SRE Agent combines Azure-specific product knowledge with customization you control. By default, it can query and act on Azure resources within assigned permissions, with built-in behavior for common operational tasks.

The agent operates through five extension points that you can customize:

- **Skills**: Discrete capabilities, including marketplace runbooks and Azure CLI scripts, that extend the agent's operational reach without requiring custom code.

- **Custom agents**: Purpose-built agents for specific operational domains. Several specialist agents ship ready to use, and you can build your own in the agent builder. See [Custom agents](sub-agents.md).

- **Python tools**: Custom logic, data transformations, and API integrations for scenarios that require code rather than configuration.

- **MCP servers**: Connect to preconfigured partner connectors for observability platforms such as Datadog, Splunk, New Relic, Dynatrace, and Elasticsearch, or connect any custom tool through the Model Context Protocol standard. See [MCP connectors and tools](mcp-connectors.md).

- **Agent hooks**: Event-triggered automations that run at defined points in the agent lifecycle, such as after a tool runs or when the agent stops. Use hooks to enforce policies, emit telemetry, or integrate with external approval workflows. See [Agent hooks](agent-hooks.md).

Every proposed tool call passes through governance controls before it runs, so your team defines the boundaries even for fully automated workflows. For more information, see [Security and governance](#security-and-governance).

## Integrations

Azure SRE Agent connects to the tools your team already uses:

:::row:::
:::column:::

**Monitoring and observability:**

- Azure Monitor (metrics, logs, alerts, workbooks)
- Application Insights
- Log Analytics

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

- Microsoft Teams
- Outlook

:::column-end:::
:::row-end:::

Depending on your configuration, Azure SRE Agent also offers [managed connectors](managed-connectors.md), a separate connector system that can link your agent to SaaS services such as Google Drive, SharePoint, Notion, and Confluence.

## Security and governance

Security and platform teams can apply layered controls across network, identity, authorization, and organizational governance:

- **Network isolation**: VNet integration routes agent workspace traffic through your virtual network. Your network security group (NSG) rules apply while your private DNS resolves requests. When you configure network routing, DNS, and permissions correctly, you can reach private endpoints, internal APIs, and locked-down resources like any other resource in your virtual network (VNet).

- **Identity and RBAC**: The agent authenticates with managed identity and operates under Azure role-based access control (RBAC). For source code, GitHub Enterprise support lets the agent authenticate as a governed service identity through a Bring Your Own GitHub App model.

- **Tool-level access control**: Set each tool the agent uses to *allow*, *ask*, or *deny*. Admins set global guardrails, team leads customize each custom agent, and users approve tools within their conversation. The available options, defaults, and precedence depend on the scope and policy in effect. For details, see [tool access policies](tool-access-policies.md).

- **Infrastructure as Code**: Deploy the agent, its network configuration, its identity, and its tool policies via Bicep templates (Azure's infrastructure-as-code language) and Azure CLI through the same CI/CD pipelines you use for every other Azure resource.

- **Governed skill distribution**: Platform teams can publish approved skills to a private GitHub repository by using the Private Plugins Marketplace. Agents across the tenant install approved skills from the same governed catalog.

## Reuse operational context

Azure SRE Agent retains context from prior investigations and uses background insight generation and session insights to recognize recurring patterns or related context. Retained context can include root causes, resolution steps, preferences, and operational patterns. Reusing it can limit repeated context gathering, reduce dependence on undocumented individual knowledge, and give on-call engineers more consistent starting information.

> [!TIP]
> **Team example:** A new engineer joins on-call. The agent already knows deployment patterns, past incidents, and team procedures, so they start with more context from day one.
>
> **Solo example:** You go on vacation. The agent's captured operational context is available to whoever covers, so they don't start from scratch.

| Stage | What happens |
|---|---|
| **Initial setup** | Connect your tools and use built-in Azure knowledge during an investigation. |
| **After repeated investigations** | Retained context can include environment topology, recurring failure patterns, and escalation preferences. |
| **As shared context accumulates** | Team members can reuse prior root causes and resolution steps with less dependence on undocumented individual knowledge. |

## Get started

Pick the path that matches your goal: schedule a task, handle an incident, or build a custom agent.

# [Schedule a task](#tab/task)

Use scheduled tasks to automate routine operational work (health checks, cleanup, and compliance sweeps) without writing infrastructure code.

1. Select the **Schedule tasks** tab.

1. Enter task details.

1. Define the schedule to run your task.

1. Craft custom agent instructions for the task.

1. Select **Create scheduled task**.

You see results from your scheduled task in your connected incident platform or notification channel.

# [Handle an incident](#tab/incident)

When an alert fires, SRE Agent:

1. Receives the alert from PagerDuty, ServiceNow, or Azure Monitor Alerts.

1. Queries your observability stack (Application Insights, Log Analytics, and your connected monitoring platforms) for correlated signals.

1. Generates a root cause hypothesis and proposes mitigations.

1. Creates or updates a ticket in ServiceNow, PagerDuty, or your incident channel with the full investigation summary, proposed mitigations, and an approval action.

**To enable incident handling:**

1. Connect your incident management platform: [ServiceNow](servicenow-incidents.md), [PagerDuty](pagerduty-incidents.md), or Azure Monitor alerts.

1. Create an incident response plan with instructions for how the agent should handle incidents in your environment.

1. Connect your source code repositories (GitHub or Azure DevOps) for deployment correlation.

1. Send a test incident to validate enrichment, root cause analysis, and automation flow.

> [!NOTE]
> Whether the agent applies a mitigation on its own depends on the run mode you set for the response plan or scheduled task. In Review mode, an SRE Agent Administrator approves the write actions that require approval before the agent runs them. In Autonomous mode, the agent applies them without waiting. For more information, see [Run modes](run-modes.md).

# [Build a custom agent](#tab/subagent)

Use the agent builder to extend SRE Agent for your environment. Start with the primitive that fits your use case:

| Primitive | Use when | Docs |
|-----------|----------|------|
| **Skills** | You want to add a discrete capability from the marketplace | [Skills](skills.md) |
| **Custom agents** | You need a specialized agent for a specific operational domain | [Custom agents](sub-agents.md) |
| **Python tools** | You need custom logic, transformations, or API calls | [Python code execution](python-code-execution.md) |
| **MCP servers** | You need to connect an external data source or platform | [MCP integrations](mcp-connectors.md) |
| **Hooks** | You need event-triggered automations at lifecycle points | [Agent hooks](agent-hooks.md) |

Builder capabilities are scoped by RBAC. See [User roles and permissions](user-roles.md) for role definitions and [Audit agent actions](audit-agent-actions.md) for audit trail queries.

---

## Related content

Use these resources to plan deployment, governance, billing, and team onboarding:

| Resource | What you find |
|----------|---------------|
| [Pricing and billing](pricing-billing.md) | Usage-based pricing metered in Azure Agent Units (AAUs), plus capacity planning |
| [Security overview](security-overview.md) | Data handling, privacy, and execution isolation |
| [Create and set up](create-agent.md) | Deploy an agent and grant it access to selected Azure resources. |
| [Team setup and roles](team-onboard.md) and [User roles and permissions](user-roles.md) | How roles control who can chat, approve, and administer the agent, plus how to teach the agent about your team, services, and procedures |

## Next step

> [!div class="nextstepaction"]
> [Create an agent and connect it to your Azure resources](create-agent.md)
