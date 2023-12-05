---
title: Port conflict when starting services in Azure HDInsight
description: Troubleshooting steps and possible resolutions for port conflict issues when interacting with Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/28/2022
---

# Scenario: Port conflict when starting services in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

A service fails to start.

## Cause

A port conflict exists.

## Resolution

### Method 1

Use below commands to get/kill all the running processes, which are affected by the port issue.

```bash
netstat -lntp | grep <port>
ps -ef | grep <service>
kill -9 <service>
```

Then start service.

### Method 2

Reboot the node.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
