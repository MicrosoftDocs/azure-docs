---
title: Azure Update Manager Operations
description: This article describes how you use Azure Update Manager to manage and apply system updates for Windows and Linux machines in Azure.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: habibaum
ms.author: v-uhabiba
ms.date: 08/21/2025
ms.topic: concept-article
# Customer intent: "As an IT administrator who manages Azure VMs and Azure Arc-enabled servers, I want to automate the process of assessing and applying updates so that I can keep my systems secure and compliant without manual intervention."
---

# How Update Manager works

Azure Update Manager assesses and applies updates to all Azure virtual machines (VMs) and Azure Arc-enabled servers for both Windows and Linux.

:::image type="content" source="./media/overview/update-manager-overview.png" alt-text="Diagram of the Update Manager workflow." lightbox="./media/overview/update-manager-overview.png":::

## Update Manager VM extensions

When an Update Manager operation is enabled or triggered on your Azure VM or Azure Arc-enabled server, Update Manager installs an [Azure extension](/azure/virtual-machines/extensions/overview) or [Azure Arc-enabled server extensions](/azure/azure-arc/servers/manage-vm-extensions) (respectively) on your machine to manage the updates.

The extensions are automatically installed when you start any Update Manager operation on your machine for the first time. These operations include **Check for updates**, **Install one-time update**, and **Periodic Assessment**. The extensions are also automatically installed when a scheduled update deployment runs on your machine for the first time.

You don't have to explicitly install the extensions and their lifecycles. Update Manager manages the installation and configuration by using the following agents. These agents are required for Update Manager to work on your machines.

- For Azure VMs: [Azure Windows VM Agent](/azure/virtual-machines/extensions/agent-windows) or [Azure Linux VM Agent](/azure/virtual-machines/extensions/agent-linux)
- For Azure Arc-enabled servers: [Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview)

> [!NOTE]
> Azure Arc connectivity is a prerequisite for Update Manager and non-Azure machines, including Azure Arc-enabled VMware vSphere and Azure Arc-enabled System Center Virtual Machine Manager.

For Azure machines, Update Manager installs a single extension. For Azure Arc-enabled machines, Update Manager installs two extensions. The following tabs provide details about the extensions:

#### [Azure VM extensions](#tab/azure-vms)

| Operating system| Extension
|----------|-------------|
|Windows   | Microsoft.CPlat.Core.WindowsPatchExtension
|Linux     | Microsoft.CPlat.Core.LinuxPatchExtension

#### [Azure Arc-enabled server extensions](#tab/azure-arc-vms)

| Operating system| Extensions
|----------|-------------
|Windows  | Microsoft.CPlat.Core.WindowsPatchExtension (periodic assessment) <br> Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension (on-demand operations and scheduled patching)
|Linux  | Microsoft.SoftwareUpdateManagement.LinuxOsUpdateExtension (on-demand operations and scheduled patching) <br> Microsoft.CPlat.Core.LinuxPatchExtension (periodic assessment)

---

To view the available extensions for a VM in the Azure portal:

1. Go to the [Azure portal](https://portal.azure.com) and select a VM.
1. On the VM's home page, under **Settings**, select **Extensions + applications**.
1. On the **Extensions** tab, you can view the available extensions.

## Update source

Update Manager honors the update source settings on the machine and fetches updates accordingly. Update Manager doesn't publish or provide updates.

#### [Windows](#tab/update-win)

If the [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) is configured to fetch updates from the Windows Update repository, the Microsoft Update repository, or [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus), Update Manager honors these settings. For more information, see [Configure Windows Update settings for Azure Update Manager](/azure/update-manager/configure-wu-agent). By default, *WUA is configured to fetch updates from the Windows Update repository*.

#### [Linux](#tab/update-lin)

If the package manager points to a public YUM, APT, or Zypper repository, or to a local repository, Update Manager honors the settings of the package manager.  

---

## Update process

Update Manager performs the following steps:

1. Retrieve the assessment information about the status of system updates specified by the Windows Update client or Linux package manager.
1. Initiate the download and installation of updates by using the Windows Update client or Linux package manager.

The machines report their update status based on the source that they're configured to synchronize with. If the Windows Update service is configured to report to WSUS, the results in Update Manager might differ from what Microsoft Update shows, depending on when WSUS last synchronized with Microsoft Update. This behavior is the same for Linux machines that are configured to report to a local repository instead of a public package repository.

Update Manager finds only updates that the Windows Update service finds when you select the **Check for updates** button on the local Windows system. On Linux systems, Update Manager discovers only updates in the local repository.

Update Manager uses WUA APIs to install updates. The updates installed via WUA APIs don't appear on the Windows Update page within the Settings app on the machine. As a result, the updates installed through Update Manager aren't visible on the Windows Update page in the Settings app. The Windows Update page in the Settings app shows the progress and history of updates that the Windows Update orchestrator workflow manages. [Learn more](/windows/win32/wua_sdk/portal-client#purpose).

## Update-related data stored in Azure Resource Graph

The Update Manager extension pushes all the pending update information and update installation results to [Azure Resource Graph](/azure/governance/resource-graph/overview). Resource Graph retains data for the following time periods:

|Data              | Retention period in Resource Graph
|------------------|---------------------------------------------------
|Pending updates (Resource Graph table name: `patchassessmentresources`) | 7 days
|Update installation results (Resource Graph table name: `patchinstallationresources`)| 30 days

For more information, see the [log structure of Azure Resource Graph](query-logs.md) and [sample queries](sample-query-logs.md).

## Installation of patches in Update Manager

Update Manager installs patches in the following manner:

1. Update Manager makes a fresh assessment of the available updates on the VM.

1. For Windows, the selected updates that meet the customer's criteria are installed one by one. For Linux, they're installed in batches.

1. During update installation, Update Manager checks maintenance window utilization at multiple steps.

   For Windows and Linux, 10 and 15 minutes (respectively) of the maintenance window are reserved for reboot at any point. Before Update Manager proceeds with the installation of the remaining updates, it checks whether the expected reboot time plus the average update installation time (for the next update or the next set of updates) doesn't exceed the maintenance window.

   In the case of Windows, the average update installation time is 10 minutes for all types of updates, except for service pack updates. For service pack updates, it's 15 minutes.

1. An ongoing update installation (after it's started based on the preceding calculation) isn't forcibly stopped, even if it exceeds the maintenance window, to avoid landing the machine in a possibly undetermined state. However, Update Manager doesn't install the remaining updates after the maintenance window ends, and it shows a "Maintenance window exceeded" error.

1. Update Manager marks an installation as successful only if all selected updates are installed and all operations involved (including reboot and assessment) succeed. Otherwise, the installation is marked as **Failed** or **Completed with warnings**. For example:

    |Scenario    |Update installation status
    |------------|---------------------------
    |Installation of one of the selected updates fails.| **Failed**
    |A reboot doesn't happen for any reason, and the wait time for reboot times out. | **Failed**
    |The machine fails to start during a reboot. | **Failed**
    |Initial or final assessment failed.| **Failed**
    |Updates require a reboot, but the **Never reboot** option is selected. | **Completed with warnings**
    |ESM packages skipped patching in Ubuntu 18 or earlier if an Ubuntu Pro license wasn't present. | **Completed with warnings**

1. An assessment happens at the end. Sometimes, the reboot and assessment don't happen; for example, if the maintenance window ends or the update installation fails.

## Related content

- [Prerequisites for Azure Update Manager](prerequisites.md)
- [Check update compliance with Azure Update Manager](view-updates.md)
- [Deploy updates now and track results with Azure Update Manager](deploy-updates.md)
- [Automate assessment at scale by using Azure Policy](https://aka.ms/aum-policy-support)
- [Schedule recurring updates for machines by using the Azure portal and Azure Policy](scheduled-patching.md)
- [Manage update configuration settings](manage-update-settings.md)
- [Manage multiple machines with Azure Update Manager](manage-multiple-machines.md)
