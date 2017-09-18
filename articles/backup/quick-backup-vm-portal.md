---
title: Azure Quick Start - Back up a VM with the Azure portal | Microsoft Docs
description: Learn how to back up your virtual machines with the Azure portal
services: virtual-machines-windows, azure-backup
documentationcenter: virtual-machines
author: iainfoulds
manager: jeconnoc
editor: 
tags: azure-resource-manager, virtual-machine-backup

ms.assetid: 
ms.service: virtual-machines-windows, azure-backup
ms.devlang: azurecli
ms.topic: hero-article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/18/2017
ms.author: iainfou
ms.custom: mvc
---

# Back up a virtual machine in Azure
Azure backups can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring Azire backups and all related resources. You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. This article details how to back up a virtual machine (VM) with the Azure PowerShell module. You can also perform these steps with the [Azure CLI](quick-backup-vm-cli.md) or [Azure PowerShell](quick-backup-vm-powershell.md).

This quick start enables backup on an existing Azure VM. If you need to create a VM, you can [create a VM with the Azure portal](../virtual-machines/windows/quick-create-portal.md).


## Create a backup
Create a simple scheduled daily backup to a Recovery Services Vault. 

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the menu on the left, select **Virtual machines**. 
3. From the list, select a VM to back up.
4. On the VM blade, in the **Settings** section, click **Backup**. The **Enable backup** blade opens.


## Create a recovery services vault
A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as Azure VMs. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. These recovery points are used to then restore data to a given point in time as needed.

1. In **Recovery Services vault**, click **Create new** and provide the name for the new vault. A new vault is created in the same Resource Group and location as the virtual machine.

By default, the vault is set for Geo-Redundant storage. To further protect your data, this storage redundancy level ensures that your backup data is replicated to a secondary Azure region that is hundreds of miles away from the primary region.


## Enable backup for an Azure VM
You create and use policies to define when a backup job runs and how long the recovery points are stored. The default protection policy runs a backup job each day at midnight and retains recovery points for 30 days. You can use these default policy values to quickly protect your VM. 

1. Click **Backup policy**. For this example, keep the defaults and click **OK**.
2. On the **Enable backup** blade, click **Enable Backup**. This creates a daily backup based on the default schedule.


## Start a backup job
You can start a backup now rather than wait for the default policy to run the job at midnight. This first backup job creates a full recovery point. Each backup job after this initial backup creates incremental recovery points. Incremental recovery points are storage and time-efficient, as they only transfer changes made since the last backup.

1. To create an initial recovery point, on the **Backup** blade click **Backup now**.
2. On the **Backup Now** blade, click the calendar icon, use the calendar control to select the last day this recovery point is retained, and click **Backup**.


## Monitor a backup job
1. In the **Backup** blade for your VM, you will see the number of recovery points that are complete.

	![Recovery points](./media/tutorial-backup-vms/backup-complete.png)


## Clean up deployment
When no longer needed, you can disable protection on the VM, remove the restore points and Recovery Services vault, then delete the resource group and associated VM resources:


## Next steps
In this quick start, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point. To learn more about Azure Backup and Recovery Services, continue to the tutorials.

> [!div class="nextstepaction"]
> [Restore VMs using templates](./tutorial-backup-azure-vm.md)