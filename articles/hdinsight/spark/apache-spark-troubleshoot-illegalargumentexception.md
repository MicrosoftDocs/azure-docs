---
title: IllegalArgumentException error for Apache Spark - Azure HDInsight
description: IllegalArgumentException for Apache Spark activity in Azure HDInsight for Azure Data Factory 
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/29/2019
---

# Scenario: IllegalArgumentException for Apache Spark activity in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

You receive the following exception when trying to execute a Spark activity in an Azure Data Factory pipeline:

```error
Exception in thread "main" java.lang.IllegalArgumentException:
Wrong FS: wasbs://additional@xxx.blob.core.windows.net/spark-examples_2.11-2.1.0.jar, expected: wasbs://wasbsrepro-2017-11-07t00-59-42-722z@xxx.blob.core.windows.net
```

## Cause

A Spark job will fail if the application jar file is not located in the Spark cluster’s default/primary storage.

This is a known issue with the Spark open-source framework tracked in this bug: [Spark job fails if fs.defaultFS and application jar are different url](https://issues.apache.org/jira/browse/SPARK-22587).

This issue has been resolved in Spark 2.3.0.

## Resolution

Make sure the application jar is stored on the default/primary storage for the HDInsight cluster. In case of Azure Data Factory, make sure the ADF linked service is pointed to the HDInsight default container rather than a secondary container.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
