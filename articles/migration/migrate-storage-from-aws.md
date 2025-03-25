---
title: Migrate Storage from Amazon Web Services (AWS)
description: Concepts, how-tos, best practices for storage from AWS to Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Migrate storage from Amazon Web Services (AWS)

Storage services are foundational components of most enterprise workloads. These include file storage, blob storage, data lakes, virtual machine images, and file shares that store critical data for various purposes. Whether supporting custom applications, AI/ML training processes, business intelligence operations, or commercial off-the-shelf (COTS) solutions, your storage infrastructure requires careful migration planning. Microsoft Azure provides comprehensive guidance to help you successfully migrate workloads that depend on these essential data storage and security components.

## Azure service awareness

If you haven't worked with Azure before, please review the [Azure for AWS professionals guide](/azure/architecture/aws-professional/), which introduces you to the basics of Azure and provides information on similarities and differences between AWS and Azure. Additionally, you can review the [Azure storage services map](/azure/architecture/aws-professional/storage) for a comparison of storage services between the two cloud providers.

## Scenarios and component guides

Microsoft publishes guidance for select services to help architects, developers, and database administrators plan their migration efforts. Use these guides, combined with guidance available for your other components, to assess, plan, and perform your migration.

Azure Storage services provide capacity to store, manage, and secure data for various applications and solutions. When you migrate from AWS Storage to Azure Storage, you retain essential capabilities while moving data to a new platform that aligns with your business needs. The scenarios covered here focus on subtypes such as object storage, file shares, and data lakes. For example, a typical migration might involve moving AWS S3 to Azure Blob Storage.

## Component comparison

The first step in the migration process is to conduct a comparison exercise, matching AWS storage services in your workload to their closest Azure counterparts. This helps identify the most suitable Azure services for your migration needs.

### Storage services comparison

| AWS Storage Service | Azure Storage Service | Description |
|--|--|--|
| Amazon S3 | Azure Blob Storage | Object storage for unstructured data like documents, images, and videos |
| Amazon EFS | Azure Files | Fully managed file storage for cloud and on-premises deployments |
| Amazon EBS | Azure Managed Disks | Block-level storage volumes for EC2/VM instances |

## Migration scenarios

Refer to these scenarios as examples for framing your migration process.

| Scenario | Key services | Description |
|--|--|--|
| [Use AzCopy to move data from AWS S3 to Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-s3) | AWS S3, Azure Blob Storage, AzCopy | Demonstrates how to transfer data from S3 to Azure using AzCopy. |
| [Data Factory guidance for migrating S3 to Azure Storage](https://learn.microsoft.com/en-us/azure/data-factory/data-migration-guidance-s3-azure-storage) | AWS S3, Azure Storage, Azure Data Factory | Covers planning and execution steps for migrating data from S3 to Azure, including operational details. |
| [Move your data from AWS S3 to Azure Storage using AzCopy](https://azure.microsoft.com/en-us/blog/move-your-data-from-aws-s3-to-azure-storage-using-azcopy/) | AWS S3, Azure Storage, AzCopy | Showcases best practices and tips for transferring data from S3 to Azure Storage using AzCopy. |
| [Solution template for migrating S3 to Azure Storage](https://learn.microsoft.com/en-us/azure/data-factory/solution-template-migration-s3-azure) | AWS S3, Azure Storage, Azure Data Factory solution template | Provides a prebuilt approach to help automate your data migration from S3 to Azure Storage. |
| [Migrate Amazon EFS to Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-migration-overview) | Amazon EFS, Azure Files, Azure File Sync | Guidelines for migrating file shares from Amazon EFS to Azure Files. |
| [Move Amazon EBS volumes to Azure Managed Disks](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell) | Amazon EBS, Azure Managed Disks | Process for converting and uploading Amazon EBS volumes to Azure Managed Disks. |

## Migration considerations and best practices

When migrating storage from AWS to Azure, consider these key factors:

- **Data evaluation**: Assess your data characteristics (size, access patterns, sensitivity) before migration
- **Networking costs**: Plan for potential egress charges when moving data between clouds
- **Security and compliance**: Ensure data remains compliant with regulatory requirements during and after migration
- **Access control**: Map AWS IAM policies to equivalent Azure RBAC roles and Azure AD identities
- **Performance testing**: Validate performance in Azure against your workload requirements
- **Incremental migration**: Consider migrating data in phases to minimize business disruption

## Post-migration validation

After completing your storage migration:

1. Verify data integrity using checksums or validation tools
2. Test application functionality with the new Azure storage endpoints
3. Monitor performance metrics to ensure they meet expectations
4. Update documentation and operational procedures for the new environment
5. Configure appropriate backup and disaster recovery solutions

## Related workload components

Your workload contains other components as well that will need to migrate with your compute. Microsoft has similar guidance for:

- [Compute](./migrate-compute-from-aws.md)
- [Databases and data](./migrate-databases-from-aws.md)
- Identity and access management (IAM)
- Networking
- Messaging and integration
- Security

Use the table of contents to explore other topics related to your workload's architecture.
