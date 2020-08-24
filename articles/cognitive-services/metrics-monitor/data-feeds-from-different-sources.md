---
title: how to add datafeeds to Metrics Advisor
titleSuffix: Azure Cognitive Services
description: add Datafeeds to Metrics Advisor
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: 
ms.topic: conceptual
ms.date: 07/13/2020
ms.author: aahi
---

# Add data feeds from different data sources to Metrics Advisor

Use this article to find the settings and requirements for connecting different types of data sources to Metrics Advisor. See the [data feeds](adding-data-feeds-overview.md) article for more information.

## Azure Blob Storage (JSON)

* **Connection String**: See the Azure Blob Storage [connection string](https://docs.microsoft.com/azure/storage/common/storage-configure-connection-string#view-and-copy-a-connection-string) article for information on retrieving this string.

* **Container**: Metrics Advisor expects time series data stored as Blob files (one Blob per timestamp) under a single container. This is the container name field.

* **Blob Template**: The is the template of the Blob file names. For example: `/%Y/%m/X_%Y-%m-%d-%h-%M.json`. The following placeholders are supported:
  * %Y=year in format yyyy
  * %m=month in format MM
  * %d=day in format dd
  * %h=hour in format HH
  * %M=minute in format mm

* **JSON format version**: Defines the data schema in the JSON files. Currently Metrics Advisor supports two versions:
  * v1 (Default value)
  Only the metrics *Name* and *Value* are accepted. For example:

  ``` JSON
  {"count":11, "revenue":1.23}
  ```

  * v2
  The metrics *Dimensions* and *timestamp* are also accepted. For example:
  
  ``` JSON
  [
    {"date": "2018-01-01T00:00:00Z", "market":"en-us", "count":11, "revenue":1.23},
    {"date": "2018-01-01T00:00:00Z", "market":"zh-cn", "count":22, "revenue":4.56}
  ]
  ```

Please note that only one timestamp is allowed per JSON file. [TBD]

## Azure Cosmos DB (SQL)

You need to grant Metric Monitor access to your data source by adding the following entity in the Cosmos VC Access Permission box: [TBD]] 

Connection String: Please refer to Get the MongoDB connection string by using the quick start for information on how to retrieve the connection string from Azure Blob Storage. 

Database: This is the database id name field. 

Collection Id: This is the collection/container id name field. 

SQL Query: You could leverage two variables @StartTime and @EndTime, which will be replaced with the “yyyy-MM-ddTHH:mm:ssZ” format string in script. You can construct your query according to SQL Query References. 



* **Connection String**
* **Database**
* **Collection Id**
* **SQL Query**

## Azure Data Explorer (Kusto)

[TBD]

## Azure Event Hubs



### Connection String

This can be found in shared access policies in your Event Hubs instance.

### Consumer Group

A [consumer group](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#consumer-groups) is a view (state, position, or offset) of an entire event hub.
Event Hubs use the latest offset of a consumer group to consume (subscribe from) the data from data source. Therefore a dedicated consumer group should be created for one data feed in your Project "Gualala" instance.

### Timestamp

Project "Gualala" uses the Event Hub timestamp as the event timestamp if the user data source does not contain a timestamp field.
The timestamp field must match one of these two formats:

* "YYYY-MM-DDTHH:MM:SSZ" format;

* Number of seconds or milliseconds from the epoch of 1970-01-01T00:00:00Z.

No matter which timestamp field it left aligns to granularity.For example, if timestamp is "2019-01-01T00:03:00Z", granularity is 5 minutes, then Project "Gualala" aligns the timestamp to "2019-01-01T00:00:00Z". If the event timestamp is "2019-01-01T00:10:00Z",  Project "Gualala" uses the timestamp directly without any alignment.
[TBD]







## Azure Table Storage

* **Connection String**
* **Table Name**
* **Query**
You could leverage two variables @StartTime and @EndTime [TBD]:
@StartTime is replaced with a yyyy-MM-ddTHH:mm:ss format string in script.

``` mssql
let StartDateTime = datetime(@StartTime); let EndDateTime = StartDateTime + 1d; SampleTable | where Timestamp >= StartDateTime and Timestamp < EndDateTime | project Timestamp, Market, RPM
```

[TBD]

## SQL Server | Azure SQL Database

* **Connection String** [String]. We accept an [ADO.NET Style Connection String](https://docs.microsoft.com/dotnet/framework/data/adonet/connection-string-syntax) for sql server data source.

Sample connection string:

```text
Data Source=db-server.database.windows.net:[port];initial catalog=[database];User ID=[username];Password=[password];Connection Timeout=10ms;
```

* **Query** This is SQL query to formulate the multi-dimensional time series data. You could leverage following variables in your query.

  * @StartTimeYear / @EndTimeYear: year in format `yyyy`
  * @StartTimeMonth / @EndTimeMonth: month in format `MM`
  * @StartTimeDay / @EndTimeDay: day in format `dd`
  * @StartDate / @EndDate: date in format `yyyy-MM-dd`
  * @StartTime / @EndTime: datetime in format `yyyy-MM-dd HH:mm:ss`

Sample query:

``` mssql
select StartDate, JobStatusId, COUNT(*) AS JobNumber from IngestionJobs WHERE and StartDate >= @StartTime and StartDate < @EndTime
```

Actual query for data slice of 2019/12/12:

``` mssql
select StartDate, JobStatusId, COUNT(*) AS JobNumber from IngestionJobs WHERE and StartDate >= '2019-12-12 00:00:00' and StartDate < '2019-12-13 00:00:00'
```

## MySQL

[TBD]

## PostgreSQL

[TBD]

## MongoDB

[TBD]

## Next steps
