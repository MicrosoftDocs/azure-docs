---
title: Billing in Azure Container Apps preview
description: Learn how billing is calculated in Azure Container Apps preview
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/09/2022
ms.author: cshoe
---

# Billing in Azure Container Apps preview

Azure Container Apps billing consists of two types of charges:

- **[Resource consumption](#resource-consumption-charges)**: The amount of resources allocated to your container app on a per-second basis, billed in vCPU-seconds and GiB-seconds.

- **[HTTP requests](#request-charges)**: The number of HTTP requests your container app receives.

The following resources are free during each calendar month, per subscription:

- The first 180,000 vCPU-seconds
- The first 360,000 GiB-seconds
- The first 2 million HTTP requests

This article describes how to calculate the cost of running your container app. For pricing details in your account's currency, see [Azure Container Apps Pricing](https://azure.microsoft.com/pricing/details/container-apps/).

## Resource consumption charges

Azure Container Apps runs replicas of your application based on the [scaling rules and replica count limits](scale-app.md) you configure. You're charged for the amount of resources allocated to each replica while it's running.

There are two meters for resource consumption:

- **vCPU-seconds**: The amount of vCPU cores allocated to your container app on a per-second basis.

- **GiB-seconds**: The amount of memory allocated to your container app on a per-second basis.

The first 180,000 vCPU-seconds and 360,000 GiB-seconds in each subscription per calendar month are free.

The rate you pay for resource consumption depends on the state of your container app and replicas. By default, replicas are charged at an *active* rate. However, in certain conditions, a replica can enter an *idle* state. While in an *idle* state, resources are billed at a reduced rate.

### No replicas are running

When your container app is scaled down to zero replicas, no resource consumption charges are incurred.

### Minimum number of replicas are running

Idle usage charges are applied when your replicas are running under a specific set of circumstances. The criteria for idle charges include:

- When your container app is configured with a [minimum replica count](scale-app.md) of at least one.
- The app is scaled down to the minimum replica count.

Usage charges are calculated individually for each replica. A replica is considered idle when *all* of the following conditions are true:

- All of the containers in the replica have started and are running.
- The replica isn't processing any HTTP requests.
- The replica is using less than 0.01 vCPU cores.
- The replica is receiving less than 1,000 bytes per second of network traffic.

When a replica is idle, resource consumption charges are calculated at the reduced idle rates. When a replica is not idle, the active rates apply.

### More than the minimum number of replicas are running

When your container app<sup>1</sup> is scaled above the [minimum replica count](scale-app.md), all running replicas are charged for resource consumption at the active rate.

<sup>1</sup> For container apps in multiple revision mode, charges are based on the current replica count in a revision relative to its configured minimum replica count.

## Request charges

In addition to resource consumption, Azure Container Apps also charges based on the number of HTTP requests received by your container app.

The first 2 million requests in each subscription per calendar month are free.

