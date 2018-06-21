---
title: Azure Data Lake Storage Migration planning article
description: Planning a migration to Data Lake Storage
services: storage
keywords: 
author: roygara
ms.topic: article
ms.author: rogarana
manager: twooley
ms.date: 06/01/2018
ms.service: storage
ms.component: data-lake-storage-gen2
---

# Migration planning

The ease of a migration depends on a variety of factors, including the complexity of your app, the volume of data, cross-regional migration, mode of migration (live, one time migration, continuous, etc.), ACLs, associated data such as metastores, and post migration setup.

>[!IMPORTANT]
> We must emphasize that while you are welcome to begin evaluating and planning a migration now, we **do not** recommend actually migrating now. Azure Data Lake Storage Gen2 is still a preview service.

For an initial evaluation, we recommend copying some data into Azure Data Lake Storage Gen2 so you can get a good sense of it but, before you do that, there are some things that you should consider. Chief among them being the pattern you follow when migrating.

## Migration Patterns

There are two main patterns, which we will discuss here, bulk load and active / active replication.

### Bulk load

Typically copying large amounts of data from source to destination will cost a large amount of time, and so you would do it in two stages. A Bulk (or full) load and then an incremental copy. First (the bulk load), copy all the data out of source into destination, settings some sort of marker for the last data copied. Then (incremental copy), copy all the new data after the bulk load.

The incremental copy can be done via a scheduled job, which migrates the incremental copy on a regular cycle, continuously catching up in a batch window. If you already have a data pipeline, then the *Dual Channel* mode can be leveraged. This mode will continuously catchup the data being ingested while the catchup happens for the initial load.

There is also an enhanced incremental copy approach that you could take. It's supported by third-party tools and allows active / active replication where the data ingested to the source system also replicated to destination. When leveraging this kind of mode, you must understand the downstream consumption of the data at the destination end. For instance, if the data is loaded to a data warehouse for reporting and if the reporting had historical data dependencies, errors may be introduced by using this pattern.

If you intend on migrating an application over you typically stop accepting writes to the source system after the bulk load. After which you update the app to point at the new store once the incremental copy has completed. This will involve some app downtime.

### Active / active replication

If you want to avoid downtime and you have some ability to keep source and destination systems in sync, then you can synchronize your datasets and begin moving apps one at a time.

When doing an evaluation using active / active replication - it might make sense to initially set the solution to be a one-way replication. Just to ensure that the test environment doesn't get replicated to the source environment. When you are ready to go live then you can set the replication to be two ways and begin moving apps over.
 
* Dual Channel - if you have a framework like Azure Data Factory in front of your source systems then you can modify it to write to two different channels. One channel pointing to the old system and one pointing to the new system. After that you can start testing your app in the second system.

This setup may require bulk load in order to initialize the data. we recommend designing what a migration might look like for you. Microsoft will offer a broad range of tooling, support, and guidance but you should begin thinking what the migration effort would look like.

Additionally, if you are using Azure Data Factory, you may only need to replace the connector from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2. This would only be available if Azure Data Factory was already in use.

## Next step

If you're ready to move a small amount of data over, proceed to the copying some data into Azure Data Lake Storage article.