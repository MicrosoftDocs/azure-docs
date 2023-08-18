---
title: Azure Storage migration tools comparison - Unstructured data
description: Basic functionality and comparison between tools used for migration of unstructured data
author: dukicn
ms.author: nikoduki
ms.topic: conceptual
ms.date: 02/21/2022
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Comparison matrix

The following comparison matrix shows basic functionality of different tools that can be used for migration of unstructured data.

## Supported Azure services

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [Azure File Sync](../../../file-sync/file-sync-deployment-guide.md) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Miria](https://azuremarketplace.microsoft.com/marketplace/apps/atempo1612274992591.miria_saas_prod?tab=Overview) |
| **Support provided by**                 | Microsoft | [Datadobi](https://support.datadobi.com/s/)<sub>1</sub> | [Data Dynamics](https://www.datdynsupport.com/)<sub>1</sub> | [Komprise](https://komprise.freshdesk.com/support/home)<sub>1</sub> | [Atempo](https://www.atempo.com/support-en/contacting-support/)<sub>1</sub>|
| **Azure Files support (all tiers)** | Yes                          | Yes                      | Yes            | Yes                            | Yes |
| **Azure NetApp Files support**      | No                           | Yes                      | Yes            | Yes                            | Yes |
| **Azure Blob Hot / Cool support**   | No                           | Yes (via NFS         )    | Yes            | Yes                            | Yes |
| **Azure Blob Archive tier support** | No                           | No                       | No             | Yes                             | Yes |
| **Azure Data Lake Storage support** | No                           | No                       | Yes             | Yes                             | No |
| **Supported Sources**      | Windows Server 2012 R2 and up | NAS & cloud file systems | Any NAS, and S3 | Any NAS, Cloud File Storage, or S3                 | Any NAS, S3, PFS, and Swift |

## Supported protocols (source / destination)

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
| **Solution name**   | [Azure File Sync](../../../file-sync/file-sync-deployment-guide.md) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Atempo](https://www.atempo.com/support-en/contacting-support/)|
| **SMB 2.1**       | Yes | Yes | Yes | Yes | Yes |
| **SMB 3.0**       | Yes | Yes | Yes | Yes | Yes |
| **SMB 3.1**       | Yes | Yes | Yes | Yes | Yes |
| **NFS v3**        | No  | Yes | Yes | Yes | Yes |
| **NFS v4.1**      | No  | Yes | No  | Yes | Yes |
| **Blob REST API** | No  | No  | Yes | Yes | Yes |
| **S3**            | No  | Yes | Yes | Yes | Yes |

## Extended features

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
|  **Solution name**  | [Azure File Sync](../../../file-sync/file-sync-deployment-guide.md) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Atempo](https://www.atempo.com/support-en/contacting-support/)|
| **UID / SID remapping**                   | No  | Yes                        | Yes | No                             | No |
| **Protocol ACL remapping**                | No  | No                         | No  | No                             | No |
| **DFS Support**                           | Yes | Yes                        | Yes | Yes                            | No |
| **Throttling support**                    | Yes | Yes                        | Yes | Yes                            | Yes |
| **File pattern exclusions**               | No  | Yes                        | Yes | Yes                              | Yes |
| **Support for selective file attributes** | Yes | Yes                        | Yes | Yes                             | Yes |
| **Delete propagations**                   | Yes | Yes                        | Yes | Yes                            | Yes |
| **Follow NTFS junctions**                 | No  | Yes                        | No  | Yes                            | Yes |
| **Override SMB Owner and Group Owner**    | Yes | Yes                        | Yes | No                             | Yes |
| **Chain of custody reporting**            | No  | Yes                        | Yes  | Yes                            | Yes |
| **Support for alternate data streams**    | No  | Yes                        | Yes | No                             | Yes |
| **Scheduling for migration**              | No  | Yes                        | Yes | Yes                            | Yes |
| **Preserving ACL**                        | Yes | Yes                        | Yes | Yes                            | Yes |
| **DACL support**                          | Yes | Yes                        | Yes | Yes                            | Yes |
| **SACL support**                          | Yes | Yes                        | Yes | No                             | Yes |
| **Preserving access time**                | Yes | Yes                        | Yes | Yes                            | Yes |
| **Preserving modified time**              | Yes | Yes                        | Yes | Yes                            | Yes |
| **Preserving creation time**              | Yes | Yes                        | Yes | Yes                            | Yes |
| **Azure Data Box support**                | Yes | Yes                        | Yes  | No                             | Yes |
| **Migration of snapshots**                | No  | Manual                     | Yes | No                             | No |
| **Symbolic link support**                 | No  | Yes                        | No  | Yes                            | Yes |
| **Hard link support**                     | No  | Migrated as separate files | Yes | Yes                            | Yes |
| **Support for open / locked files**       | Yes | Yes                        | Yes | Yes                            | Yes |
| **Incremental migration**                 | Yes | Yes                        | Yes | Yes                            | Yes |
| **Switchover support**                    | No  | Yes                        | Yes | No (manual only)               | Yes |
| **[Other features](#other-features)**         | [Link](#azure-file-sync)| [Link](#datadobi-dobimigrate) | [Link](#data-dynamics-data-mobility-and-migration) | [Link](#komprise-elastic-data-migration) | [Link](#atempo-miria) |

## Assessment and reporting

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) | [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|---------------------------------------|
| **Solution name**   | [Azure File Sync](../../../file-sync/file-sync-deployment-guide.md) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Atempo](https://www.atempo.com/support-en/contacting-support/)|
| **Capacity**                        | No      | Yes | Yes | Yes            | Yes |
| **# of files / folders**            | No      | Yes | Yes | Yes            | Yes |
| **Age distribution over time**      | No      | Yes | Yes | Yes            | Yes |
| **Access time**                     | No      | Yes | Yes | Yes            | Yes |
| **Modified time**                   | No      | Yes | Yes | Yes            | Yes |
| **Creation time**                   | No      | Yes | Yes | Yes            | Yes |
| **Per file / object report status** | Partial | Yes | Yes | Yes            | Yes |

## Licensing

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |  [Atempo](https://www.atempo.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------| ---------------------------------------|
| **Solution name**   | [Azure File Sync](../../../file-sync/file-sync-deployment-guide.md) | [DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    | [Atempo](https://www.atempo.com/support-en/contacting-support/)|
| **BYOL**             | N / A | Yes | Yes | Yes | Yes |
| **Azure Commitment** | Yes   | Yes | Yes | Yes | No |

## Other features

### Azure File Sync

- Internal hash validation

> [!TIP]
> Azure File Sync can be utilized for migrating data to Azure Files, even if you don't intend to use a hybrid solution for on-premises caching or syncing. This migration process is efficient and causes no downtime. To use Azure File Sync as a migration tool, [simply deploy it](../../../file-sync/file-sync-deployment-guide.md) and, after the migration is finished, [remove the server endpoint](../../../file-sync/file-sync-server-endpoint-delete.md).

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

> [!NOTE]
> List was last verified on February, 21st 2022.

## See also

- [Storage migration overview](../../../common/storage-migration-overview.md)
- [Choose an Azure solution for data transfer](../../../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json)
- [Migrate to Azure file shares](../../../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../../../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](../../../common/storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](/samples/azure/azreplicate/azreplicate/)

> [!IMPORTANT]
> <sub>1</sub> Support provided by ISV, not Microsoft

