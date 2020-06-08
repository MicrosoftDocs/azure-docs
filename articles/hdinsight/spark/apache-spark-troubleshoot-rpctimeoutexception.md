---
title: RpcTimeoutException for Apache Spark thrift - Azure HDInsight
description: You see 502 errors when processing large data sets using Apache Spark thrift server
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/29/2019
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

These errors are caused by a lack of memory resources during data processing. If the Java garbage collection process starts, it could lead to the Spark application hanging. Queries will begin to time out and stop processing. The `Futures timed out` error indicates a cluster under severe stress.

## Resolution

Increase the cluster size by adding more worker nodes or increasing the memory capacity of the existing cluster nodes. You can also adjust the data pipeline to reduce the amount of data being processed at once.

The `spark.network.timeout` controls the timeout for all network connections. Increasing the network timeout may allow more time for some critical operations to finish, but this will not resolve the issue completely.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
