---
title: Comparison of migration tools in Azure Storage Migration Program
description: Basic functionality and comparison between migration tools supported by Azure Storage Migration Program
author: dukicn
ms.author: nikoduki
ms.topic: conceptual
ms.date: 03/24/2022
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Comparison Matrix for Azure Storage Migration Program participants

The following comparison matrix shows basic functionality, and comparison of migration tools that participate in [Azure Storage Migration Program](https://azure.microsoft.com/blog/migrating-your-files-to-azure-has-never-been-easier/).
&nbsp;

## Supported Azure services

|    | [Atempo](https://www.atempo.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Miria](https://www.atempo.com/solutions/miria-migration-for-hybrid-nas-and-file-storages/)|       [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **Support provided by**             | [Atempo](https://www.atempo.com/support-en/contacting-support/)   | Data Dynamics<sub>1</sub> | [Komprise](https://komprise.freshdesk.com/support/home)<sub>1</sub> |
| **Azure Files support (all tiers)** | Yes   | Yes            | Yes                            |
| **Azure NetApp Files support**      | Yes   | Yes            | Yes                            |
| **Azure Blob Hot / Cool support**   | Yes   | Yes            | Yes                            |
| **Azure Blob Archive tier support** | Yes   | No             | Yes                            |
| **Azure Data Lake Storage support** | No   | Yes             | Yes                           |
| **Supported Sources**      | Any NAS, S3, PFS, and Swift   | Any NAS, and S3 | Any NAS, Cloud File Storage, or S3                 |

## Supported protocols (source / destination)

|    | [Atempo](https://www.atempo.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Miria](https://www.atempo.com/solutions/miria-migration-for-hybrid-nas-and-file-storages/)|       [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **SMB 2.1**       | Yes   | Yes | Yes |
| **SMB 3.0**       | Yes   | Yes | Yes |
| **SMB 3.1**       | Yes   | Yes | Yes |
| **NFS v3**        | Yes   | Yes | Yes |
| **NFS v4.1**      | Yes   | Yes | Yes |
| **Blob REST API** | Yes   | Yes | Yes |
| **S3**            | Yes   | Yes | Yes |

## Extended features

|    | [Atempo](https://www.atempo.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Miria](https://www.atempo.com/solutions/miria-migration-for-hybrid-nas-and-file-storages/)|       [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **UID / SID remapping**                   | No  | Yes | No                             |
| **Protocol ACL remapping**                | No  | No  | Yes                            |
| **DFS Support**                           | No  | Yes | Yes                            |
| **Throttling support**                    | Yes | Yes | Yes                            |
| **File pattern exclusions**               | Yes | Yes | Yes                            |
| **Support for selective file attributes** | Yes | Yes | Yes                            |
| **Delete propagations**                   | Yes | Yes | Yes                            |
| **Follow NTFS junctions**                 | Yes | No  | Yes                            |
| **Override SMB Owner and Group Owner**    | Yes | Yes | No                             |
| **Chain of custody reporting**            | Yes | Yes | Yes                            |
| **Support for alternate data streams**    | Yes | Yes | Yes                            |
| **Scheduling for migration**              | Yes | Yes | Yes                            |
| **Preserving ACL**                        | Yes | Yes | Yes                            |
| **DACL support**                          | Yes | Yes | Yes                            |
| **SACL support**                          | Yes | Yes | No                             |
| **Preserving access time**                | Yes | Yes | Yes                            |
| **Preserving modified time**              | Yes | Yes | Yes                            |
| **Preserving creation time**              | Yes | Yes | Yes                            |
| **Azure Data Box support**                | Yes | Yes | Yes                            |
| **Migration of snapshots**                | No  | Yes | Yes                            |
| **Symbolic link support**                 | Yes | No  | Yes                            |
| **Hard link support**                     | Yes | Yes | Yes                            |
| **Support for open / locked files**       | Yes | Yes | Yes                            |
| **Incremental migration**                 | Yes | Yes | Yes                            |
| **Switchover support**                    | Yes | Yes | No (manual only)               |
| **[Other features](#other-features)**         | [Link](#atempo-miria) | [Link](#data-dynamics-data-mobility-and-migration) | [Link](#komprise-elastic-data-migration) |

## Assessment and reporting

|    | [Atempo](https://www.atempo.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Miria](https://www.atempo.com/solutions/miria-migration-for-hybrid-nas-and-file-storages/)|       [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **Capacity**                        | Yes | Yes | Yes            |
| **# of files / folders**            | Yes | Yes | Yes            |
| **Age distribution over time**      | Yes | Yes | Yes            |
| **Access time**                     | Yes | Yes | Yes            |
| **Modified time**                   | Yes | Yes | Yes            |
| **Creation time**                   | Yes | Yes | Yes            |
| **Per file / object report status** | Yes | Yes | Yes            |

## Licensing

|    | [Atempo](https://www.atempo.com/) | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Miria](https://www.atempo.com/solutions/miria-migration-for-hybrid-nas-and-file-storages/)|       [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **BYOL**             | Yes | Yes | Yes |
| **Azure Commitment** | No | Yes | Yes |

## Other features

### Atempo Miria
- Premigration assessment via analytics
- Predefined analysis report by file characteristics (type, size, age, …)
- Built-in integrity check during migration transfer
- Optional integrity check when writing on target - Integrity on target
- Progressive migration cycles via continuous tasks run on -demand or scheduled
- FastScan exclusive technology that detects changes between cycles on leading NAS platforms
- Built-in Progress reporting at task level and project level - Web UI
- Migration can run without stopping source storage production 
- Migration tasks run from Web UI, CLIs, or fully documented REST API
- High scalability: just add another  Data Mover to scale performances 

### Data Dynamics Data Mobility and Migration

- Hash validation
- Project based migrations 
- Migration planning with analytics
- Assessment / reporting: File types, file size, project based
- Assessment / reporting: Custom metadata-based searches
- Simple UI migration management 
- API access to automate large migration jobs 
- Tagging support 
- Support 24 x 7 x 365 
- Hash validation
- OneDrive Migrations
- End to End API support
- NFSv3 POSIX -> v4 ACL migration support
- Symbolic link support (NFS only)
- Bulk policy creation with templates
- Disaster Recovery
- Open Shares / at risk share permissions report
- Duplicate file report 


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


> [!NOTE]
> List was last verified on May 11, 2023


## Next steps

- [Azure Storage Migration Program](https://www.microsoft.com/en-us/us-partner-blog/2022/02/23/new-azure-file-migration-program-streamlines-unstructured-data-migration/)
- [Storage migration overview](../../../common/storage-migration-overview.md)
- [Choose an Azure solution for data transfer](../../../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json)
- [Migrate to Azure file shares](../../../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../../../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](../../../common/storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](/samples/azure/azreplicate/azreplicate/)

> [!IMPORTANT]
> Support provided by ISV, not Microsoft

