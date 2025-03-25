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

Storage services are foundational components of most enterprise workloads. These include file storage, blob storage, data lakes, virtual machine images, and file shares that store critical data for various purposes. Whether supporting custom applications, AI/ML training processes, business intelligence operations, or commercial off-the-shelf (COTS) solutions, your storage infrastructure requires careful migration planning. Microsoft Azure provides comprehensive guidance to help you successfully migrate workloads that depend on these essential data storage and security components.

## Component comparison

Start the process by getting familiar with [Azure for AWS professionals](/azure/architecture/aws-professional/) and then begin by [Comparing AWS and Azure storage services](/azure/architecture/aws-professional/storage). The goal is to identify the most suitable Azure services for your workload.

> [!NOTE]
> This comparison shouldn't be considered an exact representation of these services' functionality in your workload.

## Migration guides

Refer to these migration guides as examples for framing your migration process.

| Scenario | Key services | Description |
|--|--|--|
| [Use AzCopy to move data from AWS S3 to Azure Storage](/azure/storage/common/storage-use-azcopy-s3) | Amazon S3 -> Azure Blob Storage, AzCopy | Demonstrates how to transfer data from S3 to Azure using AzCopy. |
| [Data Factory guidance for migrating S3 to Azure Storage](/azure/data-factory/data-migration-guidance-s3-azure-storage) | Amazon S3 -> Azure Storage, Azure Data Factory | Covers planning and execution steps for migrating data from S3 to Azure, including operational details. |
| [Move your data from AWS S3 to Azure Storage using AzCopy](https://azure.microsoft.com/blog/move-your-data-from-aws-s3-to-azure-storage-using-azcopy/) | Amazon S3 -> Azure Storage, AzCopy | Showcases best practices and tips for transferring data from S3 to Azure Storage using AzCopy. |
| [Solution template for migrating S3 to Azure Storage](/azure/data-factory/solution-template-migration-s3-azure) | Amazon S3 -> Azure Storage, Azure Data Factory | Provides a prebuilt approach to help automate your data migration from S3 to Azure Storage. |

## Related workload components

Storage is only one of the components of your workload. Explore other components that are part of the migration process:

- [Compute](./migrate-compute-from-aws.md)
- [Databases and data](./migrate-databases-from-aws.md)
- Identity and access management (IAM)
- Networking
- Messaging and integration
- Security

Use the table of contents to explore other topics related to your workload's architecture.
