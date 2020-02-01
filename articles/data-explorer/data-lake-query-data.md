---
title: Query data in Azure Data Lake using Azure Data Explorer
description: Learn how to query data in Azure Data Lake using Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin 
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/17/2019
---

# Query data in Azure Data Lake using Azure Data Explorer

Azure Data Lake Storage is a highly scalable and cost-effective data lake solution for big data analytics. It combines the power of a high-performance file system with massive scale and economy to help you speed your time to insight. Data Lake Storage Gen2 extends Azure Blob Storage capabilities and is optimized for analytics workloads.
 
Azure Data Explorer integrates with Azure Blob Storage and Azure Data Lake Storage Gen2, providing fast, cached, and indexed access to data in the lake. You can analyze and query data in the lake without prior ingestion into Azure Data Explorer. You can also query across ingested and uningested native lake data simultaneously.  

> [!TIP]
> The best query performance necessitates data ingestion into Azure Data Explorer. The capability to query data in Azure Data Lake Storage Gen2 without prior ingestion should only be used for historical data or data that is rarely queried. [Optimize your query performance in the lake](#optimize-your-query-performance) for best results.
 

## Create an external table

 > [!NOTE]
 > Currently supported storage accounts are Azure Blob Storage or Azure Data Lake Storage Gen2. Currently supported data formats are json, csv, tsv and txt.

1. Use the `.create external table` command to create an external table in Azure Data Explorer. Additional external table commands such as `.show`, `.drop`, and `.alter` are documented in [External table commands](/azure/kusto/management/externaltables).

    ```Kusto
    .create external table ArchivedProducts(
    Timestamp:datetime,
    ProductId:long, ProductDescription:string) 
    kind=blob
    partition by bin(Timestamp, 1d) 
    dataformat=csv (h@'http://storageaccount.blob.core.windows.net/container1;secretKey') 
    with (compressed = true)  
    ```
    
    > [!NOTE]
    > * Increased performance is expected with more granular partitioning. For example, queries over external tables with daily partitions, will have better performance than those queries with monthly partitioned tables.
    > * When you define an external table with partitions, the storage structure is expected to be identical.
For example, if the table is defined with a DateTime partition in yyyy/MM/dd format (default), the URI storage file path should be *container1/yyyy/MM/dd/all_exported_blobs*. 
    > * If the external table is partitioned by a datetime column, always include a time filter for a closed range in your query (for example, the query - `ArchivedProducts | where Timestamp between (ago(1h) .. 10m)` - should perform better than this (opened range) one - `ArchivedProducts | where Timestamp > ago(1h)` ). 

1. The external table is visible in the left pane of the Web UI

    ![external table in web UI](media/data-lake-query-data/external-tables-web-ui.png)

### Create an external table with json format

You can create an external table with json format. For more information see [External table commands](/azure/kusto/management/externaltables)

1. Use the `.create external table` command to create a table named *ExternalTableJson*:

    ```kusto
    .create external table ExternalTableJson (rownumber:int, rowguid:guid) 
    kind=blob
    dataformat=json
    ( 
       h@'http://storageaccount.blob.core.windows.net/container1;secretKey'
    )
    with 
    (
       docstring = "Docs",
       folder = "ExternalTables",
       namePrefix="Prefix"
    ) 
    ```
 
1. Json format necessitates a second step of creating mapping to columns as shown below. In the following query, create a specific json mapping named *mappingName*:

    ```kusto
    .create external table ExternalTableJson json mapping "mappingName" '[{ "column" : "rownumber", "datatype" : "int", "path" : "$.rownumber"},{ "column" : "rowguid", "path" : "$.rowguid" }]' 
    ```

### External table permissions
 
* The database user can create an external table. The table creator automatically becomes the table administrator.
* The cluster, database, or table administrator can edit an existing table.
* Any database user or reader can query an external table.
 
## Query an external table
 
To query an external table, use the `external_table()` function, and provide the table name as the function argument. The rest of the query is standard Kusto query language.

```Kusto
external_table("ArchivedProducts") | take 100
```

> [!TIP]
> Intellisense isn't currently supported on external table queries.

### Query an external table with json format

To query an external table with json format, use the `external_table()` function, and provide both table name and mapping name as the function arguments. In the query below, if *mappingName* is not specified, a mapping that you previously created will be used.

```kusto
external_table(‘ExternalTableJson’, ‘mappingName’)
```

## Query external and ingested data together

You can query both external tables and ingested data tables within the same query. You [`join`](/azure/kusto/query/joinoperator) or [`union`](/azure/kusto/query/unionoperator) the external table with additional data from Azure Data Explorer, SQL servers, or other sources. Use a [`let( ) statement`](/azure/kusto/query/letstatement) to assign a shorthand name to an external table reference.

In the example below, *Products* is an ingested data table and *ArchivedProducts* is an external table that contains data in the Azure Data Lake Storage Gen2:

```kusto
let T1 = external_table("ArchivedProducts") |  where TimeStamp > ago(100d);
let T = Products; //T is an internal table
T1 | join T on ProductId | take 10
```

## Query *TaxiRides* external table in the help cluster

The *TaxiRides* sample data set contains New York City taxi data from [NYC Taxi and Limousine Commission](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page).

### Create external table *TaxiRides* 

> [!NOTE]
> This section depicts the query used to create the *TaxiRides* external table in the *help* cluster. Since this table has already been created you can skip this section and perform [query *TaxiRides* external table data](#query-taxirides-external-table-data). 

1. The following query was used to create the external table *TaxiRides* in the help cluster. 

    ```kusto
    .create external table TaxiRides
    (
    trip_id: long,
    vendor_id: string, 
    pickup_datetime: datetime,
    dropoff_datetime: datetime,
    store_and_fwd_flag: string,
    rate_code_id: int,
    pickup_longitude: real,
    pickup_latitude: real,
    dropoff_longitude: real,
    dropoff_latitude: real,
    passenger_count: int,
    trip_distance: real,
    fare_amount: real,
    extra: real,
    mta_tax: real,
    tip_amount: real,
    tolls_amount: real,
    ehail_fee: real,
    improvement_surcharge: real,
    total_amount: real,
    payment_type: string,
    trip_type: int,
    pickup: string,
    dropoff: string,
    cab_type: string,
    precipitation: int,
    snow_depth: int,
    snowfall: int,
    max_temperature: int,
    min_temperature: int,
    average_wind_speed: int,
    pickup_nyct2010_gid: int,
    pickup_ctlabel: string,
    pickup_borocode: int,
    pickup_boroname: string,
    pickup_ct2010: string,
    pickup_boroct2010: string,
    pickup_cdeligibil: string,
    pickup_ntacode: string,
    pickup_ntaname: string,
    pickup_puma: string,
    dropoff_nyct2010_gid: int,
    dropoff_ctlabel: string,
    dropoff_borocode: int,
    dropoff_boroname: string,
    dropoff_ct2010: string,
    dropoff_boroct2010: string,
    dropoff_cdeligibil: string,
    dropoff_ntacode: string,
    dropoff_ntaname: string,
    dropoff_puma: string
    )
    kind=blob 
    partition by bin(pickup_datetime, 1d)
    dataformat=csv
    ( 
        h@'http://storageaccount.blob.core.windows.net/container1;secretKey''
    )
    ```
1. The resulting table was created in the *help* cluster:

    ![TaxiRides external table](media/data-lake-query-data/taxirides-external-table.png) 

### Query *TaxiRides* external table data 

Sign in to [https://dataexplorer.azure.com/clusters/help/databases/Samples](https://dataexplorer.azure.com/clusters/help/databases/Samples) to query the *TaxiRides* external table. 

#### Query *TaxiRides* external table without partitioning

[Run this query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx3LSwqAMAwFwL3gHYKreh1xL7F9YrCtElP84OEV9zM4DZo5DsZjhGt6PqWTgL1p6+qhvaTEKjeI/FqyuZbGiwJf63QAi9vEL2UbAhtMEv6jyAH6+VhS9jOr1dULfUgAm2cAAAA=) on the external table *TaxiRides* to depict rides for each day of the week, across the entire data set. 

```kusto
external_table("TaxiRides")
| summarize count() by dayofweek(pickup_datetime)
| render columnchart
```

This query shows the busiest day of the week. Since the data isn't partitioned, this query may take a long time to return results (up to several minutes).

![render non-partitioned query](media/data-lake-query-data/taxirides-no-partition.png)

#### Query TaxiRides external table with partitioning 

[Run this query](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA13NQQqDMBQE0L3gHT6ukkVF3fQepXv5SQYMNWmIP6ilh68WuinM6jHMYBPkyPMobGao5s6bv3mHpdF19aZ1QgYlbx8ljY4F4gPIQFYgkvqJGrr+eun6I5ralv58OP27t5QQOPsXiOyzRFGazE6WzSh7wtnIiA75uISdOEtdfQDLWmP+ogAAAA==) on the external table *TaxiRides* showing taxi cab types (yellow or green) used in January of 2017. 

```kusto
external_table("TaxiRides")
| where pickup_datetime between (datetime(2017-01-01) .. datetime(2017-02-01))
| summarize count() by cab_type
| render piechart
```

This query uses partitioning, which optimizes query time and performance. The query filters on a partitioned column (pickup_datetime) and returns results in a few seconds.

![render partitioned query](media/data-lake-query-data/taxirides-with-partition.png)
  
You can write additional queries to run on the external table *TaxiRides* and learn more about the data. 

## Optimize your query performance

Optimize your query performance in the lake by using the following best practices for querying external data. 
 
### Data format
 
Use a columnar format for analytical queries since:
* Only the columns relevant to a query can be read. 
* Column encoding techniques can reduce data size significantly.  
Azure Data Explorer supports Parquet and ORC columnar formats. Parquet format is suggested due to optimized implementation. 
 
### Azure region 
 
Ascertain that external data resides in the same Azure region as your Azure Data Explorer cluster. This reduces cost and data fetch time.
 
### File size
 
Optimal file size is hundreds of Mb (up to 1 Gb) per file. Avoid many small files that require unneeded overhead, such as slower file enumeration process and limited use of columnar format. Note that the number of files should be greater than the number of CPU cores in your Azure Data Explorer cluster. 
 
### Compression
 
Use compression to reduce the amount of data being fetched from the remote storage. For Parquet format, use the internal Parquet compression mechanism that compresses column groups separately, thus allowing you to read them separately. To validate use of compression mechanism, check that the files are named as follows: “<filename>.gz.parquet” or “<filename>.snappy.parquet” as opposed to “<filename>.parquet.gz”). 
 
### Partitioning
 
Organize your data using "folder" partitions that enables the query to skip irrelevant paths. When planning partitioning consider file size and common filters in your queries such as timestamp or tenant ID.
 
### VM size
 
Select VM SKUs with more cores and higher network throughput (memory is less important). For more information see [Select the correct VM SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md).

## Next steps

Query your data in the Azure Data Lake using Azure Data Explorer. Learn to [write queries](write-queries.md) and derive additional insights from your data.
