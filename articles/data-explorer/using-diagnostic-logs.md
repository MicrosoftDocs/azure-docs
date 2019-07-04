---
title: Set up diagnostic logs for an Azure Data Explorer cluster
description: Learn how to set up diagnostic logs for Azure Data Explorer to monitor ingestion operations.
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/04/2019
---

# Monitor Azure Data Explorer ingestion operations

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a table in a database so that you can run queries against it. 

Azure Data Explorer logs insights on ingestion success rate, latency, and detailed information on failures. Export operation logs to Azure Storage, Event Hub, or Log Analytics to monitor ingestion detailed status. Logs from Azure Storage and Azure Event Hub can be routed to a table in your Azure Data Explorer cluster for further analysis.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/).

* Create a [cluster and database](create-cluster-database-portal.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Set up diagnostic logs for an Azure Data Explorer cluster

### Enable diagnostic logs

Diagnostic logs can be used to configure the collection of the following metrics data:
* Cluster health
* Query performance
* Ingestion health and performance
* Export health and performance  

The data is archived into a storage account, streamed to an event hub, or sent to Log Analytics, as per your specifications.

Diagnostic logs are disabled by default. To enable diagnostic logs, perform the following steps:

1. In the [Azure portal](https://portal.azure.com), select the Azure Data Explorer cluster resource that you want to monitor.

1. Under **Monitoring**, select **Diagnostics logs**.
  
    ![Add diagnostics logs](media/using-diagnostic-logs/add-diagnostic-logs.PNG)

1. Select **Add diagnostic setting**.

1. In the **Diagnostics settings** window:
 
    ![Diagnostics settings configuration](media/using-diagnostic-logs/configure-diagnostics-settings.PNG)

    1. Select one or more targets: a storage account, event hub, or Log Analytics.
    
    1. Select metrics to be collected.
    
    1. Save the new diagnostics settings and [metrics](using-metrics.md)

New settings will be set in a few minutes. Logs then appear in the configured archival target, in the **Diagnostics logs** pane.

## Diagnostic logs categories

There are two categories for ingestion operation logs for Azure Data Explorer:

* Succeeded Ingestion Operations: These logs have information about successfully completed ingestion operations.
* Failed Ingestion Operations: These logs have detailed information about failed ingestion operations including error details. 

See [ingestion logs schema](#ingestion-logs-schema) for more information

## Diagnostic logs schema

All logs are stored in a JSON format.

### Ingestion logs schema

Archive log JSON strings include elements listed in the following table:

|Name               |Description
|---                |---
|time               |Time of the report.
|resourceId         |Azure Resource Manager resource ID.
|operationName      |Name of the operation: 'MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION'.
|operationVersion   |Schema versiom: '1.0' 
|category           |Category of the operation. 'SucceededIngestion' or 'FailedIngestion'. Properties differ between different categories.
|properties         |Detailed information of the operation.

Properties of a successful operation include elements listed in the following table:

|Name               |Description
|---                |---
|succeededOn        |Time of ingestion completion.
|operationId        |Azure Data Explorer ingestion operation ID.
|database           |Name of the target database.
|table              |Name of the target table.
|ingestionSourceId  |Id of the ingestion data source.
|ingestionSourcePath|Path of the ingestion data source, blob URI.
|rootActivityId     |Activity id.

Properties of a failed operation include elements listed in the following table:

|Name               |Description
|---                |---
|failedOn           |Time of ingestion completion.
|operationId        |Azure Data Explorer ingestion operation ID.
|database           |Name of the target database.
|table              |Name of the target table.
|ingestionSourceId  |Id of the ingestion data source.
|ingestionSourcePath|Path of the ingestion data source, blob URI.
|rootActivityId     |Activity id.
|details            |Detailed description of the failure, error message.
|errorCode          |Error code. 
|failureStatus      |'Permanent' or 'Transient'. Retry of a transient failure might succeed.
|originatesFromUpdatePolicy|True if failure originates from an update policy.
|shouldRetry        |True if retry might succeed.

#### Ingestion logs schema examples

**Example: Successful ingestion operation log**

```json
{
    "time": "",
    "resourceId": "",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION",
    "operationVersion": "1.0",
    "category": "SucceededIngestion",
    "properties":
    {
        "succeededOn": "2019-05-27 07:55:05.3693628",
        "operationId": "b446c48f-6e2f-4884-b723-92eb6dc99cc9",
        "database": "Samples",
        "table": "StormEvents",
        "ingestionSourceId": "66a2959e-80de-4952-975d-b65072fc571d",
        "ingestionSourcePath": "https://kustoingestionlogs.blob.core.windows.net/sampledata/events8347293.json",
        "rootActivityId": "d0bd5dd3-c564-4647-953e-05670e22a81d"
    }
}
```

**Example: Failed ingestion operation log**

```json
{
    "time": "",
    "resourceId": "",
    "operationName": "MICROSOFT.KUSTO/CLUSTERS/INGEST/ACTION",
    "operationVersion": "1.0",
    "category": "FailedIngestion",
    "properties":
    {
        "failedOn": "2019-05-27 08:57:05.4273524",
        "operationId": "5956515d-9a48-4544-a514-cf4656fe7f95",
        "database": "Samples",
        "table": "StormEvents",
        "ingestionSourceId": "eee56f8c-2211-4ea4-93a6-be556e853e5f",
        "ingestionSourcePath": "https://kustoingestionlogs.blob.core.windows.net/sampledata/events5725592.json",
        "rootActivityId": "52134905-947a-4231-afaf-13d9b7b184d5",
        "details": "Permanent failure downloading blob. URI: ..., permanentReason: Download_SourceNotFound, DownloadFailedException: 'Could not find file ...'",
        "errorCode": "Download_SourceNotFound",
        "failureStatus": "Permanent",
        "originatesFromUpdatePolicy": false,
        "shouldRetry": false
    }
}
```