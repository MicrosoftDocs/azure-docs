---
title: Overview of Azure Firewall logs
description: This article is an overview of the Azure Firewall diagnostic logs.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 9/24/2018
ms.author: victorh
---

# Azure Firewall logs

You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.

You can access some of these logs through the portal. Logs can be sent to [Log Analytics](../log-analytics/log-analytics-azure-networking-analytics.md), Storage, and Event Hubs and analyzed in Log Analytics or by different tools such as Excel and Power BI.

## Diagnostic logs

 The following diagnostic logs are available for Azure Firewall:

* **Application rule log**

   The Application rule log is saved to a storage account, streamed to Event hubs and/or sent to Log Analytics only if you have enabled it for each Azure Firewall. Each new connection that matches one of your configured application rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following example:

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

   The Network rule log is saved to a storage account, streamed to Event hubs and/or sent Log Analytics only if you have enabled it for each Azure Firewall. Each new connection that matches one of your configured network rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following example:

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
* **Log Analytics**: Log Analytics is best used for general real-time monitoring of your application or looking at trends.

## Activity logs

   Activity log entries are collected by default, and you can view them in the Azure portal.

   You can use [Azure activity logs](../azure-resource-manager/resource-group-audit.md) (formerly known as operational logs and audit logs) to view all operations that are submitted to your Azure subscription.


## Next steps

To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](tutorial-diagnostics.md).