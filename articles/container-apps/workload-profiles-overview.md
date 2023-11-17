---
title: Workload profiles in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/11/2023
ms.author: cshoe
ms.custom:
  - references_regions
  - ignite-2023
---

# Workload profiles in Azure Container Apps

A workload profile determines the amount of compute and memory resources available to the container apps deployed in an environment.

Profiles are configured to fit the different needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| Consumption | Automatically added to any new environment. | Apps that don't require specific hardware requirements |
| Dedicated (General purpose) | Balance of memory and compute resources  |  Apps that require larger amounts of CPU and/or memory |
| Dedicated (Memory optimized) | Increased memory resources | Apps that need access to large in-memory data, in-memory machine learning models, or other high memory requirements |
| Dedicated (GPU enabled) (preview) | GPU enabled with increased memory and compute resources available in West US 3 and North Europe regions.  | Apps that require GPU |

The Consumption workload profile is the default profile added to every Workload profiles [environment](environment.md) type. You can add Dedicated workload profiles to your environment as you create an environment or after it's created.

For each Dedicated workload profile in your environment, you can:

- Select the type and size
- Deploy multiple apps into the profile
- Use autoscaling to add and remove instances based on the needs of the apps
- Limit scaling of the profile to better control costs

You can configure each of your apps to run on any of the workload profiles defined in your Container Apps environment. This configuration is ideal for deploying microservices where each app can run on the appropriate compute infrastructure.

> [!NOTE]
> You can only apply a GPU workload profile to an environment as the environment is created.

## Profile types

There are different types and sizes of workload profiles available by region. By default, each Dedicated plan includes a consumption profile, but you can also add any of the following profiles:

| Display name | Name | vCPU | Memory (GiB) | GPU | Category | Allocation |
|---|---|---|---|---|---|
| Consumption | consumption |4 | 8 | - | Consumption | per replica |
| Dedicated-D4 | D4 | 4 | 16 | - | General purpose | per node |
| Dedicated-D8 | D8 | 8 | 32 | - | General purpose | per node |
| Dedicated-D16 | D16 | 16 | 64 | - | General purpose | per node |
| Dedicated-D32 | D32 | 32 | 128 | - | General purpose | per node |
| Dedicated-E4 | E4 | 4 | 32 | - | Memory optimized | per node |
| Dedicated-E8 | E8 | 8 | 64 | - | Memory optimized | per node |
| Dedicated-E16 | E16 | 16 | 128 | - | Memory optimized | per node |
| Dedicated-E32 | E32 | 32 | 256 | - | Memory optimized | per node |
| Dedicated-NC24-A100 (preview) | NC24-A100 | 24 | 220 | 1 | GPU enabled | per node<sup>\*</sup> |
| Dedicated-NC48-A100 (preview) | NC48-A100 | 48 | 440 | 2 | GPU enabled | per node<sup>\*</sup> |
| Dedicated-NC96-A100 (preview) | NC96-A100 | 96 | 880 | 4 | GPU enabled | per node<sup>\*</sup> |

<sup>\*</sup> Capacity is allocated on a per-case basis. Submit a [support ticket](https://azure.microsoft.com/support/create-ticket/) to request the capacity amount required for your application.

Select a workload profile and use the *Name* field when you run `az containerapp env workload-profile set` for the `--workload-profile-type` option.

In addition to different core and memory sizes, workload profiles also have varying image size limits available. To learn more about the image size limits for your container apps, see [hardware reference](hardware.md#image-size-limit).

The availability of different workload profiles varies by region.

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a single instance of a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is the amount reserved by the Container Apps runtime.

## Scaling

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances may be added.

At the same time, if the number of required replicas goes down, profile instances may be removed. You have control over the constraints on the minimum and maximum number of profile instances.

Azure calculates [billing](billing.md#consumption-dedicated) largely based on the number of running profile instances.

## Networking

When you use the workload profile environment, extra networking features that fully secure your ingress and egress networking traffic (such as user defined routes) are available. To learn more about what networking features are supported, see [Networking in Azure Container Apps environment](./networking.md). For steps on how to secure your network with Container Apps, see the [lock down your Container App environment section](networking.md#environment-security).

## Next steps

> [!div class="nextstepaction"]
> [Manage workload profiles with the CLI](workload-profiles-manage-cli.md)
