---
title: Example Apache Storm topologies in Azure HDInsight 
description: A list of example Storm topologies created and tested with Apache Storm on HDInsight including basic C# and Java topologies, and working with Event Hubs.
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/30/2018
---
# Example Storm topologies and components for Apache Storm on HDInsight

The following is a list of examples created and maintained by Microsoft for use with Apache Storm on HDInsight. These examples cover a variety of topics, from creating basic C# and Java topologies to working with Azure services such as Event Hubs, Cosmos DB, SQL Database, HBase on HDInsight, and Azure Storage. Some examples also demonstrate how to work with non-Azure, or even non-Microsoft technologies, such as SignalR and Socket.IO.

| Description | Demonstrates | Language/Framework |
|:--- |:--- |:--- |
| [Write to Azure Data Lake Store from Apache Storm](apache-storm-write-data-lake-store.md) |Writing to Azure Data Lake Store |Java |
| [Event Hub Spout and Bolt source](https://github.com/apache/storm/tree/master/external/storm-eventhubs) |Source for the Event Hub Spout and Bolt |Java |
| [Develop Java-based topologies for Apache Storm on HDInsight][5797064f] |Maven |Java |
| [Develop C# topologies for Apache Storm on HDInsight using Visual Studio][16fce2d1] |HDInsight Tools for Visual Studio |C#, Java |
| [Process events from Azure Event Hubs with Storm on HDInsight (C#)][844d1d81] |Event Hubs |C# and Java |
| [Process events from Azure Event Hubs with Storm on HDInsight (Java)](https://azure.microsoft.com/resources/samples/hdinsight-java-storm-eventhub/) |Event Hubs |Java |
| [Process vehicle sensor data from Event Hubs using Storm on HDInsight][246ee964] |Event Hubs, Cosmos DB, Azure Storage Blob (WASB) |C#, Java |
| [Extract, Transform, and Load (ETL) from Azure Event Hubs to HBase, using Storm on HDInsight][b4b68194] |Event Hubs, HBase |C# |
| [Template C# Storm topology project for working with Azure services from Storm on HDInsight][ce0c02a2] |Event Hubs, Cosmos DB, SQL Database, HBase, SignalR |C#, Java |
| [Scalability benchmarks for reading from Azure Event Hubs using Storm on HDInsight][d6c540e3] |Message throughput, Event Hubs, SQL Database |C#, Java |
| [Use Python with Storm on HDInsight](apache-storm-develop-python-topology.md) |Python components with a Flux topology |Python |
| [Use Kafka with Storm on HDInsight](../hdinsight-apache-storm-with-kafka.md) | Apache Storm reading and writing to Apache Kafka | Java |

> [!WARNING]
> The C# examples in this list were originally created and tested with Windows-based HDInsight, and may not work correctly with Linux-based HDInsight clusters. Linux-based clusters use Mono to run .NET code, and may have compatibility problems with the frameworks and packages used in the example.
>
> Linux is the only operating system used on HDInsight version 3.4 or later.

### Next Steps

* [Get started with Apache Storm on HDInsight][2b8c3488]
* [Learn how to deploy and manage Storm topologies with Storm on HDInsight][6eb0d3b8]

[2b8c3488]:apache-storm-tutorial-get-started-linux.md "Learn how to create a Storm on HDInsight cluster and use the Storm Dashboard to deploy example topologies."
[6eb0d3b8]:apache-storm-deploy-monitor-topology.md "Learn how to deploy and manage topologies using the web-based Storm Dashboard and Storm UI or the HDInsight Tools for Visual Studio."
[16fce2d1]:apache-storm-develop-csharp-visual-studio-topology.md "Learn how to create C# Storm topologies by using the HDInsight Tools for Visual Studio."
[5797064f]:apache-storm-develop-java-topology.md "Learn how to create Storm topologies in Java, using Maven, by creating a basic wordcount topology."
[844d1d81]:apache-storm-develop-csharp-event-hub-topology.md "Learn how to read and write data from Azure Event Hubs with Storm on HDInsight."
[246ee964]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/IotExample/README.md "Learn how to use a Storm topology to read messages from Azure Event Hubs, read documents from Azure Cosmos DB for data referencing and save data to Azure Storage."
[d6c540e3]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/EventCountExample "Several topologies to demonstrate throughput when reading from Azure Event Hubs and storing to SQL Database using Apache Storm on HDInsight."
[b4b68194]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/RealTimeETLExample "Learn how to read data from Azure Event Hubs, aggregate & transform the data, then store it to HBase on HDInsight."
[ce0c02a2]: https://github.com/hdinsight/hdinsight-storm-examples/tree/master/templates/HDInsightStormExamples "This project contains templates for spouts, bolts and topologies to interact with various Azure services like Event Hubs, Cosmos DB, and SQL Database."

