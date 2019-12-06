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

## Migrate flow

Generally, you'll follow these steps:

> [!div class="checklist"]
> * Assess
> * Prepare
> * Migrate
> * Cutover

### Step 1: Assess

-Learn about the offering. See overview article.
- Understand the gaps and evaluate the readiness to move. 

  See [Gen1 vs Gen2 capabilities](#gen1-gen2-feature-comparison)

### Step 2: Prepare

Identify your data sets to migrate
Evaluate ADLS Gen2 for your scenarios with a PoC
Determine the impact to your business with the migration
Formulate your migration plan. See [Migration patterns](#migration-patterns)
Choose your data movement tool. See [Data transfer tools](#data-transfer-tools)


### Step 3: Migrate

Provision your ADLS Gen2 resources. See [Create an Azure Data Lake Storage Gen2 storage account](data-lake-storage-quickstart-create-account.md)
Configure the ADLS Gen2 environment – VNET, ACLs, RBAC etc.
See these articles:

- article 1
- article 2
- article 3.

Perform the data migration by using the pattern that you chose.

Validate your scenarios on Gen2

Test, test, test.

### Step 4: Cutover

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

## Migration patterns

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

## Data transfer tools

## Get help

Put links to stack tags, yammer groups, etc.

## Next steps

Need a good link here.

