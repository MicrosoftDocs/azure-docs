---
title: Overview of Azure SRE Agent Preview
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: overview
ms.date: 10/01/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# What is Azure SRE Agent Preview?

Azure SRE Agent Preview is an AI-powered reliability assistant that helps teams diagnose and resolve production issues, reduce operational toil, and lower mean time to resolution (MTTR).

Ask questions in natural language, get explainable root-cause analysis (RCA), and orchestrate incident workflows with human-in-the-loop approvals or autonomous execution within scoped guardrails. You can configure the service's agent to follow customized instructions and runbooks, and to enable consistent and scalable incident response aligned with your team's operational practices.

## What you can do with SRE Agent

| Ask and understand | Automate incidents | Stay proactive |
|---|---|---|
| Ask plain-language questions about Azure resources, incidents, and health. | Diagnose, mitigate, and resolve incidents across Azure Monitor or integrated tools. The agent works autonomously or with approvals. | Agent sends daily summaries of environment health, flags spikes in CPU/memory usage, and identifies resources that don't follow security best practices. |
| **Examples:**<br><br>* *What changed in production in last 24 hours?*<br><br>* *Which resources are unhealthy?*<br><br>* *What alerts are active now?* | **Examples:**<br><br>* Incidents from ServiceNow or PagerDuty<br><br>* 500 error alerts from Azure Monitor<br><br> * Custom incident resolution workflows | **Examples:**<br><br>* Daily health summary for production<br><br>* CPU spike detection<br><br>* Security compliance violations |

Watch the following video to see SRE Agent in action.

<br>

> [!VIDEO https://www.youtube.com/embed/DRWppVNOTqQ?si=FJ9dNk5uY1kUET-R]

## Key capabilities

| Feature | Description |
|---|---|
| **Incident Automation** | Diagnose, enrich, and orchestrate workflows across Azure Monitor and supported tools with human-in-the-loop approvals or autonomous execution by using custom incident resolution plans. |
| **Customizable incident handling** | Tailor the agent's behavior to follow your operational instructions and manage incidents in alignment with your team's site reliability engineering (SRE) best practices. |
| **Explainable RCA** | Correlate metrics, logs, traces, and recent deployments to propose likely causes and safe mitigations. When the agent is attached to a source code repository, it can pinpoint code differences in RCA reports. |
| **Dev work item creation** | Automatically create developer work items in GitHub or Azure DevOps to link incidents to commits, pull requests, and deployment history. Include repro steps, logs, and suspects to accelerate resolution. |
| **Natural language insights** | Ask questions and issue commands in plain English. |

## Integrations

Azure SRE Agent integrates with the following services:

- **Incidents and work**: [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview), [PagerDuty](https://www.pagerduty.com/), [ServiceNow](https://www.servicenow.com/)

- **Source code**: GitHub, Azure DevOps

## Get started

Use the following steps to start working with Azure SRE Agent.

# [Explore](#tab/explore)

1. Create [a new agent](usage.md) in your subscription with [Reader](access-management.md) permissions.

1. Point the agent to the resource groups that you want to manage.

1. Try prompts like:

    - *What's the CPU and memory utilization of my app?*

    - *Which resources are unhealthy?*

    - *What changed in my web app last week?*

1. Take action to proposed next steps.

# [Handle an incident](#tab/incident)

1. Enable integrations:  

    - Incident management tools: Link to ServiceNow, link to PagerDuty, or use Azure Monitor alerts.  

    - Ticketing systems: Azure Boards.

    - Source code repositories: Connect to GitHub or Azure DevOps.  

1. Send a test incident to validate enrichment, RCA, and automation flow.

1. Review incident context, RCA timeline, and proposed mitigations.

---

## Considerations

Keep in mind the following considerations as you use Azure SRE Agent:

- English is the only supported language in the chat interface.
- During the preview, you can deploy the agent to the Sweden Central region, but the agent can monitor and remediate issues for services in any Azure region.
- For more information on how data is managed in Azure SRE Agent, see the [Microsoft privacy policy](https://www.microsoft.com/privacy/privacystatement).
- Availability varies by region and tenant configuration.  
- Preview [billing](billing.md) begins *September 1, 2025*, via Azure agent units (AAUs).

## Preview access

While access to SRE Agent was previously only available to customers via a waitlist, the agent is now available to all customers through the [Azure portal](https://aka.ms/sreagent-portal).

> [!NOTE]
> By using SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Next step

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
