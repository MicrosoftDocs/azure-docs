---
title: Example Apache Storm topologies in Azure HDInsight 
description: A list of example Storm topologies created and tested with Apache Storm on HDInsight including basic C# and Java topologies, and working with Event Hubs.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/27/2019
---

# Example Apache Storm topologies and components for Apache Storm on HDInsight

The following is a list of examples created and maintained by Microsoft for use with [Apache Storm](https://storm.apache.org/) on HDInsight. These examples cover a variety of topics, from creating basic C# and Java topologies to working with Azure services such as Event Hubs, Cosmos DB, SQL Database, [Apache HBase](https://hbase.apache.org/) on HDInsight, and Azure Storage. Some examples also demonstrate how to work with non-Azure, or even non-Microsoft technologies, such as SignalR and Socket.IO.

| Description | Demonstrates | Language/Framework |
|:--- |:--- |:--- |
| [Write to Azure Data Lake Storage from Apache Storm](apache-storm-write-data-lake-store.md) |Writing to Azure Data Lake Storage |Java |
| [Event Hub Spout and Bolt source](https://github.com/apache/storm/tree/master/external/storm-eventhubs) |Source for the Event Hub Spout and Bolt |Java |
| [Develop Java-based topologies for Apache Storm on HDInsight][5797064f] |Maven |Java |
| [Develop C# topologies for Apache Storm on HDInsight using Visual Studio][16fce2d1] |HDInsight Tools for Visual Studio |C#, Java |
| [Process events from Azure Event Hubs with Apache Storm on HDInsight (C#)][844d1d81] |Event Hubs |C# and Java |
| [Process events from Azure Event Hubs with Storm on HDInsight (Java)](https://github.com/Azure-Samples/hdinsight-java-storm-eventhub) |Event Hubs |Java |
| [Process vehicle sensor data from Event Hubs using Apache Storm on HDInsight][246ee964] |Event Hubs, Cosmos DB, Azure Storage Blob (WASB) |C#, Java |
| [Extract, Transform, and Load (ETL) from Azure Event Hubs to Apache HBase, using Apache Storm on HDInsight][b4b68194] |Event Hubs, HBase |C# |
| [Template C# Storm topology project for working with Azure services from Apache Storm on HDInsight][ce0c02a2] |Event Hubs, Cosmos DB, SQL Database, HBase, SignalR |C#, Java |
| [Scalability benchmarks for reading from Azure Event Hubs using Apache Storm on HDInsight][d6c540e3] |Message throughput, Event Hubs, SQL Database |C#, Java |
| [Use Apache Kafka with Apache Storm on HDInsight](../hdinsight-apache-storm-with-kafka.md) | Apache Storm reading and writing to Apache Kafka | Java |

> [!WARNING]  
> The C# examples in this list were originally created and tested with Windows-based HDInsight, and may not work correctly with Linux-based HDInsight clusters. Linux-based clusters use Mono to run .NET code, and may have compatibility problems with the frameworks and packages used in the example.
>
> Linux is the only operating system used on HDInsight version 3.4 or later.

## Python only

See [Use Python with Apache Storm on HDInsight](apache-storm-develop-python-topology.md) for an example of Python components with a Flux topology.

## Next Steps

* [Create and monitor an Apache Storm topology in Azure HDInsight](./apache-storm-quickstart.md)
* [Learn how to deploy and manage Apache Storm topologies with Apache Storm on HDInsight][6eb0d3b8]

[6eb0d3b8]:apache-storm-deploy-monitor-topology-linux.md "Learn how to deploy and manage topologies using the web-based Apache Storm Dashboard and Storm UI or the HDInsight Tools for Visual Studio."
[16fce2d1]:apache-storm-develop-csharp-visual-studio-topology.md "Learn how to create C# Storm topologies by using the HDInsight Tools for Visual Studio."
[5797064f]:apache-storm-develop-java-topology.md "Learn how to create Storm topologies in Java, using Maven, by creating a basic wordcount topology."
[844d1d81]:apache-storm-develop-csharp-event-hub-topology.md "Learn how to read and write data from Azure Event Hubs with Storm on HDInsight."
[246ee964]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/IotExample/README.md "Learn how to use a Storm topology to read messages from Azure Event Hubs, read documents from Azure Cosmos DB for data referencing and save data to Azure Storage."
[d6c540e3]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/EventCountExample "Several topologies to demonstrate throughput when reading from Azure Event Hubs and storing to SQL Database using Apache Storm on HDInsight."
[b4b68194]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/RealTimeETLExample "Learn how to read data from Azure Event Hubs, aggregate & transform the data, then store it to HBase on HDInsight."
[ce0c02a2]: https://github.com/hdinsight/hdinsight-storm-examples/tree/master/templates/HDInsightStormExamples "This project contains templates for spouts, bolts and topologies to interact with various Azure services like Event Hubs, Cosmos DB, and SQL Database."
