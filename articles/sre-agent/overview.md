---
title: Overview of Azure SRE Agent Preview
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: overview
ms.date: 12/08/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Overview of Azure SRE Agent Preview

Azure SRE Agent automates operational work and reduces toil, so developers and operators can focus on high-value tasks.

Typical operational tasks often include managing multiple Azure resources along with on-premises and SaaS systems. These tasks are often repetitive or require orchestrating together multiple tools to provide the insights you need. SRE Agent gives you an AI-driven platform to connect systems together and automate the workflow end-to-end.

## What is SRE Agent?

SRE Agent is a service that brings automation and intelligence to site reliability engineering practices. It helps you reduce manual effort, improve system uptime, and deliver consistent operational outcomes. As the agent integrates with both Azure services and external systems, it executes operational tasks with minimal human intervention.

## Azure service management capabilities

SRE Agent can manage all Azure services through the Azure CLI and REST APIs. This capability includes comprehensive support for:

- **Compute services**: Virtual machines, App Service, Container Apps, Azure Kubernetes Service (AKS), Azure Functions, and more

- **Storage services**: Blob storage, file shares, managed disks, and storage accounts

- **Networking services**: Virtual networks, load balancers, application gateways, and network security groups

- **Database services**: Azure SQL Database, Cosmos DB, PostgreSQL, MySQL, and Redis

- **Monitoring and management**: Azure Monitor, Log Analytics, Application Insights, and Resource Manager

You can automate any operation you perform with the Azure CLI through SRE Agent by using custom runbooks and [subagents](subagent-builder-overview.md).

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

Get started working with Azure SRE Agent by scheduling a task, handling an incident, or building a subagent.

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

    - Source code repositories: Connect to GitHub or Azure DevOps.  

1. Send a test incident to validate enrichment, RCA, and automation flow.

1. Review incident context, RCA timeline, and proposed mitigations.

# [Build a Subagent](#tab/subagent)

Build [custom operational subagents](subagent-builder-overview.md), tools, and integrations by using a visual no-code interface. You can extend the agent's capabilities with specialized subagents for different operational domains.

- Create purpose-built subagents for specific operational areas (virtual machines, databases, networking, security)

- Connect your observability tools and knowledge sources through Model Context Protocol (MCP) servers

- Build custom tools that execute Azure CLI commands, query Kusto, or integrate with internal and external systems through MCP servers

- Define agent handoff workflows for complex multi-domain incidents

- Test your subagent's performance by using the playground feature inside agent builder

- Refine the subagent workflow until your operational needs are met

---

## Considerations

Keep the following considerations in mind as you use Azure SRE Agent:

- English is the only supported language in the chat interface.
- For more information on how data is managed in Azure SRE Agent, see the [Microsoft privacy policy](https://www.microsoft.com/privacy/privacystatement).
- Availability varies by region and tenant configuration.  

When you create an agent, the following resources are also automatically created for you:

- Azure Application Insights
- Log Analytics workspace
- Managed Identity

## Next step

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
