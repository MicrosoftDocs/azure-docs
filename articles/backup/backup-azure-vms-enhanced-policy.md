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
# Back up an Azure VM using enhanced policy (in preview)

Azure Backup now provides an enhanced policy through which you can enable all newer compute storage capabilities (for example, [Trusted VM](/azure/virtual-machines/trusted-launch-portal?tabs=portal).

>[!Important]
>The [default policy](/azure/backup/backup-during-vm-creation#create-a-vm-with-backup-configured) won’t support managing the newer compute storage capabilities, such as Trusted VM, UltraSSD, Shared disk, and Confidential Azure VMs.

This article explains how to back up Trusted VMs with the Azure Backup service using the Enhanced policy. Trusted VM is in private preview. To enroll your subscription for Trusted VM, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).

You must enable Trusted VM through enhanced policy only. The Enhanced policy provides the following features:

- Supports multiple backups per day. To enroll your subscription for this feature, write to us at [askazurebackupteam@microsoft.com](mailto:askazurebackupteam@microsoft.com).
- Instant Restore tier is zonally redundant using Zone-redundant storage (ZRS) resiliency. See the [pricing details page](https://azure.microsoft.com/pricing/details/managed-disks/).

:::image:::

The following figure shows multiple backups occured in a day.

:::image:::

## Create an Enhanced policy and configure VM backup

Follow these steps:

1. In the Azure portal, select a Recovery Services vault to back up the VM.

2. Under **Backup**, select **Backup Policies**.

   :::image:::

3. Click **+Add**.

   :::image:::

4. On **Select policy type**, select **Azure Virtual Machine**.

5. On **Create policy**, perform the following actions:

   - **Policy sub-type**: Select **Enhanced** type. By default, the policy type is set to **Standard**.
   
     :::image:::
	 
	- **Backup schedule**: You can select frequency as **Hourly**/**Daily**/**Weekly**. By default, the enhanced backup schedule is set to **Hourly**, with **8 AM** as the start time, **Every 4 hours** as the schedule, and **24 Hours** as duration. You can choose to modify the settings as needed.

      Note that the Hourly backup frequency is in private preview. To enroll your subscription for this feature, write to us at askazurebackupteam@microsoft.com.
   - **Instant Restore**: You can set the retention of recovery snapshot from 1 to 30 days. The default value is set to 7.
   - **Retention range**: The retention of daily backup point is set to 180 d3ays. You can modify the retention period as required.
   
   :::image:::
   
6. Click **Create**.

>[!Note]
>- We support the Enhanced policy configuration through [Recovery Services vault]() and [VM Managed blade]() only. Configuration through Backup center is currently not supported.
>
>- The last backup of the day is transferred to the vault. If the backup fails, the first backup of the next day is taken as a full backup.





 





















## Next steps

[Restore encrypted Azure virtual machines](restore-azure-encrypted-virtual-machines.md)

If you run into any issues, review these articles:

- [Common errors](backup-azure-vms-troubleshoot.md) when backing up and restoring encrypted Azure VMs.
- [Azure VM agent/backup extension](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) issues.
