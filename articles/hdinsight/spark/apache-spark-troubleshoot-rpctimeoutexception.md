---
title: RpcTimeoutException for Apache Spark thrift - Azure HDInsight
description: You see 502 errors when processing large data sets using Apache Spark thrift server
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 09/15/2023
---

# Scenario: RpcTimeoutException for Apache Spark thrift server in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

Spark application fails with a `org.apache.spark.rpc.RpcTimeoutException` exception and a message: `Futures timed out`, as in the following example:

```
org.apache.spark.rpc.RpcTimeoutException: Futures timed out after [120 seconds]. This timeout is controlled by spark.rpc.askTimeout
 at org.apache.spark.rpc.RpcTimeout.org$apache$spark$rpc$RpcTimeout$$createRpcTimeoutException(RpcTimeout.scala:48)
```

`OutOfMemoryError` and `overhead limit exceeded` errors may also appear in the `sparkthriftdriver.log` as in the following example:

```
WARN  [rpc-server-3-4] server.TransportChannelHandler: Exception in connection from /10.0.0.17:53218
java.lang.OutOfMemoryError: GC overhead limit exceeded
```

## Cause

These errors are caused by a lack of memory resources during data processing. If the Java garbage collection process starts, it could lead to the Spark application to stop responding. Queries will begin to time out and stop processing. The `Futures timed out` error indicates a cluster under severe stress.

## Resolution

Increase the cluster size by adding more worker nodes or increasing the memory capacity of the existing cluster nodes. You can also adjust the data pipeline to reduce the amount of data being processed at once.

The `spark.network.timeout` controls the timeout for all network connections. Increasing the network timeout may allow more time for some critical operations to finish, but this will not resolve the issue completely.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
