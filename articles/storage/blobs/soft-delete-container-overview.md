---
title: Soft delete for containers (preview)
titleSuffix: Azure Storage 
description: Soft delete for containers (preview) protects your data so that you can more easily recover your data when it is erroneously modified or deleted by an application or by another storage account user.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 08/25/2020
ms.author: tamram
ms.subservice: blobs
ms.custom: references_regions
---

# Soft delete for containers (preview)

Soft delete for containers (preview) protects your data from being accidentally or erroneously modified or deleted. When container soft delete is enabled for a storage account, any deleted container and their contents are retained in Azure Storage for the period that you specify. During the retention period, you can restore previously deleted containers and any blobs within them.

For end to end protection for your blob data, Microsoft recommends enabling the following data protection features:

- Container soft delete, to protect against accidental delete or overwrite of a container. To learn how to enable container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md).
- Blob soft delete, to protect against accidental delete or overwrite of an individual blob. To learn how to enable blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).
- Blob versioning, to automatically maintain previous versions of a blob. When blob versioning is enabled, you can restore an earlier version of a blob to recover your data if it is erroneously modified or deleted. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).

> [!WARNING]
> Deleting a storage account cannot be undone. Soft delete does not protect against the deletion of a storage account. To prevent accidental deletion of a storage account, configure a **CannotDelete** lock on the storage account resource. For more information on locking Azure resources, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).

## How container soft delete works

When you enable container soft delete, you can specify a retention period for deleted containers that is between 1 and 365 days. The default retention period is 7 days. During the retention period, you can recover a deleted container by calling the **Undelete Container** operation.

When you restore a container, you can restore it to its original name if that name has not been reused. If the original container name has been used, then you can restore the container with a new name.

After the retention period has expired, the container is permanently deleted from Azure Storage and cannot be recovered. The clock starts on the retention period at the point that the container is deleted. You can change the retention period at any time, but keep in mind that an updated retention period applies only to newly deleted containers. Previously deleted containers will be permanently deleted based on the retention period that was in effect at the time that the container was deleted.

Disabling container soft delete does not result in permanent deletion of containers that were previously soft-deleted. Any soft-deleted containers will be permanently deleted at the expiration of the retention period that was in effect at the time that the container was deleted.

## About the preview

Container soft delete is available in preview in all public Azure regions.

> [!IMPORTANT]
> The container soft delete preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

Version 2019-12-12 and higher of the Azure Storage REST API supports container soft delete.

### Storage account support

Container soft delete is available for the following types of storage accounts:

- General-purpose v2 storage accounts
- Block blob storage accounts
- Blob storage accounts

If your storage account is a general-purpose v1 account, use the Azure portal to upgrade to a general-purpose v2 account. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md).

Storage accounts with a hierarchical namespace enabled for use with Azure Data Lake Storage Gen2 are also supported.

### Register for the preview

To enroll in the preview for container soft delete, use PowerShell or Azure CLI to submit a request to register the feature with your subscription. After your request is approved, you can enable container soft delete with any new or existing general-purpose v2, Blob storage, or premium block blob storage accounts.

# [PowerShell](#tab/powershell)

To register with PowerShell, call the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) command.

```powershell
# Register for container soft delete (preview)
Register-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName ContainerSoftDelete

# Refresh the Azure Storage provider namespace
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

# [Azure CLI](#tab/azure-cli)

To register with Azure CLI, call the [az feature register](/cli/azure/feature#az-feature-register) command.

```azurecli
az feature register --namespace Microsoft.Storage --name ContainerSoftDelete
az provider register --namespace 'Microsoft.Storage'
```

---

### Check the status of your registration

To check the status of your registration, use PowerShell or Azure CLI.

# [PowerShell](#tab/powershell)

To check the status of your registration with PowerShell, call the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage -FeatureName ContainerSoftDelete
```

# [Azure CLI](#tab/azure-cli)

To check the status of your registration with Azure CLI, call the [az feature](/cli/azure/feature#az-feature-show) command.

```azurecli
az feature show --namespace Microsoft.Storage --name ContainerSoftDelete
```

---

## Pricing and billing

There is no additional charge to enable container soft delete. Data in soft deleted containers is billed at the same rate as active data.

## Next steps

- [Configure container soft delete](soft-delete-container-enable.md)
- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
