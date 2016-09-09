<properties
 pageTitle="Example Apache Storm topologies on HDInsight | Microsoft Azure"
 description="A list of example Storm topologies created and tested with Apache Storm on HDInsight including basic C# and Java topologies, and working with Event Hubs."
 services="hdinsight"
 documentationCenter=""
 authors="Blackmist"
 manager="paulettm"
 editor="cgronlun"
	tags="azure-portal"/>

<tags
 ms.service="hdinsight"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="big-data"
 ms.date="06/06/2016"
 ms.author="larryfr"/>

# Example Storm toplogies and components for Apache Storm on HDInsight

The following is a list of examples created and maintained by Microsoft for use with Apache Storm on HDInsight. These examples cover a variety of topics, from creating basic C# and Java topologies to working with Azure services such as Event Hubs, DocumentDB, Power BI, SQL Database, HBase on HDInsight, and Azure Storage. Some examples also demonstrate how to work with non-Azure, or even non-Microsoft technologies, such as SignalR and Socket.IO

| Description                                                                                             | Demonstrates                                         | Language/Framework         |
|:--------------------------------------------------------------------------------------------------------|:-----------------------------------------------------|:---------------------------|
| [Write to Azure Data Lake Store from Apache Storm](hdinsight-storm-write-data-lake-store.md) | Writing to Azure Data Lake Store | Java |
| [Event Hub Spout and Bolt source](https://github.com/apache/storm/tree/master/external/storm-eventhubs) | Source for the Event Hub Spout and Bolt | Java |
| [Develop Java-based topologies for Apache Storm on HDInsight][5797064f]                                 | Maven                                                | Java                       |
| [Develop C# topologies for Apache Storm on HDInsight using Visual Studio][16fce2d1]                     | HDInsight Tools for Visual Studio                    | C#, Java                   |
| [Create multiple data streams in a C# Storm topology][ec5a4064]                                         | Multiple streams                                     | C#                         |
| [Determine Twitter trending topics with Storm on HDInsight][3c86c7c8]                                   | Trident                                              | Java, Trident              |
| [Process events from Azure Event Hubs with Storm on HDInsight (C#)][844d1d81]                                | Event Hubs                                           | C# and Java                |
| [Process events from Azure Event Hubs with Storm on HDInsight (Java)](hdinsight-storm-develop-java-event-hub-topology.md) | Event Hubs | Java |
| [Use Power Bi to visualize data from a Storm topology][94d15238]                              | Power BI                                             | C#                         |
| [Analyzing sensor data with Storm and HBase in HDInsight][ab894747]                                     | Event Hubs, HBase, Socket.IO, Web dashboard          | C#, Java, JavaScript, HTML |
| [Process vehicle sensor data from Event Hubs using Storm on HDInsight][246ee964]                        | Event Hubs, DocumentDb, Azure Storage Blob (WASB)    | C#, Java                   |
| [Extract, Transform, and Load (ETL) from Azure Event Hubs to HBase, using Storm on HDInsight][b4b68194] | Event Hubs, HBase                                    | C#                         |
| [Template C# Storm topology project for working with Azure services from Storm on HDInsight][ce0c02a2]  | Event Hubs, DocumentDb, SQL Database, HBase, SignalR | C#, Java                   |
| [Scalability benchmarks for reading from Azure Event Hubs using Storm on HDInsight][d6c540e3]           | Message throughput, Event Hubs, SQL Database         | C#, Java                   |
| [Correlate events using Storm and HBase on HDInsight](hdinsight-storm-correlation-topology.md) | HBase | C# |
| [Use Python with Storm on HDInsight](hdinsight-storm-develop-python-topology.md) | Python components with Java and Clojure based Storm topologies | Python |

## Next Steps

* [Get started with Apache Storm on HDInsight][2b8c3488]

* [Learn how to deploy and manage Storm topologies with Storm on HDInsight][6eb0d3b8]

  [2b8c3488]: hdinsight-apache-storm-tutorial-get-started-linux.md "Learn how to create a Storm on HDInsight cluster and use the Storm Dashboard to deploy example topologies."
  [6eb0d3b8]: hdinsight-storm-deploy-monitor-topology.md "Learn how to deploy and manage topologies using the web-based Storm Dashboard and Storm UI or the HDInsight Tools for Visual Studio."
  [16fce2d1]: hdinsight-storm-develop-csharp-visual-studio-topology.md "Learn how to create C# Storm topologies by using the HDInsight Tools for Visual Studio."
  [5797064f]: hdinsight-storm-develop-java-topology.md "Learn how to create Storm topologies in Java, using Maven, by creating a basic wordcount topology."
  [94d15238]: hdinsight-storm-power-bi-topology.md "Demonstrates how to write data to Power BI from a C# topology, then create a chart and dashboard from the data."
  [ec5a4064]: https://github.com/Blackmist/csharp-storm-example "Demonstrates a basic Storm topology that performs a wordcount, implemented in C#. This also demonstrates how to create multiple data streams within a C# topology."
  [844d1d81]: hdinsight-storm-develop-csharp-event-hub-topology.md "Learn how to read and write data from Azure Event Hubs with Storm on HDInsight."
  [ab894747]: hdinsight-storm-sensor-data-analysis.md "Learn how to use Apache Storm on HDInsight to process sensor data from Azure Event Hubs, visualize it using D3.js, and (optionally,) store it to HBase."
  [3c86c7c8]: hdinsight-storm-twitter-trending.md "Learn how to use Trident to create a Storm topology that determines trending topics (based on hashtags,) on Twitter."
  [246ee964]: hdinsight-storm-iot-eventhub-documentdb.md "Learn how to use a Storm topology to read messages from Azure Event Hubs, read documents from Azure DocumentDB for data referencing and save data to Azure Storage."
  [d6c540e3]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/EventCountExample "Several topologies to demonstrate throughput when reading from Azure Event Hubs and storing to SQL Database using Apache Storm on HDInsight."
  [b4b68194]: https://github.com/hdinsight/hdinsight-storm-examples/blob/master/RealTimeETLExample "Learn how to read data from Azure Event Hubs, aggregate & transform the data, then store it to HBase on HDInsight."
  [ce0c02a2]: https://github.com/hdinsight/hdinsight-storm-examples/tree/master/templates/HDInsightStormExamples "This project contains templates for spouts, bolts and topologies to interact with various Azure services like Event Hubs, DocumentDB, and SQL Database."
 