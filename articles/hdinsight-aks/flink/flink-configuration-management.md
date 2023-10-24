---
title: Apache Flink Configuration Management in HDInsight on AKS
description: Learn about Apache Flink Configuration Management in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: tutorial
ms.date: 08/29/2023
---

# Apache Flink configuration management

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

HDInsight on AKS provides a set of default configurations of Apache Flink for most properties and a few based on common application profiles. However, in case you're required to tweak Flink configuration properties to improve performance for certain applications with state usage, parallelism, or memory settings, you can change certain properties at cluster level using **Configuration management** section in HDInsight on AKS Flink.

1. Go to **Configuration Management** section on your Apache Flink cluster page 

    :::image type="content" source="./media/flink-configuration-management/configuration-page-revised.png" alt-text="Screenshot showing Apache Flink Configuration Management page." lightbox="./media/flink-configuration-management/configuration-page-revised.png":::

2. Update **configurations** as required at *Cluster level*

    :::image type="content" source="./media/flink-configuration-management/update-configuration-revised.png" alt-text="Screenshot showing Apache Flink Update configuration page." lightbox="./media/flink-configuration-management/update-configuration-revised.png":::
 
Here the checkpoint interval is changed at *Cluster level*.

3. Update the changes by clicking **OK** and then **Save**.

Once saved, the new configurations get updated in a few minutes (~5 minutes).

Configurations, which can be updated using Configuration Management Settings

`processMemory size:`

The default settings for the process memory size of or job manager and task manager would be the memory configured by the user during cluster creation. 

This size can be configured by using the below configuration property. In-order to change task manager process memory, use this configuration

`taskmanager.memory.process.size : <value>`

Example:
`taskmanager.memory.process.size : 2000mb`

For job manager,

`jobmanager.memory.process.size : <value>`

> [!NOTE]
> The maximum configurable process memory is equal to the memory configured for `jobmanager/taskmanager`. 

## Checkpoint Interval

The checkpoint interval determines how often Flink triggers a checkpoint. it's defined in milliseconds and can be set using the following configuration property:

`execution.checkpoint.interval: <value>`

Default setting is 60,000 milliseconds (1 min), this value can be changed as desired.

## State Backend

The state backend determines how Flink manages and persists the state of your application. It impacts how checkpoints are stored. You can configure the `state backend using the following property:

`state.backend: <value>`

By default HDInsight on AKS Flink uses rocks db

## Checkpoint Storage Path

We allow persistent checkpoints by default by storing the checkpoints in `abfs` storage as configured by the user. Even if the job fails, since the checkpoints are persisted, it can be easily started with the latest checkpoint.

`state.checkpoints.dir: <path>`
Replace `<path>` with the desired path where the checkpoints are stored.

By default, it's stored in the storage account (ABFS), configured by the user. This value can be changed to any path desired as long as the Flink pods can access it.

## Maximum Concurrent Checkpoints

You can limit the maximum number of concurrent checkpoints by setting the following property:
`checkpoint.max-concurrent-checkpoints: <value>`

Replace `<value>` with the desired maximum number of concurrent checkpoints. For example, 1 to allow only one checkpoint at a time.
 
## Maximum retained checkpoints

You can limit the maximum number of checkpoints to be retained by setting the following property:
`state.checkpoints.num-retained: <value>`
Replace `<value>` with desired maximum number. By default we retain maximum five  checkpoints.

## Savepoint Storage path

We allow persistent savepoints by default by storing the savepoints in `abfs` storage (as configured by the user). If the user wants to stop and later start the job with a particular savepoint, they can configure this location.
state.checkpoints.dir: `<path>`
Replace` <path>` with the desired path where the savepoints are stored.
By default, it's stored in the storage account, configured by the user. (We support ABFS). This value can be changed to any path desired as long as the Flink pods can access it.

## Job manager high availability

In HDInsight on AKS, Flink uses Kubernetes as backend. Even if the Job Manager fails in between due to any known/unknown issue, the pod is restarted within a few seconds. Hence, even if the job restarts due to this issue, the job is recovered back from the **latest checkpoint**. 

### FAQ

**Why does the Job failure in between 
Even if the jobs fail abruptly, if the checkpoints are happening continuously, then the job is restarted by default from the latest checkpoint.** 

Change the job strategy in between?
There are use cases, where the job needs to be modified while in production due to some job level bug. During that time, the user can stop the job, which would automatically take a savepoint and save it in savepoint location.

`bin/flink stop <JOBID>`

Example:

```
root [ ~ ]# ./bin/flink stop 60bdf21d9bc3bc65d63bc3d8fc6d5c54
Suspending job "60bdf21d9bc3bc65d63bc3d8fc6d5c54" with a CANONICAL savepoint.
Savepoint completed. Path: abfs://flink061920231244@f061920231244st.dfs.core.windows.net/8255a11812144c28b4ddf1068460c96b/savepoints/savepoint-60bdf2-7717485d15e3
```

Later the user can start the job  with bug fix pointing to the savepoint.

```
./bin/flink run <JOB_JAR> -d <SAVEPOINT_LOC>
root [ ~ ]# ./bin/flink run examples/streaming/StateMachineExample.jar -s abfs://flink061920231244@f061920231244st.dfs.core.windows.net/8255a11812144c28b4ddf1068460c96b/savepoints/savepoint-60bdf2-7717485d15e3
```
Usage with built-in data generator: StateMachineExample [--error-rate `<probability-of-invalid-transition>] [--sleep <sleep-per-record-in-ms>]`

Usage with Kafka: `StateMachineExample --kafka-topic <topic> [--brokers <brokers>]`

Since savepoint is provided in the job, the Flink knows from where to start processing the data. 


### Reference
[Apache Flink Configurations](https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/config/)
