---
title: How to add data feeds from different sources to Metrics Advisor
titleSuffix: Azure Cognitive Services
description: add different data feeds to Metrics Advisor
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: conceptual
ms.date: 10/12/2020
ms.author: mbullwin
---

# How-to: Connect different data feed sources

Use this article to find the settings and requirements for connecting different types of data sources to Metrics Advisor. Make sure to read how to [Onboard your data](how-tos/onboard-your-data.md) to learn about the key concepts for using your data with Metrics Advisor. 

## Supported authentication types

| Authentication types | Description |
| ---------------------|-------------|
|**Basic** | You will need to be able to provide basic parameters for accessing data sources. For example a connection string or key. Data feed admins are able to view these credentials. |
| **AzureManagedIdentity** | [Managed identities](../../active-directory/managed-identities-azure-resources/overview.md) for Azure resources is a feature of Azure Active Directory. It provides Azure services with an automatically managed identity in Azure AD. You can use the identity to authenticate to any service that supports Azure AD authentication.|
| **AzureSQLConnectionString**| Store your AzureSQL connection string as a **credential entity** in Metrics Advisor, and use it directly each time when onboarding metrics data. Only admins of the Credential entity are able to view these credentials, but enables authorized viewers to create data feeds without needing to know details for the credentials. |
| **DataLakeGen2SharedKey**| Store your data lake account key as a **credential entity** in Metrics Advisor and use it directly each time when onboarding metrics data. Only admins of the Credential entity are able to view these credentials, but enables authorized viewers to create data feed without needing to know the credential details.|
| **Service principal**| Store your service principal as a **credential entity** in Metrics Advisor and use it directly each time when onboarding metrics data. Only admins of Credential entity are able to view the credentials, but enables authorized viewers to create data feed without needing to know the credential details.|
| **Service principal from key vault**|Store your service principal in a key vault as a **credential entity** in Metrics Advisor and use it directly each time when onboarding metrics data. Only admins of a **credential entity** are able to view the credentials, but also leave viewers able to create data feed without needing to know detailed credentials. |

## Data sources supported and corresponding authentication types


| Data sources | Authentication Types |
|-------------| ---------------------|
|[**Azure Application Insights**](#appinsights)|  Basic |
|[**Azure Blob Storage (JSON)**](#blob) | Basic<br>ManagedIdentity|
|[**Azure Cosmos DB (SQL)**](#cosmosdb) | Basic |
|[**Azure Data Explorer (Kusto)**](#kusto) | Basic<br>ManagedIdentity<br>Service principal from key vault<br>Service principal|
|[**Azure Data Lake Storage Gen2**](#adl) | Basic<br>DataLakeGen2SharedKey<br>Service principal<br>Service principal from key vault<br> |
|[**Azure SQL Database / SQL Server**](#sql) | Basic<br>ManagedIdentity<br>Service principal<br>Service principal from key vault<br>AzureSQLConnectionString
|[**Azure Table Storage**](#table) | Basic | 
|[**ElasticSearch**](#es) | Basic |
|[**Http request**](#http) | Basic | 
|[**InfluxDB (InfluxQL)**](#influxdb) | Basic |
|[**MongoDB**](#mongodb) | Basic |
|[**MySQL**](#mysql) | Basic |
|[**PostgreSQL**](#pgsql)| Basic|

Create an **Credential entity** and use it for authenticating to your data sources. The following sections specify the parameters required for *Basic* authentication within different data source scenarios. 

## <span id="appinsights">Azure Application Insights</span>

* **Application ID**: This is used to identify this application when using the Application Insights API. To get the Application ID, do the following:

    1. From your Application Insights resource, click API Access.

    2. Copy the Application ID generated into **Application ID** field in Metrics Advisor. 
    
    See the [Azure Bot Service documentation](/azure/bot-service/bot-service-resources-app-insights-keys#application-id) for more information.

* **API Key**: API keys are used by applications outside the browser to access this resource. To get the API key, do the following:

    1. From the Application Insights resource, click API Access.

    2. Click Create API Key.

    3. Enter a short description, check the Read telemetry option, and click the Generate key button.

    4. Copy the API key to the **API key** field in Metrics Advisor.

* **Query**: Azure Application Insights logs are built on Azure Data Explorer, and Azure Monitor log queries use a version of the same Kusto query language. The [Kusto query language documentation](/azure/data-explorer/kusto/query/) has all of the details for the language and should be your primary resource for writing a query against Application Insights. 

    Sample query:

    ``` Kusto
    let gran = 1d; TABLE | where Timestamp >= @StartTime and Timestamp < @EndTime;
    ```
      
    *Only the 'TABLE', 'Timestamp' should be replaced in this example.

## <span id="blob">Azure Blob Storage (JSON)</span>

* **Connection String**: See the Azure Blob Storage [connection string](../../storage/common/storage-configure-connection-string.md#configure-a-connection-string-for-an-azure-storage-account) article for information on retrieving this string. Also, you can just go to Azure portal for your Azure Blob Storage resource, and find connection string directly in **Access keys** in **Settings** section.

* **Container**: Metrics Advisor expects time series data stored as Blob files (one Blob per timestamp) under a single container. This is the container name field.

* **Blob Template**: This is the template of the Blob file names.  You could indicate that this value used to find json file. For example: `/%Y/%m/X_%Y-%m-%d-%h-%M.json`. "%Y" is the first branch,  "%m" is the second, if you still have "%d", you should append it after "%m". Then, you append your JSON file name. If your JSON file is named by date, you could also use `%Y-%m-%d-%h-%M.json`.
The following parameters are supported:
  * `%Y` is the year formatted as `yyyy`
  * `%m` is the month formatted as `MM`
  * `%d` is the day formatted as `dd`
  * `%h` is the hour formatted as `HH`
  * `%M` is the minute formatted as `mm`

* **JSON format version**: Defines the data schema in the JSON files. Currently Metrics Advisor supports two versions, you can choose one to fill in the field:
  
  * **v1** (Default value)

      Only the metrics *Name* and *Value* are accepted. For example:
    
      ``` JSON
      {"count":11, "revenue":1.23}
      ```

  * **v2**

      The metrics *Dimensions* and *timestamp* are also accepted. For example:
      
      ``` JSON
      [
        {"date": "2018-01-01T00:00:00Z", "market":"en-us", "count":11, "revenue":1.23},
        {"date": "2018-01-01T00:00:00Z", "market":"zh-cn", "count":22, "revenue":4.56}
      ]
      ```

Only one timestamp is allowed per JSON file. 

## <span id="cosmosdb">Azure Cosmos DB (SQL)</span>

* **Connection String**: The connection string to access your Azure Cosmos DB. This can be found in the Cosmos DB resource, in **Keys**. 
* **Database**: The database to query against. This can be found in the **Browse** page under **Containers** section.
* **Collection ID**: The collection ID to query against. This can be found in the **Browse** page under **Containers** section.
* **SQL Query**: A SQL query to get and formulate data into multi-dimensional time series data. You can use the `@StartTime` and `@EndTime` variables in your query. They should be formatted: `yyyy-MM-dd HH:mm:ss`.

    Sample query:
    
    ``` mssql
    select StartDate, JobStatusId, COUNT(*) AS JobNumber from IngestionJobs WHERE StartDate = @StartTime
    ```
    
    Query sample for a data slice from 2019/12/12:
    
    ``` mssql
    select StartDate, JobStatusId, COUNT(*) AS JobNumber from IngestionJobs WHERE StartDate = '2019-12-12 00:00:00'
    ```

## <span id="kusto">Azure Data Explorer (Kusto)</span>

* **Connection String**: Metrics Advisor supports accessing Azure Data Explorer(Kusto) by using Azure AD application authentication. You will need to create and register an Azure AD application and then authorize it to access an Azure Data Explorer database. To get your connection string, see the [Azure Data Explorer](/azure/data-explorer/provision-azure-ad-app) documentation.

* **Query**: See [Kusto Query Language](/azure/data-explorer/kusto/query) to get and formulate data into multi-dimensional time series data. You can use the `@StartTime` and `@EndTime` variables in your query. They should be formatted: `yyyy-MM-dd HH:mm:ss`.

## <span id="adl">Azure Data Lake Storage Gen2</span>

* **Account Name**: The storage account name of your Azure Data Lake Storage Gen2. This can be found in your Azure Storage Account (Azure Data Lake Storage Gen2) resource in **Access keys**.

* **Account Key**: Please specify the account key to access your Azure Data Lake Storage Gen2. This could be found in Azure Storage Account (Azure Data Lake Storage Gen2) resource in **Access keys** setting.

* **File System Name (Container)**: Metrics Advisor will expect your time series data stored as Blob files (one Blob per timestamp) under a single container. This is the container name field. This can be found in your Azure storage account (Azure Data Lake Storage Gen2)  instance, and click **'Containers'** in **'Data Lake Storage'** section, then you will see the container name.

* **Directory Template**:
This is the directory template of the Blob file. The following parameters are supported:
  * `%Y` is the year formatted as `yyyy`
  * `%m` is the month formatted as `MM`
  * `%d` is the day formatted as `dd`
  * `%h` is the hour formatted as `HH`
  * `%M` is the minute formatted as `mm`
 
Query sample for a daily metric:*/%Y/%m/%d*.
Query sample for an hourly metric:*/%Y/%m/%d/%h*.
*Since template is expected in this part, there is nothing to be replaced in above examples.*


* **File Template**:
This is the file template of the Blob file. The following parameters are supported:
  * `%Y` is the year formatted as `yyyy`
  * `%m` is the month formatted as `MM`
  * `%d` is the day formatted as `dd`
  * `%h` is the hour formatted as `HH`
  * `%M` is the minute formatted as `mm`

Sample for a daily metric: *FileName_%Y-%m-%d.json*

Currently Metrics Advisor supports the data schema in the JSON files as follow. For example:

``` JSON
[
  {"date": "2018-01-01T00:00:00Z", "market":"en-us", "count":11, "revenue":1.23},
  {"date": "2018-01-01T00:00:00Z", "market":"zh-cn", "count":22, "revenue":4.56}
]
```
<!--
## <span id="eventhubs">Azure Event Hubs</span>

* **Connection String**: This can be found in 'Shared access policies' in your Event Hubs instance. Also for the 'EntityPath', it could be found by clicking into your Event Hubs instance and clicking at 'Event Hubs' in 'Entities' blade. Items that listed can be input as EntityPath. 

* **Consumer Group**: A [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) is a view (state, position, or offset) of an entire event hub.
Event Hubs use the latest offset of a consumer group to consume (subscribe from) the data from data source. Therefore a dedicated consumer group should be created for one data feed in your Metrics Advisor instance.

* **Timestamp**: Metrics Advisor uses the Event Hubs timestamp as the event timestamp if the user data source does not contain a timestamp field.
The timestamp field must match one of these two formats:

    * "YYYY-MM-DDTHH:MM:SSZ" format;

    * Number of seconds or milliseconds from the epoch of 1970-01-01T00:00:00Z.

    No matter which timestamp field it left aligns to granularity.For example, if timestamp is "2019-01-01T00:03:00Z", granularity is 5 minutes, then Metrics Advisor aligns the timestamp to "2019-01-01T00:00:00Z". If the event timestamp is "2019-01-01T00:10:00Z",  Metrics Advisor uses the timestamp directly without any alignment.
-->
## <span id="sql">Azure SQL Database | SQL Server</span>

* **Connection String**: Metrics Advisor accepts an [ADO.NET Style Connection String](/dotnet/framework/data/adonet/connection-string-syntax) for sql server data source. Also, your connection string could be found in Azure SQL Server resource in **Connection strings** of **Settings** section.


    Sample connection string:

    ```
    Server=db-server.database.windows.net,[port];Initial Catalog=[database];User ID=[username];Password=[password];Connection Timeout=30;
    ```

* **Query**: A SQL query to get and formulate data into multi-dimensional time series data. You can use a `@StartTime` variable in your query to help with getting expected metrics value.

  * `@StartTime`: a datetime in the format of `yyyy-MM-dd HH:mm:ss`

    Sample query:
    
    ``` mssql
    SELECT [Timestamp], [dimensionColumnName], [metricColumnName] FROM [TABLE] WHERE [Timestamp] > @StartTime and [Timestamp]< dateadd(hour, 1, @StartTime)    
    ```
    
    *The 'TABLE', 'Timestamp','dimensionColumnName','metricColumnName' should be replaced in this example.*

## <span id="table">Azure Table Storage</span>

* **Connection String**: Please refer to [View and copy a connection string](../../storage/common/storage-account-keys-manage.md?tabs=azure-portal&toc=%2fazure%2fstorage%2ftables%2ftoc.json#view-account-access-keys) for information on how to retrieve the connection string from Azure Table Storage.

* **Table Name**: Specify a table to query against. This can be found in your Azure Storage Account instance. Click **Tables** in the **Table Service** section.

* **Query**: You can use the `@StartTime` in your query. `@StartTime` is replaced with a yyyy-MM-ddTHH:mm:ss format string in script.

    Sample query:
    
    ``` mssql
    PartitionKey ge '@StartTime' and PartitionKey lt '@EndTime'
    ```
    
    *There is nothing need to be replaced in this example.*


## <span id="es">Elasticsearch</span>

* **Host**:Specify the master host of Elasticsearch Cluster.
* **Port**:Specify the master port of Elasticsearch Cluster.
* **Authorization Header**(optional):Specify the authorization header value of Elasticsearch Cluster.
* **Query**:Specify the query to get data for a single timestamp. Placeholder @StartTime is supported.(e.g. when data of 2020-06-21T00:00:00Z is ingested, @StartTime = 2020-06-21T00:00:00)

    Sample query:
    
    ``` Sql
    select * from TABLE where timestamp>=@StartTime and timestamp<@EndTime    
    ```
    
    *The 'TABLE' and 'Timestamp' need to be replaced in this example.*


## <span id="http">HTTP request</span>

* **Request URL**: A HTTP url which can return a JSON. The placeholders %Y,%m,%d,%h,%M are supported: %Y=year in format yyyy, %m=month in format MM, %d=day in format dd, %h=hour in format HH, %M=minute in format mm. For example: `http://microsoft.com/ProjectA/%Y/%m/X_%Y-%m-%d-%h-%M`.
* **Request HTTP method**: Use GET or POST.
* **Request header**: Could add basic authentication. 
* **Request payload**: Only JSON payload is supported. Placeholder @StartTime is supported in the payload. The response should be in the following JSON format: [{"timestamp": "2018-01-01T00:00:00Z", "market":"en-us", "count":11, "revenue":1.23}, {"timestamp": "2018-01-01T00:00:00Z", "market":"zh-cn", "count":22, "revenue":4.56}].(e.g. when data of 2020-06-21T00:00:00Z is ingested, @StartTime = 2020-06-21T00:00:00.0000000+00:00)

    Sample query:
    
    ``` JSON
    {
       "startTime":"@StartTime"
    }
    ```
    *There is nothing to be replaced in this example.*

## <span id="influxdb">InfluxDB (InfluxQL)</span>

* **Connection String**: The connection string to access your InfluxDB.
* **Database**: The database to query against.
* **Query**: A query to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` SQL
    select * from TABLE where Timestamp >= @StartTime and Timestamp < @StartTime + 1d
    ```
    
    *Only the 'TABLE', 'Timestamp' should be replaced in this example.*

* **User name**: This is optional for authentication. 
* **Password**: This is optional for authentication. 

## <span id="mongodb">MongoDB</span>

* **Connection String**: The connection string to access your MongoDB.
* **Database**: The database to query against.
* **Query**: A command to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` MongoDB
    {"find": "TABLE","filter": { Timestamp: { $gte: ISODate(@StartTime) , $lt: ISODate(@EndTime) }},"singleBatch": true}
    ```
    
    *Only the 'TABLE', 'Timestamp' should be replaced in this example.*


## <span id="mysql">MySQL</span>

* **Connection String**: The connection string to access your MySQL DB.
* **Query**: A query to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` mysql
    select * from TABLE where Timestamp >= @StartTime and Timestamp < + DATE_ADD(@StartTime, INTERVAL 1 DAY)
    ```
    
    *Only the 'TABLE', 'Timestamp' should be replaced in this example.*

## <span id="pgsql">PostgreSQL</span>

* **Connection String**: The connection string to access your PostgreSQL DB.
* **Query**: A query to get and formulate data into multi-dimensional time series data for ingestion.

    Sample query:

    ``` PostgreSQL
    select * from TABLE where Timestamp >= @StartTime and Timestamp < @StartTime + interval '1' day
    ```
    
    *Only the 'TABLE', 'Timestamp' should be replaced in this example.*

## Next steps

* While waiting for your metric data to be ingested into the system, read about [how to manage data feed configurations](how-tos/manage-data-feeds.md).
* When your metric data is ingested, you can [Configure metrics and fine tune detecting configuration](how-tos/configure-metrics.md).
