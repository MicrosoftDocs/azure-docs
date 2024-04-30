---
title: Azure Service Bus Geo-Replication | Microsoft Docs
description: How to use geographical regions to fail over and disaster recovery in Azure Service Bus for metadata and data
ms.topic: article
ms.date: 04/29/2024
---

# Azure Service Bus Geo-Replication (Public Preview)

The Service Bus Geo-Replication feature is one of the options to [insulate Azure Service Bus applications against outages and disasters](service-bus-outages-disasters.md), provides replication of both metadata and the data itself. The feature is in public preview for the Service Bus Premium SKU. 

The Geo-Replication feature ensures that the entire configuration and data of a namespace are continuously replicated from a primary region to a secondary region.
- Queues, topics, subscriptions, filters.
- Data which resides in the entities.
- All operations (lock, receive, delete, abandon, complete, etc.) executed against the messages within a namespace.
- Namespace configuration (RBAC, CMK, advanced network settings, etc.).

This feature allows to initiate a failover or failback between the primary and secondary regions at any time. The failover repoints the name for the namespace to the secondary region, and switches the roles between the primary and secondary regions. The failover is nearly instantaneous once initiated. 

## Important points to consider during public preview

- This feature is currently in public preview, and as such shouldn't be used in production scenarios.
- Only a select few regions are currently supported, with more regions being enabled in the upcoming months.
TODO_ADD_LIST_OF_REGIONS
- The following features currently aren't supported. We're continuously working on bringing more features to the public preview, and will update this list with the latest status.
TODO_UPDATE_LIST
    - Existing namespace support; This feature is currently only available on new namespaces. If a namespace had this feature enabled before, it can be disabled (by removing the secondary regions), and re-enabled.
    - Large message support.
    - VNET / advanced network features (private endpoints, IP ACLs, NSP, service endpoints).
    - Identities (MSI, disable local auth) and encryption settings (customer-managed key (CMK) encryption or bring your own key (BYOK) encryption).
    - Autoscaling.
    - Partitioned namespaces.
    - Auto-delete entities.
    - Send events to Event Grid.

## Basic concepts

The Geo-Replication feature implements metadata and data replication in a primary-secondary replication model. At a given time there’s only one primary region, which is serving both producers and consumers. The Geo-Replication feature is available for the [Premium SKU](service-bus-premium-messaging.md) only. 

Some of the key aspects of Geo-Replication feature are: 
- Service Bus services perform fully managed byte-to-byte replication of metadata, message data, and message operations across regions adhering to the replication consistency configured at the namespace.
- Stable namespace FQDN; Upon successful configuration of a Geo-Replication enabled namespace, users can use the namespace FQDN in their client application. The FQDN behaves agnostic of the configured primary and secondary regions, and always points to the primary region.
- When a customer initiates a failover, the FQDN points to the region selected to be the new primary region. The old primary becomes a secondary region.
- Customer-managed failovers from primary to secondary region, providing full ownership and visibility for outage resolution. There's currently no automatic failover capability.
- Synchronous and asynchronous replication modes, further described [here](#replication-modes).
- There's no ability to support read-only views on secondary regions.
- Secondary regions can be added or removed at the customer's discretion.

    > [!NOTE]
    > Currently only a single secondary is supported. 

## Replication modes

There are two replication modes, synchronous and asynchronous. It's important to know the differences between the two modes and for almost all use cases, asynchronous replication is recommended.

### Asynchronous replication

When using asynchronous replication, all requests are committed on the primary, after which an acknowledgment is sent to the client. Replication to the secondary regions happens asynchronously. Users can configure the maximum acceptable amount of lag time, the offset between the latest action on the primary and the secondary regions. If the lag for an active secondary grows beyond user configuration, the primary will throttle incoming requests.

### Synchronous replication

When using synchronous replication, all requests are replicated to the secondary, which must commit and confirm the operation before it's committed on the primary. This means your application publishes at the rate it takes to publish, replicate, acknowledge, and commit. Moreover, it also means that your application is tied to the availability of both regions. If the secondary region goes down, messages won't be acknowledged and committed, and the primary will throttle incoming requests.

### Replication mode comparison

With **synchronous** replication:
- Latency is longer due to the distributed commit operations.
- Availability is tied to the availability of two regions.

On the other hand, synchronous replication provides the greatest assurance that your data is safe. If you have synchronous replication, then when we commit it, it's committed in all of the regions you configured for Geo-Replication. It provides the best data assurance and reliability.

With **asynchronous** replication:
- Latency is impacted minimally.
- Availability isn't immediately impacted by the loss of a secondary region. However, availability will get impacted once the configured maximum replication lag is reached.

As such, it doesn’t have the absolute guarantee that all regions have the data before we commit it like synchronous replication does, and data loss or duplication may occur. However, as you're no longer immediately impacted when a single region goes down, application availability and reliability will improve, in addition to having a lower latency.

The replication mode can be changed after configuring Geo-Replication. You can go from synchronous to asynchronous or from asynchronous to synchronous. If you go from asynchronous to synchronous, your secondary will be configured as synchronous after lag reaches zero. If you're running with a continual lag for whatever reason, then you may need to pause your publishers in order for lag to reach zero and your mode to be able to switch to synchronous. The reasons to have synchronous replication enabled, instead of asynchronous replication, are tied to the importance of the data, specific business needs, or compliance reasons, rather than availability and reliability of your application.

## Secondary region selection

To enable the Geo-Replication feature, you need to use a primary and secondary region where the feature is enabled. The Geo-Replication feature depends on being able to replicate published events from the primary to the secondary region. If the secondary region is on another continent, this has a major impact on replication lag from the primary to the secondary region. If using Geo-Replication for availability and reliability reasons, you're best off with secondary regions being at least on the same continent where possible. To get a better understanding of the latency induced by geographic distance, you can learn more from [Azure network round-trip latency statistics](/azure/networking/azure-network-latency).

## Geo-Replication management

The Geo-Replication feature enables customers to configure a secondary region towards which to replicate configuration and data. As such, customers can perform the following management tasks:
- Configure Geo-Replication; Secondary regions can be configured on any new or existing namespace in a region with the Geo-Replication feature set enabled.
    > [!NOTE]
    > Currently only new namespaces are supported.
- Configure the replication consistency; Synchronous and asynchronous replication is set when Geo-Replication is configured but can also be switched afterwards.
- Trigger failover; All failovers are customer initiated.
- Remove a secondary; If at any time you want to remove a secondary region, you can do so after which the data in the secondary region will be deleted.

## Setup

The following section is an overview to set up the Geo-Replication feature on a new namespace.
    > [!NOTE]
    > This experience might change during public preview. We'll update this document accordingly.

1. Create a new premium-tier namespace.
1. Check the **Enable Geo-replication checkbox** under the *Replication (preview)* section.
1. Click on the **Add secondary region** button, and choose a region.
1. Either check the **Synchronous replication** checkbox, or specify a value for the **Async Replication - Max Replication lag** value in seconds.
:::image type="content" source="./media/service-bus-geo-replication/create-namespace-with-geo-replication.png" alt-text="Screenshot showing the Create Namespace experience with Geo-Replication enabled.":::

## Management

Once you create a namespace with the Geo-Replication feature enabled, you can manage the feature from the **Replication (preview)** blade. 

### Switch replication mode

To switch between replication modes, or update the maximum replication lag, click on the link under **Replication consistency**, and click the checkbox to enable / disable synchronous replication, or update the value in the textbox to change the asynchronous maximum replication lag.
:::image type="content" source="./media/service-bus-geo-replication/update-namespace-geo-replication-configuration.png" alt-text="Screenshot showing how to update the configuration of the Geo-Replication feature.":::

### Delete secondary region

To remove a secondary region, click on the **...**-ellipsis next to the region, and click **Delete**. To delete the region, follow the instructions in the pop-up blade.
:::image type="content" source="./media/service-bus-geo-replication/delete-secondary-region-from-geo-replication.png" alt-text="Screenshot showing how to a secondary region.":::

### Failover flow

A failover is triggered manually by the customer (either explicitly through a command, or through client owned business logic that triggers the command) and never by Azure. It gives the customer full ownership and visibility for outage resolution on Azure's backbone. In the portal, click on the **Promote** icon, and follow the instructions in the pop-up blade to delete the region. 

When setting the **Promote maximum grace period**, the service tries to catch up the replication lag for this amount of time before initiating the failover. Once the lag catches up, or the grace period elapses, whichever comes first, the failover is initiated.

:::image type="content" source="./media/service-bus-geo-replication/failover-to-secondary-region.png" alt-text="Image showing the flow of failover from primary to secondary region.":::

After the failover is initiated:

1. The FQDN is updated to point to the secondary region, which can take up to a few minutes.
    > [!NOTE]
    > You can check the current primary region by initiating a ping command:
    > ping *your-namespace-fully-qualified-name*

1. Clients automatically reconnect to the secondary region.

You can automate failover either with monitoring systems, or with custom-built monitoring solutions. However, such automation takes extra planning and work, which is out of the scope of this article.

### Monitoring data replication
Users can monitor the progress of the replication job by monitoring the replication lag metric in Application Metrics logs.
- Enable Application Metrics logs in your Service Bus namespace as described at [Monitor Azure Service Bus](/azure/service-bus-messaging/monitor-service-bus). 
- Once Application Metrics logs are enabled, you need to produce and consume data from the namespace for a few minutes before you start to see the logs. 
- To view Application Metrics logs, navigate to Monitoring section of Service Bus and click on the **Logs** blade. You can use the following query to find the replication lag (in seconds) between the primary and secondary regions. 

```kusto
AzureDiagnostics
| where TimeGenerated > ago(1h)
| where Category == "ApplicationMetricsLogs"
| where ActivityName_s == "ReplicationLag
```

The column count_d indicates the replication lag in seconds between the primary and secondary region.
## Samples

TODO_ADD_SAMPLES

### Publishing data
Publishing applications can publish data to geo replicated namespaces via stable namespace FQDN of the Geo-Replication enabled namespace. The publishing approach is the same as the non-Geo-Replication case and no changes to data plane SDKs or client applications are required. 
Publishing may not be available during the following circumstances:
- During the failover grace period, the existing primary region rejects any new messages that are published to Service Bus.
- When replication lag between primary and secondary regions reaches the max replication lag duration, the publisher ingress workload may get throttled. 

Publisher applications can't directly access any namespaces in the secondary regions. 

### Consuming Data 
Consuming applications can consume data using the stable namespace FQDN of a Geo-Replication enabled namespace. The consumer operations aren't supported, from when the failover is initiated until it's completed. 

## Considerations

Note the following considerations to keep in mind with this release:

- In your failover planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the failover.
- Failing over a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once.

## Private endpoints

#TODO_ADD_PRIVATE_ENDPOINT_CONFIG

## Next steps

- See the Geo-Replication [REST API reference here](/rest/api/servicebus/controlplane-stable/disaster-recovery-configs).
- Run the Geo-Replication [sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/SBGeoDR2/SBGeoDR2).
- See the Geo-Replication [sample that sends messages to an alias](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/TestGeoDR/ConsoleApp1).

To learn more about Service Bus messaging, see the following articles:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
* [REST API](/rest/api/servicebus/)