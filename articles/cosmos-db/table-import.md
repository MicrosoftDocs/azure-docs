---
title: Migrate existing data to a Table API account in Azure Cosmos DB 
description: Learn how migrate or import on-premises or cloud data to an Azure Table API account in Azure Cosmos DB.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: tutorial
ms.date: 12/07/2017
ms.author: sngun
ms.custom: seodec18
---

# Migrate your data to Azure Cosmos DB Table API account
[!INCLUDE[appliesto-table-api](includes/appliesto-table-api.md)]

This tutorial provides instructions on importing data for use with the Azure Cosmos DB [Table API](table-introduction.md). If you have data stored in Azure Table Storage, you can use either the data migration tool or AzCopy to import your data to Azure Cosmos DB Table API. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Importing data with the data migration tool
> * Importing data with AzCopy

## Prerequisites

* **Increase throughput:** The duration of your data migration depends on the amount of throughput you set up for an individual container or a set of containers. Be sure to increase the throughput for larger data migrations. After you've completed the migration, decrease the throughput to save costs.

* **Create Azure Cosmos DB resources:** Before you start migrating the data, create all your tables from the Azure portal. If you're migrating to an Azure Cosmos DB account that has database-level throughput, make sure to provide a partition key when you create the Azure Cosmos DB tables.

## Data migration tool

You can use the command-line data migration tool (dt.exe) in Azure Cosmos DB to import your existing Azure Table Storage data to a Table API account. 

To migrate table data:

1. Download the migration tool from [GitHub](https://github.com/azure/azure-documentdb-datamigrationtool).
2. Run `dt.exe` by using the command-line arguments for your scenario. `dt.exe` takes a command in the following format:

   ```bash
    dt.exe [/<option>:<value>] /s:<source-name> [/s.<source-option>:<value>] /t:<target-name> [/t.<target-option>:<value>] 
   ```

The supported options for this command are:

* **/ErrorLog:** Optional. Name of the CSV file to redirect data transfer failures.
* **/OverwriteErrorLog:** Optional. Overwrite the error log file.
* **/ProgressUpdateInterval:** Optional, default is `00:00:01`. The time interval to refresh on-screen data transfer progress.
* **/ErrorDetails:** Optional, default is `None`. Specifies that detailed error information should be displayed for the following errors: `None`, `Critical`, or `All`.
* **/EnableCosmosTableLog:** Optional. Direct the log to an Azure Cosmos DB table account. If set, this defaults to the destination account connection string unless `/CosmosTableLogConnectionString` is also provided. This is useful if multiple instances of the tool are being run simultaneously.
* **/CosmosTableLogConnectionString:** Optional. The connection string to direct the log to a remote Azure Cosmos DB table account.

### Command-line source settings

Use the following source options when you define Azure Table Storage as the source of the migration.

* **/s:AzureTable:** Reads data from Table Storage.
* **/s.ConnectionString:** Connection string for the table endpoint. You can retrieve this from the Azure portal.
* **/s.LocationMode:** Optional, default is `PrimaryOnly`. Specifies which location mode to use when connecting to Table Storage: `PrimaryOnly`, `PrimaryThenSecondary`, `SecondaryOnly`, `SecondaryThenPrimary`.
* **/s.Table:** Name of the Azure Table.
* **/s.InternalFields:** Set to `All` for table migration, because `RowKey` and `PartitionKey` are required for import.
* **/s.Filter:** Optional. Filter string to apply.
* **/s.Projection:** Optional. List of columns to select,

To retrieve the source connection string when you import from Table Storage, open the Azure portal. Select **Storage accounts** > **Account** > **Access keys**, and copy the **Connection string**.

:::image type="content" source="./media/table-import/storage-table-access-key.png" alt-text="Screenshot that shows Storage accounts > Account > Access keys options, and highlights the copy icon.":::

### Command-line target settings

Use the following target options when you define Azure Cosmos DB Table API as the target of the migration.

* **/t:TableAPIBulk:** Uploads data into Azure Cosmos DB Table API in batches.
* **/t.ConnectionString:** The connection string for the table endpoint.
* **/t.TableName:** Specifies the name of the table to write to.
* **/t.Overwrite:** Optional, default is `false`. Specifies if existing values should be overwritten.
* **/t.MaxInputBufferSize:** Optional, default is `1GB`. Approximate estimate of input bytes to buffer before flushing data to sink.
* **/t.Throughput:** Optional, service defaults if not specified. Specifies throughput to configure for table.
* **/t.MaxBatchSize:** Optional, default is `2MB`. Specify the batch size in bytes.

### Sample command: Source is Table Storage

Here's a command-line sample showing how to import from Table Storage to Table API:

```bash
dt /s:AzureTable /s.ConnectionString:DefaultEndpointsProtocol=https;AccountName=<Azure Table storage account name>;AccountKey=<Account Key>;EndpointSuffix=core.windows.net /s.Table:<Table name> /t:TableAPIBulk /t.ConnectionString:DefaultEndpointsProtocol=https;AccountName=<Azure Cosmos DB account name>;AccountKey=<Azure Cosmos DB account key>;TableEndpoint=https://<Account name>.table.cosmosdb.azure.com:443 /t.TableName:<Table name> /t.Overwrite
```

## Migrate data by using AzCopy

You can also use the AzCopy command-line utility to migrate data from Table Storage to the Azure Cosmos DB Table API. To use AzCopy, you first export your data as described in [Export data from Table storage](/previous-versions/azure/storage/storage-use-azcopy#export-data-from-table-storage). Then, you import the data to Azure Cosmos DB as described in [Azure Cosmos DB Table API](/previous-versions/azure/storage/storage-use-azcopy#import-data-into-table-storage).

Refer to the following sample when you're importing into Azure Cosmos DB. Note that the `/Dest` value uses `cosmosdb`, not `core`.

Example import command:

```bash
AzCopy /Source:C:\myfolder\ /Dest:https://myaccount.table.cosmosdb.windows.net/mytable1/ /DestKey:key /Manifest:"myaccount_mytable_20140103T112020.manifest" /EntityOperation:InsertOrReplace
```

## Next steps

Learn how to query data by using the Azure Cosmos DB Table API. 

> [!div class="nextstepaction"]
>[How to query data?](../cosmos-db/tutorial-query-table.md)




