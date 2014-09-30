<properties title="Storm in HDInsight overview" pageTitle="Learn about Apache Storm in HDInsight (hadoop)" description="Learn how you can use Apache Storm in HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure hdinsight real-time, azure hadoop storm real-time, aure hadoop real-time" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#HDinsight Storm overview

##What is Storm?

[Apache Storm][apachestorm] is a distributed, fault-tolerant, open source computation system that allows you to process data in realtime. Storm solutions can also provide guaranteed processing of data, with the ability to replay data that was not successfully processed the first time.

##What is Azure HDInsight Storm?

HDInsight Storm is offered as a managed cluster integrated into the Azure environment, where it may be used as part of a larger Azure solution. For example, Storm might consume data from services such as ServiceBus Queues or Event Hub, and use Websites or Cloud Services to provide data visualization. HDInsight Storm clusters may also be configured on an Azure Virtual Network, which reduces latency communicating with other resources on the same Virtual Network and can also allow secure communication with resources within a private datacenter.

To get started using Storm, see [Getting started with Storm in HDInsight][gettingstarted].

##How is data in HDInsight Storm processed?

Storm processes data using a **Topology**, which defines the components used to read data from an external source, the components used to process the data, and how the data flows between components. The following are the components within a topology.

* **Tuple** - a named list of dynamically typed values

* **Stream** - an unbound collection of tuples

* **Spout** - consumes data from a data source and emits one or more streams

	> [WACOM.NOTE] In many cases, data is read from a queue such as Kafka, Azure ServiceBus Queues or Event Hubs. The queue ensures that data is persisted in case of an outage.

* **Bolt** - consumes one or more streams, performs processing on tuples, and may emit one or more streams. Bolts are also responsible for writing data to external storage, such as a queue, blob, or other data store

> [WACOM.NOTE] Normally, Storm processes stream data one tuple at a time; however, the [Trident API][stormtrident] can be used to create and process batches of tuples.

Topologies are usually configured to create multiple instances of components within a topology. For example, a word count topology might create 8 instances of the bolt that splits sentences into individual words. How data is routed between these instances can also be defined by the topology.

For more information on Storm topologies, see the [Apache Storm tutorial][apachetutorial].

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

##Next steps

* [Getting Started with Storm in HDInsight][gettingstarted]

[apachestorm]: https://storm.incubator.apache.org
[stormtrident]: https://storm.incubator.apache.org/documentation/Trident-API-Overview.html
[samoa]: http://yahooeng.tumblr.com/post/65453012905/introducing-samoa-an-open-source-platform-for-mining
[apachetutorial]: https://storm.incubator.apache.org/documentation/Tutorial.html
[poweredby]: https://storm.incubator.apache.org/documentation/Powered-By.html
[gettingstarted]: [TBD]