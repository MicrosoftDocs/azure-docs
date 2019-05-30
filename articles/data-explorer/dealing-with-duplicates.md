---
title: Handle duplicate data in Azure Data Explorer
description: This topic will show you various approaches to deal with duplicate data when using Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 12/19/2018

#Customer intent: I want to learn how to deal with duplicate data.
---

# Handle duplicate data in Azure Data Explorer

Devices sending data to the Cloud maintain a local cache of the data. Depending on the data size, the local cache could be storing data for days or even months. You want to safeguard your analytical databases from malfunctioning devices that resend the cached data and cause data duplication in the analytical database. This topic outlines best practices for handling duplicate data for these types of scenarios.

The best solution for data duplication is preventing the duplication. If possible, fix the issue earlier in the data pipeline, which saves costs associated with data movement along the data pipeline and avoids spending resources on coping with duplicate data ingested into the system. However, in situations where the source system can't be modified, there are various ways to deal with this scenario.

## Understand the impact of duplicate data

Monitor the percentage of duplicate data. Once the percentage of duplicate data is discovered, you can analyze the scope of the issue and business impact and choose the appropriate solution.

Sample query to identify the percentage of duplicate records:

```kusto
let _sample = 0.01; // 1% sampling
let _data =
DeviceEventsAll
| where EventDateTime between (datetime('10-01-2018 10:00') .. datetime('10-10-2018 10:00'));
let _totalRecords = toscalar(_data | count);
_data
| where rand()<= _sample
| summarize recordsCount=count() by hash(DeviceId) + hash(EventId) + hash(StationId)  // Use all dimensions that make row unique. Combining hashes can be improved
| summarize duplicateRecords=countif(recordsCount  > 1)
| extend duplicate_percentage = (duplicateRecords / _sample) / _totalRecords  
```

## Solutions for handling duplicate data

### Solution #1: Don't remove duplicate data

Understand your business requirements and tolerance of duplicate data. Some datasets can manage with a certain percentage of duplicate data. If the duplicated data doesn't have major impact, you can ignore its presence. The advantage of not removing the duplicate data is no additional overhead on the ingestion process or query performance.

### Solution #2: Handle duplicate rows during query

Another option is to filter out the duplicate rows in the data during query. The [`arg_max()`](/azure/kusto/query/arg-max-aggfunction) aggregated function can be used to filter out the duplicate records and return the last record based on the timestamp (or another column). The advantage of using this method is faster ingestion since de-duplication occurs during query time. In addition, all records (including duplicates) are available for auditing and troubleshooting. The disadvantage of using the `arg_max` function is the additional query time and load on the CPU every time the data is queried. Depending on the amount of the data being queried, this solution may become non-functional or memory-consuming and will require switching to other options.

In the following example, we query the last record ingested for a set of columns that determine the unique records:

```kusto
DeviceEventsAll
| where EventDateTime > ago(90d)
| summarize hint.strategy=shuffle arg_max(EventDateTime, *) by DeviceId, EventId, StationId
```

This query can also be placed inside a function instead of directly querying the table:

```kusto
.create function DeviceEventsView
{
DeviceEventsAll
| where EventDateTime > ago(90d)
| summarize arg_max(EventDateTime, *) by DeviceId, EventId, StationId
}
```

### Solution #3: Filter duplicates during the ingestion process

Another solution is to filter duplicates during the ingestion process. The system ignores the duplicate data during ingestion into Kusto tables. Data is ingested into a staging table and copied into another table after removing duplicate rows. The advantage of this solution is that query performance improves dramatically as compared to the previous solution. The disadvantages include increased ingestion time and additional data storage costs.

The following example depicts this method:

1. Create another table with the same schema:

    ```kusto
    .create table DeviceEventsUnique (EventDateTime: datetime, DeviceId: int, EventId: int, StationId: int)
    ```

1. Create a function to filter out the duplicate records by anti-joining the new records with the previously ingested ones.

    ```kusto
    .create function RemoveDuplicateDeviceEvents()
    {
    DeviceEventsAll
    | join hint.strategy=broadcast kind = anti
        (
        DeviceEventsUnique
        | where EventDateTime > ago(7d)   // filter the data for certain time frame
        | limit 1000000   //set some limitations (few million records) to avoid choking-up the system during outage recovery

        ) on DeviceId, EventId, StationId
    }
    ```

    > [!NOTE]
    > Joins are CPU-bound operations and add an additional load on the system.

1. Set [Update Policy](/azure/kusto/management/update-policy) on `DeviceEventsUnique` table. The update policy is activated when new data goes into the `DeviceEventsAll` table. The Kusto engine will automatically execute the function as new [extents](/azure/kusto/management/extents-overview) are created. The processing is scoped to the newly created data. The following command stitches the source table (`DeviceEventsAll`), destination table (`DeviceEventsUnique`), and the function `RemoveDuplicatesDeviceEvents` together to create the update policy.

    ```kusto
    .alter table DeviceEventsUnique policy update
    @'[{"IsEnabled": true, "Source": "DeviceEventsAll", "Query": "RemoveDuplicateDeviceEvents()", "IsTransactional": true, "PropagateIngestionProperties": true}]'
    ```

    > [!NOTE]
    > Update policy extends the duration of ingestion since the data is filtered during ingestion and then ingested twice (to the `DeviceEventsAll` table and to the `DeviceEventsUnique` table).

1. (Optional) Set a lower data retention on the `DeviceEventsAll` table to avoid storing copies of the data. Choose the number of days depending on the data volume and the length of time you want to retain data for troubleshooting. You can set it to `0d` days retention to save COGS and improve performance, since the data isn't uploaded to storage.

    ```kusto
    .alter-merge table DeviceEventsAll policy retention softdelete = 1d
    ```

## Summary

Data duplication can be handled in multiple ways. Evaluate the options carefully, taking into account price and performance, to determine the correct method for your business.

## Next steps

> [!div class="nextstepaction"]
> [Write queries for Azure Data Explorer](write-queries.md)
