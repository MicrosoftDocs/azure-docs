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

Companies seeking local presence or requiring a robust failover system often choose to deploy services across multiple Azure regions. With the integration of geo-replication in Azure Web PubSub, managing multi-region scenarios has become significantly easier.

A geo-replicated Azure Web PubSub Service provides the following benefits:

* **More resilient to regional outage:** If a regional outage happens, the Azure Web PubSub DNS will be resolved to healthy replicas in other regions.
* **Cross Region Communication**. Different replicas could communicate with each other as if they are the same instance.
* **Enhanced Network Speed via Azure BackBone:** Geographically dispersed clients will connect to the nearest replica instance. These instances communicate through Azure BackBone, ensuring fast, stable network quality..
* **Shared configurations**. All replicas retain the primary Azure Web PubSub Service resource's configuration. 

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
