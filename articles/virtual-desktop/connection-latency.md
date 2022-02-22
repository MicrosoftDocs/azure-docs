---
title: Azure Virtual Desktop user connection latency - Azure
description: Connection latency for Azure Virtual Desktop users.
author: Heidilohr
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: helohr
manager: femila
---
# Connection quality in Azure Virtual Desktop

Azure Virtual Desktop helps users host client sessions on their session hosts running on Azure. When a user starts a session, they connect from their end-user device, also known as a "client," over a network to access the session host. It's important that the user experience feels as much like a local session on a physical device as possible. In this article, we'll talk about how you can measure and improve the connection quality of your end-users.

>[!NOTE]
>Azure Virtual Desktop currently only supports network data in commercial clouds.

## Measure connection quality with Azure Log Analytics

If you're already using [Azure Log Analytics](diagnostics-log-analytics.md), you can monitor network data with the connection network data diagnostics. The data Log Analytics collects can help you discover areas that impact your end-user's graphical experience. The service collects data for reports about every two minutes. Log Analytics reports have the following advantages over RemoteFX network performance counters:

- Each record is connection-specific and includes the correlation ID of the connection that can be tied back to the user.

- The round trip time measured in this table is protocol-agnostic and will record the measured latency for Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) connections.

To start collecting this data, you’ll need to make sure you have diagnostics and the Network Data table enabled in your your Azure Virtual Desktop host pools.

To check and modify your diagnostics settings in the Azure Portal:

1. Sign in to the Azure portal, then go to **Azure Virtual Desktop** and select **Host pools**.

2. Select the host pool you want to collect network data for.

3. Select **Diagnostic settings**, then create a new setting if you haven't configured your diagnostic settings yet. If you've already configured your diagnostic settings, select **Edit setting**.

4. Select **allLogs**, then select the names of the diagnostics tables you want to collect data for, including **NetworkData**. The *allLogs* parameter will automatically add new tables to your data table in the future.

5. Select **Save** to apply your changes.

6. Repeat this process for all other host pools you want to measure.

### Connection network data

The network data you collect for your data tables includes the following information:

- The **estimated available bandwidth (kilobytes per second)** is the average estimated available network bandwidth during each connection time interval.

- The **estimated round trip time (milliseconds)** is how long it takes for a network request to go between the client and the session host. Each time interval is measured by how long it takes for the network request to go from the end-user's device over the network to the session host, then return to the device.

- The **Correlation ID** is the activity ID of a specific Azure Virtual Desktop connection that's assigned to every diagnostic task within that connection.

- The **source system** is name of the compute or cloud provider. Source systems can be from Azure or elsewhere.

- The **Tenant ID**, which is a unique ID assigned to the Azure tenant associated with the data the diagnostics service collects for this table.

- The **time generated**, which is a timestamp in UTC time that marks when an event the data counter is tracking happened on the virtual machine (VM). All averages are measured by the time window that ends that the marked timestamp.

- The **type**, which is the name of the data table. In this case, the table's name is “WVDConnectionNetworkData."

- The **Resource ID**, which is a unique ID assigned to the Azure Virtual Desktop host pool associated with the data the diagnostics service collects for this table.

- The **Subscription ID**, which is a unique identifier assigned to the Azure subscription associated with the data the diagnostics service collects for this table.

## Sample queries

In this section, we have a list of queries that will help you review connection quality information. You can run queries in the [Log Analytics query editor](../azure-monitor/logs/log-analytics-tutorial.md#write-a-query).

>[!NOTE]
>For each example, replace the *userupn* variable with the UPN of the user you want to look up.

### Query average RTT and bandwidth

To look up the average round-trip time and bandwidth:

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

To look up the top 10 users with the highest round trip time and their connecting region:

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













(Old text)

The [Azure Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/) can help you determine the best location to optimize the latency of your VMs. We recommend you use the tool every two to three months to make sure the optimal location hasn't changed as Azure Virtual Desktop rolls out to new areas.

## Interpreting results from the Azure Virtual Desktop Experience Estimator tool

In Azure Virtual Desktop, latency up to 150 ms shouldn’t impact user experience that doesn't involve rendering or video. Latencies between 150 ms and 200 ms should be fine for text processing. Latency above 200 ms may impact user experience. 

In addition, the Azure Virtual Desktop connection depends on the internet connection of the machine the user is using the service from. Users may lose connection or experience input delay in one of the following situations:

 - The user doesn't have a stable local internet connection and the latency is over 200 ms.
 - The network is saturated or rate-limited.

We recommend you choose VMs locations that are as close to your users as possible. For example, if the user is located in India but the VM is in the United States, there will be latency that will affect the overall user experience. 

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
