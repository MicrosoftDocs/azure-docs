---
ms.topic: include
ms.service: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: diviso
ms.date: 04/01/2021
---

## Business disaster recovery

This section describes features of Azure Time Series Insights that keep apps and services running, even if a disaster occurs (known as *business disaster recovery*).

### High availability

As an Azure service, Azure Time Series Insights provides certain *high availability* features by using redundancies at the Azure region level. For example, Azure supports disaster recovery capabilities through Azure's *cross-region availability* feature.

Additional high-availability features provided through Azure (and also available to any Azure Time Series Insights instance) include:

- **Failover**: Azure provides [geo-replication and load balancing](/azure/architecture/resiliency/recovery-loss-azure-region).
- **Data restoration** and **storage recovery**: Azure provides [several options to preserve and recover data](/azure/architecture/resiliency/recovery-data-corruption).
- **Azure Site Recovery**: Azure provides recovery features through [Azure Site Recovery](../articles/site-recovery/index.yml).
- **Azure Backup**: [Azure Backup](../articles/backup/backup-architecture.md) supports both on-premises and in-cloud backup of Azure VMs.

Make sure you enable the relevant Azure features to provide global, cross-region high availability for your devices and users.

> [!NOTE]
> If Azure is configured to enable cross-region availability, no additional cross-region availability configuration is required in Azure Time Series Insights.

### IoT and event hubs

Some Azure IoT services also include built-in business disaster recovery features:

- [Azure IoT Hub high-availability disaster recovery](../articles/iot-hub/iot-hub-ha-dr.md), which includes intra-region redundancy
- [Azure Event Hubs policies](../articles/event-hubs/event-hubs-geo-dr.md)
- [Azure Storage redundancy](../articles/storage/common/storage-redundancy.md)

Integrating Azure Time Series Insights with the other services provides additional disaster recovery opportunities. For example, telemetry sent to your event hub might be persisted to a backup Azure Blob storage database.

### Azure Time Series Insights

There are several ways to keep your Azure Time Series Insights data, apps, and services running, even if they're disrupted.

However, you might determine that a complete backup copy of your Azure Time Series environment also is required, for the following purposes:

- As a *failover instance* specifically for Azure Time Series Insights to redirect data and traffic to
- To preserve data and auditing information

In general, the best way to duplicate an Azure Time Series Insights environment is to create a second Azure Time Series Insights environment in a backup Azure region. Events are also sent to this secondary environment from your primary event source. Make sure that you use a second dedicated consumer group. Follow that source's business disaster recovery guidelines, as described earlier.

To create a duplicate environment:

1. Create an environment in a second region. For more information, read [Create a new Azure Time Series Insights environment in the Azure portal](../articles/time-series-insights/time-series-insights-get-started.md).
1. Create a second dedicated consumer group for your event source.
1. Connect that event source to the new environment. Make sure that you designate the second dedicated consumer group.
1. Review the Azure Time Series Insights [IoT Hub](../articles/time-series-insights/how-to-ingest-data-iot-hub.md) and [Event Hubs](../articles/time-series-insights/concepts-access-policies.md) documentation.

If an event occurs:

1. If your primary region is affected during a disaster incident, reroute operations to the backup Azure Time Series Insights environment.
1. Because hub sequence numbers restart from 0 after the failover, recreate the event source in both regions/environments with different consumer groups to avoid creating what would look like duplicate events.
1. Delete the primary event source, which is now inactive, to free up an available event source for your environment. (There's a limit of two active event sources per environment.)
1. Use your second region to back up and recover all Azure Time Series Insights telemetry and query data.

> [!IMPORTANT]
> If a failover occurs:
>
> - A delay might also occur.
> - A momentary spike in message processing might occur, as operations are rerouted.
>
> For more information, read [Mitigate latency in Azure Time Series Insights](../articles/time-series-insights/time-series-insights-environment-mitigate-latency.md).