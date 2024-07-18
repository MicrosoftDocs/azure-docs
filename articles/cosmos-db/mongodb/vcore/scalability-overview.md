---
title: Scalability Overview
titleSuffix: Overview of compute and storage scalability on Azure Cosmos DB for MongoDB vCore
description: Cost and performance advantages of scalability functionality for Azure Cosmos DB for MongoDB vCore clusters
author: abinav2307
ms.author: abramees
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/22/2024
---

The vCore based service for Azure Cosmos DB for MongoDB offers vertical scalability as well as horizontal scalability. While Compute and Storage components behave as a single entity, users have the flexibility to provision desired SKUs of both independently based on the needs of their workload.

# Vertical Scaling
A unique benefit of the vCore based offering for Azure Cosmos DB for MongoDB is the ability to scale compute and storage vertically. Compute and Storage SKU can be scaled up and down to meet the workload's requirements.

Vertical scaling offers the following benefits:
- There may not always be a clear path to sharding the data within the cluster. Moreover, logical sharding must be defined per collection. In a dataset with several un-sharded collections, this can quickly become tedious. Simply scaling up the cluster can circumvent the need to logically shard the dataset to meet the growing needs of the application.
- As an immediate mitigation to the growing compute and storage needs of an application, the cluster can simply be scaled up and avoid data rebalancing between more or fewer nodes in the cluster. Scaling up and down are zero down-time operations with no disruptions to the service. There are no application changes needed and steady state operations will continue without any impact.
- Similarly, compute and storage can also be scaled down during known time windows of lower activity. Once again, scaling down avoids the need to rebalance data across a fewer number of physical shards and is a zero down-time operation with no disruption to the service. Here too, no application changes are needed after scaling down the resources of the cluster. 



# Horizontal Scaling

# Independently scale Compute and Storage



