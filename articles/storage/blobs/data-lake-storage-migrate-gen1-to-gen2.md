---
title: Migrate Azure Data Lake Storage from Gen1 to Gen2
description: Migrate Azure Data Lake Storage from Gen1 to Gen2.
author: normesta
ms.topic: conceptual
ms.author: normesta
ms.date: 12/05/2019
ms.service: storage
ms.subservice: data-lake-storage-gen2
---

# Migrate Azure Data Lake Storage from Gen1 to Gen2

- This is worth doing. Make an intro statement about the benefit. for more info, see the introduction.
- Statement of how this is not an upgrade. These are separate things. 
- This article lays out the migration flow and contains information that helps you compare Gen1 to Gen2 and pick and implement a pattern that works for your setup.

## Migration road map

If you're considering a migration to Data Lake Storage Gen2, We recommend the following path.

:one: Assess whether to migrate

:two: Prepare to migrate

:three: Migrate data

:four: Update workloads and applications

### Step 1: Assess whether to migrate

At this phase, evaluate Data Lake Storage Gen2 and determine if it will satisfy your scenarios. 

1. Learn about the [Data Lake Storage Gen2 offering](https://azure.microsoft.com/services/storage/data-lake-storage/); it's benefits, costs, and general architecture. 

2. [Compare the capabilities](#gen1-gen2-feature-comparison) of Data Lake Storage Gen2 with those of Data Lake Storage Gen2. 

3. Review a [list of known issues](data-lake-storage-known-issues.md) to gauge product state and stability and assess any gaps.

#### Resources related to this Step

> [!div class="checklist"]
> * [Learn about Azure Data Lake Storage Gen2](https://azure.microsoft.com/services/storage/data-lake-storage/)
> * [Gen1 vs Gen2 capabilities](#gen1-gen2-feature-comparison)
> * [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)


### Step 2: Prepare to migrate

1. Identify the data sets that you'll migrate.

3. Determine the impact that a migration will have on your business.

4. Create a migration plan, and choose a data transfer tool.

|Resources related to this phase|
|--|
|[Migration patterns](#migration-patterns)|
|[Data transfer tools](#data-transfer-tools)|

### Step 3: Migrate data

1. Create a storage account and enable the hierarchical namespace feature. 

   See [Create an Azure Data Lake Storage Gen2 storage account](data-lake-storage-quickstart-create-account.md).

2. Migrate data by using the data transfer tool that you've chosen.

3. Secure the data in the storage account. First, assign role based access security (RBAC) roles to security principles in the context of your storage account, resource group, or subscription. 

   See [Use the Azure portal to assign an RBAC role for access to blob and queue data](../common/storage-auth-aad-rbac-portal.md).

4. Optionally apply file and folder level security.

   See [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)

   For a complete guide to security, see [Azure Storage security guide](../common/storage-security-guide.md)

### Step 4: Update workloads and applications

Update analytics workloads. See the old upgrade article for any guidance that you can get from that.
Update your SDKs from Gen1 to Gen2. See these articles.

- .NET
- Java
- Python
- Powershell
- CLI

Validate end to end scenarios on Gen2.

Decommission your ADLS Gen1 account. How do they do this?

<a id="gen1-gen2-feature-comparison" />

## Gen1 vs Gen2 capabilities

Put table here.

To read about other issues, see [Known issues](data-lake-storage-known-issues.md).

<a id="migration-patterns" />

## Gen1 to Gen2 migration patterns

> [!div class="checklist"]
> * Lift and shift
> * Incremental copy
> * Dual pipeline
> * Bi-directional sync

### Lift and shift

Put something here.

### Incremental copy

Put something here.

### Dual pipeline

Put something here.

### Bi-directional sync

Put something here.

<a id="data-transfer-tools" />

## Gen1 to Gen2 data transfer tools

## Get help

Put links to stack tags, yammer groups, etc.

## Next steps

Need a good link here.

