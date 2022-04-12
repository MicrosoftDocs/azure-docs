---
title: Manage update configuration settings in Update management center (preview)
description: The article describes how to manage the update settings for your Windows and Linux machines managed by Update management center (preview).
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 04/12/2022
ms.topic: conceptual
---

# Manage Update configuration settings using update management center (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The article describes how to configure update settings in Update management center (preview) on single VM or multiple VMs.

## Configure updates on single VM

To configure updates on a single VM, follow these steps:

> [!NOTE]
> You can configure the updates from Overview or Machines blades.

**From Overview blade**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Update management center**. In **Update management center**, select your **Subscription**, and select **Update Settings**.

    :::image type="content" source="./media/manage-update-settings/manage-update-settings-option-inline.png" alt-text="Viewing the update settings option." lightbox="./media/manage-update-settings/manage-update-settings-option-expanded.png":::

1. In **Change update settings**, **Properties**, select the update settings that you want to change for the machine and click **Next**.

    :::image type="content" source="./media/manage-update-settings/update-setting-to-change-inline.png" alt-text="Highlighting the Update settings to change option in the Azure portal." lightbox="./media/manage-update-settings/update-setting-to-change-expanded.png":::

    - [Hotpatching](/azure/automanage/automanage-hotpatch) on supported Windows Server Azure Edition virtual machines (VMs) that doesn’t require a reboot after installation. You can use update management center (preview) to install patches with other patch classifications or to schedule patch installation when you require immediate critical patch deployment.
    - Patch orchestration option provides the following:
        * **Automatic by operating system** - When the workload running on the VM doesn't have to meet availability targets, operating system updates are automatically downloaded and installed. Machines are rebooted as needed.
        * **Azure-orchestrated (preview)** - Available *Critical* and *Security* patches are downloaded and applied automatically on the Azure VM using [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching). This process kicks off automatically every month when new patches are released. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.
        * **Manual updates** - Configures the Windows Update agent setting [Configure Automatic Updates](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates#configure-automatic-updates).
        * **Image Default** - Only supported for Linux Virtual Machines, this mode honors the default patching configuration in the image used to create the VM.
    - Periodic Assessment- enable periodic **Assessment** to run every 24 hours.

1. In **Machines**, select **+Add machine** for which you want to change the update settings and click **Next**.
1. In **Select resources**, select the machine and select **Add** and **Next**.
1. Select **Review and change** to verify the resources and update settings and select **Review and change**.

A notification appears to confirm that the update settings are successfully changed.

**From Machines blade**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Update management center**. In **Update management center**, **Machines**, select your **Subscription** and your machine.
1. Select the checkbox for your machine and select **Update Settings**.
1. Select **Update Settings** to change the settings for your machine.
1. After selecting your machine, follow the [procedure](#configure-updates-on-single-vm) from Step 3 to configure updates.

A notification appears to confirm that the update settings are successfully changed.

## Configure updates at scale

To configure updates on multiple machines, follow these steps:

> [!NOTE]
> You can configure the updates from Overview or Machines blades.

**From Overview blade**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Update management center**. In **Update management center**, select **Overview** from the left menu.
1. Select your subscription and select **Update Settings**.
1. In **Change update settings**, **Properties**, select the update settings that you want to change for the machines in your subscription and click **Next**.
1. After selecting your machine, follow the [procedure](#configure-updates-on-single-vm) from Step 3 to configure updates.

A notification appears to confirm that the update settings are successfully changed.

**From Machines blade**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Update management center**. In **Update management center**, select **Machines** from the left menu. 
1. Select your **Subscription** and your machines.
1. Select the checkbox for your machines and select **Update Settings**.
1. Select **Update Settings** to change the settings for your machines.
1. After selecting your machine, follow the [procedure](#configure-updates-on-single-vm) from Step 3 to configure updates.

A notification appears to confirm that the update settings are successfully changed.

## Next steps

* [View assessment compliance](view-updates.md) and [deploy updates](deploy-updates.md) for a selected Azure VM or Arc-enabled server, or across [multiple machines](manage-multiple-machines.md) in your subscription in the Azure portal.
* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).