---
title: Error message not shown in Apache Hive View - Azure HDInsight
description: Query fails in Apache Hive View without any details on Azure HDInsight cluster.
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/30/2019
---

# Scenario: Query error message not displayed in Apache Hive View in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

The Apache Hive View query error message will look something like this, without further information:

```
"Failed to execute query. <a href="#/messages/1">(details)</a>"
```

## Cause

Sometimes the error message of a query failure may be too large to display on the Hive View main page.

## Resolution

Check the Notifications tab on the Top-right corner of the Hive_view to see the complete Stacktrace and Error Message.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
