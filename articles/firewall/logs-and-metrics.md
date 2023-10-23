---
title: Overview of Azure Firewall logs and metrics
description: You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 10/31/2022
ms.author: victorh
ms.custom: FY23 content-maintenance
---

# Azure Firewall logs and metrics

You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.

You can access some of these logs through the portal. Logs can be sent to [Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics), Storage, and Event Hubs and analyzed in Azure Monitor logs or by different tools such as Excel and Power BI.

Metrics are lightweight and can support near real-time scenarios making them useful for alerting and fast issue detection.

> [!NOTE]
> Structured firewall logs is available which offers more control over the logs and faster queries. For more information, see [Azure Structured Firewall Logs](firewall-structured-logs.md).

## Diagnostic logs

 The following diagnostic logs are available for Azure Firewall:

* **Application rule log**

   The Application rule log is saved to a storage account, streamed to Event hubs and/or sent to Azure Monitor logs only if you've enabled it for each Azure Firewall. Each new connection that matches one of your configured application rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following examples:

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

   ```json
   {
     "category": "AzureFirewallApplicationRule",
     "time": "2018-04-16T23:45:04.8295030Z",
     "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
     "operationName": "AzureFirewallApplicationRuleLog",
     "properties": {
         "msg": "HTTPS request from 10.11.2.4:53344 to www.bing.com:443. Action: Allow. Rule Collection: ExampleRuleCollection. Rule: ExampleRule. Web Category: SearchEnginesAndPortals"
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

* **DNS proxy log**

   The DNS Proxy log is saved to a storage account, streamed to Event hubs, and/or sent to Azure Monitor logs only if you’ve enabled it for each Azure Firewall. This log tracks DNS messages to a DNS server configured using DNS proxy. The data is logged in JSON format, as shown in the following examples:


   ```
   Category: DNS proxy logs.
   Time: log timestamp.
   Properties: currently contains the full message.
   note: this field will be parsed to specific fields in the future, while maintaining backward compatibility with the existing properties field.
   ```

   Success:
   ```json
   {
     "category": "AzureFirewallDnsProxy",
     "time": "2020-09-02T19:12:33.751Z",
     "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
     "operationName": "AzureFirewallDnsProxyLog",
     "properties": {
         "msg": "DNS Request: 11.5.0.7:48197 – 15676 AAA IN md-l1l1pg5lcmkq.blob.core.windows.net. udp 55 false 512 NOERROR - 0 2.000301956s"
     }
   }
   ```

   Failed:

   ```json
   {
     "category": "AzureFirewallDnsProxy",
     "time": "2020-09-02T19:12:33.751Z",
     "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
     "operationName": "AzureFirewallDnsProxyLog",
     "properties": {
         "msg": " Error: 2 time.windows.com.reddog.microsoft.com. A: read udp 10.0.1.5:49126->168.63.129.160:53: i/o timeout”
     }
   }
   ```

   msg format:

   `[client’s IP address]:[client’s port] – [query ID] [type of the request] [class of the request] [name of the request] [protocol used] [request size in bytes] [EDNS0 DO (DNSSEC OK) bit set in the query] [EDNS0 buffer size advertised in the query] [response CODE] [response flags] [response size] [response duration]`

You have three options for storing your logs:

* **Storage account**: Storage accounts are best used for logs when logs are stored for a longer duration and reviewed when needed.
* **Event hubs**: Event hubs are a great option for integrating with other security information and event management (SEIM) tools to get alerts on your resources.
* **Azure Monitor logs**: Azure Monitor logs is best used for general real-time monitoring of your application or looking at trends.

## Activity logs

   Activity log entries are collected by default, and you can view them in the Azure portal.

   You can use [Azure activity logs](../azure-monitor/essentials/activity-log.md) (formerly known as operational logs and audit logs) to view all operations submitted to your Azure subscription.

## Metrics

Metrics in Azure Monitor are numerical values that describe some aspect of a system at a particular time. Metrics are collected every minute, and are useful for alerting because they can be sampled frequently. An alert can be fired quickly with relatively simple logic.

The following metrics are available for Azure Firewall:

- **Application rules hit count** - The number of times an application rule has been hit.

    Unit: count

- **Network rules hit count** - The number of times a network rule has been hit.

    Unit: count

- **Data processed** - Sum of data traversing the firewall in a given time window.

    Unit: bytes

- **Throughput** - Rate of data traversing the firewall per second.

    Unit: bits per second

- **Firewall health state** - Indicates the health of the firewall based on SNAT port availability.

    Unit: percent

   This metric has two dimensions:
  - Status: Possible values are *Healthy*, *Degraded*, *Unhealthy*.
  - Reason: Indicates the reason for the corresponding status of the firewall. 

     If SNAT ports are used > 95%, they're considered exhausted and the health is 50% with status=**Degraded** and reason=**SNAT port**. The firewall keeps processing traffic and existing connections aren't affected. However, new connections may not be established intermittently.

     If SNAT ports are used < 95%, then firewall is considered healthy and health is shown as 100%.

     If no SNAT ports usage is reported, health is shown as 0%. 

- **SNAT port utilization** - The percentage of SNAT ports that have been utilized by the firewall.

    Unit: percent

   When you add more public IP addresses to your firewall, more SNAT ports are available, reducing the SNAT ports utilization. Additionally, when the firewall scales out for different reasons (for example, CPU or throughput) additional SNAT ports also become available. So effectively, a given percentage of SNAT ports utilization may go down without you adding any public IP addresses, just because the service scaled out. You can directly control the number of public IP addresses available to increase the ports available on your firewall. But, you can't directly control firewall scaling.

   If your firewall is running into SNAT port exhaustion, you should add at least five public IP address. This increases the number of SNAT ports available. For more information, see [Azure Firewall features](features.md#multiple-public-ip-addresses).

- **AZFW Latency Probe** - Estimates Azure Firewall average latency.

   Unit: ms

   This metric measures the overall or average latency of Azure Firewall in milliseconds. Administrators can use this metric for the following purposes: 

   - Diagnose if Azure Firewall is the cause of latency in the network 

   - Monitor and alert if there are any latency or performance issues, so IT teams can proactively engage.  

   - There may be various reasons that can cause high latency in Azure Firewall. For example, high CPU utilization, high throughput, or a possible networking issue.

     This metric doesn't measure end-to-end latency of a given network path. In other words, this latency health probe doesn't measure how much latency Azure Firewall adds.

   - When the latency metric isn't functioning as expected, a value of 0 appears in the metrics dashboard.
   - As a reference, the average expected latency for a firewall is approximately 1 ms. This may vary depending on deployment size and environment.
   -  The latency probe is based on Microsoft's Ping Mesh technology. So, intermittent spikes in the latency metric are to be expected. These spikes are normal and don't signal an issue with the Azure Firewall. They're part of the standard host networking setup that supports the system.
   
      As a result, if you experience consistent high latency that last longer than typical spikes, consider filing a Support ticket for assistance.

## Next steps

- To learn how to monitor Azure Firewall logs and metrics, see [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md).

- To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).
