---
title: Azure Virtual Desktop user connection quality - Azure
description: Connection quality for Azure Virtual Desktop users.
author: Heidilohr
ms.topic: conceptual
ms.date: 09/26/2022
ms.author: helohr
manager: femila
---
# Connection quality in Azure Virtual Desktop

>[!IMPORTANT]
>The Connection Graphics Data Logs are currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Virtual Desktop helps users host client sessions on their session hosts running on Azure. When a user starts a session, they connect from their end-user device, also known as a "client," over a network to access the session host. It's important that the user experience feels as much like a local session on a physical device as possible. In this article, we'll talk about how you can measure and improve the connection quality of your end-users.

There are currently two ways you can analyze connection quality in your Azure Virtual Desktop deployment: Azure Log Analytics and Azure Front Door. This article will describe how to use each method to optimize graphics quality and improve end-user experience.

## Monitor connection quality with Azure Log Analytics

If you're already using [Azure Log Analytics](diagnostics-log-analytics.md), you can monitor network and graphics data for Azure Virtual Desktop connections. The connection network and graphics data Log Analytics collects can help you discover areas that impact your end-user's graphical experience. The service collects data for reports regularly throughout the session. Azure Virtual Desktop connection network data reports have the following advantages over RemoteFX network performance counters:

- Each record is connection-specific and includes the correlation ID of the connection that can be tied back to the user.

- The round trip time measured in this table is protocol-agnostic and will record the measured latency for Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) connections.

To start collecting this data, you’ll need to make sure you have diagnostics and the **Network Data Logs** and **Connection Graphics Data Logs Preview** tables enabled in your Azure Virtual Desktop host pools.

>[!NOTE]
>Normal storage charges for Log Analytics will apply. Learn more at [Azure Monitor Logs pricing details](../azure-monitor/logs/cost-logs.md).

To check and modify your diagnostics settings in the Azure portal:

1. Sign in to the Azure portal, then go to **Azure Virtual Desktop** and select **Host pools**.

2. Select the host pool you want to collect network data for.

3. Select **Diagnostic settings**, then create a new setting if you haven't configured your diagnostic settings yet. If you've already configured your diagnostic settings, select **Edit setting**.

4. Select **allLogs** or select the names of the diagnostics tables you want to collect data for, including **Network Data Logs** and **Connection Graphics Data Logs Preview**. The *allLogs* parameter will automatically add new tables to your data table in the future.

5. Select where you want to send the collected data. Azure Virtual Desktop Insights users should select a Log Analytics workspace. 

6. Select **Save** to apply your changes.

7. Repeat this process for all other host pools you want to measure.

8. Make sure the network data is going to your selected destination by returning to the host pool's resource page, selecting **Logs**, then running one of the queries in [Sample queries for Azure Log Analytics](#sample-queries-for-azure-log-analytics-network-data). In order for your query to get results, your host pool must have active users who have been connecting to sessions. Keep in mind that it can take up to 15 minutes for network data to appear in the Azure portal.
   
   To check network data, return to the host pool's resource page, select **Logs**, then run one of the queries in [Sample queries for Azure Log Analytics](connection-latency.md#sample-queries-for-azure-log-analytics-network-data). In order for your query to get results, your host pool must have active users who've connected to sessions before. Keep in mind that it can take up to 15 minutes for network data to appear in the Azure portal.

### Connection network data

The network data you collect for your data tables includes the following information:

- The **estimated available bandwidth (kilobytes per second)** is the average estimated available network bandwidth during each connection time interval.

- The **estimated round trip time (milliseconds)** is the average estimated round trip time during each connection time interval. Round trip time is how long a network request takes to go from the end-user's device to the session host through the network, then return from the session host to the end-user device.

- The **Correlation ID** is the ActivityId of a specific Azure Virtual Desktop connection that's assigned to every diagnostic within that connection.

- The **time generated** is a timestamp in Coordinated Universal Time (UTC) time that marks when an event the data counter is tracking happened on the virtual machine (VM). All averages are measured by the time window that ends at the marked timestamp.

- The **Resource ID** is a unique ID assigned to the Azure Virtual Desktop host pool associated with the data the diagnostics service collects for this table.

- The **source system**, **Subscription ID**, **Tenant ID**, and **type** (table name).

#### Frequency

The service generates these network data points every two minutes during an active session.

### Connection graphics data (preview)

You should consult the Graphics data table (preview) when users report slow or choppy experiences in their Azure Virtual Desktop sessions. The Graphics data table will give you useful information whenever graphical indicators, end-to-end delay, and dropped frames percentage fall below the "healthy" threshold for Azure Virtual Desktop. This table will help your admins track and understand factors across the server, client, and network that could be contributing to the user's slow or choppy experience. However, while the Graphics data table is a useful tool for troubleshooting poor user experience, since it's not regularly populated throughout a session, it isn't a reliable environment baseline.

The Graphics table only captures performance data from the Azure Virtual Desktop graphics stream. This table doesn't capture performance degradation or "slowness" caused by application-specific factors or the virtual machine (CPU or storage constraints). You should use this table with other VM performance metrics to determine if the delay is caused by the remote desktop service (graphics and network) or something inherent in the VM or app itself.

The graphics data you collect for your data tables includes the following information:

- The **Last evaluated connection time interval** is the two minutes leading up to the time graphics indicators fell below the quality threshold.

- The **end-to-end delay (milliseconds)** is the delay in the time between when a frame is captured on the server until the time frame is rendered on the client, measured as the sum of the encoding delay on the server, network delay, the decoding delay on the client, and the rendering time on the client. The delay reflected is the highest (worst) delay recorded in the last evaluated connection time interval.

- The **compressed frame size (bytes)** is he compressed size of the frame with the highest end-to-end delay in the last evaluated connection time interval.

- The **encoding delay on the server (milliseconds)** is the time it takes to encode the frame with the highest end-to-end delay in the last evaluated connection time interval on the server.

- The **decoding delay on the client (milliseconds)** is the time it takes to decode the frame with the highest end-to-end delay in the last evaluated connection time interval on the client.

- The **rendering delay on the client (milliseconds)** is the time it takes to render the frame with the highest end-to-end delay in the last evaluated connection time interval on the client.

- The **percentage of frames skipped** is the total percentage of frames dropped by these three sources:
  
  - The client (slow client decoding).
  - The network (insufficient network bandwidth).
  - The server (the server is busy).

  The recorded values (one each for client, server, and network) are from the second with the highest dropped frames in the last evaluated connection time interval.

- The **estimated available bandwidth (kilobytes per second)** is the average estimated available network bandwidth during the second with the highest end-to-end delay in the time interval.

- The **estimated round trip time (milliseconds)**, which is the average estimated round trip time during the second with the highest end-to-end delay in the time interval. Round trip time is how long a network request takes to go from the end-user's device to the session host through the network, then return from the session host to the end-user device.

- The **Correlation ID**, which is the ActivityId of a specific Azure Virtual Desktop connection that's assigned to every diagnostic within that connection.

- The **time generated**, which is a timestamp in UTC time that marks when an event the data counter is tracking happened on the virtual machine (VM). All averages are measured by the time window that ends that the marked timestamp.

- The **Resource ID** is a unique ID assigned to the Azure Virtual Desktop host pool associated with the data the diagnostics service collects for this table.

- The **source system**, **Subscription ID**, **Tenant ID**, and **type** (table name).

#### Frequency

In contrast to other diagnostics tables that report data at regular intervals throughout a session, the frequency of data collection for the graphics data varies depending on the graphical health of a connection. The table won't record data for "Good" scenarios, but will recording if any of the following metrics are recorded as "Poor" or "Okay," and the resulting data will be sent to your storage account. Data only records once every two minutes, maximum. The metrics involved in data collection are listed in the following table:

| Metric | Bad | Okay | Good |
|--------|-----|------|------|
| Percentage of dropped frames with low frame rate (less than 15 fps) | Greater than 15% | 10%–15% | less than 10% |
| Percentage of dropped frames with high frame rage (greater than 15 fps) | Greater than 50% | 20%–50% | Less than 20% |
| End-to-end delay per frame | Greater than 300 ms | 150 ms–300 ms | Less than 150 ms |

>[!NOTE]
>For end-to-end delay per frame, if any frame in a single second is delayed by over 300 ms, the service registers it as "Bad". If all frames in a single second take between 150 ms and 300 ms, the service marks it as "Okay."

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
