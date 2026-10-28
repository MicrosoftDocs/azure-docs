---
title: Use Azure Copilot Resiliency Agent in Infrastructure Resiliency Manager
description: Learn how to use Azure Copilot Resiliency Agent to design, assess, and improve the zone resilience of Azure workloads.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 10/12/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to use Azure Copilot Resiliency Agent to design resilient applications and improve the zone resilience of existing workloads.
---

# Use Azure Copilot Resiliency Agent in Infrastructure Resiliency Manager (preview)

Azure Copilot Resiliency Agent is an AI-powered assistant integrated into Azure Copilot. Use natural language to design resilient applications, understand the resilience posture of existing Azure workloads, get actionable recommendations, and remediate resilience gaps.

The agent supports two primary capability areas:

- **Start Resilient** helps you build resilience into applications before deployment.
- **Get Resilient** helps you assess and improve workloads that are already running in Azure.

## Prerequisites

- An Azure subscription.
- Access to the Azure resources you want the agent to assess or manage.
- Access to Azure Copilot and its agents. Administrators can [manage access to Azure Copilot and agents](/azure/copilot/manage-access).

## Open the Resiliency Agent

You can open the agent from Azure Copilot or from the Resiliency experience.

### Open from Azure Copilot

1. In the [Azure portal](https://portal.azure.com/), select the **Copilot** icon in the portal header.
2. In the agent selector at the top of the Copilot pane, select **Resiliency**.
3. Select a suggested prompt or enter your own question.

### Open from Resiliency

On the **Resiliency** overview pane, select one of the top actions for a common resilience workflow. The Azure Copilot pane opens with the Resiliency Agent selected and a relevant prompt.

The agent maintains context across turns, so you can move from assessment to remediation without repeating the application context.

## Start Resilient for new applications

Describe your proposed application architecture in natural language. The agent analyzes the topology, identifies relevant resilience practices, and generates recommendations tailored to the resources in the architecture.

The agent can also generate deployment-ready Bicep templates that have recommended resilience configurations enabled.

Sample prompts include:

- *My app has a VM, a PostgreSQL database, and a load balancer. Help me start my resilient journey.*
- *I'm building an application with AKS, Redis, Storage, and Cosmos DB. What should I do to make it resilient?*
- *Generate a Bicep template for a zone-resilient VM setup.*
- *Create Bicep templates for a resilient architecture with VMs, AKS, and Storage.*

## Get Resilient for existing applications

Use the agent to assess and improve the zone resilience of workloads that are already running in Azure.

### Check resilience and prerequisites

Ask whether an individual resource or an entire service group is zone-resilient. The agent returns the current resilience status and relevant configuration details. It can also identify blockers such as regional limitations, permissions, and configuration dependencies.

Sample prompts include:

- *Is my VM zone-resilient?*
- *Get the zone resilience posture of my service group.*
- *What are the prerequisites to make my VM zone-resilient?*

### Enable resilience and generate scripts

For resource types that support in-place conversion, the agent can enable zone resilience after you confirm the change. For resources that require redeployment, such as virtual machines, the agent provides migration guidance and scripts instead of changing the resource.

The agent can generate enablement scripts in Azure PowerShell, Azure CLI, Bicep, Terraform, and Azure Resource Manager template formats.

Sample prompts include:

- *Enable zone resilience for my PostgreSQL server.*
- *How do I make my storage account zone-redundant?*
- *Give me scripts to enable zone resilience for my resources.*

> [!IMPORTANT]
> Review and validate all recommendations, scripts, templates, and proposed changes before you use them in a production environment. Resource-changing operations require your confirmation.

### Organize resources and track goals

The agent can create service groups, add resources to them, set zone resilience goals, check goal compliance, exclude resources, and refresh compliance after configuration changes.

For an end-to-end workflow, ask the agent to:

1. Create a service group for your application.
2. Set zone resilience goals.
3. Check the resilience posture.
4. Fix identified problems or generate scripts for remediation.

For more information about these workflows, see [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md) and [Review recommendations](goals-recommendations-review-recommendations.md).

## Known limitations

- The agent is optimized for zone resilience. Regional resilience and other resilience dimensions aren't currently supported.
- The **Start Resilient** template-generation flow currently supports Bicep.
- Operations can take longer for large service groups or complex application architectures.
- Results depend on the resource metadata available to the agent and the signed-in user's permissions.
- AI-generated output can be incomplete or inaccurate and isn't authoritative.

## Related content

- [Transparency frequently asked questions for Azure Copilot Resiliency Agent](resiliency-agent-transparency.md)
- [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md)
- [Review recommendations](goals-recommendations-review-recommendations.md)
