---
title: Reducer is slow in Azure HDInsight
description: Reducer is slow in Azure HDInsight from possible data skewing
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/30/2019
---

# Scenario: Reducer is slow in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

When running a query such as `insert into table1 partition(a,b) select a,b,c from table2` the query plan starts a bunch of reducers but the data from each partition goes to a single reducer. This causes the query to be as slow as the time taken by the largest partition's reducer.

## Cause

Open [beeline](../hadoop/apache-hadoop-use-hive-beeline.md) and verify the value of set `hive.optimize.sort.dynamic.partition`.

The value of this variable is meant to be set to true/false based on the nature of the data.

If the partitions in the input table are less(say less than 10), and so is the number of output partitions, and the variable is set to `true`, this causes data to be globally sorted and written using a single reducer per partition. Even if the number of reducers available is larger, a few reducers may be lagging behind due to data skew and the max parallelism cannot be attained. When changed to `false`, more than one reducer may handle a single partition and multiple smaller files will be written out, resulting in faster insert. This might affect further queries though because of the presence of smaller files.

A value of `true` makes sense when the number of partitions is larger and data is not skewed. In such cases the result of the map phase will be written out such that each partition will be handled by a single reducer resulting in better subsequent query performance.

## Resolution

1. Try to repartition the data to normalize into multiple partitions.

1. If #1 is not possible, set the value of the config to false in beeline session and try the query again. `set hive.optimize.sort.dynamic.partition=false`. Setting the value to false at a cluster level is not recommended. The value of `true` is optimal and set the parameter as necessary based on nature of data and query.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
