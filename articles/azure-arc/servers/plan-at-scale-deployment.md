---
title: How to plan for an at-scale deployment of Azure Arc enabled servers
description: Learn how to enable large number of machines to Azure Arc enabled servers and configure essential security, management, and monitoring capabilities in Azure.
ms.date: 02/19/2021
ms.topic: conceptual
---

# Planing for an at-scale deployment of Azure Arc enabled servers

Deployment of an IT infrastructure service or business application is a challenge for any company. In order to execute it well and avoid any unwelcome surprises and unplanned costs, you need to thoroughly plan for it to ensure that you're as ready as possible. To plan for deploying Azure Arc enabled servers at-scale, it should cover the design and deployment criteria that needs to be met in order to successfully complete the tasks to support an at-scale deployment.

For the deployment to proceed smoothly, your plan should establish a clear understanding of:

* Roles and responsibilities.
* Inventory of physical servers or virtual machines to verify they meet network and system requirements.
* The skill set and training required to enable successful deployment and on-going management.
* Acceptance criteria and how you track its success.
* Tools or methods to be used to automate the deployments.
* Identified risks and mitigation plans to avoid delays, disruptions, etc.
* How to avoid disruption during deployment.
* What's the escalation path when a significant issue occurs?

The purpose of this article is to ensure you are prepared for a successful deployment of Azure Arc enabled servers across multiple production physical servers or virtual machines in your environment.

## Prerequisites

* Your machines run a [supported operating system](agent-overview.md#supported-operating-systems) for the Connected Machine agent.
* Your machines have connectivity from your on-premises network or other cloud environment to resources in Azure, either directly or through a proxy server.
* To install and configure the Arc enabled servers Connected Machine agent, an account with elevated (that is, an administrator or as root) privileges on the machines.
* To onboard machines, you are a member of the **Azure Connected Machine Onboarding** role.
* To read, modify, and delete a machine, you are a member of the **Azure Connected Machine Resource Administrator** role.

## Phase 1: Build a foundation

In this phase, system engineers or administrators enable the core features in their organizations Azure subscription to start the foundation before enabling your machines for management by Arc enabled servers and other Azure services.

|Task |Detail |
|-----|-------|
| [Create a resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) | A dedicated resource group to include only Arc enabled servers and centralize management and monitoring of these resources. |
| Apply [Tags](../../azure-resource-manager/management/tag-resources.md) to help organize machines. | Evaluate and develop an IT-aligned tagging strategy that can help reduce the complexity of managing your Arc enabled servers and simplify making management decisions. |
| Design or deploy [Azure Monitor Logs](../../azure-monitor/logs/data-platform-logs.md) | Evaluate [design and deployment considerations](../../azure-monitor/logs/design-logs-deployment.md) to determine if your organization should use an existing or implement another Log Analytics workspace to store collected log data from hybrid servers and machines. |
| [Develop an Azure Policy](../../governance/policy/overview.md) governance plan | Determine how you will implement governance of hybrid servers and machines at the subscription or resource group scope with Azure Policy. |
| Configure [Role based access control](../../role-based-access-control/overview.md) (RBAC)| 

