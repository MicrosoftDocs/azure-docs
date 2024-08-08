---
title: Monitor Azure Firewall
description: You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.
ms.date: 08/08/2024
ms.custom: horz-monitor, FY23 content-maintenance
ms.topic: conceptual
author: vhorne
ms.author: victorh
ms.service: azure-firewall
---
# Monitor Azure Firewall

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

You can use Azure Firewall logs and metrics to monitor your traffic and operations within the firewall. These logs and metrics serve several essential purposes, including:

- **Traffic Analysis**: Use logs to examine and analyze the traffic passing through the firewall. This analysis includes examining permitted and denied traffic, inspecting source and destination IP addresses, URLs, port numbers, protocols, and more. These insights are essential for understanding traffic patterns, identifying potential security threats, and troubleshooting connectivity issues.  

- **Performance and Health Metrics**: Azure Firewall metrics provide performance and health metrics, such as data processed, throughput, rule hit count, and latency. Monitor these metrics to assess the overall health of your firewall, identify performance bottlenecks, and detect any anomalies.  

- **Audit Trail**: Activity logs enable auditing of operations related to firewall resources, capturing actions like creating, updating, or deleting firewall rules and policies. Reviewing activity logs helps maintain a historical record of configuration changes and ensures compliance with security and auditing requirements.

<!-- ## Insights. OPTIONAL. If your service has Azure Monitor insights, add the following include and add information about what your insights provide. You can refer to another article that gives details or add a screenshot. 
[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)] -->

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Firewall, see [Azure Firewall monitoring data reference](monitor-firewall-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Azure Firewall, see [Azure Firewall monitoring data reference](monitor-firewall-reference.md#metrics).

<!-- OPTIONAL. If your service doesn't collect Azure Monitor platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)] -->

<!-- ## OPTIONAL [TODO-replace-with-service-name] metrics
If your service uses any non-Azure Monitor based metrics, add the following include and more information.
[!INCLUDE [horz-monitor-custom-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)] -->

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure Firewall, see [Azure Firewall monitoring data reference](monitor-firewall-reference.md#resource-logs).

[Azure Firewall Workbook](firewall-workbook.md) provides a flexible canvas for Azure Firewall data analysis. You can use it to create rich visual reports within the Azure portal. You can tap into multiple Firewalls deployed across Azure, and combine them into unified interactive experiences.

You can also connect to your storage account and retrieve the JSON log entries for access and performance logs. After you download the JSON files, you can convert them to CSV and view them in Excel, Power BI, or any other data-visualization tool.

> [!TIP]
> If you are familiar with Visual Studio and basic concepts of changing values for constants and variables in C#, you can use the [log converter tools](https://github.com/Azure-Samples/networking-dotnet-log-converter) available from GitHub.

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Azure Structured Firewall logs

Structured logs are a type of log data that are organized in a specific format. They use a predefined schema to structure log data in a way that makes it easy to search, filter, and analyze. Unlike unstructured logs, which consist of free-form text, structured logs have a consistent format that machines can parse and analyze.

Azure Firewall's structured logs provide a more detailed view of firewall events. They include information such as source and destination IP addresses, protocols, port numbers, and action taken by the firewall. They also include more metadata, such as the time of the event and the name of the Azure Firewall instance.

Currently, the following diagnostic log categories are available for Azure Firewall:

- Application rule log
- Network rule log
- DNS proxy log

These log categories use [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode). In this mode, all data from any diagnostic setting is collected in the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table.

With structured logs, you're able to choose to use [Resource Specific Tables](../azure-monitor/essentials/resource-logs.md#resource-specific) instead of the existing [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table. In case both sets of logs are required, at least two diagnostic settings need to be created per firewall.

### Resource specific mode

In **Resource specific** mode, individual tables in the selected workspace are created for each category selected in the diagnostic setting. This method is recommended since it:

- Might reduce overall logging costs by up to 80%.
- makes it much easier to work with the data in log queries
- makes it easier to discover schemas and their structure
- improves performance across both ingestion latency and query times
- allows you to grant Azure RBAC rights on a specific table

New resource specific tables are now available in Diagnostic setting that allows you to utilize the following categories:

- [Network rule log](/azure/azure-monitor/reference/tables/azfwnetworkrule) - Contains all Network Rule log data. Each match between data plane and network rule creates a log entry with the data plane packet and the matched rule's attributes.
- [NAT rule log](/azure/azure-monitor/reference/tables/azfwnatrule) - Contains all DNAT (Destination Network Address Translation) events log data. Each match between data plane and DNAT rule creates a log entry with the data plane packet and the matched rule's attributes.
- [Application rule log](/azure/azure-monitor/reference/tables/azfwapplicationrule) - Contains all Application rule log data. Each match between data plane and Application rule creates a log entry with the data plane packet and the matched rule's attributes.
- [Threat Intelligence log](/azure/azure-monitor/reference/tables/azfwthreatintel) - Contains all Threat Intelligence events.
- [IDPS log](/azure/azure-monitor/reference/tables/azfwidpssignature) - Contains all data plane packets that were matched with one or more IDPS signatures.
- [DNS proxy log](/azure/azure-monitor/reference/tables/azfwdnsquery) - Contains all DNS Proxy events log data.
- [Internal FQDN resolve failure log](/azure/azure-monitor/reference/tables/azfwinternalfqdnresolutionfailure) - Contains all internal Firewall FQDN resolution requests that resulted in failure.
- [Application rule aggregation log](/azure/azure-monitor/reference/tables/azfwapplicationruleaggregation) - Contains aggregated Application rule log data for Policy Analytics.
- [Network rule aggregation log](/azure/azure-monitor/reference/tables/azfwnetworkruleaggregation) - Contains aggregated Network rule log data for Policy Analytics.
- [NAT rule aggregation log](/azure/azure-monitor/reference/tables/azfwnatruleaggregation) - Contains aggregated NAT rule log data for Policy Analytics.
- [Top flow log](/azure/azure-monitor/reference/tables/azfwfatflow) - The Top Flows (Fat Flows) log shows the top connections that are contributing to the highest throughput through the firewall.
- [Flow trace](/azure/azure-monitor/reference/tables/azfwflowtrace) - Contains flow information, flags, and the time period when the flows were recorded. You can see full flow information such as SYN, SYN-ACK, FIN, FIN-ACK, RST, INVALID (flows).

### Enable structured logs

To enable Azure Firewall structured logs, you must first configure a Log Analytics workspace in your Azure subscription. This workspace is used to store the structured logs generated by Azure Firewall.

Once you configure the Log Analytics workspace, you can enable structured logs in Azure Firewall by navigating to the Firewall's **Diagnostic settings** page in the Azure portal. From there, you must select the **Resource specific** destination table and select the type of events you want to log.

> [!NOTE]
> There's no requirement to enable this feature with a feature flag or Azure PowerShell commands.

:::image type="content" source="media/firewall-structured-logs/diagnostics-setting-resource-specific.png" alt-text="Screenshot of Diagnostics settings page.":::

### Structured log queries

A list of predefined queries is available in the Azure portal. This list has a predefined KQL (Kusto Query Language) log query for each category and joined query showing the entire Azure firewall logging events in single view.

:::image type="content" source="media/firewall-structured-logs/firewall-queries.png" alt-text="Screenshot showing Azure Firewall queries." lightbox="media/firewall-structured-logs/firewall-queries.png" :::

### Azure Firewall Workbook

[Azure Firewall Workbook](firewall-workbook.md) provides a flexible canvas for Azure Firewall data analysis. You can use it to create rich visual reports within the Azure portal. You can tap into multiple firewalls deployed across Azure and combine them into unified interactive experiences.

To deploy the new workbook that uses  Azure Firewall Structured Logs, see [Azure Monitor Workbook for Azure Firewall](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Workbook%20-%20Azure%20Firewall%20Monitor%20Workbook).

## Legacy Azure Diagnostics logs

Legacy Azure Diagnostic logs are the original Azure Firewall log queries that output log data in an unstructured or free-form text format. The Azure Firewall legacy log categories use [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode), collecting entire data in the [AzureDiagnostics table](/azure/azure-monitor/reference/tables/azurediagnostics). In case both Structured and Diagnostic logs are required, at least two diagnostic settings need to be created per firewall.

The following log categories are supported in Diagnostic logs:

- Azure Firewall application rule
- Azure Firewall network rule
- Azure Firewall DNS proxy

To learn how to enable the diagnostic logging using the Azure portal, see [Enable structured logs](#enable-structured-logs).

### Application rule log

The Application rule log is saved to a storage account, streamed to Event hubs and/or sent to Azure Monitor logs only if you've enabled it for each Azure Firewall. Each new connection that matches one of your configured application rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following examples:

   ```console
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

### Network rule log

The Network rule log is saved to a storage account, streamed to Event hubs and/or sent to Azure Monitor logs only if you've enabled it for each Azure Firewall. Each new connection that matches one of your configured network rules results in a log for the accepted/denied connection. The data is logged in JSON format, as shown in the following example:

   ```console
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

### DNS proxy log

The DNS proxy log is saved to a storage account, streamed to Event hubs, and/or sent to Azure Monitor logs only if you’ve enabled it for each Azure Firewall. This log tracks DNS messages to a DNS server configured using DNS proxy. The data is logged in JSON format, as shown in the following examples:

   ```console
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

   ```console
   [client’s IP address]:[client’s port] – [query ID] [type of the request] [class of the request] [name of the request] [protocol used] [request size in bytes] [EDNS0 DO (DNSSEC OK) bit set in the query] [EDNS0 buffer size advertised in the query] [response CODE] [response flags] [response size] [response duration]
   ```

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

<!-- REQUIRED. Add sample Kusto queries for your service here. -->

<!-- ## Alerts -->
[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

## Alert on Azure Firewall metrics

Metrics provide critical signals to track your resource health. So, it’s important to monitor metrics for your resource and watch out for any anomalies. But what if the Azure Firewall metrics stop flowing? It could indicate a potential configuration issue or something more ominous like an outage. Missing metrics can happen because of publishing default routes that block Azure Firewall from uploading metrics, or the number of healthy instances going down to zero. In this section, you learn how to configure metrics to a log analytics workspace and to alert on missing metrics.

### Configure metrics to a log analytics workspace

The first step is to configure metrics availability to the log analytics workspace using diagnostics settings in the firewall.

 To configure diagnostic settings as shown in the following screenshot, browse to the Azure Firewall resource page. This pushes firewall metrics to the configured workspace.

> [!NOTE]
> The diagnostics settings for metrics must be a separate configuration than logs. Firewall logs can be configured to use Azure Diagnostics or Resource Specific. However, Firewall metrics must always use Azure Diagnostics.

:::image type="content" source="media/logs-and-metrics/firewall-diagnostic-setting.png" alt-text="Screenshot of Azure Firewall diagnostic setting.":::

### Create alert to track receiving firewall metrics without any failures

Browse to the workspace configured in the metrics diagnostics settings. Check if metrics are available using the following query:

```kusto
AzureMetrics
| where MetricName contains "FirewallHealth"
| where ResourceId contains "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/PARALLELIPGROUPRG/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/HUBVNET-FIREWALL"
| where TimeGenerated > ago(30m)
```

Next, create an alert for missing metrics over a time period of 60 minutes. To set up new alerts on missing metrics, browse to the Alert page in the log analytics workspace.

:::image type="content" source="media/logs-and-metrics/edit-alert-rule.png" alt-text="Screenshot showing the Edit alert rule page.":::

<!-- OPTIONAL. ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]
-->

### Azure Firewall alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Firewall monitoring data reference](monitor-firewall-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Firewall monitoring data reference](monitor-firewall-reference.md) for a reference of the metrics, logs, and other important values created for Azure Firewall.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
