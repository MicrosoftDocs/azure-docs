---
title: Azure Files scalability and performance targets
description: Learn about the scalability and performance targets for Azure Files, including file share storage, IOPS, and throughput.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 08/28/2025
ms.author: kendownie
ms.custom: references_regions
# Customer intent: As an IT administrator, I want to assess the scalability and performance targets for Azure Files, so that I can ensure my storage solutions meet the needs of my organization’s workload requirements.
---

# Scalability and performance targets for Azure Files
[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via SMB and NFS file sharing protocols. This article discusses the scalability and performance targets for Azure Files. In addition to the limits set by Azure Files, other variables in your deployment can affect the targets listed in this article. You should test your usage pattern to determine whether the scalability and performance of Azure Files meet your requirements.

In Azure, a *resource* is a manageable item that you create and configure within your Azure subscriptions and resource groups. Resources are offered by *resource providers*, which are management services that deliver specific types of resources. While you may work with many resources to deploy a workload in Azure, Azure Files centers on two key resources:

- **Storage accounts**, offered by the `Microsoft.Storage` resource provider. Storage accounts are top-level resources that represent a shared pool of storage, IOPS, and throughput in which you can deploy **classic file shares** or other storage resources, depending on the storage account kind. All storage resources that are deployed into a storage account share the limits that apply to that storage account. Classic file shares support both the SMB and NFS file sharing protocols.

- **File shares** (preview), offered by the `Microsoft.FileShares` resource provider. File shares are a new top-level resource type that simplifies the deployment of Azure Files by eliminating the storage account. Unlike classic file shares, which must be deployed into a storage account, file shares are deployed directly into the resource group like storage accounts themselves, or other Azure resources you may be familiar with like virtual machines, disks, or virtual networks. File shares support the NFS file sharing protocol - if you require SMB, choose classic file shares for your deployment.

## Classic file share scale targets (Microsoft.Storage)
There are two types of limits that apply to storage accounts and classic file shares:

- Control plane limits, which are enforced by the `Microsoft.Storage` resource provider and apply to management requests such as creating, updating, or deleting the storage account or other child resources including but not limited to classic file shares.

- Data plane limits, which are enforced by the Azure storage platform, and apply to things like creating and deleting files and folders via SMB, NFS, FileREST, and other protocols. For legacy reasons, some management operations, like creating, updating, or deleting classic file shares are also available via the data plane (FileREST protocol). For management requests made directly to the Azure storage platform, `Microsoft.Storage` limits do not apply.

### Microsoft.Storage control plane limits
The following limits apply to storage accounts or child resources of the storage account such as classic file shares.

| Attribute | Limit |
|-|-|
| Maximum number of storage accounts per subscription per region | 250 storage accounts |
| Maximum number of classic file shares per storage account | <ul><li>**SSD / HDD provisioned v2**: 50 classic file shares</li><li>**SSD provisioned v1**: 1024 classic file shares (recommended to use 50 or fewer)</li><li>**HDD pay-as-you-go**: Unlimited (recommended to use 50 or fewer)</li></ul> |
| Maximum number of file share snapshots per classic file share | 200 |
| Maximum number of virtual network rules per storage account | 200 |
| Maximum number of IP address rules per storage account | 200 |
| Management read operations | 800 per 5 minutes |
| Management write operations | 10 per second / 1200 per hour |
| Management list operations | 100 per 5 minutes |

### Storage account data plane limits
Storage accounts have slightly different limits depending on the SKU and kind of the storage account being used. The SKU of the storage account is a combination of the media tier, the iteration of the billing model, and redundancy. The kind of the storage account is an additional modifier that determines which storage services, features, and billing models it supports. For classic file shares, there are four combinations:

- **SSD provisioned v2 storage accounts**, which are represented by the `FileStorage` storage account kind and the `PremiumV2_LRS` or `PremiumV2_ZRS` storage account SKUs. These storage accounts can contain only classic file shares and cannot be used to deploy other storage resources such as blob containers, queues, or tables. Classic file shares deployed in these storage accounts are always on the SSD media tier and billed using the provisioned v2 billing model.

- **HDD provisioned v2 storage accounts**, which are represented by the `FileStorage` storage account kind and the `StandardV2_LRS`, `StandardV2_ZRS`, `StandardV2_GRS`, or `StandardV2_GZRS` storage account SKUs. These storage accounts can contain only classic file shares and cannot be used to deploy other storage resources such as blob containers, queues, or tables. Classic file shares deployed in these storage accounts are always on the HDD media tier and billed using the provisioned v2 billing model.

- **SSD provisioned v1 storage accounts**, which are represented by the `FileStorage` storage account kind and the `Premium_LRS` or `Premium_ZRS` storage account SKUs. These storage accounts can contain only classic file shares and cannot be used to deploy other storage resources such as blob containers, queues, or tables. Classic file shares deployed in these storage accounts are always on the SSD media tier and billed using the provisioned v1 billing model.

- **HDD pay-as-you-go storage accounts**, which are represented by the `StorageV2` storage account kind and the `Standard_LRS`, `Standard_ZRS`, `Standard_GRS`, `Standard_GZRS`, `Standard_RAGRS`, or `Standard_RAGZRS` storage account SKUs. These storage accounts can contain classic file shares or other storage resources such as blob containers, queues, and tables. Classic file shares deployed in these storage accounts are always on the HDD media tier and billed using the pay-as-you-go billing model. 

    > [!NOTE]  
    > Although you can deploy classic file shares into storage accounts with the `Standard_RAGRS` or `Standard_RAGZRS` storage account SKUs, Azure Files doesn't support read-accessibility mode for geo-redundant storage accounts. These classic file shares will implicitly use the `Standard_GRS` or `Standard_GZRS` storage account SKUs. Other storage resources, such as blob containers, do support read-accessibility mode, and can be intermingled in these storage accounts.

The following limits apply to the data plane of the storage account. Everything in the storage account, including classic file shares, blob containers, tables, or queues, share these limits.

| Attribute | SSD provisioned v2 | HDD provisioned v2 | SSD provisioned v1 | HDD pay-as-you-go |
|-|-|-|-|-|
| Storage account kind | FileStorage | FileStorage | FileStorage | StorageV2 |
| SKUs | <ul><li>PremiumV2_LRS</li><li>PremiumV2_ZRS</li></ul> | <ul><li>StandardV2_LRS</li><li>StandardV2_ZRS</li><li>StandardV2_GRS</li><li>StandardV2_GZRS</li></ul> | <ul><li>Premium_LRS</li><li>Premium_ZRS</li></ul> | <ul><li>Standard_LRS</li><li>Standard_ZRS</li><li>Standard_GRS</li><li>Standard_GZRS</li></ul> |
| Maximum storage capacity | 256 TiB | 4 PiB | 100 TiB | 5 PiB |
| Maximum IOPS | 102,400 IOPS | 50,000 IOPS | 102,400 IOPS | <ul><li>Select regions: 40,000 IOPS</li><li>Default: 20,000 IOPS</li></ul> |
| Maximum throughput | 10,340 MiB / sec | 5,120 MiB / sec | 10,340 MiB / sec | <ul><li>Select regions:<ul><li>Ingress: 7,680 MiB / sec</li><li>Egress: 25,600 MiB / sec</li></ul></li><li>Default:<ul><li>Ingress: 3,200 MiB / sec</li><li>Egress: 6,400 MiB / sec</li></ul></li></ul> |

The following select regions have an increased maximum IOPS and throughput for HDD pay-as-you-go storage accounts only (`StorageV2`):

- East Asia
- Southeast Asia
- Australia East
- Brazil South
- Canada Central
- China East 2
- China North 3
- North Europe
- West Europe
- France Central
- Germany West Central
- Central India
- Japan East
- Jio India West
- Korea Central
- Norway East
- South Africa North
- Sweden Central
- UAE North
- UK South
- Central US
- East US
- East US 2
- US Gov Virginia
- US Gov Arizona
- North Central US
- South Central US
- West US
- West US 2
- West US 3

### Classic file share data plane limits
The following limits apply at the classic file share level. All classic file shares are also subject to the limits of the storage account in which they are deployed:

- **SSD and HDD provisioned v2 storage accounts**: You can't provision more storage, IOPS, or throughput than the storage account supports, however provisioned v2 file shares support credit-based IOPS bursting above the provisioned IOPS on a best-effort basis. If multiple classic file shares in the account burst at the same time, performance is capped a the storage account's IOPS limits.

- **SSD provisioned v1 storage accounts**: You can't provision more storage than the storage account supports, however you can provision more IOPS or throughput than the storage account supports. If the total usage of IOPS or throughput exceeds the storage account's limits, requests are throttled at the storage account level.

- **HDD pay-as-you-go storage accounts**: You can create an unlimited number of classic file shares, each up to 100 TiB but while each classic file share can theoretically consume up to the storage account's limit for IOPS and throughput, if the combined usage of all the resources in the storage account (classic file shares, blob containers, tables, and queues) exceeds those limits, requests are throttled.

| Attribute | SSD provisioned v2 | HDD provisioned v2 | SSD provisioned v1 | HDD pay-as-you-go |
|-|-|-|-|-|
| Storage provisioning unit | 1 GiB | 1 GiB | 1 GiB | N/A |
| IOPS provisioning unit | 1 IO / sec | 1 IO / sec | N/A | N/A |
| Throughput provisioning unit | 1 MiB / sec | 1 MiB / sec | N/A | N/A |
| Minimum storage size  | 32 GiB (provisioned) | 32 GiB (provisioned) | 100 GiB (provisioned) | 0 bytes |
| Maximum storage size | 256 TiB | 256 TiB | 100 TiB | 100 TiB |
| Maximum number of files | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum IOPS (data) | 102,400 IOPS (dependent on provisioning) | 50,000 IOPS (dependent on provisioning) | 102,400 IOPS (dependent on provisioning) | 20,000 IOPS |
| Maximum throughput | 10,340 MiB / sec (dependent on provisioning) | 5,120 MiB / sec (dependent on provisioning) | 10,340 MiB / sec (dependent on provisioning) | Up to storage account limits |
| Maximum metadata IOPS<sup>1</sup> | <ul><li>SMB with metadata caching or NFS: up to 35,000 IOPS</li><li>SMB without metadata caching: up to 12,000 IOPS</li></ul> | Up to 12,000 IOPS | <ul><li>SMB with metadata caching or NFS: up to 35,000 IOPS</li><li>SMB without metadata caching: up to 12,000 IOPS</li></ul> | Up to 12,000 IOPS |
| Maximum filename length<sup>2</sup> (full pathname including all directories, file names, and backslash characters) | 2,048 characters | 2,048 characters | 2,048 characters | 2,048 characters |
| Maximum length of individual pathname component (in the path \A\B\C\D, each letter represents a directory or file that is an individual component) | 255 characters | 255 characters | 255 characters | 255 characters |
| Maximum number of SMB Multichannel channels | 4 | N/A | 4 | N/A |
| Maximum number of stored access policies per file share | 5 | 5 | 5 | 5 |

<sup>1</sup> Metadata operations are operations which manipulate file handles, such as opening a file or folder. The maximum metadata IOPS limit specifies the maximum IOPS that can be used for metadata, regardless of the amount of provisioned IOPS a file share has. SMB shares stored on SSD can scale up to 35,000 IOPS through use of the [metadata caching feature](smb-performance.md#register-for-the-metadata-caching-feature). See [Monitor metadata IOPS](analyze-files-metrics.md#monitor-utilization-by-metadata-iops) for guidance.<br />
<sup>2</sup> Azure Files enforces certain [naming rules](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#directory-and-file-names) for directory and file names.

### Classic file share scale targets for individual files
File scale targets apply to individual files stored in classic file shares. Your ability to reach the limits on an individual file is subject to the limits of the classic file share and of the storage account in which it's contained.

| Attribute | SSD value (includes both provisioned v2 and provisioned v1) | HDD value (includes both provisioned v2 and pay-as-you-go) |
|-|-|-|
| Maximum file size | 4 TiB | 4 TiB |
| Maximum data IOPS per file | 8,000 IOPS | 1,000 IOPS |
| Maximum throughput per file | 1,024 MiB / sec | 60 MiB / sec |
| Hard link limit per file (NFS only) | 178 | N/A |
| Maximum concurrent handles for root directory | 10,000 handles | 10,000 handles |
| Maximum concurrent handles per file and directory | 2,000 handles | 2,000 handles |

\* The maximum number of concurrent handles per file and directory is a soft limit for classic file shares on the SSD media tier using the SMB protocol. If you need to scale beyond this limit, you can [enable metadata caching](smb-performance.md#register-for-the-metadata-caching-feature), and register for [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview).

## File share scale targets (Microsoft.FileShares)
There are two types of limits that apply to file shares:

- Control plane limits, which are enforced by the `Microsoft.FileShares` resource provider and apply to management requests such as creating, updating, or deleting the file share or child resources such as file share snapshots.

- Data plane limits, which are enforced by the Azure storage platform, and apply to things like creating and deleting files and folders via the NFS file sharing protocol.

### Microsoft.FileShares control plane limits
The following limits apply to the file share and to child resources of the file share such as file share snapshots. 

| Attribute | Limit |
|-|-|
| Maximum number of file shares per subscription per region | 1,000 file shares |
| Maximum number of file share snapshots per file share | 200 file share snapshots |
| Management read operations<sup>1</sup> | Maximum of 375 requests per second, refilled at a rate of 37 requests per second |
| Management write operations<sup>1</sup> | Maximum of 300 requests per second, refilled at a rate of 15 requests per second |
| Management delete operations<sup>1</sup> | Maximum of 300 requests per second, refilled at a rate of 15 requests per second |

<sup>1</sup> `Microsoft.FileShares` uses a similar throttling algorithm for management requests as Azure Resource Manager itself uses. API throttling is managed using a [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket). The token bucket represents the maximum number of requests that you can send for each second. When you reach the maximum number of requests, the refill rate determines how quickly new requests are added to the 'bucket'.

### File share data plane targets
The following limits apply at the file share level and are enforced at the data plane. File shares use the provisioned v2 billing model.

| Attribute | SSD value |
|-|-|
| Storage provisioning unit | 1 GiB |
| IOPS provisioning unit | 1 IO / sec |
| Throughput provisioning unit | 1 MiB / sec |
| Minimum provisioned storage size | 32 GiB |
| Minimum provisioned IOPS size | 3000 IOPS |
| Minimum provisioned throughput size | 100 MiB / sec |
| Maximum provisioned storage size | 256 TiB |
| Maximum provisioned IOPS | 102,400 IOPS |
| Maximum provisioned throughput | 10,340 MiB / sec |
| Maximum metadata IOPS <sup>1</sup> | Up to 35,000 IOPS |
| Maximum filename length<sup>2</sup> (full pathname including all directories, file names, and backslash characters) | 2,048 characters |
| Maximum length of individual pathname component (in the path \A\B\C\D, each letter represents a directory or file that is an individual component) | 255 characters |

<sup>1</sup> Metadata operations are operations which manipulate file handles, such as opening a file or folder. The maximum metadata IOPS limit specifies the maximum IOPS that can be used for metadata, regardless of the amount of provisioned IOPS a file share has.

### File share scale targets for individual files
File scale targets apply to individual files stored in a file share. Your ability to reach the limits on an individual file is subject to the limits of the file share.

| Attribute | SSD value |
|-|-|
| Maximum file size | 4 TiB |
| Maximum data IOPS per file | 8,000 IOPS |
| Maximum throughput per file | 1,024 MiB / sec |
| Hard link limit per file | 178 |
| Maximum concurrent handles for root directly | 10,000 handles |
| Maximum concurrent handles per file and directly | 2,000 handles |

## See also
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Understand Azure Files performance](understand-performance.md)
- [Understanding Azure Files billing](understanding-billing.md)
