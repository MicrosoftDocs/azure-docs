---
title: Migrate Storage from Amazon Web Services (AWS)
description: Concepts, how-tos, best practices for storage from AWS to Azure.
author: chasedmicrosoft
ms.author: doveychase
ms.reviewer: prwilk, chkittel
ms.date: 03/25/2025
ms.topic: conceptual
---

# Migrate storage from Amazon Web Services (AWS)

The articles listed on this page outline scenarios for migrating storage services from Amazon Web Services (AWS) to Azure storage services. Storage services are foundational components of most enterprise workloads and the migration process involves transitioning, with a focus on maintaining feature parity. Examples of storage services include file storage, blob storage, data lakes, virtual machine images, and file shares that store critical data for various purposes. Whether supporting custom applications, AI/ML training processes, business intelligence operations, or commercial off-the-shelf (COTS) solutions, your storage infrastructure requires careful migration planning.

## Component comparison

Start the process by comparing the AWS storage service used in the workload with the closest Azure counterpart. The goal is to identify the most suitable Azure services for your workload.

- [Azure for AWS professionals](/azure/architecture/aws-professional/)
- [Comparing AWS and Azure storage services](/azure/architecture/aws-professional/storage)

> [!NOTE]
> This comparison shouldn't be considered an exact representation of these services' functionality in your workload.

## Migration guides

Refer to these migration guides as examples for framing your migration process.

| Scenario | Key services | Description |
|--|--|--|
| [Copy data from Amazon S3 to Azure Storage by using AzCopy](/azure/storage/common/storage-use-azcopy-s3) | Amazon S3 -> Azure Blob Storage, AzCopy | Demonstrates how to transfer data from S3 to Azure using AzCopy for online transfers. |
| [Use Azure Data Factory to migrate data from Amazon S3 to Azure Storage](/azure/data-factory/data-migration-guidance-s3-azure-storage) | Amazon S3 -> Azure Storage, Azure Data Factory | Covers planning and execution steps for migrating data from S3 to Azure, including operational details. |
| [Migrate data from Amazon S3 to Azure Data Lake Storage Gen2](/azure/data-factory/solution-template-migration-s3-azure) | Amazon S3 -> Azure Storage, Azure Data Factory | Provides a prebuilt approach to help automate your data migration from S3 to Azure Storage. |

## Related workload components

Storage is only one of the components of your workload. Explore other components that are part of the migration process:

- [Compute](./migrate-compute-from-aws.md)
- [Databases and data](./migrate-databases-from-aws.md)
- Identity and access management (IAM)
- Networking
- Messaging and integration
- Security

Use the table of contents to explore other topics related to your workload's architecture.
