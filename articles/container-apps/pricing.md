---
title: Pricing in Azure Container Apps preview
description: Learn how billing is calculated in Azure Container Apps preview
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 02/25/2022
ms.author: cshoe
---

# Billing in Azure Container Apps preview

Azure Container Apps billing consists of two types of charges:

- [Resource consumption](#resource-consumption-charges) – the amount of resources allocated to your container app on a per-second basis, billed in vCPU-seconds and GiB-seconds

- [HTTP requests](#request-charges) – the number of HTTP requests your container app receives

The first 180,000 vCPU-seconds, 360,000 GiB-seconds, and 2 million requests per subscription per month are free. 

This article describes how to calculate the cost of running your container app. For pricing details in your account's currency, see [Azure Container Apps Pricing](https://azure.microsoft.com/pricing/details/container-apps/).

## Resource consumption charges

Azure Container Apps runs replicas of your application based on the [scaling rules and replica count limits](scale-app.md) you configure. You are charged for the amount of resources allocated to each replica while it is running.

There are two meters for resource consumption:

- vCPU-seconds - the amount of vCPU cores allocated to your container app on a per-second basis

- GiB-seconds - the amount of memory allocated to your container app on a per-second basis

The first 180,000 vCPU-seconds and 360,000 GiB-seconds in each subscription per calendar month are free.

The rate you pay for resource consumption depends on the state of your container app and replica(s). By default, replicas are charged at an *active* rate. However, in certain conditions, a replica can enter an *idle* state and resources are billed at a reduced *idle* rate.

### No replicas are running

When your container app is scaled down to zero replicas, no resource consumption charges are incurred.

### Minimum number of replicas are running

When your container app is configured with a minimum replica count of at least one and the app is scaled down to the minimum replica count, replicas running in your app are eligible for idle usage charges.

Usage charges are calculated individually for each replica. A replica is considered idle when *all* of the following are true:

- None of the containers in the replicas are in the process of starting up

- The replica is not processing any HTTP requests

- The replica is using less than 0.01 vCPU cores

- The replica is receiving less than 1,000 bytes per second of network traffic

When a replica is idle, resource consumption charges are calculated at the reduced idle rates. When a replica is not idle, the active rate applies.

### More than the minimum number of replicas are running

When your container app is scaled above the minimum replica count, all running replicas are charged for resource consumption at the active rate.

## Request charges

In addition to resource consumption, Azure Container Apps also charges based on the number of HTTP requests received by your container app.

The first 2 million requests in each subscription per calendar month are free.

Only external HTTP requests are charged. Requests from internal calls between container apps in your Container Apps environment are not charged.

Container apps without an external ingress do not incur request charges.
