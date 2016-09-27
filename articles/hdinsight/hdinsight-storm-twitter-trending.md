<properties
   pageTitle="Twitter trending topics with Apache Storm on HDInsight | Microsoft Azure"
   description="Learn how to use Trident to create an Apache Storm topology that determines trending topics on Twitter based on hashtags."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/12/2016"
   ms.author="larryfr"/>

#Determine Twitter trending topics with Apache Storm on HDInsight

Learn how to use Trident to create a Storm topology that determines trending topics (hash tags) on Twitter.

Trident is a high-level abstraction that provides tools such as joins, aggregations, grouping, functions, and filters. Additionally, Trident adds primitives for doing stateful, incremental processing. This example demonstrates how you can build a topology using a custom spout, function, and several built-in functions provided by Trident.

> [AZURE.NOTE] This example is heavily based on the [Trident Storm](https://github.com/jalonsoramos/trident-storm) example by Juan Alonso.

##Requirements

* <a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html" target="_blank">Java and the JDK 1.7</a>

* <a href="http://maven.apache.org/what-is-maven.html" target="_blank">Maven</a>

* <a href="http://git-scm.com/" target="_blank">Git</a>

* A Twitter developer account

##Download the project

Use the following code to clone the project locally.

	git clone https://github.com/Blackmist/TwitterTrending

##Topology

The topology for this example is as follows:

![topology](./media/hdinsight-storm-twitter-trending/trident.png)

> [AZURE.NOTE] This is a simplified view of the topology. Multiple instances of the components will be distributed across the nodes in the cluster.

The Trident code that implements the topology is as follows:

	topology.newStream("spout", spout)
	    .each(new Fields("tweet"), new HashtagExtractor(), new Fields("hashtag"))
	    .groupBy(new Fields("hashtag"))
	    .persistentAggregate(new MemoryMapState.Factory(), new Count(), new Fields("count"))
	    .newValuesStream()
	    .applyAssembly(new FirstN(10, "count"))
		.each(new Fields("hashtag", "count"), new Debug());

This code does the following:

1. Creates a new stream from the spout. The spout retrieves tweets from Twitter, and filters them for specific keywords (love, music, and coffee in this example).

2. HashtagExtractor, a custom function, is used to extract hash tags from each tweet. These are emitted to the stream.

3. The stream is grouped by hash tag, and passed to an aggregator. This aggregator creates a count of how many times each hash tag has occurred. This data is persisted in memory. Finally, a new stream is emitted that contains the hash tag and the count.

4. Because we are only interested in the most popular hash tags for a given batch of tweets, the **FirstN** assembly is applied to return only the top 10 values, based on the count field.

> [AZURE.NOTE] Other than the spout and HashtagExtractor, we are using built-in Trident functionality.
>
> For information about built-in operations, see <a href="https://storm.apache.org/apidocs/storm/trident/operation/builtin/package-summary.html" target="_blank">Package storm.trident.operation.builtin</a>.
>
> For Trident-state implementations other than MemoryMapState, see the following:
>
> * <a href="https://github.com/fhussonnois/storm-trident-elasticsearch" target="_blank">Storm Trident elastic search</a>
>
> * <a href="https://github.com/kstyrc/trident-redis" target="_blank">trident-redis</a>

###The spout

The spout, **TwitterSpout**, uses <a href="http://twitter4j.org/en/" target="_blank">Twitter4j</a> to retrieve tweets from Twitter. A filter is created (love, music, and coffee in this example), and the incoming tweets (status) that match the filter are stored in a linked blocking queue. (For more information, see <a href="http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/LinkedBlockingQueue.html" target="_blank">Class LinkedBlockingQueue</a>.) Finally, items are pulled off the queue and emitted to the topology.

###The HashtagExtractor

To extract hash tags, <a href="http://twitter4j.org/javadoc/twitter4j/EntitySupport.html#getHashtagEntities--" target="_blank">getHashtagEntities</a> is used to retrieve all hash tags that are contained in the tweet. These are then emitted to the stream.

##Enable Twitter

Use the following steps to register a new Twitter application and obtain the consumer and access token information needed to read from Twitter:

1. Go to <a href="https://apps.twitter.com" target="_blank">Twitter Apps</a> and click the **Create new app** button. When filling in the form, leave the **Callback URL** field empty.

2. When the app is created, click the **Keys and Access Tokens** tab.

3. Copy the **Consumer Key** and **Consumer Secret** information.

4. At the bottom of the page, select **Create my access token** if no tokens exist. When the tokens have been created, copy the **Access Token** and **Access Token Secret** information.

5. In the **TwitterSpoutTopology** project you previously cloned, open the **resources/twitter4j.properties** file, add the information you gathered in the previous steps, and then save the file.

##Build the topology

Use the following code to build the project:

		cd [directoryname]
		mvn compile

##Test the topology

Use the following command to test the topology locally:

	mvn compile exec:java -Dstorm.topology=com.microsoft.example.TwitterTrendingTopology

After the topology starts, you should see debug information that contains the hash tags and counts emitted by the topology. The output should appear similar to the following:

	DEBUG: [Quicktellervalentine, 7]
	DEBUG: [GRAMMYs, 7]
	DEBUG: [AskSam, 7]
	DEBUG: [poppunk, 1]
	DEBUG: [rock, 1]
	DEBUG: [punkrock, 1]
	DEBUG: [band, 1]
	DEBUG: [punk, 1]
	DEBUG: [indonesiapunkrock, 1]

##Next steps

Now that you have tested the topology locally, discover how to deploy the topology: [Deploy and manage Apache Storm topologies on HDInsight](hdinsight-storm-deploy-monitor-topology.md).

You may also be interested in the following Storm topics:

* [Develop Java topologies for Storm on HDInsight using Maven](hdinsight-storm-develop-java-topology.md)

* [Develop C# topologies for Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md)

For more Storm examples for HDinsight:

* [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)
