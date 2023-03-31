---
title: Create a Windows VM from a specialized VHD in the Azure portal
description: Create a new Windows VM from a VHD in the Azure portal.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.collection: windows
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 02/24/2023
ms.author: cynthn

---
# Create a VM from a VHD by using the Azure portal

**Applies to:** :heavy_check_mark: Windows VMs 


> [!NOTE]
> Customers are encouraged to use Azure Compute Gallery as all new features like ARM64, Trusted Launch, and Confidential VM are only supported through Azure Compute Gallery.  If you have an existing VHD or managed image, you can use it as a source and create an Azure Compute Gallery image. For more information, see [Create an image definition and image version](../image-version.md).
> 
> Creating an image instead of just attaching a disk means you can create multiple VMs from the same source disk.


There are several ways to create a virtual machine (VM) in Azure:

- If you already have a virtual hard disk (VHD) to use or you want to copy the VHD from an existing VM to use, you can create a new VM by *attaching* the VHD to the new VM as an OS disk.

- You can create a new VM from the VHD of a VM that has been deleted. For example, if you have an Azure VM that isn't working correctly, you can delete the VM and use its VHD to create a new VM. You can either reuse the same VHD or create a copy of the VHD by creating a snapshot and then creating a new managed disk from the snapshot. Although creating a snapshot takes a few more steps, it preserves the original VHD and provides you with a fallback.

- You can create an Azure VM from an on-premises VHD by uploading the on-premises VHD and attaching it to a new VM. You use PowerShell or another tool to upload the VHD to a storage account, and then you create a managed disk from the VHD. For more information, see [Upload a specialized VHD](create-vm-specialized.md#option-2-upload-a-specialized-vhd).



> [!IMPORTANT]
>
> When you use a [specialized](shared-image-galleries.md#generalized-and-specialized-images) disk to create a new VM, the new VM retains the computer name of the original VM. Other computer-specific information (e.g. CMID) is also kept and, in some cases, this duplicate information could cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.  
> Don't use a specialized disk if you want to create multiple VMs. Instead, for larger deployments, create an image and then use that image to create multiple VMs. 
> For more information, see [Store and share images in an Azure Compute Gallery](shared-image-galleries.md).

We recommend that you limit the number of concurrent deployments to 20 VMs from a single snapshot or VHD.

## Copy a disk

Create a snapshot and then create a disk from the snapshot. This strategy allows you to keep the original VHD as a fallback:

1. Open the [Azure portal](https://portal.azure.com).
2. In the search box, enter **disks** and then select **Disks** to display the list of available disks.
3. Select the disk that you would like to use. The **Disk** page for that disk appears.
4. From the menu at the top, select **Create snapshot**.
5. Choose a **Resource group** for the snapshot. You can use either an existing resource group or create a new one.
6. Enter a **Name** for the snapshot.
7. For **Snapshot type**, choose **Full**.
8. For **Storage type**, choose **Standard HDD**, **Premium SSD**, or **Zone-redundant** storage.
9. When you're done, select **Review + create** to create the snapshot.
10. After the snapshot has been created, select **Home** > **Create a resource**.
11. In the search box, enter **managed disk** and then select **Managed Disks** from the list.
12. On the **Managed Disks** page, select **Create**.
13. Choose a **Resource group** for the disk. You can use either an existing resource group or create a new one. This selection will also be used as the resource group where you create the VM from the disk.
14. For **Region**, you must select the same region where the snapshot is located.
15. Enter a **Name** for the disk.
16. In **Source type**, ensure **Snapshot** is selected.
17. In the **Source snapshot** drop-down, select the snapshot you want to use.
18. For **Size**, you can change the storage type and size as needed.
19. Make any other adjustments as needed and then select **Review + create** to create the disk. Once validation passes, select **Create**.

## Create a VM from a disk

After you have the managed disk VHD that you want to use, you can create the VM in the portal:

1. In the search box, enter **disks** and then select **Disks** to display the list of available disks.
3. Select the disk that you would like to use. The **Disk** page for that disk opens.
4. In the **Essentials** section, ensure that **Disk state** is listed as **Unattached**. If it isn't, you might need to either detach the disk from the VM or delete the VM to free up the disk.
4. In the menu at the top of the page, select **Create VM**.
5. On the **Basics** page for the new VM, enter a **Virtual machine name** and either select an existing **Resource group** or create a new one.
6. For **Size**, select **Change size** to access the **Size** page.
7. The disk name should be pre-filled in the **Image** section.
8. On the **Disks** page, you may notice that the "OS Disk Type" cannot be changed. This preselected value is configured at the point of Snapshot or VHD creation and will carry over to the new VM. If you need to modify disk type take a new snapshot from an existing VM or disk. 
9. On the **Networking** page, you can either let the portal create all new resources or you can select an existing **Virtual network** and **Network security group**. The portal always creates a new network interface and public IP address for the new VM.
10. On the **Management** page, make any changes to the monitoring options.
11. On the **Guest config** page, add any extensions as needed.
12. When you're done, select **Review + create**.
13. If the VM configuration passes validation, select **Create** to start the deployment.


## Next steps

You can also [create an image definition and image version](../image-version.md) from your VHD.
