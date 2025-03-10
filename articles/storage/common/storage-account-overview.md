---
title: Storage account overview
titleSuffix: Azure Storage
description: Learn about the different types of storage accounts in Azure Storage. Review account naming, performance tiers, access tiers, redundancy, encryption, endpoints, and more.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: conceptual
ms.date: 12/06/2023
ms.author: akashdubey
---

# Storage account overview

An Azure storage account contains all of your Azure Storage data objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your Azure Storage data that's accessible from anywhere in the world over HTTP or HTTPS. Data in your storage account is durable and highly available, secure, and massively scalable.

To learn how to create an Azure Storage account, see [Create a storage account](storage-account-create.md).

## Types of storage accounts

Azure Storage offers several types of storage accounts. Each type supports different features and has its own pricing model.

The following table describes the types of storage accounts recommended by Microsoft for most scenarios. All of these use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) deployment model.

| Type of storage account | Supported storage services | Redundancy options | Usage |
|--|--|--|--|
| Standard general-purpose v2 | Blob Storage (including Data Lake Storage<sup>1</sup>), Queue Storage, Table Storage, and Azure Files  | Locally redundant storage (LRS) / geo-redundant storage (GRS) / read-access geo-redundant storage (RA-GRS)<br /><br />Zone-redundant storage (ZRS) / geo-zone-redundant storage (GZRS) / read-access geo-zone-redundant storage (RA-GZRS)<sup>2</sup> | Standard storage account type for blobs, file shares, queues, and tables. Recommended for most scenarios using Azure Storage. If you want support for network file system (NFS) in Azure Files, use the premium file shares account type. |
| Premium block blobs<sup>3</sup> | Blob Storage (including Data Lake Storage<sup>1</sup>) | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for block blobs and append blobs. Recommended for scenarios with high transaction rates or that use smaller objects or require consistently low storage latency. [Learn more about example workloads.](../blobs/storage-blob-block-blob-premium.md) |
| Premium file shares<sup>3</sup> | Azure Files | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for file shares only. Recommended for enterprise or high-performance scale applications. Use this account type if you want a storage account that supports both Server Message Block (SMB) and NFS file shares. |
| Premium page blobs<sup>3</sup> | Page blobs only | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for page blobs only. [Learn more about page blobs and sample use cases.](../blobs/storage-blob-pageblob-overview.md) |

<sup>1</sup> Data Lake Storage is a set of capabilities dedicated to big data analytics, built on Azure Blob Storage. For more information, see [Introduction to Data Lake Storage](../blobs/data-lake-storage-introduction.md) and [Create a storage account to use with Data Lake Storage](../blobs/create-data-lake-storage-account.md).

<sup>2</sup> ZRS, GZRS, and RA-GZRS are available only for standard general-purpose v2, premium block blobs, premium file shares, and premium page blobs accounts in certain regions. For more information, see [Azure Storage redundancy](storage-redundancy.md).

<sup>3</sup> Premium performance storage accounts use solid-state drives (SSDs) for low latency and high throughput.

Legacy storage accounts are also supported. For more information, see [Legacy storage account types](#legacy-storage-account-types).

The service-level agreement (SLA) for Azure Storage accounts is available at [SLA for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

> [!NOTE]
> You can't change a storage account to a different type after it's created. To move your data to a storage account of a different type, you must create a new account and copy the data to the new account.

## Storage account name

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

## Storage account workloads 

Azure Storage customers use a variety of workloads to store data, access it and derive insights to meet their business objectives. Each workload uses specific protocols for data operations based on its requirements as well as industry standards.

Below is a high-level categorization of different primary workloads for your storage accounts.

### Cloud native

Cloud native apps are large-scale distributed applications that are built on a foundation of cloud paradigms and technologies. This modern approach focuses on cloud scale and performance capabilities. Cloud native apps can be based on microservices architecture, use managed services, and employ continuous delivery to achieve reliability. These applications are typically categorized into web apps, mobile apps, containerized apps, and serverless/FaaS. 

### Analytics

Analytics is the systematic, computational analysis of data and statistics. This science involves discovering, interpreting, and communication of meaningful insights/patterns found in data. The data discovered can be manipulated and interpreted in ways to further a business’s objectives and to help it meet its goals. These workloads typically consist of a pipeline ingesting large volumes of data that are prepped, curated, and aggregated for downstream consumption via Power BI, data warehouses or applications. Analytics workloads can require high ingress and egress, driving higher throughput on your storage account. Some different types of analytics include (but are not limited to) real-time analytics, advanced analytics, predictive analytics, emotional analytics, and sentiment analysis. For analytics, we guarantee that our customers have high throughput access to large amounts of data in distributed storage architectures. 

### High-performance computing (HPC)

High-performance computing is the aggregation of multiple computing nodes acting on the same set of tasks to achieve more than that of a single node in a given time frame. It involves using powerful processors that work in parallel to process massive, multi-dimensional data sets. HPC workloads require very high throughput read and write operations for workloads like gene sequencing and reservoir simulation. HPC workloads also include applications with high IOPS and low latency access to a large number of small files for workloads like seismic interpretation, autonomous driving and risk workloads. The primary goal is to solve complex problems at ultra-fast speeds. Other examples of high-performance computing include fluid dynamics and other physical simulation or analysis which require scalability and high throughput. To enable our customers to perform HPC, we ensure that large amounts of data are accessible with a large amount of concurrency.  

### Backup and archive

Business continuity and disaster recovery (BCDR) is a business’s ability to remain operational after an adverse event. In terms of storage, this objective equates to maintaining business continuity across outages to storage systems.  With the introduction of Backup-as-a-Service offerings throughout the industry, BCDR data is increasingly migrating to the public cloud. The backup and archive workload functions as the last line of defense against rising ransomware and malicious attacks. When there is a service interruption or accidental deletion or corruption of data, recovering the data in an efficient and orchestrated manner is the highest priority. To accomplish this, Azure Storage makes it possible to store and retrieve large amounts of data in the most cost-effective fashion. 

### Machine learning and artificial intelligence

Artificial intelligence (AI) is technology that simulates human intelligence and problem-solving capabilities in machines. Machine Learning (ML) is a sub-discipline of AI that uses algorithms to create models that enable machines to perform tasks. Both represent the newest workload on Azure which is growing at a rapid pace. This type of workload can be applied across every industry to improve metrics and meet performance goals. These types of technologies can lead to discoveries of life-saving drugs and practices in the field of medicine/health while also providing health assessments. Other everyday uses of ML and AI include fraud detection, image recognition, and the flagging of misinformation. These workloads typically need highly specialized compute (large numbers of GPU) and require high throughput and IOPS, low latency access to storage and POSIX file system access. Azure Storage supports these types of workloads by storing checkpoints and providing storage for large-scale datasets and models. These datasets and models read and write at a pace to keep GPUs utilized. 

### Recommended workload configurations
The table below illustrates Microsoft's suggested storage account configurations for each workload

|Workload |Account kind |Performance |Redundancy |Hierarchical namespace enabled |Default access tier |Soft delete enabled |
|---|---|---|---|---|---|---|
|Cloud native |General purpose v2 |Standard |ZRS, RA-GRS |No |Hot |Yes |
|Analytics |General purpose v2 |Standard |ZRS<sup>1</sup>, RA-GRS |Yes<sup>2</sup> |Hot |Yes |
|High performance computing (HPC) |General purpose v2 |Standard |ZRS, RA-GRS |Yes |Hot |Yes |
|Backup and archive |General purpose v2 |Standard |ZRS, RA-GRS |No |Cool<sup>3</sup> |Yes |
|Machine learning and artificial intelligence |General purpose v2 |Standard |ZRS, RA-GRS |Yes |Hot |No |

<sup>1</sup> Zone Redundant Storage (ZRS) is a good default for analytics workloads because ZRS offers additional redundancy compared to Locally Redundant Storage (LRS), protecting against zonal failures while remaining fully compatible with analytics frameworks. Customers that require additional redundancy can also leverage Geo-redundant Storage (GRS/RA-GRS) if additional redundancy is required for an analytics workload.
<br/><br/><sup>2</sup> As a core capability of Azure Data Lake Storage (ADLS), the [hierarchical namespace](../blobs/data-lake-storage-namespace.md) enhances data organization and access efficiency for large amounts of data, making it ideal for analytics workloads.
<br/><br/><sup>3</sup> The cool access tier offers a cost-effective solution for storing infrequently accessed data, which is typical for a backup and archive workload. Customers can also consider the cold access tier after evaluating costs.

## Storage account endpoints

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has a URL address that includes your unique account name. The combination of the account name and the service endpoint forms the endpoints for your storage account.

There are two types of service endpoints available for a storage account:

- [Standard endpoints](#standard-endpoints) (recommended). By default, you can create up to 250 storage accounts per region with standard endpoints in a given subscription. With a quota increase, you can create up to 500 storage accounts with standard endpoints per region. For more information, see [Increase Azure Storage account quotas](/azure/quotas/storage-account-quota-requests).
- [Azure DNS zone endpoints](#azure-dns-zone-endpoints-preview) (preview). You can create up to 5000 storage accounts per region per subscription with Azure DNS zone endpoints in a given subscription.

Within a single subscription, you can create accounts with either standard or Azure DNS Zone endpoints, for a maximum of 5250 accounts per region per subscription. With a quota increase, you can create up to 5500 storage accounts per region per subscription.

You can configure your storage account to use a custom domain for the Blob Storage endpoint. For more information, see [Configure a custom domain name for your Azure Storage account](../blobs/storage-custom-domain-name.md).

> [!IMPORTANT]
> When referencing a service endpoint in a client application, it's recommended that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change, and relying on a cached IP address may result in unexpected behavior.
>
> Additionally, it's recommended that you honor the time-to-live (TTL) of the DNS record and avoid overriding it. Overriding the DNS TTL may result in unexpected behavior.

### Standard endpoints

A standard service endpoint in Azure Storage includes the protocol (HTTPS is recommended), the storage account name as the subdomain, and a fixed domain that includes the name of the service.

The following table lists the format for the standard endpoints for each of the Azure Storage services.

| Storage service | Endpoint |
|--|--|
| Blob Storage | `https://<storage-account>.blob.core.windows.net` |
| Static website (Blob Storage) | `https://<storage-account>.web.core.windows.net` |
| Data Lake Storage | `https://<storage-account>.dfs.core.windows.net` |
| Azure Files | `https://<storage-account>.file.core.windows.net` |
| Queue Storage | `https://<storage-account>.queue.core.windows.net` |
| Table Storage | `https://<storage-account>.table.core.windows.net` |

When your account is created with standard endpoints, you can easily construct the URL for an object in Azure Storage by appending the object's location in the storage account to the endpoint. For example, the URL for a blob will be similar to:

`https://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*`

### Azure DNS zone endpoints (preview)

> [!IMPORTANT]
> Azure DNS zone endpoints are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

When you create an Azure Storage account with  Azure DNS zone endpoints (preview), Azure Storage dynamically selects an Azure DNS zone and assigns it to the storage account when it is created. The new storage account's endpoints are created in the dynamically selected Azure DNS zone. For more information about Azure DNS zones, see [DNS zones](../../dns/dns-zones-records.md#dns-zones).

An Azure DNS zone service endpoint in Azure Storage includes the protocol (HTTPS is recommended), the storage account name as the subdomain, and a domain that includes the name of the service and the identifier for the DNS zone. The identifier for the DNS zone always begins with `z` and can range from `z00` to `z50`.

The following table lists the format for Azure DNS Zone endpoints for each of the Azure Storage services:

| Storage service | Endpoint |
|--|--|
| Blob Storage | `https://<storage-account>.z[00-50].blob.storage.azure.net` |
| Static website (Blob Storage) | `https://<storage-account>.z[00-50].web.storage.azure.net` |
| Data Lake Storage | `https://<storage-account>.z[00-50].dfs.storage.azure.net` |
| Azure Files | `https://<storage-account>.z[00-50].file.storage.azure.net` |
| Queue Storage | `https://<storage-account>.z[00-50].queue.storage.azure.net` |
| Table Storage | `https://<storage-account>.z[00-50].table.storage.azure.net` |

> [!IMPORTANT]
> You can create up to 5000 accounts with Azure DNS Zone endpoints per region per subscription. However, you may need to update your application code to query for the account endpoint at runtime. You can call the [Get Properties](/rest/api/storagerp/storage-accounts/get-properties) operation to query for the storage account endpoints.

Azure DNS zone endpoints are supported for accounts created with the Azure Resource Manager deployment model only. For more information, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md).

To learn how to create a storage account with Azure DNS Zone endpoints, see [Create a storage account](storage-account-create.md).

#### About the preview

The Azure DNS zone endpoints preview is available in all public regions. The preview is not available in any government cloud regions.

To register for the preview, follow the instructions provided in [Set up preview features in Azure subscription](../../azure-resource-manager/management/preview-features.md#register-preview-feature). Specify `PartitionedDnsPublicPreview` as the feature name and `Microsoft.Storage` as the provider namespace.

### CNAME records, subdomains and IP addresses

Each storage account endpoint points to a chain of DNS CNAME records which eventually point to a DNS A record. The number of records and the subdomains that are associated with each record can vary between accounts and can depend on the storage account type and how the account is configured.

The storage account endpoint is stable and does not change. However, the CNAME records in a given chain can change and you won't be notified when a change occurs. If you host a private DNS service in Azure, then these changes can impact your configuration. 

Consider the following guidelines:

- The CNAME chain associated with a storage account endpoint can change without notice. Applications and environments should not take a dependency on the number of of CNAME records or the sub-domains that are associated with those CNAME records.

- The A record's IP address that is returned by the DNS resolution of a storage account endpoint can change frequently.

- The applications and operating systems should always honor the time-to-live (TTL) associated with the CNAME record. Caching the the value of the CNAME record beyond the TTL could lead to unintended behavior.

## Migrate a storage account

The following table summarizes and points to guidance on how to move, upgrade, or migrate a storage account:

| Migration scenario | Details |
|--|--|
| Move a storage account to a different subscription | Azure Resource Manager provides options for moving a resource to a different subscription. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). |
| Move a storage account to a different resource group | Azure Resource Manager provides options for moving a resource to a different resource group. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). |
| Move a storage account to a different region | To move a storage account, create a copy of your storage account in another region. Then, move your data to that account by using AzCopy, or another tool of your choice. For more information, see [Move an Azure Storage account to another region](storage-account-move.md). |
| Upgrade to a general-purpose v2 storage account | You can upgrade a general-purpose v1 storage account or Blob Storage account to a general-purpose v2 account. Note that this action can’t be undone. For more information, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md). |
| Migrate a classic storage account to Azure Resource Manager | The Azure Resource Manager deployment model is superior to the classic deployment model in terms of functionality, scalability, and security. For more information about migrating a classic storage account to Azure Resource Manager, see the "Migration of storage accounts" section of [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview#migration-of-storage-accounts). |

## Transfer data into a storage account

Microsoft provides services and utilities for importing your data from on-premises storage devices or third-party cloud storage providers. Which solution you use depends on the quantity of data you're transferring. For more information, see [Azure Storage migration overview](storage-migration-overview.md).

## Storage account encryption

All data in your storage account is automatically encrypted on the service side. For more information about encryption and key management, see [Azure Storage encryption for data at rest](storage-service-encryption.md).

## Storage account billing

Azure Storage bills based on your storage account usage. All objects in a storage account are billed together as a group. Storage costs are calculated according to the following factors:

- **Region** refers to the geographical region in which your account is based.
- **Account type** refers to the type of storage account you're using.
- **Access tier** refers to the data usage pattern you’ve specified for your general-purpose v2 or Blob Storage account.
- **Capacity** refers to how much of your storage account allotment you're using to store data.
- **Redundancy** determines how many copies of your data are maintained at one time, and in what locations.
- **Transactions** refer to all read and write operations to Azure Storage.
- **Data egress** refers to any data transferred out of an Azure region. When the data in your storage account is accessed by an application that isn’t running in the same region, you're charged for data egress. For information about using resource groups to group your data and services in the same region to limit egress charges, see [What is an Azure resource group?](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group).

The [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage) provides detailed pricing information based on account type, storage capacity, replication, and transactions. The [Data Transfers pricing details](https://azure.microsoft.com/pricing/details/data-transfers) provides detailed pricing information for data egress. You can use the [Azure Storage pricing calculator](https://azure.microsoft.com/pricing/calculator/?scenario=data-management) to help estimate your costs.

[!INCLUDE [cost-management-horizontal](../../../includes/cost-management-horizontal.md)]

## Legacy storage account types

The following table describes the legacy storage account types. These account types aren’t recommended by Microsoft, but may be used in certain scenarios:

| Type of legacy storage account | Supported storage services | Redundancy options | Deployment model | Usage |
|--|--|--|--|--|
| Standard general-purpose v1 | Blob Storage, Queue Storage, Table Storage, and Azure Files | LRS/GRS/RA-GRS | Resource Manager, classic<sup>1</sup> | General-purpose v1 accounts may not have the latest features or the lowest per-gigabyte pricing. Consider using it for these scenarios:<br /><ul><li>Your applications require the Azure [classic deployment model](/azure/azure-portal/supportability/classic-deployment-model-quota-increase-requests)<sup>1</sup>.</li><li>Your applications are transaction-intensive or use significant geo-replication bandwidth, but don’t require large capacity. In this case, a general-purpose v1 account may be the most economical choice.</li><li>You use a version of the Azure Storage REST API that is earlier than February 14, 2014, or a client library with a version lower than 4.x, and you can’t upgrade your application.</li><li>You're selecting a storage account to use as a cache for Azure Site Recovery. Because Site Recovery is transaction-intensive, a general-purpose v1 account may be more cost-effective. For more information, see [Support matrix for Azure VM disaster recovery between Azure regions](../../site-recovery/azure-to-azure-support-matrix.md#cache-storage).</li></ul> |
| Blob Storage | Blob Storage (block blobs and append blobs only) | LRS/GRS/RA-GRS | Resource Manager | Microsoft recommends using standard general-purpose v2 accounts instead when possible. |

<sup>1</sup> Beginning August 1, 2022, you'll no longer be able to create new storage accounts with the classic deployment model. Resources created prior to that date will continue to be supported through August 31, 2024. For more information, see [Azure classic storage accounts will be retired on 31 August 2024](https://azure.microsoft.com/updates/classic-azure-storage-accounts-will-be-retired-on-31-august-2024).

## Scalability targets for standard storage accounts

[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

## Next steps

- [Create a storage account](storage-account-create.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Recover a deleted storage account](storage-account-recover.md)


