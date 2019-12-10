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

1. Learn about the [Data Lake Storage Gen2 offering](https://azure.microsoft.com/services/storage/data-lake-storage/); it's benefits, costs, and general architecture. 

2. [Compare the capabilities](#gen1-gen2-feature-comparison) of Data Lake Storage Gen2 with those of Data Lake Storage Gen2. 

3. Review a list of [known issues](data-lake-storage-known-issues.md) to gauge product state and stability and assess any gaps.

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

### Step 4: Update analytic workloads and applications

1. Update analytics workloads. 

2. Update [.NET](data-lake-storage-directory-file-acl-dotnet.md), [Java](data-lake-storage-directory-file-acl-java.md), and [Python](data-lake-storage-directory-file-acl-python.md)-based applications to use the Data Lake Storage Gen2 SDK. 

3. Update REST calls in applications.

4. Update [Azure CLI scripts](data-lake-storage-directory-file-acl-cli.md) to use Data Lake Storage Gen2 commands.

5. Update [PowerShell scripts](data-lake-storage-directory-file-acl-powershell.md) to use Data Lake Storage Gen2 cmdlets. 

<a id="gen1-gen2-feature-comparison" />

## Gen1 vs Gen2 capabilities

This table compares the capabilities of Data Lake Storage Gen1 to that of Gen2.

|Area |Gen1   |Gen2 |
|---|---|---|
|Data organization|Hierarchical namespace<br>File and folder support|Hierarchical namespace<br>File and folder support|
|Geo-redundancy|LRS|LRS, ZRS, GRS, RA-GRS|

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

