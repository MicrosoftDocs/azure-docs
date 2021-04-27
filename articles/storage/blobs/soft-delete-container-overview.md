---
title: Soft delete for containers (preview)
titleSuffix: Azure Storage 
description: Soft delete for containers (preview) protects your data so that you can more easily recover your data when it is erroneously modified or deleted by an application or by another storage account user.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 03/05/2021
ms.author: tamram
ms.subservice: blobs
ms.custom: references_regions
---

# Soft delete for containers (preview)

Soft delete for containers (preview) protects your data from being accidentally or maliciously deleted. When container soft delete is enabled for a storage account, a deleted container and its contents are retained in Azure Storage for the period that you specify. During the retention period, you can restore previously deleted containers. Restoring a container restores any blobs within that container when it was deleted.

For end to end protection for your blob data, Microsoft recommends enabling the following data protection features:

- Container soft delete, to restore a container that has been deleted. To learn how to enable container soft delete, see [Enable and manage soft delete for containers](soft-delete-container-enable.md).
- Blob versioning, to automatically maintain previous versions of a blob. When blob versioning is enabled, you can restore an earlier version of a blob to recover your data if it is erroneously modified or deleted. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).
- Blob soft delete, to restore a blob or version that has been deleted. To learn how to enable blob soft delete, see [Enable and manage soft delete for blobs](soft-delete-blob-enable.md).

> [!IMPORTANT]
> Container soft delete is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How container soft delete works

When you enable container soft delete, you can specify a retention period for deleted containers that is between 1 and 365 days. The default retention period is 7 days. During the retention period, you can recover a deleted container by calling the **Restore Container** operation.

When you restore a container, the container's blobs and any blob versions are also restored. However, you can only use container soft delete to restore blobs if the container itself was deleted. To a restore a deleted blob when its parent container has not been deleted, you must use blob soft delete or blob versioning.

> [!WARNING]
> Container soft delete can restore only whole containers and their contents at the time of deletion. You cannot restore a deleted blob within a container by using container soft delete. Microsoft recommends also enabling blob soft delete and blob versioning to protect individual blobs in a container.

The following diagram shows how a deleted container can be restored when container soft delete is enabled:

:::image type="content" source="media/soft-delete-container-overview/container-soft-delete-diagram.png" alt-text="Diagram showing how a soft-deleted container may be restored":::

When you restore a container, you can restore it to its original name if that name has not been reused. If the original container name has been used, then you can restore the container with a new name.

After the retention period has expired, the container is permanently deleted from Azure Storage and cannot be recovered. The clock starts on the retention period at the point that the container is deleted. You can change the retention period at any time, but keep in mind that an updated retention period applies only to newly deleted containers. Previously deleted containers will be permanently deleted based on the retention period that was in effect at the time that the container was deleted.

Disabling container soft delete does not result in permanent deletion of containers that were previously soft-deleted. Any soft-deleted containers will be permanently deleted at the expiration of the retention period that was in effect at the time that the container was deleted.

> [!IMPORTANT]
> Container soft delete does not protect against the deletion of a storage account. It protects only against the deletion of containers in that account. To protect a storage account from deletion, configure a lock on the storage account resource. For more information about locking a storage account, see [Apply an Azure Resource Manager lock to a storage account](../common/lock-account-resource.md).

## About the preview

Container soft delete is available in preview in all Azure regions.

Version 2019-12-12 or higher of the Azure Storage REST API supports container soft delete.

### Storage account support

Container soft delete is available for the following types of storage accounts:

- General-purpose v2 and v1 storage accounts
- Block blob storage accounts
- Blob storage accounts

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

To register with Azure CLI, call the [az feature register](/cli/azure/feature#az_feature_register) command.

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

To check the status of your registration with Azure CLI, call the [az feature](/cli/azure/feature#az_feature_show) command.

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
