<properties
	pageTitle="Troubleshoot issue in deleting Azure storage account, container or VHD | Microsoft Azure"
	description="Troubleshoot issue in deleting Azure storage account, container or VHD"
	services="storage"
	documentationCenter=""
	authors="genlin"
	manager="felixwu"
	editor=""
	tags="storage"/>

<tags
	ms.service="virtual-machines"
	ms.workload="na"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/14/2016"
	ms.author="genli"/>

# Troubleshoot issue in deleting Azure storage account, container or VHD

You may receive errors when you try to delete the Azure storage account, container or VHD in the [Azure portal](https://portal.azure.com/) or the [Azure classic portal](https://manage.windowsazure.com/). The issues can be caused by:

-	The storage account still has VHD or disk of a deleted Virtual Machine (VM). When you delete a VM, the disk and VHD are not automatically deleted, in case you want and keep them to mount to another VM.

-	There is still a lease on a disk or the blob associated on the disk.

To resolve the most common issues, try the following method:

1. Switch to the [Azure classic portal](https://manage.windowsazure.com/).
2. Select **VIRTUAL MACHINE**>**DISKS**.

	![disk.png](./media/storage-cannot-delete-storage-account-container-vhd/VMUI.png)

3. Locate the disks associated with the storage account, container or VHD that you want to delete. Check the location of the disk, you will find the associated storage account, container and VHD.

	![location](./media/storage-cannot-delete-storage-account-container-vhd/DiskLocation.png)

4. Delete the disks.
5. Select **VIRTUAL MACHINE**>**IMAGES**, and then delete the images that are associated with the storage account, container or VHD.

After that, try to delete the storage account, container or VHD again.

For more detail about the issues, see:

[Unable to delete the storage account](#unable-to-delete-a-storage-account)

[Unable to delete a container](#unable-to-delete-a-container)

[Unable to delete a VHD](#unable-to-delete-a-vhd)

**WARNING**: Be sure to back up anything you want to save before you delete the account. It is not possible to restore a deleted storage account or retrieve any of the content that it contained before deletion. This also holds true for any resources in the account—once you delete a VHD, blob, table, queue, or file, it is permanently deleted. Please ensure the resource is not in use.

## Unable to delete a storage account

### Symptom
When you try to delete a storage account that you are no longer using by navigating to the storage account in the [Azure portal](https://portal.azure.com/) or [Azure classic portal](https://manage.windowsazure.com/), and select Delete, you may see the following error message:

**On the Azure portal**:

*Failed to delete storage account <vm-storage-account-name>. Unable to delete storage account <vm-storage-account-name>: 'Storage account <vm-storage-account-name> has some active image(s) and/or disk(s). Ensure these image(s) and/or disk(s) are removed before deleting this storage account.'.*

**On the Azure classic portal**:

*Storage account <vm-storage-account-name> has some active image(s) and/or disk(s), e.g. xxxxxxxxx- xxxxxxxxx-O-209490240936090599. Ensure these image(s) and/or disk(s) are removed before deleting this storage account.*

You may also see this error:

**On the Azure portal**:

*Storage account <vm-storage-account-name> has 1 container(s) which have an active image and/or disk artifacts. Ensure those artifacts are removed from the image repository before deleting this storage account*.

**On the Azure classic portal**:

*Submit Failed
Storage account <vm-storage-account-name> has 1 container(s) which have an active image and/or disk artifacts. Ensure those artifacts are removed from the image repository before deleting this storage account.
When you attempt to delete a storage account and there are still active disks associated with it, you will see a message telling you there are active disks that need to be deleted*.

### Cause

The storage account contains one or more active disks or images.

### Resolution
To resolve the issues, delete the active disk or the image from the container. The disks is not visible in the [Azure portal](https://portal.azure.com/), but you can view them in the [Azure classic portal](https://manage.windowsazure.com/). To delete the disk, follow these steps:

1. Sign into the [Azure classic portal](https://manage.windowsazure.com/).
2. Select **VIRTUAL MACHINE**>**DISKS**.

	![disk.png](./media/storage-cannot-delete-storage-account-container-vhd/VMUI.png)


3. Locate the disks associated with the storage account that you want to delete. Check the location of the disk, you will find the associated storage account, container and VHD.

	![location](./media/storage-cannot-delete-storage-account-container-vhd/DiskLocation.png)

4. Delete the disks.
5. Select **VIRTUAL MACHINE**>**IMAGES**, and then delete the images that are associated with the storage account.

After that, the storage account can be deleted.

**Note** If you delete the VM but not the VHD, and you have subscribed to Premium storage, charges will continue to accrue on the VHD storage. If you no longer intend to use the VHD, delete it to avoid future charges.

## Unable to delete a container

### Symptom

When you try to delete the storage container, you may see the following error:

*Failed to delete storage container <container name>. Error: 'There is currently a lease on the container and no lease ID was specified in the request*.

### Cause
This could be due to two likely scenarios

•	There is an active or deallocated VM with a Disk Leased to a VHD inside the container, so the error is preventing an accidental delete.

•	There is a disk leased to a VHD inside the container. In this case deleting the disk would allow the VHD to be deleted. If this was the only lease then the container can also be deleted. If there are multiple disks with multiple VHDs in the same container then you will keep getting this error until all the leases are broken.

### Resolution

See the resolution under [Unable to delete a VHD](#unable-to-delete-a-vhd) for steps to delete a disk and VHD.

## Unable to delete a VHD

### Symptom

After deleting a VM you try to delete the blobs for the associated VHDs and receive the message below:

*Failed to delete blob 'path/XXXXXX-XXXXXX-os-1447379084699.vhd'. Error: 'There is currently a lease on the blob and no lease ID was specified in the request.*

### Resolution
This is also because a disk is attached to the VHD and will continue to hold a lease on the blob for as long as it exists.

To delete the disk, follow the steps below:

1. Switch to the [Azure classic portal](https://manage.windowsazure.com/).
2. Select **VIRTUAL MACHINE**>**DISKS**.

	![disk.png](./media/storage-cannot-delete-storage-account-container-vhd/VMUI.png)


3. Locate the disks associated with the VHD that you want to delete. Check the location of the disk, you will find the associated storage account, container and VHD.

	![location](./media/storage-cannot-delete-storage-account-container-vhd/DiskLocation.png)

4.	Select your data disk, then click Delete Disk.
5.	Confirm there is no Virtual Machine listed on the "Attached to" column.

	**Note** Disks are detached from a deleted VM asynchronously, it may take a few minutes after the VM is deleted for this field to clear up.

6.	Select "Delete" and choose if you want to "Retain the associated VHD" or "Delete the associated VHD".

**Note**

- If you choose to "Retain the associated VHD" the lease will be removed but the blob containing the VHD will be kept in your Storage Account. You may choose this option if you plan to delete the VHD directly from your storage account VHDs container, create a new Disk pointing to the existing VHD, download to your on-premises environment or just leave it there for future use.

- If you delete the VM but not the VHD, and you have subscribed to Premium storage, charges will continue to accrue on the VHD storage. If you no longer intend to use the VHD, delete it to avoid future charges.

## More information

V1 VMs which have been retained will show as in the stopped deallocated state on either [Azure portal](https://portal.azure.com/) or [Azure classic portal](https://manage.windowsazure.com/).

**Azure classic portal**:

![screenshot1](./media/storage-cannot-delete-storage-account-container-vhd/moreinfo1.png)

**Azure portal**:

![screenshot2](./media/storage-cannot-delete-storage-account-container-vhd/moreinfo2.png)

A status of “Stopped (deallocated)” releases the compute resources like the CPU, Memory and Network but the disks are still retained for the user to be able to quickly recreate the VM if required. These disks are created on top of VHDs which are backed by Azure storage. The storage account has these VHDs and the disks have leases on those VHDs.

## References

- [Delete a Storage Account](storage-create-storage-account.md#delete-a-storage-account)
- [How to break the locked lease of blob storage in Microsoft Azure (PowerShell)](https://gallery.technet.microsoft.com/scriptcenter/How-to-break-the-locked-c2cd6492)
