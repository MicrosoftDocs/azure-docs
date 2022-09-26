---
title: Exploring captured Avro files in Azure Event Hubs
description: This article provides the schema of Avro files captured by Azure Event Hubs and a list of tools to explore them. 
ms.topic: article
ms.date: 07/06/2022
---

# Exploring captured Avro files in Azure Event Hubs
This article provides the schema for Avro files captured by Azure Event Hubs and a few tools to explore the files. 

## Schema 
The Avro files produced by Event Hubs Capture have the following Avro schema:

:::image type="content" source="./media/event-hubs-capture-overview/event-hubs-capture3.png" alt-text="Image showing the schema of Avro files captured by Azure Event Hubs.":::

## Azure Storage Explorer
You can view captured files in any tool such as [Azure Storage Explorer][Azure Storage Explorer]. You can download files locally to work on them. 

An easy way to explore Avro files is by using the [Avro Tools][Avro Tools] jar from Apache. You can also use [Apache Drill][Apache Drill] for a lightweight SQL-driven experience or [Apache Spark][Apache Spark] to perform complex distributed processing on the ingested data. 

## Use Apache Drill
[Apache Drill][Apache Drill] is an "open-source SQL query engine for Big Data exploration" that can query structured and semi-structured data wherever it is. The engine can run as a standalone node or as a huge cluster for great performance.

A native support to Azure Blob storage is available, which makes it easy to query data in an Avro file, as described in the documentation:

[Apache Drill: Azure Blob Storage Plugin][Apache Drill: Azure Blob Storage Plugin]

To easily query captured files, you can create and execute a VM with Apache Drill enabled via a container to access Azure Blob storage. See the following sample: [Streaming at Scale with Event Hubs Capture](https://github.com/Azure-Samples/streaming-at-scale/tree/main/eventhubs-capture-databricks-delta).

## Use Apache Spark
[Apache Spark][Apache Spark] is a "unified analytics engine for large-scale data processing." It supports different languages, including SQL, and can easily access Azure Blob storage. There are a few options to run Apache Spark in Azure, and each provides easy access to Azure Blob storage:

- [HDInsight: Address files in Azure storage][HDInsight: Address files in Azure storage]
- [Azure Databricks: Azure Blob storage][Azure Databricks: Azure Blob Storage]
- [Azure Kubernetes Service](../aks/spark-job.md) 

## Use Avro Tools

[Avro Tools][Avro Tools] are available as a jar package. After you download the jar file, you can see the schema of a specific Avro file by running the following command:

```shell
java -jar avro-tools-1.9.1.jar getschema <name of capture file>
```

This command returns

```json
{

    "type":"record",
    "name":"EventData",
    "namespace":"Microsoft.ServiceBus.Messaging",
    "fields":[
                 {"name":"SequenceNumber","type":"long"},
                 {"name":"Offset","type":"string"},
                 {"name":"EnqueuedTimeUtc","type":"string"},
                 {"name":"SystemProperties","type":{"type":"map","values":["long","double","string","bytes"]}},
                 {"name":"Properties","type":{"type":"map","values":["long","double","string","bytes"]}},
                 {"name":"Body","type":["null","bytes"]}
             ]
}
```

You can also use Avro Tools to convert the file to JSON format and perform other processing.

To perform more advanced processing, download and install Avro for your choice of platform. At the time of this writing, there are implementations available for C, C++, C\#, Java, NodeJS, Perl, PHP, Python, and Ruby.

Apache Avro has complete Getting Started guides for [Java][Java] and [Python][Python]. You can also read the [Getting started with Event Hubs Capture](event-hubs-capture-python.md) article.

## Next steps
Event Hubs Capture is the easiest way to get data into Azure. Using Azure Data Lake, Azure Data Factory, and Azure HDInsight, you can perform batch processing and other analytics using familiar tools and platforms of your choosing, at any scale you need. See the following articles to learn more about this feature. 

- [Event Hubs Capture overview](event-hubs-capture-overview.md)
- [Use the Azure portal to enable Event Hubs Capture](event-hubs-capture-enable-through-portal.md)
- [Use an Azure Resource Manager template to enable Event Hubs Capture](event-hubs-resource-manager-namespace-event-hub-enable-capture.md)


[Apache Avro]: https://avro.apache.org/
[Apache Drill]: https://drill.apache.org/
[Apache Spark]: https://spark.apache.org/
[support request]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[Azure Storage Explorer]: https://github.com/microsoft/AzureStorageExplorer/releases
[Avro Tools]: https://downloads.apache.org/avro/stable/java/
[Java]: https://avro.apache.org/docs/1.11.1/getting-started-java/
[Python]: https://avro.apache.org/docs/1.11.1/getting-started-python/
[Event Hubs overview]: ./event-hubs-about.md
[HDInsight: Address files in Azure storage]: ../hdinsight/hdinsight-hadoop-use-blob-storage.md
[Azure Databricks: Azure Blob Storage]:https://docs.databricks.com/spark/latest/data-sources/azure/azure-storage.html
[Apache Drill: Azure Blob Storage Plugin]:https://drill.apache.org/docs/azure-blob-storage-plugin/
[Streaming at Scale: Event Hubs Capture]:https://github.com/yorek/streaming-at-scale/tree/master/event-hubs-capture
