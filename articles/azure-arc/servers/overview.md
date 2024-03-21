---
title: Azure Arc-enabled servers Overview
description: Learn how to use Azure Arc-enabled servers to manage servers hosted outside of Azure like an Azure resource.
ms.date: 05/11/2023
ms.topic: overview
---

# What is Azure Arc-enabled servers?

Azure Arc-enabled servers lets you manage Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or other cloud provider. For the purposes of Azure Arc, these machines hosted outside of Azure are considered hybrid machines. The management of hybrid machines in Azure Arc is designed to be consistent with how you manage native Azure virtual machines, using standard Azure constructs such as Azure Policy and applying tags. (For additional information about hybrid environments, see [What is a hybrid cloud?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-hybrid-cloud-computing))

When a hybrid machine is connected to Azure, it becomes a connected machine and is treated as a resource in Azure. Each connected machine has a Resource ID enabling the machine to be included in a resource group.

To connect hybrid machines to Azure, you install the [Azure Connected Machine agent](agent-overview.md) on each machine. This agent doesn't replace the Azure [Log Analytics agent](../../azure-monitor/agents/log-analytics-agent.md) / [Azure Monitor Agent](../../azure-monitor/agents/azure-monitor-agent-overview.md). The Log Analytics agent or Azure Monitor Agent for Windows and Linux is required in order to:

* Proactively monitor the OS and workloads running on the machine
* Manage it using Automation runbooks or solutions like Update Management
* Use other Azure services like [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)

You can install the Connected Machine agent manually, or on multiple machines at scale, using the [deployment method](deployment-options.md) that works best for your scenario.

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## Supported cloud operations

When you connect your machine to Azure Arc-enabled servers, you can perform many operational functions, just as you would with native Azure virtual machines. Below are some of the key supported actions for connected machines.

* **Govern**:
  * Assign [Azure machine configurations](../../governance/machine-configuration/overview.md) to audit settings inside the machine. To understand the cost of using Azure Machine Configuration policies with Arc-enabled servers, see Azure Policy [pricing guide](https://azure.microsoft.com/pricing/details/azure-policy/).
* **Protect**:
  * Protect non-Azure servers with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint), included through [Microsoft Defender for Cloud](../../security-center/defender-for-servers-introduction.md), for threat detection, for vulnerability management, and to proactively monitor for potential security threats. Microsoft Defender for Cloud presents the alerts and remediation suggestions from the threats detected.
  * Use [Microsoft Sentinel](scenario-onboard-azure-sentinel.md) to collect security-related events and correlate them with other data sources.
* **Configure**:
  * Use [Azure Automation](../../automation/extension-based-hybrid-runbook-worker-install.md?tabs=windows) for frequent and time-consuming management tasks using PowerShell and Python [runbooks](../../automation/automation-runbook-execution.md). Assess configuration changes for installed software, Microsoft services, Windows registry and files, and Linux daemons using [Change Tracking and Inventory](../../automation/change-tracking/overview.md)
  * Use [Update Management](../../automation/update-management/overview.md) to manage operating system updates for your Windows and Linux servers. Automate onboarding and configuration of a set of Azure services when you use [Azure Automanage (preview)](../../automanage/automanage-arc.md).
  * Perform post-deployment configuration and automation tasks using supported [Arc-enabled servers VM extensions](manage-vm-extensions.md) for your non-Azure Windows or Linux machine.
* **Monitor**:
  * Monitor operating system performance and discover application components to monitor processes and dependencies with other resources using [VM insights](../../azure-monitor/vm/vminsights-overview.md).
  * Collect other log data, such as performance data and events, from the operating system or workloads running on the machine with the [Log Analytics agent](../../azure-monitor/agents/log-analytics-agent.md). This data is stored in a [Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md).

> [!NOTE]
> At this time, enabling Azure Automation Update Management directly from an Azure Arc-enabled server is not supported. See [Enable Update Management from your Automation account](../../automation/update-management/enable-from-automation-account.md) to understand requirements and [how to enable Update Management for non-Azure VMs](../../automation/update-management/enable-from-automation-account.md#enable-non-azure-vms).

Log data collected and stored in a Log Analytics workspace from the hybrid machine contains properties specific to the machine, such as a Resource ID, to support [resource-context](../../azure-monitor/logs/manage-access.md#access-mode) log access.

Watch this video to learn more about Azure monitoring, security, and update services across hybrid and multicloud environments.

> [!VIDEO https://www.youtube.com/embed/mJnmXBrU1ao]

## Supported regions

For a list of supported regions with Azure Arc-enabled servers, see the [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc) page.

In most cases, the location you select when you create the installation script should be the Azure region geographically closest to your machine's location. Data at rest is stored within the Azure geography containing the region you specify, which may also affect your choice of region if you have data residency requirements. If the Azure region your machine connects to has an outage, the connected machine isn't affected, but management operations using Azure may be unable to complete. If there's a regional outage, and if you have multiple locations that support a geographically redundant service, it's best to connect the machines in each location to a different Azure region.

[Instance metadata information about the connected machine](agent-overview.md#instance-metadata) is collected and stored in the region where the Azure Arc machine resource is configured, including the following:

* Operating system name and version
* Computer name
* Computers fully qualified domain name (FQDN)
* Connected Machine agent version

For example, if the machine is registered with Azure Arc in the East US region, the metadata is stored in the US region.

## Supported environments

Azure Arc-enabled servers support the management of physical servers and virtual machines hosted *outside* of Azure. For specific details about supported hybrid cloud environments hosting VMs, see [Connected Machine agent prerequisites](prerequisites.md#supported-environments).

> [!NOTE]
> Azure Arc-enabled servers is not designed or supported to enable management of virtual machines running in Azure.

## Agent status

The status for a connected machine can be viewed in the Azure portal under **Azure Arc > Servers**.

The Connected Machine agent sends a regular heartbeat message to the service every five minutes. If the service stops receiving these heartbeat messages from a machine, that machine is considered offline, and its status will automatically be changed to **Disconnected** within 15 to 30 minutes. Upon receiving a subsequent heartbeat message from the Connected Machine agent, its status will automatically be changed back to **Connected**.

If a machine remains disconnected for 45 days, its status may change to **Expired**. An expired machine can no longer connect to Azure and requires a server administrator to disconnect and then reconnect it to Azure to continue managing it with Azure Arc. The exact date upon which a machine expires is determined by the expiration date of the managed identity's credential, which is valid up to 90 days and renewed every 45 days.

## Service limits

There's no limit to how many Arc-enabled servers and VM extensions you can deploy in a resource group or subscription. The standard 800 resource limit per resource group applies to the Azure Arc Private Link Scope resource type.

To learn more about resource type limits, see the [Resource instance limit](../../azure-resource-manager/management/resources-without-resource-group-limit.md#microsofthybridcompute) article.

## Data residency

Azure Arc-enabled servers stores customer data. By default, customer data stays within the region the customer deploys the service instance in. For region with data residency requirements, customer data is always kept within the same region.

## Disaster Recovery

There are no customer-enabled disaster recovery options for Arc-enabled servers. In the event of an outage in an Azure region, the system will failover to another region in the same [Azure geography](https://azure.microsoft.com/explore/global-infrastructure/geographies/) (if one exists). While this failover procedure is automatic, it does take some time. The Connected Machine agent will be disconnected during this period and will show a status of **Disconnected** until the failover is complete. The system will failback to its original region once the outage has been restored.

An outage of Azure Arc won't affect the customer workload itself; only management of the applicable servers via Arc will be impaired.

## Next steps

* Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review the [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
* Try out Arc-enabled servers by using the [Azure Arc Jumpstart](https://azurearcjumpstart.com/azure_arc_jumpstart/azure_arc_servers).
* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
* Explore the [Azure Arc landing zone accelerator for hybrid and multicloud](/azure/cloud-adoption-framework/scenarios/hybrid/arc-enabled-servers/eslz-identity-and-access-management).
