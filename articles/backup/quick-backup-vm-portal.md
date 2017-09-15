---
title: Quickstart - Back up virtual machines in Azure | Microsoft Docs
description: This quickstart details how to back up Azure virtual machines to a Recovery Services vault.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: virtual machine backup; back up virtual machine; backup and disaster recovery; arm vm backup

ms.assetid: ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 9/15/2017
ms.author: trinadhk;jimpark;markgal;
ms.custom:

---
# Back up Azure virtual machines with the Azure portal

You can back up Azure virtual machines through the Azure portal. Before you back up data to Azure, you must first create a Recovery Services vault, which is where your data is stored. This article details creating the Recovery Services vault and then backing up your virtual machines, in the Azure portal. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. Then see the quickstart for [creating a Windows virtual machine in Azure](../virtual-machines/windows/quick-create-portal.md). This quickstart assumes you already have a virtual machine running in Azure.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Back up your virtual machine

1. In the menu on the left, select **Virtual machines**.
2. From the list of virtual machines, select a VM to back up.
3. On the virtual machine blade, in the **Operations** section, click **Backup**. The **Enable backup** blade opens.
4. In **Recovery Services vault**, click **Create new** and provide the name for the new vault. A new vault is created in the same Resource Group and location as the virtual machine.
5. Click **Backup policy**. For this example, keep the defaults and click **OK**.
6. On the **Enable backup** blade, click **Enable Backup**. This creates a daily backup based on the default schedule.
7. To create an initial recovery point, on the **Backup** blade click **Backup now**.
8. On the **Backup Now** blade, click the calendar icon, use the calendar control to select the last day this recovery point is retained, and click **Backup**.
9. In the **Backup** blade for your VM, you will see the number of recovery points that are complete.

    ![Recovery points](../virtual-machines/windows/media/tutorial-backup-vms/backup-complete.png)

In this quickstart you learned how to 

  > [!div class="checklist"]
> * Create a recovery services vault
> * Backup of a VM
> * Schedule a daily backup

## Next steps
In this quickstart you created a Recovery Services vault and protected your virtual machine. To learn more, continue to the Azure Backup tutorials.

> [!div class="nextstepaction"]
> [Azure Backup tutorials](tutorial-backup-azure-vm.md)
