---
title: Back up Azure VMs with Enhanced policy
description: Learn how to configure Enhanced policy to back up VMs.
ms.topic: how-to
ms.date: 07/04/2022
ms.reviewer: geg
author: v-amallick
ms.service: backup
ms.author: v-amallick
---
# Back up an Azure VM using Enhanced policy

This article explains how to use _Enhanced policy_ to configure _Multiple Backups Per Day_ and back up [Trusted Launch VMs](../virtual-machines/trusted-launch.md) with Azure Backup service.

Azure Backup now supports _Enhanced policy_ that's needed to support new Azure offerings. For example, [Trusted Launch VM](../virtual-machines/trusted-launch.md) is supported with _Enhanced policy_ only.

>[!Important]
>- [Default policy](./backup-during-vm-creation.md#create-a-vm-with-backup-configured) will not support protecting newer Azure offerings, such as [Trusted Launch VM](backup-support-matrix-iaas.md#tvm-backup), [Ultra SSD](backup-support-matrix-iaas.md#vm-storage-support), [Shared disk](backup-support-matrix-iaas.md#vm-storage-support), and Confidential Azure VMs.
>- Enhanced policy currently doesn't support protecting Ultra SSD.

You must enable backup of Trusted Launch VM through enhanced policy only. Enhanced policy provides the following features:

- Supports *Multiple Backups Per Day* (in preview).
- Instant Restore tier is zonally redundant using Zone-redundant storage (ZRS) resiliency. See the [pricing details for Managed Disk Snapshots](https://azure.microsoft.com/pricing/details/managed-disks/).

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing the enhanced backup policy options.":::

The following screenshot shows _Multiple Backups_ occurred in a day.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-inline.png" alt-text="Screenshot showing the multiple backup instances occurred in a day." lightbox="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-expanded.png":::

>[!Note]
>The above screenshot shows that one of the backups is transferred to Vault-Standard tier.

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
   
     :::image type="content" source="./media/backup-azure-vms-enhanced-policy/select-enhanced-backup-policy-sub-type.png" alt-text="Screenshot showing to select backup policies subtype as enhanced.":::
	 
   - **Backup schedule**: You can select frequency as **Hourly**/Daily/Weekly.
	  
     With backup schedule set to **Hourly**, the default selection for start time is **8 AM**, schedule is **Every 4 hours**, and duration is **24 Hours**. Hourly backup has a minimum RPO of 4 hours and a maximum of 24 hours. You can set the backup schedule to 4, 6, 8, 12, and 24 hours respectively.

     Note that Hourly backup frequency is in preview.
   
   - **Instant Restore**: You can set the retention of recovery snapshot from _1_ to _30_ days. The default value is set to _7_.
   - **Retention range**: Options for retention range are auto-selected based on backup frequency you choose. The default retention for daily, weekly, monthly, and yearly backup points are set to 180 days, 12 weeks, 60 months, and 10 years respectively. You can customize these values as required.
   
   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing to configure the enhanced backup policy.":::
   
6. Click **Create**.

>[!Note]
>- The support for Enhanced policy is available in all Azure public regions, and not in US Sovereign regions.
>- We support Enhanced policy configuration through [Recovery Services vault](./backup-azure-arm-vms-prepare.md) and [VM Manage blade](./backup-during-vm-creation.md#start-a-backup-after-creating-the-vm) only. Configuration through Backup center is currently not supported.
>- For hourly backups, the last backup of the day is transferred to vault. If backup fails, the first backup of the next day is transferred to vault.
>- Enhanced policy is only available to unprotected VMs that are new to Azure Backup. Note that Azure VMs that are protected with existing policy can't be moved to Enhanced policy.
>- Back up an Azure VM with disks that has public network access disabled is not supported.

## Next steps

- [Run a backup immediately](./backup-azure-vms-first-look-arm.md#run-a-backup-immediately)
- [Verify Backup job status](./backup-azure-arm-vms-prepare.md#verify-backup-job-status)
- [Restore Azure virtual machines](./backup-azure-arm-restore-vms.md#restore-disks)
- [Troubleshoot VM backup](backup-azure-vms-troubleshoot.md#usererrormigrationfromtrustedlaunchvm-tonontrustedvmnotallowed)