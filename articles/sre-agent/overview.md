---
title: Overview of Azure SRE Agent Preview
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: overview
ms.date: 11/03/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Overview of Azure SRE Agent Preview
SRE Agent is designed to automate operational work and reduce toil, enabling developers and operators to focus on high-value tasks. By streamlining repetitive and complex processes, SRE Agent accelerates innovation and improves reliability across cloud and hybrid environments.
Typical operational tasks often include managing multiple Azure resources along with on-prem and SaaS systems. These tasks are often repetitive or require orchestrating together multiple tools to provide the insights you need. SRE Agent lets gives you AI-driven platform to connect to those systems together and automate the workflow end-to-end.

## What is SRE Agent?

SRE Agent is a service that brings automation and intelligence to site reliability engineering practices. It helps you reduce manual effort, improve system uptime, and deliver consistent operational outcomes. As the agent integrates with both Azure services and external systems, it executes operational tasks with minimal human intervention.

## Primary use cases

- **Automate incidents**: Connect to incident management platforms to automate triage, mitigation, and resolution, reducing mean time to recovery (MTTR) and improving service availability.

- **Automate scheduled workflows**: Set up proactive alerting and actions to automate routine and repetitive tasks that run on a defined schedule.

Watch the following video to see SRE Agent in action.

<br>

> [!VIDEO https://www.youtube.com/embed/DRWppVNOTqQ?si=FJ9dNk5uY1kUET-R]

## How Does It Work?

SRE Agent combines built-in expertise with full customization capabilities. Out of the box, it understands and manages Azure resources for specific services, providing intelligent defaults for common operational tasks. At the same time, it offers flexibility to incorporate domain-specific knowledge, custom runbooks, and integrations with tools and data sources such as observability and monitoring platforms. This extensibility ensures that SRE Agent can adapt to diverse environments and operational requirements.

## Integrations

Azure SRE Agent integrates with the following services:

- **Incidents and work**: [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview), [PagerDuty](https://www.pagerduty.com/), [ServiceNow](https://www.servicenow.com/)

- **Source code**: GitHub, Azure DevOps

## Get started

Use the following steps to start working with Azure SRE Agent.

# [Handle an incident](#tab/incident)

1. Enable integrations:  

    - Incident management tools: Link to ServiceNow, link to PagerDuty, or use Azure Monitor alerts.
  
    - Create a new incident response plan with custom instructions detailing how to handle incidents.

    - Ticketing systems: Azure Boards.

    - Source code repositories: Connect to GitHub or Azure DevOps.  

1. Send a test incident to validate enrichment, RCA, and automation flow.

1. Review incident context, RCA timeline, and proposed mitigations.

---

## Considerations

Keep in mind the following considerations as you use Azure SRE Agent:

- English is the only supported language in the chat interface.
- During the preview, you can deploy the agent to the *Sweden Central*, *East US 2*, and *Australia East* regions, but the agent can monitor and remediate issues for services in any Azure region.
- For more information on how data is managed in Azure SRE Agent, see the [Microsoft privacy policy](https://www.microsoft.com/privacy/privacystatement).
- Availability varies by region and tenant configuration.  
- Preview [billing](billing.md) begins *September 1, 2025*, via Azure agent units (AAUs).

When you create an agent, following resources are also automatically created for you:

- Azure Application Insights
- Log Analytics workspace
- Managed Identity

## Preview access

While access to SRE Agent was previously only available to customers via a waitlist, the agent is now available to all customers through the [Azure portal](https://aka.ms/sreagent/portal).

> [!NOTE]
> By using SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Next step

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
