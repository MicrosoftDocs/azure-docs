---
title: Azure Virtual Desktop user connection latency - Azure
description: Connection latency for Azure Virtual Desktop users.
author: Heidilohr
ms.topic: conceptual
ms.date: 03/16/2022
ms.author: helohr
manager: femila
---
# Connection quality in Azure Virtual Desktop

Azure Virtual Desktop helps users host client sessions on their session hosts running on Azure. When a user starts a session, they connect from their end-user device, also known as a "client," over a network to access the session host. It's important that the user experience feels as much like a local session on a physical device as possible. In this article, we'll talk about how you can measure and improve the connection quality of your end-users.

There are currently two ways you can analyze connection quality in your Azure Virtual Desktop deployment: Azure Log Analytics and Azure Front Door. This article will describe how to use each method to optimize graphics quality and improve end-user experience.

## Monitor connection quality with Azure Log Analytics

If you're already using [Azure Log Analytics](diagnostics-log-analytics.md), you can monitor network data with the Azure Virtual Desktop connection network data diagnostics. The connection network data Log Analytics collects can help you discover areas that impact your end-user's graphical experience. The service collects data for reports regularly throughout the session. Azure Virtual Desktop connection network data reports have the following advantages over RemoteFX network performance counters:

- Each record is connection-specific and includes the correlation ID of the connection that can be tied back to the user.

- The round trip time measured in this table is protocol-agnostic and will record the measured latency for Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) connections.

To start collecting this data, you’ll need to make sure you have diagnostics and the **NetworkData** table enabled in your Azure Virtual Desktop host pools.

To check and modify your diagnostics settings in the Azure portal:

1. Sign in to the Azure portal, then go to **Azure Virtual Desktop** and select **Host pools**.

2. Select the host pool you want to collect network data for.

3. Select **Diagnostic settings**, then create a new setting if you haven't configured your diagnostic settings yet. If you've already configured your diagnostic settings, select **Edit setting**.

4. Select **allLogs** or select the names of the diagnostics tables you want to collect data for, including **NetworkData**. The *allLogs* parameter will automatically add new tables to your data table in the future.

5. Select where you want to send the collected data. Azure Virtual Desktop Insights users should select a Log Analytics workspace. 

6. Select **Save** to apply your changes.

7. Repeat this process for all other host pools you want to measure.

8. Make sure the network data is going to your selected destination by returning to the host pool's resource page, selecting **Logs**, then running one of the queries in [Sample queries for Azure Log Analytics](#sample-queries-for-azure-log-analytics). In order for your query to get results, your host pool must have active users who have been connecting to sessions. Keep in mind that it can take up to 15 minutes for network data to appear in the Azure portal.

### Connection network data

The network data you collect for your data tables includes the following information:

- The **estimated available bandwidth (kilobytes per second)** is the average estimated available network bandwidth during each connection time interval.

- The **estimated round trip time (milliseconds)**, which is the average estimated round trip time during each connection time interval. Round trip time is how long it takes a network request takes to go from the end-user's device over the network to the session host, then return to the device.

- The **Correlation ID**, which is the activity ID of a specific Azure Virtual Desktop connection that's assigned to every diagnostic within that connection.

- The **time generated**, which is a timestamp in UTC time that marks when an event the data counter is tracking happened on the virtual machine (VM). All averages are measured by the time window that ends that the marked timestamp.

- The **Resource ID**, which is a unique ID assigned to the Azure Virtual Desktop host pool associated with the data the diagnostics service collects for this table.

- The **source system**, **Subscription ID**, **Tenant ID**, and **type** (table name).

## Sample queries for Azure Log Analytics

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

## Azure Front Door

Azure Virtual Desktop uses [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) to redirect the user connection to the nearest Azure Virtual Desktop gateway based on the source IP address. Azure Virtual Desktop will always use the Azure Virtual Desktop gateway that the client chooses.

## Next steps

- Troubleshoot connection and latency issues at [Troubleshoot connection quality for Azure Virtual Desktop](troubleshoot-connection-quality.md).
- To check the best location for optimal latency, see the [Azure Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).
- For pricing plans, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To get started with your Azure Virtual Desktop deployment, check out [our tutorial](./create-host-pools-azure-marketplace.md).
- To learn about bandwidth requirements for Azure Virtual Desktop, see [Understanding Remote Desktop Protocol (RDP) Bandwidth Requirements for Azure Virtual Desktop](rdp-bandwidth.md).
- To learn about Azure Virtual Desktop network connectivity, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).
- Learn how to use Azure Monitor at [Get started with Azure Monitor for Azure Virtual Desktop](azure-monitor.md).
