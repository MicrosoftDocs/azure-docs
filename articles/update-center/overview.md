---
title: Update management center (private preview) overview
description: This article provides an overview of how update management center (private preview) in Azure helps you manages updates for your Windows and Linux machines in Azure, on-premises, and other cloud environments.
ms.service: update-management-center
author: mgoedtel
ms.author: magoedte
ms.date: 08/25/2021
ms.topic: conceptual
---

# Update management center (private preview) overview

You can use update management center (private preview) in Azure to centrally manage operating system updates, update configuration settings, and manage the process of installing required updates for your Windows and Linux virtual machines (VMs) in Azure, physical or VMs in on-premises environments, and in other cloud environments. You can quickly assess the status of available updates and manage the process of installing required updates for your machines reporting to update management center (private preview). 

Microsoft offers other capabilities to help you manage updates for your Azure VMs or Azure virtual machine scale sets that you should consider as part of your overall update management strategy. Review the Azure VM [Update options](/azure/virtual-machines/updates-maintenance-overview) to learn more about the options available.

Before enabling your machines for update management center (private preview), make sure that you understand the information in the following sections.

> [!IMPORTANT]
> Update management center (private preview) can manage machines currently managed by Azure Automation [Update Management](/azure/automation/update-management/overview) feature without interrupting your update management process. However, we don't recommend migrating from Automation Update Management since this preview gives you a chance to evaluate and provide feedback on features before it's generally available (GA). 
>
> While update management center is in **preview**, the [Supplemental Terms of Use for Microsoft Azure Previews](/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## About update management center (private preview)

Update management center (private preview) has been redesigned and doesn't depend on Azure Automation or Azure Monitor Logs, as required by the [Azure Automation Update Management feature](/azure/automation/update-management/overview). It offers all of the same functionality as the original version available with Azure Automation, but it is designed to:

* Take advantage of newer technology in Azure
* Deliver a native update capability
* No onboarding steps required
* Granular role based access 

The following diagram illustrates how update management center (private preview) assesses and applies updates to all Azure machines and Arc-enabled servers: both Windows and Linux.

![Update Center workflow](./media/overview/update-management-center-overview.png)

To support management of your Azure VM or non-Azure machine, update management center (private preview) relies on a new Azure extension designed to provide all the functionality required to interact with the operating system to manage the assessment and application of updates. This extension is installed when you initiate management of your machine, and the extension supports deployment to Azure VMs or Arc enabled servers using the extension framework. The update management center (private preview) extension is installed and managed using the following:

* [Azure virtual machine Windows agent](/azure/virtual-machines/extensions/agent-windows) or [Azure virtual machine Linux agent](/azure/virtual-machines/extensions/agent-linux) for Azure VMs.
* [Azure arc-enabled servers agent](/azure/azure-arc/servers/agent-overview) for non-Azure Linux and Windows machines or physical servers.

When you initiate management of your Azure VM or non-Azure machine, update management center (private preview) pushes an extension to the Azure VM agent or Arc enabled server agent. The agent installation and configuration is managed by update management center (private preview) and there is no manual intervention required as long as the Azure VM agent or Azure Arc-enabled server agent is functional. The update management center (private preview) extension runs code locally on the machine to interact with the operating system, and this includes:

- Retrieving assessment information about status of system updates for it specified by the Windows Update client or Linux package manager.
- Initiate download and installation of approved updates with Windows Update client or Linux package manager. 

All assessment information and update installation results is reported to update management center (private preview) from the extension and is available for analysis with [Azure Resource Graph](/azure/governance/resource-graph/overview). You can view up to the last 7 days of assessment data, and up to the last 30 days of update installation results. 

The machines assigned to update management center (private preview) report how up to date they are based on what source they are configured to synchronize with. Windows Update Agent (WUA) on Windows machines can be configured to report to [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) or Microsoft Update, and Linux machines can be configured to report to a local or public YUM or APT package repository. If the Windows Update Agent is configured to report to WSUS, depending on when WSUS last synchronized with Microsoft Update, the results in update management center (private preview) might differ from what Microsoft Update shows. This behavior is the same for Linux machines that are configured to report to a local repository instead of a public package repository. 

You can manage your Azure VMs or Arc-enabled servers directly, or at-scale with update management center (private preview).

## Prerequisites

### Permissions

To create and manage update deployments, you need specific permissions. The following table shows the permissions needed when using update management center (private preview).

|Resource |Role |Description |
|---------|-----|------------|
|Azure VM |[Azure Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) or Azure [Owner](/azure/role-based-access-control/built-in-roles#owner)||
|Arc enabled server |[Azure Connected Machine Resource Administrator](/azure/azure-arc/servers/security-overview#identity-and-access-control)||
|**Actions** |Permission |Scope |
|Install update on Azure VMs |*Microsoft.Compute/virtualMachines/installPatches/action* ||
|Update assessment on Azure VMs |*Microsoft.Compute/virtualMachines/assessPatches/action* ||
|Install update on Arc enabled server |*Microsoft.HybridCompute/machines/installPatches/action* ||
|Update assessment on Arc enabled server |*Microsoft.HybridCompute/machines/assessPatches/action* ||
|Create/modify maintenance configuration |*Microsoft.Maintenance/maintenanceConfigurations/write* |Subscription/resource group |
|Create/modify configuration assignments |*Microsoft.Maintenance/configurationAssignments/write* |Machine |
|Read permission for Maintenance updates resource |*Microsoft.Maintenance/updates/read* |Machine |
|Read permission for Maintenance apply updates resource |*Microsoft.Maintenance/applyUpdates/read* |Machine |

### Supported Regions
In private preview, update management center (private preview) is available for use in limited regions. But will scale to all regions later in public preview stages. Listed below are the Azure public cloud where you can use update management center (private preview).

Update management center (private preview) **on demand assessment, on demand patching** on **Azure Compute virtual machines** is available in all Azure public regions where Compute virtual machines is available.

Update management center (private preview) **on demand assessment, on demand patching** on **Azure arc-enabled servers** is supported in the following regions currently. This means that VMs must be in below regions:

* Australia East
* East US
* North Europe
* South Central US
* South East Asia
* UK South
* West Central US
* West Europe
* West US2

Update management center (private preview) **periodic assessment** and **scheduled patching** features are supported in the below regions as of now:
* South Central US
* West Central US
* North Europe
* Australia East
* UK South
* Southeast Asia

### Supported operating systems

Update management center (private preview) supports specific versions of the Windows Server and Linux operating systems running on Azure VMs or machines managed by Arc enabled servers. Before you enable update management center (private preview), confirm that the target machines meet the operating system requirements.

 - [Azure VMs](/azure/virtual-machines/index) are: 
 
   | Publisher | Operating System | SKU |
   |----------|-------------|-------------|
   | Canonical | UbuntuServer | 16.04-LTS, 18.04-LTS |
   | Canonical | 0001-com-ubuntu-server-focal | 20_04-LTS |
   | Canonical | 0001-com-ubuntu-pro-focal | pro-20_04-LTS |
   | Canonical | 0001-com-ubuntu-pro-bionic | pro-18_04-LTS |
   | Redhat | RHEL | 7-RAW, 7-LVM, 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7_9, 8, 8.1, 8.2, 8_3, 8-LVM |    
   | Redhat | RHEL-RAW | 8-RAW |     
   | OpenLogic | CentOS | 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7_8, 7_9, 8.0, 8_1, 8_2, 8_3 |
   | OpenLogic | CentOS-LVM | 7-LVM, 8-LVM |
   | SUSE | SLES-12-SP5 | Gen1, Gen2 |
   | SUSE | SLES-15-SP2 | Gen1, Gen2 |
   | MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2016-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-Server-Core |   
   | MicrosoftWindowsServer | WindowsServer | 2019-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2019-Datacenter-Core |
   | MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1 |
   | MicrosoftWindowsServer | MicrosoftServerOperatingSystems-Previews | Windows-Server-2019-Azure-Edition-Preview |
   | MicrosoftWindowsServer | MicrosoftServerOperatingSystems-Previews | Windows-Server-2022-Azure-Edition-Preview |
   | MicrosoftVisualStudio | VisualStudio | VS-2017-ENT-Latest-WS2016 | 
   
   >[!NOTE]
   > Custom images are currently not supported.

- [Azure Arc-enabled servers](/azure/azure-arc/servers/overview) are:

   | Publisher | Operating System
   |----------|-------------|
   | Microsoft Corporation | Windows Server 2012 R2 and higher (including Server Core) |
   | Microsoft Corporation | Windows Server 2008 R2 SP1 with PowerShell enabled and .NET Framework 4.0+ |
   | Canonical | Ubuntu 16.04, 18.04, and 20.04 LTS (x64) |
   | Red Hat | CentOS Linux 7 and 8 (x64) |   
   | SUSE | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat | Red Hat Enterprise Linux (RHEL) 7 and 8 (x64) |    
   | Amazon | Amazon Linux 2 (x64)   |
   | Oracle | Oracle 7.x |       
 
Because update management center (private preview) depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client are enabled and can connect with an update source or repository. If you are running a Windows Server OS on your machine, refer to the following article to [configure Windows Update settings](configure-wuagent.md).
 
 > [!NOTE]
 > For patching, update management center (private preview) relies on classification data available on the machine. Unlike other distributions, CentOS YUM package manager does not have this information available in the RTM version to classify updates and packages in different categories.

### Network planning

To prepare your network to support update management center (private preview), you may need to configure some infrastructure components.

For Windows machines, you must also allow traffic to any endpoints required by Windows Update agent. You can find an updated list of required endpoints in [Issues related to HTTP/Proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy). If you have a local [Windows Server Update Services](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) (WSUS) deployment, you must also allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](/azure/virtual-machines/workloads/redhat/redhat-rhui#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux distributions, see your provider documentation.

### VM images

Update management center (private preview) supports Azure VMs created using Azure Marketplace images, the virtual machine agent is already included in the Azure Marketplace image. If you have created Azure VMs using custom VM images and not an image from the Azure Marketplace, you need to manually install and enable the Azure virtual machine agent. For details see:

* [Manual install of Azure Windows VM agent](/azure/virtual-machines/extensions/agent-windows#manual-installation)
* [Manual install of Azure Linux VM agent](/azure/virtual-machines/extensions/agent-linux#installation)

## Next steps

* [Enable update management center (private preview)](enable-machines.md) for your Azure VMs or Azure Arc-enabled servers.
* [View updates for single machine](view-updates.md) 
* [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update management center](manage-multiple-machines.md)
