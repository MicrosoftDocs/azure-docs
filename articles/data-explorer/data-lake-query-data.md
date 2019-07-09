---
title: Query data in Azure Data Lake using Azure Data Explorer
description: Learn how to query data in Azure Data Lake using Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin 
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/25/2019
---

# Query data in Azure Data Lake using Azure Data Explorer (Preview)

Azure Data Lake Storage is a highly scalable and cost-effective data lake solution for big data analytics. It combines the power of a high-performance file system with massive scale and economy to help you speed your time to insight. Data Lake Storage Gen2 extends Azure Blob Storage capabilities and is optimized for analytics workloads.
 
Azure Data Explorer integrates with Azure Blob Storage and Azure Data Lake Storage Gen2, providing fast, cached, and indexed access to data in the lake. You can analyze and query data in the lake without prior ingestion into Azure Data Explorer. You can also query across ingested and uningested native lake data simultaneously.  

> [!TIP]
> The best query performance necessitates data ingestion into Azure Data Explorer. The capability to query data in Azure Data Lake Storage Gen2 without prior ingestion should only be used for historical data or data that is rarely queried.
 
## Optimize query performance in the lake 

* Partition data for improved performance and optimized query time.
* Compress data for improved performance (gzip for best compression, lz4 for best performance).
* Use Azure Blob Storage or Azure Data Lake Storage Gen2 with the same region as your Azure Data Explorer cluster. 

## Create an external table

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

    This query creates daily partitions *container1/yyyy/MM/dd/all_exported_blobs.csv*. Increased performance is expected with more granular partitioning. For example, queries over external tables with daily partitions, such as the one above, will have better performance than those queries with monthly partitioned tables.

    > [!NOTE]
    > Currently supported storage accounts are Azure Blob Storage or Azure Data Lake Storage Gen2. Currently supported data formats are csv, tsv and txt.

1. The external table is visible in the left pane of the Web UI

    ![external table in web UI](media/data-lake-query-data/external-tables-web-ui.png)
 
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
    h@'https://externalkustosamples.blob.core.windows.net/taxiridesbyday?st=2019-06-18T14%3A59%3A00Z&se=2029-06-19T14%3A59%3A00Z&sp=rl&sv=2016-05-31&sr=c&sig=yEaO%2BrzFHzAq7lvd4d9PeQ%2BTi3AWnho8Rn8hGU0X30M%3D'
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

## Next steps

Query your data in the Azure Data Lake using Azure Data Explorer. Learn to [write queries](write-queries.md) and derive additional insights from your data.