---
title: Quickstart - Back up virtual machines in Azure | Microsoft Docs
description: This quickstart details how to back up Azure virtual machines to a Recovery Services vault.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: virtual machine backup; back up virtual machine; backup and disaster recovery; arm vm backup

ms.assetid: 
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 9/16/2017
ms.author: trinadhk;jimpark;markgal;

---
# Back up Azure virtual machines with the Azure portal

Backing up your data is a good practice for business and data continuity. In Azure you back up data to a storage entity called a Recovery Services vault. It is easy to use the Azure portal to back up a virtual machine; the Backup service is integrated into the virtual machine service. This article details using the Azure portal to create the Recovery Services vault and then back up a virtual machine. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Sign in to Azure

Sign in to the Azure portal at http://portal.azure.com. 

This quickstart assumes you already have a virtual machine running in Azure. If you don't have a virtual machine in Azure, create one using the quickstart for [creating a Windows virtual machine in Azure](../virtual-machines/windows/quick-create-portal.md).

## Back up your virtual machine

1. In the menu on the left, select **Virtual machines**. The Virtual machines menu opens.
 ![select virtual machines in left menu](./media/quick-backup-vm-portal/left-hub-virtual-machine.png)

2. From the Virtual machines menu, select **myVM**. The menu for **myVM** opens.
 ![select your virtual machines from list](./media/quick-backup-vm-portal/virtual-machine-in-list.png)

3. In the **myVM** menu, in the **Operations** section, click **Backup** to open the **Enable backup** menu. It may be necessary to scroll down the menu to see Backup. </br>
  ![choose Backup option from menu](./media/quick-backup-vm-portal/choose-backup-from-menu.png)

4. In the **Enable backup** menu, make the following selections to create a new vault in the same resource group and location as the virtual machine:
  - For Recovery Services vault select **Create new** and enter **myBackupVault** as the name of the vault. 
  - For Resource group, select **Use existing** and choose **myResourceGroup** from the drop-down menu. The resource group, myResourceGroup, is the group containing the virtual machine, myVM. 
  - For Backup policy use **(new) DailyPolicy**
  - Click **Enable Backup** to create the vault and establish the policy.
  ![make selections to Enable backup menu](./media/quick-backup-vm-portal/configure-recovery-services-vault.png)

## Create an initial backup

Though you enabled the schedule for backup policy, which backs up the virtual machine once a day, the first backup has not occurred. It is a good practice to trigger an initial backup so your virtual machine is protected. Triggering the backup activity generates a restore point. Restore points are also called recovery points. Use the following steps to trigger the initial backup. 

1. On the myVM menu, click **Backup** to open the Backup dashboard.  
  ![choose Backup option from menu](./media/quick-backup-vm-portal/choose-backup-from-menu.png)

2. On the **Backup** dashboard click **Backup now**.
  ![select Backup Now in menu](./media/quick-backup-vm-portal/initial-backup.png)

  The **Backup Now** menu opens. The backup job you are triggering isn't handled by the backup policy. For this reason, you must specify how long to retain the restore point.

3. On the **Backup Now** menu, use the calendar control to select the last day this recovery point is retained, and click **Backup**.</br>
  ![select Backup Now in menu](./media/quick-backup-vm-portal/set-retention-for-initial-backup.png) 

  The initial backup takes a while to complete. It may take as long as 20 minutes or more to create the restore point. Once the restore point has been created, you see it in the Restore points tile.

  ![Recovery points](./media/quick-backup-vm-portal/backup-complete.png)

## Clean up resources

If you are going to continue on to a Backup tutorial that explains how to restore data for your virtual machine, go to Next steps. If you are not going to use the backup data or the Recovery Services vault, then use the following steps to delete the restore points and your Recovery Services vault.

1. On the myVM menu, click **Backup** to open the Backup dashboard.  
  ![choose Backup option from menu](./media/quick-backup-vm-portal/choose-backup-from-menu.png)

2. In the Backup dashboard, click **...More** to show additional options, then click **Stop backup** to open the Stop Backup menu.  
  ![choose additional Backup options from menu](./media/quick-backup-vm-portal/stop-backup-menu-item-in-dashboard.png)

3. In the Stop Backup menu, select the upper drop-down menu and choose **Delete Backup Data**. The Stop Backup menu adjusts to your choice.
  ![choose delete data option from menu](./media/quick-backup-vm-portal/delete-data-in-vault.png)

4. In the **Type the name of the Backup item** dialog, type myVM. If you aren't sure what name to type, enter the name you think it should be, and hover over the exclamation point. The name of the backup item to use, appears. You must enter the name of the backup item to delete the data in the vault.
  ![enter name of backup item to delete](./media/quick-backup-vm-portal/enter-vm-name-to-delete.png)

5. Once the backup item is verified, the Stop backup button is enabled. Optionally you can choose a reason why you are deleting the Recovery Services vault, and provide comments. Click **Stop Backup** to delete the restore point and the Recovery Services vault.</br>
  ![click Stop backup to delete vault](./media/quick-backup-vm-portal/provide-reason-for-delete.png)

In this quickstart you learned how to:

  > [!div class="checklist"]
> * Create a recovery services vault
> * Schedule a daily backup
> * Trigger the initial backup for a virtual machine

## Next steps
To learn more, see the tutorial for backing up multiple virtual machines.

> [!div class="nextstepaction"]
> [Back up virtual machines at scale](tutorial-backup-azure-vm.md)
