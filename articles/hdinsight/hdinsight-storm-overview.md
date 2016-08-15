<properties
	pageTitle="Introduction to Apache Storm on HDInsight | Microsoft Azure"
	description="Get an introduction to Apache Storm, and learn how you can use Storm on HDInsight to build real-time data analytics solutions in the cloud."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/27/2016"
   ms.author="larryfr"/>

#Introduction to Apache Storm on HDInsight: Real-time analytics for Hadoop

Apache Storm on HDInsight allows you to create distributed, real-time analytics solutions in the Azure environment by using [Apache Hadoop](http://hadoop.apache.org).

##What is Apache Storm?

Apache Storm is a distributed, fault-tolerant, open-source computation system that allows you to process data in real-time with Hadoop. Storm solutions can also provide guaranteed processing of data, with the ability to replay data that was not successfully processed the first time.

##Why use Storm on HDInsight?

Apache Storm on HDInsight is a managed cluster integrated into the Azure environment. It provides the following key benefits:

* Performs as a managed service with an SLA of 99.9% up time

* Use the language of your choice: Provides support for Storm components written in **Java**, **C#**, and **Python**

	* Supports a mix of programming languages: Read data using Java, then process it using C#
	
		> [AZURE.NOTE] C# topologies are only supported on Windows-based HDInsight clusters.

	* Use the **Trident** Java interface to create Storm topologies that support "exactly once" processing of messages, "transactional" datastore persistence, and a set of common stream analytics operations

* Includes built-in scale-up and scale-down features: Scale an HDInsight cluster with no impact to running Storm topologies

* Integrate with other Azure services, including Event Hub, Azure Virtual Network, SQL Database, Blob storage, and DocumentDB

	* Combine the capabilities of multiple HDInsight clusters by using Azure Virtual Network: Create analytic pipelines that use HDInsight, HBase, or Hadoop clusters

For a list of companies that are using Apache Storm for their real-time analytics solutions, see [Companies Using Apache Storm](https://storm.apache.org/documentation/Powered-By.html).

To get started using Storm, see [Get started with Storm on HDInsight][gettingstarted].

###Ease of provisioning

You can provision a new Storm on HDInsight cluster in minutes. Specify the cluster name, size, administrator account, and the storage account. Azure will create the cluster, including sample topologies and a web-management dashboard.

> [AZURE.NOTE] You can also provision Storm clusters by using the [Azure CLI](../xplat-cli-install.md) or [Azure PowerShell](../powershell-install-configure.md).

Within 15 minutes of submitting the request, you will have a new Storm cluster running and ready for your first real-time analytics pipeline.

###Ease of use

__For Linux-based Storm on HDInsight clusters__, you can connect to the cluster using SSH and use the `storm` command to start and manage topologies. Additionally, you can use Ambari to monitor the Storm service and the Storm UI to monitor and manage running topologies.

For more information on working with Linux-based Storm clusters, see [Get started with Apache Storm on Linux-based HDInsight](hdinsight-apache-storm-tutorial-get-started-linux.md).

__For Windows-based Storm on HDInsight clusters__, the HDInsight Tools for Visual Studio allow you to create C# and hybrid C#/Java topologies, and then submit them to your Storm on HDInsight cluster.  

![Storm Project creation](./media/hdinsight-storm-overview/createproject.png)

HDInsight Tools for Visual Studio also provides an interface that allows you to monitor and manage Storm topologies on a cluster.

![Storm management](./media/hdinsight-storm-overview/stormview.png)

For an example of using the HDInsight Tools to create a Storm application, see [Develop C# Storm topologies with the HDInsight Tools for Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md).

For more information about the HDInsight Tools for Visual Studio, see [Get started using the HDInsight Tools for Visual Studio](../HDInsight/hdinsight-hadoop-visual-studio-tools-get-started.md).

Each Storm on HDInsight cluster also provides a web-based Storm Dashboard that allows you to submit, monitor, and manage Storm topologies running on the cluster.

![Storm dashboard](./media/hdinsight-storm-overview/dashboard.png)

For more information about using the Storm Dashboard, see [Deploy and manage Apache Storm topologies on HDInsight](hdinsight-storm-deploy-monitor-topology.md).

Storm on HDInsight also provides easy integration with Azure Event Hubs through the **Event Hub Spout**. The latest version of this component is available at [https://github.com/hdinsight/hdinsight-storm-examples/tree/master/lib/eventhubs](https://github.com/hdinsight/hdinsight-storm-examples/tree/master/lib/eventhubs). For more information on using this component, see the following documents.

* [Develop a C# topology that uses Azure Event Hubs](hdinsight-storm-develop-csharp-event-hub-topology.md)

* [Develop a Java topology that uses Azure Event Hubs](hdinsight-storm-develop-java-event-hub-topology.md)

###Reliability

Apache Storm always guarantees that each incoming message will be fully processed, even when the data analysis is spread over hundreds of nodes.

The **Nimbus node** provides similar functionality to the Hadoop JobTracker, and it assigns tasks to other nodes in the cluster through **Zookeeper**. Zookeeper nodes provide coordination for the cluster and facilitate communication between Nimbus and the **Supervisor** process on the worker nodes. If one processing node goes down, the Nimbus node is informed, and it assigns the task and associated data to another node.

The default configuration for Apache Storm is to have only one Nimbus node. Storm on HDInsight runs two Nimbus nodes. If the primary node fails, the HDInsight cluster will switch to the secondary node while the primary node is recovered.

![Diagram of nimbus, zookeeper, and supervisor](./media/hdinsight-storm-overview/nimbus.png)

###Scale

Although you can specify the number of nodes in your cluster during creation, you may want to grow or shrink the cluster to match workload. All HDInsight clusters allow you to change the number of nodes in the cluster, even while processing data.

> [AZURE.NOTE] To take advantage of new nodes added through scaling, you will need to rebalance topologies started before the cluster size was increased.

###Support

Storm on HDInsight comes with full enterprise-level 24/7 support. Storm on HDInsight also has an SLA of 99.9%. That means we guarantee that the cluster will have external connectivity at least 99.9% of the time.

##Common use cases for real-time analytics

The following are some common scenarios for which you might use Apache storm on HDInsight. For information about real-world scenarios, read [How companies are using Storm](https://storm.apache.org/documentation/Powered-By.html).

* Internet of Things (IoT)
* Fraud detection
* Social analytics
* Extract, Transform, Load (ETL)
* Network monitoring
* Search
* Mobile engagement

##How is data in HDInsight Storm processed?

Apache Storm runs **topologies** instead of the MapReduce jobs that you may be familiar with in HDInsight or Hadoop. A Storm on HDInsight cluster contains two types of nodes: head nodes that run **Nimbus** and worker nodes that run **Supervisor**.

* **Nimbus**: Similar to the JobTracker in Hadoop, it is responsible for distributing code throughout the cluster, assigning tasks to virtual machines, and monitoring for failure. HDInsight provides two Nimbus nodes, so there is no single point of failure for Storm on HDInsight

* **Supervisor**: The supervisor for each worker node is responsible for starting and stopping **worker processes** on the node.

* **Worker process**: Runs a subset of a **topology**. A running topology is distributed across many worker processes throughout the cluster.

* **Topology**: Defines a graph of computation that processes **streams** of data. Unlike MapReduce jobs, topologies run until you stop them.

* **Stream**: An unbound collection of **tuples**. Streams are produced by **spouts** and **bolts**, and they are consumed by **bolts**.

* **Tuple**: A named list of dynamically typed values.

* **Spout**: Consumes data from a data source and emits one or more **streams**.

	> [AZURE.NOTE] In many cases, data is read from a queue, such as Kafka, Azure Service Bus queues, or Event hubs. The queue ensures that data is persisted if there is an outage.

* **Bolt**: Consumes **streams**, performs processing on **tuples**, and may emit **streams**. Bolts are also responsible for writing data to external storage, such as a queue, HDInsight, HBase, a blob, or other data store.

* **Apache Thrift**: A software framework for scalable cross-language service development. It allows you to build services that work between C++, Java, Python, PHP, Ruby, Erlang, Perl, Haskell, C#, Cocoa, JavaScript, Node.js, Smalltalk, and other languages.

	* **Nimbus** is a Thrift service, and a **topology** is a Thrift definition, so it is possible to develop topologies using a variety of programming languages.

For more information about Storm components, see the [Storm tutorial][apachetutorial] at apache.org.


##What programming languages can I use?

The Storm on HDInsight cluster provides support for C#, Java, and Python.

### C&#35;

The HDInsight Tools for Visual Studio allow .NET developers to design and implement a topology in C#. You can also create hybrid topologies that use Java and C# components.

For more information, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md).

###Java

Most Java examples you encounter will be plain Java or Trident. Trident is a high-level abstraction that makes it easier to do things such as joins, aggregations, grouping, and filtering. However, Trident acts on batches of tuples, whereas a raw Java solution processes a stream one tuple at a time.

For more information about Trident, see the [Trident tutorial](https://storm.apache.org/documentation/Trident-tutorial.html) at apache.org.

For examples of Java and Trident topologies, see the [list of example Storm topologies](hdinsight-storm-example-topology.md) or the storm-starter examples on your HDInsight cluster.

The storm-starter examples are located in the __ /usr/hdp/current/storm-client/contrib/storm-starter__ directory on Linux-based clusters, and the **%storm_home%\contrib\storm-starter** directory on Windows-based clusters.

##What are some common development patterns?

###Guaranteed message processing

Storm can provide different levels of guaranteed message processing. For example, a basic Storm application can guarantee at-least-once processing, and Trident can guarantee exactly-once processing.

For more information, see [Guarantees on data processing](https://storm.apache.org/about/guarantees-data-processing.html) at apache.org.

###IBasicBolt

The pattern of reading an input tuple, emitting zero or more tuples, and then acking the input tuple immediately at the end of the execute method is very common, and Storm provides the [IBasicBolt](https://storm.apache.org/apidocs/backtype/storm/topology/IBasicBolt.html) interface to automate this pattern.

###Joins

Joining two streams of data will vary between applications. For example, you could join each tuple from multiple streams into one new stream, or you could join only batches of tuples for a specific window. Either way, joining can be accomplished by using [fieldsGrouping](http://javadox.com/org.apache.storm/storm-core/0.9.1-incubating/backtype/storm/topology/InputDeclarer.html#fieldsGrouping%28java.lang.String,%20backtype.storm.tuple.Fields%29), which is a way of defining how tuples are routed to bolts.

In the following Java example, fieldsGrouping is used to route tuples that originate from components "1", "2", and "3" to the **MyJoiner** bolt.

	builder.setBolt("join", new MyJoiner(), parallelism) .fieldsGrouping("1", new Fields("joinfield1", "joinfield2")) .fieldsGrouping("2", new Fields("joinfield1", "joinfield2")) .fieldsGrouping("3", new Fields("joinfield1", "joinfield2"));

###Batching

Batching can be accomplished several ways. With a basic Storm Java topology, you might use simple counter to batch X number of tuples before emitting them, or use an internal timing mechanism known as a "tick tuple" to emit a batch every X seconds.

For an example of using tick tuples, see [Analyzing sensor data with Storm and HBase on HDInsight](hdinsight-storm-sensor-data-analysis.md).

If you are using Trident, it is based on processing batches of tuples.

###Caching

In-memory caching is often used as a mechanism for speeding up processing because it keeps frequently used assets in memory. Because a topology is distributed across multiple nodes, and multiple processes within each node, you should consider using [fieldsGrouping](http://javadox.com/org.apache.storm/storm-core/0.9.1-incubating/backtype/storm/topology/InputDeclarer.html#fieldsGrouping%28java.lang.String,%20backtype.storm.tuple.Fields%29) to ensure that tuples containing the fields that are used for cache lookup are always routed to the same process. This avoids duplication of cache entries across processes.

###Streaming top N

When your topology depends on calculating a "top N" value, such as the top 5 trends on Twitter, you should calculate the top N value in parallel and then merge the output from those calculations into a global value. This can be done by using [fieldsGrouping](http://javadox.com/org.apache.storm/storm-core/0.9.1-incubating/backtype/storm/topology/InputDeclarer.html#fieldsGrouping%28java.lang.String,%20backtype.storm.tuple.Fields%29) to route by field to the parallel bolts (which partitions the data by field value), and then route to a bolt that globally determines the top N value.

For an example of this, see the [RollingTopWords](https://github.com/nathanmarz/storm-starter/blob/master/src/jvm/storm/starter/RollingTopWords.java) example.

##What type of logging does Storm use?

Storm uses Apache Log4j to log information. By default, a large amount of data is logged, and it can be difficult to sort through the information. You can include a logging configuration file as part of your Storm topology to control logging behavior.

For an example topology that demonstrates how to configure logging, see [Java-based WordCount](hdinsight-storm-develop-java-topology.md) example for Storm on HDInsight.

##Next steps

Learn more about real-time analytics solutions with Apache Storm in HDInsight:

* [Getting Started with Storm on HDInsight][gettingstarted]

* [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)

[stormtrident]: https://storm.apache.org/documentation/Trident-API-Overview.html
[samoa]: http://yahooeng.tumblr.com/post/65453012905/introducing-samoa-an-open-source-platform-for-mining
[apachetutorial]: https://storm.apache.org/documentation/Tutorial.html
[gettingstarted]: hdinsight-apache-storm-tutorial-get-started-linux.md
