---
title: Use one-click ingestion to ingest data into Azure Data Explorer
description: Overview of ingesting (loading) data into Azure Data Explorer simply, using one-click ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: overview
ms.date: 03/22/2020
---

# What is one-click ingestion? 

One-click ingestion enables you to quickly ingest a new table in JSON, CSV, and other formats. Using the Azure Data Explorer Web UI, you can ingest data from storage, from a local file, or from a container. The data can be ingested into an existing or new table. The intuitive one-click wizard helps you ingest your data within a few minutes. You can then edit the table and run queries with the Azure Data Explorer Web UI.

One-click ingestion is particularly useful when ingesting data for the first time, or when your data's schema is unfamiliar to you. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Sign in to the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](/azure/data-explorer/web-query-data#add-clusters).

## File formats

One-click ingestion supports ingesting a new table from source data in any of the following formats:
* JSON
* CSV
* TSV
* SCSV
* SOHSV
* TSVE
* PSV

## One-click ingestion wizard

The one-click ingestion wizard guides you through the one-click ingestion process. To access the wizard, right-click the *database* or *table* row in left menu of the Azure Data Explorer web UI and select **Ingest new data (preview)**.

    ![Select one-click ingestion in the Web UI](media/ingest-data-one-click/one-click-ingestion-in-webui.png)   

1. The wizard guides you through the following options:
       * Ingest into an [existing table](one-click-ingestion-existing-table.md)
       * Ingest into [a new table](one-click-ingestion-new-table.md)
       * Ingest data from:
              * Blob storage
              * A local file
              * A container
       * Enter the sample size, from 1 to 10,000 rows (from container only)
       
1. When you have successfully selected the data source, a preview of the data is displayed. You can filter the data so that only files with specific prefixes or file extensions are ingested. For example, you might only want to ingest files with filenames beginning with the word *Europe*, or only files with the extension *.json*. 

1. If you are ingesting data to a specific table, you can map the source columns to the target columns and decide whether or not to include column names.

1. Start the data ingestion process.

> [!Note]
> Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The policy is configured to 5 minutes or 500 MB of data, by default, so you may experience a latency. See [batching policy](/azure/kusto/concepts/batchingpolicy) for aggregation options.

## Next steps

Decide if you will use one-click ingestion to ingest data into an existing or new table:
* Ingest into an [existing table from...](one-click-ingestion-existing-table.md) 
* Ingest into [a new table from...](one-click-ingestion-new-table.md)
* [Query data in Azure Data Explorer Web UI](/azure/data-explorer/web-query-data)
* [Write queries for Azure Data Explorer using Kusto Query Language](/azure/data-explorer/write-queries)