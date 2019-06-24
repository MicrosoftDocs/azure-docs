---
ms.topic: include
ms.service: time-series-insights
author: kingdomofends
ms.author: adgera
ms.date: 04/29/2019
---

## Business disaster recovery

This section describes features of Azure Time Series Insights that keep apps and services running, even if a disaster occurs (known as *business disaster recovery*).

### High availability

As an Azure service, Time Series Insights provides certain *high availability* features by using redundancies at the Azure region level. For example, Azure supports disaster recovery capabilities through Azure's *cross-region availability* feature.

Additional high-availability features provided through Azure (and also available to any Time Series Insights instance) include:

- **Failover**: Azure provides [geo-replication and load balancing](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region).
- **Data restoration** and **storage recovery**: Azure provides [several options to preserve and recover data](https://docs.microsoft.com/azure/architecture/resiliency/recovery-data-corruption).
- **Site recovery**: Azure provides site recovery features through [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/).

Make sure you enable the relevant Azure features to provide global, cross-region high availability for your devices and users.

> [!NOTE]
> If Azure is configured to enable cross-region availability, no additional cross-region availability configuration is required in Azure Time Series Insights.

### IoT and event hubs

Some Azure IoT services also include built-in business disaster recovery features:

- [IoT Hub high-availability disaster recovery](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr), including intra-region redundancy
- [Event Hubs policies](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr)
- [Azure Storage redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

Integrating Time Series Insights with the other services provides additional disaster recovery opportunities. For example, telemetry sent to your event hub might be persisted to a backup Azure Blob storage database.

### Time Series Insights

There are several ways to keep your Time Series Insights data, apps, and services running, even if they're disrupted. 

However, you might determine that a complete backup copy of your Azure Time Series environment also is required, for the following purposes:

- As a *failover instance* specifically for Time Series Insights to redirect data and traffic to
- To preserve data and auditing information

In general, the best way to duplicate a Time Series Insights environment is to create a second Time Series Insights environment in a backup Azure region. Events are also sent to this secondary environment from your primary event source. Make sure that you use a second, dedicated consumer group. Follow that source's business disaster recovery guidelines, as described earlier.

To create a duplicate environment:

1. Create an environment in a second region. For more information, see [Create a new Time Series Insights environment in the Azure portal](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-get-started).
1. Create a second dedicated consumer group for your event source.
1. Connect that event source to the new environment. Make sure that you designate the second, dedicated consumer group.
1. Review the Time Series Insights [IoT Hub](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-iothub) and [Event Hubs](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-data-access) documentation.

If an event occurs:

1. If your primary region is affected during a disaster incident, reroute operations to the backup Time Series Insights environment.
1. Use your second region to back up and recover all Time Series Insights telemetry and query data.

> [!IMPORTANT]
> If a failover occurs:
> 
> * A delay might also occur.
> * A momentary spike in message processing might occur, as operations are rerouted.
> 
> For more information, see [Mitigate latency in Time Series Insights](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-environment-mitigate-latency).

