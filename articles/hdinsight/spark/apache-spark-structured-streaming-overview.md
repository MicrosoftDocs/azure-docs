---
title: Spark Structured Streaming in Azure HDInsight | Microsoft Docs
description: 'How to use Spark Structured Streaming applications on HDInsight Spark clusters.'
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: maxluk
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/05/2018
ms.author: maxluk
---
# Overview of Spark Structured Streaming

Spark Structured Streaming enables you to implement scalable, high-throughput, fault-tolerant applications for the processing of data streams without having to build programs with specialized streaming constructs in mind. Structured Streaming is built upon the Spark SQL engine, and improves upon the constructs from Spark SQL Data Frames and Datasets that enable you to write streaming queries in the same way you would write batch queries.  

You can run your  Structured Streaming applications on HDInsight Spark clusters, and connect it to process data in a streaming fashion from Kafka, a TCP socket (for debugging purposes), Azure Storage and Azure Data Lake Store. The latter two options which rely on external storage services enable you to watch for new files added into storage and process their content as if it were streamed. 

Structured Streaming creates a long running query during which you are able to apply operations to the input data- such as selection, projection, aggregation, windowing and joining the streaming DataFrame with reference DataFrames and then output the result to file storage (Azure Storage Blobs or Data Lake Store) or to any datastore via custom code (such as SQL Database or Power BI). It also provides convenient output to the console which is useful when debugging locally and to an in-memory table which lets you peek at the data generated when debugging in HDInsight. 

![Stream Processing with HDInsight and Spark Structured Streaming ](./media/hdinsight-spark-structured-streaming-overview/hdinsight-spark-structured-streaming.png)


> [!NOTE]
> Spark Structured Streaming is intended to be the replacement for Spark Streaming (DStreams). This means  going forward, Structured Streaming will receive enhancments and maintenance, whereas DStreams will be in maintenance mode only. It is important to note, however, that Structured Streaming is currently not as feature complete as DStreams when it comes to the sources and sinks that it supports out of the box, so you should evaluate your requirements first before choosing the appropriate Spark stream processing option. 

## Streams as Tables
Spark Structured Streaming takes the perspective that a stream of data can be represented as a table that is unbounded in height- in other words it continues to grow as new data arrives. This Input Table is continously processed by a long running query, and the results flushed out to an Output Table. This concept is best explained with the following illustration:

![Structured Streaming Concept](./media/hdinsight-spark-structured-streaming-overview/hdinsight-spark-structured-streaming-concept.png)

In Structured Streaming data arrives at the system and is immediately ingested into an Input Table. You write queries (using the DataFrame and Dataset APIs) that perform operations against this Input Table. The query output yields another table, called the Results Table. The Results Table contains results of your query from which you draw any data you would send to an external datastore (such a relational database). The timing of when data is processed from the Input Table is controlled by the trigger interval. By default Structured Streaming tries to process the data as soon as it arrives. In practice this means as soon as it is done processing the run of the previous query, it starts another processing run against any newly received data. However, you can also configure the trigger to run on a longer interval, so that the streaming data is processed according to time-based batches. 

With regards to the output, the data in the Results Tables may be completely refreshed everytime there is new data so that it includes all of the output data since the streaming query began, or it may only contain just the data that is new since the last time the query was processed. This behavior is controlled by the output mode. Let's look at examples of each of these modes in turn. 

### Append Mode
In Append Mode, only the rows added to the Results Table since the last query run will be present in the Results Table and written to external storage. This is best explained by example. Suppose you have the simplest form of query that just copies all data from the Input Table to the Results Table unaltered. Every time a trigger happens, the new data is processed and the rows representing that new data appear in the Results Table. 

Consider a scenario where you are processing telemetry from temperature sensors, like thermostats. Assume the first trigger processed one event at time 00:01 for device 1 having a temperature reading of 95 degrees. In the first trigger of the query, only the row with time 00:01 would appear in the Results Table. Consider what happens at time 00:02 when another event arrives. In this case, the only new row would be the row with time 00:02 and so the Results Table would contain only one row- the one with the time of 00:02 as shown in the illustration. 

![Structured Streaming Append Mode](./media/hdinsight-spark-structured-streaming-overview/hdinsight-spark-structured-streaming-append-mode.png)

Of course, this is a trivial example query. Most likely when using the Append Mode in this way, your query would be applying projections (e.g., selecting the columns it cares about), filtering (e.g., picking only rows that match certain conditions) or joining (e.g., augmenting the data with data from a static lookup table). The Append Mode is useful, because it makes it easy to push only the relevant, new data points out to external storage.

### Complete Mode
Now let's consider the same scenario, but apply the Complete Mode. In the Complete Mode, the entire Output Table is refreshed on every trigger so that it includes data not just from the most recent trigger run, but from all runs. In the trivial example we showed earlier, we could use the Complete Mode to copy the data unaltered from the Input Table to the Results Table. On every trigger run, the new result rows would appear along with all the previous rows. Naturally, this means that the Output Results table would end up storing all of the data collected since the query began- you would eventually run out of memory. This is why Complete Mode is intended for use with aggregate queries, which effectively summarize the data in some way and on every trigger the Results Table is updated with a new summary. 

Let's use the following illustration as an example. Assume so far we have already processed 5 seconds worth of data and are looking at the result of processing the data for the sixth second. In our Input Table, we have collected events for time 00:01 and time 00:03. Let's assume the goal of our query is to tell us the average temperature of the device every five seconds. The implementation of this query has to apply an aggregate that takes all of the values that fall within each 5 second window of time, and averages the temperature and produces a row that represents the average temperature for that interval. At the end of the first 5 second window, we have two tuples that appear in the interval: (00:01, 1, 95) and (00:03, 1, 98). So for the window 00:00-00:05 we get a tuple with the average temperature of 96.5 degrees (the average of 95 and 98 is 96.5). Now let's consider what happens at the next 5 second window. In that window we only have one data point at time 00:06, to the resulting average temperature is 98 degrees. At time 00:10, when we use the Complete Mode, the Results Table will have the rows for both windows 00:00-00:05 and 00:05-00:10 because the query will output all the aggregated rows, not just the new ones. In other words, the Results Table will continue to grow as new windows are added.    

![Structured Streaming Append Mode](./media/hdinsight-spark-structured-streaming-overview/hdinsight-spark-structured-streaming-complete-mode.png)

It is important to realize that not all queries using Complete Mode will always cause the table to grow without bounds- and this is where Complete Mode is ideal. Consider in the above example that instead of averaging the temperature by time window, we averaged instead by the device ID. The Result Table would contain a fixed number of rows (one per device) with the average temperature for the device across all data points received from that device. As new temperatures are received, the Results Table would be updated so that the averages in the table are always current. 


## Components of a Spark Structured Streaming Application
Let's examine a simple example query that shows how the aforementioned concepts look in a Spark Structured Streaming query. In this case, we will build up a query that summarize the temperature readings by hour-long window. For simplicity, the data we use is stored in JSON files in Azure Storage (attached as the default storage for the HDInsight cluster). The data in one JSON files looks like the following:

    {"time":1469501107,"temp":"95"}
    {"time":1469501147,"temp":"95"}
    {"time":1469501202,"temp":"95"}
    {"time":1469501219,"temp":"95"}
    {"time":1469501225,"temp":"95"}

These JSON files are stored in the "temps" subfolder, underneath the container used by the HDInsight cluster. 

### Define the input source
First you need to configure a DataFrame that describes the source of the data and any settings required by that source. In our example, we draw from the JSON files in Azure Storage and apply a schema to them at read time.  

    import org.apache.spark.sql.types._
    import org.apache.spark.sql.functions._

    //This is the cluster-local path to the folder containing the JSON files
    val inputPath = "/temps/" 

    //Define the schema of the JSON files as having the "time" of type TimeStamp and the "temp" field of type String
    val jsonSchema = new StructType().add("time", TimestampType).add("temp", StringType) 

    //Create a Streaming DataFrame by calling readStream and configuring it with schema and path
    val streamingInputDF = spark.readStream.schema(jsonSchema).json(inputPath) 

#### Apply the query
Next, you apply a query that contains the operation you want against the Streaming DataFrame. In this case, we apply an aggregation that groups all the rows into 1 hour windows, and then computes the minimum temperature, average temperature and max temperature in that 1 hour window.

    val streamingAggDF = streamingInputDF.groupBy(window($"time", "1 hour")).agg(min($"temp"), avg($"temp"), max($"temp"))

### Define the output sink
Next, you define the destination for the rows that are added to the ResultsTable within each trigger interval. In this case, we want simply want to output all of the rows to an in-memory table called "temps" that we can later query with SparkSQL. Notice we use the output mode of Complete so that all rows for all windows are output, everytime.

    val streamingOutDF = streamingAggDF.writeStream.format("memory").queryName("temps").outputMode("complete") 

### Start the query
Start the streaming query and run until a termination signal is received. 

    val query = streamingOutDF.start()  

### View the results
While the query is running, in the same SparkSession, we can run a SparkSQL query against the "temps" table in which the query results are being stored. 

    select * from temps

This would yield results similar to the following:


| window |	min(temp) |	avg(temp) |	max(temp) |
| --- | --- | --- | --- |
|{u'start': u'2016-07-26T02:00:00.000Z', u'end'... |	95 |	95.231579 |	99 |
|{u'start': u'2016-07-26T03:00:00.000Z', u'end'...	|95 |	96.023048 |	99 |
|{u'start': u'2016-07-26T04:00:00.000Z', u'end'...	|95 |	96.797133 |	99 |
|{u'start': u'2016-07-26T05:00:00.000Z', u'end'...	|95 |	96.984639 |	99 |
|{u'start': u'2016-07-26T06:00:00.000Z', u'end'...	|95 |	97.014749 |	99 |
|{u'start': u'2016-07-26T07:00:00.000Z', u'end'...	|95 |	96.980971 |	99 |
|{u'start': u'2016-07-26T08:00:00.000Z', u'end'...	|95 |	96.965997 |	99 |  

For details on the Spark Structured Stream API, along with the input data sources, operations and output sinks it supports see [Spark Structured Streaming Programming Guide](http://spark.apache.org/docs/2.1.0/structured-streaming-programming-guide.html).


## Checkpointing and Write Ahead Logs
In order to deliver resiliency and fault tolerance, Structured Streaming relies on checkpointing to insure that stream processing can continue uninterrupted, even in the face of node failures. In HDInsight, Spark creates checkpoints to durable storage (Azure Storage or Data Lake Store). These checkpoints store the progress information about the streaming query. In addition, Structured Streaming utilizes a Write Ahead Log. The purpose of the WAL is to capture ingested data that has been received but not processed by a query, so if a failure occurs and processing is restarted the events received from the source are not lost.


## Deploying Spark Streaming Applications
You typically build your Structured Streaming application locally and then deploy them to Spark on HDInsight by copying the JAR file that contains your application to the default storage attached to your HDInsight cluster. Then you can start your application by using the LIVY REST API's available from your cluster. This is a POST operation where the body of the POST includes a JSON document that provides the path to your JAR, the name of the class whose main method defines and runs the streaming application, and optionally the resource requirements of the job (e.g., number of executors, memory and cores), and any configuration settings your application code requires. 

![Example Window with Temperature Events After Sliding](./media/hdinsight-spark-streaming-overview/hdinsight-spark-streaming-livy.png)

The status of all applications can also be checked with a GET request against a LIVY endpoint. Finally, you can terminate a running application by issuing a DELETE request against the LIVE endpoint. For details on the LIVY API, see [Remote jobs with LIVY](apache-spark-livy-rest-interface.md)

## Next steps

* [Create an Apache Spark cluster in HDInsight](../hdinsight-hadoop-create-linux-clusters-portal.md)
* [Spark Structured Streaming Programming Guide](http://spark.apache.org/docs/2.1.0/structured-streaming-programming-guide.html)
* [Launch Spark jobs remotely with LIVY](apache-spark-livy-rest-interface.md)