---
title: Azure Web PubSub service Geo-Replication
description:  Learn about how Azure Geo-Replication works
author: biqian
ms.author: biqian
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 06/01/2023
---

# Azure Web PubSub Geo-Replication

## What is geo-replication feature?
Mission critial apps often need to have a robust failover system and serve users closer to where they are. Before the release of the geo-replication feature, developers needed to deploy multiple Web PubSub resources and write custom code to orchestrate communcation across resources. Now, with quick configuration through Azure portal, you can easily enable this feature. 

## Benefits of using geo-replication
* **More resilient to regional outage:** If a regional outage happens, clients will be automatically routed to a healthy replica.
* **Cross-region communication:** Developers use a geo-replication-enabled resource as usual, even though behind-the-scenes there are more than one resource. The communication across replicas is handled by the service. 
* **Enhanced network speed:** Geographically dispersed clients will connect to the nearest replica. These replicas communicate through [Azure global network backbone](https://azure.microsoft.com/en-us/explore/global-infrastructure/global-network), ensuring fast and stable networking.
* **Ease of management**. All replicas share the configuration of the primary Web PubSub resource.


## Understanding how the Web PubSub Replica Works

The diagram below provides a brief illustration of the Web PubSub Replicas' functionality:

![replica_overview-Page-1 drawio](https://github.com/bjqian/azure-docs/assets/16233725/80241a26-d0cf-4dc6-876d-df29d441639a)

1. The client resolves the Fully Qualified Domain Name (FQDN) `contoso.webpubsub.azure.com` of the Web PubSub service. This FQDN points to a Traffic Manager, which returns the  Canonical Name (CNAME) of the nearest regional Web PubSub instance.
2. With this CNAME, the client establishes a websocket connection to the regional instance.
3. The two replicas will synchronize data with each other. Messages sent to one replica would be transferred to other replicas if necessary.
4. In case a replica fails the health check conducted by the Traffic Manager (TM), the TM will exclude the failed instance's endpoint from its domain resolution results.

> [!NOTE]
> * In the data plane, a primary Azure Web PubSub resource functions identically to its replicas

## Impact on Performance After Adding Replicas

Post replica addition, your clients will be distributed across different locations based on their geographical locations. Web PubSub must synchronize data across these replicas. The synchronization cost is negligible if your use case primarily involves sending to large groups (size >100) or broadcasting. However, the cost becomes more apparent when sending to smaller groups (size < 10) or a single user.

To ensure effective failover management, it is recommended to set each replica's unit size to handle all traffic. Alternatively, you could enable auto-scaler to manage this.
