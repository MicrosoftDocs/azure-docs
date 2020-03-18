---
title: Joins in Apache Hive leads to OutOfMemory error - Azure HDInsight
description: Dealing with OutOfMemory errors "GC overhead limit exceeded error"
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/30/2019
---

# Scenario: Joins in Apache Hive leads to an OutOfMemory error in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

The default behavior for Apache Hive joins is to load the entire contents of a table into memory so that a join can be performed without having to perform a Map/Reduce step. If the Hive table is too large to fit into memory, the query can fail.

## Cause

When running joins in hive of sufficient size, the following error is encountered:

```
Caused by: java.lang.OutOfMemoryError: GC overhead limit exceeded error.
```

## Resolution

Prevent Hive from loading tables into memory on joins (instead performing a Map/Reduce step) by setting the following Hive configuration value:

```
hive.auto.convert.join=false
```

## Next steps

If setting this value didn't resolve your issue, visit one of the following...

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
