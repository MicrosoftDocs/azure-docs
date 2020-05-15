---
title: Apache Hive Zeppelin Interpreter error - Azure HDInsight
description: The Apache Zeppelin Hive JDBC Interpreter is pointing to the wrong URL in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/30/2019
---

# Scenario: Apache Hive Zeppelin Interpreter gives a Zookeeper error in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

On an Apache Hive LLAP cluster, the Zeppelin interpreter gives the following error message when attempting to execute a query:

```
java.sql.SQLException: org.apache.hive.jdbc.ZooKeeperHiveClientException: Unable to read HiveServer2 configs from ZooKeeper
```

## Cause

The Zeppelin Hive JDBC Interpreter is pointing to the wrong URL.

## Resolution

1. Navigate to the Hive component summary and copy the "Hive JDBC Url" to the clipboard.

1. Navigate to `https://clustername.azurehdinsight.net/zeppelin/#/interpreter`

1. Edit the JDBC settings: update the hive.url value to the Hive JDBC URL copied in step 1

1. Save, then retry the query

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
