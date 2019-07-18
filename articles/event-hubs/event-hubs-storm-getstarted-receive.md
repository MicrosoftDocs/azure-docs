---
title: Receive events using Apache Storm - Azure Event Hubs | Microsoft Docs
description: This article provides information on how to receive events from Azure Event Hubs using Apache Storm.
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: java
ms.devlang: multiple
ms.topic: article
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija
---

# Receive events from Event Hubs using Apache Storm

[Apache Storm](https://storm.incubator.apache.org) is a distributed real-time computation system that simplifies reliable processing of unbounded streams of data. This section shows how to use an Azure Event Hubs Storm spout to receive events from Event Hubs. Using Apache Storm, you can split events across multiple processes hosted in different nodes. The Event Hubs integration with Storm simplifies event consumption by transparently checkpointing its progress using Storm's Zookeeper installation, managing persistent checkpoints and parallel receives from Event Hubs.

For more information about Event Hubs receive patterns, see the [Event Hubs overview][Event Hubs overview].

## Prerequisites
Before you start with the quickstart, **create an Event Hubs namespace and an event hub**. Use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md). 

## Create project and add code

This tutorial uses an [HDInsight Storm][HDInsight Storm] installation, which comes with the Event Hubs spout already available.

1. Follow the [HDInsight Storm - Get Started](../hdinsight/storm/apache-storm-overview.md) procedure to create a new HDInsight cluster, and connect to it via Remote Desktop.
2. Copy the `%STORM_HOME%\examples\eventhubspout\eventhubs-storm-spout-0.9-jar-with-dependencies.jar` file to your local development environment. This contains the events-storm-spout.
3. Use the following command to install the package into the local Maven store. This enables you to add it as a reference in the Storm project in a later step.

    ```shell
    mvn install:install-file -Dfile=target\eventhubs-storm-spout-0.9-jar-with-dependencies.jar -DgroupId=com.microsoft.eventhubs -DartifactId=eventhubs-storm-spout -Dversion=0.9 -Dpackaging=jar
    ```
4. In Eclipse, create a new Maven project (click **File**, then **New**, then **Project**).
   
    ![File -> New -> Project][12]
5. Select **Use default Workspace location**, then click **Next**
6. Select the **maven-archetype-quickstart** archetype, then click **Next**
7. Insert a **GroupId** and **ArtifactId**, then click **Finish**
8. In **pom.xml**, add the following dependencies in the `<dependency>` node.

    ```xml  
    <dependency>
        <groupId>org.apache.storm</groupId>
        <artifactId>storm-core</artifactId>
        <version>0.9.2-incubating</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>com.microsoft.eventhubs</groupId>
        <artifactId>eventhubs-storm-spout</artifactId>
        <version>0.9</version>
    </dependency>
    <dependency>
        <groupId>com.netflix.curator</groupId>
        <artifactId>curator-framework</artifactId>
        <version>1.3.3</version>
        <exclusions>
            <exclusion>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
            </exclusion>
            <exclusion>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-log4j12</artifactId>
            </exclusion>
        </exclusions>
        <scope>provided</scope>
    </dependency>
    ```

9. In the **src** folder, create a file called **Config.properties** and copy the following content, substituting the `receive rule key` and `event hub name` values:

	```java
	eventhubspout.username = ReceiveRule
	eventhubspout.password = {receive rule key}
	eventhubspout.namespace = ioteventhub-ns
	eventhubspout.entitypath = {event hub name}
	eventhubspout.partitions.count = 16
	   
	# if not provided, will use storm's zookeeper settings
	# zookeeper.connectionstring=localhost:2181
	   
	eventhubspout.checkpoint.interval = 10
	eventhub.receiver.credits = 10
	```
    The value for **eventhub.receiver.credits** determines how many events are batched before releasing them to the Storm pipeline. For the sake of simplicity, this example sets this value to 10. In production, it should usually be set to higher values; for example, 1024.
10. Create a new class called **LoggerBolt** with the following code:
    
	```java
	import java.util.Map;
	import org.slf4j.Logger;
	import org.slf4j.LoggerFactory;
	import backtype.storm.task.OutputCollector;
	import backtype.storm.task.TopologyContext;
	import backtype.storm.topology.OutputFieldsDeclarer;
	import backtype.storm.topology.base.BaseRichBolt;
	import backtype.storm.tuple.Tuple;
    
	public class LoggerBolt extends BaseRichBolt {
	    private OutputCollector collector;
	    private static final Logger logger = LoggerFactory
	              .getLogger(LoggerBolt.class);
    
	    @Override
	    public void execute(Tuple tuple) {
	        String value = tuple.getString(0);
	        logger.info("Tuple value: " + value);
   
	        collector.ack(tuple);
	    }
   
	    @Override
	    public void prepare(Map map, TopologyContext context, OutputCollector collector) {
	        this.collector = collector;
	        this.count = 0;
	    }
	    
	    @Override
	    public void declareOutputFields(OutputFieldsDeclarer declarer) {
	        // no output fields
	    }
    
	}
	```
    
    This Storm bolt logs the content of the received events. This can easily be extended to store tuples in a storage service. The [HDInsight Storm with Event Hub example] uses this same approach to store data into Azure Storage and Power BI.
11. Create a class called **LogTopology** with the following code:
    
	```java
	import java.io.FileReader;
	import java.util.Properties;
	import backtype.storm.Config;
	import backtype.storm.LocalCluster;
	import backtype.storm.StormSubmitter;
	import backtype.storm.generated.StormTopology;
	import backtype.storm.topology.TopologyBuilder;
	import com.microsoft.eventhubs.samples.EventCount;
	import com.microsoft.eventhubs.spout.EventHubSpout;
	import com.microsoft.eventhubs.spout.EventHubSpoutConfig;
	    
	public class LogTopology {
	    protected EventHubSpoutConfig spoutConfig;
	    protected int numWorkers;
	    
	    protected void readEHConfig(String[] args) throws Exception {
	        Properties properties = new Properties();
	        if (args.length > 1) {
	            properties.load(new FileReader(args[1]));
	        } else {
	            properties.load(EventCount.class.getClassLoader()
	                    .getResourceAsStream("Config.properties"));
	        }
	    
	        String username = properties.getProperty("eventhubspout.username");
	        String password = properties.getProperty("eventhubspout.password");
	        String namespaceName = properties
	                .getProperty("eventhubspout.namespace");
	        String entityPath = properties.getProperty("eventhubspout.entitypath");
	        String zkEndpointAddress = properties
	                .getProperty("zookeeper.connectionstring"); // opt
	        int partitionCount = Integer.parseInt(properties
	                .getProperty("eventhubspout.partitions.count"));
	        int checkpointIntervalInSeconds = Integer.parseInt(properties
	                .getProperty("eventhubspout.checkpoint.interval"));
	        int receiverCredits = Integer.parseInt(properties
	                .getProperty("eventhub.receiver.credits")); // prefetch count
	                                                            // (opt)
	        System.out.println("Eventhub spout config: ");
	        System.out.println("  partition count: " + partitionCount);
	        System.out.println("  checkpoint interval: "
	                + checkpointIntervalInSeconds);
	        System.out.println("  receiver credits: " + receiverCredits);
	 
	        spoutConfig = new EventHubSpoutConfig(username, password,
	                namespaceName, entityPath, partitionCount, zkEndpointAddress,
	                checkpointIntervalInSeconds, receiverCredits);
	    
	        // set the number of workers to be the same as partition number.
	        // the idea is to have a spout and a logger bolt co-exist in one
	        // worker to avoid shuffling messages across workers in storm cluster.
	        numWorkers = spoutConfig.getPartitionCount();
	    
	        if (args.length > 0) {
	            // set topology name so that sample Trident topology can use it as
	            // stream name.
	            spoutConfig.setTopologyName(args[0]);
	        }
	    }
	    
	    protected StormTopology buildTopology() {
	        TopologyBuilder topologyBuilder = new TopologyBuilder();
	   
	        EventHubSpout eventHubSpout = new EventHubSpout(spoutConfig);
	        topologyBuilder.setSpout("EventHubsSpout", eventHubSpout,
	                spoutConfig.getPartitionCount()).setNumTasks(
	                spoutConfig.getPartitionCount());
	        topologyBuilder
	                .setBolt("LoggerBolt", new LoggerBolt(),
	                        spoutConfig.getPartitionCount())
	                .localOrShuffleGrouping("EventHubsSpout")
	                .setNumTasks(spoutConfig.getPartitionCount());
	        return topologyBuilder.createTopology();
	    }
	    
	    protected void runScenario(String[] args) throws Exception {
	        boolean runLocal = true;
	        readEHConfig(args);
	        StormTopology topology = buildTopology();
	        Config config = new Config();
	        config.setDebug(false);
	    
	        if (runLocal) {
	            config.setMaxTaskParallelism(2);
	            LocalCluster localCluster = new LocalCluster();
	            localCluster.submitTopology("test", config, topology);
	            Thread.sleep(5000000);
	            localCluster.shutdown();
	        } else {
	            config.setNumWorkers(numWorkers);
	            StormSubmitter.submitTopology(args[0], config, topology);
	        }
	    }
	    
	    public static void main(String[] args) throws Exception {
	        LogTopology topology = new LogTopology();
	        topology.runScenario(args);
	    }
	}
	```

    This class creates a new Event Hubs spout, using the properties in the configuration file to instantiate it. It is important to note that this example creates as many spouts tasks as the number of partitions in the event hub, in order to use the maximum parallelism allowed by that event hub.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview][Event Hubs overview]
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
[HDInsight Storm]: ../hdinsight/storm/apache-storm-overview.md
[HDInsight Storm with Event Hub example]: https://azure.microsoft.com/resources/samples/hdinsight-java-storm-eventhub/

<!-- Images -->

[12]: ./media/event-hubs-get-started-receive-storm/create-storm1.png
