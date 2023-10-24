---
title: Azure Storage migration tools comparison - Unstructured data
description: Basic functionality and comparison between tools used for migration of unstructured data
author: timkresler
ms.author: timkresler
ms.topic: conceptual
ms.date: 08/25/2023
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Comparison matrix

The following comparison matrix shows basic functionality of different tools that can be used for migration of unstructured data.

> [!TIP]
> Azure File Sync can be utilized for migrating data to Azure Files, even if you don't intend to use a hybrid solution for on-premises caching or syncing. This migration process is efficient and causes no downtime. To use Azure File Sync as a migration tool, [simply deploy it](../../../file-sync/file-sync-deployment-guide.md) and, after the migration is finished, [remove the server endpoint](../../../file-sync/file-sync-server-endpoint-delete.md).  Ideally Azure File Sync would be used long-term, while Storage Mover and AzCopy are intended for migration focused activities.

## Overview comparison

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) | [Cirrus Data](https://www.cirrusdata.com/) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Storage Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) | [Migrate Cloud](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cirrusdatasolutionsinc1618222951068.cirrus-migrate-cloud-sponsored-by-azure?tab=Overview)              |
| **Support provided by**                 | Microsoft | Microsoft | [Data Dynamics](https://www.datdynsupport.com/)<sub>1</sub> | [Komprise](https://komprise.freshdesk.com/support/home)<sub>1</sub> | [Atempo](https://www.atempo.com/support-en/contacting-support/)<sub>1</sub>| [Cirrus Data](https://www.cirrusdata.com/global-support-services/)<sub>1</sub> |
| **Assessment** | No | No | Yes | Yes | Yes | Yes |
| **SAN Migration** | No | No | No | No | No | Yes |
| **NFS to Azure Blob** | Yes | Yes | Yes | Yes | Yes | No |
| **NFS to NFS** | No | No | Yes | Yes | Yes | No |
| **SMB to Azure Files** | Yes | Yes | Yes | Yes | Yes | No |
| **SMB to Azure NetApp Files** | No | No | Yes | Yes | Yes | No |
| **Lustre** | No | No | No | No | Yes | No |

> [!TIP]
>  As Cirrus Data specializes in SAN / Block data migrations, we have ommitted them from the remainder of this document.  For more information about Cirrus Data and their Migrate Cloud solution, please review the [Cirrus Data getting Started Guide](/azure/storage/solution-integration/validated-partners/data-management/cirrus-data-migration-guide).

## Supported Azure services

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Storage Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) |
| **Support provided by**                 | Microsoft | Microsoft | [Data Dynamics](https://www.datdynsupport.com/)<sub>1</sub> | [Komprise](https://komprise.freshdesk.com/support/home)<sub>1</sub> | [Atempo](https://www.atempo.com/support-en/contacting-support/)<sub>1</sub>|
| **Azure Files support (all tiers)** | Yes                          | Yes                          | Yes                      | Yes            | Yes                            |
| **Azure NetApp Files support**      | No                           | No                           | Yes                      | Yes            | Yes                            |
| **Azure Blob Hot / Cool support**   | Yes                          | Yes                          | Yes     | Yes            | Yes                            |
| **Azure Blob Archive tier support** | Yes                          | No                           | No                       | Yes             | Yes                             |
| **Azure Data Lake Storage support** | Yes                          | No                           | Yes                       | Yes             | No                             |
| **Supported Sources**      | Any NAS, Azure Blob, Azure Files, Google Cloud Storage, and AWS S3 |  Any SMB/NFS share on servers and NAS devices | Any NAS, and S3 | Any NAS, Cloud File Storage, or S3                 | Any NAS, S3, PFS, and Swift |

## Supported protocols (source / destination)

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Storage Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) |
| **SMB 2.1**       | Source | Yes | Yes | Yes | Yes |
| **SMB 3.0**       | Source | Source | Yes | Yes | Yes |
| **SMB 3.1**       | Source/Destination (Azure Files SMB) | Source/Destination (Azure Files SMB) | Yes | Yes | Yes |
| **NFS v3**        | Source/Destination (Azure Blob NFSv3)  | Source/Destination (Azure Blob NFSv3) | Yes | Yes | Yes |
| **NFS v4.1**      | Source | Source | Yes | No | Yes |
| **Blob REST API** | Yes  | Destination | Yes | Yes | Yes |
| **S3**            | Source | No | Yes | Yes | Yes |
| **Google Cloud Storage** | Source | No | Yes | Yes | Yes |

## Extended features

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Storage Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) |
| **UID / SID remapping**                   | No  | No | Yes | No | No |
| **Protocol ACL remapping**                | No  | No | No  | No  | No |
| **Azure Data Lake Storage Gen2**          | Yes | No | Yes | Yes | No |
| **Throttling support**                    | Yes | No | Yes | No | Yes | 
| **File pattern exclusions**               | Yes | No | Yes | Yes | Yes |
| **Support for selective file attributes** | No  | No | Yes | Yes | Yes |
| **Delete propagations**                   | No  | Yes | Yes | Yes | Yes |
| **Follow NTFS junctions**                 | No  | No | No | Yes | Yes |
| **Override SMB Owner and Group Owner**    | No | No | Yes | No | Yes |
| **Chain of custody reporting**            | No  | No | Yes | Yes | Yes |
| **Support for alternate data streams**    | No  | No | Yes | No | Yes |
| **Scheduling for migration**              | No  | No | Yes | Yes | Yes |
| **Preserving ACL**                        | Yes | Yes | Yes | Yes | Yes |
| **DACL support**                          | Yes | Yes | Yes | Yes | Yes |
| **SACL support**                          | Yes | Yes | Yes | No | Yes |
| **Preserving access time**                | Yes (Azure Files) | Yes | Yes | Yes | Yes |
| **Preserving modified time**              | Yes (Azure Files) | Yes | Yes | Yes | Yes |
| **Preserving creation time**              | Yes (Azure Files) | Yes | Yes | Yes | Yes |
| **Azure Data Box support**                | Yes | Yes | Yes | No | Yes |
| **Migration of snapshots**                | No  | No | Yes | No | No |
| **Symbolic link support**                 | Yes | Yes | No | Yes | Yes |
| **Hard link support**                     | Migrated as separate files | Migrated as separate files |  Yes | Yes | Yes |
| **Support for open / locked files**       | No | No | Yes | Yes | Yes |
| **Incremental migration**                 | Yes | No | Yes | Yes | Yes |
| **Switchover support**                    | No  | No | Yes | No (manual only) | Yes |
| **[Other features](#other-features)**     | [Link](#azcopy)|  | [Link](#data-dynamics-data-mobility-and-migration) | [Link](#komprise-elastic-data-migration) | [Link](#atempo-miria) |

## Assessment and reporting

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Storage Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) |
| **Capacity**                        | No | Reporting | Yes | Yes | Yes |
| **# of files / folders**            | Yes | Reporting | Yes | Yes | Yes |
| **Age distribution over time**      | No | No | Yes | Yes | Yes |
| **Access time**                     | No | No | Yes | Yes | Yes |
| **Modified time**                   | No | No | Yes | Yes | Yes |
| **Creation time**                   | No | No | Yes | Yes | Yes |
| **Per file / object report status** | Yes | Reporting | Yes | Yes | Yes |

## Licensing

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Storage Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) |
| **BYOL**             | Free | Free | Yes | Yes | Yes |
| **Azure Commitment** | Free | Free | Yes | Yes | No |

## Other features

### AzCopy

- Multi-platform support
- Windows 32-bit / 64-bit
- Linux x86-64 and ARM64
- macOS Intel and ARM64
- Benchmarking [azcopy bench](/azure/storage/common/storage-ref-azcopy-bench)
- Supports block blobs, page blobs, and append blobs
- MD5 checks for downloads
- Customizable transfer rate to preserve bandwidth on the client
- Tagging


### Data Dynamics Data Mobility and Migration

- Hash validation

### Komprise Elastic Data Migration

- Project/directory based migrations
- Migration prechecks with analytics
- Migration planning with analytics
- Assessment / reporting: File types, file size, project based
- Assessment / reporting: Custom metadata-based searches
- Simple UI migration management
- API access to automate large migration jobs
- Automatic retry of failures
- Access time-based analytics for Azure Blob Storage, and S3
- Tagging support
- Support 24 x 7 x 365
- In-product support via chat built-in
- Hash validation

### Atempo Miria

- Custom metadata management
- Automation through API
- Petabyte-scale data movements
- Hash validation


> [!NOTE]
> List was last verified on August 24, 2023

## See also

- [Storage migration overview](../../../common/storage-migration-overview.md)
- [Choose an Azure solution for data transfer](../../../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json)
- [Migrate to Azure file shares](../../../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../../../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](../../../common/storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](/samples/azure/azreplicate/azreplicate/)

> [!IMPORTANT]
> <sub>1</sub> Support provided by ISV, not Microsoft

