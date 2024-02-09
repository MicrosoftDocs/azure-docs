---
title: Billing in Azure Container Apps
description: Learn how billing is calculated in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom:
  - event-tier1-build-2022
  - ignite-2023
ms.topic: conceptual
ms.date: 10/11/2023
ms.author: cshoe
---

# Billing in Azure Container Apps

Billing in Azure Container Apps is based on your [plan type](plans.md).

| Plan type | Description |
|--|--|
| [Consumption plan](#consumption-plan) | Serverless compute option where you're only billed for the resources your apps use as they're running. |
| [Dedicated plan](#consumption-dedicated) | Customized compute options where you're billed for instances allocated to each [workload profile](workload-profiles-overview.md). |

- Your plan selection determines billing calculations.
- Different applications in an environment can use different plans.

This article describes how to calculate the cost of running your container app. For pricing details in your account's currency, see [Azure Container Apps Pricing](https://azure.microsoft.com/pricing/details/container-apps/).

## Consumption plan

Billing for apps running in the Consumption plan consists of two types of charges:

- **[Resource consumption](#resource-consumption-charges)**: The amount of resources allocated to your container app on a per-second basis, billed in vCPU-seconds and GiB-seconds.
- **[HTTP requests](#request-charges)**: The number of HTTP requests your container app receives.

The following resources are free during each calendar month, per subscription:

- The first 180,000 vCPU-seconds
- The first 360,000 GiB-seconds
- The first 2 million HTTP requests

Free usage doesn't appear on your bill. You're only charged as your resource usage exceeds the monthly free grants amounts.

> [!NOTE]
> If you use Container Apps with [your own virtual network](networking.md#managed-resources) or your apps utilize other Azure resources, additional charges may apply.

### Resource consumption charges

Azure Container Apps runs replicas of your application based on the [scaling rules and replica count limits](scale-app.md) you configure for each revision. [Azure Container Apps jobs](jobs.md) run replicas when job executions are triggered. You're charged for the amount of resources allocated to each replica while it's running.

There are 2 meters for resource consumption:

- **vCPU-seconds**: The number of vCPU cores allocated to your container app on a per-second basis.
- **GiB-seconds**: The amount of memory allocated to your container app on a per-second basis.

The first 180,000 vCPU-seconds and 360,000 GiB-seconds in each subscription per calendar month are free.

#### Container apps

The rate you pay for resource consumption depends on the state of your container app's revisions and replicas. By default, replicas are charged at an *active* rate. However, in certain conditions, a replica can enter an *idle* state. While in an *idle* state, resources are billed at a reduced rate.

##### No replicas are running

When a revision is scaled to zero replicas, no resource consumption charges are incurred.

##### Minimum number of replicas are running

Idle usage charges might apply when a container app's revision is running under a specific set of circumstances. To be eligible for idle charges, a revision must be:

- Configured with a [minimum replica count](scale-app.md) greater than zero
- Scaled to the minimum replica count

Usage charges are calculated individually for each replica. A replica is considered idle when *all* of the following conditions are true:

- The replica is running in a revision that is currently eligible for idle charges.
- All of the containers in the replica have started and are running.
- The replica isn't processing any HTTP requests.
- The replica is using less than 0.01 vCPU cores.
- The replica is receiving less than 1,000 bytes per second of network traffic.

When a replica is idle, resource consumption charges are calculated at the reduced idle rates. When a replica isn't idle, the active rates apply.

##### More than the minimum number of replicas are running

When a revision is scaled above the [minimum replica count](scale-app.md), all of its running replicas are charged for resource consumption at the active rate.

#### Jobs

In the Consumption plan, resources consumed by Azure Container Apps jobs are charged the active rate. Idle charges don't apply to jobs because executions stop consuming resources once the job completes.

### Request charges

In addition to resource consumption, Azure Container Apps also charges based on the number of HTTP requests received by your container app. Only requests that come from outside a Container Apps environment are billable.

- The first 2 million requests in each subscription per calendar month are free.
- [Health probe](./health-probes.md) requests aren't billable.

Request charges don't apply to Azure Container Apps jobs because they don't support ingress.

<a id="consumption-dedicated"></a>

## Dedicated plan

You're billed based on workload profile instances, not by individual applications.

Billing for apps and jobs running in the Dedicated plan is based on workload profile instances, not by individual applications. The charges are as follows:

| Fixed management costs | Variable costs |
|---|---|
| If you have one or more dedicated workload profiles in your environment, you're charged a Dedicated plan management fee. You aren't billed any plan management charges unless you use a Dedicated workload profile in your environment. | As profiles scale out, extra costs apply for the extra instances; as profiles scale in, billing is reduced. |

Make sure to optimize the applications you deploy to a dedicated workload profile. Evaluate the needs of your applications so that they can use the most amount of resources available to the profile.

## General terms

- For pricing details in your account's currency, see [Azure Container Apps Pricing](https://azure.microsoft.com/pricing/details/container-apps/).
