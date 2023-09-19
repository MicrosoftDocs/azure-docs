---
title: Manage update configuration settings in Azure Update Manager
description: This article describes how to manage the update settings for your Windows and Linux machines managed by Azure Update Manager.
ms.service: azure-update-manager
author: snehasudhirG
ms.author: sudhirsneha
ms.date: 05/30/2023
ms.topic: conceptual
---

# Manage update configuration settings

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to configure update settings from Azure Update Manager to control the update settings on your Azure virtual machines (VMs) and Azure Arc-enabled servers for one or more machines.

:::image type="content" source="./media/manage-update-settings/manage-update-settings-option-inline.png" alt-text="Screenshot that shows the Update Manager Update settings option." lightbox="./media/manage-update-settings/manage-update-settings-option-expanded.png":::

## Configure settings on a single VM

To configure update settings on your machines on a single VM:

You can schedule updates from **Overview** or **Machines** on the **Update Manager** page or from the selected VM.

# [From Overview pane](#tab/manage-single-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the **Update Manager** page, select **Overview**, select your subscription, and then select **Update settings**.
1. On the **Change update settings** pane, select **Add machine** to select the machine for which you want to change the update settings.
1. On the **Select resources** pane, select the machine and select **Add**.
1. On the **Change update settings** page, you see the machine classified according to the operating system with the list of following updates that you can select and apply.

    :::image type="content" source="./media/manage-update-settings/update-setting-to-change.png" alt-text="Screenshot that shows highlighting the Update settings to change option in the Azure portal.":::
 
    The following update settings are available for configuration for the selected machines:

   - **Periodic assessment**: The periodic assessment is set to run every 24 hours. You can either enable or disable this setting.
    - **Hotpatch**: You can enable [hotpatching](../automanage/automanage-hotpatch.md) for Windows Server Azure Edition VMs. Hotpatching is a new way to install updates on supported Windows Server Azure Edition VMs that doesn't require a reboot after installation. You can use Update Manager to install other patches by scheduling patch installation or triggering immediate patch deployment. You can enable, disable, or reset this setting.
    - **Patch orchestration** option provides:
    
      - **Customer Managed Schedules (preview)**: Enables schedule patching on your existing VMs. The new patch orchestration option enables the two VM properties, `Patch mode = Azure-orchestrated` and `BypassPlatformSafetyChecksOnUserSchedule = TRUE`, on your behalf after receiving your consent.
      - **Azure Managed - Safe Deployment**: For a group of VMs undergoing an update, the Azure platform orchestrates updates (not applicable for Azure Arc-enabled server). The VM is set to [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md). For example, the patch mode is `AutomaticByPlatform`. There are different implications depending on whether the customer schedule is attached to it or not. For more information, see [User scenarios](prerequsite-for-schedule-patching.md#user-scenarios).
          - Available *Critical* and *Security* patches are downloaded and applied automatically on the Azure VM by using [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md). This process kicks off automatically every month when new patches are released. Patch assessment and installation are automatic. The process includes rebooting the VM as required.
      - **Windows Automatic Updates** (`AutomaticByOS`): When the workload running on the VM doesn't have to meet availability targets, the operating system updates are automatically downloaded and installed. Machines are rebooted as needed.
      - **Manual updates**: This mode disables Windows automatic updates on VMs. Patches are installed manually or by using a different solution.
      - **Image Default**: Only supported for Linux VMs. This mode uses the default patching configuration in the image used to create the VM.

1. After you make the selection, select **Save**.

# [From Machines pane](#tab/manage-single-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the **Update Manager** page, select **Machines** and select your subscription.
1. Select the checkbox of your machine from the list and select **Update settings**.
1. Select **Update Settings** to proceed with the type of update for your machine.
1. On the **Change update settings** pane, select **Add machine** to select the machine for which you want to change the update settings.
1. On the **Select resources** pane, select the machine and select **Add**. Follow the procedure from step 5 listed in **From Overview pane** of [Configure settings on a single VM](#configure-settings-on-a-single-vm).

# [From a selected VM](#tab/singlevm-schedule-home)

1. Select your virtual machine and the **virtual machines | Updates** page opens.
1. Under **Operations**, select **Updates**.
1. On the **Updates (Preview)** pane, select **Update Settings**.
1. On the **Change update settings** pane, you can select the update settings that you want to change for your machine. Follow the procedure from step 3 listed in **From Overview pane** of [Configure settings on a single VM](#configure-settings-on-a-single-vm).

---

A notification appears to confirm that the update settings are successfully changed.

## Configure settings at scale

Follow these steps to configure update settings on your machines at scale.

> [!NOTE]
> You can schedule updates from **Overview** or **Machines**.

# [From Overview pane](#tab/manage-scale-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update Manager**, select **Overview**, select your subscription, and then select **Update settings**.

1. In **Change update settings**, select the update settings that you want to change for your machines. Follow the procedure from step 3 listed in **From Overview pane** of [Configure settings on a single VM](#configure-settings-on-a-single-vm).

# [From Machines pane](#tab/manage-scale-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Update Manager**, select **Machines** and select your subscription. Select the checkbox for all your machines from the list.
1. Select **Update Settings** to proceed with the type of update for your machines.
1. In **Change update settings**, you can select the update settings that you want to change for your machine. Follow the procedure from step 3 listed in **From Overview pane** of [Configure settings on a single VM](#configure-settings-on-a-single-vm).

---

A notification appears to confirm that the update settings are successfully changed.

## Next steps

* [View assessment compliance](view-updates.md) and [deploy updates](deploy-updates.md) for a selected Azure VM or Azure Arc-enabled server, or across [multiple machines](manage-multiple-machines.md) in your subscription in the Azure portal.
* To view update assessment and deployment logs generated by Update Manager, see [Query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot issues with Update Manager](troubleshoot.md).
