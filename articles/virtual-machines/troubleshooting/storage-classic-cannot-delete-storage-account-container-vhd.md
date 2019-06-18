---
title: Troubleshoot errors when you delete Azure classic storage accounts, containers, or VHDs | Microsoft Docs
description: How to troubleshoot problems when deleting storage resources containing attached VHDs.
services: storage
author: AngshumanNayakMSFT
tags: top-support-issue,azure-service-management

ms.service: storage
ms.topic: troubleshooting
ms.date: 01/11/2019
ms.author: annayak

---
# Troubleshoot classic storage resource deletion errors
This article provides troubleshooting guidance when one of the following errors occurs trying to delete Azure classic storage account, container, or *.vhd page blob file. 


This article only covers issues with classic storage resources. If a user deletes a classic virtual machine using the Azure portal, PowerShell or CLI then the Disks aren't automatically deleted. The user gets the option to delete the "Disk" resource. In case the option isn't selected, the "Disk" resource will prevent deletion of the storage account, container and the actual *.vhd page blob file.

More information about Azure disks can be found [here](../../virtual-machines/windows/managed-disks-overview.md). Azure prevents deletion of a disk that is attached to a VM to prevent corruption. It also prevents deletion of containers and storage accounts, which have a page blob that is attached to a VM. 

## What is a "Disk"?
A "Disk" resource is used to mount a *.vhd page blob file to a virtual machine, as an OS disk or Data disk. An OS disk or Data disk resource, until deleted, will continue to hold a lease on the *.vhd file. Any storage resource in the path shown in below image can’t be deleted if a “Disk” resource points to it.

![Screenshot of the portal, with the disk (classic) "Property" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/Disk_Lease_Illustration.jpg) 


## Steps while deleting a classic virtual machine 
1. Delete the classic virtual machine.
2. If the “Disks” checkbox is selected, the **disk lease** (shown in image above) associated with the page blob *.vhd is broken. The actual page blob *.vhd file will still exist in the storage account.
![Screenshot of the portal, with the virtual machine (classic) "Delete" error pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/steps_while_deleting_classic_vm.jpg) 

3. Once the disk(s) lease is broken, the page blob(s) itself can be deleted. A storage account or container can be deleted once all "Disk" resource present in them are deleted.

>[!NOTE] 
>If user deletes the VM but not the VHD, storage charges will continue to accrue on the page blob *.vhd  file. The charges will be in line with the type of storage account, check the [pricing page](https://azure.microsoft.com/pricing/details/storage/) for more details. If user no longer intends to use the VHD(s), delete it/them to avoid future charges. 

## Unable to delete storage account 

When user tries to delete a classic storage account that is no longer needed, user may see the following behavior.

#### Azure portal 
User navigates to the classic storage account on the [Azure portal](https://portal.azure.com) and clicks **Delete**, user will see the following message: 

With disk(s) “attached” to a virtual machine

![Screenshot of the portal, with the virtual machine (classic) "Delete" error pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/unable_to_delete_storage_account_disks_attached_portal.jpg) 


With disk(s) "unattached" to a virtual machine

![Screenshot of the portal, with the virtual machine (classic) "Delete" non-error pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/unable_to_delete_storage_account_disks_unattached_portal.jpg)


#### Azure PowerShell
User tries to delete a storage account, that is no longer being used, by using classic PowerShell cmdlets. User will see the following message:

> <span style="color:cyan">**Remove-AzureStorageAccount -StorageAccountName myclassicaccount**</span>
> 
> <span style="color:red">Remove-AzureStorageAccount : BadRequest: Storage account myclassicaccount has some active image(s) and/or disk(s), e.g.  
> myclassicaccount. Ensure these image(s) and/or disk(s) are removed before deleting this storage account.</span>

## Unable to delete storage container

When user tries to delete a classic storage blob container that is no longer needed, user may see the following behavior.

#### Azure portal 
Azure portal wouldn't allow the user to delete a container if a "Disk(s)" lease exists pointing to a *.vhd page blob file in the container. It's by design to prevent accidental deletion of a vhd(s) file with Disk(s) lease on them. 

![Screenshot of the portal, with the storage container "list" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/unable_to_delete_container_portal.jpg)


#### Azure PowerShell
If the user chooses to delete using PowerShell, it will result in the following error. 

> <span style="color:cyan">**Remove-AzureStorageContainer -Context $context -Name vhds**</span>
> 
> <span style="color:red">Remove-AzureStorageContainer : The remote server returned an error: (412) There is currently a lease on the container and no lease ID was specified in the request.. HTTP Status Code: 412 - HTTP Error Message: There is currently a lease on the container and no lease ID was specified in the request.</span>

## Unable to delete a vhd 

After deleting the Azure virtual machine, user tries to delete the vhd file (page blob) and receive the message below:

#### Azure portal 
On the portal, there could be two experiences depending on the list of blobs selected for deletion.

1. If only “Leased” blobs are selected, then the Delete button doesn’t show up.
![Screenshot of the portal, with the container blob "list" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/unable_to_delete_vhd_leased_portal.jpg)


2. If a mix of “Leased” and “Available” blobs are selected, the “Delete” button shows up. But the “Delete” operation will leave behind the page blobs, which have a Disk lease on them. 
![Screenshot of the portal, with the container blob "list" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/unable_to_delete_vhd_leased_and_unleased_portal_1.jpg)
![Screenshot of the portal, with the selected blob "delete" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/unable_to_delete_vhd_leased_and_unleased_portal_2.jpg)

#### Azure PowerShell 
If the user chooses to delete using PowerShell, it will result in the following error. 

> <span style="color:cyan">**Remove-AzureStorageBlob -Context $context -Container vhds -Blob "classicvm-os-8698.vhd"**</span>
> 
> <span style="color:red">Remove-AzureStorageBlob : The remote server returned an error: (412) There is currently a lease on the blob and no lease ID was specified in the request.. HTTP Status Code: 412 - HTTP Error Message: There is currently a lease on the blob and no lease ID was specified in the request.</span>


## Resolution steps

### To remove classic Disks
Follow these steps on the Azure portal:
1.	Navigate to the [Azure portal](https://portal.azure.com).
2.	Navigate to the Disks(classic). 
3.	Click the Disks tab.
 ![Screenshot of the portal, with the container blob "list" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/resolution_click_disks_tab.jpg)
 
4.	Select your data disk, then click Delete Disk.
 ![Screenshot of the portal, with the container blob "list" pane open](./media/storage-classic-cannot-delete-storage-account-container-vhd/resolution_click_delete_disk.jpg)
 
5.	Retry the Delete operation that previously failed.
6.	A storage account or container can't be deleted as long as it has a single Disk.

### To remove classic Images   
Follow these steps on the Azure portal:
1.	Navigate to the [Azure portal](https://portal.azure.com).
2.	Navigate to OS images (classic).
3.	Delete the image.
4.	Retry the Delete operation that previously failed.
5.	A storage account or container can’t be deleted as long as it has a single Image.
