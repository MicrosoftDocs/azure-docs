---
title: Integrate and deploy Azure native services
description: Learn how to integrate and deploy Microsoft Azure native tools to monitor and manage your Azure VMware Solution workloads.
ms.topic: how-to
ms.date: 06/15/2021
---

# Integrate and deploy Azure native services

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) in a hybrid environment (Azure, Azure VMware Solution, and on-premises). The Azure native services that you can integrate with Azure VMware Solution include:

- **Log Analytics workspace:** Each workspace has its own data repository and configuration for storing log data. Data sources and solutions are configured to store their data in a specific workspace. Easily deploy the Log Analytics agent using Azure Arc enabled servers VM extension support for new and existing VMs. 
- **Azure Security Center:** Unified infrastructure security management system that strengthens security of data centers, and provides advanced threat protection across hybrid workloads in the cloud or on premises. It assesses the vulnerability of Azure VMware Solution VMs and raises alerts as needed. To enable Azure Security Center, see [Integrate Azure Security Center with Azure VMware Solution](azure-security-integration.md).
- **Azure Sentinel:** A cloud-native, security information event management (SIEM) solution. It provides security analytics, alert detection, and automated threat response across an environment. Azure Sentinel is built on top of a Log Analytics workspace.
- **Azure Arc:** Extends Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms. 
- **Azure Update Management:** Manages operating system updates for your Windows and Linux machines in a hybrid environment.
- **Azure Monitor:** Comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. It requires no deployment. 

In this article, you'll integrate Azure native services in your Azure VMware Solution private cloud. You'll also learn how to use the tools to manage your VMs throughout their lifecycle. 


## Enable Azure Update Management

[Azure Update Management](../automation/update-management/overview.md) in Azure Automation manages operating system updates for your Windows and Linux machines in a hybrid environment. It monitors patching compliance and forwards patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to your Log Analytics workspace to use stored data to assess the status of updates on your VMs.

1. [Create an Azure Automation account](../automation/automation-create-standalone-account.md). 

   >[!TIP]
   >You can [use an Azure Resource Manager (ARM) template to create an Automation account](../automation/quickstart-create-automation-account-template.md). Using an ARM template takes fewer steps compared to other deployment methods.

1. [Enable Update Management from an Automation account](../automation/update-management/enable-from-automation-account.md).  It links your Log Analytics workspace to your automation account. It also enables Azure and non-Azure VMs in Update Management.

   - If you have a workspace, select **Update management**. Then select the Log Analytics workspace, and Automation account and select **Enable**. The setup takes up to 15 minutes to complete.

   - If you want to create a new Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md). You can also create a workspace with [CLI](../azure-monitor/logs/quick-create-workspace-cli.md), [PowerShell](../azure-monitor/logs/powershell-workspace-configuration.md), or [Azure Resource Manager template](../azure-monitor/logs/resource-manager-workspace.md).
 
1. Once you've enabled Update Management, you can [deploy updates on VMs and review the results](../automation/update-management/deploy-updates.md). 

## Onboard VMs to Azure Arc enabled servers

Azure Arc extends Azure management to any infrastructure, including Azure VMware Solution and on-premises.  [Azure Arc enabled servers](../azure-arc/servers/overview.md) lets you manage your Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or another cloud provider.

For information on enabling Azure Arc enabled servers for multiple Windows or Linux VMs, see [Connect hybrid machines to Azure at scale](../azure-arc/servers/onboard-service-principal.md).

## Onboard hybrid Kubernetes clusters with Arc enabled Kubernetes

[Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md) lets you attach a Kubernetes cluster hosted in your Azure VMware Solution environment. 

For more information, see [Create an Azure Arc-enabled onboarding Service Principal](../azure-arc/kubernetes/create-onboarding-service-principal.md).

## Deploy the Log Analytics agent

You can monitor Azure VMware Solution VMs through the Log Analytics agent. Machines connected to the Log Analytics workspace use the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available for analysis.

Deploy the Log Analytics agent by using [Azure Arc enabled servers VM extension support](../azure-arc/servers/manage-vm-extensions.md).

## Enable Azure Monitor

[Azure Monitor](../azure-monitor/overview.md) is a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. Some of the added benefits of Azure Monitor include: 

   - Seamless monitoring 

   - Better infrastructure visibility 

   - Instant notifications 

   - Automatic resolution 

   - Cost efficiency 

You can collect data from different sources to monitor and analyze. For more information, see [Sources of monitoring data for Azure Monitor](../azure-monitor/agents/data-sources.md).  You can also collect different types of data for analysis, visualization, and alerting. For more information, see [Azure Monitor data platform](../azure-monitor/data-platform.md). 

You can monitor guest operating system performance and discover and map application dependencies for Azure VMware Solution or on-premises VMs. You can also create alert rules to identify issues in your environment, like high use of resources, missing patches, low disk space, and heartbeat of your VMs. You can set an automated response to detected events by sending an alert to IT Service Management (ITSM) tools. Alert detection notification can also be sent via email.


1. [Design your Azure Monitor Logs deployment](../azure-monitor/logs/design-logs-deployment.md)

1. [Enable Azure Monitor for VMs overview](../azure-monitor/vm/vminsights-enable-overview.md)

1. [Configure Log Analytics workspace for Azure Monitor for VMs](../azure-monitor/vm/vminsights-configure-workspace.md).

1. Create alert rules to identify issues in your environment:
   - [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md).
   - [Create, view, and manage log alerts using Azure Monitor](../azure-monitor/alerts/alerts-log.md).
   - [Action rules](../azure-monitor/alerts/alerts-action-rules.md) to set automated actions and notifications.
   - [Connect Azure to ITSM tools using IT Service Management Connector](../azure-monitor/alerts/itsmc-overview.md).
