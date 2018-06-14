---
title: Create a Windows VM from a specialized VHD in the Azure portal| Microsoft Docs
description: Create a new Windows VM from a VHD in the Azure portal.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 01/09/2018
ms.author: cynthn

---
# Create a VM from a VHD using the Azure portal


There are several ways to create VMs in Azure. If you already have a VHD to use or want to copy the VHD from and existing VM to use, you can create a new VM by attaching the VHD as the OS disk. This process *attaches* the VHD to a new VM as the OS disk.

You can also create a new VM  from the VHD of a VM that has been deleted. For example, if you have an Azure VM that is not working correctly, you can delete the VM and use the VHD to create a new VM. You can either reuse the same VHD or create copy of the VHD by creating a snapshot and then creating a new managed disk from the snapshot. This takes a couple more steps, but ensures you can keep the original VHD and also gives you a snapshot to fall back to if needed.

You have an on-premises VM that you would like to use to create a VM in Azure. You can upload the VHD and attach it to a new VM. To upload a VHD, you need to use PowerShell or another tool to upload it to a storage account, then create a managed disk from the VHD. For more information, see [Upload a specialized VHD](create-vm-specialized.md#option-2-upload-a-specialized-vhd)

If you want to use a VM or VHD to create multiple VMs, then you shouldn't use this method. For larger deployments, you should [create an image](capture-image-resource.md) and then [use that image to create multiple VMs](create-vm-generalized-managed.md).


## Copy a disk

Create a snapshot, then create a disk from the snapshot. This allows you to keep the original VHD as a fall back.

1. In the left menu, click on **All resources**.
2. In the **All types** drop-down, de-select **Select all** and then scroll down and select **Disks** to find the available disks.
3. Click on the disk that you would like to use. The **Overview** page for the disk opens.
4. In the Overview page, on the menu at the top, click **+ Create snapshot**. 
5. Type a name for the snapshot.
6. Choose a **Resource group** for the snapshot. You can either use an existing resource group or create a new one.
7. Choose whether to use standard (HDD) or Premium (SDD) storage.
8. When you are done, click **Create** to create the snapshot.
9. Once the snapshot has been created, click on **+ Create a resource** in the left menu.
10. In the search bar, type **managed disk** and select **Managed Disks** from the list.
11. On the **Managed Disks** page, click **Create**.
12. Type a name for the disk.
13. Choose a **Resource group** for the disk. You can either use an existing resource group or create a new one. This will also be the resource group where you create the VM from the disk.
14. Choose whether to use standard (HDD) or Premium (SDD) storage.
15. In **Source type**, make sure **Snapshot** is selected.
16. In the **Source snapshot** drop-down, select the snapshot you want to use.
17. Make any other adjustments as needed and then click **Create** to create the disk.

## Create a VM from a disk

Once you have the managed disk VHD that you want to use, you can create the VM in the portal.

1. In the left menu, click on **All resources**.
2. In the **All types** drop-down, de-select **Select all** and then scroll down and select **Disks** to find the available disks.
3. Click on the disk that you would like to use. The **Overview** page for the disk opens.
In the Overview page, make sure that **DISK STATE** is listed as **Unattached**. If it isn't, you might need to either detach the disk from the VM or delete the VM to free up the disk.
4. In the menu at the top of the pane, click **+ Create VM**.
5. On the **Basics** page for the new VM, type in a name and select either an existing resource group or create a new one.
6. On the **Size** page, select a VM size page and then click **Select**.
7. On the **Settings** page, you can either let the portal create all new resources or you can select an existing **Virtual network** and **Network security group**. The portal always create a new NIC and public IP address for the new VM. 
8. Make any changes to the monitoring options and add any extensions as needed.
9. When you are done, click **OK**. 
10. If the VM configuration passes validation, click **OK** to start the deployment.

## Next steps

You can also use PowerShell to [upload a VHD to Azure and create a specialized VM](create-vm-specialized.md).


