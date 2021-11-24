---
title: Back up Azure VMs with enhanced policy (in preview)
description: Learn how to back up VMs with enhanced policies
ms.topic: how-to
ms.date: 11/18/2021
ms.reviewer: geg
author: v-amallick
ms.service: backup
ms.author: v-amallick
---
# Back up an Azure VM using Enhanced policy (in preview)

This article explains how to back up [Trusted Launch VMs](/azure/virtual-machines/trusted-launch) with the Azure Backup service using the Enhanced policy. Backup for Trusted Launch VM is in preview.

Azure Backup now supports Enhanced policy that's needed to support new Azure offerings. For example, [Trusted Launch VM](/azure/virtual-machines/trusted-launch) is supported with Enhanced policy only. To enroll your subscription for backup of Trusted Launch VM, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).

>[!Important]
>The existing [default policy](/azure/backup/backup-during-vm-creation#create-a-vm-with-backup-configured) won’t support protecting newer Azure offerings, such as Trusted Launch VM, UltraSSD, Shared disk, and Confidential Azure VMs.

You must enable backup for Trusted Launch VM through enhanced policy only. The Enhanced policy provides the following features:

- Supports multiple backups per day. To enroll your subscription for this feature, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).
- Instant Restore tier is zonally redundant using Zone-redundant storage (ZRS) resiliency. See the [pricing details for full snapshots with ZRS created by Azure Backup](https://azure.microsoft.com/pricing/details/managed-disks/).

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing the enhanced backup policy options.":::

The following figure shows multiple backups occurred in a day.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-inline.png" alt-text="Screenshot showing the multiple backup instances occurred in a day." lightbox="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-expanded.png":::

## Create an Enhanced policy and configure VM backup

Follow these steps:

1. In the Azure portal, select a Recovery Services vault to back up the VM.

2. Under **Backup**, select **Backup Policies**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/choose-backup-policies-option.png" alt-text="Screenshot showing to choose the backup policies option.":::

3. Click **+Add**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/add-backup-policy.png" alt-text="Screenshot showing to add a backup policies.":::

4. On **Select policy type**, select **Azure Virtual Machine**.

5. On **Create policy**, perform the following actions:

   - **Policy sub-type**: Select **Enhanced** type. By default, the policy type is set to **Standard**.
   
     :::image type="content" source="./media/backup-azure-vms-enhanced-policy/select-enhanced-backup-policy-sub-type.png" alt-text="Screenshot showing to select backup policies sub-type as enhanced.":::
	 
   - **Backup schedule**: You can select frequency as **Hourly**/**Daily**/**Weekly**. 
	  
     By default, the enhanced backup schedule is set to **Hourly**, with **8 AM** as the start time, **Every 4 hours** as the schedule, and **24 Hours** as duration. You can choose to modify the settings as needed.

     Note that the Hourly backup frequency is in preview. To enroll your subscription for this feature, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).
   
   - **Instant Restore**: You can set the retention of recovery snapshot from 1 to 30 days. The default value is set to 7.
   - **Retention range**: The retention of daily backup point is set to 180 days. You can modify the retention period as required.
   
   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing to configure the enhanced backup policy.":::
   
6. Click **Create**.

>[!Note]
>- We support the Enhanced policy configuration through [Recovery Services vault](/azure/backup/backup-azure-arm-vms-prepare) and [VM Manage blade](/azure/backup/backup-during-vm-creation#start-a-backup-after-creating-the-vm) only. Configuration through Backup center is currently not supported.
>
>- For hourly backups, the last backup of the day is transferred to the vault. If the backup fails, the first backup of the next day is transferred to the vault.

## Next steps

- [Run a backup immediately](/azure/backup/backup-azure-vms-first-look-arm#run-a-backup-immediately)
- [Verify Backup job status](/azure/backup/backup-azure-arm-vms-prepare#verify-backup-job-status)
- [Restore Azure virtual machines](/azure/backup/backup-azure-arm-restore-vms#restore-disks)

