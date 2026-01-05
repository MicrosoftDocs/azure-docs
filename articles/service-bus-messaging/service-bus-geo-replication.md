---
title: Azure Service Bus Geo-Replication | Microsoft Docs
description: How to use geographical regions to promote between regions in Azure Service Bus for metadata and data
ms.topic: article
ms.date: 07/15/2025
ms.custom:
  - references_regions
---

# Azure Service Bus Geo-Replication

The Service Bus Geo-Replication feature is one of the options to [insulate Azure Service Bus applications against outages and disasters](service-bus-outages-disasters.md), providing replication of both metadata (entities, configuration, properties) and data (message data and message property / state changes). You can enable Geo-Replication on new and existing namespaces.

The Geo-Replication feature ensures that the metadata and data of a namespace are continuously replicated from a primary region to one or more secondary regions.
- Queues, topics, subscriptions, filters.
- Data, which resides in the entities.
- All state changes and property changes executed against the messages within a namespace.
- Namespace configuration.

This feature allows promoting any secondary region to primary, at any time. Promoting a secondary repoints the namespace to the selected secondary region, and switches the roles between the primary and secondary region.

:::image type="content" source="./media/service-bus-geo-replication/geo-replication-overview.png" alt-text="Diagram showing Geo-Replication with a primary region (East US) replicating to a secondary region (East US 2), with clients connected to the primary.":::

> [!NOTE]
> - This feature is available for the Premium tier of Azure Service Bus.
> - Currently only a single secondary region is supported.

> [!IMPORTANT]
> - This feature can't be used in combination with the [Azure Service Bus Geo-Disaster Recovery](service-bus-geo-dr.md) feature.
> - The following features currently not (fully) available yet. We're continuously working on bringing more features, and will update this list with the latest status.
>     - Large messages are not supported yet.
>     - Geo-Replication on [partitioned namespaces](enable-partitions-premium.md) is still in public preview.
> - Currently, when a failover is performed, the timer for entities that have auto-delete on idle enabled is reset and starts over, this will be fixed in a future release.
> - When you have Event Grid integration enabled on a namespace that is using Geo-Replication, note the following.
>   - Event Grid replicates to the [geo-paired location](/azure/reliability/reliability-event-grid#set-up-disaster-recovery), not the secondary region set up for geo-replication.
>   - [Promotion](#promotion-flow) of a secondary region for Service Bus doesn't initiate a failover of Event Grid. Consequently, after promotion, Service Bus is now running in the new primary region, however Event Grid is still running in the initial primary region.
>   - If the initial primary region is [removed](#delete-secondary-region) from the Geo-Replication configuration, this breaks the Event Grid integration.

## Comparison with Geo-Disaster Recovery

Azure Service Bus offers two features for geographic resilience: Geo-Replication and [Geo-Disaster Recovery](service-bus-geo-dr.md). The key difference is that Geo-Replication replicates both metadata and data (messages, message states, property changes), while Geo-Disaster Recovery replicates metadata only. For most disaster recovery scenarios, Geo-Replication is the recommended choice. For a detailed comparison, see [High-level feature differences](service-bus-outages-disasters.md#high-level-feature-differences).

## Scenarios
The Geo-Replication feature can be used to implement different scenarios, as described here. For guidance on when to trigger a promotion, see [Recommended scenarios to trigger promotion](#recommended-scenarios-to-trigger-promotion).

### Disaster recovery
Data and metadata are continuously synchronized between the primary and secondary regions. If your primary region experiences a degradation of service, it's possible to promote a secondary region as the primary. This promotion allows for the uninterrupted operation of workloads in the newly promoted region. Such a promotion may be necessitated by degradation of Service Bus or other services within your workload, particularly if you aim to run the various components together. Depending on the severity and impacted services, the promotion could either be planned or forced. In case of planned promotion in-flight messages are replicated before finalizing the promotion, while with forced promotion this is immediately executed.

### Region migration
There are times when you want to migrate your Service Bus workloads to run in a different region. For example, when Azure adds a new region that is geographically closer to your location, users, or other services. Alternatively, you might want to migrate when the regions where most of your workloads run is shifted. The Geo-Replication feature also provides a good solution in these cases. In this case, you would set up Geo-Replication on your existing namespace with the desired new region as secondary region and wait for the synchronization to complete. At this point, you would start a planned promotion, allowing any in-flight messages to be replicated. Once the promotion is completed you can now optionally remove the old region, which is now the secondary region, and continue running your workloads in the desired region.

### Planned maintenance
During planned maintenance activities in the primary region, you can promote the secondary region to maintain high availability for mission-critical applications. This approach allows you to perform maintenance without impacting your workloads.

## Basic concepts

The Geo-Replication feature implements metadata and data replication in a primary-secondary replication model. At a given time there's a single primary region, which is serving both producers and consumers. Secondary regions can be in one of two states:

- **Active secondary**: A secondary region that is part of the replication configuration and is actively being replicated to. Active secondaries are part of quorum for synchronous replication. For more information, see the Ready state in [Management](#management).
- **Idle secondary**: A secondary region that is being set up or resynchronizing after a promotion. Idle secondaries aren't part of quorum and don't affect acknowledgments in synchronous mode. For more information, see the InBuild state in [Management](#management).

Secondary regions act as hot stand-by regions, meaning that it isn't possible to interact with these secondary regions. However, they run in the same configuration as the primary region, allowing for fast promotion, and meaning your workloads can immediately continue running after promotion has been completed.

Some of the key aspects of Geo-Replication feature are:
- Service Bus services perform fully managed replication of metadata, message data, and message state and property changes across regions adhering to the replication consistency configured at the namespace.
- Single namespace hostname; Upon successful configuration of a Geo-Replication enabled namespace, users can use the namespace hostname in their client application. The hostname behaves agnostic of the configured primary and secondary regions, and always points to the primary region.
- When a customer initiates a promotion, the hostname points to the region selected to be the new primary region. The old primary becomes a secondary region.
- It isn't possible to read or write on the secondary regions.
- No changes to data plane SDKs or client applications are required to use Geo-Replication.
- Synchronous and asynchronous replication modes, further described [here](#replication-modes).
- Customer-managed promotion from primary to secondary region, providing full ownership and visibility for outage resolution. [Replication lag metrics](#monitoring-data-replication) are available, which can be used to monitor replication status and automate promotion.
- Secondary regions can be added or removed at the customer's discretion.
- When the replication lag reaches the configured maximum, publisher requests will be throttled.

## Replication modes

There are two replication modes, synchronous and asynchronous. It's important to know the differences between the two modes.

### Asynchronous replication

Using asynchronous replication, all requests are committed on the primary, after which an acknowledgment is sent to the client. Replication to the secondary regions happens asynchronously. Users can configure the maximum acceptable amount of lag time. The lag time is the service side offset between the latest action on the primary and the secondary regions. The service continuously replicates the data and metadata, ensuring the lag remains as small as possible. If the lag for an active secondary grows beyond the user configured maximum replication lag, the primary starts throttling incoming requests.

### Synchronous replication

Using synchronous replication, all requests are committed to both the primary and secondary before an acknowledgment is sent to the client. As such, your application publishes at the rate it takes to commit to all regions. Moreover, it also means that your application is tied to the availability of both regions. If the secondary region lags or is unavailable, messages won't be acknowledged and committed, and the primary will throttle incoming requests.

### Replication mode comparison

With **synchronous** replication:
- Latency is longer due to the distributed commit operations.
- Availability is tied to the availability of two regions.

On the other hand, synchronous replication provides the greatest assurance that your data is safe. If you have synchronous replication, then when we commit it, it commits in all of the regions you configured for Geo-Replication, providing the best data assurance.

With **asynchronous** replication:
- Latency is impacted minimally.
- The loss of a secondary region doesn't immediately impact availability. However, availability gets impacted once the configured maximum replication lag is reached.

As such, it doesn't have the absolute guarantee that all regions have the data before we commit it like synchronous replication does, and data loss or duplication may occur when forced promotion is used. However, as you're no longer immediately impacted when a single region lags or is unavailable, application availability improves, in addition to having a lower latency.

| Capability                     | Synchronous replication                                      | Asynchronous replication                                           |
|--------------------------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| Latency                        | Longer due to distributed commit operations                  | Minimally impacted                                                 |
| Availability                   | Tied to availability of secondary regions                    | Loss of a secondary region doesn't immediately impact availability |
| Data consistency               | Data always committed in both regions before acknowledgment  | Data committed in primary only before acknowledgment               |
| RPO (Recovery Point Objective) | RPO 0, no data loss on promotion                             | RPO within configured lag, possible data loss on forced promotion  |

The replication mode can be changed after configuring Geo-Replication. You can go from synchronous to asynchronous or from asynchronous to synchronous. If you go from asynchronous to synchronous, your secondary will be configured as synchronous after lag reaches zero. If you're running with a continual lag for whatever reason, then you may need to pause your publishers in order for lag to reach zero and your mode to be able to switch to synchronous. The reasons to have synchronous replication enabled, instead of asynchronous replication, are tied to the importance of the data, specific business needs, or compliance reasons, rather than availability of your application.

> [!NOTE]
> In case a secondary region lags or becomes unavailable, the application will no longer be able to replicate to this region and will start throttling once the replication lag is reached. To continue using the namespace in the primary location, the afflicted secondary region can be removed. If no more secondary regions are configured, the namespace will continue without Geo-Replication enabled. It's possible to add additional secondary regions at any time.
> Top-level entities, which are queues and topics, are replicated synchronously, regardless of the replication mode configured. However, topic subscriptions adhere to the selected replication mode, and therefore, it's crucial to take them into account when deciding on the appropriate replication mode.

## Secondary region selection

The Geo-Replication feature depends on being able to replicate published messages from the primary to the secondary regions. If the secondary region is on another continent, this has a major impact on replication lag from the primary to the secondary region. If using Geo-Replication for availability reasons, you're best off with secondary regions being at least on the same continent where possible. To get a better understanding of the latency induced by geographic distance, you can learn more from [Azure network round-trip latency statistics](/azure/networking/azure-network-latency).

## Geo-Replication management

The Geo-Replication feature enables customers to configure a secondary region towards which to replicate metadata and data. As such, customers can perform the following management tasks:
- Configure Geo-Replication; Secondary regions can be configured on any new or existing namespace in a region with the Geo-Replication feature enabled.
- Configure the replication consistency; Synchronous and asynchronous replication is set when Geo-Replication is configured but can also be switched afterwards.
- Trigger promotion; All promotions are customer initiated.
- Remove a secondary; If at any time you want to remove a secondary region, you can do so after which the data in the secondary region is deleted.

## Setup

### Using Azure portal

The following section is an overview to set up the Geo-Replication feature on a new namespace through the Azure portal.

1. Create a new premium-tier namespace.
1. Check the **Enable Geo-replication checkbox** under the *Geo-Replication* section.
1. Click on the **Add secondary region** button, and choose a region.
1. Either check the **Synchronous replication** checkbox, or specify a value for the **Async Replication - Max Replication lag** value in minutes.
:::image type="content" source="./media/service-bus-geo-replication/create-namespace-with-geo-replication.png" alt-text="Screenshot showing the Create Namespace experience with Geo-Replication enabled.":::

### Using Bicep file

To create a namespace with the Geo-Replication feature enabled, add the *geoDataReplication* properties section.

```bicep
param serviceBusName string
param primaryLocation string
param secondaryLocation string
param maxReplicationLagInSeconds int

resource sb 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: serviceBusName
  location: primaryLocation
  sku: {
    name: 'Premium'
    tier: 'Premium'
    capacity: 1
  }
  properties: {
    geoDataReplication: {
      maxReplicationLagDurationInSeconds: maxReplicationLagInSeconds
      locations: [
        {
          locationName: primaryLocation
          roleType: 'Primary'
        }
        {
          locationName: secondaryLocation
          roleType: 'Secondary'
        }
      ]
    }
  }
}
```

## Management

Once you create a namespace with the Geo-Replication feature enabled, you can manage the feature from the **Geo-Replication** blade. 

The secondary region can be in one of the following states:

| State | Description |
|-------|-----------|
| InBuild | The secondary region is being set up and initial synchronization is in progress, or the region is resynchronizing after a forced promotion. Secondary regions in the InBuild state aren't part of quorum. |
| Ready | The secondary region is part of the replication configuration and is actively being replicated to. |
| Deleting | The secondary region is being removed from the replication configuration. |

### Switch replication mode

To switch between replication modes, or update the maximum replication lag, click on the link under **Replication consistency**, and click the checkbox to enable / disable synchronous replication, or update the value in the textbox to change the asynchronous maximum replication lag.
:::image type="content" source="./media/service-bus-geo-replication/update-namespace-geo-replication-configuration.png" alt-text="Screenshot showing how to update the configuration of the Geo-Replication feature.":::

### Delete secondary region

To remove a secondary region, click on **Delete** button, and follow the instructions in the pop-up blade. While the deletion is in progress, the region shows the **Deleting** state.
:::image type="content" source="./media/service-bus-geo-replication/delete-secondary-region-from-geo-replication.png" alt-text="Screenshot showing how to delete a secondary region.":::

### Promotion flow

A promotion is triggered manually by the customer (either explicitly through a command, or through client owned business logic that triggers the command) and never by Azure. It gives the customer full ownership and visibility for outage resolution on Azure's backbone.

There are two types of promotion:

- **Planned promotion**: The service waits to catch up the replication lag before initiating the promotion. The namespace is placed in read-only mode during this time, rejecting new messages and consumer operations until promotion completes.
- **Forced promotion**: The service immediately initiates the promotion without waiting for replication to catch up.

It is possible to do a forced promotion at any time after a planned promotion has been initiated, putting the user in control to expedite the promotion when a planned promotion takes longer than desired. However, switching to forced promotion carries the same data loss risks as initiating a forced promotion directly.

> [!IMPORTANT]
> When using **Forced** promotion, any data or metadata that has not been replicated may be lost. Additionally, as specific state changes have not been replicated yet, this may also result in duplicate messages being received, for example when a Complete or Defer state change was not replicated.
>
> After a forced promotion, the old primary (now secondary) still contains unreplicated data. This data is lost when the old primary resynchronizes as the new secondary.

After the promotion is initiated:

1. The hostname is updated to point to the secondary region, which can take several minutes.
    > [!NOTE]
    > You can check the current primary region by initiating a ping command:
    > ping *your-namespace-fully-qualified-name*

1. Clients automatically reconnect to the secondary region.
1. If forced promotion was used, the new secondary region enters the **InBuild** state while it resynchronizes, then transitions to **Ready**.

:::image type="content" source="./media/service-bus-geo-replication/promotion-flow.png" alt-text="Screenshot of the portal showing the flow of promotion from primary to secondary region." lightbox="./media/service-bus-geo-replication/promotion-flow.png":::

You can automate promotion either with monitoring systems, or with custom-built monitoring solutions. However, such automation takes extra planning and work, which is out of the scope of this article.

### Using Azure portal

In the portal, click on the **Promote** icon, and follow the instructions in the pop-up blade to delete the region. 

:::image type="content" source="./media/service-bus-geo-replication/promote-secondary-region.png" alt-text="Screenshot showing the flow to promote secondary region." lightbox="./media/service-bus-geo-replication/promote-secondary-region.png":::

### Using Azure CLI

Execute the [Azure CLI command](/cli/azure/servicebus/namespace?#az-servicebus-namespace-failover) to initiate the promotion.

```azurecli
az servicebus namespace failover --namespace-name <your-namespace-name> --resource-group <your-resource-group> --primary-location <new-primary-location>
```

### Monitoring data replication
Users can monitor the progress of the replication job by monitoring the replication lag metric. For a complete list of available metrics, see [Service Bus metrics](/azure/azure-monitor/reference/supported-metrics/microsoft-servicebus-namespaces-metrics).

#### View replication lag in the Azure portal
To monitor replication lag in the Azure portal:
1. Navigate to your Service Bus namespace in the Azure portal.
1. Select **Metrics** under the **Monitoring** section.
1. Select the **ReplicationLagDuration** metric from the dropdown.
1. The chart displays the replication lag between primary and secondary regions in seconds.

You can also set up alerts on this metric to be notified when lag exceeds a threshold.

#### View replication lag in Log Analytics
To use Log Analytics for querying and historical analysis:
1. Enable Metrics logs in your Service Bus namespace as described at [Monitor Azure Service Bus](monitor-service-bus.md). 
1. Once Metrics logs are enabled, you need to produce and consume data from the namespace for a few minutes before you start to see the logs. 
1. To view Metrics logs, navigate to Monitoring section of Service Bus and select the **Logs** blade. You can use the following query to find the replication lag (in seconds) between the primary and secondary regions. 

```kusto
AzureMetrics
| where TimeGenerated > ago(1h)
| where MetricName == "ReplicationLagDuration"
```

## Considerations

Note the following considerations to keep in mind with this feature:

- In your promotion planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the promotion.
- Promoting a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once.

## Pricing
The Premium tier for Service Bus is priced per [Messaging Unit](service-bus-premium-messaging.md#how-many-messaging-units-are-needed). With the Geo-Replication feature, each region runs on the same number of MUs as configured on the primary, and you're charged for the total MUs across all regions. Additionally, there's a charge based on the data replicated to secondary regions. The data transfer rate is determined by the zone where the primary region is located at the time of replication. For current pricing details, including data transfer rates, see the [Service Bus pricing page](https://azure.microsoft.com/pricing/details/service-bus/).

The total cost can be calculated as follows:
</br>
(number of regions x MUs configured on primary x hours x hourly rate per MU) + (GBs replicated x data transfer rate per GB)

For example, if you have 2 MUs configured on the primary namespace with 10 GB of data replicated:
</br>
(2 regions x 2 MUs x hours x hourly rate) + (10 GB x data transfer rate)

## Recommended scenarios to trigger promotion
While you can trigger a promotion at any time, here are some recommended scenarios where promoting a secondary to primary is advisable. For more details on each scenario, see [Scenarios](#scenarios).

- **Regional outage**: If there's a regional outage affecting the primary region, promote the secondary region to ensure business continuity and minimize downtime.
- **Performance degradation**: If the primary region is experiencing performance issues that impact the availability or reliability of your namespace, promoting the secondary region can help mitigate these issues.
- **Planned maintenance**: During scheduled maintenance activities in the primary region, promoting the secondary region helps maintain high availability.
- **Disaster recovery testing**: Periodically test your failover mechanisms to ensure your business continuity plan is effective and your applications can seamlessly switch to the secondary region when needed.

## Migration
To migrate from [Geo-Disaster Recovery](service-bus-geo-dr.md) to Geo-Replication, first break the pairing on your primary namespace.

:::image type="content" source="./media/service-bus-geo-replication/break-geo-dr-pairing.png" alt-text="Screenshot showing to click the Break pairing button in the Geo-DR overview.":::

Once the pairing has been broken, you can follow the [setup](#setup) to enable Geo-Replication.

## Private endpoints

This section provides additional considerations when using Geo-Replication with namespaces that utilize private endpoints. For general information on using private endpoints with Service Bus, see [Integrate Azure Service Bus with Azure Private Link](private-link-service.md).

When implementing Geo-Replication for a Service Bus namespace that uses private endpoints, it is important to create private endpoints for both the primary and secondary regions. These endpoints should be configured against virtual networks hosting both primary and secondary instances of your application. For example, if you have two virtual networks, VNET-1 and VNET-2, you need to create two private endpoints on the Service Bus namespace, using subnets from VNET-1 and VNET-2 respectively. Moreover, the VNETs should be set up with [cross-region peering](/azure/virtual-network/virtual-network-peering-overview), so that clients can communicate with either of the private endpoints. Finally, the [DNS](/azure/private-link/private-endpoint-dns) needs to be managed in such a way that all clients get the DNS information, which should point the namespace endpoint (namespacename.servicebus.windows.net) to the IP address of the private endpoint in the current primary region.

> [!IMPORTANT]
> When [promoting](#promotion-flow) a secondary region for Service Bus, the DNS entry also needs to be updated to point to the corresponding endpoint.

:::image type="content" source="./media/service-bus-geo-replication/geo-replication-private-endpoints.png" alt-text="Screenshot showing two VNETs with their own private endpoints and VMs connected to an on-premises instance and a Service Bus namespace.":::

The advantage of this approach is that failover can occur independently at the application layer or on the Service Bus namespace:

- Application-only failover: In this scenario, the application moves from VNET-1 to VNET-2. Since private endpoints are configured on both VNET-1 and VNET-2 for both primary and secondary namespaces, the application continues to function seamlessly.
- Service Bus namespace-only failover: Similarly, if the failover occurs only at the Service Bus namespace level, the application remains operational because private endpoints are configured on both virtual networks.

By following these guidelines, you can ensure robust and reliable failover mechanisms for your Service Bus namespaces using private endpoints.

## Next steps

To learn more about Service Bus messaging, see the following articles:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
* [REST API](/rest/api/servicebus/)
