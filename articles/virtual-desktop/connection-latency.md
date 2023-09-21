---
title: Analyze connection quality in Azure Virtual Desktop - Azure
description: Connection quality for Azure Virtual Desktop users.
author: Heidilohr
ms.topic: conceptual
ms.date: 01/05/2023
ms.author: helohr
manager: femila
ms.custom: engagement-fy23
---
# Analyze connection quality in Azure Virtual Desktop

>[!IMPORTANT]
>The Connection Graphics Data Logs are currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Virtual Desktop helps users host client sessions on their session hosts running on Azure. When a user starts a session, they connect from their local device over a network to access the session host. It's important that the user experience feels as much like a local session on a physical device as possible. To understand the network connectivity from a user's device to a session host, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).

You can analyze connection quality in your Azure Virtual Desktop deployment by using Azure Log Analytics. In this article, we'll talk about how you can measure your connection network and connection graphics to improve the connection quality of your end-users.

## Connection network and graphics data

The connection network and graphics data that [Azure Log Analytics](diagnostics-log-analytics.md) collects can help you discover areas that impact your end-user's graphical experience. The service collects data for reports regularly throughout the session. You can also use [RemoteFX network performance counters](remotefx-graphics-performance-counters.md) to get some graphics-related performance data from your deployment, but they're not quite as comprehensive as Azure Log Analytics. Azure Virtual Desktop connection network data reports have the following advantages over RemoteFX network performance counters:

- Each record is connection-specific and includes the correlation ID of the connection that can be tied back to the user.

- The round trip time measured in this table is protocol-agnostic and will record the measured latency for Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) connections.

### Connection network data

The network data you collect for your data tables using the *NetworkData* table includes the following information:

- The **estimated available bandwidth (kilobytes per second)** is the average estimated available network bandwidth during each connection time interval.

- The **estimated round trip time (milliseconds)** is the average estimated round trip time during each connection time interval. Round trip time is how long a network request takes to go from the end-user's device to the session host through the network, then return from the session host to the end-user device.

- The **Correlation ID** is the ActivityId of a specific Azure Virtual Desktop connection that's assigned to every diagnostic within that connection.

- The **time generated** is a timestamp in Coordinated Universal Time (UTC) time that marks when an event the data counter is tracking happened on the virtual machine (VM). All averages are measured by the time window that ends at the marked timestamp.

- The **Resource ID** is a unique ID assigned to the Azure Virtual Desktop host pool associated with the data the diagnostics service collects for this table.

- The **source system**, **Subscription ID**, **Tenant ID**, and **type** (table name).

#### Frequency

The service generates these network data points every two minutes during an active session.

### Connection graphics data (preview)

You should consult the *ConnectionGraphicsData* table (preview) when users report slow or choppy experiences in their Azure Virtual Desktop sessions. The ConnectionGraphicsData table will give you useful information whenever graphical indicators, end-to-end delay, and dropped frames percentage fall below the "healthy" threshold for Azure Virtual Desktop. This table will help your admins track and understand factors across the server, client, and network that could be contributing to the user's slow or choppy experience. However, while the ConnectionGraphicsData table is a useful tool for troubleshooting poor user experience, since it's not regularly populated throughout a session, it isn't a reliable environment baseline.

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

## Next steps

- Learn more about how to monitor and run queries about connection quality issues at [Monitor connection quality](connection-quality-monitoring.md).
- Troubleshoot connection and latency issues at [Troubleshoot connection quality for Azure Virtual Desktop](troubleshoot-connection-quality.md).
- To check the best location for optimal latency, see the [Azure Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).
- For pricing plans, see [Azure Log Analytics pricing](/services-hub/premier/health/azure_pricing).
- To get started with your Azure Virtual Desktop deployment, check out [our tutorial](./create-host-pools-azure-marketplace.md).
- To learn about bandwidth requirements for Azure Virtual Desktop, see [Understanding Remote Desktop Protocol (RDP) Bandwidth Requirements for Azure Virtual Desktop](rdp-bandwidth.md).
- To learn about Azure Virtual Desktop network connectivity, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).
- Learn how to use Azure Virtual Desktop Insights at [Get started with Azure Virtual Desktop Insights](insights.md).
