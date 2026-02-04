---
title: Storage Account Overview
titleSuffix: Azure Storage
description: Learn about the types of storage accounts in Azure Storage. Review account naming, tiers, redundancy, encryption, endpoints, and more.
services: storage
author: akashdubey-ms
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: concept-article
ms.date: 03/04/2025
ms.author: akashdubey
#customer intent: As a cloud architect, I want to understand the types of storage accounts and their features, so that I can choose the right account type based on my application's performance, redundancy, and cost requirements.
---

# Overview of storage accounts

A storage account contains all of your Azure Storage data objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your Azure Storage data that's accessible from anywhere in the world over HTTP or HTTPS. Data in your storage account is durable, highly available, secure, and massively scalable.

[Learn how to create a storage account](storage-account-create.md).

## Types of storage accounts

Azure Storage offers several types of storage accounts. Each type supports different features and has its own pricing model.

The following table describes the types of storage accounts that we recommend for most scenarios. All of these types use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) deployment model.

| Type of storage account | Supported storage services | Redundancy options | Usage |
|--|--|--|--|
| Standard general-purpose v2 | Azure Blob Storage (including Azure Data Lake Storage<sup>1</sup>), Azure Queue Storage, Azure Table Storage, and Azure Files  | Locally redundant storage (LRS) / geo-redundant storage (GRS) / read-access geo-redundant storage (RA-GRS)<br /><br />Zone-redundant storage (ZRS) / geo zone-redundant storage (GZRS) / read-access geo zone-redundant storage (RA-GZRS)<sup>2</sup> | Standard storage account type for blobs, file shares, queues, and tables. Recommended for most scenarios that use Azure Storage. If you want support for network file system (NFS) in Azure Files, use the premium file shares account type. |
| Premium block blobs<sup>3</sup> | Blob Storage (including Data Lake Storage<sup>1</sup>) | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for block blobs and append blobs. Recommended for scenarios with high transaction rates or that use smaller objects or require consistently low storage latency. [Learn more about example workloads](../blobs/storage-blob-block-blob-premium.md). |
| Premium file shares<sup>3</sup> | Azure Files | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for file shares only. Recommended for enterprise or high-performance scale applications. Use this account type if you want a storage account that supports both Server Message Block (SMB) and NFS file shares. |
| Premium page blobs<sup>3</sup> | Page blobs only | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for page blobs only. [Learn more about page blobs and sample use cases](../blobs/storage-blob-pageblob-overview.md). |

<sup>1</sup> Data Lake Storage is a set of capabilities dedicated to big data analytics, built on Blob Storage. For more information, see [Introduction to Data Lake Storage](../blobs/data-lake-storage-introduction.md) and [Create a storage account to use with Data Lake Storage](../blobs/create-data-lake-storage-account.md).

<sup>2</sup> ZRS, GZRS, and RA-GZRS are available only for standard general-purpose v2, premium block blobs, premium file shares, and premium page blobs accounts in certain regions. For more information, see [Azure Storage redundancy](storage-redundancy.md).

<sup>3</sup> Premium performance storage accounts use solid-state drives (SSDs) for low latency and high throughput.

Legacy storage accounts are also supported. For more information, see [Legacy storage account types](#legacy-storage-account-types).

The service-level agreement (SLA) for Azure storage accounts is available on the [SLA page for online services](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

> [!NOTE]
> You can't change a storage account to a different type after it's created. To move your data to a storage account of a different type, you must create a new account and copy the data to the new account.

## Storage account name

When you name your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length. They can contain only numbers and lowercase letters.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

## Storage account workloads 

Azure Storage customers use various workloads to store data, access data, and derive insights to meet their business objectives. Each workload uses specific protocols for data operations based on its requirements and industry standards.

The following sections offer a high-level categorization of different primary workloads for your storage accounts.

### Cloud native

Cloud-native apps are large-scale distributed applications that are built on a foundation of cloud paradigms and technologies. This modern approach focuses on cloud scale and performance capabilities.

Cloud-native apps can be based on microservices architecture, use managed services, and employ continuous delivery to achieve reliability. These applications are typically categorized into web apps, mobile apps, containerized apps, and serverless or function as a service (FaaS) types.

### Analytics

Analytics is the systematic, computational analysis of data and statistics. This science involves discovering, interpreting, and communicating meaningful insights and patterns found in data.

The discovered data can be manipulated and interpreted in ways that can help a business further objectives and meet goals. These workloads typically consist of a pipeline that ingests large volumes of data. The data are prepped, curated, and aggregated for downstream consumption via Power BI, data warehouses, or applications.

Analytics workloads can require high ingress and egress, which drives higher throughput on your storage account. Analytics types include real-time analytics, advanced analytics, predictive analytics, emotional analytics, sentiment analysis, and more. For analytics, we guarantee that our customers have high throughput access to large amounts of data in distributed storage architectures.

### High-performance computing

High-performance computing (HPC) is the aggregation of multiple computing nodes that act on the same set of tasks. They can achieve more than a single node can achieve in a specified time frame.

With HPC, powerful processors work in parallel to process massive, multidimensional datasets. HPC workloads require high-throughput read and write operations for workloads like gene sequencing and reservoir simulation. HPC workloads also include applications with high input/output operations per second (IOPS) and low-latency access to a large number of small files. They use these files for workloads like seismic interpretation, autonomous driving, and risk workloads.

The primary goal is to solve complex problems at ultra-fast speeds. Other examples of high-performance computing include fluid dynamics and other physical simulation or analysis that require scalability and high throughput. We help enable our customers to perform HPC by ensuring that large amounts of data are accessible with a large amount of concurrency.  

### Backup and archive

Business continuity and disaster recovery (BCDR) is a business's ability to remain operational after an adverse event. In terms of storage, this objective equates to maintaining business continuity across outages to storage systems.

With the introduction of backup-as-a-service offerings throughout the industry, BCDR data is increasingly migrating to the public cloud. The backup and archive workload functions as the last line of defense against ransomware and malicious attacks. When there's a service interruption or accidental deletion or corruption of data, recovering the data in an efficient and orchestrated manner is the highest priority. Azure Storage makes it possible to store and retrieve large amounts of data in the most cost-effective fashion.

### Machine learning and AI

AI is technology that simulates human intelligence and problem-solving capabilities in machines. Machine learning (ML) is a subdiscipline of AI that uses algorithms to create models that enable machines to perform tasks. AI and ML workloads are the newest on Azure and are growing at a rapid pace.

You can apply this type of workload across every industry to improve metrics and meet performance goals. These types of technologies can lead to discoveries of life-saving drugs and practices in the field of medicine and health, while also providing health assessments.

Other everyday uses of ML and AI include fraud detection, image recognition, and flagging misinformation. These workloads typically need:

* Highly specialized compute (a lot of GPUs).
* High throughput and IOPS.
* Low-latency access to storage.
* POSIX file system access.

Azure Storage supports these types of workloads by storing checkpoints and providing storage for large-scale datasets and models. These datasets and models read and write at a pace to keep GPUs utilized.

### Recommended workload configurations

The following table illustrates Microsoft's suggested storage account configurations for each workload. When you change configuration options (associated with each workload), there are cost implications. 

View pricing at [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). Enter the configuration options for the workload into the calculator and select the **Recommended** tab to view detailed pricing for the specific workload you're creating.

|Workload |Type of account |Performance |Redundancy |Hierarchical namespace enabled |Default access tier |Soft delete enabled |
|---|---|---|---|---|---|---|
|Cloud native |General purpose v2 |Standard |ZRS, RA-GRS |No |Hot |Yes |
|Analytics |General purpose v2 |Standard |ZRS<sup>1</sup>, RA-GRS |Yes<sup>2</sup> |Hot |Yes |
|HPC |General purpose v2 |Standard |ZRS, RA-GRS |Yes |Hot |Yes |
|Backup and archive |General purpose v2 |Standard |ZRS, RA-GRS |No |Cool<sup>3</sup> |Yes |
|Machine learning and AI |General purpose v2 |Standard |ZRS, RA-GRS |Yes |Hot |No |

<sup>1</sup> ZRS is a good default for analytics workloads because it offers more redundancy compared to LRS. It protects against zonal failures while remaining fully compatible with analytics frameworks. Customers that require more redundancy for an analytics workload can also use geo-redundant storage (GRS or RA-GRS).
<br/><br/><sup>2</sup> The [hierarchical namespace](../blobs/data-lake-storage-namespace.md) is a core capability of Data Lake Storage. It enhances data organization and access efficiency for large amounts of data, making it ideal for analytics workloads.
<br/><br/><sup>3</sup> The cool access tier offers a cost-effective solution for storing infrequently accessed data (typical for a backup and archive workload). Customers can also consider the cold access tier after evaluating costs.

## Storage account endpoints

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has a URL address that includes your unique account name. The combination of the account name and the service endpoint forms the endpoints for your storage account.

There are two types of service endpoints available for a storage account:

- [Standard endpoints](#standard-endpoints) (recommended). By default, you can create up to 250 storage accounts per region with standard endpoints in a subscription. With a quota increase, you can create up to 500 storage accounts with standard endpoints per region. For more information, see [Increase Azure Storage account quotas](/azure/quotas/storage-account-quota-requests).
- [Azure DNS zone endpoints](#azure-dns-zone-endpoints-preview) (preview). You can create up to 5,000 storage accounts per region per subscription with Azure DNS zone endpoints in a subscription.

Within a single subscription, you can create accounts with either standard or Azure DNS zone endpoints, for a maximum of 5,250 accounts per region per subscription. With a quota increase, you can create up to 5,500 storage accounts per region per subscription.

You can configure your storage account to use a custom domain for the Blob Storage endpoint. For more information, see [Map a custom domain to an Azure Blob Storage endpoint](../blobs/storage-custom-domain-name.md).

> [!IMPORTANT]
> When you reference a service endpoint in a client application, we recommend that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change. If you rely on a cached IP address, you might experience unexpected behavior.
>
> Additionally, we recommend that you honor the time to live (TTL) of the DNS record and avoid overriding it. If you override the DNS TTL, you might experience unexpected behavior.

### Standard endpoints

A standard service endpoint in Azure Storage includes:

* The protocol. (We recommend HTTPS.)
* The storage account name as the subdomain.
* A fixed domain that includes the name of the service.

The following table lists the format for the standard endpoints for each of the Azure Storage services.

| Storage service | Endpoint |
|--|--|
| Blob Storage | `https://<storage-account>.blob.core.windows.net` |
| Static website (Blob Storage) | `https://<storage-account>.web.core.windows.net` |
| Data Lake Storage | `https://<storage-account>.dfs.core.windows.net` |
| Azure Files | `https://<storage-account>.file.core.windows.net` |
| Queue Storage | `https://<storage-account>.queue.core.windows.net` |
| Table Storage | `https://<storage-account>.table.core.windows.net` |

When your account is created with standard endpoints, you can easily construct the URL for an object in Azure Storage. Append the object's location in the storage account to the endpoint. For example, the URL for a blob is similar to:

`https://<mystorageaccount>.blob.core.windows.net/<mycontainer>/<myblob>`

### Azure DNS zone endpoints (preview)

> [!IMPORTANT]
> Azure DNS zone endpoints are currently in *preview*. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you create a storage account with Azure DNS zone endpoints (preview), Azure Storage dynamically selects an Azure DNS zone and assigns it to the storage account when it's created. The new storage account's endpoints are created in the dynamically selected Azure DNS zone. For more information, see Azure [DNS zones](../../dns/dns-zones-records.md#dns-zones).

An Azure DNS zone service endpoint in Azure Storage includes:

* The protocol. (We recommend HTTPS.)
* The storage account name as the subdomain.
* A domain that includes the name of the service and the identifier for the DNS zone. The identifier for the DNS zone always begins with `z` and can range from `z00` to `z50`.

The following table lists the format for Azure DNS zone endpoints for each of the Azure Storage services:

| Storage service | Endpoint |
|--|--|
| Blob Storage | `https://<storage-account>.z[00-50].blob.storage.azure.net` |
| Static website (Blob Storage) | `https://<storage-account>.z[00-50].web.storage.azure.net` |
| Data Lake Storage | `https://<storage-account>.z[00-50].dfs.storage.azure.net` |
| Azure Files | `https://<storage-account>.z[00-50].file.storage.azure.net` |
| Queue Storage | `https://<storage-account>.z[00-50].queue.storage.azure.net` |
| Table Storage | `https://<storage-account>.z[00-50].table.storage.azure.net` |

> [!IMPORTANT]
> You can create up to 5,000 accounts with Azure DNS zone endpoints per region per subscription. However, you might need to update your application code to query for the account endpoint at runtime. You can call the [`get properties`](/rest/api/storagerp/storage-accounts/get-properties) operation to query for the storage account endpoints.

Azure DNS zone endpoints are supported for accounts created with only the Azure Resource Manager deployment model. For more information, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md).

To learn how to create a storage account with Azure DNS zone endpoints, see [Create a storage account](storage-account-create.md).

#### About the preview

The preview of Azure DNS zone endpoints is available in all public regions. The preview isn't available in any government cloud regions.

To register for the preview, follow the instructions provided in [Set up preview features in an Azure subscription](../../azure-resource-manager/management/preview-features.md#register-preview-feature). Specify `PartitionedDnsPublicPreview` as the feature name and `Microsoft.Storage` as the provider namespace.

### CNAME records, subdomains, and IP addresses

Each storage account endpoint points to a chain of DNS CNAME records that eventually point to a DNS A record. The number of records and the subdomains that are associated with each record can vary between accounts. They can depend on the storage account type and how the account is configured.

The storage account endpoint is stable and doesn't change. However, the CNAME records in a chain can change and you aren't notified when a change occurs. If you host a private DNS service in Azure, these changes can affect your configuration.

Consider the following guidelines:

- The CNAME chain associated with a storage account endpoint can change without notice. Applications and environments shouldn't take a dependency on the number of CNAME records or the subdomains that are associated with those CNAME records.

- The A record's IP address that the DNS resolution of a storage account endpoint returns can change frequently.

- The applications and operating systems should always honor the TTL associated with the CNAME record. When you cache the value of the CNAME record beyond the TTL, you might experience unintended behavior.

## Migrating a storage account

The following table summarizes and points to guidance on how to move, upgrade, or migrate a storage account:

| Migration scenario | Details |
|--|--|
| Move a storage account to a different subscription | Azure Resource Manager provides options for moving a resource to a different subscription. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). |
| Move a storage account to a different resource group | Azure Resource Manager provides options for moving a resource to a different resource group. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). |
| Move a storage account to a different region | To move a storage account, create a copy of your storage account in another region. Then, move your data to that account by using AzCopy or another tool of your choice. For more information, see [Move an Azure Storage account to another region](storage-account-move.md). |
| Upgrade to a general-purpose v2 storage account | You can upgrade a general-purpose v1 storage account or legacy Blob Storage account to a general-purpose v2 account. This action can't be undone. For more information, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md). |
| Migrate a classic storage account to Azure Resource Manager | The Azure Resource Manager deployment model is superior to the classic deployment model in terms of functionality, scalability, and security. For more information about migrating a classic storage account to Azure Resource Manager, see [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview#migration-of-storage-accounts). |

## Transferring data into a storage account

Microsoft provides services and utilities to import your data from on-premises storage devices or third-party cloud storage providers. Which solution you use depends on the quantity of data you're transferring. For more information, see [Azure Storage migration overview](storage-migration-overview.md).

## Storage account encryption

All data in your storage account is automatically encrypted on the service side. For more information about encryption and key management, see [Azure Storage encryption for data at rest](storage-service-encryption.md).

## Storage account billing

Azure Storage bills based on your storage account usage. All objects in a storage account are billed together as a group. Storage costs are calculated according to the following factors:

- **Region**: The geographical region in which your account is based.
- **Account type**: The type of storage account you're using.
- **Access tier**: The data usage pattern that you specified for your general-purpose v2 or Blob Storage account.
- **Capacity**: How much of your storage account allotment you're using to store data.
- **Redundancy**: How many copies of your data are maintained at one time, and in what locations.
- **Transactions**: All read and write operations to Azure Storage.
- **Data egress**: Any data transferred out of an Azure region. When an application that isn't running in the same region accesses the data in your storage account, you're charged for data egress. For information about using resource groups to group your data and services in the same region to limit egress charges, see [What is an Azure resource group?](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group).

The [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage) provides detailed pricing information based on account type, storage capacity, replication, and transactions. The [Data transfers pricing details](https://azure.microsoft.com/pricing/details/data-transfers) provides detailed pricing information for data egress. You can use the [Azure Storage pricing calculator](https://azure.microsoft.com/pricing/calculator/?scenario=data-management) to help estimate your costs.

[!INCLUDE [cost-management-horizontal](../../../includes/cost-management-horizontal.md)]

## <a name = "legacy-storage-account-types"></a> Retired storage account types

The following account types are retired or scheduled for retirement. They aren't recommended for new deployments. If you still have these accounts, plan to migrate to a supported account type.

> [!IMPORTANT]
> Azure storage accounts that use the *classic deployment model (ASM)* type were retired on August 31, 2024. Migrate to the Azure Resource Manager deployment model. For migration guidance, see [classic account migration overview](./classic-account-migration-overview.md). For more information, see [Update on classic storage account retirement](https://techcommunity.microsoft.com/blog/azurestorageblog/update-on-classic-storage-account-retirement-and-upcoming-changes-for-classic-st/4282217).

| Retired account type | Supported services | Redundancy options | Deployment model | Guidance |
| --- | --- | --- | --- | --- |
| **Standard general-purpose v1** | Blob Storage, Queue Storage, Table Storage, Azure Files | LRS/GRS/RA-GRS | Resource Manager, classic¹ | Upgrade existing general-purpose v1 accounts to general-purpose v2 to access modern features and cost-optimization capabilities. Before you upgrade, you can model capacity and operations costs by reading [General-purpose v1 account migration](./general-purpose-version-1-account-migration-overview.md). For the in-place upgrade, see [storage account upgrade](./storage-account-upgrade.md). |
| **Blob Storage** | Block blobs and append blobs | LRS/GRS/RA-GRS | Resource Manager | Upgrade existing legacy Blob Storage accounts to GPv2 to use access tiers and lifecycle management. See [Legacy Blob Storage account migration overview](./legacy-blob-storage-account-migration-overview.md) and [access tiers overview](../blobs/access-tiers-overview.md). |
| **Classic (ASM) storage accounts** | Blob Storage, Queue Storage, Table Storage, Azure Files | LRS/GRS/RA-GRS | classic | Retired. Migrate to the Resource Manager deployment model. See [classic account migration overview](./classic-account-migration-overview.md). |

¹ *Classic* denotes the Azure Service Management deployment model.

## Scalability targets for standard storage accounts

[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

## Related content

- [Create a storage account](storage-account-create.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Recover a deleted storage account](storage-account-recover.md)
