---
title: Azure SRE Agent overview (preview)
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: conceptual
ms.date: 08/21/2025
ms.author: cshoe
ms.service: azure
---

# Azure SRE Agent overview (preview)

Azure SRE Agent is an AI-powered reliability assistant that helps you prevent, diagnose, and resolve production issues faster with less toil.

Ask questions in natural language, get explainable RCAs, and orchestrate incident workflows with human-in-the-loop approvals or autonomous execution within scoped guardrails.

## What you can do with SRE Agent

| Ask & understand | Automate incidents | Stay proactive |
|---|---|---|
| Ask plain-language questions about Azure resources, incidents, and health. | Diagnose, mitigate, and resolve incidents across Azure Monitor or integrated tools. The agent works autonomously or with approvals. | Agent sends daily summaries of environment health, flags spikes in CPU/memory usage, and identifies resources not following security best practices. |
| **Examples:**<br><br>• What changed in production in last 24 hours?<br><br>• Which resources are unhealthy?<br><br>• What alerts are active now? | **Examples:**<br><br>• Incidents from ServiceNow<br><br>• 500 error alerts from Azure Monitor | **Examples:**<br><br>• Daily health summary for production<br><br>• CPU spike detection<br><br>• Security compliance violations |

Watch the following video to see SRE Agent in action.

<br>

> [!VIDEO https://www.youtube.com/embed/DRWppVNOTqQ?si=FJ9dNk5uY1kUET-R]

## Key capabilities

| Feature | Description |
|---|---|
| **Incident Automation** | Diagnose, enrich, and orchestrate workflows across Azure Monitor and supported tools with human-in-the-loop approvals or autonomous execution using custom incident resolution plans. |
| **Explainable root cause analysis (RCA)** | Correlate metrics, logs, traces, and recent deployments to propose likely causes and safe mitigations. When attached to a source code repository, the agent can pinpoint code diffs in RCA reports. |
| **Dev work item creation** | Automatically create developer work items in GitHub or Azure DevOps, linking incidents to commits, PRs, and deployment history. Includes repro steps, logs, and suspects to accelerate resolution. |
| **Natural language insights** | Ask questions and issue commands in plain English. |

## Integrations

Azure SRE Agent integrates with the following services:

- **Observability:** [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview) (metrics, logs, traces), Application Insights

- **Incidents & work:**  [ServiceNow](https://www.servicenow.com/) and [PagerDuty](https://www.pagerduty.com/)  

- **Source Code:** GitHub, Azure DevOps

## Get started

Use the following steps to start working with Azure SRE Agent.

:::row:::
   :::column span="":::
    ### Explore

    1. Create [a new agent](usage.md) in your subscription with *[Reader](security-context.md)* permissions.
    
    1. Point the agent to the resource groups you want it to manage.
    
    1. Try prompts like:

        - What’s the CPU and memory utilization of my app?
    
        - Which resources are unhealthy?
    
        - Where am I missing alert rules?
    
    1. Take action to proposed next steps.
   :::column-end:::
   :::column span="":::
    ### Handle an incident

    1. Enable integrations:  

        - Incident management tools: Link to ServiceNow, PagerDuty, or use Azure Monitor alerts.  

        - Ticketing systems: Use Azure Boards.

        - Source code repositories: Connect to GitHub or Azure DevOps.  

    1. Send a test incident to validate enrichment, RCA, and automation flow.

    1. Review incident context, RCA timeline, and proposed mitigations.
   :::column-end:::
:::row-end:::

## Considerations

Keep in mind the following considerations as you use Azure SRE Agent:

- English is the only supported language in the chat interface
- During preview, you can deploy the agent to the Sweden Central region, but the agent can monitor and remediate issues for services in any Azure region.
- For more information on how data is managed in Azure SRE Agent, see the [Microsoft privacy policy](https://www.microsoft.com/privacy/privacystatement).
- Availability varies by region/tenant configuration.  
- Preview [billing](billing.md) begins **September 1, 2025**, using Azure Agent Units (AAU).

## Preview access

Access to an SRE Agent is only available as in preview. To sign up for access, fill out the [SRE Agent application](https://go.microsoft.com/fwlink/?linkid=2319540).

By using an SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
