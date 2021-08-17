---
title: Azure Arc-enabled servers Overview
description: Learn how to use Azure Arc-enabled servers to manage servers hosted outside of Azure like an Azure resource.
ms.date: 08/12/2021
ms.topic: overview
---

# What is Azure Arc-enabled servers?

Azure Arc-enabled servers enables you to manage your Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or other cloud provider. This management experience is designed to be consistent with how you manage native Azure virtual machines. When a hybrid machine is connected to Azure, it becomes a connected machine and is treated as a resource in Azure. Each connected machine has a Resource ID enabling the machine to be included in a resource group. Now you can benefit from standard Azure constructs, such as Azure Policy and applying tags. Service providers managing a customer's on-premises infrastructure can manage their hybrid machines, just like they do today with native Azure resources, across multiple customer environments using [Azure Lighthouse](../../lighthouse/how-to/manage-hybrid-infrastructure-arc.md).

To deliver this experience with your hybrid machines, you need to install the Azure Connected Machine agent on each machine. This agent does not deliver any other functionality, and it doesn't replace the Azure [Log Analytics agent](../../azure-monitor/agents/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when:

* You want to proactively monitor the OS and workloads running on the machine,
* Manage it using Automation runbooks or solutions like Update Management, or
* Use other Azure services like [Azure Security Center](../../security-center/security-center-introduction.md).

>[!NOTE]
> The [Azure Monitor agent](../../azure-monitor/agents/azure-monitor-agent-overview.md) (AMA), which is currently in preview, does not replace the Connected Machine agent. The Azure Monitor agent will replace the Log Analytics agent, Diagnostics extension, and Telegraf agent for both Windows and Linux machines. Review the Azure Monitor documentation about the new agent for more details.

## Supported cloud operations 

When you connect your machine to Azure Arc-enabled servers, it enables the ability for you to perform the following operational functions as described in the following table.

|Operations function |Description | 
|--------------------|------------|
|**Govern** ||
| Azure Policy |Assign [Azure Policy guest configurations](../../governance/policy/concepts/guest-configuration.md) to audit settings inside the machine. To understand the cost of using Azure Policy Guest Configuration policies with Arc-enabled servers, see Azure Policy [pricing guide](https://azure.microsoft.com/pricing/details/azure-policy/)|
|**Protect** ||
| Azure Security Center | Protect non-Azure servers with [Microsoft Defender for Endpoint](/microsoft-365/security/endpoint-defender), included through [Azure Defender](../../security-center/defender-for-servers-introduction.md), for threat detection, for vulnerability management, and to proactively monitor for potential security threats. Azure Security Center presents the alerts and remediation suggestions from the threats detected. |
| Azure Sentinel | Machines connected to Arc-enabled servers can be [configured with Azure Sentinel](scenario-onboard-azure-sentinel.md) to collect security-related events and correlate them with other data sources. |
|**Configure** ||
| Azure Automation |Assess configuration changes about installed software, Microsoft services, Windows registry and files, and Linux daemons using [Change Tracking and Inventory](../../automation/change-tracking/overview.md).<br> Use [Update Management](../../automation/update-management/overview.md) to manage operating system updates for your Windows and Linux servers. |
| Azure Automanage | Onboard a set of Azure services when you use [Automanage Machine for Arc-enabled servers](../../automanage/automanage-arc.md). |
| VM extensions | Provides post-deployment configuration and automation tasks using supported [Arc-enabled servers VM extensions](manage-vm-extensions.md) for your non-Azure Windows or Linux machine. |
|**Monitor**|
| Azure Monitor | Monitor the connected machine guest operating system performance, and discover application components to monitor their processes and dependencies with other resources using [VM insights](../../azure-monitor/vm/vminsights-overview.md). Collect other log data, such as performance data and events, from the operating system or workload(s) running on the machine with the [Log Analytics agent](../../azure-monitor/agents/agents-overview.md#log-analytics-agent). This data is stored in a [Log Analytics workspace](../../azure-monitor/logs/design-logs-deployment.md). |

> [!NOTE]
> At this time, enabling Update Management directly from an Arc-enabled server is not supported. See [Enable Update Management from your Automation account](../../automation/update-management/enable-from-automation-account.md) to understand requirements and how to enable for your server.

Log data collected and stored in a Log Analytics workspace from the hybrid machine now contains properties specific to the machine, such as a Resource ID, to support [resource-context](../../azure-monitor/logs/design-logs-deployment.md#access-mode) log access.

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## Supported regions

For a definitive list of supported regions with Azure Arc-enabled servers, see the [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc) page.

In most cases, the location you select when you create the installation script should be the Azure region geographically closest to your machine's location. Data at rest is stored within the Azure geography containing the region you specify, which may also affect your choice of region if you have data residency requirements. If the Azure region your machine connects to is affected by an outage, the connected machine is not affected, but management operations using Azure may be unable to complete. If there is a regional outage, and if you have multiple locations that support a geographically redundant service, it is best to connect the machines in each location to a different Azure region.

The following metadata information about the connected machine is collected and stored in the region where the Azure Arc machine resource is configured:

- Operating system name and version
- Computer name
- Computer fully qualified domain name (FQDN)
- Connected Machine agent version

For example, if the machine is registered with Azure Arc in the East US region, this data is stored in the US region.

### Supported environments

Arc-enabled servers support the management of physical servers and virtual machines hosted *outside* of Azure. For specific details of which hybrid cloud environments hosting VMs are supported, see [Connected Machine agent prerequisites](agent-overview.md#supported-environments).

> [!NOTE]
> Arc-enabled servers is not designed or supported to enable management of virtual machines running in Azure.

### Agent status

The Connected Machine agent sends a regular heartbeat message to the service every 5 minutes. If the service stops receiving these heartbeat messages from a machine, that machine is considered offline and the status will automatically be changed to **Disconnected** in the portal within 15 to 30 minutes. Upon receiving a subsequent heartbeat message from the Connected Machine agent, its status will automatically be changed to **Connected**.

## Next steps

* Before evaluating or enabling Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
