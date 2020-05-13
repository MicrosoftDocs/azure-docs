---
title: Object-level replication (preview)
titleSuffix: Azure Storage
description: Configure object-level replication (preview) to asynchronously replicate block blobs between two storage accounts.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/12/2020
ms.author: tamram
ms.subservice: blobs
---

# Object-level replication (preview)

With object-level replication (preview), you can asynchronously replicate block blobs between two storage accounts. 

- Object-level replication can reduce latency for read requests by enabling clients to consume data from a region that is in closer physical proximity.
- 


Object-level replication unblocks a new set of common replication scenarios:

- Minimize latency – have your users consume the data locally rather than issuing cross-region read requests.
- Increase efficiency – have your compute clusters process/transform the same set of objects locally in different regions.
- Optimize data distribution – have your data consolidated in a single location for processing/analytics and then distribute only resulting dashboards to your offices worldwide.
- Optimize cost – tier down your data to Archive upon replication completion using Lifecycle Management policies to optimize the cost.

## How object-level replication works

Object-level replication asynchronously copies a specified set of block blobs from a container in one storage account to the same container in a destination account. To use object-level replication, create a replication policy on the source account that specifies the destination account. Then add one or more replication rules to the policy. Replication rules specify the source and destination containers and determine which block blobs in those containers will be copied.

### Configure a replication policy

An account can serve as the source account for up to two destination accounts. For example, suppose you wish to replicate data from a source account to two destination accounts that are in different regions, to reduce latency. You can configure two separate replication policies to replicate data to each of the destination accounts.

To enable Object Replication both source and destination accounts should exist or be created in those regions.

### Create rules on the replication policy

You can specify up to 10 replication rules for each replication policy. Each rule defines a single source and destination container, and each source and destination container can be used in only one rule.

The source and destination containers must both exist before you can create the replication policy. After you create the policy, the destination container is read-only. Any attempts to write to the destination container fail with error code 403 (Forbidden).

When you create a replication rule, by default only new block blobs that are subsequently added to the source container are copied. You can also specify that both new and existing block blobs are copied, or you can define a custom copy scope that copies block blobs created from a specified time onward.

A replication rule can also filter block blobs by prefix. If you specify a prefix, only blobs matching that prefix in the source container will be copied to the destination container.




- Destination container is read-only. You can configure the destination container’s Access Policy, delete and tier down the objects to Archive in the destination container when necessary.


Once object replication is enabled for a set of source and destination accounts, consider the following user experience:

- Replication is eventually consistent. This capability replicates the data object by object (blob by blob) hence the replication latency is dependent on the size on the object.

- Changes are read from the Change feed every minute and then replicated to the destination account.

- Deletes are propagated to the destination account/container. With Versioning enabled deleting a blob creates a new historical version of the blob.

- Data that existed prior to object replication being configured can be replicated to the destination container by using MinCreationTime parameter.

Once object replication is enabled for a set of source and destination accounts, consider the following user experience:

- When enabling object replication for a pair of source-destination accounts, a replication policy is created. object replication supports creating 2 replication policies with up to 10 rules within each policy. Rule defines the scope of the replication.

- Destination container is read-only. You can configure the destination container’s Access Policy, delete and tier down the objects to Archive in the destination container when necessary.


### Prerequisites

Object replication requires:

- [General purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-overview) and is available for block blobs only.

- Versioning to be enabled on both source and destination accounts.

- Change feed to be enabled only on the source account.

These prerequisites incur additional cost – please refer to [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/) for more details. During preview there will be no additional cost associated with replicating data between storage accounts. Regional replication cost (both within the geography and across geographies) will be announced once the capability reaches general availability.

## About the preview

Object-level replication is available in the following regions in preview:

- US East 2
- US Central
- Europe West

Both the source and destination accounts must reside in one of these regions in order to use object-level replication. The accounts can be in two different regions.

> [!IMPORTANT]
> The object-level replication preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

### Register for the preview

You can register for the object-level replication preview using PowerShell or Azure CLI. Make sure that you also register for the change feed and blob versioning previews if you haven't already.

# [PowerShell](#tab/powershell)

To register for the preview with PowerShell, run the following commands:

```powershell
# Register for the object-level replication preview
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

## Configuration considerations


## Known limitations




