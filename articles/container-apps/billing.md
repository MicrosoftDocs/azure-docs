---
title: Billing in Azure Container Apps
description: Learn how billing is calculated in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 03/09/2022
ms.author: cshoe
---

# Billing in Azure Container Apps

Azure Container Apps billing consists of two types of charges:

- **[Resource consumption](#resource-consumption-charges)**: The amount of resources allocated to your container app on a per-second basis, billed in vCPU-seconds and GiB-seconds.
- **[HTTP requests](#request-charges)**: The number of HTTP requests your container app receives.

The following resources are free during each calendar month, per subscription:

- The first 180,000 vCPU-seconds
- The first 360,000 GiB-seconds
- The first 2 million HTTP requests

This article describes how to calculate the cost of running your container app. For pricing details in your account's currency, see [Azure Container Apps Pricing](https://azure.microsoft.com/pricing/details/container-apps/).

> [!NOTE]
> If you use Container Apps with [your own virtual network](networking.md#managed-resources) or your apps utilize other Azure resources, additional charges may apply.

## Resource consumption charges

Azure Container Apps runs replicas of your application based on the [scaling rules and replica count limits](scale-app.md) you configure for each revision. You're charged for the amount of resources allocated to each replica while it's running.

There are 2 meters for resource consumption:

- **vCPU-seconds**: The number of vCPU cores allocated to your container app on a per-second basis.
- **GiB-seconds**: The amount of memory allocated to your container app on a per-second basis.

The first 180,000 vCPU-seconds and 360,000 GiB-seconds in each subscription per calendar month are free.

The rate you pay for resource consumption depends on the state of your container app's revisions and replicas. By default, replicas are charged at an *active* rate. However, in certain conditions, a replica can enter an *idle* state. While in an *idle* state, resources are billed at a reduced rate.

### No replicas are running

When a revision is scaled to zero replicas, no resource consumption charges are incurred.

### Minimum number of replicas are running

Idle usage charges may apply when a revision is running under a specific set of circumstances. To be eligible for idle charges, a revision must meet the following criteria.

- It is configured with a [minimum replica count](scale-app.md) greater than zero.
- It is scaled to the minimum replica count.

Usage charges are calculated individually for each replica. A replica is considered idle when *all* of the following conditions are true:

- The replica is running in a revision that is currently eligible for idle charges.
- All of the containers in the replica have started and are running.
- The replica isn't processing any HTTP requests.
- The replica is using less than 0.01 vCPU cores.
- The replica is receiving less than 1,000 bytes per second of network traffic.

When a replica is idle, resource consumption charges are calculated at the reduced idle rates. When a replica is not idle, the active rates apply.

### More than the minimum number of replicas are running

When a revision is scaled above the [minimum replica count](scale-app.md), all of its running replicas are charged for resource consumption at the active rate.

## Request charges

In addition to resource consumption, Azure Container Apps also charges based on the number of HTTP requests received by your container app.

The first 2 million requests in each subscription per calendar month are free.
