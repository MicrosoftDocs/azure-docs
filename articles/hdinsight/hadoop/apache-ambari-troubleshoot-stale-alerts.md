---
title: Stale Apache Ambari alerts in Azure HDInsight
description: Discussion and analysis of possible reasons and solutions for stale Apache Ambari alerts in HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 01/22/2020
---

# Scenario: Stale Apache Ambari alerts in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

In the Apache Ambari UI, you might see an alert like this:

![Apache Ambari stale alert example](./media/apache-ambari-troubleshoot-stale-alerts/ambari-stale-alerts-example.png)

## Cause

Ambari agents continuously monitor the health of many resources. Each health check, or *alert*, is configured to run at predefined time intervals. After each alert runs, Ambari agents report back the status to the Ambari server. An alert that doesn't run on time is considered *stale*. If the Ambari server detects any stale alerts, it triggers an "Ambari Server Alerts" alert.

There are various reasons why a health check might not run at its defined interval:

* The hosts are under heavy use (high CPU), so that the Ambari agent can't get enough system resources to run the alerts on time.

* The cluster is busy executing many jobs or services during a period of heavy load.

* A small number of hosts in the cluster host many components and are therefore required to run many alerts. If the number of components is large, alert jobs might miss their scheduled intervals.

## Resolution

Try the following methods to resolve problems with stale Ambari alerts.

### Increase the alert interval time

You can increase the value of an individual alert interval, based on your cluster's response time and load:

1. In the Apache Ambari UI, select the **Alerts** tab.
1. Select the alert definition name that you want.
1. From the definition, select **Edit**.
1. Increase the **Check Interval** value, and then select **Save**.

### Increase the alert interval time for Ambari Server Alerts

1. In the Apache Ambari UI, select the **Alerts** tab.
1. From the **Groups** drop-down list, select **AMBARI Default**.
1. Select the **Ambari Server Alerts** alert.
1. From the definition, select **Edit**.
1. Increase the **Check Interval** value.
1. Increase the **Interval Multiplier** value, and then select **Save**.

### Disable and reenable the alert

To discard a stale alert, disable and then reenable it:

1. In the Apache Ambari UI, select the **Alerts** tab.
1. Select the alert definition name that you want.
1. From the definition, select **Enabled** on the far right part of the UI.
1. In the **Confirmation** pop-up window, select **Confirm Disable**.
1. Wait a few seconds for all the alert "instances" shown on the page to be cleared.
1. From the definition, select **Disabled** on the far right part of the UI.
1. In the **Confirmation** pop-up window, select **Confirm Enable**.

### Increase the alert grace period

Before an Ambari agent reports that a configured alert missed its schedule, there's a grace period. If the alert missed its scheduled time but was triggered within the alert grace period, the stale alert isn't fired.

The default `alert_grace_period` value is 5 seconds. This `alert_grace_period` setting is configurable in `/etc/ambari-agent/conf/ambari-agent.ini`. For those hosts from which stale alerts are fired at regular intervals, try increasing the value to 10. Then, restart the Ambari agent.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
