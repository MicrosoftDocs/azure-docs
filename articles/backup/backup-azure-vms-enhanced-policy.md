---
title: Back up Azure VMs with Enhanced policy (in preview)
description: Learn how to configure Enhanced policy to back up VMs.
ms.topic: how-to
ms.date: 12/21/2021
ms.reviewer: geg
author: v-amallick
ms.service: backup
ms.author: v-amallick
---
# Back up an Azure VM using Enhanced policy (in preview)

This article explains how to use _Enhanced policy_ to configure _Multiple Backups Per Day_ and back up [Trusted Launch VMs](../virtual-machines/trusted-launch.md) with the Azure Backup service. _Enhanced policy_ for backup of VMs is in preview.

Azure Backup now supports _Enhanced policy_ that's needed to support new Azure offerings. For example, [Trusted Launch VM](../virtual-machines/trusted-launch.md) is supported with _Enhanced policy_ only. To enroll your subscription for backup of Trusted Launch VM, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).

>[!Important]
>The existing [default policy](./backup-during-vm-creation.md#create-a-vm-with-backup-configured) won’t support protecting newer Azure offerings, such as Trusted Launch VM, UltraSSD, Shared disk, and Confidential Azure VMs.

You must enable backup for Trusted Launch VM through enhanced policy only. The Enhanced policy provides the following features:

- Supports _Multiple Backups Per Day_. To enroll your subscription for this feature, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).
- Instant Restore tier is zonally redundant using Zone-redundant storage (ZRS) resiliency. See the [pricing details for Enhanced policy storage here](https://azure.microsoft.com/pricing/details/managed-disks/).

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing the enhanced backup policy options.":::

The following screenshot shows _Multiple Backups_ occurred in a day.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-inline.png" alt-text="Screenshot showing the multiple backup instances occurred in a day." lightbox="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-expanded.png":::

>[!Note]
>The above screenshot shows that one of the backups is transferred to the Vault-Standard tier.

## Create an Enhanced policy and configure VM backup

Follow these steps:

1. In the Azure portal, select a Recovery Services vault to back up the VM.

2. Under **Backup**, select **Backup Policies**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/choose-backup-policies-option.png" alt-text="Screenshot showing to choose the backup policies option.":::

3. Click **+Add**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/add-backup-policy.png" alt-text="Screenshot showing to add a backup policy.":::

4. On **Select policy type**, select **Azure Virtual Machine**.

5. On **Create policy**, perform the following actions:

   - **Policy sub-type**: Select **Enhanced** type. By default, the policy type is set to **Standard**.
   
     :::image type="content" source="./media/backup-azure-vms-enhanced-policy/select-enhanced-backup-policy-sub-type.png" alt-text="Screenshot showing to select backup policies sub-type as enhanced.":::
	 
   - **Backup schedule**: You can select frequency as **Hourly**/Daily/Weekly. 
	  
     By default, the enhanced backup schedule is set to **Hourly**, with **8 AM** as the start time, **Every 4 hours** as the schedule, and **24 Hours** as duration. You can choose to modify the settings as needed.

     Note that the Hourly backup frequency is in preview. To enroll your subscription for this feature, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).
   
   - **Instant Restore**: You can set the retention of recovery snapshot from 1 to 30 days. The default value is set to 7.
   - **Retention range**: The options for retention range are auto-selected based on the backup frequency you choose. The default retention for daily, weekly, monthly, and yearly backup points are set to 180 days, 12 weeks, 60 months, and 10 years respectively. You can customize the values as per the requirement.
   
   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing to configure the enhanced backup policy.":::
   
6. Click **Create**.

>[!Note]
>- We support the Enhanced policy configuration through [Recovery Services vault](./backup-azure-arm-vms-prepare.md) and [VM Manage blade](./backup-during-vm-creation.md#start-a-backup-after-creating-the-vm) only. Configuration through Backup center is currently not supported.
>- For hourly backups, the last backup of the day is transferred to the vault. If the backup fails, the first backup of the next day is transferred to the vault.
>- Enhanced policy can be only availed for unprotected VMs that are new to Azure Backup. Note that Azure VMs that are protected with existing policy can't be moved to Enhanced policy.

## Next steps

- [Run a backup immediately](./backup-azure-vms-first-look-arm.md#run-a-backup-immediately)
- [Verify Backup job status](./backup-azure-arm-vms-prepare.md#verify-backup-job-status)
- [Restore Azure virtual machines](./backup-azure-arm-restore-vms.md#restore-disks)