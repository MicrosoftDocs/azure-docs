---
title: Configure immutability policies for containers
titleSuffix: Azure Storage
description: Learn how to configure an immutability policy that is scoped to a container. Immutability policies provide WORM (Write Once, Read Many) support for Blob Storage by storing data in a non-erasable, non-modifiable state. 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/19/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: devx-track-azurepowershell
---

# Configure immutability policies for containers

Immutable storage for Azure Blob Storage enables users to store business-critical data in a WORM (Write Once, Read Many) state. While in a WORM state, data cannot be modified or deleted for a user-specified interval. By configuring immutability policies for blob data, you can protect your data from overwrites and deletes. Immutability policies include time-based retention policies and legal holds. For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

An immutability policy may be scoped either to an individual blob version (preview) or to a container. This article describes how to configure a container-level immutability policy. To learn how to configure version-level immutability policies, see [Configure immutability policies for blob versions (preview)](immutable-policy-configure-version-scope.md).

## Set retention policies and legal holds

??? --I plan to rewrite this, but portal is currently down-- ???

### [Portal](#tab/azure-portal)

1. Create a new container or select an existing container to store the blobs that need to be kept in the immutable state. The container must be in a general-purpose v2 or Blob storage account.

2. Select **Access policy** in the container settings. Then select **Add policy** under **Immutable blob storage**.

    ![Container settings in the portal](media/immutable-policy-configure-container-scope/portal-image-1.png)

3. To enable time-based retention, select **Time-based retention** from the drop-down menu.

    !["Time-based retention" selected under "Policy type"](media/immutable-policy-configure-container-scope/portal-image-2.png)

4. Enter the retention interval in days (acceptable values are 1 to 146000 days).

    !["Update retention period to" box](media/immutable-policy-configure-container-scope/portal-image-5-retention-interval.png)

    The initial state of the policy is unlocked allowing you to test the feature and make changes to the policy before you lock it. Locking the policy is essential for compliance with regulations like SEC 17a-4.

5. Lock the policy. Right-click the ellipsis (**...**), and the following menu appears with additional actions:

    !["Lock policy" on the menu](media/immutable-policy-configure-container-scope/portal-image-4-lock-policy.png)

6. Select **Lock Policy** and confirm the lock. The policy is now locked and cannot be deleted, only extensions of the retention interval will be allowed. Blob deletes and overrides are not permitted. 

    ![Confirm "Lock policy" on the menu](media/immutable-policy-configure-container-scope/portal-image-5-lock-policy.png)

7. To enable legal holds, select **Add Policy**. Select **Legal hold** from the drop-down menu.

    !["Legal hold" on the menu under "Policy type"](media/immutable-policy-configure-container-scope/portal-image-legal-hold-selection-7.png)

8. Create a legal hold with one or more tags.

    !["Tag name" box under the policy type](media/immutable-policy-configure-container-scope/portal-image-set-legal-hold-tags.png)

9. To clear a legal hold, remove the applied legal hold identifier tag.

### [Azure CLI](#tab/azure-cli)

The feature is included in the following command groups:
`az storage container immutability-policy`  and `az storage container legal-hold`. Run `-h` on them to see the commands.

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

The Az.Storage module supports immutable storage.  To enable the feature, follow these steps:

1. Ensure that you have the latest version of PowerShellGet installed: `Install-Module PowerShellGet –Repository PSGallery –Force`.
2. Remove any previous installation of Azure PowerShell.
3. Install Azure PowerShell: `Install-Module Az –Repository PSGallery –AllowClobber`.

The following sample PowerShell script is for reference. This script creates a new storage account and container. It then shows you how to set and clear legal holds, create, and lock a time-based retention policy (also known as an immutability policy), and extend the retention interval.

First, create an Azure Storage account:

```powershell
$resourceGroup = "<Enter your resource group>"
$storageAccount = "<Enter your storage account name>"
$container = "<Enter your container name>"
$location = "<Enter the storage account location>"

# Log in to Azure
Connect-AzAccount
Register-AzResourceProvider -ProviderNamespace "Microsoft.Storage"

# Create your Azure resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Create your Azure storage account
$account = New-AzStorageAccount -ResourceGroupName $resourceGroup -StorageAccountName `
    $storageAccount -SkuName Standard_ZRS -Location $location -Kind StorageV2

# Create a new container using the context
$container = New-AzStorageContainer -Name $container -Context $account.Context

# List the containers in the account
Get-AzStorageContainer -Context $account.Context

# Remove a container
Remove-AzStorageContainer -Name $container -Context $account.Context
```

Set and clear legal holds:

```powershell
# Set a legal hold
Add-AzRmStorageContainerLegalHold -ResourceGroupName $resourceGroup `
    -StorageAccountName $storageAccount -Name $container -Tag <tag1>,<tag2>,...

# Clear a legal hold
Remove-AzRmStorageContainerLegalHold -ResourceGroupName $resourceGroup `
    -StorageAccountName $storageAccount -Name $container -Tag <tag3>
```

Create or update time-based immutability policies:

```powershell
# Create a time-based immutability policy
Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName $resourceGroup `
    -StorageAccountName $storageAccount -ContainerName $container -ImmutabilityPeriod 10
```

Retrieve immutability policies:

```powershell
# Get an immutability policy
Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName $resourceGroup `
    -StorageAccountName $storageAccount -ContainerName $container
```

Lock immutability policies (add `-Force` to dismiss the prompt):

```powershell
# Lock immutability policies
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
    $resourceGroup -StorageAccountName $storageAccount -ContainerName $container
Lock-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
    $resourceGroup -StorageAccountName $storageAccount -ContainerName $container `
    -Etag $policy.Etag
```

Extend immutability policies:

```powershell
# Extend immutability policies
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
    $resourceGroup -StorageAccountName $storageAccount -ContainerName $container

Set-AzRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy `
    $policy -ImmutabilityPeriod 11 -ExtendPolicy
```

Remove an unlocked immutability policy (add `-Force` to dismiss the prompt):

```powershell
# Remove an unlocked immutability policy
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
    $resourceGroup -StorageAccountName $storageAccount -ContainerName $container

Remove-AzRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy $policy
```

---

## Enabling allow protected append blobs writes

### [Portal](#tab/azure-portal)

![Allow additional append writes](media/immutable-policy-configure-container-scope/immutable-allow-additional-append-writes.png)

### [Azure CLI](#tab/azure-cli)

The feature is included in the following command groups:
`az storage container immutability-policy`  and `az storage container legal-hold`. Run `-h` on them to see the commands.

### [PowerShell](#tab/azure-powershell)

```powershell
# Create an immutability policy with appends allowed
Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName $resourceGroup `
    -StorageAccountName $storageAccount -ContainerName $container -ImmutabilityPeriod 10 -AllowProtectedAppendWrite $true
```

---

## Next steps

- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)
- [Legal holds for immutable blob data](immutable-legal-hold-overview.md)
