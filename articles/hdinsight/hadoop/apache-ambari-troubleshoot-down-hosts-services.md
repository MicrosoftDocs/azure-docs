---
title: Apache Ambari UI shows down hosts and services in Azure HDInsight
description: Troubleshooting an Apache Ambari UI issue when it shows down hosts and services in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/02/2019
---

# Scenario: Apache Ambari UI shows down hosts and services in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Apache Ambari UI is accessible, but the UI shows almost all services are down, all hosts showing heartbeat lost.

## Cause

In most scenarios, this is an issue with Ambari server not running on the active headnode. Check which headnode is the active headnode and make sure your ambari-server runs on the right one. Don't manually start ambari-server, let failover controller service be responsible for starting ambari-server on the right headnode. Reboot the active headnode to force a failover.

Networking issues can also cause this problem. From each cluster node, see if you can ping `headnodehost`. There is a rare situation where no cluster node can connect to `headnodehost`:

```
$>telnet headnodehost 8440
... No route to host
```

## Resolution

Usually rebooting the active headnode will mitigate this issue. If not please contact HDInsight support team.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
