---
title: Azure Arc for servers (preview) Overview
description: Learn how to use Azure Arc for servers to manage machines that are hosted outside of Azure as if it is an Azure resource.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
keywords: azure automation, DSC, powershell, desired state configuration, update management, change tracking, inventory, runbooks, python, graphical, hybrid
ms.date: 03/24/2020
ms.topic: overview
---

# What is Azure Arc for servers (preview)?

Azure Arc for servers (preview) allows you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud provider, similarly to how you manage native Azure virtual machines. When a hybrid machine is connected to Azure, it becomes a connected machine and is treated as a resource in Azure. Each connected machine has a Resource ID, is managed as part of a resource group inside a subscription, and benefits from standard Azure constructs such as Azure Policy and applying tags.

To deliver this experience with your hybrid machines hosted outside of Azure, the Azure Connected Machine agent needs to be installed on each machine that you plan on connecting to Azure. This agent does not deliver any other functionality, and it doesn't replace the Azure [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).

>[!NOTE]
>This preview release is intended for evaluation purposes and we recommend you don't manage critical production machines.
>

## Supported scenarios

Azure Arc for servers (preview) supports the following scenarios with connected machines:

- Assign [Azure Policy guest configurations](../../governance/policy/concepts/guest-configuration.md) using the same experience as policy assignment for Azure virtual machines.
- Log data collected by the Log Analytics agent, stored in the Log Analytics workspace the machine is registered. The log data from the hybrid machine now contains properties specific to the machine, such as a Resource ID, which can be used to support [resource-context](../../azure-monitor/platform/design-logs-deployment.md#access-mode) log access.

## Supported regions

With Azure Arc for servers (preview), only certain regions are supported:

- EastUS
- WestUS2
- WestEurope
- SoutheastAsia

In most cases, the location you select when you create the installation script should be the Azure region geographically closest to your machine's location. Data at rest will be stored within the Azure geography containing the region you specify, which may also affect your choice of region if you have data residency requirements. If the Azure region your machine is connected to is affected by an outage, the connected machine is not affected, but management operations using Azure may be unable to complete. For resilience in the event of a regional outage, if you have multiple locations which provide a geographically-redundant service, it is best to connect the machines in each location to a different Azure region.

### Agent status

The Connected Machine agent sends a regular heartbeat message to the service every 5 minutes. If the service stops receiving these heartbeat messages from a machine, that machine is considered offline and the status will automatically be changed to **Disconnected** in the portal within 15 to 30 minutes. Upon receiving a subsequent heartbeat message from the Connected Machine agent, its status will automatically be changed to **Connected**.

## Next steps

Before evaluating or enabling Arc for servers (preview) across multiple hybrid machines, review the [Connected Machine agent overview](agent-overview.md) article to understand what is required, technical details about the agent, and deployment methods.
