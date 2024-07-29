---
title: Understanding pricing - Application Gateway for Containers
description: Learn how Azure Application Gateway for Containers is billed.
services: application gateway
author: greg-lindsay
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: conceptual
ms.date: 5/9/2024
ms.author: greglin
---

# Understanding Pricing for Application Gateway for Containers

> [!NOTE]
> Prices shown in this article are examples and are for illustration purposes only. For pricing information according to your region, see the [Pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).

[Application Gateway for Containers](overview.md) is an application layer load-balancing solution that enables scalable, highly available, and secure web application delivery for workloads in deployed to an Azure Kubernetes Cluster (AKS).

There are no upfront costs or termination costs associated with Application Gateway for Containers.

You're billed only for the resources provisioned and utilized based on actual hourly consumption. Costs associated with Application Gateway for Containers are classified into two components: fixed costs and variable costs.

This article describes the costs associated with each billable component of Application Gateway for Containers. You can use this article for planning and managing costs associated with Azure Application Gateway for Containers.

## Billing Meters

Application Gateway for Containers consists of four billable items: 
- Application Gateway for Containers resource
- Frontend resource 
- Association resource 
- Capacity units

#### Application Gateway for Containers hour

An Application Gateway for Containers hour corresponds to the amount of time each Application Gateway for Containers parent resource is deployed. The Application Gateway for Containers resource is responsible for processing and coordinating configuration of your deployment.

#### Frontend hour

A frontend hour measures the amount of the time each Application Gateway for Containers frontend child resource is provisioned.

#### Association hour

An Association hour measures the amount of time each Application Gateway for Containers association child resource is provisioned.

#### Capacity Units per hour

A capacity Unit is the measure of capacity utilization for an Application Gateway for Containers across multiple parameters.

A single Capacity Unit consists of the following parameters:
* 2,500 Persistent connections
* 2.22-Mbps throughput

The parameter with the highest utilization is internally used for calculating capacity units, which are then billed. If any of these parameters are exceeded, then another N capacity units are necessary, even if another parameter hasn't exceed a single capacity unit's limits.

## Example billing scenarios

Estimated costs are used for the East US 2 region. 

| Meter | Price |
| ----- | ----- |
| Application Gateway for Container | $0.017 per application gateway for container-hour |
| Frontend | $0.01 per frontend-hour |
| Association | $0.12 per association-hour |
| Capacity Unit | $0.008 per capacity unit-hour |

For the latest pricing information according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).

### Example 1 - Simple Application Gateway for Containers deployment

This example assumes the following resources:

* 1 Application Gateway for Containers resource
* 1 frontend resource
* 1 association resource
* 5 capacity units

Pricing calculation:

* 1 Application Gateway for Containers x $0.017 x 730 hours = $12.41
* 1 Frontend x $0.01 x 730 hours = $7.30
* 1 Association x $0.12 x 730 hours = $87.60
* 5 Capacity Units x $0.008 x 730 hours = $29.20
* Total = $136.51

### Example 2 - Application Gateway for Containers deployment with 3 frontends

This example assumes the following resources:

* 1 Application Gateway for Containers resource
* 3 frontend resource
* 1 association resource
* 5 capacity units

Pricing calculation:

* 1 Application Gateway for Containers x $0.017 x 730 hours = $12.41
* 3 Frontends x $0.01 x 730 hours = $21.90
* 1 Association x $0.12 x 730 hours = $87.60
* 5 Capacity Units x $0.008 x 730 hours = $29.20
* Total = $151.11

### Example 3 - Contoso.com and Fabrikam.com on the same Application Gateway for Containers resources

Contoso.com and fabrikam.com are considered hostnames. A single Application Gateway for Containers frontend resource can support multiple hostnames. This enables consolidation to a single frontend.  Assume the gateway supports at least 3,000 active connections between both workloads. 

First, calculate the number of capacity units required:
- max[3,000 connections / 2,500 connections = 1.2, 2.22 Mbps / 2.22 Mbps = 1 (rounded)] = 2

In this example, the following resources are required:

* 1 Application Gateway for Containers resource
* 1 frontend resource
* 1 association resource
* 2 capacity units

Pricing calculation:

* 1 Application Gateway for Containers x $0.017 x 730 hours = $12.41
* 1 Frontend x $0.01 x 730 hours = $7.30
* 1 Association x $0.12 x 730 hours = $87.60
* 2 Capacity Units x $0.008 x 730 hours = $11.68
* Total = $118.99

### Example 4 - Sizing a gateway based on throughput and connections

This scenario assumes several hostnames across three different frontends, with sustained 200 Mbps of throughput and 5,000 active connections.

First, calculate the number of capacity units required: 
- max[5,000 connections / 2,500 connections = 2, 100 Mbps / 2.22 Mbps = 46 (rounded)] = 46

In this example, the following resources are required:

* 1 Application Gateway for Containers resource
* 1 frontend resource
* 1 association resource
* 46 capacity units

Pricing calculation:

* 1 Application Gateway for Containers x $0.017 x 730 hours = $12.41
* 1 Frontend x $0.01 x 730 hours = $7.30
* 1 Association x $0.12 x 730 hours = $87.60
* 46 Capacity Units x $0.008 x 730 hours = $268.64
* Total = $375.95

### Example 5 - Variable traffic demands

This scenario assumes several hostnames across a given frontend, with variable traffic processed by Application Gateway for Containers. Consider the following capacity units based on traffic demands over a given hour:

| Time | Consumption |
| ---- | ----------- |
| 00:00 - 00:30 | 1 Capacity Unit per minute |
| 00.30 - 01:00 | 5 Capacity Units per minute |

Capacity units are calculated as follows:

* ((30 minutes x 1 Capacity Unit) + (30 minutes x 5 Capacity Units)) / 60 minutes = 3 Capacity Units

In this example, we have the following resources:

* 1 Application Gateway for Containers resource
* 1 frontend resource
* 1 association resource

Pricing calculation:

* 1 Application Gateway for Containers x $0.017 x 730 hours = $12.41
* 1 Frontend x $0.01 x 730 hours = $7.30
* 1 Association x $0.12 x 730 hours = $87.60
* 3 Capacity Units x $0.008 x 730 hours = $17.52
* Total = $124.83

## Next steps

See the following articles to learn more about how pricing works in Application Gateway for Containers by visiting the Application Gateway pricing pages:

* [Azure Application Gateway pricing page](https://azure.microsoft.com/pricing/details/application-gateway/)
* [Azure Application Gateway pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=application-gateway)
