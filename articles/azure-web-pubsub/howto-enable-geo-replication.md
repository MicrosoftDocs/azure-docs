---
title: How to enable geo-replication for Azure Web PubSub
description: How to enable geo-replication for Web PubSub service
author: biqian

ms.author: biqian
ms.date: 06/01/2023
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Geo-replication (Preview) in Azure Web PubSub 

## What is geo-replication feature?
Mission critical apps often need to have a robust failover system and serve users closer to where they are. Before the release of the geo-replication feature, developers needed to deploy multiple Web PubSub resources and write custom code to orchestrate communication across resources. Now, with quick configuration through Azure portal, you can easily enable this feature. 

## Benefits of using geo-replication
* **More resilient to regional outage:** If a regional outage happens, clients will be automatically routed to a healthy replica.
* **Cross-region communication:** Developers use a geo-replication-enabled resource as usual, even though behind-the-scenes there are more than one resource. The communication across replicas is handled by the service. 
* **Enhanced network speed:** Geographically dispersed clients will connect to the nearest replica. These replicas communicate through [Azure global network backbone](https://azure.microsoft.com/explore/global-infrastructure/global-network), ensuring fast and stable networking.
* **Ease of management**. All replicas share the configuration of the primary Web PubSub resource.

## Prerequisites
* A Web PubSub resource in [premium tier](https://azure.microsoft.com/pricing/details/web-pubsub/).

## Example use case
### Contoso, a social media company
Contoso is a social media company with its customer base spread across the US and Canada. Contoso provides a mobile and web app to its users so that they can connect with each other. Contoso application is deployed in Central US. As part of Contoso's architecture, Web PubSub is used to establish persistent WebSocket connections between client apps and the application server. Contoso **likes** that they can offload managing WebSocket connections to Web PubSub, but **doesn't** like reading reports of users in Canada experiencing higher latency. Furthermore, Contoso's development team wants to insure the app against regional outage so that the users can access the app with no interruptions.

![Screenshot of using one Azure WebPubSub instance to handle traffic from two countries. ](./media/howto-enable-geo-replication/web-pubsub-single.png  "Single WebPubSub Example")

Contoso **could** set up another Web PubSub resource in Canada Central which is geographically closer to its users in Canada. However, managing multiple Web PubSub resources brings some challenges:
1. A cross-region communication mechanism would need to be implemented so that users in Canada and US can interact with each other.
2. The development team would need to manage two separate Web PubSub resources, each with distinct domain and connection string.
3. If a regional outage takes place, the traffic needs to be directed to an available resource.

All of the above takes engineering resources away from focusing on product innovation.

![Screenshot of using two Azure Web PubSub instances to handle traffic from two countries. ](./media/howto-enable-geo-replication/web-pubsub-multiple.png  "Mutiple Web PubSub Example")

### Harnessing the geo-replication feature
With the geo-replication feature, Contoso can now establish a replica in Canada Central, effectively overcoming the above-mentioned challenges. The developer team is glad to find out that they don't need to make any code changes. It's as easy as clicking a few buttons on Azure portal. The developer team is also happy to share with the stakeholders that as Contoso plans to enter the European market, they simply need to add another replica in Europe. 

![Screenshot of using one Azure Web PubSub instance with replica to handle traffic from two countries.](./media/howto-enable-geo-replication/web-pubsub-replica.png  "Replica Example")

## How to enable geo-replication in a Web PubSub resource
To create a replica in an Azure region, go to your Web PubSub resource and find the **Replicas** blade on the Azure portal and click **Add** to create a replica. It will be automatically enabled upon creation.

![Screenshot of creating replica for Azure Web PubSub on Portal.](./media/howto-enable-geo-replication/web-pubsub-replica-create.png  "Replica create")

After creation, you would be able to view/edit your replica on the portal by clicking the replica name.

![Screenshot of overview blade of Azure Web PubSub replica resource. ](./media/howto-enable-geo-replication/web-pubsub-replica-overview.svg  "Replica Overview")

> [!NOTE]
> * Geo-replication is a feature available in premium tier.
> * A replica is considered a separate resource when it comes to billing. See [Pricing](concept-billing-model.md#how-replica-is-billed) for more details. 

## Delete a replica
After you've created a replica for a Web PubSub resource, you can delete it at any time if it's no longer needed. 

To delete a replica in the Azure portal:

1. Navigate to your Web PubSub resource, and select **Replicas** blade. Click the replica you want to delete.
2. Click Delete button on the replica overview blade.

## Impact on performance after enabling geo-replication feature
After a replica is created, your clients will be distributed across selected Azure regions based on their geographical locations. Web PubSub service handles synchronizing data across these replicas automatically and this synchronization incurs a low level of cost. The cost is negligible if your use case primarily involves `sendToGroup()` where the group has more than 100 connections. However, the cost may become more apparent when sending to smaller groups (connection count < 10) or a single user. 

For more performance evaluation, refer to [Performance](concept-performance.md).

## Best practices
To ensure effective failover management, it is recommended to enable [autoscaling](howto-scale-autoscale.md) for the resource and its replicas. If there are two replicas in a Web PubSub resource and one of the replicas is not available due to an outage, the available replica will receive all the traffic and handle all the WebSocket connections. Auto-scaling can scale up to meet the demand automatically.
> [!NOTE]
> * Autoscaling for replica is configured on its own resource level. Scaling primary resource won't change the unit size of the replica.

## Understand how the geo-replication feature works

![Screenshot of the arch of Azure Web PubSub replica. ](./media/howto-enable-geo-replication/web-pubsub-replica-arch.png  "Replica Arch")

1. The client resolves the Fully Qualified Domain Name (FQDN) `contoso.webpubsub.azure.com` of the Web PubSub service. This FQDN points to a Traffic Manager, which returns the  Canonical Name (CNAME) of the nearest regional Web PubSub instance.
2. With this CNAME, the client establishes a websocket connection to the regional instance.
3. The two replicas will synchronize data with each other. Messages sent to one replica would be transferred to other replicas if necessary.
4. In case a replica fails the health check conducted by the Traffic Manager (TM), the TM will exclude the failed instance's endpoint from its domain resolution results.

> [!NOTE]
> * In the data plane, a primary Azure Web PubSub resource functions identically to its replicas

----
