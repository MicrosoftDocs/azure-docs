---
title: Monitor and protect VMs with Azure native services
description: Learn how to integrate and deploy Microsoft Azure native tools to monitor and manage your Azure VMware Solution workloads.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/26/2022
ms.custom: engagement-fy23
---

# Monitor and protect VMs with Azure native services

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) in a hybrid environment (Azure, Azure VMware Solution, and on-premises). In this article, you'll integrate Azure native services in your Azure VMware Solution private cloud. You'll also learn how to use the tools to manage your VMs throughout their lifecycle.

The Azure native services that you can integrate with Azure VMware Solution include:
- Azure Arc extends Azure management Azure VMware Solution. Once your Azure VMware Solution private cloud is onboarded to Arc, you'll be ready to execute operations in Azure VMware Solution vCenter Server from the Azure portal. Operations are related to Create, Read, Update, and Delete (CRUD) virtual machines (VMs) in an Arc-enabled Azure VMware Solution private cloud. Users can also enable guest management and install Azure extensions once the private cloud is Arc-enabled. 
- Azure Monitor collects, analyzes, and acts on data from your cloud and on-premises environments. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. You can send logs from your AVS private cloud to your Log Analytics workspace, allowing you to take advantage of the Log Analytics feature set, including:
    - system patches, security misconfigurations, and endpoint protection. You can also define security policies in Microsoft Defender for Cloud.
- Log Analytics workspace stores log data. Each workspace has its own data repository and configuration to store data. You can monitor Azure VMware Solution VMs through the Log Analytics agent. Machines connected to the Log Analytics Workspace use the Log Analytics agent to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available for analysis. 

## Benefits
- Azure native services can be used to manage your VMs in a hybrid environment (Azure, Azure VMware Solution, and on-premises).
- Integrated monitoring and visibility of your Azure, Azure VMware Solution, and on-premises VMs.
    - Fileless security alerts
    - Operating system patch assessment 
    - Security misconfigurations assessment
    - Endpoint protection assessment
- Easily deploy the Log Analytics extension after enabling guest management on VMware vSphere virtual machine (VM). 
- Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics  extensions. Collect data and logs to a single point and present that data to different Azure native services.
- Added benefits of Azure Monitor include:
    - Seamless monitoring
    - Better infrastructure visibility
    - Instant notifications
    - Automatic resolution
    - Cost efficiency

## Topology

The diagram shows the integrated monitoring architecture for Azure VMware Solution VMs.

:::image type="content" source="media/concepts/integrated-azure-monitoring-architecture.png" alt-text="Diagram showing the integrated Azure monitoring architecture."lightbox="media/concepts/integrated-azure-monitoring-architecture.png" border="false":::

Defender for Cloud forwards the environment vulnerability to Microsoft Sentinel to create an incident and map with other threats. You can also create the scheduled rules query to detect unwanted activity and convert it to the incidents.

## Before you start
If you're new to Azure or not familiar with any of the services previously mentioned, review the following articles:

- [Enable Azure Monitor for VMs overview](../azure/azure-monitor/vm/vminsights-enable-overview)

## Enable guest management and install extension
The guest management must be enabled on the VMware vSphere virtual machine (VM) before you can install an extension. Use the following prerequisite steps to enable guest management.
### Prerequisites
- Navigate to Azure portal.
- Locate the VMware vSphere VM you want to check for guest management and install extensions on, select the name of the VM.
- Select **Configuration** from the left navigation for a VMware VM.
- Verify **Enable guest management** has been checked.

The following conditions are necessary to enable guest management on a VM.
- The machine must be running a supported operating system.
- The machine needs to connect through the firewall to communicate over the internet. Make sure the URLs listed aren't blocked.
- The machine can't be behind a proxy, it's not supported yet.
- If you're using Linux VM, the account must not prompt to sign in on pseudo commands.
- To avoid pseudo commands, follow these steps:
    1. Sign into Linux VM.
    2. Open terminal and run the following command: sudo visudo.
    3. Add the line `username ALL=(ALL) NOPASSWD: ALL` at the end of the file.
    4. Replace username with the appropriate user-name.
If your VM template already has these changes incorporated, you won't need to do the steps for the VM created from that template.
### Install extensions
1.	Go to **Azure** portal.
1.	Find the Arc-enabled Azure VMware Solution VM that you want to install an extension on and select the VM name.
1.	Navigate to **Extensions** in the left navigation, select **Add**.
1.	Select the extension you want to install.  
    Based on the extension, you'll need to provide details.  
    For example, workspace ID and key for Log Analytics extension.
1.	When you're done, select **Review + create**.

When the extension installation steps are completed, they trigger deployment and install the selected extension on the VM.


















































>
>
>
>
>
>
>

____________________________________________OLD**

## Before you start

If you're new to Azure or not familiar with any of the services previously mentioned, review the following articles:

- [Enable Azure Monitor for VMs overview](../azure-monitor/vm/vminsights-enable-overview.md)

## Enable guest management extension

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
