---
title: Comparison of migration tools in Azure File Migration Program
description: Basic functionality and comparison between migration tools supported by Azure File Migration Program
author: dukicn
ms.author: nikoduki
ms.topic: conceptual
ms.date: 03/24/2022
ms.service: storage
ms.subservice: partner
---

# Comparison Matrix for Azure File Migration Program participants

The following comparison matrix shows basic functionality, and comparison of migration tools that participate in [Azure File Migration Program](https://azure.microsoft.com/blog/migrating-your-files-to-azure-has-never-been-easier/).

## Supported Azure services

|    | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------|
|  **Solution name**  | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **Support provided by**             | [Data Dynamics](https://www.datdynsupport.com/)<sub>1</sub> | [Komprise](https://komprise.freshdesk.com/support/home)<sub>1</sub> |
| **Azure Files support (all tiers)** | Yes            | Yes                            |
| **Azure NetApp Files support**      | Yes            | Yes                            |
| **Azure Blob Hot / Cool support**   | Yes            | Yes                            |
| **Azure Blob Archive tier support** | No             | Yes                            |
| **Azure Data Lake Storage support** | Yes             | Yes                           |
| **Supported Sources**      | Any NAS, and S3 | Any NAS, Cloud File Storage, or S3                 |

## Supported protocols (source / destination)

|    | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **SMB 2.1**       | Yes | Yes |
| **SMB 3.0**       | Yes | Yes |
| **SMB 3.1**       | Yes | Yes |
| **NFS v3**        | Yes | Yes |
| **NFS v4.1**      | No  | Yes |
| **Blob REST API** | Yes | Yes |
| **S3**            | Yes | Yes |

## Extended features

|    | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **UID / SID remapping**                   | Yes | No                             |
| **Protocol ACL remapping**                | No  | No                             |
| **DFS Support**                           | Yes | Yes                            |
| **Throttling support**                    | Yes | Yes                            |
| **File pattern exclusions**               | Yes | Yes                            |
| **Support for selective file attributes** | Yes | Yes                            |
| **Delete propagations**                   | Yes | Yes                            |
| **Follow NTFS junctions**                 | No  | Yes                            |
| **Override SMB Owner and Group Owner**    | Yes | No                             |
| **Chain of custody reporting**            | Yes  | Yes                           |
| **Support for alternate data streams**    | Yes | No                             |
| **Scheduling for migration**              | Yes | Yes                            |
| **Preserving ACL**                        | Yes | Yes                            |
| **DACL support**                          | Yes | Yes                            |
| **SACL support**                          | Yes | No                             |
| **Preserving access time**                | Yes | Yes                            |
| **Preserving modified time**              | Yes | Yes                            |
| **Preserving creation time**              | Yes | Yes                            |
| **Azure Data Box support**                | Yes  | No                            |
| **Migration of snapshots**                | Yes | No                             |
| **Symbolic link support**                 | No  | Yes                            |
| **Hard link support**                     | Yes | Yes                            |
| **Support for open / locked files**       | Yes | Yes                            |
| **Incremental migration**                 | Yes | Yes                            |
| **Switchover support**                    | Yes | No (manual only)               |
| **[Other features](#other-features)**         | [Link](#data-dynamics-data-mobility-and-migration) | [Link](#komprise-elastic-data-migration) |

## Assessment and reporting

|    | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **Capacity**                        | Yes | Yes            |
| **# of files / folders**            | Yes | Yes            |
| **Age distribution over time**      | Yes | Yes            |
| **Access time**                     | Yes | Yes            |
| **Modified time**                   | Yes | Yes            |
| **Creation time**                   | Yes | Yes            |
| **Per file / object report status** | Yes | Yes            |

## Licensing

|    | [Data Dynamics](https://www.datadynamicsinc.com/) | [Komprise](https://www.komprise.com/) |
|--- |---------------------------------------------------|---------------------------------------|
| **Solution name**   | [Data Mobility and Migration](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=PlansAndPrice)      | [Elastic Data Migration](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview​)    |
| **BYOL**             | Yes | Yes |
| **Azure Commitment** | Yes | Yes |

## Other features

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

> [!NOTE]
> List was last verified on February, 21st 2022.

## Next steps

- [Azure File Migration Program](https://www.microsoft.com/en-us/us-partner-blog/2022/02/23/new-azure-file-migration-program-streamlines-unstructured-data-migration/)
- [Storage migration overview](../../../common/storage-migration-overview.md)
- [Choose an Azure solution for data transfer](../../../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json)
- [Migrate to Azure file shares](../../../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../../../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](../../../common/storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](/samples/azure/azreplicate/azreplicate/)

> [!IMPORTANT]
> <sub>1</sub> Support provided by ISV, not Microsoft

