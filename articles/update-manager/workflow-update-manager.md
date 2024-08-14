---
title: Azure Update Manager operations
description: This article tells what Azure Update Manager works in Azure is and the system updates for your Windows and Linux machines in Azure.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 07/14/2024
ms.topic: overview
---

# How Update Manager works

Update Manager assesses and applies updates to all Azure machines and Azure Arc-enabled servers for both Windows and Linux. 

![Diagram that shows the Update Manager workflow.](./media/overview/update-management-center-overview.png)

## Update Manager VM extensions

When an Azure Update Manager operation(AUM) is enabled or triggered on your Azure or Arc-enabled server, AUM installs an [Azure extension](../virtual-machines/extensions/overview.md) or [Arc-enabled servers extensions](../azure-arc/servers/manage-vm-extensions.md) respectively on your machine to manage the updates. 

The extension is automatically installed on your machine when you initiate any Update Manager operation on your machine for the first time, such as Check for updates, Install one-time update, Periodic Assessment or when scheduled update deployment runs on your machine for the first time. 

Customer doesn't have to explicitly install the extension and its lifecycle as it is managed by Azure Update Manager including installation and configuration. The Update Manager extension is installed and managed by using the below agents, which are required for Update Manager to work on your machines: 

- [Azure VM Windows agent](../virtual-machines/extensions/agent-windows.md) or the [Azure VM Linux agent](../virtual-machines/extensions/agent-linux.md) for Azure VMs.
- [Azure Arc-enabled servers agent](../azure-arc/servers/agent-overview.md) 

>[!NOTE]
> Arc connectivity is a prerequisite for Update Manager, non-Azure machines including Arc-enabled VMWare, SCVMM etc.

For Azure machines, single extension is installed whereas for Azure Arc-enabled machines, two extensions are installed. Below are the details of extensions, which get installed:

#### [Azure VM extensions](#tab/azure-vms)

| Operating system| Extension
|----------|-------------|
|Windows   | Microsoft.CPlat.Core.WindowsPatchExtension|
|Linux     | Microsoft.CPlat.Core.LinuxPatchExtension |

#### [Azure Arc-enabled VM extensions](#tab/azure-arc-vms)

| Operating system| Extension
|----------|-------------|
|Windows  | Microsoft.CPlat.Core.WindowsPatchExtension (Periodic assessment) <br> Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension (On-demand operations and Schedule patching) |
|Linux  | Microsoft.SoftwareUpdateManagement.LinuxOsUpdateExtension (On-demand operations and Schedule patching) <br> Microsoft.CPlat.Core.LinuxPatchExtension (Periodic assessment) |

To view the available extensions for a VM in the Azure portal:

1. Go to the [Azure portal](https://portal.azure.com) and select a VM.
1. On the VM home page, under **Settings**, select **Extensions + applications**.
1. On the **Extensions** tab, you can view the available extensions.
---

## Update source

Azure Update Manager honors the update source settings on the machine and will fetch updates accordingly. AUM doesn't publish or provide updates. 

#### [Windows](#tab/update-win)

If the [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) is configured to fetch updates from Windows Update repository or Microsoft Update repository or [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) (WSUS), AUM will honor these settings. For more information, see how to [configure Windows Update client](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus). By default, **it is configured to fetch updates from Windows Updates repository**. 

#### [Linux](#tab/update-lin)

If the package manager points to a public YUM, APT or Zypper repository or a local repository, AUM will honor the settings of the package manager.  

---

AUM performs the following steps: 

- Retrieve the assessment information about status of system updates for it specified by the Windows Update client or Linux package manager.
- Initiate the download and installation of updates with the Windows Update client or Linux package manager.

>[!Note]
> 1. The machines will report their update status based on the source they are configured to synchronize with. If the Windows Update service is configured to report to WSUS, the results in Update Manager might differ from what Microsoft Update shows, depending on when WSUS last synchronized with Microsoft Update. This behavior is the same for Linux machines that are configured to report to a local repository instead of a public package repository.
> 1. Update Manager will only find updates that the Windows Update service finds when you select the local **Check for updates** button on the local Windows system. On Linux systems only updates on the local repository will be discovered.

## Updates data stored in Azure Resource Graph

Update Manager extension pushes all the pending updates information and update installation results to [Azure Resource Graph](https://learn.microsoft.com/azure/governance/resource-graph/overview) where data is retained for below time periods:

|Data              | Retention period in Azure Resource graph                                       |
|------------------|---------------------------------------------------|
|Pending updates (ARG table name: patchassessmentresources) | Seven Days|
|Update installation results (ARG table name: patchinstallationresources)| 30 days|
 
For more information, see [log structure of Azure Resource Graph](query-logs.md) and [sample queries](sample-query-logs.md).

## How patches are installed in Azure Update Manager

In Azure Update Manager, patches are installed in the following manner:

1. It begins with a fresh assessment of the available updates on the VM.
1. Update installation follows the assessment. 
    - In Windows, the selected updates that meet the customer's criteria are installed one by one, 
    - In Linux, they're installed in batches.
1. During update installation, Maintenance window utilization is checked at multiple steps. For Windows and Linux, 10 and 15 minutes of the maintenance window are reserved for reboot at any point respectively. Before proceeding with the installation of the remaining updates, it checks whether the expected reboot time plus the average update installation time (for the next update or next set of updates) doesn't exceed the maintenance window.
In the case of Windows, the average update installation time is 10 minutes for all types of updates except for service pack updates. For service pack updates, it’s 15 minutes.
1. Note that an ongoing update installation (once started based on the calculation above) isn't forcibly stopped even if it exceeds the maintenance window, to avoid landing the machine in a possibly undetermined state. However, it doesn't continue installing the remaining updates once the maintenance window has been exceeded, and a maintenance window exceeded error is thrown in such cases.
1. Patching/Update installation is only marked as successful if all selected updates are installed, and all operations involved (including Reboot & Assessment) succeed. Otherwise, it's marked as Failed or Completed with warnings. For example,

    |Scenario    |Update installation status |
    |------------|---------------------------|
    |One of the selected updates fails to install.| Failed |
    |Reboot doesn't happen for any reason & wait time for reboot times out. | Failed |
    | Machine fails to start during a reboot. | Failed |
    | Initial or final assessment failed| Failed |
    | Reboot is required by the updates, but Never reboot option is selected. | Completed with warnings|
    | ESM packages skipped patching in ubuntu 18 or lower if Ubuntu pro license wasn't present. | Completed with warnings| 
1. An assessment is conducted at the end. Note that the reboot and assessment done at the end of the update installation may not occur in some cases, for example if the maintenance window has already been exceeded, if the update installation fails for some reason, etc.

## Next steps

- [Prerequisites of Update Manager](prerequisites.md)
- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).
