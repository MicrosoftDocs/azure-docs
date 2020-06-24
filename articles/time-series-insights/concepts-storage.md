---
title: 'Storage Overview - Azure Time Series Insights | Microsoft Docs'
description: Learn about data storage in Azure Time Series Insights.
author: esung22
ms.author: elsung
manager: diegoviso
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 06/03/2020
ms.custom: seodec18
---

# Data Storage

When you create an Azure Time Series Insights Preview *pay-as-you-go* (PAYG) SKU environment, you create two Azure resources:

* An Azure Time Series Insights Preview environment that can be configured for warm data storage.
* An Azure Storage general-purpose V1 blob account for cold data storage.

Data in your warm store is available only via [Time Series Query](./time-series-insights-update-tsq.md) and the [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md). Your warm store will contain recent data within the [retention period](./time-series-insights-update-plan.md#the-preview-environment) selected when creating the Time Series Insights environment.

Azure Time Series Insights Preview saves your cold store data to Azure Blob storage in the [Parquet file format](#parquet-file-format-and-folder-structure). Time Series Insights Preview manages this cold store data exclusively, but it's available for you to read directly as standard Parquet files.

> [!WARNING]
> As the owner of the Azure Blob storage account where cold store data resides, you have full access to all data in the account. This access includes write and delete permissions. Don't edit or delete the data that Time Series Insights Preview writes, because that can cause data loss.

## Data availability

Azure Time Series Insights Preview partitions and indexes data for optimum query performance. Data becomes available to query from both warm (if enabled) and cold store after it's indexed. The amount of data that's being ingested can affect this availability.

> [!IMPORTANT]
> You might experience a period of up to 60 seconds before data becomes available. If you experience significant latency beyond 60 seconds, please submit a support ticket through the Azure portal.

## Azure Storage

This section describes Azure Storage details relevant to Azure Time Series Insights Preview.

For a thorough description of Azure Blob storage, read the [Storage blobs introduction](../storage/blobs/storage-blobs-introduction.md).

### Your storage account

When you create an Azure Time Series Insights Preview PAYG environment, an Azure Storage general-purpose V1 blob account is created as your long-term cold store.  

Azure Time Series Insights Preview retains up to two copies of each event in your Azure Storage account. One copy stores events ordered by ingestion time, always allowing access to events in a time-ordered sequence. Over time, Time Series Insights Preview also creates a repartitioned copy of the data to optimize for performant Time Series Insights query.

During public Preview, data is stored indefinitely in your Azure Storage account.

#### Writing and editing Time Series Insights blobs

To ensure query performance and data availability, don't edit or delete any blobs that Time Series Insights Preview creates.

#### Accessing Time Series Insights Preview cold store data

In addition to accessing your data from the [Time Series Insights Preview explorer](./time-series-insights-update-explorer.md) and [Time Series Query](./time-series-insights-update-tsq.md), you may also want to access your data directly from the Parquet files stored in the cold store. For example, you can read, transform, and cleanse data in a Jupyter notebook, then use it to train your Azure Machine Learning model in the same Spark workflow.

To access data directly from your Azure Storage account, you need read access to the account used to store your Time Series Insights Preview data. You can then read selected data based on the creation time of the Parquet file located in the `PT=Time` folder described below in the [Parquet file format](#parquet-file-format-and-folder-structure) section.  For more information on enabling read access to your storage account, see [Manage access to your storage account resources](../storage/blobs/storage-manage-access-to-resources.md).

#### Data deletion

Don't delete your Time Series Insights Preview files. Manage related data from within Time Series Insights Preview only.

### Parquet file format and folder structure

Parquet is an open-source columnar file format designed for efficient storage and performance. Time Series Insights Preview uses Parquet to enable Time Series ID-based query performance at scale.  

For more information about the Parquet file type, read the [Parquet documentation](https://parquet.apache.org/documentation/latest/).

Time Series Insights Preview stores copies of your data as follows:

* The first, initial copy is partitioned by ingestion time and stores data roughly in order of arrival. This data resides in the `PT=Time` folder:

  `V=1/PT=Time/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`

* The second, repartitioned copy is grouped by Time Series IDs and resides in the `PT=TsId` folder:

  `V=1/PT=TsId/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`

In both cases, the time property of the Parquet file corresponds to blob creation time. Data in the `PT=Time` folder is preserved with no changes once it's written to the file. Data in the `PT=TsId` folder will be optimized for query over time and is not static.

> [!NOTE]
>
> * `<YYYY>` maps to a four-digit year representation.
> * `<MM>` maps to a two-digit month representation.
> * `<YYYYMMDDHHMMSSfff>` maps to a time-stamp representation with four-digit year (`YYYY`), two-digit month (`MM`), two-digit day (`DD`), two-digit hour (`HH`), two-digit minute (`MM`), two-digit second (`SS`), and three-digit millisecond (`fff`).

Time Series Insights Preview events are mapped to Parquet file contents as follows:

* Each event maps to a single row.
* Every row includes the **timestamp** column with an event time stamp. The time-stamp property is never null. It defaults to the **event enqueued time** if the time-stamp property isn't specified in the event source. The stored time-stamp is always in UTC.
* Every row includes the Time Series ID (TSID) column(s) as defined when the Time Series Insights environment is created. The TSID property name includes the `_string` suffix.
* All other properties sent as telemetry data are mapped to column names that end with `_string` (string), `_bool` (Boolean), `_datetime` (datetime), or `_double` (double), depending on the property type.
* This mapping schema applies to the first version of the file format, referenced as **V=1** and stored in the base folder of the same name. As this feature evolves, this mapping schema might change and the reference name incremented.

## Next steps

* Read about [data modeling](./time-series-insights-update-tsm.md).

* Learn about [data querying](time-series-insights-update-tsq.md)

* Plan your [Azure Time Series Insights Preview environment](./time-series-insights-update-plan.md).