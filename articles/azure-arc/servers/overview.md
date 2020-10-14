---
title: Azure Arc enabled servers Overview
description: Learn how to use Azure Arc enabled servers to manage servers hosted outside of Azure like an Azure resource.
keywords: azure automation, DSC, powershell, desired state configuration, update management, change tracking, inventory, runbooks, python, graphical, hybrid
ms.date: 09/16/2020
ms.topic: overview
---

# What is Azure Arc enabled servers?

Azure Arc enabled servers allows you to manage your Windows and Linux machines hosted outside of Azure, on your corporate network or other cloud provider, similar to how you manage native Azure virtual machines. When a hybrid machine is connected to Azure, it becomes a connected machine and is treated as a resource in Azure. Each connected machine has a Resource ID, is managed as part of a resource group inside a subscription, and benefits from standard Azure constructs such as Azure Policy and applying tags. Service providers who manage a customer's on-premises infrastructure can manage their hybrid machines, just like they do today with native Azure resources, across multiple customer environments, using [Azure Lighthouse](../../lighthouse/how-to/manage-hybrid-infrastructure-arc.md) with Azure Arc.

To deliver this experience with your hybrid machines hosted outside of Azure, the Azure Connected Machine agent needs to be installed on each machine that you plan on connecting to Azure. This agent does not deliver any other functionality, and it doesn't replace the Azure [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).

## Supported scenarios

When you connect your machine to Azure Arc enabled servers, it enables the ability to perform the following configuration management and monitoring tasks:

- Assign [Azure Policy guest configurations](../../governance/policy/concepts/guest-configuration.md) using the same experience as policy assignment for Azure virtual machines.

- Report on configuration changes about installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers using Azure Automation [Change Tracking and Inventory](../../automation/change-tracking/overview.md).

- Monitor your connected machine guest operating system performance, and discover application components to monitor their processes and dependencies with other resources the application communicates using [Azure Monitor for VMs](../../azure-monitor/insights/vminsights-overview.md).

- Simplify deployment with other Azure services like Azure Automation [State Configuration](../../automation/automation-dsc-overview.md) and Azure Monitor Log Analytics workspace using the supported [Azure VM extensions](manage-vm-extensions.md) for your non-Azure Windows or Linux machine. This includes performing post-deployment configuration or software installation using the Custom Script Extension.

- Use [Update Management](../../automation/update-management/update-mgmt-overview.md) in Azure Automation to manage operating system updates for your Windows and Linux servers. First deploy the [Hybrid Runbook worker](../../automation/automation-hybrid-runbook-worker.md) role and then follow the steps to [enable Update Management](../../automation/update-management/update-mgmt-enable-portal.md) on your non-Azure Windows or Linux machine.

- Include your non-Azure servers for threat detection and proactively monitor for potential security threats using [Azure Security Center](../../security-center/security-center-intro.md).

Log data collected and stored in a Log Analytics workspace from the hybrid machine now contains properties specific to the machine, such as a Resource ID. This can be used to support [resource-context](../../azure-monitor/platform/design-logs-deployment.md#access-mode) log access.

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## Supported regions

For a definitive list of supported regions with Azure Arc enabled servers, see the [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc) page.

In most cases, the location you select when you create the installation script should be the Azure region geographically closest to your machine's location. Data at rest will be stored within the Azure geography containing the region you specify, which may also affect your choice of region if you have data residency requirements. If the Azure region your machine is connected to is affected by an outage, the connected machine is not affected, but management operations using Azure may be unable to complete. In the event of a regional outage, if you have multiple locations that support a geographically redundant service, it is best to connect the machines in each location to a different Azure region.

### Agent status

The Connected Machine agent sends a regular heartbeat message to the service every 5 minutes. If the service stops receiving these heartbeat messages from a machine, that machine is considered offline and the status will automatically be changed to **Disconnected** in the portal within 15 to 30 minutes. Upon receiving a subsequent heartbeat message from the Connected Machine agent, its status will automatically be changed to **Connected**.

## Next steps

Before evaluating or enabling Arc enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
