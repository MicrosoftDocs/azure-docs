---
title: Set and manage immutability policies for Blob storage - Azure Storage
description: Learn how to use WORM (Write Once, Read Many) support for Blob (object) storage to store data in a non-erasable, non-modifiable state for a specified interval.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 11/18/2019
ms.author: tamram
ms.subservice: blobs
---

# Set and manage immutability policies for Blob storage

Immutable storage for Azure Blob storage enables users to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. For the duration of the retention interval, blobs can be created and read, but cannot be modified or deleted. Immutable storage is available for general-purpose v2 and Blob storage accounts in all Azure regions.

This article shows how to set and manage immutability policies for Blob storage using the Azure portal, PowerShell, or Azure CLI. For more information about immutable storage, see [Store business-critical data immutably in Azure Blob storage](storage-blob-immutable-storage.md).



## [Portal](#tab/azure-portal)

1. Create a new container or select an existing container to store the blobs that need to be kept in the immutable state. The container must be in a general-purpose v2 or Blob storage account.

2. Select **Access policy** in the container settings. Then select **Add policy** under **Immutable blob storage**.

    ![Container settings in the portal](media/storage-blob-immutable-storage/portal-image-1.png)

3. To enable time-based retention, select **Time-based retention** from the drop-down menu.

    !["Time-based retention" selected under "Policy type"](media/storage-blob-immutable-storage/portal-image-2.png)

4. Enter the retention interval in days (acceptable values are 1 to 146000 days).

    !["Update retention period to" box](media/storage-blob-immutable-storage/portal-image-5-retention-interval.png)

    The initial state of the policy is unlocked allowing you to test the feature and make changes to the policy before you lock it. Locking the policy is essential for compliance with regulations like SEC 17a-4.

5. Lock the policy. Right-click the ellipsis (**...**), and the following menu appears with additional actions:

    !["Lock policy" on the menu](media/storage-blob-immutable-storage/portal-image-4-lock-policy.png)

6. Select **Lock Policy** and confirm the lock. The policy is now locked and cannot be deleted, only extensions of the retention interval will be allowed. Blob deletes and overrides are not permitted. 

    ![Confirm "Lock policy" on the menu](media/storage-blob-immutable-storage/portal-image-5-lock-policy.png)

7. To enable legal holds, select **Add Policy**. Select **Legal hold** from the drop-down menu.

    !["Legal hold" on the menu under "Policy type"](media/storage-blob-immutable-storage/portal-image-legal-hold-selection-7.png)

8. Create a legal hold with one or more tags.

    !["Tag name" box under the policy type](media/storage-blob-immutable-storage/portal-image-set-legal-hold-tags.png)

9. To clear a legal hold, simply remove the applied legal hold identifier tag.

### [Azure CLI](#tab/azure-cli)

The feature is included in the following command groups:
`az storage container immutability-policy`  and `az storage container legal-hold`. Run `-h` on them to see the commands.

### [PowerShell](#tab/azure-powershell)

The Az.Storage module supports immutable storage.  To enable the feature, follow these steps:

1. Ensure that you have the latest version of PowerShellGet installed: `Install-Module PowerShellGet –Repository PSGallery –Force`.
2. Remove any previous installation of Azure PowerShell.
3. Install Azure PowerShell: `Install-Module Az –Repository PSGallery –AllowClobber`.

The [Sample PowerShell code](#sample-powershell-code) section later in this article illustrates the feature usage.

---

