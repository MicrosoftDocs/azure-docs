---
title: What is Apache Flink in Azure HDInsight on AKS? (Preview)
description: An introduction to Apache Flink in Azure HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# What is Apache Flink in Azure HDInsight on AKS? (Preview)

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

[Apache Flink](https://flink.apache.org/) is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. Flink has been designed to run in all common cluster environments, perform computations and stateful streaming applications at in-memory speed and at any scale. Applications are parallelized into possibly thousands of tasks that are distributed and concurrently executed in a cluster. Therefore, an application can use unlimited amounts of vCPUs, main memory, disk and network IO. Moreover, Flink easily maintains large application state. Its asynchronous and incremental checkpointing algorithm ensures minimal influence on processing latencies while guaranteeing exactly once state consistency.

Apache Flink is a massively scalable analytics engine for stream processing. 

Some of the key features that Flink offers are:

- Operations on bounded and unbounded streams
- In memory performance
- Ability for both streaming and batch computations
- Low latency, high throughput operations
- Exactly once processing
- High Availability
- State and fault tolerance
- Fully compatible with Hadoop ecosystem
- Unified SQL APIs for both stream and batch

:::image type="content" source="./media/flink-overview/flink-architecture-new.png" alt-text="Flink architectural diagram.":::

## Why Apache Flink?

Apache Flink is an excellent choice to develop and run many different types of applications due to its extensive features set. Flink’s features include support for stream and batch processing, sophisticated state management, event-time processing semantics, and exactly once consistency guarantees for state.  Flink doesn't have a single point of failure. Flink has been proven to scale to thousands of cores and terabytes of application state, delivers high throughput and low latency, and powers some of the world’s most demanding stream processing applications.

- **Fraud detection**: Flink can be used to detect fraudulent transactions or activities in real time by applying complex rules and machine learning models on streaming data.
- **Anomaly detection**: Flink can be used to identify outliers or abnormal patterns in streaming data, such as sensor readings, network traffic, or user behavior. 
- **Rule-based alerting**: Flink can be used to trigger alerts or notifications based on predefined conditions or thresholds on streaming data, such as temperature, pressure, or stock prices.
- **Business process monitoring**: Flink can be used to track and analyze the status and performance of business processes or workflows in real time, such as order fulfillment, delivery, or customer service.
- **Web application (social network)**: Flink can be used to power web applications that require real-time processing of user-generated data, such as messages, likes, comments, or recommendations.
  
Read more on common use cases described on [Apache Flink Use cases](https://flink.apache.org/use-cases/#use-cases)

## Apache Flink Cluster Deployment Types
Flink can execute applications in Session mode or Application mode. Currently HDInsight on AKS supports only Session clusters. You can run multiple Flink jobs on a Session cluster. 

## Apache Flink Job Management

Flink schedules jobs using three distributed components, Job manager, Task manager, and Job Client, which are set in a Leader-Follower pattern.  

**Flink Job**: A Flink job or program  consists of multiple tasks. Tasks are the basic unit of execution in Flink. Each Flink task has multiple instances depending on the level of parallelism and each instance is executed on a TaskManager. 

**Job manager**: Job manager acts as a scheduler and schedules tasks on task managers.

**Task manager**: Task Managers come with one or more slots to execute tasks in parallel.

**Job client**:  Job client communicates with job manager to submit Flink jobs

**Flink Web UI**: Flink features a web UI to inspect, monitor, and debug running applications. 

:::image type="content" source="./media/flink-overview/flink-process.png" alt-text="Flink process diagram showing how the job, Job manager, Task manager, and Job client work together.":::

## Checkpoints in Apache Flink

Every function and operator in Flink can be stateful. Stateful functions store data across the processing of individual elements/events, making state a critical building block for any type of more elaborate operation. In order to make state fault tolerant, Flink needs to **checkpoint the state**. Checkpoints allow Flink to recover state and positions in the streams to give the application the same semantics as a failure-free execution that means they play an important role for Flink to recover from failure both its state and the corresponding stream positions.

Checkpointing is enabled in HDInsight on AKS Flink by default. Default settings on HDInsight on AKS maintain the last five checkpoints in persistent storage. In case, your job fails, the job can be restarted from the latest checkpoint. 

## State Backends

Backends determine where state is stored. Stream processing applications are often stateful, *remembering* information from processed events and using it to influence further event processing. In Flink, the remembered information, that is, state, is stored locally in the configured state backend. 

When checkpointing is activated, such state is persisted upon checkpoints to guard against data loss and recover consistently. How the state is represented internally, and how and where it's persisted upon checkpoints depends on the chosen **State Backend**. HDInsight on AKS uses the RocksDB  as default StateBackend.

**Supported state backends:**

* HashMapStateBackend
* EmbeddedRocksDBStateBackend

### The HashMapStateBackend

The `HashMapStateBackend` holds data internally as objects on the Java heap. Key/value state and window operators hold hash tables that store the values, triggers, etc.

The HashMapStateBackend is encouraged for:

* Jobs with large state, long windows, large key/value states.
* All high-availability setups.

it 's also recommended to set managed memory to zero. This value ensures that the maximum amount of memory is allocated for user code on the JVM.
Unlike `EmbeddedRocksDBStateBackend`, the `HashMapStateBackend` stores data as objects on the heap so that it 's unsafe to reuse objects.

### The EmbeddedRocksDBStateBackend

The `EmbeddedRocksDBStateBackend` holds in-flight data in a [RocksDB](http://rocksdb.org) database that is (per default). Unlike storing java objects in `HashMapStateBackend`, data is stored as serialized byte arrays, which mainly define the type serializer, resulting in key comparisons being byte-wise instead of using Java’s `hashCode()` and `equals()` methods.

By default, we use RocksDb as the state backend. RocksDB is an embeddable persistent key-value store for fast storage.

```
state.backend: rocksdb
state.checkpoints.dir: <STORAGE_LOCATION>
```
By default, HDInsight on AKS stores the checkpoints in the storage account configured by the user, so that the checkpoints are persisted.

### Incremental Checkpoints

RocksDB supports Incremental Checkpoints, which can dramatically reduce the checkpointing time in comparison to full checkpoints. Instead of producing a full, self-contained backup of the state backend, incremental checkpoints only record the changes that happened since the latest completed checkpoint. An incremental checkpoint builds upon (typically multiple) previous checkpoints. 

Flink applies RocksDB’s internal compaction mechanism in a way that is self-consolidating over time. As a result, the incremental checkpoint history in Flink doesn't grow indefinitely, and old checkpoints are eventually subsumed and pruned automatically. Recovery time of incremental checkpoints may be longer or shorter compared to full checkpoints. If your network bandwidth is the bottleneck, it may take a bit longer to restore from an incremental checkpoint, because it implies fetching more data (more deltas). 

Restore from an incremental checkpoint is faster, if the bottleneck is your CPU or IOPs, because restore from an incremental checkpoint means not to rebuild the local RocksDB tables from Flink’s canonical key value snapshot format (used in savepoints and full checkpoints).

While we encourage the use of incremental checkpoints for large state, you need to enable this feature manually:

* Setting a default in your `flink-conf.yaml: state.backend.incremental: true` enables incremental checkpoints, unless the application overrides this setting in the code. This statement is true by default.
* You can alternatively configure this value directly in the code (overrides the config default): 

```
EmbeddedRocksDBStateBackend` backend = new `EmbeddedRocksDBStateBackend(true);
```

By default, we preserve the last five checkpoints in the checkpoint dir configured. 

This value can be changed by changing the following config"

`state.checkpoints.num-retained: 5`

## Windowing in Flink

Windowing is a key feature in stream processing systems such as Apache Flink. Windowing splits the continuous stream into finite batches on which computations can be performed. In Flink, windowing can be done on the entire steam or per-key basis.

Windowing refers to the process of dividing a stream of events into finite, nonoverlapping  segments called windows. This feature allows users to perform computations on specific subsets of data based on time or key-based criteria. 

Windows allow users to split the streamed data into segments that can be processed. Due to the unbounded nature of data streams, there's no situation where all the data is available, because users would be waiting indefinitely for new data points to arrive - so instead, windowing offers a way to define a subset of data points that you can then process and analyze. The trigger defines when the window is considered ready for processing, and the function set for the window specifies how to process the data. 

Learn [more](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/dev/datastream/operators/windows/)

### Reference

[Apache Flink](https://flink.apache.org/)
