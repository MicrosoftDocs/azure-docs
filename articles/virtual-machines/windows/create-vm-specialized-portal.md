---
title: Create a Windows VM from a specialized VHD in the Azure portal
description: Create a new Windows VM from a VHD in the Azure portal.
author: cynthn
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 01/18/2019
ms.author: cynthn

---
# Create a VM from a VHD by using the Azure portal

There are several ways to create a virtual machine (VM) in Azure: 

- If you already have a virtual hard disk (VHD) to use or you want to copy the VHD from an existing VM to use, you can create a new VM by *attaching* the VHD to the new VM as an OS disk. 

- You can create a new VM from the VHD of a VM that has been deleted. For example, if you have an Azure VM that isn't working correctly, you can delete the VM and use its VHD to create a new VM. You can either reuse the same VHD or create a copy of the VHD by creating a snapshot and then creating a new managed disk from the snapshot. Although creating a snapshot takes a few more steps, it preserves the original VHD and provides you with a fallback.

- Take a classic VM and use the VHD to create a new VM that uses the Resource Manager deployment model and managed disks. For the best results, **Stop** the classic VM in the Azure portal before creating the snapshot.
 
- You can create an Azure VM from an on-premises VHD by uploading the on-premises VHD and attaching it to a new VM. You use PowerShell or another tool to upload the VHD to a storage account, and then you create a managed disk from the VHD. For more information, see [Upload a specialized VHD](create-vm-specialized.md#option-2-upload-a-specialized-vhd). 

Don't use a specialized disk if you want to create multiple VMs. Instead, for larger deployments, [create an image](capture-image-resource.md) and then [use that image to create multiple VMs](create-vm-generalized-managed.md).

We recommend that you limit the number of concurrent deployments to 20 VMs from a single snapshot or VHD. 

## Copy a disk

Create a snapshot and then create a disk from the snapshot. This strategy allows you to keep the original VHD as a fallback:

1. From the [Azure portal](https://portal.azure.com), on the left menu, select **All services**.
2. In the **All services** search box, enter **disks** and then select **Disks** to display the list of available disks.
3. Select the disk that you would like to use. The **Disk** page for that disk appears.
4. From the menu at the top, select **Create snapshot**. 
5. Enter a **Name** for the snapshot.
6. Choose a **Resource group** for the snapshot. You can use either an existing resource group or create a new one.
7. For **Account type**, choose either **Standard (HDD)** or **Premium (SSD)** storage.
8. When you're done, select **Create** to create the snapshot.
9. After the snapshot has been created, select **Create a resource** in the left menu.
10. In the search box, enter **managed disk** and then select **Managed Disks** from the list.
11. On the **Managed Disks** page, select **Create**.
12. Enter a **Name** for the disk.
13. Choose a **Resource group** for the disk. You can use either an existing resource group or create a new one. This selection will also be used as the resource group where you create the VM from the disk.
14. For **Account type**, choose either **Standard (HDD)** or **Premium (SSD)** storage.
15. In **Source type**, ensure **Snapshot** is selected.
16. In the **Source snapshot** drop-down, select the snapshot you want to use.
17. Make any other adjustments as needed and then select **Create** to create the disk.

## Create a VM from a disk

After you have the managed disk VHD that you want to use, you can create the VM in the portal:

1. From the [Azure portal](https://portal.azure.com), on the left menu, select **All services**.
2. In the **All services** search box, enter **disks** and then select **Disks** to display the list of available disks.
3. Select the disk that you would like to use. The **Disk** page for that disk opens.
4. In the **Overview** page, ensure that **DISK STATE** is listed as **Unattached**. If it isn't, you might need to either detach the disk from the VM or delete the VM to free up the disk.
4. In the menu at the top of the page, select **Create VM**.
5. On the **Basics** page for the new VM, enter a **Virtual machine name** and either select an existing **Resource group** or create a new one.
6. For **Size**, select **Change size** to access the **Size** page.
7. Select a VM size row and then choose **Select**.
8. On the **Networking** page, you can either let the portal create all new resources or you can select an existing **Virtual network** and **Network security group**. The portal always creates a new network interface and public IP address for the new VM. 
9. On the **Management** page, make any changes to the monitoring options.
10. On the **Guest config** page, add any extensions as needed.
11. When you're done, select **Review + create**. 
12. If the VM configuration passes validation, select **Create** to start the deployment.


## Next steps

You can also use PowerShell to [upload a VHD to Azure and create a specialized VM](create-vm-specialized.md).


