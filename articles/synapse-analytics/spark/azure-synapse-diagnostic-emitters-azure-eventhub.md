---
title: Collect your Apache Spark applications logs and metrics using Azure Event Hubs (preview)
description: In this tutorial, you learn how to use the Synapse Apache Spark diagnostic emitter extension to emit Apache Spark applications’ logs, event logs and metrics to your Azure Event Hubs.
services: synapse-analytics 
author: hrasheed-msft
ms.author: jejiang
ms.reviewer: jrasnick 
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice: spark
ms.date: 08/31/2021
---

# Collect your Apache Spark applications logs and metrics using Azure Event Hubs (preview)

The Synapse Apache Spark diagnostic emitter extension is a library that enables the Apache Spark application to emit the logs, event logs, and metrics to one or more destinations, including Azure Log Analytics, Azure Storage, and Azure Event Hubs. 

In this tutorial, you learn how to use the Synapse Apache Spark diagnostic emitter extension to emit Apache Spark applications’ logs, event logs and metrics to your Azure Event Hubs.

## Collect logs and metrics to Azure Event Hubs

### Step 1: Create an Azure Event Hub instance

To collect diagnostic logs and metrics to Azure Event Hubs, you can use existing Azure Event Hubs instance.
Or if you don't have one, you can [create an event hub](../../event-hubs/event-hubs-create.md).

### Step 2: Create a Apache Spark configuration file

Create a `diagnostic-emitter-azure-event-hub-conf.txt` and copy following contents to the file. Or download a [sample template file](https://go.microsoft.com/fwlink/?linkid=2169375) for Apache Spark pool configuration.

```
spark.synapse.diagnostic.emitters MyDestination1
spark.synapse.diagnostic.emitter.MyDestination1.type AzureEventHub
spark.synapse.diagnostic.emitter.MyDestination1.categories Log,EventLog,Metrics
spark.synapse.diagnostic.emitter.MyDestination1.secret <connection-string>
```

Fill in the following parameters in the configuration file: `<connection-string>`.
For more description of the parameters, please refer to [Azure EventHub configurations](#available-configurations)

### Step 3: Upload the Apache Spark configuration file to Apache Spark pool

1. Navigate to your Apache Spark pool in Synapse Studio **(Manage -> Apache Spark pools)**
2. Click the **"..."** button on the right of your Apache Spark pool and select **Apache Spark configuration**
3. Click **Upload** and choose the ".txt" configuration file, and click **Apply**.

## Available configurations

| Configuration                                                               | Description                                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spark.synapse.diagnostic.emitters`                                         | Required. The comma-separated destination names of diagnostic emitters.                                                                                                                              |
| `spark.synapse.diagnostic.emitter.<destination>.type`                       | Required. Built-in destination type. To enable Azure Event Hubs destination, the value should be `AzureEventHub`.                                                                                    |
| `spark.synapse.diagnostic.emitter.<destination>.categories`                 | Optional. The comma-separated selected log categories. Available values include `DriverLog`, `ExecutorLog`, `EventLog`, `Metrics`. If not set, the default value is **all** categories.              |
| `spark.synapse.diagnostic.emitter.<destination>.secret`                     | Optional. The Azure Eventhub instance connection string. This field should match this pattern `Endpoint=sb://<FQDN>/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<KeyValue>;EntityPath=<PathName>` |
| `spark.synapse.diagnostic.emitter.<destination>.secret.keyVault`            | Required if `.secret` is not specified. The [Azure Key vault](../../key-vault/general/overview.md) name where the secret (connection string) is stored.                                                                  |
| `spark.synapse.diagnostic.emitter.<destination>.secret.keyVault.secretName` | Required if `.secret.keyVault` is specified. The Azure Key vault secret name where the secret (connection string) is stored.                                                                         |
| `spark.synapse.diagnostic.emitter.<destination>.filter.eventName.match`     | Optional. The comma-separated spark event names, you can specify which events to collect. For example: `SparkListenerApplicationStart,SparkListenerApplicationEnd` |
| `spark.synapse.diagnostic.emitter.<destination>.filter.loggerName.match`    | Optional. The comma-separated log4j logger names, you can specify which logs to collect. For example: `org.apache.spark.SparkContext,org.example.Logger` |
| `spark.synapse.diagnostic.emitter.<destination>.filter.metricName.match`    | Optional. The comma-separated spark metric name suffixies, you can specify which metrics to collect. For example: `jvm.heap.used` |


> NOTE: The Azure Eventhub instance connection string should always contains the `EntityPath`, which is the name of the Azure Event Hubs instance.

## Log data sample

Here is a sample log record in JSON format:

```json
{
    "timestamp": "2021-01-02T12:34:56.789Z",
    "category": "Log|EventLog|Metrics",
    "workspaceName": "<my-workspace-name>",
    "sparkPool": "<spark-pool-name>",
    "livyId": "<livy-session-id>",
    "applicationId": "<application-id>",
    "applicationName": "<application-name>",
    "executorId": "<driver-or-executor-id>",
    "properties": {
        // The message properties of logs, events and metrics.
        "timestamp": "2021-01-02T12:34:56.789Z",
        "message": "Registering signal handler for TERM",
        "logger_name": "org.apache.spark.util.SignalUtils",
        "level": "INFO",
        "thread_name": "main"
        // ...
    }
}
```

## Synapse workspace with data exfiltration protection enabled

Azure Synapse Analytics workspaces support enabling data exfiltration protection for workspaces. With exfiltration protection, the logs and metrics can not be sent out to the destination endpoints directly. You can create corresponding [managed private endpoints](../../synapse-analytics/security/synapse-workspace-managed-private-endpoints.md) for different destination endpoints or [create IP firewall rules](../../synapse-analytics/security/synapse-workspace-ip-firewall.md) in this scenario.

## Next steps

[Create a storage account](../../storage/common/storage-account-create.md)
[Create a storage account to use with Azure Data Lake Storage Gen2](../../storage/blobs/create-data-lake-storage-account.md)
[Create, develop, and maintain Synapse notebooks in Azure Synapse Analytics](../../synapse-analytics/spark/apache-spark-development-using-notebooks.md)
[Spark session config magic command](../../synapse-analytics/spark/apache-spark-development-using-notebooks.md#spark-session-config-magic-command)
[Manage storage account access keys](../../storage/common/storage-account-keys-manage.md)
[Grant limited access to Azure Storage resources using shared access signatures (SAS)](../../storage/common/storage-sas-overview.md)
[Key Vault](https://azure.microsoft.com/services/key-vault/)
[Spark Metrics](https://spark.apache.org/docs/latest/monitoring.html#metrics)
[Synapse Spark Diagnostic Emitter Configuration Samples](https://go.microsoft.com/fwlink/?linkid=2169375)
[Understanding block blobs, append blobs, and page blobs](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs)
[Synapse Managed private endpoints](../../synapse-analytics/security/synapse-workspace-managed-private-endpoints.md)