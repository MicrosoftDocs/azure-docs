<properties
	pageTitle="Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs in an ARM deployment| Microsoft Azure"
	description="Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs in an ARM deployment"
	services="storage"
	documentationCenter=""
	authors="genlin"
	manager="felixwu"
	editor="na"
	tags="storage"/>

<tags
	ms.service="storage"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/12/2016"
	ms.author="genli;dougiman"/>

# Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs in an ARM deployment

You might receive errors when you try to delete the Azure storage account, container, or VHD in the [Azure portal](https://portal.azure.com). This article provides troubleshooting guidance to help resolve the issue in an Azure Resource Manager (ARM) deployment.

If your Azure issue is not addressed in this article, visit the Azure forums on [MSDN and the Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue on these forums or to @AzureSupport on Twitter. Also, you can file an Azure support request by selecting **Get support** on the [Azure support](https://azure.microsoft.com/support/options/) site.

## Symptoms

### Scenario 1

When you try to delete a VHD in an ARM Storage Account, you receive the following error message:

**Failed to delete blob 'vhds/BlobName.vhd'. Error: There is currently a lease on the blob and no lease ID was specified in the request**

This issue can be caused by a virtual machine (VM) has a lease on the VHD that you are trying to delete.

### Scenario 2

When you try to delete a container in an ARM Storage Account, you receive the following error message:

**Failed to delete storage container 'vhds'. Error: There is currently a lease on the container and no lease ID was specified in the request.**

This issue can be caused by the container contains a VHD that is locked in the lease state.

### Scenario 3

When you try to delete an ARM Storage Account, you receive the following error message:

**Failed to delete storage account 'StorageAccountName'. Error: The storage account cannot be deleted due to its artifacts being in use.**

This issue can be caused by the storage account contains a VHD that is locked in the lease state.

## Solution

To resolve these issues, you have to locate the VM that is using the VHD. Then, you must detach the VHD from the VM (for data disks) or delete the VM that is using the VHD (for OS disks). This removes the lease from the VHD, and allows it to be deleted.

### Step 1: Locate the VHD that is causing the error and the associated VM


1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Hub menu, select **All resources**. Go to the storage account that you want to delete > **Blobs** > **vhds**.

	![locateVHD1.png](./media/storage-arm-cannot-delete-storage-account-container-vhd/opencontainer.png)

3. Check the properties of each VHD in the container. Locate the VHD that is in the **Leased** state. Then you need to find the VM that is using the VHD. Usually, you can determine which VM holds the VHD by checking name of the VHD:
	 -	OS Disks generally follow this naming rule: VMNameYYYYMMDDHHMMSS.vhd

   -	Data Disks generally follow this naming convention: VMName-YYYYMMDD-HHMMSS.vhd

	![locatevm.png](./media/storage-arm-cannot-delete-storage-account-container-vhd/locatevm.png)

### Step 2: Remove the lease from the VHD

To delete the VM that is using the VHD (for OS disks):

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	On the Hub menu, select **Virtual Machines**.
3.	Select the VM that holds a lease on the VHD.
4.	Make sure that nothing is actively using the virtual machine, and that you no longer require the virtual machine.
5.	At the top of the VM details blade, select **Delete**, and then click **Yes** to confirm.
6.	The VM should be deleted, but the VHD should be retained. However, the VHD should no longer have a lease on it. It may take a few minutes for the lease to be released. To verify that the lease is released, go to **All resources** > **Storage Account Name** > **Blobs** > **vhds**. In the **Blob properties** pane, the **Lease Status** value should be **Unlocked**.

To detach the VHD from the VM that is using it (for data disks):

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	On the Hub menu, select **Virtual Machines**.
3.	Select the VM that holds a lease on the VHD.
4.	Select **Disks** in the VM details blade.
5.	Select the data disk that holds a lease on the VHD. You can determine which vhd is attached in the disk by checking the url of the VHD.
6.	Determine with certainty that nothing is actively using the data disk.
7.	Click **Detach** in the Disk details blade.
8.	The disk should now be detached from the VM, and the VHD should no longer have a lease on it. It may take a few minutes for the lease to be released. To verify that the lease has been released, go to **All resources**> **Storage Account Name** > **Blobs** > **vhds**. In the **Blob properties** pane. The **Lease Status** value should be **Unlocked**.
