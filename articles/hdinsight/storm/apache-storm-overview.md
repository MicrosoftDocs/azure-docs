---
title: What is Apache Storm - Azure HDInsight 
description: Apache Storm allows you to process streams of data in real time. Azure HDInsight allows you to easily create Storm clusters on the Azure cloud. With Visual Studio, you can create Storm solutions using C#, and then deploy to your HDInsight Storm clusters.
author: hrasheed-msft
ms.reviewer: jasonh
keywords: apache storm use cases,storm cluster,what is apache storm

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: overview
ms.date: 06/12/2019
ms.author: hrasheed
#Customer intent: As a developer, I want to understand how Storm on HDInsight is different from Storm on other platforms.
---

# What is Apache Storm on Azure HDInsight?

[Apache Storm](https://storm.apache.org/) is a distributed, fault-tolerant, open-source computation system. You can use Storm to process streams of data in real time with [Apache Hadoop](https://hadoop.apache.org/). Storm solutions can also provide guaranteed processing of data, with the ability to replay data that was not successfully processed the first time.

## Why use Apache Storm on HDInsight?

Storm on HDInsight provides the following features:

* __99% Service Level Agreement (SLA) on Storm uptime__: For more information, see the [SLA information for HDInsight](https://azure.microsoft.com/support/legal/sla/hdinsight/v1_0/) document.

* Supports easy customization by running scripts against a Storm cluster during or after creation. For more information, see [Customize HDInsight clusters using script action](../hdinsight-hadoop-customize-cluster-linux.md).

* **Create solutions in multiple languages**: You can write Storm components in the language of your choice, such as Java, C#, and Python.

    * Integrates Visual Studio with HDInsight for the development, management, and monitoring of C# topologies. For more information, see [Develop C# Storm topologies with the HDInsight Tools for Visual Studio](apache-storm-develop-csharp-visual-studio-topology.md).

    * Supports the Trident Java interface. You can create Storm topologies that support exactly once processing of messages, transactional datastore persistence, and a set of common stream analytics operations.

* **Dynamic scaling**: You can add or remove worker nodes with no impact to running Storm topologies.

    * You must deactivate and reactivate running topologies to take advantage of new nodes added through scaling operations.

* **Create streaming pipelines using multiple Azure services**: Storm on HDInsight integrates with other Azure services such as Event Hubs, SQL Database, Azure Storage, and Azure Data Lake Storage.

    For an example solution that integrates with Azure services, see [Process events from Event Hubs with Apache Storm on HDInsight](https://azure.microsoft.com/resources/samples/hdinsight-java-storm-eventhub/).

For a list of companies that are using Apache Storm for their real-time analytics solutions, see [Companies using Apache Storm](https://storm.apache.org/documentation/Powered-By.html).

To get started using Storm, see [Create and monitor an Apache Storm topology in Azure HDInsight](apache-storm-quickstart.md).

## How does Apache Storm work

Storm runs topologies instead of the [Apache Hadoop MapReduce](https://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html)  jobs that you might be familiar with. Storm topologies are composed of multiple components that are arranged in a directed acyclic graph (DAG). Data flows between the components in the graph. Each component consumes one or more data streams, and can optionally emit one or more streams. The following diagram illustrates how data flows between components in a basic word-count topology:

![Example of how components are arranged in a Storm topology](./media/apache-storm-overview/example-apache-storm-topology-diagram.png)

* Spout components bring data into a topology. They emit one or more streams into the topology.

* Bolt components consume streams emitted from spouts or other bolts. Bolts might optionally emit streams into the topology. Bolts are also responsible for writing data to external services or storage, such as HDFS, Kafka, or HBase.

## Reliability

Apache Storm guarantees that each incoming message is always fully processed, even when the data analysis is spread over hundreds of nodes.

The Nimbus node provides functionality similar to the Apache Hadoop JobTracker, and it assigns tasks to other nodes in a cluster through [Apache ZooKeeper](https://zookeeper.apache.org/). Zookeeper nodes provide coordination for a cluster and facilitate communication between Nimbus and the Supervisor process on the worker nodes. If one processing node goes down, the Nimbus node is informed, and it assigns the task and associated data to another node.

The default configuration for Apache Storm clusters is to have only one Nimbus node. Storm on HDInsight provides two Nimbus nodes. If the primary node fails, the Storm cluster switches to the secondary node while the primary node is recovered. The following diagram illustrates the task flow configuration for Storm on HDInsight:

![Diagram of nimbus, zookeeper, and supervisor](./media/apache-storm-overview/nimbus.png)

## Ease of creation

You can create a new Storm cluster on HDInsight in minutes. For more information on creating a Storm cluster, see [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).

## Ease of use

* __Secure Shell (SSH) connectivity__: You can access the head nodes of your Storm cluster over the Internet by using SSH. You can run commands directly on your cluster by using SSH.

  For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

* __Web connectivity__: All HDInsight clusters provide the Ambari web UI. You can easily monitor, configure, and manage services on your cluster by using the Ambari web UI. Storm clusters also provide the Storm UI. You can monitor and manage running Storm topologies from your browser by using the Storm UI.

  For more information, see the [Manage HDInsight using the Apache Ambari Web UI](../hdinsight-hadoop-manage-ambari.md) and [Monitor and manage using the Apache Storm UI](apache-storm-deploy-monitor-topology-linux.md#monitor-and-manage-storm-ui) documents.

* __Azure PowerShell and Azure Classic CLI__: PowerShell and classic CLI both provide command-line utilities that you can use from your client system to work with HDInsight and other Azure services.

* __Visual Studio integration__: Azure Data Lake Tools for Visual Studio include project templates for creating C# Storm topologies by using the SCP.NET framework. Data Lake Tools also provide tools to deploy, monitor, and manage solutions with Storm on HDInsight.

  For more information, see [Develop C# Storm topologies with the HDInsight Tools for Visual Studio](apache-storm-develop-csharp-visual-studio-topology.md).

## Integration with other Azure services

* __Azure Data Lake Storage__: For an example of using Data Lake Storage with a Storm cluster, see [Use Azure Data Lake Storage with Apache Storm on HDInsight](apache-storm-write-data-lake-store.md).

* __Event Hubs__: For an example of using Event Hubs with a Storm cluster, see the following examples:

    * [Process events from Azure Event Hubs with Apache Storm on HDInsight (Java)](https://azure.microsoft.com/resources/samples/hdinsight-java-storm-eventhub/)

    * [Process events from Azure Event Hubs with Apache Storm on HDInsight (C#)](apache-storm-develop-csharp-event-hub-topology.md)

* __SQL Database__, __Cosmos DB__, __Event Hubs__, and __HBase__: Template examples are included in the Data Lake Tools for Visual Studio. For more information, see [Develop a C# topology for Apache Storm on HDInsight](apache-storm-develop-csharp-visual-studio-topology.md).

## Support

Storm on HDInsight comes with full enterprise-level continuous support. Storm on HDInsight also has an SLA of 99.9 percent. That means Microsoft guarantees that a Storm cluster has external connectivity at least 99.9 percent of the time.

For more information, see [Azure support](https://azure.microsoft.com/support/options/).

## Apache Storm use cases

The following are some common scenarios for which you might use Storm on HDInsight:

* Internet of Things (IoT)
* Fraud detection
* Social analytics
* Extraction, transformation, and loading (ETL)
* Network monitoring
* Search
* Mobile engagement

For information about real-world scenarios, see the [How companies are using Apache Storm](https://storm.apache.org/documentation/Powered-By.html) document.

## Development

.NET developers can design and implement topologies in C# by using Data Lake Tools for Visual Studio. You can also create hybrid topologies that use Java and C# components.

For more information, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](apache-storm-develop-csharp-visual-studio-topology.md).

You can also develop Java solutions by using the IDE of your choice. For more information, see [Develop Java topologies for Apache Storm on HDInsight](apache-storm-develop-java-topology.md).

Python can also be used to develop Storm components. For more information, see [Develop Apache Storm topologies using Python on HDInsight](apache-storm-develop-python-topology.md).

## Common development patterns

### Guaranteed message processing

Apache Storm can provide different levels of guaranteed message processing. For example, a basic Storm application can guarantee at-least-once processing, and [Trident](https://storm.apache.org/releases/current/Trident-API-Overview.html) can guarantee exactly once processing.

For more information, see [Guarantees on data processing](https://storm.apache.org/about/guarantees-data-processing.html) at apache.org.

### IBasicBolt

The pattern of reading an input tuple, emitting zero or more tuples, and then acknowledging the input tuple immediately at the end of the execute method is common. Storm provides the [IBasicBolt](https://storm.apache.org/releases/current/javadocs/org/apache/storm/topology/IBasicBolt.html) interface to automate this pattern.

### Joins

How data streams are joined varies between applications. For example, you can join each tuple from multiple streams into one new stream, or you can join only batches of tuples for a specific window. Either way, joining can be accomplished by using [fieldsGrouping](https://storm.apache.org/releases/current/javadocs/org/apache/storm/topology/InputDeclarer.html#fieldsGrouping-java.lang.String-org.apache.storm.tuple.Fields-). Field grouping is a way of defining how tuples are routed to bolts.

In the following Java example, fieldsGrouping is used to route tuples that originate from components "1", "2", and "3" to the MyJoiner bolt:

```java
builder.setBolt("join", new MyJoiner(), parallelism) .fieldsGrouping("1", new Fields("joinfield1", "joinfield2")) .fieldsGrouping("2", new Fields("joinfield1", "joinfield2")) .fieldsGrouping("3", new Fields("joinfield1", "joinfield2"));
```

### Batches

Apache Storm provides an internal timing mechanism known as a "tick tuple." You can set how often a tick tuple is emitted in your topology.

For an example of using a tick tuple from a C# component, see [PartialBoltCount.cs](https://github.com/hdinsight/hdinsight-storm-examples/blob/3b2c960549cac122e8874931df4801f0934fffa7/EventCountExample/EventCountTopology/src/main/java/com/microsoft/hdinsight/storm/examples/PartialCountBolt.java).

### Caches

In-memory caching is often used as a mechanism for speeding up processing because it keeps frequently used assets in memory. Because a topology is distributed across multiple nodes, and multiple processes within each node, you should consider using [fieldsGrouping](https://storm.apache.org/releases/current/javadocs/org/apache/storm/topology/InputDeclarer.html#fieldsGrouping-java.lang.String-org.apache.storm.tuple.Fields-). Use `fieldsGrouping` to ensure that tuples containing the fields that are used for cache lookup are always routed to the same process. This grouping functionality avoids duplication of cache entries across processes.

### Stream "top N"

When your topology depends on calculating a top N value, calculate the top N value in parallel. Then merge the output from those calculations into a global value. This operation can be done by using [fieldsGrouping](https://storm.apache.org/releases/current/javadocs/org/apache/storm/topology/InputDeclarer.html#fieldsGrouping-java.lang.String-org.apache.storm.tuple.Fields-) to route by field for parallel processing. Then you can route to a bolt that globally determines the top N value.

For an example of calculating a top N value, see the [RollingTopWords](https://github.com/apache/storm/blob/master/examples/storm-starter/src/jvm/org/apache/storm/starter/RollingTopWords.java) example.

## Logging

Storm uses [Apache Log4j 2](https://logging.apache.org/log4j/2.x/) to log information. By default, a large amount of data is logged, and it can be difficult to sort through the information. You can include a logging configuration file as part of your Storm topology to control logging behavior.

For an example topology that demonstrates how to configure logging, see [Java-based WordCount](apache-storm-develop-java-topology.md) example for Storm on HDInsight.

## Next steps

Learn more about real-time analytics solutions with Apache Storm on HDInsight:

* [Create and monitor an Apache Storm topology in Azure HDInsight](apache-storm-quickstart.md)
* [Example topologies for Apache Storm on HDInsight](apache-storm-example-topology.md)
