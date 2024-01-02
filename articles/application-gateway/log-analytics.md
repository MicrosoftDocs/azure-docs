---
title: Examine WAF logs using Azure Log Analytics
titleSuffix: Azure Application Gateway
description: This article shows you how you can use Azure Log Analytics to examine Application Gateway Web Application Firewall (WAF) logs.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 07/24/2023
ms.author: greglin
---

# Use Log Analytics to examine Application Gateway Web Application Firewall (WAF) Logs

Once your Application Gateway WAF is operational, you can enable logs to inspect what is happening with each request. Firewall logs give insight to what the WAF is evaluating, matching, and blocking. With Log Analytics, you can examine the data inside the firewall logs to give even more insights. For more information about log queries, see [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

## Prerequisites

* An Azure account with an active subscription is required.  If you don't already have an account, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Web Application Firewall with logs enabled. For more information, see [Azure Web Application Firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md).
* A Log Analytics workspace. For more information about creating a Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).

## Import WAF logs

To import your firewall logs into Log Analytics, see [Backend health, diagnostic logs, and metrics for Application Gateway](application-gateway-diagnostics.md#diagnostic-logging). When you have the firewall logs in your Log Analytics workspace, you can view data, write queries, create visualizations, and add them to your portal dashboard.

## Explore data with examples

To view the raw data in the firewall log, you can run the following query:

```
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog"
```

This looks similar to the following query:

:::image type="content" source="media/log-analytics/log-query.png" alt-text="Screenshot of Log Analytics query." lightbox="media/log-analytics/log-query.png":::

You can drill down into the data, and plot graphs or create visualizations from here. See the following queries as a starting point:

### Matched/Blocked requests by IP

```
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog"
| summarize count() by clientIp_s, bin(TimeGenerated, 1m)
| render timechart
```

### Matched/Blocked requests by URI

```
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog"
| summarize count() by requestUri_s, bin(TimeGenerated, 1m)
| render timechart
```

### Top matched rules

```
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog"
| summarize count() by ruleId_s, bin(TimeGenerated, 1m)
| where count_ > 10
| render timechart
```

### Top five matched rule groups

```
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog"
| summarize Count=count() by details_file_s, action_s
| top 5 by Count desc
| render piechart
```

## Add to your dashboard

Once you create a query, you can add it to your dashboard.  Select the **Pin to dashboard** in the top right of the log analytics workspace. With the previous four queries pinned to an example dashboard, this is the data you can see at a glance:

:::image type="content" source="media/log-analytics/dashboard.png" alt-text="Screenshot shows an Azure dashboard where you can add your query.":::

## Next steps

[Backend health, diagnostic logs, and metrics for Application Gateway](application-gateway-diagnostics.md)
