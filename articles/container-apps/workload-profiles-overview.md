---
title: Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/30/2023
ms.author: cshoe
ms.custom: references_regions
---

# Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)

Under the [Consumption + Dedicated plan structure](./plans.md#consumption-dedicated), you can use different workload profiles in your environment. Workload profiles determine the amount of compute and memory resources available to container apps deployed in an environment.

Profiles are configured to fit the different needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| Consumption |  Automatically added to any new environment. | Apps that don't require specific hardware requirements |
| Dedicated General purpose | Balance of memory and compute resources  |  Apps needing larger amounts of CPU and/or memory |
| Dedicated Memory optimized | Increased memory resources | Apps needing large in-memory data, in-memory machine learning models, or other high memory requirements |

A Consumption workload profile is automatically added to all Consumption + Dedicated plan structure environment you create. You can optionally add dedicated workload profiles of any type or size as you create an environment or after it's created.

For each Dedicated workload profile in your environment, you can:

- Select the type and size
- Deploy multiple apps into the profile
- Use autoscaling to add and remove nodes based on the needs of the apps
- Limit scaling of the profile to for better cost control and predicatibilty

You can configure each of your apps to run on any of the workload profiles defined in your Container Apps environment. This configuration is ideal for deploying a microservice solution where each app can run on the appropriate compute infrastructure.

## Profile types

There are different types and sizes of workload profiles available by region. By default each Consumption + Dedicated plan structure includes a Consumption profile, but you can also add any of the following profiles:

| Display name | Name | Cores | MemoryGiB | Category | Allocation |
|---|---|---|---|---|---|
| Consumption | consumption |4 | 8 | Consumption | per replica |
| Dedicated-D4 | D4 | 4 | 16 | General purpose | per node |
| Dedicated-D8 | D8 | 8 | 32 | General purpose | per node |
| Dedicated-D16 | D16 | 16 | 64 | General purpose | per node |
| Dedicated-D32 | D32 | 32 | 128 | General purpose | per node |
| Dedicated-E4 | E4 | 4 | 32 | Memory optimized | per node |
| Dedicated-E8 | E8 | 8 | 64 | Memory optimized | per node |
| Dedicated-E16 | E16 | 16 | 128 | Memory optimized | per node |
| Dedicated-E32 | E32 | 32 | 256 | Memory optimized | per node |

Select a workload profile and use the *Name* field when you run `az containerapp env workload-profile set` for the `--workload-profile-type` option.

The availability of different workload profiles varies by region.

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a single instance of a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure Container Apps runtime.

## Scaling

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances may be added. Inversely, if the number of apps or replicas goes down, profile instances may be removed. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#consumption-dedicated) largely based on the number of running profile instances.

## Networking

When using workload profiles in the Consumption + Dedicated plan structure, additional networking features to fully secure your ingress/egress networking traffic such as user defined routes are available. To learn more about what networking features are supported, see [networking concepts](./networking.md), and for steps on how to secure your network with Container Apps, see the [lock down your Container App environment section](./networking.md#lock-down-your-container-app-environment).

## Next steps

> [!div class="nextstepaction"]
> [Manage workload profiles with the CLI](workload-profiles-manage-cli.md)
