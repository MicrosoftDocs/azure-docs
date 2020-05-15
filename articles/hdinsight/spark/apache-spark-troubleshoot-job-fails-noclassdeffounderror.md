---
title: NoClassDefFoundError - Apache Spark with Apache Kafka data in Azure HDInsight
description: Apache Spark streaming job that reads data from an Apache Kafka cluster fails with a NoClassDefFoundError in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/29/2019
---

# Apache Spark streaming job that reads Apache Kafka data fails with NoClassDefFoundError in HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

The Apache Spark cluster runs a Spark streaming job that reads data from an Apache Kafka cluster. The Spark streaming job fails if the Kafka stream compression is turned on. In this case, the Spark streaming Yarn app application_1525986016285_0193 failed, due to error:

```
18/05/17 20:01:33 WARN YarnAllocator: Container marked as failed: container_e25_1525986016285_0193_01_000032 on host: wn87-Scaled.2ajnsmlgqdsutaqydyzfzii3le.cx.internal.cloudapp.net. Exit status: 50. Diagnostics: Exception from container-launch.
Container id: container_e25_1525986016285_0193_01_000032
Exit code: 50
Stack trace: ExitCodeException exitCode=50: 
 at org.apache.hadoop.util.Shell.runCommand(Shell.java:944)
```

## Cause

This error can be caused by specifying a version of the `spark-streaming-kafka` jar file that is different than the version of the Kafka cluster you are running.

For example, if you are running a Kafka cluster version 0.10.1, the following command will result in an error:

```
spark-submit \
--packages org.apache.spark:spark-streaming-kafka-0-8_2.11:2.2.0
--conf spark.executor.instances=16 \
...
~/Kafka_Spark_SQL.py <bootstrap server details>
```

## Resolution

Use the Spark-submit command with the `–packages` option, and ensure that the version of the spark-streaming-kafka jar file is the same as the version of the Kafka cluster that you are running.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
