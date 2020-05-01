---
title: Unable to log into Azure HDInsight cluster
description: Troubleshoot why unable to log into Apache Hadoop cluster in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 07/31/2019
---

# Scenario: Unable to log into Azure HDInsight cluster

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Unable to log into Azure HDInsight cluster.

## Cause

Reasons may vary. Keep in mind that when logging in to the cluster or app dashboards, use your "cluster login" or HTTP credentials. When connecting remotely, use your Secure Shell (SSH) or Remote Desktop credentials.

## Resolution

To resolve common issues, try one or more of the following steps.

* Try opening the cluster dashboard in a new browser tab in privacy mode.

* If you cannot recall your SSH credentials, you can [reset the credentials within the Ambari UI](../hdinsight-administer-use-portal-linux.md#change-passwords).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
