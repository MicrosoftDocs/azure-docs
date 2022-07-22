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

If you're already using [Azure Log Analytics](diagnostics-log-analytics.md), you can monitor network and graphics data for Azure Virtual Desktop connections. The connection network and graphics data Log Analytics collects can help you discover areas that impact your end-user's graphical experience. The service collects data for reports regularly throughout the session. Azure Virtual Desktop connection network data reports have the following advantages over RemoteFX network performance counters:

- Each record is connection-specific and includes the correlation ID of the connection that can be tied back to the user.

- The round trip time measured in this table is protocol-agnostic and will record the measured latency for Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) connections.

To start collecting this data, you’ll need to make sure you have diagnostics and the **NetworkData** and **GraphicsData** tables enabled in your Azure Virtual Desktop host pools.

>[!NOTE]
>Normal storage charges for Log Analytics will apply. Learn more at [Azure Monitor Logs pricing details](../azure-monitor/logs/cost-logs.md).

To check and modify your diagnostics settings in the Azure portal:

1. Sign in to the Azure portal, then go to **Azure Virtual Desktop** and select **Host pools**.

2. Select the host pool you want to collect network data for.

3. Select **Diagnostic settings**, then create a new setting if you haven't configured your diagnostic settings yet. If you've already configured your diagnostic settings, select **Edit setting**.

4. Select **allLogs** or select the names of the diagnostics tables you want to collect data for, including **NetworkData** and **GraphicsData**. The *allLogs* parameter will automatically add new tables to your data table in the future.

5. Select where you want to send the collected data. Azure Virtual Desktop Insights users should select a Log Analytics workspace. 

6. Select **Save** to apply your changes.

7. Repeat this process for all other host pools you want to measure.

8. Make sure the network data is going to your selected destination by returning to the host pool's resource page, selecting **Logs**, then running one of the queries in [Sample queries for Azure Log Analytics](#sample-queries-for-azure-log-analytics). In order for your query to get results, your host pool must have active users who have been connecting to sessions. Keep in mind that it can take up to 15 minutes for network data to appear in the Azure portal.
   
   - To check network data, return to the host pool's resource page, select **Logs**, then run one of the queries in [Sample queries for Azure Log Analytics](https://docs.microsoft.com/en-us/azure/virtual-desktop/connection-latency#sample-queries-for-azure-log-analytics). In order for your query to get results, your host pool must have active users who've connected to sessions before. Keep in mind that it can take up to 15 minutes for network data to appear in the Azure portal.
   - To check graphics data <!--Note to Self: Ask Logan what to put here-->

### Connection network data

The network data you collect for your data tables includes the following information:

- The **estimated available bandwidth (kilobytes per second)** is the average estimated available network bandwidth during each connection time interval.

- The **estimated round trip time (milliseconds)**, which is the average estimated round trip time during each connection time interval. Round trip time is how long it takes a network request takes to go from the end-user's device over the network to the session host, then return to the device.

- The **Correlation ID**, which is the activity ID of a specific Azure Virtual Desktop connection that's assigned to every diagnostic within that connection.

- The **time generated**, which is a timestamp in UTC time that marks when an event the data counter is tracking happened on the virtual machine (VM). All averages are measured by the time window that ends that the marked timestamp.

- The **Resource ID**, which is a unique ID assigned to the Azure Virtual Desktop host pool associated with the data the diagnostics service collects for this table.

- The **source system**, **Subscription ID**, **Tenant ID**, and **type** (table name).

The service generates these network data points every two minutes during an active session.

## Connection graphics data

This diagnostics table provides information when common graphical experience indicators fall below a healthy threshold set by Azure Virtual Desktop. It helps admins understand graphics symptoms as well as the RTT and bandwidth at the time the symptom occurred. The Graphics data table is a useful tool for troubleshooting poor user experience, not setting an environment baseline. The NetworkData table is populated continuously throughout a session and records the RTT and available bandwidth.

In contrast, the GraphicsData table records values only at times when the quality of the graphics in a session is poor; this distinction results in expected differences in the value of shared captured data like RTT due to differences in collection windows. If network constraints are not the issue, dropped frames and end to end delay can be split into client, network, and server components to help evaluate the source of performance concerns.

The following table only captures Azure Virtual Desktop graphics stream sources of performance concerns; it does not capture performance degradation or "slowness" caused by
application specific reasons or the virtual machine (CPU or storage
constraints) will not be performance issues caused by graphics stream.
These may present themselves to the user as graphical sluggishness but
this table should be used in conjunctions with other VM perf metrics to
determine if the delay is caused by the remote desktop service
(graphics + network) or inherent in the VM/app itself.

The graphics data you collect for your data tables includes the
following information; Last evaluated connection time interval is the
two minutes leading up to the time graphics indicators fell below the
quality threshold:

-   The **GoodSecPercentage (percentage)** is the percentage of seconds
    in the last evaluated connection time interval where all graphics
    indicators register as "Good" (see thresholds below).

-   The **end-to-end delay (milliseconds)** is the delay from the time
    when a frame is captured on the server until the time frame is
    rendered on the client, measured as the sum of the encoding delay on
    the server, network delay, the decoding delay on the client, and the
    rendering time on the client. The delay reflected is the highest
    (worst) delay recorded in the last evaluated connection time
    interval.

-   The **compressed frame size (bytes)** is compressed size of the
    frame with the highest end to end delay in the last evaluated
    connection time interval.

-   The **encoding delay on the server (milliseconds)** is the time it
    takes to encode the frame with the highest end-to-end delay in the
    last evaluated connection time interval on the server

-   The **decoding delay on the client (milliseconds)** is the time it
    takes to decode the frame with the highest end-to-end delay in the
    last evaluated connection time interval on the client

-   The **rendering delay on the client (milliseconds):** The time it
    takes to render the frame with the highest end-to-end delay in the
    last evaluated connection time interval on the client

-   The **percentage of frames skipped** is the percentage of frames
    dropped **by the client** because of slow client decoding, **by the
    network** because of insufficient network bandwidth, and **by the
    server** because the server is busy. The recorded values (one each
    for client, server, and network) are from the second with the
    highest dropped frames in the last evaluated connection time
    interval.

-   The **estimated available bandwidth (kilobytes per second)** is the
    average estimated available network bandwidth during the second with
    the highest end to end delay in the time interval.

-   The **estimated round trip time (milliseconds)**, which is the
    average estimated round trip time during the second with the highest
    end to end delay in the time interval. Round trip time is how long
    it takes a network request takes to go from the end-user\'s device
    over the network to the session host, then return to the device.

-   The **Correlation ID**, which is the activity ID of a specific Azure
    Virtual Desktop connection that\'s assigned to every diagnostic
    within that connection.

-   The **time generated**, which is a timestamp in UTC time that marks
    when an event the data counter is tracking happened on the virtual
    machine (VM). All averages are measured by the time window that ends
    that the marked timestamp.

-   The **Resource ID**, which is a unique ID assigned to the Azure
    Virtual Desktop host pool associated with the data the diagnostics
    service collects for this table.

-   The **source system**, **Subscription ID**, **Tenant ID**,
    and **type** (table name).

###Frequency

Frequency will vary depending on the graphical health of a connection.
Data will not be recorded for "Good" scenarios; it will only be sent to
your storage account if any of the following metrics are recorded as
"Poor" or "Okay". Data will not be recorded more than once in 2 minutes.

+----------------+----------------+-----------------+-----------------+
| Metric         | Bad            | Okay            | Good            |
+================+================+=================+=================+
| Dropped frames | \> 15%         | 10% - 15%       | \< 10%          |
| % with low     |                |                 |                 |
| frame rate     |                |                 |                 |
| (\<15fps)      |                |                 |                 |
+----------------+----------------+-----------------+-----------------+
| Dropped frames | \> 50%         | 20% - 50%       | \< 20%          |
| % with high    |                |                 |                 |
| frame rate     |                |                 |                 |
| (\>=15 fps)    |                |                 |                 |
+----------------+----------------+-----------------+-----------------+
| End to End     | \> 300ms       | 150ms -- 300ms  | \<150ms         |
| delay per      |                |                 |                 |
| frame          | \* if any      | \*if all frames |                 |
|                | frame in a     | in a second are |                 |
|                | second is      | marked as       |                 |
|                | \>300ms        | 150-300ms, we   |                 |
|                | delayed, it's  | mark as OK      |                 |
|                | registered as  |                 |                 |
|                | bad            |                 |                 |
+----------------+----------------+-----------------+-----------------+

~~We measure dropped frames for two cases: low input frame rate or high
input frame rate. For each of these cases, we set thresholds for Poor or
OK behavior~~

-   ~~for a second with low input frame rate (\<15), if at least 15% of
    frames drops, the second is BAD w.r.t dropped frames.~~

-   ~~for a second with low input frame rate (\<15), if at least 10% but
    not more than that 15% of frames drops, the second is OK w.r.t
    dropped frames. (first we check for BAD scenario, if not BAD, we
    check for OK scenario)~~

-   ~~for a second with high input frame rate (\>=15), if at least 50%
    of frames drops, the second is BAD w.r.t dropped frames.~~

-   ~~for a second with high input frame rate (\>=15), if at least 20%
    but not more than that 50% of frames drops, the second is OK w.r.t
    dropped frames. (first we check for BAD scenario, if not BAD, we
    check for OK scenario)~~

~~We define thresholds for BAD and OK~~

-   

```{=html}
<!-- -->
```
-   ~~End to End latency \> X~~

```{=html}
<!-- -->
```
-   ~~end to end delay for ALL frames in that second is between 150ms -
    300ms then we mark that second OK w.r.t end to end frame delay
    metric.~~

-   ~~if end to end delay for AT LEAST one frame in that second is
    greater than 300ms then we mark that second BAD w.r.t end to end
    frame delay metric.~~

-   

\[hide for now and add later when GP is published~~\]~~ ~~You can
configure a more frequent rate of data generation by modifying xyz reg
key~~

###Troubleshooting

Why is my network data not sending every 2 minutes?

-   Confirm that the diagnostics are configured correctly

-   Confirm that the VM and monitoring agents are configured correctly

-   If the session is not actively getting used, data points may send
    less frequently

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
