---
title: Pricing in Azure Container Apps preview
description: Learn how billing is calculated in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 02/18/2022
ms.author: cshoe
---

# Pricing in Azure Container Apps preview

Pricing is calculated using variety of criteria. The following guide explains billing thresholds and compute resources included for free.

* Billing occurs on a per-pod basis.
* Usage is charged based on the total amount of vCPU and memory allocated to all containers in a pod.​
* Each external HTTP request is billed a request charge.
* Each calendar month, the following items are included for free, per subscription:

    | Metric | Quantity |
    |--|--|
    | Requests | ?? |
    | vCPU seconds | ?? |
    | GiB-seconds | ?? |
  
  The free grant applies to the total resources consumed when pods are in either active or idle mode.
* No usage charges are billed when nothing is running.

## Modes

Billing is split up into *minimum equilibrium* and *minimum overrun* modes.

active vs idle

container, when running, is either charged active or idle rate

charged for 2 things
vCPU & memory - always being charged, when a container is running
in a given seconds - look at pod, second of active, second of idle, etc.

all external http requests, incur one request charge

### Minimum equilibrium

When the number of pods is equal to the `minReplicas` value, then prices are calculated using the following criteria.

* Each running pod is charged based on whether it’s idle or active​

* A pod is active when one of these conditions is true​
  * One of its containers is starting​
  * A request is being processed
  * Resource usage is above any one of the active billable thresholds​:
    * When more than 0.01 vCPUs are consumed​.
    * When bytes received per second​ are greater than or equal to 1000.

### Minimum overrun

When the number of running pods exceeds the `minReplicas` value, then prices are calculated using the following criteria.

* Each running pod is charged the active rate.
