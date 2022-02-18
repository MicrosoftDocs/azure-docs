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

Azure Virtual Desktop helps users host client sessions on their session hosts runningon Azure. When a user starts a session, they connect from their end-user device, also known as a "client," over a network to access the session host. It's important that the user experience feels as much like a local session on a physical device as possible. In this article, we'll talk about how you can measure and improve the connection quality of your end-users.

>[!NOTE]
>Azure Virtual Desktop currently only supports network data in commercial clouds.

## Measure connection quality with Azure Log Analytics

If you're already using [Azure Log Analytics](diagnostics-log-analytics.md), you can monitor network data with the conneciton network data diagnostics. The data Log Analytics collects can help you discover areas that impact your end-user's graphical experience. The service collects data for reports about every two minutes. Log Analytics reports have the following advantages over RemoteFX network performance counters:

- Each record is connection-specific and includes the correlation ID of the connection that can be tied back to the user.

- The round trip time measured in this table is protocol-agnostic and will record the measured latency for TCP or UDP connections

To start collecting this data, you’ll need to make sure you have diagnostics and the Network Data table enabled in your your Azure Virtual Desktop host pools.

To check and modify your diagnostics settings in the Azure Portal:

1.  Sign in to the Azure portal, then go to **Azure Virtual Desktop** and select **Host pools**.

2.  Select the host pool you want to collect network data for.

3.  Select **Diagnostic settings**. Create a new setting or if you have a Diagnostic Setting already, select **Edit setting**.

4.  Select **allLogs** or the diagnostics tables you would like to collect,
    including **NetworkData**. allLogs will ensure new tables are automatically
    collected in the future.

5.  **Save** and repeat for other host pools.

Connection network data
-----------------------

Network data records include the following information:

-   **Estimated available bandwidth (kilobytes per second):** The average
    estimated available network bandwidth over the last connection time interval

-   **Estimated round trip time (milliseconds):** The average estimated time it
    takes for a network request to go from the end user device, over the network
    to the session host, and back to the end user device over the last
    connection time interval

-   **Correlation ID:** The activity ID of the AVD connection that can be
    correlated with other diagnostics from that connection.

-   **Source system:** name of the compute/cloud provider (Azure or…)

-   **Tenant ID**: a unique identifier for the Azure tenant that the record is
    associated with

-   **Time generated**: Time stamp (UTC) of when the event was generated on the
    VM. Averages were for the time window ending at the marked time stamp.

-   **Type**: The name of the table; “WVDConnectionNetworkData”

-   **Resource ID**: a unique identifier for the AVD host pool that the record
    is associated with

-   **Subscription ID:** a unique identifier for the Azure subscription that the
    record is associated with

To learn more about this table, see \<insert schema doc link\>.

Sample queries:
---------------

The following query list lets you review connection quality information. You can
run this query in the [Log Analytics query
editor](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial#write-a-query).
For each query, replace userupn with the UPN of the user you want to look up.

**Query average RTT and bandwidth**

>   // 90th, 50th, 10th Percentile for RTT in 10 min increments

>   WVDConnectionNetworkData

>   \| summarize
>   RTTP90=percentile(EstRoundTripTimeInMs,90),RTTP50=percentile(EstRoundTripTimeInMs,50),RTTP10=percentile(EstRoundTripTimeInMs,10)
>   by bin(TimeGenerated,10m)

>   \| render timechart

>   // 90th, 50th, 10th Percentile for BW in 10 min increments

>   WVDConnectionNetworkData

>   \| summarize
>   BWP90=percentile(EstAvailableBandwidthKBps,90),BWP50=percentile(EstAvailableBandwidthKBps,50),BWP10=percentile(EstAvailableBandwidthKBps,10)
>   by bin(TimeGenerated,10m)

>   \| render timechart

**Query data for a specific user**

-   **BW**

>   let user = "alias\@domain";

>   WVDConnectionNetworkData

>   \| join kind=leftouter (

>   WVDConnections

>   \| distinct CorrelationId, UserName

>   ) on CorrelationId

>   \| where UserName == user

>   \| project EstAvailableBandwidthKBps, TimeGenerated

>   \| render columnchart

-   **RTT**

>   let user = "alias\@domain";

>   WVDConnectionNetworkData

>   \| join kind=leftouter (

>   WVDConnections

>   \| distinct CorrelationId, UserName

>   ) on CorrelationId

>   \| where UserName == user

>   \| project EstRoundTripTimeInMs, TimeGenerated

>   \| render columnchart

>   **Top 10 users with the highest RTT & their connecting region**

>   WVDConnectionNetworkData

>   \| join kind=leftouter (

>   WVDConnections

>   \| distinct CorrelationId, UserName

>   ) on CorrelationId

>   \| summarize
>   AvgRTT=avg(EstRoundTripTimeInMs),RTT_P95=percentile(EstRoundTripTimeInMs,95)
>   by UserName

>   \| top 10 by AvgRTT desc

>   **Top 10 users with the lowest bandwidth**

>   WVDConnectionNetworkData

>   \| join kind=leftouter (

>   WVDConnections

>   \| distinct CorrelationId, UserName

>   ) on CorrelationId

>   \| summarize
>   AvgBW=avg(EstAvailableBandwidthKBps),BW_P95=percentile(EstAvailableBandwidthKBps,95)
>   by UserName

>   \| top 10 by AvgBW asc

Troubleshooting
---------------

Many factors can influence the graphics quality of an Azure Virtual Desktop
connection. The WVDConnectionNetworkData table helps signal if there are
problems with network configuration, network load, or virtual machine (VM) load.

Performant round trip time will depend on the workloads running, the end user’s
sensitivity to latency, and the baseline round trip time expected for the
environment. Generally, a round trip time under 200 milliseconds results in a
good experience for an end user. To reduce round trip time:

-   Reduce the physical distance from the end users to the server. When
    possible, ensure that your end users are connecting to Virtual Machines in
    the azure region closest to them.

-   Check your network configuration. Firewalls, ExpressRoutes, and other
    network configuration features can impact RTT.

-   Check whether your network bandwidth is constrained. If your network
    bandwidth is frequently constrained, you may need to adjust your network
    configuration to improve connection quality. To view our recommended network
    settings, see [Network guidelines \| Microsoft
    Docs](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/network-guidance).

-   Check whether your compute resources are constrained by looking at CPU
    utilization and available memory on the VM. You can do this by collecting
    and reviewing performance counters from the VM, like Processor
    Information(_Total)\\% Processor Time for CPU utilization and
    Memory(\*)\\Available Mbytes for available memory (both are enabled by
    default for Azure Virtual Desktop Insights). If your VM resources are
    frequently constrained, it could mean your VM size cannot support the
    workloads and you may need to upgrade the VM. To collect performance
    counters, see [Configuring performance
    counters](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/data-sources-performance-counters#configuring-performance-counters).











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

- To check the best location for optimal latency, see the [Azure Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).
- For pricing plans, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To get started with your Azure Virtual Desktop deployment, check out [our tutorial](./create-host-pools-azure-marketplace.md).

-   To learn about bandwidth requirements for Azure Virtual Desktop,
    see [Understanding Remote Desktop Protocol (RDP) Bandwidth Requirements for
    Azure Virtual
    Desktop](https://docs.microsoft.com/en-us/azure/virtual-desktop/rdp-bandwidth).

-   To learn about Azure Virtual Desktop network connectivity,
    see [Understanding Azure Virtual Desktop network
    connectivity](https://docs.microsoft.com/en-us/azure/virtual-desktop/network-connectivity).

-   Get started with Azure Monitor for Azure Virtual Desktop
    <https://docs.microsoft.com/en-us/azure/virtual-desktop/azure-monitor>
