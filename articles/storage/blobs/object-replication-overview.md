---
title: Object replication overview (preview)
titleSuffix: Azure Storage
description: Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. Use object replication to minimize latency on read requests, to increase efficiency for compute workloads, to optimize data distribution, and to minimize costs.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/28/2020
ms.author: tamram
ms.subservice: blobs
---

# Object replication for block blobs (preview)

Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. Some scenarios supported by object replication include:

- **Minimizing latency.** Object replication can reduce latency for read requests by enabling clients to consume data from a region that is in closer physical proximity.
- **Increase efficiency for compute workloads.** With object replication, compute workloads can process the same sets of block blobs in different regions.
- **Optimizing data distribution.** You can process or analyze data in a single location and then replicate just the results to additional regions.
- **Optimizing costs.** After your data has been replicated, you can reduce costs by moving it to the archive tier using life cycle management policies.

The following diagram shows how object replication replicates block blobs from a source storage account in one region to destination accounts in two different regions.

:::image type="content" source="media/object-replication-overview/object-replication-diagram.svg" alt-text="Diagram showing how object replication works":::

To learn how to configure object replication, see [Configure object replication (preview)](object-replication-configure.md).

## Object replication policies and rules

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

After you configure object replication, Azure Storage checks the change feed for the source account periodically and asynchronously replicates any write or delete operations to the destination account. Replication latency depends on the size of the block blob being replicated.

> [!IMPORTANT]
> Because block blob data is replicated asynchronously, the source account and destination account are not immediately in sync. There's currently no SLA on how long it takes to replicate data to the destination account.

### Replications policies

When you configure object replication, a replication policy is created on both the source account and the destination account via the Azure Storage resource provider. The replication policy is identified by a policy ID. The policy on the source and destination accounts must have the same policy ID in order for replication to take place.

A storage account can serve as the source account for up to two destination accounts. The source and destination accounts may all be in different regions. You can configure separate replication policies to replicate data to each of the destination accounts.

### Replication rules

Replication rules specify how Azure Storage will replicate blobs from a source container to a destination container. You can specify up to 10 replication rules for each replication policy. Each rule defines a single source and destination container, and each source and destination container can be used in only one rule.

When you create a replication rule, by default only new block blobs that are subsequently added to the source container are copied. You can also specify that both new and existing block blobs are copied, or you can define a custom copy scope that copies block blobs created from a specified time onward.

You can also specify one or more filters as part of a replication rule to filter block blobs by prefix. When you specify a prefix, only blobs matching that prefix in the source container will be copied to the destination container.

The source and destination containers must both exist before you can specify them in a rule. After you create the replication policy, the destination container becomes read-only. Any attempts to write to the destination container fail with error code 409 (Conflict). However, you can call the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation on a blob in the destination container to move it to the archive tier. For more information about the archive tier, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md#archive-access-tier).

## About the preview

Object replication is supported for general-purpose v2 storage accounts only. Object replication is available in the following regions in preview:

- France Central
- Canada East
- Canada Central

Both the source and destination accounts must reside in one of these regions in order to use object replication. The accounts can be in two different regions.

During the preview, there are no additional costs associated with replicating data between storage accounts.

> [!IMPORTANT]
> The object replication preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

### Prerequisites for object replication

Object replication requires that the following Azure Storage features are enabled: 
- [Change feed](storage-blob-change-feed.md)
- [Versioning](versioning-overview.md)

Before you configure object replication, enable its prerequisites. Change feed must be enabled on the source account, and blob versioning must be enabled on both the source and destination account. For more information about enabling these features, see these articles:

- [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed)
- [Enable and manage blob versioning](versioning-enable.md)

Be sure to register for the change feed and blob versioning previews before you enable them.

Enabling change feed and blob versioning may incur additional costs. For more details, refer to the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/).

### Register for the preview

You can register for the object replication preview using PowerShell or Azure CLI. Make sure that you also register for the change feed and blob versioning previews if you haven't already.

# [PowerShell](#tab/powershell)

To register for the preview with PowerShell, run the following commands:

```powershell
# Register for the object replication preview
Register-AzProviderFeature -FeatureName AllowObjectReplication -ProviderNamespace Microsoft.Storage

# Register for change feed (preview)
Register-AzProviderFeature -FeatureName Changefeed -ProviderNamespace Microsoft.Storage

# Register for blob versioning (preview)
Register-AzProviderFeature -FeatureName Versioning -ProviderNamespace Microsoft.Storage

# Refresh the Azure Storage provider namespace
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

# [Azure CLI](#tab/azure-cli)

To register for the preview with Azure CLI, run the following commands:

```azurecli
az feature register --namespace Microsoft.Storage --name AllowObjectReplication
az feature register --namespace Microsoft.Storage --name Changefeed
az feature register --namespace Microsoft.Storage --name Versioning
az provider register --namespace 'Microsoft.Storage'
```

---

### Check registration status

You can check the status of your registration requests using PowerShell or Azure CLI.

# [PowerShell](#tab/powershell)

To check the status of your registration requests using PowerShell, run the following commands:

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName AllowObjectReplication

Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Changefeed

Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Versioning
```

# [Azure CLI](#tab/azure-cli)

To check the status of your registration requests using Azure CLI, run the following commands:

```azurecli
az feature list -o table --query "[?contains(name, 'Microsoft.Storage/AllowObjectReplication')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.Storage/Changefeed')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.Storage/Versioning')].{Name:name,State:properties.state}"
```

---

## Ask questions or provide feedback

To ask questions about the object replication preview, or to provide feedback, contact Microsoft at AzureStorageFeedback@microsoft.com. Ideas and suggestions about Azure Storage are always welcomed at the [Azure Storage feedback forum](https://feedback.azure.com/forums/217298-storage).

## Next steps

- [Configure object replication (preview)](object-replication-configure.md)
- [Change feed support in Azure Blob Storage (Preview)](storage-blob-change-feed.md)
- [Enable and manage blob versioning](versioning-enable.md)
