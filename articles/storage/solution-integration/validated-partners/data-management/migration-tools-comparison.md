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

## Supported Azure services

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) | [Datadobi](https://www.datadobi.com) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)              |
| **Support provided by**                 | Microsoft | Microsoft | [Data Dynamics](https://www.datdynsupport.com/)<sub>1</sub> | [Komprise](https://komprise.freshdesk.com/support/home)<sub>1</sub> | [Atempo](https://www.atempo.com/support-en/contacting-support/)<sub>1</sub>| [Datadobi](https://support.datadobi.com/s/)<sub>1</sub> |
| **Azure Files support (all tiers)** | Yes                          | Yes                          | Yes                      | Yes            | Yes                            | Yes |
| **Azure NetApp Files support**      | No                           | No                           | Yes                      | Yes            | Yes                            | Yes |
| **Azure Blob Hot / Cool support**   | Yes                          | Yes                          | Yes     | Yes            | Yes                            | Yes (via NFS) |
| **Azure Blob Archive tier support** | Yes                          | Yes                          | No                       | Yes             | Yes                             | No |
| **Azure Data Lake Storage support** | Yes                          | No                           | Yes                       | Yes             | No                             | No |
| **Supported Sources**      | Any NAS, Azure Blob, Azure Files, Google Cloud Storage, and AWS S3 |  NAS & cloud file systems | Any NAS, and S3 | Any NAS, Cloud File Storage, or S3                 | Any NAS, S3, PFS, and Swift | NAS & cloud file systems |

## Supported protocols (source / destination)

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) | [Datadobi](https://www.datadobi.com) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)              |
| **SMB 2.1**       | Source | Source | Yes | Yes | Yes | Yes |
| **SMB 3.0**       | Source | Source | Yes | Yes | Yes | Yes |
| **SMB 3.1**       | Source/Destination (Azure Files SMB) | Source/Destination (Azure Files SMB) | Yes | Yes | Yes | Yes |
| **NFS v3**        | Source/Destination (Azure Blob NFSv3)  | Source/Destination (Azure Blob NFSv3) | Yes | Yes | Yes | Yes |
| **NFS v4.1**      | Source | Source | Yes | No | Yes | Yes |
| **Blob REST API** | Yes  | Destination | Yes | Yes | Yes | No |
| **S3**            | Source | No | Yes | Yes | Yes | Yes |
| **Google Cloud Storage** | Source | No | Yes | Yes | Yes | Yes |

## Extended features

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) | [Datadobi](https://www.datadobi.com) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)              |
| **UID / SID remapping**                   | No  | No | Yes | No | No | Yes |
| **Protocol ACL remapping**                | No  | No | No  | No  | No | No |
| **Azure Data Lake Storage Gen2**          | Yes | No | Yes | Yes | No | Yes |
| **Throttling support**                    | Yes | No | Yes | Yes | Yes | Yes |
| **File pattern exclusions**               | Yes | No | Yes | Yes | Yes | Yes |
| **Support for selective file attributes** | No  | No | Yes | Yes | Yes | Yes |
| **Delete propagations**                   | No  | No | Yes | Yes | Yes | Yes |
| **Follow NTFS junctions**                 | No  | No | No | Yes | Yes | Yes |
| **Override SMB Owner and Group Owner**    | No | No | Yes | No | Yes | Yes |
| **Chain of custody reporting**            | No  | No | Yes | Yes | Yes | Yes |
| **Support for alternate data streams**    | No  | No | Yes | No | Yes | Yes |
| **Scheduling for migration**              | No  | No | Yes | Yes | Yes | Yes |
| **Preserving ACL**                        | Yes | Yes | Yes | Yes | Yes | Yes |
| **DACL support**                          | Yes | Yes | Yes | Yes | Yes | Yes |
| **SACL support**                          | Yes | Yes | Yes | No | Yes | Yes |
| **Preserving access time**                | Yes (Azure Files) | Yes | Yes | Yes | Yes | Yes |
| **Preserving modified time**              | Yes (Azure Files) | Yes | Yes | Yes | Yes | Yes |
| **Preserving creation time**              | Yes (Azure Files) | Yes | Yes | Yes | Yes | Yes |
| **Azure Data Box support**                | Yes | No | Yes | No | Yes | Yes |
| **Migration of snapshots**                | No  | No | Yes | No | No | Manual |
| **Symbolic link support**                 | Yes | Yes | No | Yes | Yes | Yes |
| **Hard link support**                     | Migrated as separate files | Migrated as separate files |  Yes | Yes | Yes | Migrated as separate files |
| **Support for open / locked files**       | No | No | Yes | Yes | Yes | Yes |
| **Incremental migration**                 | Yes | No | Yes | Yes | Yes | Yes |
| **Switchover support**                    | No  | No | Yes | No (manual only) | Yes | Yes |
| **[Other features](#other-features)**     | [Link](#azcopy)|  | [Link](#data-dynamics-data-mobility-and-migration) | [Link](#komprise-elastic-data-migration) | [Link](#atempo-miria) | [Link](#datadobi-dobimigrate) |

## Assessment and reporting

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) | [Datadobi](https://www.datadobi.com) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)              |
| **Capacity**                        | No | Reporting | Yes | Yes | Yes | Yes |
| **# of files / folders**            | Yes | Reporting | Yes | Yes | Yes | Yes |
| **Age distribution over time**      | No | No | Yes | Yes | Yes | Yes |
| **Access time**                     | No | No | Yes | Yes | Yes | Yes |
| **Modified time**                   | No | No | Yes | Yes | Yes | Yes |
| **Creation time**                   | No | No | Yes | Yes | Yes | Yes |
| **Per file / object report status** | Yes | Reporting | Yes | Yes | Yes | Yes |

## Licensing

|    | [Microsoft](https://www.microsoft.com/) | [Microsoft](https://www.microsoft.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) | [Datadobi](https://www.datadobi.com) |
|--- |-----------------------------------------|-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [AzCopy](/azure/storage/common/storage-ref-azcopy-copy) | [Azure Mover](/azure/storage-mover/) | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)              |
| **BYOL**             | N / A | N / A | Yes | Yes | Yes | Yes |
| **Azure Commitment** | N / A | Yes   | Yes | Yes | No | Yes |

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
- Migration pre-checks with analytics
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

### Datadobi DobiMigrate

- Migration pre checks
- Migration Planning
- Dry Run for cut over testing
- Detect and alert on target side user activity prior to cut over
- Policy driven migrations
- Scheduled copy iterations
- Configurable options for handling root directory security
- On-demand verification runs
- Data read back verification on source and destination
- Graphical, interactive error handling workflow
- Ability to restrict certain operations from propagating like deletes and updates
- Ability to preserve access time on the source (in addition to destination)
- Ability to execute rollback to source during migration switchover
- Ability to migrate selected SMB file attributes
- Ability to clean NTFS security descriptors
- Ability to override NFSv3 permissions and write new mode bits to target
- Ability to convert NFSv3 POSIX draft ACLS to NFSv4 ACLS
- SMB 1 (CIFS)
- Browser-based access
- REST API support for configuration, and migration management
- Support 24 x 7 x 365

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

