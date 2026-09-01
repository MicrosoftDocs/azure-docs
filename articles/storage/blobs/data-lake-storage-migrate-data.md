---
title: "Relocate Azure Data Lake Storage to a Another Region"
titleSuffix: Azure Storage
description: "Learn how to relocate Azure Data Lake Storage data to another Azure region by using AzCopy, Azure Storage Mover, or an account failover."
author: normesta

ms.service: azure-data-lake-storage
ms.topic: upgrade-and-migration-article
ms.date: 08/12/2026
ms.author: normesta
ai-usage: ai-assisted
# Customer intent: As a storage administrator, I want to relocate my Azure Data Lake Storage Gen2 data to another Azure region so that I can meet capacity, compliance, or feature-availability requirements.
---

# Relocate Azure Data Lake Storage to another region

An Azure Storage account is region-specific, so you can't move it between Azure regions. Instead, create a new storage account in the target region and then copy or replicate your data to it by using supported Azure tools.

This article describes three approaches you can use to move your data to the target region. It focuses on Azure Data Lake Storage, which is the data you store in a storage account that has a hierarchical namespace.

## Prerequisites

- An Azure Storage account in the source region that has a hierarchical namespace.

- An Azure Storage account in the target region that has a hierarchical namespace. If you don't have one, [create a storage account with a hierarchical namespace](create-data-lake-storage-account.md).

- Your user identity is assigned the [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role at the scope of the **source** storage account, its parent resource group, or its subscription.

- Your user identity is assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role at the scope of the **source** storage account, its parent resource group, or its subscription.

- Any [security principals](../../role-based-access-control/overview.md#security-principal) (users, groups, service principals, or managed identities) that you use to authorize access to your data exist in the target account's Microsoft Entra tenant. This requirement applies whether you authorize access through Azure role assignments at the account or container level, or through ACLs on directories and files.

- A networking plan for the target region (for example, private endpoints, Domain Name System (DNS) settings, or firewall settings).

## Migration options

Migrate your data between storage accounts that have a hierarchical namespace by using one of the following supported approaches.

### Option 1: Migrate data by using AzCopy (recommended)

AzCopy is the most flexible option: it works to any target region, keeps your data online during the copy, and preserves POSIX ACLs. Use AzCopy to perform a server-to-server copy from the source account to the target account. Use the `azcopy copy` command for a one-time bulk copy, or the `azcopy sync` command to incrementally synchronize containers. 

This option supports:

- Online migration

- Incremental synchronization

- POSIX access control list (ACL) preservation (with the `--preserve-permissions=true` flag)

For detailed AzCopy commands, authentication methods, and supported synchronization options, see [Get started with AzCopy](../common/storage-use-azcopy-v10.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json).

### Option 2: Use Azure Storage Mover

Azure Storage Mover is best for large-scale or repeatable migrations. For a one-time transfer of less than 1 TB, use AzCopy (Option 1) instead. This fully managed migration service orchestrates data movement between storage accounts that have a hierarchical namespace, including across Azure regions. 

This option supports:

- Managed migration orchestration

- Centralized monitoring and reporting

- Incremental synchronization

- Migration of large-scale datasets

For deployment, endpoint, and migration job configuration, see [Introduction to Azure Storage Mover](../../storage-mover/service-overview.md).

### Option 3: Initiate an account failover

An account failover works best when your data is already geo-replicated and you want to relocate without a separate copy step. It moves you only to the Microsoft-defined paired region, not an arbitrary target region.

If your account uses [geo-redundant storage (GRS)](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json#geo-redundant-storage) or [geo-zone-redundant storage (GZRS)](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json#geo-zone-redundant-storage), you can initiate an account failover to a secondary region. After the failover is complete, the secondary region becomes the primary region.

This option is designed primarily for disaster recovery. However, because data is already replicated to an account in the secondary region, this option doesn't require a separate data migration task.

> [!IMPORTANT]
> GRS failover is irreversible, and it only relocates data to the Microsoft-defined paired region.

To learn more, see [Failover and failback](/azure/reliability/concept-failover-failback).

## Post-migration validation checklist

After the migration is complete, validate the following items:

> [!div class="checklist"]
>
> - **Account configuration settings**: Confirm that the target account's type, redundancy option, access tier, and encryption settings (including any customer-managed keys) match your intended configuration.
>
> - **Network settings**: Confirm that firewall rules, virtual network rules, private endpoints, and DNS records are configured on the target account, because these settings aren't migrated.
>
> - **Role-based access control (RBAC)**: Verify that Azure role assignments (for example, Storage Blob Data Owner and Storage Blob Data Reader) are re-created on the target account and grant the same access as the source.
>
> - **POSIX ACLs**: Spot-check directory and file ACLs in the target account to confirm that owner, group, and permission entries transferred correctly.
>
> - **Application connectivity**: Confirm that applications can authenticate to the target account and read and write data by using the new endpoint.
>
> - **Downstream service connectivity**: Validate that dependent services and pipelines (for example, Azure Data Factory, Azure Synapse Analytics, Azure Databricks, or event subscriptions) reference the target account endpoint and can read and write data.
>
> - **Performance benchmarks**: Compare throughput, latency, and transaction rates in the target account against your source-region baseline to confirm that they meet your workload requirements.
>
> - **Monitoring and diagnostics**: Re-create diagnostic settings, metric alerts, and log routing (for example, to a Log Analytics workspace) on the target account, because these settings aren't migrated with your data.
>

## Limitations

- You can't move storage accounts directly between regions.

- Storage account configuration settings don't replicate to the target account for any of the three options. Examples of these settings include redundancy configuration, private endpoints, DNS records, Azure role assignments, managed identities, and networking settings.

- You must manually repoint downstream services to the target account endpoint.

- Your migration team must validate ACLs, permissions, and application connectivity after the data transfer is complete.

- AzCopy doesn't synchronize deleted files. Synchronization applies only when using the [azcopy sync command](../common/storage-use-azcopy-blobs-synchronize.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json).

- Azure Storage Mover doesn't preserve POSIX ACLs when migrating Data Lake Storage data. To preserve ACLs, use AzCopy (Option 1).

- Azure Storage Mover doesn't support cross-tenant account migration. The source and target storage accounts must belong to the same Microsoft Entra tenant (they can be in different Azure subscriptions).

- GRS failover is irreversible. Failback to the original region isn't supported.

- GRS and GZRS support replication between Microsoft-defined paired Azure regions only. You can't use them to replicate to an arbitrary target region.

## Related articles

- [Copy blobs between Azure storage accounts by using AzCopy](../common/storage-use-azcopy-blobs-copy.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)
- [Synchronize with Azure Blob storage by using AzCopy](../common/storage-use-azcopy-blobs-synchronize.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)
- [Introduction to Azure Storage Mover](../../storage-mover/service-overview.md)
- [Azure Storage redundancy](../common/storage-redundancy.md)
- [Initiate a storage account failover](../common/storage-initiate-account-failover.md)
- [Access control lists (ACLs) in Azure Data Lake Storage](data-lake-storage-access-control.md)
- [Automate provisioning using ARM, Bicep, or Azure DevOps pipelines](../../azure-resource-manager/bicep/add-template-to-azure-pipelines.md?tabs=azure-cli)
