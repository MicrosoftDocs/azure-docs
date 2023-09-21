---
title: Azure Update Manager overview
description: The article tells what Azure Update Manager in Azure is and the system updates for your Windows and Linux machines in Azure, on-premises, and other cloud environments.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 09/21/2023
ms.topic: overview
---

# About Azure Update Manager

> [!Important]
> - Azure Update Manager is the v2 version of Automation Update management and the future of update management in Azure.
> - [Automation Update management](../automation/update-management/overview.md) relies on [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) (aka MMA agent), which is on a deprecation path and won’t be supported after **August 31, 2024**.  
> - Azure Update Manager is a native service in Azure and does not rely on [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) or [Azure Monitor agent](../azure-monitor/agents/agents-overview.md).
> -  Follow [guidance](guidance-migration-automation-update-management-azure-update-manager.md) to migrate machines and schedules from Automation Update Management to Azure Update Manager.
> - For customers using Automation Update management, we recommend continuing to use the Log Analytics agent and **NOT** migrate to Azure Monitoring agent until migration guidance is provided for Update management or else Automation Update management will not work.
> - The Log Analytics agent would not be deprecated before moving all Automation Update management customers to Update Manager.
> - Azure Update Manager doesn’t store any customer data.

Azure Update Manager is a unified service to help manage and govern updates for all your machines. You can monitor Windows and Linux update compliance across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. In addition, you can use the Update Manager  to make real-time updates or schedule them within a defined maintenance window.

You can use the Update Manager in Azure to:

- Oversee update compliance for your entire fleet of machines in Azure, on-premises, and other cloud environments.
- Instantly deploy critical updates to help secure your machines.
- Leverage flexible patching options such as [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) in Azure, [hot patching](../automanage/automanage-hotpatch.md), and customer-defined maintenance schedules. 

We also offer other capabilities to help you manage updates for your Azure Virtual Machines (VM) that you should consider as part of your overall update management strategy. Review the Azure VM [Update options](../virtual-machines/updates-maintenance-overview.md) to learn more about the options available.

Before you enable your machines for Update Manager, make sure that you understand the information in the following sections.


## Key benefits

Update Manager has been redesigned and doesn't depend on Azure Automation or Azure Monitor Logs, as required by the [Azure Automation Update Management feature](../automation/update-management/overview.md). Update Manager offers many new features and provides enhanced functionality over the original version available with Azure Automation and some of those benefits are listed below:

- Provides native experience with zero on-boarding.
    - Built as native functionality on Azure Compute and Azure Arc for Servers platform for ease of use.
    - No dependency on Log Analytics and Azure Automation.
    - Azure policy support.
    - Global availability in all Azure Compute and Azure Arc regions.
- Works with Azure roles and identity.
    - Granular access control at per resource level instead of access control at Automation account and Log Analytics workspace level.
    - Azure Update Manager now has Azure Resource Manager based operations. It allows RBAC and roles based of ARM in Azure.
- Enhanced flexibility
    - Ability to take immediate action either by installing updates immediately or schedule them for a later date.
    - Check updates automatically or on demand.
    - Helps secure machines with new ways of patching such as [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) in Azure, [hotpatching](../automanage/automanage-hotpatch.md) or custom maintenance schedules.
    - Sync patch cycles in relation to patch Tuesday—the unofficial term for Microsoft's scheduled security fix release on every second Tuesday of each month.

The following diagram illustrates how Update Manager assesses and applies updates to all Azure machines and Arc-enabled servers for both Windows and Linux.

![Update Manager workflow](./media/overview/update-management-center-overview.png)

To support management of your Azure VM or non-Azure machine, Update Manager relies on a new [Azure extension](../virtual-machines/extensions/overview.md) designed to provide all the functionality required to interact with the operating system to manage the assessment and application of updates. This extension is automatically installed when you initiate any Update manager operations such as **check for updates**, **install one time update**, **periodic assessment** on your machine. The extension supports deployment to Azure VMs or Arc-enabled servers using the extension framework. The Update Manager extension is installed and managed using the following:

- [Azure virtual machine Windows agent](../virtual-machines/extensions/agent-windows.md) or [Azure virtual machine Linux agent](../virtual-machines/extensions/agent-linux.md) for Azure VMs.
- [Azure arc-enabled servers agent](../azure-arc/servers/agent-overview.md) for non-Azure Linux and Windows machines or physical servers.

 The extension agent installation and configuration are managed by the Update Manager. There's no manual intervention required as long as the Azure VM agent or Azure Arc-enabled server agent is functional. The Update Manager extension runs code locally on the machine to interact with the operating system, and it includes:

- Retrieving the assessment information about status of system updates for it specified by the Windows Update client or Linux package manager.
- Initiating the download and installation of approved updates with Windows Update client or Linux package manager. 

All assessment information and update installation results are reported to Update Manager from the extension and is available for analysis with [Azure Resource Graph](../governance/resource-graph/overview.md). You can view up to the last seven days of assessment data, and up to the last 30 days of update installation results. 

The machines assigned to Update Manager report how up to date they're based on what source they're configured to synchronize with. [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) on Windows machines can be configured to report to [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) or Microsoft Update which is by default, and Linux machines can be configured to report to a local or public YUM or APT package repository. If the Windows Update Agent is configured to report to WSUS, depending on when WSUS last synchronized with Microsoft update, the results in Update Manager might differ from what Microsoft update shows. This behavior is the same for Linux machines that are configured to report to a local repository instead of a public package repository. 

>[!NOTE]
> You can manage your Azure VMs or Arc-enabled servers directly, or at-scale with Update Manager.

## Prerequisites
Along with the prerequisites listed below, see [support matrix](support-matrix.md) for Update Manager.

### Role

**Resource** | **Role**
--- | ---
|Azure VM | [Azure Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) or Azure [Owner](../role-based-access-control/built-in-roles.md#owner).
Arc enabled server | [Azure Connected Machine Resource Administrator](../azure-arc/servers/security-overview.md#identity-and-access-control).

### Permissions

You need the following permissions to create and manage update deployments. The following table shows the permissions needed when using the Update Manager.
 
**Actions** |**Permission** |**Scope** |
--- | --- | --- |
|Install update on Azure VMs |*Microsoft.Compute/virtualMachines/installPatches/action* ||
|Update assessment on Azure VMs |*Microsoft.Compute/virtualMachines/assessPatches/action* ||
|Install update on Arc enabled server |*Microsoft.HybridCompute/machines/installPatches/action* ||
|Update assessment on Arc enabled server |*Microsoft.HybridCompute/machines/assessPatches/action* ||
|Register the subscription for the Microsoft.Maintenance resource provider| *Microsoft.Maintenance/register/action* | Subscription|
|Create/modify maintenance configuration |*Microsoft.Maintenance/maintenanceConfigurations/write* |Subscription/resource group |
|Create/modify configuration assignments |*Microsoft.Maintenance/configurationAssignments/write* |Machine |
|Read permission for Maintenance updates resource |*Microsoft.Maintenance/updates/read* |Machine |
|Read permission for Maintenance apply updates resource |*Microsoft.Maintenance/applyUpdates/read* |Machine |

### VM images
For more information, see the [list of supported operating systems and VM images](support-matrix.md#supported-operating-systems).

> [!NOTE]
> Currently, Update Manager has the following limitations regarding the operating system support: 
> - Marketplace images other than the [list of supported marketplace OS images](../virtual-machines/automatic-vm-guest-patching.md#supported-os-images) are currently not supported.
> - [Specialized images](../virtual-machines/linux/imaging.md#specialized-images) and **VMs created by Azure Migrate, Azure Backup, Azure Site Recovery** aren't fully supported for now. However, you can **use on-demand operations such as one-time update and check for updates** in Update Manager. 
> 
> For the above limitations, we recommend that you use [Automation update management](../automation/update-management/overview.md) till the support is available in Update Manager. [Learn more](support-matrix.md#supported-operating-systems).


## VM Extensions

#### [Azure VM Extensions](#tab/azure-vms)

| **Operating system**| **Extension** 
|----------|-------------|
|Windows   | Microsoft.CPlat.Core.WindowsPatchExtension|
|Linux     | Microsoft.CPlat.Core.LinuxPatchExtension |

#### [Azure Arc-enabled VM Extensions](#tab/azure-arc-vms)

| **Operating system**| **Extension** 
|----------|-------------|
|Windows  | Microsoft.CPlat.Core.WindowsPatchExtension (Periodic assessment) <br> Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension (On-demand operations and Schedule patching) |
|Linux  | Microsoft.SoftwareUpdateManagement.LinuxOsUpdateExtension (On-demand operations and Schedule patching) <br> Microsoft.CPlat.Core.LinuxPatchExtension (Periodic assessment) |

To view the available extensions for a VM in the Azure portal, follow these steps:
1. Go to [Azure portal](https://portal.azure.com), select a VM.
1. In the VM home page, under **Settings**, select **Extensions + applications**.
1. Under the **Extensions** tab, you can view the available extensions.
---

### Network planning

To prepare your network to support Update Manager, you may need to configure some infrastructure components.

For Windows machines, you must allow traffic to any endpoints required by Windows Update agent. You can find an updated list of required endpoints in [Issues related to HTTP/Proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy). If you have a local [WSUS](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) (WSUS) deployment, you must also allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](../virtual-machines/workloads/redhat/redhat-rhui.md#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux distributions, see your provider documentation.



## Next steps

- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via Portal](manage-update-settings.md)
- [Manage multiple machines using Update manager](manage-multiple-machines.md)
