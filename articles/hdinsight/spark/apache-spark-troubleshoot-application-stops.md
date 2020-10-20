---
title: Apache Spark Streaming application stops after 24 days in Azure HDInsight
description: An Apache Spark Streaming application stops after executing for 24 days and there are no errors in the log files. 
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/29/2019
---

# Scenario: Apache Spark Streaming application stops after executing for 24 days in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

An Apache Spark Streaming application stops after executing for 24 days and there are no errors in the log files.

## Cause

The `livy.server.session.timeout` value controls how long Apache Livy should wait for a session to complete. Once the session length reaches the `session.timeout` value, the Livy session and the application are automatically killed.

## Resolution

For long running jobs, increase the value of `livy.server.session.timeout` using the Ambari UI. You can access the Livy configuration from the Ambari UI using the URL `https://<yourclustername>.azurehdinsight.net/#/main/services/LIVY/configs`.

Replace `<yourclustername>` with the name of your HDInsight cluster as shown in the portal.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
