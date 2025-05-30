---
title: Migrate Storage from Amazon Web Services (AWS) to Azure
description: Learn about concepts, how-tos, and best practices for migrating storage services from Amazon Web Services (AWS) to Azure.
author: chasedmicrosoft
ms.author: doveychase
ms.reviewer: prwilk, chkittel
ms.date: 03/25/2025
ms.topic: conceptual
ms.collection:
 - migration
 - aws-to-azure
---

# Migrate storage from Amazon Web Services (AWS) to Azure

The articles listed on this page outline scenarios for how to migrate storage services from Amazon Web Services (AWS) to Azure storage services. 

Storage services are foundational components of most enterprise workloads. The migration process moves these services while ensuring that they retain the same capabilities. Examples of storage services include file storage, blob storage, data lakes, virtual machine images, and file shares that store critical data for various purposes. Whether it's to support custom applications, AI/ML training processes, business intelligence operations, or commercial off-the-shelf solutions, your storage infrastructure requires careful migration planning.

## Component comparison

Start the migration process by comparing the AWS storage service that's used in the workload with the closest Azure counterpart. The goal is to identify the most suitable Azure services for your workload. For more information, see [Comparing AWS and Azure storage services](/azure/architecture/aws-professional/storage).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration guides

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
|--|--|--|
| [Copy data from Amazon S3 to Azure Storage by using AzCopy](/azure/storage/common/storage-use-azcopy-s3). | Amazon S3 to Azure Blob Storage | Demonstrates how to migrate data from Amazon S3 to Azure by using AzCopy for online transfers. |
| [Use Azure Data Factory to migrate data from Amazon S3 to Azure Storage](/azure/data-factory/data-migration-guidance-s3-azure-storage). | Amazon S3 to Azure Storage or Data Factory | Covers planning and implementation steps for migrating data from S3 to Azure, including operational details. |
| [Migrate data from Amazon S3 to Azure Data Lake Storage Gen2](/azure/data-factory/solution-template-migration-s3-azure). | Amazon S3 to Azure Storage or Data Factory | Provides a prebuilt approach to help automate your data migration from S3 to Azure Storage. |

## Related workload components

Storage makes up only part of your workload. Explore other components that you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Databases](migrate-databases-from-aws.md)
- [Networking](migrate-networking-from-aws.md)
- [Security](migrate-security-from-aws.md)