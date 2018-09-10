---
title: Create Spark Streaming jobs with exactly-once event processing - Azure HDInsight
description: How to set up Spark Streaming to process an event once and only once.
services: hdinsight
ms.service: hdinsight
author: jasonwhowell
ms.author: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/26/2018
---
# Create Spark Streaming jobs with exactly-once event processing

Stream processing applications take different approaches to how they handle re-processing messages after some failure in the system:

* At least once: Each message is guaranteed to be processed, but it may get processed more than once.
* At most once: Each message may or may not be processed. If a message is processed, it is only processed once.
* Exactly once: Each message is guaranteed to be processed once and only once.

This article shows you how to configure Spark Streaming to achieve exactly-once processing.

## Exactly-once semantics with Spark Streaming

First, consider how all system points of failure restart after having an issue, and how you can avoid data loss. A Spark Streaming application has:

* An input source
* One or more receiver processes that pull data from the input source
* Tasks that process the data
* An output sink
* A driver process that manages the long-running job

Exactly-once semantics require that no data is lost at any point, and that message processing is restartable, regardless of where the failure occurs.

### Replayable sources

The source your Spark Streaming application is reading your events from must be *replayable*. This means that in cases where the message was retrieved but then the system failed before the message could be persisted or processed, the source must provide the same message again.

In Azure, both Azure Event Hubs and Kafka on HDInsight provide replayable sources. Another example of a replayable source is a fault-tolerant file system like HDFS, Azure Storage blobs, or Azure Data Lake Store, where all data is kept forever and at any point you can re-read the data in its entirety.

### Reliable receivers

In Spark Streaming, sources like Event Hubs and Kafka have *reliable receivers*, where each receiver keeps track of its progress reading the source. A reliable receiver persists its state into fault-tolerant storage, either within ZooKeeper or in Spark Streaming checkpoints written to HDFS. If such a receiver fails and is later restarted, it can pick up where it left off.

### Use the Write-Ahead Log

Spark Streaming supports the use of a Write-Ahead Log, where each received event is first written to Spark's checkpoint directory in fault-tolerant storage and then stored in a Resilient Distributed Dataset (RDD). In Azure, the fault-tolerant storage is HDFS backed by either Azure Storage or Azure Data Lake Store. In your Spark Streaming application, the Write-Ahead Log is enabled for all receivers by setting the `spark.streaming.receiver.writeAheadLog.enable` configuration setting to `true`. The Write-Ahead Log provides fault tolerance for failures of both the driver and the executors.

For workers running tasks against the event data, each RDD is by definition both replicated and distributed across multiple workers. If a task fails because the worker running it crashed, the task will be restarted on another worker that has a replica of the event data, so the event is not lost.

### Use checkpoints for drivers

The job drivers need to be restartable. If the driver running your Spark Streaming application crashes, it takes down with it all running receivers, tasks, and any RDDs storing event data. In this case, you need to be able to save the progress of the job so you can resume it later. This is accomplished by checkpointing the Directed Acyclic Graph (DAG) of the DStream periodically to fault-tolerant storage. The DAG metadata includes the configuration used to create the streaming application, the operations that define the application, and any batches that are queued but not yet completed. This metadata enables a failed driver to be restarted from the checkpoint information. When the driver restarts, it will launch new receivers that themselves recover the event data back into RDDs from the Write-Ahead Log.

Checkpoints are enabled in Spark Streaming in two steps. 

1. In the StreamingContext object, configure the storage path for the checkpoints:

    val ssc = new StreamingContext(spark, Seconds(1))
    ssc.checkpoint("/path/to/checkpoints")

    In HDInsight, these checkpoints should be saved to the default storage attached to your cluster, either Azure Storage or Azure Data Lake Store.

2. Next, specify a checkpoint interval (in seconds) on the DStream. At each interval, state data derived from the input event is persisted to storage. Persisted state data can reduce the computation needed when rebuilding the state from the source event.

    val lines = ssc.socketTextStream("hostname", 9999)
    lines.checkpoint(30)
    ssc.start()
    ssc.awaitTermination()

### Use idempotent sinks

The destination sink to which your job writes results must be able to handle the situation where it is given the same result more than once. The sink must be able to detect such duplicate results and ignore them. An *idempotent* sink can be called multiple times with the same data with no change of state.

You can create idempotent sinks by implementing logic that first checks for the existence of the incoming result in the datastore. If the result already exists, the write should appear to succeed from the perspective of your Spark job, but in reality your data store ignored the duplicate data. If the result does not exist, then the sink should insert this new result into its storage. 

For example, you could use a stored procedure with Azure SQL Database that inserts events into a table. This stored procedure first looks up the event by key fields, and only when no matching event found is the record inserted into the table.

Another example is to use a partitioned file system, like Azure Storage blobs or Azure Data Lake store. In this case your sink logic does not need to check for the existence of a file. If the file representing the event exists, it is simply overwritten with the same data. Otherwise, a new file is created at the computed path.

## Next steps

* [Spark Streaming Overview](apache-spark-streaming-overview.md)
* [Creating highly available Spark Streaming jobs in YARN](apache-spark-streaming-high-availability.md)
