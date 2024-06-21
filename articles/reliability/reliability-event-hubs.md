---
title: Reliability in Azure Event Hubs
description: Learn about reliability in Azure Event Hubs
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: event-hubs
ms.date: 06/12/2024
---

<!--#Customer intent:  I want to understand reliability support in Azure Event Hubs so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# Reliability in  Azure Event Hubs

This article describes reliability support in [Azure Event Hubs](../event-hubs/event-hubs-about.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).




## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


Event Hubs implements transparent failure detection and failover mechanisms so that, when failure occurs, the service continues to operate within the assured service-levels and without noticeable interruptions. If you create an Event Hubs namespace in a region that supports availability zones, [zone redundancy](./availability-zones-overview.md#zonal-and-zone-redundant-services) is automatically enabled. With zone-redundancy, fault tolerance is increased and the service has enough capacity reserves to cope with the outage of an entire facility.  Both metadata and data (events) are replicated across data centers in each zone. 


### Prerequisites

Availability zone support is only available in [Azure regions with availability zones](./availability-zones-service-support.md). 


### Create a resource with availability zones enabled

When you use the Azure portal, zone redundancy is automatically enabled. When you create a namespace, you see the following highlighted message when you select a region that supports availability zones. 

:::image type="content" source="../event-hubs/media/event-hubs-geo-dr/eh-az.png" alt-text="Image showing the Create Namespace page with region that has availability zones":::


### Disable availability zones

The Azure portal doesn't support disabling availability zones. To disable availability zones, use one of the following methods:

- Azure CLI command [`az eventhubs namespace`](/cli/azure/eventhubs/namespace#az-eventhubs-namespace-create) with `--zone-redundant=false` 

- PowerShell command [`New-AzEventHubNamespace`](/powershell/module/az.eventhub/new-azeventhubnamespace) with `-ZoneRedundant=false` to create a namespace with zone redundancy disabled. 

### Availability zone migration

You can't disable or enable availability zones for Event Hubs. When you create availability zones in the a region that supports them, availability zones are automatically enabled. 




### Zone down experience




When a client application sends events to an event hub without specifying a partition, events are automatically distributed among partitions in your event hub. If a partition isn't available for some reason, events are distributed among the remaining partitions. This behavior allows for the greatest amount of up time. For use cases that require the maximum up time, this model is preferred instead of sending events to a specific partition.

### Pricing
Need Info. Any pricing considerations when using availability zones?


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

The all-active Azure Event Hubs cluster model with availability zone support provides resiliency against  hardware and datacenter outages. However, if a disaster where an entire region and all zones are unavailable , you can use Geo-disaster recovery to recover your workload and application configuration. 

Geo-Disaster recovery ensures that the entire configuration of a namespace (Event Hubs, Consumer Groups, and settings) is continuously replicated from a primary namespace to a secondary namespace when paired. 
The Geo-disaster recovery feature of Azure Event Hubs is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to temporary outages.  For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications).

With Geo-Disaster recovery, you can initiate a once-only failover move from the primary to the secondary at any time. The failover move points the chosen alias name for the namespace to the secondary namespace. After the move, the pairing is then removed. The failover is nearly instantaneous once initiated. 

> [!IMPORTANT]
> - Geo-Disaster recovery **doesn't replicate the event data**. In learn how to recover event data from the primary Event Hub after the downed region is restored, see [replication guidance](../event-hubs/event-hubs-federation-overview.md) 
> - Microsoft Entra role-based access control (RBAC) assignments to entities in the primary namespace aren't replicated to the secondary namespace. You'll need to create role assignments manually in the secondary namespace to secure access to them. 


## Basic concepts and terms

Geo-Disaster recovery implements metadata disaster recovery, and relies on primary and secondary disaster recovery namespaces. 

The Geo-disaster recovery feature is available for the [standard, premium, and dedicated SKUs](https://azure.microsoft.com/pricing/details/event-hubs/) only. You don't need to make any connection string changes, as the connection is made via an alias.

The following terms are used in this article:

-  *Alias*: The name for a disaster recovery configuration that you set up. The alias provides a single stable Fully Qualified Domain Name (FQDN) connection string. Applications use this alias connection string to connect to a namespace. 

-  *Primary/secondary namespace*: The namespaces that correspond to the alias. The primary namespace is "active" and receives messages (can be an existing or new namespace). The secondary namespace is "passive" and doesn't receive messages. The metadata between both is in sync, so both can seamlessly accept messages without any application code or connection string changes. To ensure that only the active namespace receives messages, you must use the alias.
-  *Metadata*: Entities such as event hubs and consumer groups; and their properties of the service that are associated with the namespace. Only entities and their settings are replicated automatically. Messages and events aren't replicated. 
-  *Failover*: The process of activating the secondary namespace.

## Private endpoints
This section provides more considerations when using Geo-disaster recovery with namespaces that use private endpoints. To learn about using private endpoints with Event Hubs in general, see [Configure private endpoints](../event-hubs/private-link-service.md).



### New pairings
If you try to create a pairing between a primary namespace with a private endpoint and a secondary namespace without a private endpoint, the pairing fails. The pairing succeeds only if both primary and secondary namespaces have private endpoints. We recommend that you use same configurations on the primary and secondary namespaces and on virtual networks in which private endpoints are created.  

> [!NOTE]
> When you try to pair the primary namespace with private endpoint and a secondary namespace, the validation process only checks whether a private endpoint exists on the secondary namespace. It doesn't check whether the endpoint works after failover. It's your responsibility to ensure that the secondary namespace with private endpoint  work as expected after failover.
>
> To test that the private endpoint configurations are same on primary and secondary namespaces, send a read request (for example: [Get Event Hub](/rest/api/eventhub/get-event-hub)) to the secondary namespace from outside the virtual network, and verify that you receive an error message from the service.

### Existing pairings
If pairing between primary and secondary namespace already exists, private endpoint creation on the primary namespace fails. To resolve, create a private endpoint on the secondary namespace first and then create one for the primary namespace.

> [!NOTE]
> While we allow read-only access to the secondary namespace, updates to the private endpoint configurations are permitted. 

### Recommended configuration

You must create private endpoints for both primary and secondary Event Hubs namespaces against the virtual networks that host both of those instances of your application. 

Let's say you have two virtual networks: VNET-1, VNET-2 and these primary and secondary namespaces: EventHubs-Namespace1-Primary, EventHubs-Namespace2-Secondary. You need to do the following steps: 

- On EventHubs-Namespace1-Primary, create two private endpoints that use subnets from VNET-1 and VNET-2
- On EventHubs-Namespace2-Secondary, create two private endpoints that use the same subnets from VNET-1 and VNET-2 

![Private endpoints and virtual networks](../event-hubs/media/event-hubs-geo-dr/private-endpoints-virtual-networks.png)

Advantage of this approach is that failover can happen at the application layer independent of Event Hubs namespace. Consider the following scenarios: 

**Application-only failover:** The application doesn't exist in VNET-1 but moves to VNET-2. The application works because both private endpoints are configured on both VNET-1 and VNET-2 for both primary and secondary namespaces.

**Event Hubs namespace-only failover**: The application works because both private endpoints are configured on both virtual networks for both primary and secondary namespaces.

> [!NOTE]
> For guidance on geo-disaster recovery of a virtual network, see [Virtual Network - Business Continuity](../virtual-network/virtual-network-disaster-recovery-guidance.md).


## Role-based access control
Microsoft Entra role-based access control (RBAC) assignments to entities in the primary namespace aren't replicated to the secondary namespace. To secure access to role assignments, create them manually in the secondary namespace.

## Supported namespace pairs
The following combinations of primary and secondary namespaces are supported:  

| Primary namespace tier | Allowed secondary namespace tier |
| ----------------- | -------------------- |
| Standard | Standard, Dedicated | 
| Premium | Premium | 
| Dedicated | Dedicated | 

> [!NOTE]
> You can't pair namespaces that are in the same dedicated cluster. You can pair namespaces that are in separate clusters. 

## Setup and failover flow

The following section is an overview of the failover process, and explains how to set up the initial failover. 

:::image type="content" source="../event-hubs/media/event-hubs-geo-dr/geo1.png" alt-text="Image showing the overview of failover process ":::


### Setup

You first create or use an existing primary namespace, and a new secondary namespace, then pair the two. This pairing gives you an alias that you can use to connect. Because you use an alias, you don't have to change connection strings. Only new namespaces can be added to your failover pairing. 

1. Create the primary namespace.
1. Create the secondary namespace in a different region. This step is optional. You can create the secondary namespace while creating the pairing in the next step. 
1. In the Azure portal, navigate to your primary namespace.
1. Select **Geo-recovery** on the left menu, and select **Initiate pairing** on the toolbar. 

    :::image type="content" source="../event-hubs/media/event-hubs-geo-dr/primary-namspace-initiate-pairing-button.png" alt-text="Initiate pairing from the primary namespace":::    
1. On the **Initiate pairing** page, follow these steps:
    1. Select an existing secondary namespace or create one in a different region. In this example, an existing namespace is selected.  
    1. For **Alias**, enter an alias for the geo-dr pairing. 
    1. Then, select **Create**. 

    :::image type="content" source="../event-hubs/media/event-hubs-geo-dr/initiate-pairing-page.png" alt-text="Select the secondary namespace":::        
1. You should see the **Geo-DR Alias** page. You can also navigate to this page from the primary namespace by selecting **Geo-recovery** on the left menu.

    :::image type="content" source="../event-hubs/media/event-hubs-geo-dr/geo-dr-alias-page.png" alt-text="Geo-DR alias page":::    
1. On the **Geo-DR Alias** page, select **Shared access policies** on the left menu to access the primary connection string for the alias. Use this connection string instead of using the connection string to the primary/secondary namespace directly. 
1. On this **Overview** page, you can do the following actions: 
    1. Break the pairing between primary and secondary namespaces. Select **Break pairing** on the toolbar. 
    1. Manually fail over to the secondary namespace. Select **Failover** on the toolbar. 
    
        > [!WARNING]
        > Failing over activates the secondary namespace and remove the primary namespace from the Geo-Disaster Recovery pairing. Create another namespace to have a new geo-disaster recovery pair. 

Finally, you should add some monitoring to detect if a failover is necessary. In most cases, the service is one part of a large ecosystem, thus automatic failovers are rarely possible, as often failovers must be performed in sync with the remaining subsystem or infrastructure.

### Example

In one example of this scenario, consider a Point of Sale (POS) solution that emits either messages or events. Event Hubs passes those events to some mapping or reformatting solution, which then forwards mapped data to another system for further processing. At that point, all of these systems might be hosted in the same Azure region. The decision of when and what part to fail over depends on the flow of data in your infrastructure. 

You can automate failover either with monitoring systems, or with custom-built monitoring solutions. However, such automation takes extra planning and work, which is out of the scope of this article.

### Failover flow

If you initiate the failover, two steps are required:

1. If another outage occurs, you want to be able to fail over again. Therefore, set up another passive namespace and update the pairing. 

2. Pull messages from the former primary namespace once it's available again. After that, use that namespace for regular messaging outside of your geo-recovery setup, or delete the old primary namespace.

> [!NOTE]
> Only fail forward semantics are supported. In this scenario, you fail over and then re-pair with a new namespace. Failing back is not supported; for example, in a SQL cluster. 

:::image type="content" source="../event-hubs/media/event-hubs-geo-dr/geo2.png" alt-text="Image showing the failover flow":::

## Manual failover
This section shows how to manually fail over using Azure portal, CLI, PowerShell, C#, etc.

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to your primary namespace.
1. Select **Geo-recovery** on the left menu.
1. Manually fail over to the secondary namespace. Select **Failover** on the toolbar. 
    
    > [!WARNING]
    > Failing over activates the secondary namespace and remove the primary namespace from the Geo-Disaster Recovery pairing. Create another namespace to have a new geo-disaster recovery pair.

# [Azure CLI](#tab/cli)
Use the [az eventhubs georecovery-alias fail-over](/cli/azure/eventhubs/georecovery-alias#az-eventhubs-georecovery-alias-fail-over) command.

# [Azure PowerShell](#tab/powershell)
Use the [Set-AzEventHubGeoDRConfigurationFailOver](/powershell/module/az.eventhub/set-azeventhubgeodrconfigurationfailover) cmdlet. 

# [C#](#tab/csharp)
Use the [DisasterRecoveryConfigsOperationsExtensions.FailOverAsync](/dotnet/api/microsoft.azure.management.eventhub.disasterrecoveryconfigsoperationsextensions.failoverasync#Microsoft_Azure_Management_EventHub_DisasterRecoveryConfigsOperationsExtensions_FailOverAsync_Microsoft_Azure_Management_EventHub_IDisasterRecoveryConfigsOperations_System_String_System_String_System_String_System_Threading_CancellationToken_) method. 

For the sample code that uses this method, see the [GeoDRClient](https://github.com/Azure/azure-event-hubs/blob/3cb13d5d87385b97121144b0615bec5109415c5a/samples/Management/DotNet/GeoDRClient/GeoDRClient/GeoDisasterRecoveryClient.cs#L137) sample in GitHub. 

---

## Management

If you made a mistake; for example, you paired the wrong regions during the initial setup, you can break the pairing of the two namespaces at any time. If you want to use the paired namespaces as regular namespaces, delete the alias.

## Considerations

Note the following considerations to keep in mind:

1. By design, Event Hubs geo-disaster recovery doesn't replicate data, and therefore you can't reuse the old offset value of your primary event hub on your secondary event hub. We recommend restarting your event receiver with one of the following methods:

   - *EventPosition.FromStart()* - If you wish read all data on your secondary event hub.
   - *EventPosition.FromEnd()* - If you wish to read all new data from the time of connection to your secondary event hub.
   - *EventPosition.FromEnqueuedTime(dateTime)* - If you wish to read all data received in your secondary event hub starting from a given date and time.

2. In your failover planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the failover. 
 
3. The fact that no data is replicated means that current active sessions aren't replicated. Additionally, duplicate detection and scheduled messages may not work. New sessions, scheduled messages, and new duplicates work. 

4. Failing over a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once. 

5. Synchronizing entities can take some time, approximately 50-100 entities per minute.

6. Some aspects of the management plane for the secondary namespace become read-only while geo-recovery pairing is active.

7. The data plane of the secondary namespace is read-only while geo-recovery pairing is active. The data plane of the secondary namespace accepts GET requests to enable validation of client connectivity and access controls.


## Next steps
Review the following samples or reference documentation. 
- [.NET GeoDR sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/DotNet/GeoDRClient) 
- [Java GeoDR sample](https://github.com/Azure-Samples/eventhub-java-manage-event-hub-geo-disaster-recovery)
- [.NET - Azure.Messaging.EventHubs samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples)
- [.NET - Microsoft.Azure.EventHubs samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet)
- [Java - azure-messaging-eventhubs samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs)
- [Java - azure-eventhubs samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java)
- [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub/samples)
- [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/javascript)
- [TypeScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/typescript)
- [REST API reference](/rest/api/eventhub/)

[2]: ../event-hubs/media/event-hubs-geo-dr/geo2.png
