---
title: Integrate and deploy Azure native services
description: Learn how to integrate and deploy Microsoft Azure native tools to monitor and manage your Azure VMware Solution workloads.
ms.topic: how-to
ms.date: 08/15/2021
---

# Integrate and deploy Azure native services

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) in a hybrid environment (Azure, Azure VMware Solution, and on-premises). In this article, you'll integrate Azure native services in your Azure VMware Solution private cloud. You'll also learn how to use the tools to manage your VMs throughout their lifecycle. 

The Azure native services that you can integrate with Azure VMware Solution include:

- **Azure Arc** extends Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms. [Azure Arc enabled servers](../azure-arc/servers/overview.md) lets you manage your Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or another cloud provider. You can attach a Kubernetes cluster hosted in your Azure VMware Solution environment using [Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md). 

- **[Azure Monitor](../azure-monitor/vm/vminsights-enable-overview.md)** collects, analyzes, and acts on telemetry from your cloud and on-premises environments. It requires no deployment.  You can monitor guest operating system performance to discover and map application dependencies for Azure VMware Solution or on-premises VMs. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. 

   With Azure Monitor, you can collect data from different [sources to monitor and analyze](../azure-monitor/agents/data-sources.md) and different types of [data for analysis, visualization, and alerting](../azure-monitor/data-platform.md). You can also create alert rules to identify issues in your environment, like high use of resources, missing patches, low disk space, and heartbeat of your VMs. You can set an automated response to detected events by sending an alert to IT Service Management (ITSM) tools. Alert detection notification can also be sent via email.

- **Azure Security Center** strengthens data centers' security and provides advanced threat protection across hybrid workloads in the cloud or on-premises. It assesses Azure VMware Solution VMs' vulnerability, raises alerts as needed, and forwards them to Azure Monitor for resolution. For instance, it assesses missing operating system patches, security misconfigurations, and [endpoint protection](../security-center/security-center-services.md). You can also define security policies in [Azure Security Center](azure-security-integration.md).

- **[Azure Update Management](../automation/update-management/overview.md)** manages operating system updates for your Windows and Linux machines in a hybrid environment in Azure Automation. It monitors patching compliance and forwards patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to your Log Analytics workspace to use stored data to assess the status of updates on your VMs.

- **Log Analytics workspace** stores log data. Each workspace has its own data repository and configuration to store data. You can monitor Azure VMware Solution VMs through the Log Analytics agent. Machines connected to the Log Analytics Workspace use the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available for analysis. Use the Azure Arc enabled servers [VM extensions support](../azure-arc/servers/manage-vm-extensions.md) to deploy Log Analytics agents on VMs. 






- **Azure Sentinel** provides security analytics, alert detection, and automated threat response across an environment. It's a cloud-native, security information event management (SIEM) solution  that's built on top of a Log Analytics Workspace.




## Topology

The diagram shows the integrated monitoring architecture for Azure VMware Solution VMs.

:::image type="content" source="media/concepts/integrated-azure-monitoring-architecture.png" alt-text="Diagram showing the integrated Azure monitoring architecture." border="false":::

**Log Analytics agent** collects log data from Azure, Azure VMware Solution, and on-premises VMs. The log data is sent to Azure Monitor Logs and stored in a **Log Analytics Workspace**. Each workspace has its own data repository and configuration to store data.   Once the logs are collected, **Azure Security Center** assesses the vulnerability status of Azure VMware Solution VMs and raises an alert for any critical vulnerability. Once assessed, Azure Security Center forwards the vulnerability status to Azure Sentinel to create an incident and map with other threats.  Azure Security Center is connected to Azure Sentinel using Azure Security Center Connector. 






## Enable Azure Update Management


1. [Create an Azure Automation account](../automation/automation-create-standalone-account.md). 

   >[!TIP]
   >You can [use an Azure Resource Manager (ARM) template to create an Automation account](../automation/quickstart-create-automation-account-template.md). Using an ARM template takes fewer steps compared to other deployment methods.

1. [Enable Update Management from an Automation account](../automation/update-management/enable-from-automation-account.md).  It links your Log Analytics workspace to your automation account. It also enables Azure and non-Azure VMs in Update Management.

   - If you have a workspace, select **Update management**. Then select the Log Analytics workspace, and Automation account and select **Enable**. The setup takes up to 15 minutes to complete.

   - If you want to create a new Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md). You can also create a workspace with [CLI](../azure-monitor/logs/quick-create-workspace-cli.md), [PowerShell](../azure-monitor/logs/powershell-workspace-configuration.md), or [Azure Resource Manager template](../azure-monitor/logs/resource-manager-workspace.md).
 
1. Once you've enabled Update Management, you can [deploy updates on VMs and review the results](../automation/update-management/deploy-updates.md). 



## Onboard VMs to Azure Arc enabled servers



For information on enabling Azure Arc enabled servers for multiple Windows or Linux VMs, see [Connect hybrid machines to Azure at scale](../azure-arc/servers/onboard-service-principal.md).









## Onboard hybrid Kubernetes clusters with Arc enabled Kubernetes



For more information, see [Create an Azure Arc-enabled onboarding Service Principal](../azure-arc/kubernetes/create-onboarding-service-principal.md).



## Deploy the Log Analytics agent


Deploy the Log Analytics agent by using [Azure Arc enabled servers VM extension support](../azure-arc/servers/manage-vm-extensions.md).



## Enable Azure Monitor




1. [Design your Azure Monitor Logs deployment](../azure-monitor/logs/design-logs-deployment.md)

1. [Enable Azure Monitor for VMs overview](../azure-monitor/vm/vminsights-enable-overview.md)

1. [Configure Log Analytics workspace for Azure Monitor for VMs](../azure-monitor/vm/vminsights-configure-workspace.md).

1. Create alert rules to identify issues in your environment:
   - [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md).
   - [Create, view, and manage log alerts using Azure Monitor](../azure-monitor/alerts/alerts-log.md).
   - [Action rules](../azure-monitor/alerts/alerts-action-rules.md) to set automated actions and notifications.
   - [Connect Azure to ITSM tools using IT Service Management Connector](../azure-monitor/alerts/itsmc-overview.md).


## Next steps

Now that you've covered Azure VMware Solution network and interconnectivity concepts, you may want to learn about:

- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
- [Integrate Azure Security Center with Azure VMware Solution](azure-security-integration.md)
- [Automation account authentication](../automation/automation-security-overview.md)
- [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/design-logs-deployment.md) and [Azure Monitor](../azure-monitor/overview.md)
- [Azure Security Center planning](../security-center/security-center-planning-and-operations-guide.md) and [Supported platforms for Security Center](../security-center/security-center-os-coverage.md)