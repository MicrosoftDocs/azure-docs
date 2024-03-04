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

![Screenshot of using one Azure SignalR instance to handle traffic from two countries. ](./media/howto-enable-geo-replication/signalr-single.png  "Single SignalR Example")

Before the advent of the geo-replication feature, Contoso could set up another Azure SignalR Service in Canada Central to serve its Canadian users. By setting up a geographically closer Azure SignalR Service, end users now have better network quality and lower latency. 

However, managing multiple Azure SignalR Services brings some challenges:
1. A cross-region communication mechanism would be required to enable conversation between Canada and US users.
2. The development team would need to manage two separate Azure SignalR Services, each with distinct domain and connection string.
3. If a regional outage happens, the traffic needs to be switched to another region.

![Screenshot of using two Azure SignalR instances to handle traffic from two countries. ](./media/howto-enable-geo-replication/signalr-multiple.png  "Mutiple SignalR Example")

## Harnessing geo-replication
With the new geo-replication feature, Contoso can now establish a replica in Canada Central, effectively overcoming the above-mentioned hurdles.

![Screenshot of using one Azure SignalR instance with replica to handle traffic from two countries.](./media/howto-enable-geo-replication/signalr-replica.png  "Replica Example")

## Create a SignalR replica

To create a replica, Navigate to the SignalR **Replicas** blade on the Azure portal and click **Add** to create a replica. It will be automatically enabled upon creation.

![Screenshot of creating replica for Azure SignalR on Portal.](./media/howto-enable-geo-replication/signalr-replica-create.png  "Replica create")

> [!NOTE]
> * Geo-replication is a feature available in premium tier.
> * A replica is considered a separate resource when it comes to billing. See [Pricing](#pricing) for more details. 

After creation, you would be able to view/edit your replica on the portal by clicking the replica name.

![Screenshot of overview blade of Azure SignalR replica resource. ](./media/howto-enable-geo-replication/signalr-replica-overview.png  "Replica Overview")

## Pricing
Replica is a feature of [Premium tier](https://azure.microsoft.com/pricing/details/signalr-service/) of Azure SignalR Service. Each replica is billed **separately** according to its own units and outbound traffic. Free message quota is also calculated separately.

In the preceding example, Contoso added one replica in Canada Central. Contoso would pay for the replica in Canada Central according to its unit and message in Premium Price.

## Delete a replica
After you've created a replica for your Azure SignalR Service, you can delete it at any time if it's no longer needed. 

To delete a replica in the Azure portal:

1. Navigate to your Azure SignalR Service, and select **Replicas** blade. Click the replica you want to delete.
2. Click Delete button on the replica overview blade.

## Understanding how the SignalR replica works

The diagram below provides a brief illustration of the SignalR Replicas' functionality:

![Screenshot of the arch of Azure SignalR replica. ](./media/howto-enable-geo-replication/signalr-replica-arch.png  "Replica Arch")

1. The client resolves the Fully Qualified Domain Name (FQDN) `contoso.service.signalr.net` of the SignalR service. This FQDN points to a Traffic Manager, which returns the  Canonical Name (CNAME) of the nearest regional SignalR instance.
2. With this CNAME, the client establishes a connection to the regional instance.
3. The two replicas will synchronize data with each other. Messages sent to one replica would be transferred to other replicas if necessary.
4. In case a replica fails the health check conducted by the Traffic Manager (TM), the TM will exclude the failed instance's endpoint from its domain resolution process.

> [!NOTE]
> * In the data plane, a primary Azure SignalR resource functions identically to its replicas

## Impact on performance after adding replicas

Post replica addition, your clients will be distributed across different locations based on their geographical locations. SignalR must synchronize data across these replicas. The cost for synchronization is negligible if your use case primarily involves sending to large groups (size >100) or broadcasting. However, the cost becomes more apparent when sending to smaller groups (size < 10) or a single user.

To ensure effective failover management, it is recommended to set each replica's unit size to handle all traffic. Alternatively, you could enable [autoscaling](signalr-howto-scale-autoscale.md) to manage this.

For more performance evaluation, refer to [Performance](signalr-concept-performance.md).
