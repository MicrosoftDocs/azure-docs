---
title: Manage update configuration settings in Update management center (preview)
description: The article describes how to manage the update settings for your Windows and Linux machines managed by Update management center (preview).
ms.service: update-management-center
author: snehasudhirG
ms.author: sudhirsneha
ms.date: 04/21/2022
ms.topic: conceptual
---

# Manage Update configuration settings

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The article describes how to configure update settings from Update management center (preview) in Azure, to control the update settings on your Azure VMs and Arc-enabled servers for one or more machines.

:::image type="content" source="./media/manage-update-settings/manage-update-settings-option-inline.png" alt-text="Screenshot Viewing the update management center manage update settings option." lightbox="./media/manage-update-settings/manage-update-settings-option-expanded.png":::


## Configure settings on single VM

To configure update settings on your machines on a single VM, follow these steps:

>[!NOTE]
> You can schedule updates from the Overview or Machines blade in update management center (preview) page or from the selected VM.

# [From Overview blade](#tab/manage-single-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Update management center**, select **Overview**, select your **Subscription**, and select **Update settings**.
1. In **Change update settings**, select the update settings that you want to change for your machine and select **Next**. 

    :::image type="content" source="./media/manage-update-settings/update-setting-to-change.png" alt-text="Highlighting the Update settings to change option in the Azure portal.":::
 
    The following update settings are available for configuration for the selected machine(s):

   - **Periodic assessment** - enable periodic **Assessment** to run every 24 hours.
     >[!NOTE]
     > You must [register for the periodic assessement](./enable-machines.md?branch=release-updatecenterv2-publicpreview&tabs=portal-periodic%2cps-periodic-assessment%2ccli-periodic-assessment%2crest-periodic-assessment) in your Azure subscription to enable this feature.

    - **Hot patching** - for Azure VMs, you can enable [hot patching](../automanage/automanage-hotpatch.md) on supported Windows Server Azure Edition Virtual Machines (VMs) don't require a reboot after installation. You can use update management center (preview) to install patches with other patch classifications or to schedule patch installation when you require immediate critical patch deployment.

    - **Patch orchestration** option provides the following:

      - **Automatic by operating system** - When the workload running on the VM doesn't have to meet availability targets, operating system updates are automatically downloaded and installed. Machines are rebooted as needed.
      - **Azure-orchestrated** - Patch orchestration set to Azure-orchestrated for an Azure VM (not applicable for Arc-enabled server) has two different implications depending on whether customer [schedule](../update-center/scheduled-patching.md#) is attached to it or not.
      
        | Patch orchestration type | Description
        |----------|-------------|
        |Azure-orchestrated with no schedule attached | Machine is enabled for [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md). It implies that the available Critical and Security patches are downloaded and applied automatically on the Azure VM. This process kicks off automatically every month when new patches are released. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.|
        |Azure-orchestrated with schedule attached | Patching will happen according to the schedule and [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) will not take effect on the machine. Patch orchestration set to Azure-orchestrated is a necessary pre-condition for enabling schedules. You cannot enable a machine for custom schedule unless you set Patch orchestration to Azure-orchestrated. | 

      - Available *Critical* and *Security* patches are downloaded and applied automatically on the Azure VM using [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md). This process kicks off automatically every month when new patches are released. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.
      - **Manual updates** - Configures the Windows Update agent by setting [configure automatic updates](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#configure-automatic-updates).
      - **Image Default** - Only supported for Linux Virtual Machines, this mode honors the default patching configuration in the image used to create the VM.

1. In **Machines**, select the checkbox for your machine and Select **Next** to continue.

1. In **Review and change**, verify your selected resources and the update settings and select **Review and change**.


# [From Machines blade](#tab/manage-single-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Update management center**, select **Machines**, your **subscription**, and select the checkbox of your machine from the list and select **Update settings**.
1. Select **Update Settings** to proceed with the type of update for your machine.
1. In **Change update settings**, you can select the update settings that you want to change for your machines and follow the procedure from step 3 listed in **From Overview blade** of [Configure settings on single VM](#configure-settings-on-single-vm).

# [From a selected VM](#tab/singlevm-schedule-home)

>[!NOTE]
> **For Azure machines**, your subscription needs to be allowlisted for preview feature. For more information, see 
[On-boarding preview features](enable-machines.md)

1. Select your virtual machine and the **virtual machines | Updates** page opens.
1. Under **Operations**, select **Updates**.
1. In **Updates**, select **Go to Updates using Update Center**.
1. In **Updates preview**, select **Update Settings**.
1. In **Change update settings**, you can select the update settings that you want to change for your machine and follow the procedure from step 3 listed in **From Overview blade** of [Configure settings on single VM](#configure-settings-on-single-vm).

---

A notification appears to confirm that the update settings are successfully changed.

## Configure settings at scale

To configure update settings on your machines at scale, follow these steps:

>[!NOTE]
> You can schedule updates from the Overview or Machines blade.

# [From Overview blade](#tab/manage-scale-overview)
 
1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center**, select **Overview**, select your **Subscription** and select **Update settings**.

1. In **Change update settings**, select the update settings that you want to change for your machines follow the procedure from step 3 listed in **From Overview blade** of [Configure settings on single VM](#configure-settings-on-single-vm).

# [From Machines blade](#tab/manage-scale-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Update management center**, select **Machines**, your **subscription**, and select the checkbox for all your machines from the list and select **Update settings**.
1. Select **Update Settings** to proceed with the type of update for your machines.
1. In **Change update settings**, you can select the update settings that you want to change for your machine and follow the procedure from step 3 listed in **From Overview blade** of [Configure settings on single VM](#configure-settings-on-single-vm).

---

A notification appears to confirm that the update settings are successfully changed.



## Next steps

* [View assessment compliance](view-updates.md) and [deploy updates](deploy-updates.md) for a selected Azure VM or Arc-enabled server, or across [multiple machines](manage-multiple-machines.md) in your subscription in the Azure portal.
* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).