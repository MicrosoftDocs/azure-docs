---
 title: include file
 description: include file
 ms.topic: include
 ms.custom: include file
 services: time-series-insights
 ms.service: time-series-insights
 author: kingdomofends
 ms.author: adgera
 ms.date: 04/29/2019
---

## Business disaster recovery

This section describes Azure Time Series Insights features that keep apps and services running even in the event of a disaster (**business disaster recovery**).

### High availability

As an Azure service, Time Series Insights provides certain **high availability** features using redundancies at the Azure region level. For instance, Microsoft Azure supports disaster recovery capabilities through Azure's **cross-region availability** feature.

Additional high availability features provided through Azure (and also available to any Time Series Insights instance) include:

1. **Failover**: Azure provides [geo-replication and loading balancing](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region).
1. **Data restoration** and **storage recovery**: Azure provides [several options to preserve and recover data](https://docs.microsoft.com/azure/architecture/resiliency/recovery-data-corruption).
1. **Site recovery** features through [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/).

To provide global, cross-region high availability for devices and users, make sure to enable these powerful Azure disaster recovery features.

> [!NOTE]
> If Azure is configured to enable **cross-region availability**, no additional configuration is required within Time Series Insights.

### IoT and Event hubs

Some Azure IoT services also include built-in business disaster recovery features:

1. [IoT Hub high-availability disaster recovery](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr) including intra-region redundancy.
1. [Event Hub policies](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr)
1. [Azure Storage redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

While these features are not immediately present in Azure Time Series Insights, using those integrated services will provide those features to your Azure Time Series Insights instance.

### Time Series Insights

As described, there are numerous ways to keep Time Series Insights data, apps, and services running even in the event of a disaster. However, it may be determined that a complete, duplicate, backup or copy of your Azure Time Series environment is also required. That can be useful:

1. As a TSI-specific **failover instance** to redirect data and traffic to in the event of another instance's failure.
1. For auditing and data preservation purposes.

In general, the best way to duplicate a TSI environment is to create a second TSI environment in a backup Azure region. Events are then also sent to this secondary environment from your primary event source. Make sure to use a second, dedicated, consumer group and to follow that sources business disaster recovery guidelines (shared above).

Specifically, one would follow these steps to create and use a secondary Time Series Insights environment for the purposes described:

1. Create an environment in a second region ([Create a new Time Series Insights environment in the Azure portal](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-get-started)).
1. Create a second dedicated consumer group for your event source.
1. Connect that event source to the new environment making sure to designate the second, dedicated consumer group.
    * Review the Time Series Insights [IoT Hub](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-iothub) and [Event hub](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-data-access) documentation.

Finally:

* If your primary region is affected during a disaster incident, reroute operations to the backup Time Series Insights environment.
* Use your second region to backup and recover all TSI telemetry and query data.

> [!IMPORTANT]
> * Note that a delay might be experienced in the event of a failover.
> * Failover might also cause a momentary spike in message processing as operations are rerouted.
> * For more information, see [Mitigate latency in Time Series Insights](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-environment-mitigate-latency).