---
title: Azure Storage migration tools comparison - Unstructured data
description: Basic functionality and comparison between tools used for migration of unstructured data
author: dukicn
ms.author: nikoduki
ms.topic: conceptual
ms.date: 03/31/2021
ms.service: storage
ms.subservice: partner
---

# Comparison matrix

The following comparison matrix shows basic functionality of different tools that can be used for migration of unstructured data. 

## Supported Azure services

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide) | [DobiMigrate](https://azuremarketplace.microsoft.com/marketplace/apps/datadobi1602192408529.datadobi-dobimigrate?tab=Overview)              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Intelligent Data Management](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **Azure Files support (all tiers)** | Yes                          | Yes                      | Yes            | Yes                            |
| **Azure NetApp Files support**      | No                           | Yes                      | Yes            | Yes                            |
| **Azure Blob Hot / Cool support**   | No                           | Yes (via NFS preview)    | Yes            | Yes                            |
| **Azure Blob Archive tier support** | No                           | No                       | No             | Yes (as migration destination) |
| **Azure Data Lake Storage support** | No                           | No                       | No             | No                             |
| **Supported Sources**      | Windows Server 2012 R2 and up | NAS & cloud file systems | Any NAS and S3 | NAS, Blob, S3                  |

## Supported protocols (source / destination)

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide) | [DobiMigrate](https://azuremarketplace.microsoft.com/marketplace/apps/datadobi1602192408529.datadobi-dobimigrate?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Intelligent Data Management](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **SMB 2.1**       | Yes | Yes | Yes | Yes |
| **SMB 3.0**       | Yes | Yes | Yes | Yes |
| **SMB 3.1**       | Yes | Yes | Yes | Yes |
| **NFS v3**        | No  | Yes | Yes | Yes |
| **NFS v4.1**      | No  | Yes | No  | Yes |
| **Blob REST API** | No  | No  | Yes | Yes |
| **S3**            | No  | Yes | Yes | Yes |

## Extended features

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide) | [DobiMigrate](https://azuremarketplace.microsoft.com/marketplace/apps/datadobi1602192408529.datadobi-dobimigrate?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Intelligent Data Management](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **UID / SID remapping**                   | No  | Yes                        | Yes | No                             |
| **Protocol ACL remapping**                | No  | No                         | No  | No                             |
| **DFS Support**                           | Yes | Yes                        | Yes | Yes                            |
| **Throttling support**                    | Yes | Yes                        | Yes | Yes                            |
| **File pattern exclusions**               | No  | Yes                        | Yes | Yes (using copy functionality) |
| **Support for selective file attributes** | Yes | Yes                        | Yes | Yes (for extended attributes)  |
| **Delete propagations**                   | Yes | Yes                        | Yes | Yes                            |
| **Follow NTFS junctions**                 | No  | Yes                        | No  | Yes                            |
| **Override SMB Owner and Group Owner**    | Yes | Yes                        | Yes | No                             |
| **Chain of custody reporting**            | No  | Yes                        | No  | Yes                            |
| **Support for alternate data streams**    | No  | Yes                        | Yes | No                             |
| **Scheduling for migration**              | No  | Yes                        | Yes | Yes                            |
| **Preserving ACL**                        | No  | Yes                        | Yes | Yes                            |
| **DACL support**                          | Yes | Yes                        | Yes | Yes                            |
| **SACL support**                          | Yes | Yes                        | Yes | No                             |
| **Preserving access time**                | Yes | Yes                        | Yes | Yes                            |
| **Preserving modified time**              | Yes | Yes                        | Yes | Yes                            |
| **Preserving creation time**              | No  | Yes                        | Yes | Yes                            |
| **Azure Data Box support**       | Yes | Yes                        | No  | No                             |
| **Migration of snapshots**                | No  | Manual                     | Yes | No                             |
| **Symbolic link support**                 | No  | Yes                        | No  | Yes                            |
| **Hard link support**                     | No  | Migrated as separate files | Yes | Yes                            |
| **Support for open / locked files**       | Yes | Yes                        | Yes | Yes                            |
| **Incremental migration**                 | Yes | Yes                        | Yes | Yes                            |
| **Switchover support**                    | No  | Yes                        | Yes | No (manual only)               |
| **[Other features](#other-features)**         | [Link](#azure-file-sync)| [Link](#dobimigrate) | [Link](#data-mobility-and-migration) | [Link](#intelligent-data-management)                |

## Assessment and reporting

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide) | [DobiMigrate](https://azuremarketplace.microsoft.com/marketplace/apps/datadobi1602192408529.datadobi-dobimigrate?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Intelligent Data Management](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **Capacity**                        | No      | Yes | Yes | Yes            |
| **# of files / folders**            | No      | Yes | Yes | Yes            |
| **Age distribution over time**      | No      | Yes | Yes | Yes            |
| **Access time**                     | No      | Yes | Yes | Yes            |
| **Modified time**                   | No      | Yes | Yes | Yes            |
| **Creation time**                   | No      | Yes | Yes | Yes            |
| **Per file / object report status** | Partial | Yes | Yes | Yes            |

## Licensing

|    | [Microsoft](https://www.microsoft.com/) | [Datadobi](https://www.datadobi.com) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |-----------------------------------------|--------------------------------------|---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide) | [DobiMigrate](https://azuremarketplace.microsoft.com/marketplace/apps/datadobi1602192408529.datadobi-dobimigrate?tab=Overview )              | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Intelligent Data Management](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **BYOL**             | N / A | Yes | Yes | Yes |
| **Azure Commitment** | Yes   | Yes | Yes | Yes |

## Other features

### Azure File Sync

- Internal hash validation

### DobiMigrate

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

### Data Mobility and Migration

- Hash validation

### Intelligent Data Management

- Project/directory based migrations
- Automatic retry of failures
- Assessment / reporting: File types, file size, project based
- Assessment / reporting: Custom metadata-based searches
- Full data lifecycle management solution for archival, replication, analytics
- Access time-based analytics on Blob, S3 data
- Tagging
- Support 24 x 7 x 365
- Hash validation

*List was last verified on March, 31st 2021.*

## See also

- [Storage migration overview](../../../common/storage-migration-overview.md)
- [Choose an Azure solution for data transfer](/azure/storage/common/storage-choose-data-transfer-solution?toc=/azure/storage/blobs/toc.json)
- [Migrate to Azure file shares](/azure/storage/files/storage-files-migration-overview)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](/azure/storage/blobs/migrate-gen2-wandisco-live-data-platform)
- [Copy or move data to Azure Storage with AzCopy](https://aka.ms/azcopy)
- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](https://github.com/Azure/AzReplicate/tree/master/)
