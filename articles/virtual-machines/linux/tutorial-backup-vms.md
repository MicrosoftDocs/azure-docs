---
title: Backup Azure Linux VMs | Microsoft Docs'
description: Protect your Linux VMs by backing them up using Azure Backup.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/26/2017
ms.author: cynthn
---
# Back up Linux  virtual machines in Azure

Protect your data by taking snapshots of your data at defined intervals. These snapshots are known as recovery points, and they are stored in recovery services vaults. If or when it is necessary to repair or rebuild a VM, you can restore the VM from any of the saved recovery points. When you restore a recovery point, you can create a new VM which is a point-in-time representation of your backed-up VM, or restore disks and use the template that comes along with it to customize the restored VM or do an individual file recovery. This article explains how to restore a VM to a new VM or restore all backed-up disks. For individual file recovery, refer to [Recover files from Azure VM backup](backup-azure-restore-files-from-vm.md)

## Backup overview

When the Azure Backup service initiates a backup job at the scheduled time, it triggers the backup extension to take a point-in-time snapshot. The Azure Backup service uses the _VMSnapshotLinux_ extension in Linux. The extension is installed during the first VM backup if the VM is running. If the VM is not running, the Backup service takes a snapshot of the underlying storage (since no application writes occur while the VM is stopped).

Backing up and restoring business critical data is complicated by the fact that business critical data must be backed up while the applications that produce the data are running. To ensure application consistency when backing up Linux VMs, create custom pre-scripts and post-scripts that control the backup workflow and environment. Azure Backup invokes the pre-script before taking the VM snapshot and invokes the post-script once the VM snapshot job completes. For more details, see [application consistent VM backups using pre-script and post-script](https://docs.microsoft.com/azure/backup/backup-azure-linux-app-consistent). If the pre-script and post-scripts execute successfully, Azure Backup marks the recovery point as application consistent. However, the customer is ultimately responsible for the application consistency when using custom scripts.

Once the Azure Backup service takes the snapshot, the data is transferred to the vault. To maximize efficiency, the service identifies and transfers only the blocks of data that have changed since the previous backup.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

When the data transfer is complete, the snapshot is removed and a recovery point is created.


This table explains the types of consistency and the conditions that they occur under during Azure VM backup and restore procedures.

| Consistency | VSS-based | Explanation and details |
| --- | --- | --- |
| Application consistency |Yes for Windows|Application consistency is ideal for workloads as it ensures that:<ol><li> The VM *boots up*. <li>There is *no corruption*. <li>There is *no data loss*.<li> The data is consistent to the application that uses the data, by involving the application at the time of backup--using VSS or pre/post script.</ol> <li>*Windows VMs*- Most Microsoft workloads have VSS writers that do workload-specific actions related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures that the writes to the transaction log file and the database are done correctly. For Azure Windows VM backups, to create an application-consistent recovery point, the backup extension must invoke the VSS workflow and complete it before taking the VM snapshot. For the Azure VM snapshot to be accurate, the VSS writers of all Azure VM applications must complete as well. (Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) and dive deep into the details of [how it works](https://technet.microsoft.com/library/cc785914%28v=ws.10%29.aspx)). </li> <li> *Linux VMs*- Customers can execute [custom pre-script and post-script to ensure application consistency](https://docs.microsoft.com/azure/backup/backup-azure-linux-app-consistent). </li> |
| File-system consistency |Yes - for Windows-based computers |There are two scenarios where the recovery point can be *file-system consistent*:<ul><li>Backups of Linux VMs in Azure, without pre-script/post-script or if pre-script/post-script failed. <li>VSS failure during backup for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> The VM *boots up*. <li>There is *no corruption*.<li>There is *no data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data. |
| Crash consistency |No |This situation is equivalent to a virtual machine experiencing a "crash" (through either a soft or hard reset). Crash consistency typically happens when the Azure virtual machine is shut down at the time of backup. A crash-consistent recovery point provides no guarantees around the consistency of the data on the storage medium--either from the perspective of the operating system or the application. Only the data that already exists on the disk at the time of backup is captured and backed up. <br/> <br/> While there are no guarantees, usually, the operating system boots, followed by disk-checking procedure, like chkdsk, to fix any corruption errors. Any in-memory data or writes that have not been transferred to the disk are lost. The application typically follows with its own verification mechanism in case data rollback needs to be done. <br><br>As an example, if the transaction log has entries that are not present in the database, then the database software does a rollback until the data is consistent. When data is spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data. |


###Pricing
The cost of backing up Azure VMs is based on the number of protected instances. For a definition of a protected instance, see [What is a protected instance](backup-introduction-to-azure-backup.md#what-is-a-protected-instance). For an example of calculating the cost of backing up a virtual machine, see [How are protected instances calculated](backup-azure-vms-introduction.md#calculating-the-cost-of-protected-instances). See the Azure Backup Pricing page for information about [Backup Pricing](https://azure.microsoft.com/pricing/details/backup/).


## Create a backup
Create a simple daily backup schedule to a Recovery Services Vault. The Recovery Services Vault by deafult is geo-redundant storage.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the menu on the left, select **Virtual machines**. 
3. From the list, select a VM to back up.
4. On the VM blade, in the **Settings** section, click **Backup**. The **Enable backup** blade opens.
5. For the [Recovery Services vault](backup-azure-vms-first-look-arm.md#create-a-recovery-services-vault-for-a-vm), click **Create new** and provide the name for the new vault. A new vault is created in the same Resource Group and same location as the virtual machine.
6. Click **Backup policy**. The default policy is to create a backup daily at 8:30 PM and to retain the backup for 180 days. Keep the defaults for this example and click **OK**.

    ![Select backup policy](./media/tutorial-backup-vms/policy.png)

7. On the Enable backup blade, click **Enable Backup**. 
9. Once the configuration has completed, on the VM management blade, click **Backup** to open the Backup Item blade and view the details.

  ![VM Backup Item View](../../backup/media/backup-azure-vms-first-look-arm/backup-item-view.png)

  Until the initial backup has completed, **Last backup status** shows as **Warning(Initial backup pending)**. To see when the next scheduled backup job occurs, under **Backup policy** click the name of the policy. The Backup Policy blade opens and shows the time of the scheduled backup.

10. To create an initial recovery point, on the Backup vault blade click **Backup now**.

11. On the Backup Now blade, click the calendar icon, use the calendar control to select the last day this recovery point is retained, and click **Backup**.

Deployment notifications let you know the backup job has been triggered, and that you can monitor the progress of the job on the Backup jobs page.

## Restore a file


/var/www/html/index.nginx-debian.html


1. Sign in to the [Azure portal](https://portal.azure.com/).
6. In the menu on the left, select **Virtual machines**. 
7. From the list, select the VM.
8. On the VM blade, in the **Settings** section, click **Backup**. The **Backup** blade opens. 
9. In the menu at the top of the blade, select **File Recovery (Preview)**. The **File Recovery (Preview) blade opens.
10. In **Step 1: Select recovery point**, select a recovery point from the drop-down.
11. In **Step 2: Download script to browse and recover files**, click the **Download Executable** button. Save the downloaded file to your local computer.
7. Click **Download script** to download the script file locally.
8. Open a Bash prompt and type the following, replacing *Linux_myVM_05-02-2017.sh* with the correct path and filename for the script that you downloaded, *azureuser* with the username for the VM and *52.166.121.3* with the public IP address for your VM:
    ```bash
	scp test.sh azureuser@52.166.121.3:
	```
9. Open an SSH connection to the VM.
    ```bash
	ssh <publicIpAddress>
	```
10. Add execute permissions to the script file.
    ```bash
	chmod +x Linux_myVM_05-02-2017.sh
	```
11. Run the script to mount the recovery point as a filesystem.


## Next steps



