---
title: Overview of Azure SRE Agent Preview
description: Learn how AI-enabled agents help solve problems and support resilient and self-healing systems on your behalf.
author: craigshoemaker
ms.topic: overview
ms.date: 08/08/2025
ms.author: cshoe
ms.service: azure
---

# What is Azure SRE Agent Preview?

Azure SRE Agent Preview is an AI-powered service that helps you monitor, manage, and maintain your Azure resources with minimal human intervention. The service's agent combines AI with Azure and engineering best practices for site reliability. The agent proactively identifies problems, provides actionable insights, and even performs remediation tasks to help you attain maximum uptime for your critical cloud services.

As an automated tool, the agent continuously monitors your resources, analyzes performance data, and responds to incidents in real time. Whether you're troubleshooting application problems, deploying new services, or maintaining existing infrastructure, SRE Agent reduces operational toil so you can focus on higher-value work.

> [!NOTE]
> SRE Agent is in preview and is available only to customers on the waitlist. To sign up for the waitlist, fill out [this application](https://go.microsoft.com/fwlink/?linkid=2319540).
>
> By using SRE Agent, you consent to the product-specific [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Features

Azure SRE Agent has the following key features:

* **Specialized AI-enabled tooling**: SRE Agent offers fine-tuned tools that help you manage and maintain Azure services according to architectural and security best practices. The agent handles manual and mundane tasks while maintaining a continuous context of your Azure services and environments. This environmental awareness enables the agent to quickly identify root causes and troubleshoot problems for you.

* **Conversational chat interface**: By gathering responses to your prompts, you can use the agent to troubleshoot and resolve application problems, deploy Azure services, and delegate work to autonomous agents. You can accomplish all those activities in a chat window.

* **Incident management**: You can configure the agent to be the first to respond to incidents in your environment. By pairing SRE Agent with [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview), [PagerDuty](https://www.pagerduty.com/) or [ServiceNow](https://www.servicenow.com/), you can define custom resolution workflows to quickly resolve problems. Depending on your configuration, the agent can fix problems upon your approval or work autonomously.

* **Continuous, proactive monitoring**: The agent continuously evaluates activity in your environments to monitor active resources. The agent maintains a knowledge graph of your Azure infrastructure to maintain relationships between resources and dependencies.

* **Source code integration**: When you connect your Azure resources to Azure DevOps or GitHub repositories through SRE Agent, the agent can help pinpoint root causes in your code base. If you connect a resource to a GitHub repository, the agent can delegate fixes to GitHub Copilot.

## Daily uses for the agent

Azure SRE Agent serves as a virtual site reliability engineer in helping you maintain and optimize your Azure resources. Here's how you can use the agent on a daily basis:

* **Incident response**: When your monitoring systems trigger alerts, interact with the agent through the chat interface to quickly diagnose problems. The agent can analyze a problem, suggest mitigations, and (with your approval) implement fixes automatically.

* **Proactive maintenance**: Use the agent to identify optimization opportunities in your environment. Ask questions like "Which of my apps need configuration improvements?" or "Are any resources not following security best practices?"

* **Daily briefings**: Start your day by reviewing the daily resource report that the agent automatically generates. This report provides a snapshot of your environment's health. It highlights any incidents that occurred overnight and their current status.

  :::image type="content" source="media/overview/azure-sre-agent-activities-screenshot.png" alt-text="Screenshot of an Azure SRE Agent report summary.":::

* **Resource management**: Delegate routine tasks like scaling resources, reviewing configurations, or checking on service health by asking the agent through the chat interface. The agent monitors and maintains any Azure resources in resource groups that the agent manages.

* **Resource visualization**: When you need to understand relationships between resources or troubleshoot dependencies, ask the agent to visualize your infrastructure and explain connections between services. You can review the resource visualization that the agent maintains in the Azure portal.

  :::image type="content" source="media/overview/resources.png" alt-text="Screenshot of an SRE Agent knowledge graph." lightbox="media/overview/resources.png":::

## Supported services

Although Azure SRE Agent can help you monitor, maintain, and manage any Azure service, the agent features specialized tools for managing the following services:

:::row:::
   :::column span="":::
    - Azure API Management
    - Azure App Service
    - Azure Cache for Redis
    - Azure Container Apps
    - Azure Cosmos DB
    - Azure Database for PostgreSQL
   :::column-end:::
   :::column span="":::
    - Azure Functions
    - Azure Kubernetes Service
    - Azure SQL
    - Azure Storage
    - Azure Virtual Machines
   :::column-end:::
:::row-end:::

To get the latest list of services with custom agent tooling, submit the following prompt to the agent:

```text
Which Azure services do you have specialized tooling available for?
```

## Considerations

Keep in mind the following considerations as you use Azure SRE Agent:

* English is the only supported language in the chat interface.
* During the preview, you can deploy the agent to the Sweden Central region, but the agent can monitor and remediate problems for services in any Azure region.
* For more information on how data is managed in SRE Agent, see the [Microsoft privacy statement](https://www.microsoft.com/privacy/privacystatement).

## Next step

> [!div class="nextstepaction"]
> [Use an agent](./usage.md)
