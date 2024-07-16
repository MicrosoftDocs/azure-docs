---
title: Azure Service Bus Geo-Replication | Microsoft Docs
description: How to use geographical regions to promote between regions in Azure Service Bus for metadata and data
ms.topic: article
ms.date: 04/29/2024
ms.custom: references_regions
---

# Azure Service Bus Geo-Replication (Preview)

The Service Bus Geo-Replication feature is one of the options to [insulate Azure Service Bus applications against outages and disasters](service-bus-outages-disasters.md), providing replication of both metadata (entities, configuration, properties) and data (message data and message property / state changes).

> [!NOTE]
> This feature is available for the Premium tier of Azure Service Bus.

The Geo-Replication feature ensures that the metadata and data of a namespace are continuously replicated from a primary region to one or more secondary regions.
- Queues, topics, subscriptions, filters.
- Data, which resides in the entities.
- All state changes and property changes executed against the messages within a namespace.
- Namespace configuration.

> [!NOTE]
> Currently only a single secondary is supported.

This feature allows promoting any secondary region to primary, at any time. Promoting a secondary repoints the name for the namespace to the selected secondary region, and switches the roles between the primary and secondary region. The promotion is nearly instantaneous once initiated. 

> [!IMPORTANT]
> - This feature is currently in public preview, and as such shouldn't be used in production scenarios.
> - The below regions are currently supported in the public preview.
>
> | US               | Europe        |
> |------------------|---------------|
> | Central US EUAP  | Italy North   |
> |                  | Spain Central |
> |                  | Norway East   |
>
> - This feature is currently available on new namespaces. If a namespace had this feature enabled before, it can be disabled (by removing the secondary regions), and re-enabled.
> - The following features currently aren't supported. We're continuously working on bringing more features to the public preview, and will update this list with the latest status.
>     - Large message support.
>     - VNET / advanced network features (private endpoints, IP ACLs, NSP, service endpoints).
>     - Identities (MSI, disable local auth) and encryption settings (customer-managed key (CMK) encryption or bring your own key (BYOK) encryption).
>     - Autoscaling.
>     - Partitioned namespaces.
>     - Send events to Event Grid.
> - This feature can't be used in combination with the [Azure Service Bus Geo-Disaster Recovery](service-bus-geo-dr.md) feature.

## Scenarios
The Geo-replication feature can be used to implement different scenarios, as described here.

### Disaster recovery
Data and metadata are continuously synchronized between the primary and secondary regions. If a region lags or is unavailable, it's possible to promote a secondary region as the primary. This promotion allows for the uninterrupted operation of workloads in the newly promoted region. Such a promotion may be necessitated by degradation of Service Bus or other services within your workload, particularly if you aim to run the various components together. Depending on the severity and impacted services, the promotion could either be planned or forced. In case of planned promotion in-flight messages are replicated before finalizing the promotion, while with forced promotion this is immediately executed.

### Region migration
There are times when you want to migrate your Service Bus workloads to run in a different region. For example, when Azure adds a new region that is geographically closer to your location, users, or other services. Alternatively, you might want to migrate when the regions where most of your workloads run is shifted. The Geo-Replication feature also provides a good solution in these cases. In this case, you would set up Geo-Replication on your existing namespace with the desired new region as secondary region and wait for the synchronization to complete. At this point, you would start a planned promotion, allowing any in-flight messages to be replicated. Once the promotion is completed you can now optionally remove the old region, which is now the secondary region, and continue running your workloads in the desired region.

## Basic concepts

The Geo-Replication feature implements metadata and data replication in a primary-secondary replication model. At a given time there’s a single primary region, which is serving both producers and consumers. The secondaries act as hot stand-by regions, meaning that it isn't possible to interact with these secondary regions. However, they run in the same configuration as the primary region, allowing for fast promotion, and meaning they your workloads can immediately continue running after promotion has been completed. The Geo-Replication feature is available for the [Premium tier](service-bus-premium-messaging.md).

Some of the key aspects of Geo-Replication feature are: 
- Service Bus services perform fully managed replication of metadata, message data, and message state and property changes across regions adhering to the replication consistency configured at the namespace.
- Single namespace hostname; Upon successful configuration of a Geo-Replication enabled namespace, users can use the namespace hostname in their client application. The hostname behaves agnostic of the configured primary and secondary regions, and always points to the primary region.
- When a customer initiates a promotion, the hostname points to the region selected to be the new primary region. The old primary becomes a secondary region.
- It isn't possible to read or write on the secondary regions.
- Synchronous and asynchronous replication modes, further described [here](#replication-modes).
- Customer-managed promotion from primary to secondary region, providing full ownership and visibility for outage resolution. Metrics are available, which can help to automate the promotion from customer side.
- Secondary regions can be added or removed at the customer's discretion.

## Replication modes

There are two replication modes, synchronous and asynchronous. It's important to know the differences between the two modes.

### Asynchronous replication

Using asynchronous replication, all requests are committed on the primary, after which an acknowledgment is sent to the client. Replication to the secondary regions happens asynchronously. Users can configure the maximum acceptable amount of lag time. The lag time is the service side offset between the latest action on the primary and the secondary regions. If the lag for an active secondary grows beyond user configuration, the primary starts throttling incoming requests.

### Synchronous replication

Using synchronous replication, all requests are replicated to the secondary, which must commit and confirm the operation before committing on the primary. As such, your application publishes at the rate it takes to publish, replicate, acknowledge, and commit. Moreover, it also means that your application is tied to the availability of both regions. If the secondary region lags or is unavailable, messages won't be acknowledged and committed, and the primary will throttle incoming requests.

### Replication mode comparison

With **synchronous** replication:
- Latency is longer due to the distributed commit operations.
- Availability is tied to the availability of two regions.

On the other hand, synchronous replication provides the greatest assurance that your data is safe. If you have synchronous replication, then when we commit it, it commits in all of the regions you configured for Geo-Replication, providing the best data assurance.

With **asynchronous** replication:
- Latency is impacted minimally.
- The loss of a secondary region doesn't immediately impact availability. However, availability gets impacted once the configured maximum replication lag is reached.

As such, it doesn’t have the absolute guarantee that all regions have the data before we commit it like synchronous replication does, and data loss or duplication may occur. However, as you're no longer immediately impacted when a single region lags or is unavailable, application availability improves, in addition to having a lower latency.

| Capability                     | Synchronous replication                                      | Asynchronous replication                                           |
|--------------------------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| Latency                        | Longer due to distributed commit operations                  | Minimally impacted                                                 |
| Availability                   | Tied to availability of secondary regions                    | Loss of a secondary region doesn't immediately impact availability |
| Data consistency               | Data always committed in both regions before acknowledgment  | Data committed in primary only before acknowledgment               |
| RPO (Recovery Point Objective) | RPO 0, no data loss on promotion                             | RPO > 0, possible data loss on promotion                           |

The replication mode can be changed after configuring Geo-Replication. You can go from synchronous to asynchronous or from asynchronous to synchronous. If you go from asynchronous to synchronous, your secondary will be configured as synchronous after lag reaches zero. If you're running with a continual lag for whatever reason, then you may need to pause your publishers in order for lag to reach zero and your mode to be able to switch to synchronous. The reasons to have synchronous replication enabled, instead of asynchronous replication, are tied to the importance of the data, specific business needs, or compliance reasons, rather than availability of your application.

> [!NOTE]
> In case a secondary region lags or becomes unavailable, the application will no longer be able to replicate to this region and will start throttling once the replication lag is reached. To continue using the namespace in the primary location, the afflicted secondary region can be removed. If no more secondary regions are configured, the namespace will continue without Geo-Replication enabled. It's possible to add additional secondary regions at any time.

## Secondary region selection

To enable the Geo-Replication feature, you need to use primary and secondary regions where the feature is enabled. The Geo-Replication feature depends on being able to replicate published messages from the primary to the secondary regions. If the secondary region is on another continent, this has a major impact on replication lag from the primary to the secondary region. If using Geo-Replication for availability reasons, you're best off with secondary regions being at least on the same continent where possible. To get a better understanding of the latency induced by geographic distance, you can learn more from [Azure network round-trip latency statistics](/azure/networking/azure-network-latency).

## Geo-Replication management

The Geo-Replication feature enables customers to configure a secondary region towards which to replicate metadata and data. As such, customers can perform the following management tasks:
- Configure Geo-Replication; Secondary regions can be configured on any new or existing namespace in a region with the Geo-Replication feature enabled.
    > [!NOTE]
    > Currently in the public preview only new namespaces are supported.
- Configure the replication consistency; Synchronous and asynchronous replication is set when Geo-Replication is configured but can also be switched afterwards.
- Trigger promotion; All promotions are customer initiated.
- Remove a secondary; If at any time you want to remove a secondary region, you can do so after which the data in the secondary region is deleted.

## Setup

### Using Azure portal

The following section is an overview to set up the Geo-Replication feature on a new namespace through the Azure portal.
> [!NOTE]
> This experience might change during public preview. We'll update this document accordingly.

1. Create a new premium-tier namespace.
1. Check the **Enable Geo-replication checkbox** under the *Replication (preview)* section.
1. Click on the **Add secondary region** button, and choose a region.
1. Either check the **Synchronous replication** checkbox, or specify a value for the **Async Replication - Max Replication lag** value in seconds.
:::image type="content" source="./media/service-bus-geo-replication/create-namespace-with-geo-replication.png" alt-text="Screenshot showing the Create Namespace experience with Geo-Replication enabled.":::

### Using Bicep template

To create a namespace with the Geo-Replication feature enabled, add the *geoDataReplication* properties section.

```bicep
param serviceBusName string
param primaryLocation string
param secondaryLocation string
param maxReplicationLagInSeconds int

resource sb 'Microsoft.ServiceBus/namespaces@2023-01-01-preview' = {
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

Once you create a namespace with the Geo-Replication feature enabled, you can manage the feature from the **Replication (preview)** blade. 

### Switch replication mode

To switch between replication modes, or update the maximum replication lag, click on the link under **Replication consistency**, and click the checkbox to enable / disable synchronous replication, or update the value in the textbox to change the asynchronous maximum replication lag.
:::image type="content" source="./media/service-bus-geo-replication/update-namespace-geo-replication-configuration.png" alt-text="Screenshot showing how to update the configuration of the Geo-Replication feature.":::

### Delete secondary region

To remove a secondary region, click on the **...**-ellipsis next to the region, and click **Delete**. To delete the region, follow the instructions in the pop-up blade.
:::image type="content" source="./media/service-bus-geo-replication/delete-secondary-region-from-geo-replication.png" alt-text="Screenshot showing how to delete a secondary region.":::

### Promotion flow

A promotion is triggered manually by the customer (either explicitly through a command, or through client owned business logic that triggers the command) and never by Azure. It gives the customer full ownership and visibility for outage resolution on Azure's backbone. When choosing **Planned** promotion, the service waits to catch up the replication lag before initiating the promotion. On the other hand, when choosing **Forced** promotion, the service immediately initiates the promotion. The namespace will be placed in read-only mode from the time that a promotion is requested, until the time that the promotion has completed. It is possible to do a forced promotion at any time after a planned promotion has been initiated. This puts the user in control to expedite the promotion, when a planned failover takes longer than desired.

> [!IMPORTANT]
> When using **Forced** promotion, any data that has not been replicated may be lost.

After the promotion is initiated:

1. The hostname is updated to point to the secondary region, which can take up to a few minutes.
    > [!NOTE]
    > You can check the current primary region by initiating a ping command:
    > ping *your-namespace-fully-qualified-name*

1. Clients automatically reconnect to the secondary region.

:::image type="content" source="./media/service-bus-geo-replication/promotion-flow.png" alt-text="Screenshot of the portal showing the flow of promotion from primary to secondary region." lightbox="./media/service-bus-geo-replication/promotion-flow.png":::

You can automate promotion either with monitoring systems, or with custom-built monitoring solutions. However, such automation takes extra planning and work, which is out of the scope of this article.

### Using Azure portal

In the portal, click on the **Promote** icon, and follow the instructions in the pop-up blade to delete the region. 

:::image type="content" source="./media/service-bus-geo-replication/promote-secondary-region.png" alt-text="Screeshot showing the flow to promote secondary region." lightbox="./media/service-bus-geo-replication/promote-secondary-region.png":::

### Using Azure CLI

Execute the Azure CLI command to initiate the promotion. The **Force** property is optional, and defaults to **false**.

```azurecli
az rest --method post --url https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.ServiceBus/namespaces/<namespaceName>/failover?api-version=2023-01-01-preview --body "{'properties': {'PrimaryLocation': '<newPrimaryocation>', 'api-version':'2023-01-01-preview', 'Force':'false'}}"
```

### Monitoring data replication
Users can monitor the progress of the replication job by monitoring the replication lag metric in Log Analytics.
- Enable Metrics logs in your Service Bus namespace as described at [Monitor Azure Service Bus](/azure/service-bus-messaging/monitor-service-bus). 
- Once Metrics logs are enabled, you need to produce and consume data from the namespace for a few minutes before you start to see the logs. 
- To view Metrics logs, navigate to Monitoring section of Service Bus and click on the **Logs** blade. You can use the following query to find the replication lag (in seconds) between the primary and secondary regions. 

```kusto
AzureMetrics
| where TimeGenerated > ago(1h)
| where MetricName == "ReplicationLagDuration"
```

### Publishing data
Publishing applications can publish data to geo replicated namespaces via the namespace hostname of the Geo-Replication enabled namespace. The publishing approach is the same as the non-Geo-Replication case and no changes to data plane SDKs or client applications are required. 
Publishing may not be available during the following circumstances:
- After requesting promotion of a secondary region, the existing primary region rejects any new messages that are published to Service Bus until promotion has completed.
- When replication lag between primary and secondary regions reaches the max replication lag duration, the publisher ingress workload may get throttled. 

Publisher applications can't directly access any namespaces in the secondary regions. 

### Consuming Data 
Consuming applications can consume data using the namespace hostname of a namespace with the Geo-Replication feature enabled. Consumer operations aren't supported from the moment that promotion is initiated until promotion is completed.

## Considerations

Note the following considerations to keep in mind with this release:

- In your promotion planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the promotion.
- Promoting a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once.

## Pricing
The Premium tier for Service Bus is priced per [Messaging Unit](service-bus-premium-messaging.md#how-many-messaging-units-are-needed). With the Geo-Replication feature, secondary regions run on the same number of MUs as the primary region, and the pricing is calculated over the total number of MUs. Additionally, there's a charge for based on the published bandwidth times the number of secondary regions. During the early public preview, this charge is waived.

## Next steps

- See the Geo-Replication [REST API reference here](/rest/api/servicebus/controlplane-stable/disaster-recovery-configs).
- Run the Geo-Replication [sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/SBGeoDR2/SBGeoDR2).
- See the Geo-Replication [sample that sends messages to an alias](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/TestGeoDR/ConsoleApp1).

To learn more about Service Bus messaging, see the following articles:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
* [REST API](/rest/api/servicebus/)