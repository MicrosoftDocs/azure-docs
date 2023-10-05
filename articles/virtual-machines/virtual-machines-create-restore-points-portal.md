---
title: Creating Virtual Machine Restore Points using Azure portal
description: Creating Virtual Machine Restore Points using Azure portal
author: mamccrea
ms.author: mamccrea
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: tutorial
ms.date: 06/30/2022
ms.custom: template-tutorial
---


# Create virtual machine restore points using Azure portal

You can create virtual machine restore points through the Azure portal. You can protect your data and guard against extended downtime by creating [VM restore points](virtual-machines-create-restore-points.md#about-vm-restore-points) at regular intervals. This article shows you how to create VM restore points using the Azure portal. Alternatively, you can create VM restore points using the [Azure CLI](virtual-machines-create-restore-points-cli.md) or using [PowerShell](virtual-machines-create-restore-points-powershell.md).
 
In this tutorial, you learn how to:

> [!div class="checklist"]
> * [Create a VM restore point collection](#step-1-create-a-vm-restore-point-collection)
> * [Create a VM restore point](#step-2-create-a-vm-restore-point)
> * [Track the progress of Copy operation](#step-3-track-the-status-of-the-vm-restore-point-creation)
> * [Restore a VM](#restore-a-vm-from-a-restore-point)

## Prerequisites

- Learn more about the [support requirements](concepts-restore-points.md) and [limitations](virtual-machines-create-restore-points.md#limitations) before creating a restore point. 

## Step 1: Create a VM restore point collection
Use the following steps to create a VM restore points collection:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Search box, enter **Restore Point Collections**.

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-search.png" alt-text="Screenshot of search bar in Azure portal.":::

2. Select **+ Create** to create a new Restore Point Collection.

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-create.png" alt-text="Screenshot of Create screen.":::

3. Enter the details and select the VM for which you want to create a restore point collection. 

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-collection.png" alt-text="Screenshot of Create a restore point collection screen.":::

4. Select **Next: Restore Point** to create your first restore point or select **Review + Create** to create an empty restore point collection.

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-review.png" alt-text="Screenshot of validation successful screen.":::

## Step 2: Create a VM restore point
Use the following steps to create a VM restore point:

1. Navigate to the restore point collection where you want to create restore points and select **+ Create a restore point** to create new restore point for the VM.

    :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-creation.png" alt-text="Screenshot of Restore points tab.":::

2. Enter a name for the restore point and other required details and select **Next: Disks >**. 

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-basics.png" alt-text="Screenshot of Basics tab of Create a restore point screen.":::

3. Select the disks to be included in the restore point. 

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-disks.png" alt-text="Screenshot of selected disks.":::

4. Select **Review + create** to validate the settings. Once validation is completed, select **Create** to create the restore point.

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-validate.png" alt-text="Screenshot of Review + Create screen.":::
   
 
## Step 3: Track the status of the VM restore point creation

1. Select the notification to track the progress of the restore point creation. 

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-progress.png" alt-text="Screenshot of progress of VM restore point creation.":::
 
## Restore a VM from a restore point
To restore a VM from a VM restore point, first restore individual disks from each disk restore point. You can also use the [ARM template](https://github.com/Azure/Virtual-Machine-Restore-Points/blob/main/RestoreVMFromRestorePoint.json) to restore a VM along with all the disks.

1. Select **Create a disk from a restore point** to restore a disk from a disk restore point. Do this for all the disks that you want to restore. 

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-create-disk.png" alt-text="Screenshot of progress of disk creation.":::

2. Enter the details in the **Create a managed disk** dialog to create disks from the restore points. 
Once the disks are created, [create a new VM](./windows/create-vm-specialized-portal.md#create-a-vm-from-a-disk) and [attach these restored disks](./windows/attach-managed-disk-portal.md) to the newly created VM.

   :::image type="content" source="./media/virtual-machines-create-restore-points-portal/create-restore-points-manage-disk.png" alt-text="Screenshot of progress of Create a managed disk screen.":::

## Next steps
[Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
