---
title: Monitor and protect VMs with Azure native services
description: Learn how to integrate and deploy Microsoft Azure native tools to monitor and manage your Azure VMware Solution workloads.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 08/15/2021
---

# Monitor and protect VMs with Azure native services

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) in a hybrid environment (Azure, Azure VMware Solution, and on-premises). In this article, you'll integrate Azure native services in your Azure VMware Solution private cloud. You'll also learn how to use the tools to manage your VMs throughout their lifecycle.

The Azure native services that you can integrate with Azure VMware Solution include:

- **Azure Arc** extends Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms. [Azure Arc-enabled servers](../azure-arc/servers/overview.md) lets you manage your Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or another cloud provider. You can attach a Kubernetes cluster hosted in your Azure VMware Solution environment using [Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md). 

- **Azure Monitor** collects, analyzes, and acts on telemetry from your cloud and on-premises environments. It requires no deployment.  You can monitor guest operating system performance to discover and map application dependencies for Azure VMware Solution or on-premises VMs. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. 

   With Azure Monitor, you can collect data from different [sources to monitor and analyze](../azure-monitor/data-sources.md) and different types of [data for analysis, visualization, and alerting](../azure-monitor/data-platform.md). You can also create alert rules to identify issues in your environment, like high use of resources, missing patches, low disk space, and heartbeat of your VMs. You can set an automated response to detected events by sending an alert to IT Service Management (ITSM) tools. Alert detection notification can also be sent via email.

- **Microsoft Defender for Cloud** strengthens data centers' security and provides advanced threat protection across hybrid workloads in the cloud or on-premises. It assesses Azure VMware Solution VMs' vulnerability, raises alerts as needed, and forwards them to Azure Monitor for resolution. For instance, it assesses missing operating system patches, security misconfigurations, and [endpoint protection](../security-center/security-center-services.md). You can also define security policies in [Microsoft Defender for Cloud](azure-security-integration.md).

- **Azure Update Management** manages operating system updates for your Windows and Linux machines in a hybrid environment in Azure Automation. It monitors patching compliance and forwards patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to your Log Analytics workspace to use stored data to assess the status of updates on your VMs.

- **Log Analytics workspace** stores log data. Each workspace has its own data repository and configuration to store data. You can monitor Azure VMware Solution VMs through the Log Analytics agent. Machines connected to the Log Analytics Workspace use the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available for analysis. Use the Azure Arc enabled servers [VM extensions support](../azure-arc/servers/manage-vm-extensions.md) to deploy Log Analytics agents on VMs.

## Benefits

- Azure native services can be used to manage your VMs in a hybrid environment (Azure, Azure VMware Solution, and on-premises).
- Integrated monitoring and visibility of your Azure, Azure VMware Solution, and on-premises VMs.
- With Azure Update Management in Azure Automation, you can manage operating system updates for both your Windows and Linux machines.
- Microsoft Defender for Cloud provides advanced threat protection, including:
  - File integrity monitoring
  - Fileless security alerts
  - Operating system patch assessment
  - Security misconfigurations assessment
  - Endpoint protection assessment
- Easily deploy the Log Analytics agent using Azure Arc enabled servers VM extension support for new and existing VMs.
- Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. Collect data and logs to a single point and present that data to different Azure native services.
- Added benefits of Azure Monitor include:
  - Seamless monitoring
  - Better infrastructure visibility
  - Instant notifications
  - Automatic resolution
  - Cost efficiency

## Topology

The diagram shows the integrated monitoring architecture for Azure VMware Solution VMs.

:::image type="content" source="media/concepts/integrated-azure-monitoring-architecture.png" alt-text="Diagram showing the integrated Azure monitoring architecture." border="false":::

The Log Analytics agent enables collection of log data from Azure, Azure VMware Solution, and on-premises VMs. The log data is sent to Azure Monitor Logs and stored in a Log Analytics workspace. You can deploy the Log Analytics agent using Arc enabled servers [VM extensions support](../azure-arc/servers/manage-vm-extensions.md) for new and existing VMs.

Once the Log Analytics workspace collects the logs, you can configure the Log Analytics workspace with Defender for Cloud to assess the vulnerability status of Azure VMware Solution VMs and raise an alert for any critical vulnerability.  For instance, it assesses missing operating system patches, security misconfigurations, and [endpoint protection](../security-center/security-center-services.md).

You can configure the Log Analytics workspace with Microsoft Sentinel for alert detection, threat visibility, hunting, and threat response. In the preceding diagram, Defender for Cloud is connected to Microsoft Sentinel using the Defender for Cloud connector. Defender for Cloud forwards the environment vulnerability to Microsoft Sentinel to create an incident and map with other threats. You can also create the scheduled rules query to detect unwanted activity and convert it to the incidents.

## Before you start

If you are new to Azure or unfamiliar with any of the services previously mentioned, review the following articles:

- [Automation account authentication overview](../automation/automation-security-overview.md)
- [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/workspace-design.md) and [Azure Monitor](../azure-monitor/overview.md)
- [Planning](../security-center/security-center-planning-and-operations-guide.md) and [Supported platforms](../security-center/security-center-os-coverage.md) for Microsoft Defender for Cloud
- [Enable Azure Monitor for VMs overview](../azure-monitor/vm/vminsights-enable-overview.md)
- [What is Azure Arc enabled servers?](../azure-arc/servers/overview.md) and [What is Azure Arc enabled Kubernetes?](../azure-arc/kubernetes/overview.md)
- [Update Management overview](../automation/update-management/overview.md)



## Enable Azure Update Management

[Azure Update Management](../automation/update-management/overview.md) in Azure Automation manages operating system updates for your Windows and Linux machines in a hybrid environment. It monitors patching compliance and forwards patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to your Log Analytics workspace to use stored data to assess the status of updates on your VMs.

1. Before you can add Log Analytics Workspace to Azure Update Management, you first need to [Create an Azure Automation account](../automation/automation-create-standalone-account.md). 

   >[!TIP]
   >You can [use an Azure Resource Manager (ARM) template to create an Automation account](../automation/quickstart-create-automation-account-template.md). Using an ARM template takes fewer steps compared to other deployment methods.

1. [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md). If you prefer, you can also create a workspace via [CLI](../azure-monitor/logs/resource-manager-workspace.md), [PowerShell](../azure-monitor/logs/powershell-workspace-configuration.md), or [Azure Resource Manager template](../azure-monitor/logs/resource-manager-workspace.md).

1. [Enable Update Management from an Automation account](../automation/update-management/enable-from-automation-account.md). In the process, you'll link your Log Analytics workspace with your automation account. 
 
1. Once you've enabled Update Management, you can [deploy updates on VMs and review the results](../automation/update-management/deploy-updates.md). 

## Enable Microsoft Defender for Cloud

Assess the vulnerability of Azure VMware Solution VMs and raise alerts as needed. These security alerts can be forwarded to Azure Monitor for resolution. For more information, see [Supported features for VMs](../security-center/security-center-services.md).

Defender for Cloud offers many features, including:

- File integrity monitoring
- Fileless attack detection
- Operating system patch assessment
- Security misconfigurations assessment
- Endpoint protection assessment

>[!NOTE]
>Microsoft Defender for Cloud is a pre-configured tool that doesn't require deployment, but you'll need to enable it in the Azure portal.

1. [Add Azure VMware Solution VMs to Defender for Cloud](azure-security-integration.md#add-azure-vmware-solution-vms-to-defender-for-cloud).

2. [Enable Microsoft Defender for Cloud](../security-center/enable-azure-defender.md). Defender for Cloud assesses the VMs for potential security issues. It also provides [security recommendations](../security-center/security-center-recommendations.md) in the Overview tab.

3. [Define security policies](../security-center/tutorial-security-policy.md) in Defender for Cloud.

For more information, see [Integrate Microsoft Defender for Cloud with Azure VMware Solution](azure-security-integration.md).

## Onboard VMs to Azure Arc enabled servers

Extend Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms.  For information on enabling Azure Arc enabled servers for multiple Windows or Linux VMs, see [Connect hybrid machines to Azure at scale](../azure-arc/servers/onboard-service-principal.md).



## Onboard hybrid Kubernetes clusters with Azure Arc-enabled Kubernetes

Attach a Kubernetes cluster hosted in your Azure VMware Solution environment using Azure Arc enabled Kubernetes. For more information, see [Create an Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/quickstart-connect-cluster.md).


## Deploy the Log Analytics agent

Monitor Azure VMware Solution VMs through the Log Analytics agent. Machines connected to the Log Analytics workspace use the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available for analysis.

Deploy the Log Analytics agent by using [Azure Arc-enabled servers VM extension support](../azure-arc/servers/manage-vm-extensions.md).




## Enable Azure Monitor

Can collect data from different [sources to monitor and analyze](../azure-monitor/data-sources.md) and different types of [data for analysis, visualization, and alerting](../azure-monitor/data-platform.md). You can also create alert rules to identify issues in your environment, like high use of resources, missing patches, low disk space, and heartbeat of your VMs. You can set an automated response to detected events by sending an alert to IT Service Management (ITSM) tools. Alert detection notification can also be sent via email.

Monitor guest operating system performance to discover and map application dependencies for Azure VMware Solution or on-premises VMs. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. 


1. [Design your Azure Monitor Logs deployment](../azure-monitor/logs/workspace-design.md)

1. [Enable Azure Monitor for VMs overview](../azure-monitor/vm/vminsights-enable-overview.md)

1. [Configure Log Analytics workspace for Azure Monitor for VMs](../azure-monitor/vm/vminsights-configure-workspace.md).

1. Create alert rules to identify issues in your environment:

   - [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md).

   - [Create, view, and manage log alerts using Azure Monitor](../azure-monitor/alerts/alerts-log.md).

   - [Action rules](../azure-monitor/alerts/alerts-action-rules.md) to set automated actions and notifications.

   - [Connect Azure to ITSM tools using IT Service Management Connector](../azure-monitor/alerts/itsmc-overview.md).


## Next steps

Now that you've covered Azure VMware Solution network and interconnectivity concepts, you may want to learn about [integrating Microsoft Defender for Cloud with Azure VMware Solution](azure-security-integration.md).
