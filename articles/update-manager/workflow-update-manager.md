---
title: Azure Update Manager Operations
description: This article tells what Azure Update Manager works in Azure is and the system updates for your Windows and Linux machines in Azure.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: habibaum
ms.author: v-uhabiba
ms.date: 08/21/2025
ms.topic: overview
# Customer intent: "As an IT administrator managing Azure and Arc-enabled servers, I want to automate the process of assessing and applying updates, so that I can ensure my systems remain secure and compliant without manual intervention."
---

# How Update Manager works

Update Manager assesses and applies updates to all Azure machines and Azure Arc-enabled servers for both Windows and Linux. 


:::image type="content" source="./media/overview/update-manager-overview.png" alt-text="Screenshot that shows the update manager workflow." lightbox="./media/overview/update-manager-overview.png":::


## Update Manager VM extensions

When an Azure Update Manager operation(AUM) is enabled or triggered on your Azure or Arc-enabled server, AUM installs an [Azure extension](/azure/virtual-machines/extensions/overview) or [Arc-enabled servers extensions](/azure/azure-arc/servers/manage-vm-extensions) respectively on your machine to manage the updates. 

The extension is automatically installed on your machine when you initiate any Update Manager operation on your machine for the first time, such as Check for updates, Install one-time update, Periodic Assessment or when scheduled update deployment runs on your machine for the first time. 

Customer doesn't have to explicitly install the extension and its lifecycle as it is managed by Azure Update Manager including installation and configuration. The Update Manager extension is installed and managed by using the below agents, which are required for Update Manager to work on your machines: 

- [Azure VM Windows agent](/azure/virtual-machines/extensions/agent-windows) or the [Azure VM Linux agent](/azure/virtual-machines/extensions/agent-linux) for Azure VMs.
- [Azure Arc-enabled servers agent](/azure/azure-arc/servers/agent-overview) 

>[!NOTE]
> Arc connectivity is a prerequisite for Update Manager, non-Azure machines including Arc-enabled VMWare, SCVMM, etc.

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

If the [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) is configured to fetch updates from Windows Update repository or Microsoft Update repository or [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) (WSUS), AUM honors these settings. For more information, see how to [configure Windows Update client](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus). By default, **it is configured to fetch updates from Windows Updates repository**. 

#### [Linux](#tab/update-lin)

If the package manager points to a public YUM, APT or Zypper repository or a local repository, AUM honors the settings of the package manager.  

---

AUM performs the following steps: 

- Retrieve the assessment information about status of system updates for it specified by the Windows Update client or Linux package manager.
- Initiate the download and installation of updates with the Windows Update client or Linux package manager.

>[!Note]
> - The machines will report their update status based on the source they are configured to synchronize with. If the Windows Update service is configured to report to WSUS, the results in Update Manager might differ from what Microsoft Update shows, depending on when WSUS last synchronized with Microsoft Update. This behavior is the same for Linux machines that are configured to report to a local repository instead of a public package repository.
> - Update Manager will only find updates that the Windows Update service finds when you select the local **Check for updates** button on the local Windows system. On Linux systems only updates on the local repository are discovered.
> - Azure Update Manager uses Windows Update Agent (WUA) APIs to install updates. The updates installed using WUA APIs do not reflect in Windows Update page within the Settings app in the machine and hence the updates installed through Azure Update Manager are not visible in Windows Update page in the Settings app. The Windows Update page in the Settings app shows the progress and history of updates managed by the Windows Update orchestrator workflow. [Learn more](/windows/win32/wua_sdk/portal-client#purpose).

## Updates data stored in Azure Resource Graph

Update Manager extension pushes all the pending updates information and update installation results to [Azure Resource Graph](/azure/governance/resource-graph/overview) where data is retained for below time periods:

|Data              | Retention period in Azure Resource graph                                       |
|------------------|---------------------------------------------------|
|Pending updates (ARG table name: patchassessmentresources) | Seven Days|
|Update installation results (ARG table name: patchinstallationresources)| 30 days|
 
For more information, see [log structure of Azure Resource Graph](query-logs.md) and [sample queries](sample-query-logs.md).

## How patches are installed in Azure Update Manager

In Azure Update Manager, patches are installed in the following manner:

1. It begins with a fresh assessment of the available updates on the VM.
1. To Update installation, do the following:
    - In Windows, the selected updates that meet the customer's criteria are installed one by one, 
    - In Linux, they're installed in batches.
1. During update installation, Maintenance window utilization is checked at multiple steps. For Windows and Linux, 10 and 15 minutes of the maintenance window are reserved for reboot at any point respectively. Before proceeding with the installation of the remaining updates, it checks whether the expected reboot time plus the average update installation time (for the next update or next set of updates) doesn't exceed the maintenance window.
In the case of Windows, the average update installation time is 10 minutes for all types of updates except for service pack updates. For service pack updates, it’s 15 minutes.
1. An ongoing update installation (once started based on the calculation above) isn't forcibly stopped even if it exceeds the maintenance window, to avoid landing the machine in a possibly undetermined state. However, it doesn't install the remaining updates after the maintenance window ends, and it shows a maintenance window exceeded error.
1. Patching/Update installation is only marked as successful if all selected updates are installed, and all operations involved (including Reboot & Assessment) succeed. Otherwise, it's marked as Failed or Completed with warnings. For example,

    |Scenario    |Update installation status |
    |------------|---------------------------|
    |One of the selected updates fails to install.| Failed |
    |Reboot doesn't happen for any reason & wait time for reboot times out. | Failed |
    | Machine fails to start during a reboot. | Failed |
    | Initial or final assessment failed| Failed |
    | Reboot is required by the updates, but Never reboot option is selected. | Completed with warnings|
    | ESM packages skipped patching in ubuntu 18 or lower if Ubuntu pro license wasn't present. | Completed with warnings| 
1. An assessment happens at the end. Sometimes, the reboot and assessment don’t happen—for example, if the maintenance window ends or the update installation fails.

## Next steps

- [Prerequisites of Update Manager](prerequisites.md)
- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).
