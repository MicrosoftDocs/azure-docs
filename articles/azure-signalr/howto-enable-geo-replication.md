---
title: How to enable geo-replication
description: How to enable geo-replication for Azure SignalR service
author: biqian

ms.author: biqian
ms.date: 06/01/2023
ms.service: signalr
ms.topic: how-to
---

#  Geo-replication (Preview) in Azure SignalR

Companies seeking local presence or requiring a robust failover system often choose to deploy services across multiple Azure regions. With the integration of geo-replication in Azure SignalR, managing multi-region scenarios has become significantly easier.

## Benefits of using geo-replication
* **More resilient to regional outage:** If a regional outage happens, the Azure SignalR DNS will be resolved to healthy replicas in other regions.
* **Cross Region Communication**. Different replicas could communicate with each other as if they are the same instance.
* **Enhanced network speed:** Geographically dispersed clients will connect to the nearest replica. These replicas communicate through [Azure global network backbone](https://azure.microsoft.com/explore/global-infrastructure/global-network), ensuring fast and stable networking.
* **Shared configurations**. All replicas retain the primary Azure SignalR Service resource's configuration. 

## Prerequisites

* An Azure SignalR Service in [Premium tier](https://azure.microsoft.com/pricing/details/signalr-service/).
* The user needs following permissions to operate on replicas:

    | Permission                                        | Description                                       |
    |---------------------------------------------------|---------------------------------------------------|
    | Microsoft.SignalRService/signalr/replicas/write   | create, update or delete a replica. |
    | Microsoft.SignalRService/signalr/replicas/read    | get meta data of a replica.|
    | Microsoft.SignalRService/signalr/replicas/action  | perform actions on a replica, such as restarting. |


## Example use case
Contoso is a social media company with its customer base spread across the US and Canada. To serve those customers and let them communicate with each other, Contoso runs its services in Central US. Azure SignalR Service is used to handle user connections and facilitate communication among users. Contoso's end users are mostly phone users. Due to the long geographical distances, end-users in Canada might experience high latency and poor network quality.

![Diagram of using one Azure SignalR instance to handle traffic from two countries. ](./media/howto-enable-geo-replication/signalr-single.png "Single SignalR Example")

Before the advent of the geo-replication feature, Contoso could set up another Azure SignalR Service in Canada Central to serve its Canadian users. By setting up a geographically closer Azure SignalR Service, end users now have better network quality and lower latency. 

However, managing multiple Azure SignalR Services brings some challenges:
1. A cross-region communication mechanism would be required to enable conversation between Canada and US users.
2. The development team would need to manage two separate Azure SignalR Services, each with distinct domain and connection string.
3. If a regional outage happens, the traffic needs to be switched to another region.

![Diagram of using two Azure SignalR instances to handle traffic from two countries. ](./media/howto-enable-geo-replication/signalr-multiple.png "Mutiple SignalR Example")

## Harnessing geo-replication
With the new geo-replication feature, Contoso can now establish a replica in Canada Central, effectively overcoming the above-mentioned hurdles.

![Diagram of using one Azure SignalR instance with replica to handle traffic from two countries.](./media/howto-enable-geo-replication/signalr-replica.png "Replica Example")

## Create a SignalR replica

To create a replica, Navigate to the SignalR **Replicas** blade on the Azure portal and click **Add** to create a replica. It will be automatically enabled upon creation.

![Screenshot of creating replica for Azure SignalR on Portal.](./media/howto-enable-geo-replication/signalr-replica-create.png "Replica create")

> [!NOTE]
> * Geo-replication is a feature available in premium tier.
> * A replica is considered a separate resource when it comes to billing. See [Pricing and resource unit](#pricing-and-resource-unit) for more details. 

After creation, you would be able to view/edit your replica on the portal by clicking the replica name.

![Screenshot of overview blade of Azure SignalR replica resource. ](./media/howto-enable-geo-replication/signalr-replica-overview.png "Replica Overview")

## Pricing and resource unit
Each replica has its **own** `unit` and `autoscale settings`.

Replica is a feature of [Premium tier](https://azure.microsoft.com/pricing/details/signalr-service/) of Azure SignalR Service. Each replica is billed **separately** according to its own unit and outbound traffic. Free message quota is also calculated separately.

In the preceding example, Contoso added one replica in Canada Central. Contoso would pay for the replica in Canada Central according to its unit and message in Premium Price.

## Delete a replica
After you've created a replica for your Azure SignalR Service, you can delete it at any time if it's no longer needed. 

To delete a replica in the Azure portal:

1. Navigate to your Azure SignalR Service, and select **Replicas** blade. Click the replica you want to delete.
2. Click Delete button on the replica overview blade.

## Understand how the SignalR replica works

The diagram below provides a brief illustration of the SignalR Replicas' functionality:

![Diagram of the arch of Azure SignalR replica. ](./media/howto-enable-geo-replication/signalr-replica-arch.png "Replica Arch")

1. The client negotiates with the app server and receives a redirection to the Azure SignalR service. It then resolves the SignalR service's Fully Qualified Domain Name (FQDN) — `contoso.service.signalr.net`. This FQDN points to a Traffic Manager, which returns the Canonical Name (CNAME) of the nearest regional SignalR instance.
2. With this CNAME, the client establishes a connection to the regional instance (Replica).
3. The two replicas will synchronize data with each other. Messages sent to one replica would be transferred to other replicas if necessary.
4. In case a replica fails the health check conducted by the Traffic Manager (TM), the TM will exclude the failed instance's endpoint from its domain resolution process. For details, refer to below [Resiliency and Disaster Recovery](#resiliency-and-disaster-recovery)

> [!NOTE]
> * In the data plane, a primary Azure SignalR resource functions identically to its replicas

## Resiliency and disaster recovery

Azure SignalR Service utilizes a traffic manager for health checks and DNS resolution towards its replicas. Under normal circumstances, when all replicas are functioning properly, clients will be directed to the closest replica. For instance:

- Clients close to `eastus` will be directed to the replica located in `eastus`.
- Similarly, clients close to `westus` will be directed to the replica in `westus`.

In the event of a **regional outage** in eastus (illustrated below), the traffic manager will detect the health check failure for that region. Then, this faulty replica's DNS will be excluded from the traffic manager's DNS resolution results. After a DNS Time-to-Live (TTL) duration, which is set to 90 seconds, clients in `eastus` will be redirected to connect with the replica in `westus`.

![Diagram of Azure SignalR replica failover. ](./media/howto-enable-geo-replication/signalr-replica-failover.png "Replica Failover")

Once the issue in `eastus` is resolved and the region is back online, the health check will succeed. Clients in `eastus` will then, once again, be directed to the replica in their region. This transition is smooth as the connected clients will not be impacted until those existing connections are closed. 

![Diagram of Azure SignalR replica failover recovery. ](./media/howto-enable-geo-replication/signalr-replica-failover-recovery.png "Replica Failover Recover")


This failover and recovery process is **automatic** and requires no manual intervention.

For **server connections**, the failover and recovery work the same way as it does for client connections. 
> [!NOTE]
> *  This failover mechanism is for Azure SignalR service. Regional outages of app server are beyond the scope of this document.

## Impact on performance after adding replicas

After replicas are enabled, clients will naturally distribute based on their geographical locations. While SignalR takes on the responsibility to synchronize data across these replicas, you'll be pleased to know that the associated overhead on [Server Load](signalr-concept-performance.md#quick-evaluation-using-metrics) is minimal for most common use cases. 

Specifically, if your application typically broadcasts to larger groups (size >10) or a single connection, the performance impact of synchronization is barely noticeable. If you're messaging small groups (size < 10) or individual users, you might notice a bit more synchronization overhead.

To ensure effective failover management, it is recommended to set each replica's unit size to handle all traffic. Alternatively, you could enable [autoscaling](signalr-howto-scale-autoscale.md) to manage this.

For more performance evaluation, refer to [Performance](signalr-concept-performance.md).
