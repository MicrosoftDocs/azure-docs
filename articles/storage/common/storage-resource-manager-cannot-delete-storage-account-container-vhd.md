---
title: Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs | Microsoft Docs
description: Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs
services: storage
documentationcenter: ''
author: genlin, passaree
manager: cshepard
editor: na
tags: storage

ms.assetid: 17403aa1-fe8d-45ec-bc33-2c0b61126286
ms.service: storage
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: genli

---
# Troubleshoot Storage objects delete errors in ARM deployment
This article provides troubleshooting guidance when one of the following errors occur when trying to delete Azure Storage account, container, or blob in Azure Resource Manager (ARM) deployment.

>_Failed to delete storage account 'StorageAccountName'. Error: The storage account cannot be deleted due to its artifacts being in use._

>_Failed to delete # out of # container(s):<br>vhds: There is currently a lease on the container and no lease ID was specified in the request._

>_Failed to delete # out of # blobs:<br>BlobName.vhd: There is currently a lease on the blob and no lease ID was specified in the request._

Just like any other computer, virtual machines in Azure use disks as a place to store an operating system, applications, and data. Azure virtual machines stores a disk as virtual hard disk (VHD) as a Storage page blob in Azure Storage account. More information about Azure disks can be found [here](../../virtual-machines/windows/about-disks-and-vhds.md).

Azure prevents deletion of a disk that is attached to a VM to prevent VM corruption. This could occur if a disk was deleted while it was attached to a running VM.

## Solution
The process to delete a Storage account, container, or blob when receiving one of the above errors is: 
1. [Identify all blobs that prevent deletion](#Step-1:-Identify-all-blob(s)-that-prevent-deletion-of-storage-object)
2. [Delete all VMs with attached **OS disk**](#How-to-delete-VM-to-detach-OS-disk)
3. [Detach all **data disk(s)** from remaining VM(s)](#Step-3:-Detach-data-disk-from-the-VM)
4. Retry deleting Storage [account](storage-create-storage-account.md#delete-a-storage-account), [container](#Scenario-2:-Delete-a-storage-container), or [blob](#Scenario-3:-Delete-a-storage-blob)

### Step 1: Identify all blob(s) that prevent deletion of Storage object

#### Scenario 1: Identifying VM that prevent deletion of the blob
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_All resources_**. Go to the Storage account, under **_Blob Service_** select **_Containers_** and navigate to the blob to be deleted.
3. If the blob **_Lease State_** is **_Leased_**, right click, and select **_Edit Metadata_** to open Blob metadata pane. 

    ![Screenshot of the portal, with the Storage account blobs and right click > "Edit Metadata" hilighted](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/utd_editMetadata_sm.PNG)

4. In Blob metadata pane, check and record the value for **_MicrosoftAzureCompute_VMName_**. This value is the name of the VM that the VHD is attached to. (See **_Note_** if this field does not exist)
5. In Blob metadata pane, check and record the value of **_MicrosoftAzureCompute_DiskType_**. This identify if the attached disk is OS or data disk (See **_Note_** if this field does not exist). 

     ![Screenshot of the portal, with the storage "Blob Metadata" pane open](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/utd_blobMetadata_sm.PNG)

6. If the blob disk type is **_OSDisk_** follow the steps in [Step 2: Delete VM to detach OS disk](#Step-2:-Delete-VM-to-detach-OS-disk). Otherwise, if the blob disk type is **_DataDisk_** follow the steps in [Step 3: Detach data disk from the VM](#Step-3:-Detach-data-disk-from-the-VM). 

> _**Note:** If **MicrosoftAzureCompute_VMName** and **MicrosoftAzureCompute_DiskType** does not appear in the blob metadata, this indicate that the blob is leased but is not attached to a VM. Leased blobs cannot be deleted without breaking the lease first; however, leased blobs that are not attached to a VM will not prevent deletion of container or Storage account containing it. To break lease, right click on the blob and select **Break lease**._

#### Scenario 2: Identifying blob(s) that prevent deletion of the blob container
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_All resources_**. Go to the Storage account, under **_Blob Service_** select **_Containers_** and find the container to be deleted.
3. Click to open the container and list of blobs inside it will appear. Follow steps 3-5 in [Scenario 1: Identifying VMs that prevent deletion of the blob](#Scenario-1:-Identifying-VMs-that-prevent-deletion-of-the-blob) for all blobs with the following properties:
    -	Blob Type = **Page blob**
    -	Lease State = **Leased**

    ![Screenshot of the portal, with the Storage account blobs and the "Lease State" with "Leased" highlighted](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/utd_disks_sm.PNG)

4. Follow [Step 2](#Step-2:-Delete-VM-to-detach-OS-disk) and [Step 3](#Step-3:-Detach-data-disk-from-the-VM) to delete VM(s) with **_OSDisk_** and detach **_DataDisk_**. 

#### Scenario 3: Identifying blob(s) that prevent deletion of the Storage account
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_All resources_**. Go to the Storage account, under **_Blob Service_** select **_Containers_**.

    ![Screenshot of the portal, with the storage account containers and the "Lease State" with "Leased" highlighted](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/utd_containers_sm.PNG)

3. In **_Containers_** blade, identify all containers where **_Lease State_** is **_Leased_** and follow step 3 in [Scenario 2: Identifying objects that prevent deletion of the blob container](#Scenario-2:-Identifying-objects-that-prevent-deletion-of-the-blob-container) for each **_Leased_** container.
4. Follow [Step 2](#Step-2:-Delete-VM-to-detach-OS-disk) and [Step 3](#Step-3:-Detach-data-disk-from-the-VM) to delete VM(s) with **_OSDisk_** and detach **_DataDisk_**. 

### Step 2: Delete VM to detach OS disk
If the VHD is an OS disk, you must delete the VM before the attached VHD can be deleted. No additional action will be required for data disks attached to the same VM once these steps are completed:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_Virtual Machines_**.
3. Select the VM that the VHD is attached to.
4. Make sure that nothing is actively using the virtual machine, and that you no longer need the virtual machine.
5. At the top of the **_Virtual Machine details_** blade, select **_Delete_**, and then click **_Yes_** to confirm.
6. The VM should be deleted, but the VHD can be retained. However, the VHD should no longer be attached to a VM or have a lease on it. It may take a few minutes for the lease to be released. To verify that the lease is released, browse to the blob location and in the **_Blob properties_** pane, the **_Lease Status_** should not be **_Leased_**.

### Step 3: Detach data disk from the VM
If the VHD is a data disk, detach the VHD from the VM to remove the lease:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_Virtual Machines_**.
3. Select the VM that the VHD is attached to.
4. Select **_Disks_** on the **_Virtual Machine details_** blade.
5. Select the data disk to be deleted the VHD is attached to. You can determine which blob is attached in the disk by checking the URL of the VHD.
6. Determine with certainty that nothing is actively using the data disk. You can verify the blob location by clicking on the disk to check the path in **_VHD URI_** field.
7. Select **_Edit_** on the top of **_Disks_** blade.
8. Click **_detach icon_** of the data disk to be deleted.

     ![Screenshot of the portal, with the storage "Blob Metadata" pane open](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/utd_VMdisks_edit.PNG)

9. Select **_Save_**. The disk should now be detached from the VM, and the VHD should no longer have a lease on it. It may take a few minutes for the lease to be released. To verify that the lease has been released, browse to the blob location and in the **_Blob properties_** pane, the **_Lease Status_** value should be **_Unlocked_**.

### Step 4: Retry delete Storage object
Retry Storage object deletion process.

#### Scenario 1: Delete a Storage blob
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_All resources_**. Go to the storage account, under **_Blob Service_** select **_Containers_**.
3. Drill down to find the blob to be deleted and ensure that its **_Lease State_** is not **_Leased_** then select to view its **_Blob Properties_**.
3. At the top of the **_Blob Properties_** blade, select **_Delete_**, and then click **_Yes_** to confirm.
4. The blob should be deleted when **_Successfully deleted blob(s)_** message appears.

#### Scenario 2: Delete a blob container
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_All resources_**. Go to the storage account, under **_Blob Service_** select **_Containers_**.
3. Find the container to be deleted and ensure that its **_Lease State_** is not **_Leased_** then select it to show **_Container_** blade.
3. At the top of the **_Container_** blade, select **_Delete container_**, and then click **_Yes_** to confirm.
4. The container should be deleted when **_Successfully deleted container(s)_** message appears.


#### Scenario 3: Delete a Storage account
To remove a storage account that you are no longer using, navigate to the storage account in the Azure portal, and click Delete. Deleting a storage account deletes the entire account, including all data in the account.
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the _Hub_ menu, select **_All resources_**. Go to the storage account.
3. Find the storage account to be deleted and select **_Delete storage account_**, then type the name of the storage account and click **_Delete_** to confirm.
4. The storage account should be deleted when **_Successfully deleted storage account_** message appears.





