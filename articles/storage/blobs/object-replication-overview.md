---
title: Object replication overview (preview)
titleSuffix: Azure Storage
description: Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. Use object replication to minimize latency on read requests, to increase efficiency for compute workloads, to optimize data distribution, and to minimize costs.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/12/2020
ms.author: tamram
ms.subservice: blobs
---

# Object replication (preview)

Object replication (preview) asynchronously copies block blobs between a source storage account and a destination account. The source and destination accounts may be in different regions. Some scenarios supported by object replication include:

- **Minimizing latency.** Object replication can reduce latency for read requests by enabling clients to consume data from a region that is in closer physical proximity.
- **Increase efficiency for compute workloads.** With object replication, compute workloads can process the same sets of block blobs in different regions.
- **Optimizing data distribution.** You can process or analyze data in a single location and then replicate just the results to additional regions.
- **Optimizing costs.** After your data has been replicated, you can reduce costs by moving it to the archive tier using life cycle management policies.

To learn how to configure object replication, see [Configure object replication (preview)](object-replication-configure.md).

## How object replication works

Object replication asynchronously copies a specified set of block blobs from a container in one storage account to a container in another account. Object replication happens asynchronously and is [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency). After you configure object replication on the source account, Azure Storage checks the change feed every minute(???) and replicates any write or delete operations to the destination account. Replication latency depends on the size of the block blob being replicated.

### Configure a replication policy

To use object replication, create a replication policy on the source account that specifies the destination account. Then add one or more replication rules to the policy. Replication rules specify the source and destination containers and determine which block blobs in those containers will be copied.

A storage account can serve as the source account for up to two destination accounts. Each destination account may be in a different region. You can configure two separate replication policies to replicate data to each of the destination accounts.

The source and destination containers must both exist before you can create the replication policy. After you create the policy, the destination container is read-only. Any attempts to write to the destination container fail with error code 409 (Conflict).

### Create rules on the replication policy

You can specify up to 10 replication rules for each replication policy. Each rule defines a single source and destination container, and each source and destination container can be used in only one rule.

When you create a replication rule, by default only new block blobs that are subsequently added to the source container are copied. You can also specify that both new and existing block blobs are copied, or you can define a custom copy scope that copies block blobs created from a specified time onward.

You can also specify one or more filters as part of a replication rule to filter block blobs by prefix. When you specify a prefix, only blobs matching that prefix in the source container will be copied to the destination container.

## About the preview

Object replication is supported for general-purpose v2 storage accounts only. Object replication is available in the following regions in preview:

- US East 2
- US Central
- Europe West

Both the source and destination accounts must reside in one of these regions in order to use object replication. The accounts can be in two different regions.

During the preview, there are no additional costs associated with replicating data between storage accounts.

> [!IMPORTANT]
> The object replication preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

### Prerequisites for object replication

Object replication requires that the following Azure Storage features are enabled:

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
Register-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Versioning

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

## Next steps

- [Configure object replication (preview)](object-replication-configure.md)