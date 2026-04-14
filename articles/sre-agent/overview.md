---
title: Overview of Azure SRE Agent
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: overview
ms.date: 03/18/2026
ms.author: cshoe
ms.service: azure-sre-agent
---

# Overview of Azure SRE Agent

Azure SRE Agent automates operational work and reduces toil, so developers and operators can focus on high-value tasks.

Typical operational tasks often include managing multiple Azure resources along with on-premises and SaaS systems. These tasks are often repetitive or require orchestrating together multiple tools to provide the insights you need. SRE Agent gives you an AI-driven platform to connect observability tools, incident platforms, and source code repositories, and automate the workflow end-to-end.

What makes it different: SRE Agent continuously builds expertise on your environment. It remembers every investigation, learns your team's patterns, and runs background analysis even when nobody is asking questions. The agent gets smarter with every interaction.

## What is SRE Agent?

SRE Agent is a service that brings automation and intelligence to site reliability engineering practices. It helps you reduce manual effort, improve system uptime, and deliver consistent operational outcomes. As the agent integrates with both Azure services and external systems, it executes operational tasks with minimal human intervention.

## Azure service management capabilities

SRE Agent can manage all Azure services through the Azure CLI and REST APIs. This capability includes comprehensive support for:

- **Compute services**: Virtual machines, App Service, Container Apps, Azure Kubernetes Service (AKS), Azure Functions, and more

- **Storage services**: Blob storage, file shares, managed disks, and storage accounts

- **Networking services**: Virtual networks, load balancers, application gateways, and network security groups

- **Database services**: Azure SQL Database, Cosmos DB, PostgreSQL, MySQL, and Redis

- **Monitoring and management**: Azure Monitor, Log Analytics, Application Insights, and Resource Manager

You can automate any operation you perform by using the Azure CLI through SRE Agent by using custom runbooks and [subagents](sub-agents.md).

## Primary use cases

- **Automate incidents**: Connect to incident management platforms to automate triage, mitigation, and resolution. This connection reduces mean time to recovery (MTTR) and improves service availability.

- **Automate scheduled workflows**: Set up proactive alerting and actions to automate routine and repetitive tasks that run on a defined schedule.

To see SRE Agent in action, watch the following video.

<br>

> [!VIDEO https://www.youtube.com/embed/DRWppVNOTqQ?si=FJ9dNk5uY1kUET-R]

## How does SRE Agent work?

SRE Agent combines fine-tuned Azure expertise with full customization capabilities. Out of the box, SRE Agent understands and manages Azure resources for specific services. It provides intelligent defaults for common operational tasks. At the same time, it offers flexibility to incorporate domain-specific knowledge, custom runbooks, and integrations with tools and data sources such as observability and monitoring platforms.

The agent operates through multiple automation mechanisms, including:

- **Built-in Azure knowledge**: Preconfigured understanding of Azure services with optimized operational patterns

- **Custom runbooks**: Execute Azure CLI commands, and REST API calls for any Azure service

- **Subagent extensibility**: Build specialized agents for specific services like VMs, databases, or networking components

- **External integrations**: Connect to monitoring, incident management, and source control systems

This extensibility ensures that SRE Agent can adapt to your environment and operational requirements across your entire Azure infrastructure.

## Knowledge that never leaves

Every investigation teaches your agent something new. It captures root causes, resolution steps, team preferences, and operational patterns that build institutional knowledge that persists across conversations and never leaves. New team members ramp up faster, on-call quality stays consistent regardless of who's paged, and your team's collective expertise grows automatically.

> **Example:** New engineer joins on-call → Agent already knows deployment patterns, past incidents, and team procedures which remain consistent quality from day one.

## Integrations

Azure SRE Agent integrates with your operational ecosystem in the following ways:

- **Monitoring and observability:**
  - Azure Monitor (metrics, logs, alerts, workbooks)
  - Application Insights
  - Log Analytics
  - Grafana

- **Incident management:**
  - Azure Monitor Alerts
  - PagerDuty
  - ServiceNow

- **Source control and CI/CD:**
  - GitHub (repositories, issues)
  - Azure DevOps (repos, work items)

- **Data sources:**
  - Azure Data Explorer (Kusto) clusters
  - Model Context Protocol (MCP) servers
  
## Get started

Get started working with Azure SRE Agent by scheduling a task, handling an incident, or building a custom agent.

# [Schedule a task](#tab/task)

Create a scheduled task to run on a schedule you define.

1. Select the **Schedule tasks** tab.

1. Enter task details.

1. Define the schedule to run your task.

1. Craft custom agent instructions for the task.

1. Select **Create scheduled task**.

# [Handle an incident](#tab/incident)

1. Enable integrations:  

    - Incident management tools: Link to ServiceNow, link to PagerDuty, or use Azure Monitor alerts.
  
    - Create a new incident response plan with custom instructions detailing how to handle incidents.

    - Ticketing systems: Azure Boards.

    - Source code repositories: Connect to GitHub or Azure DevOps repos.  

1. Send a test incident to validate enrichment, root cause analysis, and automation flow.

1. Review incident context, root cause analysis timeline, and proposed mitigations.

# [Build a custom agent](#tab/subagent)

Build [custom operational subagents](sub-agents.md), tools, and integrations by using a visual no-code interface. You can extend the agent's capabilities with specialized subagents for different operational domains.

- Create purpose-built subagents for specific operational areas such as virtual machines, databases, networking, and security.

- Connect your observability tools and knowledge sources through Model Context Protocol (MCP) servers.

- Browse and install community-built skills from the Plugin Marketplace with a single select.

- Build custom tools that execute Azure CLI commands, query Kusto, or integrate with internal and external systems through MCP servers.

- Define agent handoff workflows for complex multi-domain incidents.

- Test your subagent's performance by using the playground feature inside agent builder.

- Refine the subagent workflow until your operational needs are met.

---

## Your agent grows with your team

SRE Agent delivers progressive value over time as it learns your environment, your team's patterns, and your operational history.

| Milestone | What happens |
|-----------|-------------|
| **Day 1** | Connect your tools, triage your first incident, and get immediate diagnostic value from built-in Azure knowledge. |
| **Week 1** | The agent learns your environment topology, common failure patterns, and team escalation preferences. Investigations get faster and more accurate. |
| **Month 1** | Institutional knowledge compounds. The agent proactively identifies risks, suggests preventive actions, and ramps new team members from their first on-call shift. |

## Considerations

Keep the following considerations in mind as you use Azure SRE Agent:

- English is the only supported language in the chat interface.
- For more information about how Azure SRE Agent manages data, see the [Microsoft privacy policy](https://www.microsoft.com/privacy/privacystatement).
- Availability varies by region and tenant configuration.  

When you create an agent, the following resources are also automatically created for you:

- Azure Application Insights
- Log Analytics workspace
- Managed Identity

## Next step

Create and set up your first agent.

| Resource | Description |
|----------|-------------|
| [Get started](create-agent.md) | Create an agent and connect it to your Azure resources. |
| [Memory and knowledge](memory.md) | Learn how your agent remembers past investigations and builds institutional knowledge. |
