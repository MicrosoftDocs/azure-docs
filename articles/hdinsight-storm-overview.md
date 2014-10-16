<properties title="Storm in HDInsight overview" pageTitle="Learn about Apache Storm in HDInsight (hadoop)" description="Learn how you can use Apache Storm in HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure hdinsight real-time, azure hadoop storm real-time, aure hadoop real-time" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" manager="paulettm" editor="cgronlun"/>

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#HDinsight Storm overview

##What is Storm?

[Apache Storm][apachestorm] is a distributed, fault-tolerant, open source computation system that allows you to process data in realtime. Storm solutions can also provide guaranteed processing of data, with the ability to replay data that was not successfully processed the first time.

##What is Azure HDInsight Storm?

HDInsight Storm is offered as a managed cluster integrated into the Azure environment, where it may be used as part of a larger Azure solution. For example, Storm might consume data from services such as ServiceBus Queues or Event Hub, and use Websites or Cloud Services to provide data visualization. HDInsight Storm clusters may also be configured on an Azure Virtual Network, which reduces latency communicating with other resources on the same Virtual Network and can also allow secure communication with resources within a private datacenter.

To get started using Storm, see [Getting started with Storm in HDInsight][gettingstarted].

##How is data in HDInsight Storm processed?

A storm cluster process **topologies** instead of the MapReduce jobs that you may be familiar with from HDInsight or Hadoop. A Storm cluster contains two types of nodes, head nodes that run **Nimbus** and worker nodes that run **Supervisor**

* **Nimbus** - Similar to the JobTracker in Hadoop, it is responsible for distributing code throughout the cluster, assigning tasks to machines, and monitoring for failure. HDInsight provides two Nimbus nodes, so there is no single point of failure for a Storm cluster

* **Supervisor** - The supervisor for each worker node is responsible for starting and stopping **worker processes** on the node

* **Worker process** - A worker process runs a subset of a **topology**. A running topology is distributed across many worker processes throughout the cluster.

* **Topology** - Defines a graph of computation that processes **streams** of data. Unlike MapReduce jobs, topologies run until you stop them

* **Stream** - An unbound collection of **tuples**. Streams are produced by **spouts** and **bolts**, and consumed by **bolts**

* **Tuple** - A named list of dynamically typed values

* **Spout** - Consumes data from a data source and emits one or more **streams**

	> [WACOM.NOTE] In many cases, data is read from a queue such as Kafka, Azure ServiceBus Queues or Event Hubs. The queue ensures that data is persisted in case of an outage.

* **Bolt** - Consumes **streams**, performs processing on **tuples**, and may emit **streams**. Bolts are also responsible for writing data to external storage, such as a queue, HDInsight HBase, a blob, or other data store

* **Thrift** - Apache Thrift is a software framework for scalable cross-language service development. It allows you to build services that work between C++, Java, Python, PHP, Ruby, Erlang, Perl, Haskell, C#, Cocoa, JavaScript, Node.js, Smalltalk, and other languages.

	* **Nimbus** is a Thrift service, and a **topology** is a Thrift definition, so it is possible to develop topologies using a variety of programming languages 

For more information on Storm components, see the [Storm tutorial][apachetutorial] at apache.org.

##Scenarios: What are the use cases for Storm?

The following are some common scenarios for which you might use Apache storm. For information on real world scenarios, read [how companies are using Storm][poweredby].

###Realtime analytics

Since storm processes streams of data in realtime, it is ideal for data analysis that involve looking for, and reacting to, specific events or patterns in the data streams as they arrive. For example, a Storm topology might monitor sensor data to determine system health, and generate SMS messages to alert you when a specific pattern occurs.

###Extract Transform Load (ETL)

ETL can be thought of almost as a side effect of Storm processing. For example, if you are performing fraud detection through realtime analytics, you are ingesting and transforming data already. You may wish to also have a bolt store the data in HBase, Hive, or other data store for use in future analysis.

###Distributed RPC

Distributed RPC is a pattern that can be created using Storm. A request is passed to Storm, which then distributes the computation across multiple nodes, and finally returns a result stream to the waiting client.

For more information on distributed RPC and the DRPCClient provided with Storm, see [Distributed RPC](https://storm.incubator.apache.org/documentation/Distributed-RPC.html).

###Online machine learning

Storm can be used with machine learning solution that has previously been trained by batch processing, such as a solution based on Mahout. However its generic, distributed computation model also opens the door for stream-based machine learning solutions. For example, the [Scalable Advanced Massive Online Analysis (SAMOA) project][samoa] is a machine learning library that uses stream processing, and can work with Storm.

##What programming languages can I use?

The HDInsight Storm cluster provides support for .NET, Java, and Python out of the box. While Storm [supports other languages](https://storm.incubator.apache.org/about/multi-language.html), many of these will require you to install an additional programming language on the HDInsight cluster in addition to other configuration changes. 

###.NET

SCP is a project that enables .NET developers to design and implement a topology (including spouts and bolts.) Support for SCP is provided by default with HDInsight Storm clusters.

For more information on developing with SCP, see [Develop streaming data processing applications with SCP.NET and C# on Storm in HDInsight](/en-us/documentation/articles/hdinsight-hadoop-storm-scpdotnet-csharp-develop-streaming-data-processing-application).

###Java

Most Java examples you encounter will be either plain Java, or Trident. Trident is a high-level abstraction that makes it easier to do things such as joins, aggregations, grouping, and filtering. However, Trident acts on batches of tuples, where a raw Java solution will process a stream one tuple at a time.

For more information on Trident, see the [Trident tutorial](https://storm.incubator.apache.org/documentation/Trident-tutorial.html) at apache.org.

For examples of both raw Java and Trident topologies, see the **%storm_home%\contrib\storm-starter** directory on your HDInsight Storm cluster.

##What are some of the common development patterns?

###Guaranteed message processing

Storm can provide different levels of guaranteed message processing. For example, a basic Storm application can guarantee at-least-once processing, while Trident can guarantee exactly-once processing.

For more information, see [Guarantees on data processing](https://storm.apache.org/about/guarantees-data-processing.html) at apache.org

###BasicBolt

The pattern of reading an input tuple, emitting zero or more tuples, and then acking the input tuple immediately at the end of the execute method, is so common that Storm provides the [IBasicBolt](https://storm.apache.org/apidocs/backtype/storm/topology/IBasicBolt.html) interface to automate this pattern.

###Joins

Joining two streams of data will vary between applications. For example, you may join each tuple from multiple streams into one new stream, or you may only join batches of tuples for a specific window. Either way, joining can be accomplished by using [fieldsGrouping](http://javadox.com/org.apache.storm/storm-core/0.9.1-incubating/backtype/storm/topology/InputDeclarer.html#fieldsGrouping%28java.lang.String,%20backtype.storm.tuple.Fields%29), which is a way of defining how tuples are routed to bolts.

In the following Java example, fieldsGrouping is used to route tuples originating from components "1", "2", and "3" to the **MyJoiner** bolt.

	builder.setBolt("join", new MyJoiner(), parallelism) .fieldsGrouping("1", new Fields("joinfield1", "joinfield2")) .fieldsGrouping("2", new Fields("joinfield1", "joinfield2")) .fieldsGrouping("3", new Fields("joinfield1", "joinfield2")); 

###Batching

Batching can be accomplished several ways. With a basic Storm Java topology, you might use simple counter to batch X number of tuples before emitting them, or use an internal timing mechanism known as a tick tuple to emit a batch every X seconds.

For an example of using tick tuples, see [Analyzing sensor data with Storm and HDInsight](/en-us/documentation/articles/hdinsight-storm-sensor-data-analysis.md)

If you are using Trident, it is based on processing batches of tuples.

###Caching

In-memory caching is often used as a mechanism for speeding up processing, as it keeps frequently used assets in memory. Since a topology is distributed across multiple nodes, and multiple processes within each node, you should consider using [fieldsGrouping](http://javadox.com/org.apache.storm/storm-core/0.9.1-incubating/backtype/storm/topology/InputDeclarer.html#fieldsGrouping%28java.lang.String,%20backtype.storm.tuple.Fields%29) to ensure that tuples containing the fields that are used for cache lookup are always routed to the same process. This avoids duplication of cache entries across processes.

###Streaming top N

When your topology depends on calculating a 'top' N value, such as the top 5 trends on Twitter, you should calculate the top N value in parallel and then merge the output from those calculations into a global value. This can be done using [fieldsGrouping](http://javadox.com/org.apache.storm/storm-core/0.9.1-incubating/backtype/storm/topology/InputDeclarer.html#fieldsGrouping%28java.lang.String,%20backtype.storm.tuple.Fields%29) to route by field to the parallel bolts, which partitions the data by field value, then finally route to a bolt that globally determines the top N value.

For an example of this, see the [RollingTopWords](https://github.com/nathanmarz/storm-starter/blob/master/src/jvm/storm/starter/RollingTopWords.java) example.

##Next steps

* [Getting Started with Storm in HDInsight][gettingstarted]

* [Analyzing sensor data with Storm and HDInsight](/en-us/documentation/articles/hdinsight-storm-sensor-data-analysis)

* [Develop streaming data processing applications with SCP.NET and C# on Storm in HDInsight](/en-us/documentation/articles/hdinsight-hadoop-storm-scpdotnet-csharp-develop-streaming-data-processing-application)

[apachestorm]: https://storm.incubator.apache.org
[stormtrident]: https://storm.incubator.apache.org/documentation/Trident-API-Overview.html
[samoa]: http://yahooeng.tumblr.com/post/65453012905/introducing-samoa-an-open-source-platform-for-mining
[apachetutorial]: https://storm.incubator.apache.org/documentation/Tutorial.html
[poweredby]: https://storm.incubator.apache.org/documentation/Powered-By.html
[gettingstarted]: /en-us/documentation/articles/hdinsight-storm-getting-started
