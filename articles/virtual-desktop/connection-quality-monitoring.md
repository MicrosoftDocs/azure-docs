---
title: Collect and query Azure Virtual Desktop connection quality data (preview) - Azure
description: How to set up and query the connection quality data table for Azure Virtual Desktop to diagnose connection issues.
author: Heidilohr
ms.topic: how-to
ms.date: 01/05/2023
ms.author: helohr
manager: femila
ms.custom: engagement-fy23
---
# Collect and query connection quality data

>[!IMPORTANT]
>The Connection Graphics Data Logs are currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Connection quality](connection-latency.md) is essential for good user experiences, so it's important to be able to monitor connections for potential issues and troubleshoot problems as they arise. Azure Virtual Desktop integrates with tools like [Log Analytics](diagnostics-log-analytics.md) that can help you monitor your deployment's connection health. This article will show you how to configure your diagnostic settings to let you collect connection quality data and query data for specific parameters.

## Prerequisites

To start collecting connection quality data, you need to [set up a Log Analytics workspace for use with Azure Virtual Desktop](diagnostics-log-analytics.md).

>[!NOTE]
>Normal storage charges for Log Analytics will apply. Learn more at [Azure Monitor Logs pricing details](../azure-monitor/logs/cost-logs.md).

## Configure diagnostics settings

To check and modify your diagnostics settings in the Azure portal:

1. Sign in to the Azure portal, then go to **Azure Virtual Desktop** and select **Host pools**.

2. Select the host pool you want to collect network data for.

3. Select **Diagnostic settings**, then create a new setting if you haven't configured your diagnostic settings yet. If you've already configured your diagnostic settings, select **Edit setting**.

4. Select **allLogs** if you want to collect data for all tables. The *allLogs* parameter will automatically add new tables to your data table in the future. 
   
   If you'd prefer to view more specific tables, first select **Network Data Logs** and **Connection Graphics Data Logs Preview**, then select the names of the other tables you want to see. 

5. Select where you want to send the collected data. Azure Virtual Desktop Insights users should select a Log Analytics workspace. 

6. Select **Save** to apply your changes.

7. Repeat this process for all other host pools you want to measure.

8. To check network data, return to the host pool's resource page, select **Logs**, then run one of the queries in [Sample queries for Azure Log Analytics](#sample-queries-for-azure-log-analytics-network-data). In order for your query to get results, your host pool must have active users who've connected to sessions before. Keep in mind that it can take up to 15 minutes for network data to appear in the Azure portal.

## Sample queries for Azure Log Analytics: network data

In this section, we have a list of queries that will help you review connection quality information. You can run queries in the [Log Analytics query editor](../azure-monitor/logs/log-analytics-tutorial.md#write-a-query).

>[!NOTE]
>For each example, replace the *userupn* variable with the UPN of the user you want to look up.

### Query average RTT and bandwidth

To look up the average round trip time and bandwidth:

```kusto
// 90th, 50th, 10th Percentile for RTT in 10 min increments
WVDConnectionNetworkData
| summarize RTTP90=percentile(EstRoundTripTimeInMs,90),RTTP50=percentile(EstRoundTripTimeInMs,50),RTTP10=percentile(EstRoundTripTimeInMs,10) by bin(TimeGenerated,10m)
| render timechart
// 90th, 50th, 10th Percentile for BW in 10 min increments
WVDConnectionNetworkData
| summarize BWP90=percentile(EstAvailableBandwidthKBps,90),BWP50=percentile(EstAvailableBandwidthKBps,50),BWP10=percentile(EstAvailableBandwidthKBps,10) by bin(TimeGenerated,10m)
| render timechart
```
To look up the round-trip time and bandwidth per connection:

```kusto
// RTT and BW Per Connection Summary
// Returns P90 Round Trip Time (ms) and Bandwidth (KBps) per connection with connection details.
WVDConnectionNetworkData
| summarize RTTP90=percentile(EstRoundTripTimeInMs,90),BWP90=percentile(EstAvailableBandwidthKBps,90),StartTime=min(TimeGenerated), EndTime=max(TimeGenerated) by CorrelationId
| join kind=leftouter (
WVDConnections
| extend Protocol = iff(UdpUse in ("0","<>"),"TCP","UDP")
| distinct CorrelationId, SessionHostName, Protocol, ClientOS, ClientType, ClientVersion, ConnectionType, ResourceAlias, SessionHostSxSStackVersion, UserName
) on CorrelationId
| project CorrelationId, StartTime, EndTime, UserName, SessionHostName, RTTP90, BWP90, Protocol, ClientOS, ClientType, ClientVersion, ConnectionType, ResourceAlias, SessionHostSxSStackVersion
```

### Query data for a specific user

To look up the bandwidth for a specific user:

```kusto
let user = "alias@domain";
WVDConnectionNetworkData
| join kind=leftouter (
    WVDConnections
    | distinct CorrelationId, UserName
) on CorrelationId
| where UserName == user
| project EstAvailableBandwidthKBps, TimeGenerated
| render columnchart  
```

To look up the round trip time for a specific user:

```kusto
let user = "alias@domain";
WVDConnectionNetworkData
| join kind=leftouter (
WVDConnections
| distinct CorrelationId, UserName
) on CorrelationId
| where UserName == user
| project EstRoundTripTimeInMs, TimeGenerated
| render columnchart  
```

To look up the top 10 users with the highest round trip time:

```kusto
WVDConnectionNetworkData
| join kind=leftouter (
    WVDConnections
    | distinct CorrelationId, UserName
) on CorrelationId
| summarize AvgRTT=avg(EstRoundTripTimeInMs),RTT_P95=percentile(EstRoundTripTimeInMs,95) by UserName
| top 10 by AvgRTT desc
```

To look up the 10 users with the lowest bandwidth:

```kusto
WVDConnectionNetworkData
| join kind=leftouter (
    WVDConnections
    | distinct CorrelationId, UserName
) on CorrelationId
| summarize AvgBW=avg(EstAvailableBandwidthKBps),BW_P95=percentile(EstAvailableBandwidthKBps,95) by UserName
| top 10 by AvgBW asc
```

## Next steps

Learn more about connection quality at [Connection quality in Azure Virtual Desktop](connection-latency.md).