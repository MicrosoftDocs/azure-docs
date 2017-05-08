---
title: Back up Azure VMs | Microsoft Docs
description: Discover, register, and back up Azure virtual machines to a recovery services vault.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: virtual machine backup; back up virtual machine; backup and disaster recovery; arm vm backup

ms.assetid: 5c68481d-7be3-4e68-b87c-0961c267053e
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/15/2017
ms.author: trinadhk;jimpark;markgal;
ms.custom: H1Hack27Feb2017

---
# Back up Azure virtual machines to a Recovery Services vault
> [!div class="op_single_selector"]
> * [Back up VMs to Recovery Services vault](backup-azure-arm-vms.md)
> * [Back up VMs to Backup vault](backup-azure-vms.md)
>
>

This article details how to back up Azure VMs (both Resource Manager-deployed and Classic-deployed) to a Recovery Services vault. Most of the work for backing up VMs is the preparation. Before you can back up or protect a VM, you must complete the [prerequisites](backup-azure-arm-vms-prepare.md) to prepare your environment for protecting your VMs. Once you have completed the prerequisites, then you can initiate the backup operation to take snapshots of your VM.


[!INCLUDE [learn about backup deployment models](../../includes/backup-deployment-models.md)]

For more information, see the articles on [planning your VM backup infrastructure in Azure](backup-azure-vms-introduction.md) and [Azure virtual machines](https://azure.microsoft.com/documentation/services/virtual-machines/).

## Triggering the backup job
The backup policy associated with the Recovery Services vault defines how often and when the backup operation runs. By default, the first scheduled backup is the initial backup. Until the initial backup occurs, the Last Backup Status on the **Backup Jobs** blade shows as **Warning(initial backup pending)**.

![Backup pending](./media/backup-azure-vms-first-look-arm/initial-backup-not-run.png)

Unless your initial backup is due to begin soon, it is recommended that you run **Back up Now**. The following procedure starts from the vault dashboard. This procedure serves for running the initial backup job after you have completed all prerequisites. If the initial backup job has already been run, this procedure is not available. The associated backup policy determines the next backup job.  

To run the initial backup job:

1. On the vault dashboard, click the number under **Backup Items**, or click the **Backup Items** tile. <br/>
  ![Settings icon](./media/backup-azure-vms-first-look-arm/rs-vault-config-vm-back-up-now-1.png)

  The **Backup Items** blade opens.

  ![Back up items](./media/backup-azure-vms-first-look-arm/back-up-items-list.png)

2. On the **Backup Items** blade, select the item.

  ![Settings icon](./media/backup-azure-vms-first-look-arm/back-up-items-list-selected.png)

  The **Backup Items** list opens. <br/>

  ![Backup job triggered](./media/backup-azure-vms-first-look-arm/backup-items-not-run.png)

3. On the **Backup Items** list, click the ellipses **...** to open the Context menu.

  ![Context menu](./media/backup-azure-vms-first-look-arm/context-menu.png)

  The Context menu appears.

  ![Context menu](./media/backup-azure-vms-first-look-arm/context-menu-small.png)

4. On the Context menu, click **Backup now**.

  ![Context menu](./media/backup-azure-vms-first-look-arm/context-menu-small-backup-now.png)

  The Backup Now blade opens.

  ![shows the Backup Now blade](./media/backup-azure-vms-first-look-arm/backup-now-blade-short.png)

5. On the Backup Now blade, click the calendar icon, use the calendar control to select the last day this recovery point is retained, and click **Backup**.

  ![set the last day the Backup Now recovery point is retained](./media/backup-azure-vms-first-look-arm/backup-now-blade-calendar.png)

  Deployment notifications let you know the backup job has been triggered, and that you can monitor the progress of the job on the Backup jobs page. Depending on the size of your VM, creating the initial backup may take a while.

6. To view or track the status of the initial backup, on the vault dashboard, on the **Backup Jobs** tile click **In progress**.

  ![Backup Jobs tile](./media/backup-azure-vms-first-look-arm/open-backup-jobs-1.png)

  The Backup Jobs blade opens.

  ![Backup Jobs tile](./media/backup-azure-vms-first-look-arm/backup-jobs-in-jobs-view-1.png)

  In the **Backup jobs** blade, you can see the status of all jobs. Check if the backup job for your VM is still in progress, or if it has finished. When a backup job is finished, the status is *Completed*.

  > [!NOTE]
  > As a part of the backup operation, the Azure Backup service issues a command to the backup extension in each VM to flush all writes and take a consistent snapshot.
  >
  >

## Troubleshooting errors
If you run into issues while backing up your virtual machine, see the [VM troubleshooting article](backup-azure-vms-troubleshoot.md) for help.

## Next steps
Now that you have protected your VM, see the following articles to learn about VM management tasks, and how to restore VMs.

* [Manage and monitor your virtual machines](backup-azure-manage-vms.md)
* [Restore virtual machines](backup-azure-arm-restore-vms.md)
