---
title: Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs | Microsoft Docs
description: Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs
services: storage
documentationcenter: ''
author: genlin
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
# Troubleshoot errors when you delete Azure storage accounts, containers, or VHDs

You might receive errors when you try to delete an Azure storage account, container, or virtual hard disk (VHD) in the [Azure portal](https://portal.azure.com). This article provides troubleshooting guidance to help resolve the problem in an Azure Resource Manager deployment.

If this article doesn't address your Azure problem, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your problem on these forums or to @AzureSupport on Twitter. Also, you can file an Azure support request by selecting **Get support** on the [Azure support](https://azure.microsoft.com/support/options/) site.

## Symptoms
### Scenario 1
When you try to delete a VHD in a storage account in a Resource Manager deployment, you receive the following error message:

**Failed to delete blob 'vhds/BlobName.vhd'. Error: There is currently a lease on the blob and no lease ID was specified in the request.**

This problem can occur because a virtual machine (VM) has a lease on the VHD that you are trying to delete.

### Scenario 2
When you try to delete a container in a storage account in a Resource Manager deployment, you receive the following error message:

**Failed to delete storage container 'vhds'. Error: There is currently a lease on the container and no lease ID was specified in the request.**

This problem can occur because the container has a VHD that is locked in the lease state.

### Scenario 3
When you try to delete a storage account in a Resource Manager deployment, you receive the following error message:

**Failed to delete storage account 'StorageAccountName'. Error: The storage account cannot be deleted due to its artifacts being in use.**

This problem can occur because the storage account contains a VHD that is in the lease state.

## Solution 
To resolve these problems, you must identify the VHD that is causing the error and the associated VM. Then, detach the VHD from the VM (for data disks) or delete the VM that is using the VHD (for OS disks). This removes the lease from the VHD and allows it to be deleted. 

To do this, use one of the following methods:

### Method 1 - Use Azure storage explorer

### Step 1 Identify the VHD that prevent deletion of the storage account

1. When you delete the storage account, you will receive a message dialog such as the following: 

    ![message when deleting the storage account](././media/storage-resource-manager-cannot-delete-storage-account-container-vhd/delete-storage-error.png) 

2. Check the **Disk URL** to identify the storage account and the VHD that prevents you delete the storage account. In the following example, the string before “.blob.core.windows.net “ is the storage account name, and "SCCM2012-2015-08-28.vhd" is the VHD name.  

        https://portalvhds73fmhrw5xkp43.blob.core.windows.net/vhds/SCCM2012-2015-08-28.vhd

### Step 2 Delete the VHD by using Azure Storage Explorer

1. Download and Install the latest version of [Azure Storage Explorer](http://storageexplorer.com/). This tool is a standalone app from Microsoft that allows you to easily work with Azure Storage data on Windows, macOS and Linux.
2. Open Azure Storage Explorer, select ![account icon](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/account.png) on the left bar, select your Azure environment, and then sign in.

3. Select all subscriptions or the subscription that contains the storage account you want to delete.

    ![add subscription](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/addsub.png)

4. Go to the storage account that we obtained from the disk URL earlier, select the **Blob Containers** > **vhds** and search for the VHD that prevents you delete the storage account.
5. If the VHD is found,  check the **VM Name** column to find the VM that is using this VHD.

    ![Check vm](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/check-vm.png)

6. Remove the lease from the VHD by using Azure portal. For more information, see [Remove the lease from the VHD](#remove-the-lease-from-the-vhd). 

7. Go to the Azure Storage Explorer, right-click the VHD and then select delete.

8. Delete the storage account.

### Method 2 - Use Azure portal 

#### Step 1: Identify the VHD that prevent deletion of the storage account

1. When you delete the storage account, you will receive a message dialog such as the following: 

    ![message when deleting the storage account](././media/storage-resource-manager-cannot-delete-storage-account-container-vhd/delete-storage-error.png) 

2. Check the **Disk URL** to identify the storage account and the VHD that prevents you delete the storage account. In the following example, the string before “.blob.core.windows.net “ is the storage account name, and "SCCM2012-2015-08-28.vhd" is the VHD name.  

        https://portalvhds73fmhrw5xkp43.blob.core.windows.net/vhds/SCCM2012-2015-08-28.vhd

2. Sign in to the [Azure portal](https://portal.azure.com).
3. On the Hub menu, select **All resources**. Go to the storage account, and then select **Blobs** > **vhds**.

    ![Screenshot of the portal, with the storage account and the "vhds" container highlighted](./media/storage-resource-manager-cannot-delete-storage-account-container-vhd/opencontainer.png)

4. Locate the VHD that we obtained from the disk URL earlier. Then, determine which VM is using the VHD. Usually, you can determine which VM holds the VHD by checking name of the VHD:

VM in Resource Manager development  model

   * OS disks generally follow this naming convention: VMName-YYYY-MM-DD-HHMMSS.vhd
   * Data disks generally follow this naming convention: VMName-YYYY-MM-DD-HHMMSS.vhd

VM in Classic development model

   * OS disks generally follow this naming convention: CloudServiceName-VMName-YYYY-MM-DD-HHMMSS.vhd
   * Data disks generally follow this naming convention: CloudServiceName-VMName-YYYY-MM-DD-HHMMSS.vhd

#### Step 2: Remove the lease from the VHD

[Remove the lease from the VHD](#remove-the-lease-from-the-vhd), and then delete the storage account.

## What is a lease?
A lease is a lock that can be used to control access to a blob (for example, a VHD). When a blob is leased, only the owners of the lease can access the blob. A lease is important for the following reasons:

* It prevents data corruption if multiple owners try to write to the same portion of the blob at the same time.
* It prevents the blob from being deleted if something is actively using it (for example, a VM).
* It prevents the storage account from being deleted if something is actively using it (for example, a VM).

### Remove the lease from the VHD
If the VHD is an OS disk, you must delete the VM to remove the lease:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the **Hub** menu, select **Virtual Machines**.
3. Select the VM that holds a lease on the VHD.
4. Make sure that nothing is actively using the virtual machine, and that you no longer need the virtual machine.
5. At the top of the **VM details** blade, select **Delete**, and then click **Yes** to confirm.
6. The VM should be deleted, but the VHD can be retained. However, the VHD should no longer have a lease on it. It may take a few minutes for the lease to be released. To verify that the lease is released, go to **All resources** > **Storage Account Name** > **Blobs** > **vhds**. In the **Blob properties** pane, the **Lease Status** value should be **Unlocked**.

If the VHD is a data disk, detach the VHD from the VM to remove the lease:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the **Hub** menu, select **Virtual Machines**.
3. Select the VM that holds a lease on the VHD.
4. Select **Disks** on the **VM details** blade.
5. Select the data disk that holds a lease on the VHD. You can determine which VHD is attached in the disk by checking the URL of the VHD.
6. Determine with certainty that nothing is actively using the data disk.
7. Click **Detach** on the **Disk details** blade.
8. The disk should now be detached from the VM, and the VHD should no longer have a lease on it. It may take a few minutes for the lease to be released. To verify that the lease has been released, go to **All resources** > **Storage Account Name** > **Blobs** > **vhds**. In the **Blob properties** pane, the **Lease Status** value should be **Unlocked**.

## Next steps
* [Delete a storage account](storage-create-storage-account.md#delete-a-storage-account)
* [How to break the locked lease of blob storage in Microsoft Azure (PowerShell)](https://gallery.technet.microsoft.com/scriptcenter/How-to-break-the-locked-c2cd6492)
