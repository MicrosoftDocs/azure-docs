---
title: Overview of Azure Firewall logs and metrics
description: You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 11/19/2019
ms.author: victorh
---

# Azure Firewall logs and metrics

You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.

You can access some of these logs through the portal. Logs can be sent to [Azure Monitor logs](../azure-monitor/insights/azure-networking-analytics.md), Storage, and Event Hubs and analyzed in Azure Monitor logs or by different tools such as Excel and Power BI.

Metrics are lightweight and can support near real-time scenarios making them useful for alerting and fast issue detection.

## Diagnostic logs

 The following diagnostic logs are available for Azure Firewall:

* **Application rule log**

   The Application rule log is saved to a storage account, streamed to Event hubs and/or sent to Azure Monitor logs only if you've enabled it for each Azure Firewall. Each new connection that matches one of your configured application rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following example:

   ```
   Category: application rule logs.
   Time: log timestamp.
   Properties: currently contains the full message.
   note: this field will be parsed to specific fields in the future, while maintaining backward compatibility with the existing properties field.
   ```

   ```json
   {
    "category": "AzureFirewallApplicationRule",
    "time": "2018-04-16T23:45:04.8295030Z",
    "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
    "operationName": "AzureFirewallApplicationRuleLog",
    "properties": {
        "msg": "HTTPS request from 10.1.0.5:55640 to mydestination.com:443. Action: Allow. Rule Collection: collection1000. Rule: rule1002"
    }
   }
   ```

* **Network rule log**

   The Network rule log is saved to a storage account, streamed to Event hubs and/or sent to Azure Monitor logs only if you've enabled it for each Azure Firewall. Each new connection that matches one of your configured network rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following example:

   ```
   Category: network rule logs.
   Time: log timestamp.
   Properties: currently contains the full message.
   note: this field will be parsed to specific fields in the future, while maintaining backward compatibility with the existing properties field.
   ```

   ```json
  {
    "category": "AzureFirewallNetworkRule",
    "time": "2018-06-14T23:44:11.0590400Z",
    "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
    "operationName": "AzureFirewallNetworkRuleLog",
    "properties": {
        "msg": "TCP request from 111.35.136.173:12518 to 13.78.143.217:2323. Action: Deny"
    }
   }

   ```

You have three options for storing your logs:

* **Storage account**: Storage accounts are best used for logs when logs are stored for a longer duration and reviewed when needed.
* **Event hubs**: Event hubs are a great option for integrating with other security information and event management (SEIM) tools to get alerts on your resources.
* **Azure Monitor logs**: Azure Monitor logs is best used for general real-time monitoring of your application or looking at trends.

## Activity logs

   Activity log entries are collected by default, and you can view them in the Azure portal.

   You can use [Azure activity logs](../azure-resource-manager/management/view-activity-logs.md) (formerly known as operational logs and audit logs) to view all operations submitted to your Azure subscription.

## Metrics

Metrics in Azure Monitor are numerical values that describe some aspect of a system at a particular time. Metrics are collected every minute, and are useful for alerting because they can be sampled frequently. An alert can be fired quickly with relatively simple logic.

The following metrics are available for Azure Firewall:

- **Application rules hit count** - The number of times an application rule has been hit.

    Unit: count

- **Network rules hit count** - The number of times a network rule has been hit.

    Unit: count

- **Data processed** - Amount of data traversing the firewall.

    Unit: bytes

- **Firewall health state** - Indicates the health of the firewall.

    Unit: percent

   This metric has two dimensions:
  - **Status**: Possible values are *Healthy*, *Degraded*, *Unhealthy*.
  - **Reason**: Indicates the reason for the corresponding status of the firewall. For example, it can indicate *SNAT ports* if the firewall status is Degraded or Unhealthy.





- **SNAT port utilization** - The percentage of SNAT ports that have been utilized by the firewall.

    Unit: percent

   When you add more public IP addresses to your firewall, more SNAT ports are available, reducing the SNAT ports utilization. Additionally, when the firewall scales out for different reasons (for example, CPU or throughput) additional SNAT ports also become available. So effectively, a given percentage of SNAT ports utilization may go down without you adding any public IP addresses, just because the service scaled out. You can directly control the number of public IP addresses available to increase the ports available on your firewall. But, you can't directly control firewall scaling. Currently, SNAT ports are added only for the first five public IP addresses.   


## Next steps

- To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](tutorial-diagnostics.md).

- To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/platform/data-platform-metrics.md).
