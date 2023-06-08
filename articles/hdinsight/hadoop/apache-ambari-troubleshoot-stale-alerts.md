---
title: Apache Ambari stale alerts in Azure HDInsight
description: Discussion and analysis of possible reasons and solutions for Apache Ambari stale alerts in HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/07/2023
---

# Scenario: Apache Ambari stale alerts in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

In the Apache Ambari UI, you might see an alert like this:

:::image type="content" source="./media/apache-ambari-troubleshoot-stale-alerts/ambari-stale-alerts-example.png" alt-text="Apache Ambari stale alert example" border="true":::

## Cause

Ambari agents continuously monitor the health of many resources. *Alerts* can be configured to notify you whether specific cluster properties are within predetermined thresholds. After each resource check runs, if the alert condition is met, Ambari agents report the status back to the Ambari server and trigger an alert. If an alert isn't checked according to the interval in its Alert Profile, the server triggers an *Ambari Server Stale Alerts* alert.

There are various reasons why a health check might not run at its defined interval:

* The hosts are under heavy use (high CPU usage), so that the Ambari agent can't get enough system resources to run the alerts on time.

* The cluster is busy executing many jobs or services during a period of heavy load.

* A few of hosts in the cluster are hosting many components and so are required to run many alerts. If the number of components is large, alert jobs might miss their scheduled intervals.

## Resolution

Try the following methods to resolve problems with Ambari stale alerts.

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

There's a grace period before an Ambari agent reports that a configured alert missed its schedule. If the alert missed its scheduled time but ran within the grace period, the stale alert isn't generated.

The default `alert_grace_period` value is 5 seconds. You can configure this setting in /etc/ambari-agent/conf/ambari-agent.ini. For hosts on which stale alerts occur at regular intervals, try increasing the value to 10. Then, restart the Ambari agent.

## Next steps

If your problem wasn't mentioned here or you're unable to solve it, visit one of the following channels for more support:

* Get answers from Azure experts at [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) on Twitter. This is the official Microsoft Azure account for improving customer experience. It connects the Azure community to the right resources: answers, support, and experts.

* If you need more help, submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). To get there, select Help (**?**) from the portal menu or open the **Help + support** pane. For more information, see [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). 

  Support for subscription management and billing is included with your Microsoft Azure subscription. Technical support is available through the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
