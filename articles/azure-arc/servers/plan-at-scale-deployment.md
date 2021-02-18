---
title: How to plan for an at-scale deployment of Azure Arc enabled servers
description: Learn how to enable large number of machines to Azure Arc enabled servers and configure essential security, management, and monitoring capabilities in Azure.
ms.date: 02/17/2021
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

## Goals

* Verify your corporate policies allows the Azure Arc enabled servers agent to be installed and security controls permit the agents to run.

* Set up a Resource Health alert to know when an Arc enabled servers agent has stopped sending heartbeats to Azure.

* Set up an Azure Monitor alert to identify machines running outdated versions of the Arc agent.

* Identify machines compatible with Azure Arc enabled servers and confirm there aren't any naming conflicts.

* Decide on an approach for organizing machines into one or more resource groups and tagging.

* Establish how you'll assign Azure policies - at the subscription or resource group scope.

* Replace standalone agents with Azure Arc enabled servers extensions for simplified management and centralized reporting.

* Develop a migration plan for any machines that may relocate to Azure in the future.
