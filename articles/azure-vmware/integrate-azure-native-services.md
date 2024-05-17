---
title: Monitor and protect VMs with Azure native services
description: Learn how to integrate and deploy Microsoft Azure native tools to monitor and manage your Azure VMware Solution workloads.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/21/2024
ms.custom: engagement-fy23
---

# Monitor and protect VMs with Azure native services

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) in a hybrid environment (Azure, Azure VMware Solution, and on-premises). In this article, learn how to integrate Azure native services into your Azure VMware Solution private cloud and use the tools to manage your VMs throughout their lifecycle.

The Azure native services that you can integrate with Azure VMware Solution include:
- Azure Arc extends Azure management to the Azure VMware Solution. After your Azure VMware Solution private cloud is deployed to Arc, you'll be ready to execute operations in Azure VMware Solution vCenter Server from the Azure portal. Operations are related to Create, Read, Update, and Delete (CRUD) virtual machines (VMs) in an Arc-enabled Azure VMware Solution private cloud. Users can also enable guest management and install Azure extensions after the private cloud is Arc-enabled. 
- Azure Monitor collects, analyzes, and acts on data from your cloud and on-premises environments. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. You can send logs from your Azure VMware Solution private cloud to your Log Analytics workspace, allowing you to take advantage of the Log Analytics feature set, including:
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

>[!NOTE]
> If you're new to Azure or not familiar with the services previously mentioned, see [Enable Azure Monitor for VMs overview](/azure/azure-monitor/vm/vminsights-enable-overview) for guidance.

## Enable guest management and install extension
The guest management must be enabled on the VMware vSphere virtual machine (VM) before you can install an extension. Use the following prerequisite steps to enable guest management.
### Prerequisites
- Navigate to Azure portal.
- Locate the VMware vSphere VM you want to check for guest management and install extensions on, select the name of the VM.
- Select **Configuration** from the left navigation for a VMware VM.
- Verify **Enable guest management** is checked.

The following conditions are necessary to enable guest management on a VM.
- The machine must be running a supported operating system.
- The machine needs to connect through the firewall to communicate over the internet. Make sure the URLs listed aren't blocked.
- The machine can't be behind a proxy, it isn't currently supported.
- If you're using Linux VM, the account must not prompt to sign in on pseudo commands.
- To avoid pseudo commands, follow these steps:
    1. Sign in to Linux VM.
    2. Open terminal and run the following command: sudo visudo.
    3. Add the line `username ALL=(ALL) NOPASSWD: ALL` at the end of the file.
    4. Replace username with the appropriate user-name.
If your VM template already has these changes incorporated, you don't need to do the steps for the VM created from that template.
### Install extensions
1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	Find the Arc-enabled Azure VMware Solution VM that you want to install an extension on and select the VM name.
1.	Navigate to **Extensions** in the left navigation, select **Add**.
1.	Select the extension you want to install.  
    Based on the extension, you need to provide details.  
    For example, workspace ID and key for Log Analytics extension.
1.	When you're done, select **Review + create**.

When the extension installation steps are completed, they trigger deployment and install the selected extension on the VM.

## Next steps

Now that you covered how to integrate services and monitor VMware Solution VMs, you can also learn about:

- [Using the workload protection dashboard](../security-center/azure-defender-dashboard.md)
- [Advanced multistage attack detection in Microsoft Sentinel](../azure-monitor/logs/quick-create-workspace.md)
