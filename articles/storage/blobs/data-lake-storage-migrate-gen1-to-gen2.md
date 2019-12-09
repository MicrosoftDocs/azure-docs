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

:heavy_check_mark: Assess whether to migrate

:heavy_check_mark: Prepare to migrate

:heavy_check_mark: Migrate data

:heavy_check_mark: Update workloads and applications

### Step 1: Assess whether to migrate

:one: Learn about the [Data Lake Storage Gen2 offering](https://azure.microsoft.com/services/storage/data-lake-storage/); it's benefits, costs, and general architecture. 

:two: [Compare the capabilities](#gen1-gen2-feature-comparison) of Data Lake Storage Gen2 with those of Data Lake Storage Gen2. 

:three: Review a list of [known issues](data-lake-storage-known-issues.md) to gauge product state and stability and assess any gaps.

### Step 2: Prepare to migrate

1. Identify the data sets that you'll migrate.

3. Determine the impact that a migration will have on your business.

4. Create a migration plan. We recommend any of these [migration patterns](#migration-patterns).

5. Choose a [data transfer tool](#data-transfer-tools).

### Step 3: Migrate data

1. [Create a storage account](data-lake-storage-quickstart-create-account.md) and enable the hierarchical namespace feature. 

2. Migrate data by using the [data transfer tool](#data-transfer-tool) that you've chosen.

3. Secure the data in the storage account. First, [assign role based access security (RBAC) roles](../common/storage-auth-aad-rbac-portal.md) to security principles in the context of your storage account, resource group, or subscription. 

4. Optionally [apply file and folder level security](data-lake-storage-access-control.m).

   For a complete guide to security, see [Azure Storage security guide](../common/storage-security-guide.md).

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

