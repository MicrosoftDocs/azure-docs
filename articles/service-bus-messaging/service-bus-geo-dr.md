---
title: Azure Service Bus Geo-disaster recovery | Microsoft Docs
description: How to use geographical regions to failover and perform disaster recovery in Azure Service Bus
services: service-bus-messaging
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.topic: article
ms.date: 04/29/2020
ms.author: aschhab

---

# Azure Service Bus Geo-disaster recovery

When entire Azure regions or datacenters (if no [availability zones](../availability-zones/az-overview.md) are used) experience downtime, it is critical for data processing to continue to operate in a different region or datacenter. As such, *Geo-disaster recovery* is an important feature for any enterprise. Azure Service Bus supports geo-disaster recovery at the namespace level.

The Geo-disaster recovery feature is globally available for the Service Bus Premium SKU. 

>[!NOTE]
> Geo-Disaster recovery currently only ensures that the metadata (Queues, Topics, Subscriptions, Filters) are copied over from the primary namespace to secondary namespace when paired.

## Outages and disasters

It's important to note the distinction between "outages" and "disasters." 

An *outage* is the temporary unavailability of Azure Service Bus, and can affect some components of the service, such as a messaging store, or even the entire datacenter. However, after the problem is fixed, Service Bus becomes available again. Typically, an outage does not cause the loss of messages or other data. An example of such an outage might be a power failure in the datacenter. Some outages are only short connection losses due to transient or network issues. 

A *disaster* is defined as the permanent, or longer-term loss of a Service Bus cluster, Azure region, or datacenter. The region or datacenter may or may not become available again, or may be down for hours or days. Examples of such disasters are fire, flooding, or earthquake. A disaster that becomes permanent might cause the loss of some messages, events, or other data. However, in most cases there should be no data loss and messages can be recovered once the data center is back up.

The Geo-disaster recovery feature of Azure Service Bus is a disaster recovery solution. The concepts and workflow described in this article apply to disaster scenarios, and not to transient, or temporary outages. For a detailed discussion of disaster recovery in Microsoft Azure, see [this article](/azure/architecture/resiliency/disaster-recovery-azure-applications).   

## Basic concepts and terms

The disaster recovery feature implements metadata disaster recovery, and relies on primary and secondary disaster recovery namespaces. Note that the Geo-disaster recovery feature is available for the [Premium SKU](service-bus-premium-messaging.md) only. You do not need to make any connection string changes, as the connection is made via an alias.

The following terms are used in this article:

-  *Alias*: The name for a disaster recovery configuration that you set up. The alias provides a single stable Fully Qualified Domain Name (FQDN) connection string. Applications use this alias connection string to connect to a namespace. Using an alias ensures that the connection string is unchanged when the failover is triggered.

-  *Primary/secondary namespace*: The namespaces that correspond to the alias. The primary namespace is "active" and receives messages (this can be an existing or new namespace). The secondary namespace is "passive" and does not receive messages. The metadata between both is in sync, so both can seamlessly accept messages without any application code or connection string changes. To ensure that only the active namespace receives messages, you must use the alias. 

-  *Metadata*: Entities such as queues, topics, and subscriptions; and their properties of the service that are associated with the namespace. Note that only entities and their settings are replicated automatically. Messages are not replicated.

-  *Failover*: The process of activating the secondary namespace.

## Setup

The following section is an overview to setup pairing between the namespaces.

![1][]

The setup process is as follows -

1. Provision a ***Primary*** Service Bus Premium Namespace.

2. Provision a ***Secondary*** Service Bus Premium Namespace in a region *different from where the primary namespace is provisioned*. This will help allow fault isolation across different datacenter regions.

3. Create pairing between the Primary namespace and Secondary namespace to obtain the ***alias***.

    >[!NOTE] 
    > If you have [migrated your Azure Service Bus Standard namespace to Azure Service Bus Premium](service-bus-migrate-standard-premium.md), then you must use the pre-existing alias (i.e. your Service Bus Standard namespace connection string) to create the disaster recovery configuration through the **PS/CLI** or **REST API**.
    >
    >
    > This is because, during migration, your Azure Service Bus Standard namespace connection string/DNS name itself becomes an alias to your Azure Service Bus Premium namespace.
    >
    > Your client applications must utilize this alias (i.e. the Azure Service Bus Standard namespace connection string) to connect to the Premium namespace where the disaster recovery pairing has been setup.
    >
    > If you use the Portal to setup the Disaster recovery configuration, then the portal will abstract this caveat from you.


4. Use the ***alias*** obtained in step 3 to connect your client applications to the Geo-DR enabled primary namespace. Initially, the alias points to the primary namespace.

5. [Optional] Add some monitoring to detect if a failover is necessary.

## Failover flow

A failover is triggered manually by the customer (either explicitly through a command, or through client owned business logic that triggers the command) and never by Azure. This gives the customer full ownership and visibility for outage resolution on Azure's backbone.

![4][]

After the failover is triggered -

1. The ***alias*** connection string is updated to point to the Secondary Premium namespace.

2. Clients(senders and receivers) automatically connect to the Secondary namespace.

3. The existing pairing between Primary and Secondary premium namespace is broken.

Once the failover is initiated -

1. If another outage occurs, you want to be able to fail over again. Therefore, set up another passive namespace and update the pairing. 

2. Pull messages from the former primary namespace once it is available again. After that, use that namespace for regular messaging outside of your geo-recovery setup, or delete the old primary namespace.

> [!NOTE]
> Only fail forward semantics are supported. In this scenario, you fail over and then re-pair with a new namespace. Failing back is not supported; for example, in a SQL cluster. 

You can automate failover either with monitoring systems, or with custom-built monitoring solutions. However, such automation takes extra planning and work, which is out of the scope of this article.

![2][]

## Management

If you made a mistake; for example, you paired the wrong regions during the initial setup, you can break the pairing of the two namespaces at any time. If you want to use the paired namespaces as regular namespaces, delete the alias.

## Use existing namespace as alias

If you have a scenario in which you cannot change the connections of producers and consumers, you can reuse your namespace name as the alias name. See the [sample code on GitHub here](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/SBGeoDR2/SBGeoDR_existing_namespace_name).

## Samples

The [samples on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/SBGeoDR2/) show how to set up and initiate a failover. These samples demonstrate the following concepts:

- A .NET sample and settings that are required in Azure Active Directory to use Azure Resource Manager with Service Bus, to set up and enable Geo-disaster recovery.
- Steps required to execute the sample code.
- How to use an existing namespace as an alias.
- Steps to alternatively enable Geo-disaster recovery via PowerShell or CLI.
- [Send and receive](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/TestGeoDR/ConsoleApp1) from the current primary or secondary namespace using the alias.

## Considerations

Note the following considerations to keep in mind with this release:

1. In your failover planning, you should also consider the time factor. For example, if you lose connectivity for longer than 15 to 20 minutes, you might decide to initiate the failover.

2. The fact that no data is replicated means that currently active sessions are not replicated. Additionally, duplicate detection and scheduled messages may not work. New sessions, new scheduled messages and new duplicates will work. 

3. Failing over a complex distributed infrastructure should be [rehearsed](/azure/architecture/reliability/disaster-recovery#disaster-recovery-plan) at least once.

4. Synchronizing entities can take some time, approximately 50-100 entities per minute. Subscriptions and rules also count as entities.

## Availability Zones

The Service Bus Premium SKU also supports [Availability Zones](../availability-zones/az-overview.md), providing fault-isolated locations within an Azure region.

> [!NOTE]
> The Availability Zones support for Azure Service Bus Premium is only available in [Azure regions](../availability-zones/az-region.md) where availability zones are present.

You can enable Availability Zones on new namespaces only, using the Azure portal. Service Bus does not support migration of existing namespaces. You cannot disable zone redundancy after enabling it on your namespace.

![3][]

## Private endpoints
This section provides additional considerations when using Geo-disaster recovery with namespaces that use private endpoints. To learn about using private endpoints with Service Bus in general, see [Integrate Azure Service Bus with Azure Private Link](private-link-service.md).

### New pairings
If you try to create a pairing between a primary namespace with a private endpoint and a secondary namespace without a private endpoint, the pairing will fail. The pairing will succeed only if both primary and secondary namespaces have private endpoints. We recommend that you use same configurations on the primary and secondary namespaces and on virtual networks in which private endpoints are created. 

> [!NOTE]
> When you try to pair the primary namespace with a private endpoint and the secondary namespace, the validation process only checks whether a private endpoint exists on the secondary namespace. It doesn't check whether the endpoint works or will work after failover. It's your responsibility to ensure that the secondary namespace with private endpoint will work as expected after failover.
>
> To test that the private endpoint configurations are same, send a [Get queues](/rest/api/servicebus/queues/get) request to the secondary namespace from outside the virtual network, and verify that you receive an error message from the service.

### Existing pairings
If pairing between primary and secondary namespace already exists, private endpoint creation on the primary namespace will fail. To resolve, create a private endpoint on the secondary namespace first and then create one for the primary namespace.

> [!NOTE]
> While we allow read-only access to the secondary namespace, updates to the private endpoint configurations are permitted. 

### Recommended configuration
When creating a disaster recovery configuration for your application and Service Bus, you must create private endpoints for both primary and secondary Service Bus namespaces against virtual networks hosting both primary and secondary instances of your application.

Let's say you have two virtual networks: VNET-1, VNET-2 and these primary and second namespaces: ServiceBus-Namespace1-Primary, ServiceBus-Namespace2-Secondary. You need to do the following steps: 

- On ServiceBus-Namespace1-Primary, create two private endpoints that use subnets from VNET-1 and VNET-2
- On ServiceBus-Namespace2-Secondary, create two private endpoints that use the same subnets from VNET-1 and VNET-2 

![Private endpoints and virtual networks](./media/service-bus-geo-dr/private-endpoints-virtual-networks.png)


Advantage of this approach is that failover can happen at the application layer independent of Service Bus namespace. Consider the following scenarios: 

**Application-only failover:** Here, the application won't exist in VNET-1 but will move to VNET-2. As both private endpoints are configured on both VNET-1 and VNET-2 for both primary and secondary namespaces, the application will just work. 

**Service Bus namespace-only failover**: Here again, since both private endpoints are configured on both virtual networks for both primary and secondary namespaces, the application will just work. 

> [!NOTE]
> For guidance on geo-disaster recovery of a virtual network, see [Virtual Network - Business Continuity](../virtual-network/virtual-network-disaster-recovery-guidance.md).

## Next steps

- See the Geo-disaster recovery [REST API reference here](/rest/api/servicebus/disasterrecoveryconfigs).
- Run the Geo-disaster recovery [sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/SBGeoDR2/SBGeoDR2).
- See the Geo-disaster recovery [sample that sends messages to an alias](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.ServiceBus.Messaging/GeoDR/TestGeoDR/ConsoleApp1).

To learn more about Service Bus messaging, see the following articles:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
* [Rest API](/rest/api/servicebus/) 

[1]: ./media/service-bus-geo-dr/geodr_setup_pairing.png
[2]: ./media/service-bus-geo-dr/geo2.png
[3]: ./media/service-bus-geo-dr/az.png
[4]: ./media/service-bus-geo-dr/geodr_failover_alias_update.png
