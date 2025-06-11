---
title: Workload profiles in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/27/2025
ms.author: cshoe
ms.custom:
  - references_regions
  - ignite-2023
  - ignite-2024
  - build-2025
---

# Workload profiles in Azure Container Apps

A workload profile determines the amount of compute and memory resources available to the container apps deployed in an environment.

Profiles are configured to fit the different needs of your applications.

| Profile type | Description | Potential use |
|--|--|--|
| Consumption | Automatically added to any new environment. | Apps that don't require specific hardware requirements |
| Consumption GPU | Scale-to-zero serverless GPUs are available in West US 3, Australia East, and Sweden Central regions. | Apps that require GPU |
| Dedicated (General purpose) | Balance of memory and compute resources | Apps that require larger amounts of CPU and/or memory |
| Dedicated (Memory optimized) | Increased memory resources | Apps that need access to large in-memory data, in-memory machine learning models, or other high memory requirements |
| Dedicated (GPU enabled) | GPU enabled with increased memory and compute resources available in West US 3 and North Europe regions. | Apps that require GPU |

> [!NOTE]
> When using GPU-enabled workload profiles, make sure your application is running the latest version of [CUDA](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/cuda).

The Consumption workload profile is the default profile added to every Workload profiles [environment](environment.md) type. You can add Consumption GPU workload profiles for each type of GPU. All Consuption workload profiles:

- Automatically scale as needed
- Can deploy multiple apps

You can add Dedicated workload profiles to your environment. These enable you to:

- Use reserved VMs for your apps
- Select the type and size of the VM
- Deploy multiple apps in each profile
- Use autoscaling to add and remove VM instances based on the needs of the apps
- Limit scaling of the profile to better control costs

You can configure each of your apps to run on any of the workload profiles defined in your Container Apps environment. This configuration is ideal for deploying microservices where each app can run on the appropriate compute infrastructure.

> [!NOTE]
> You can only add a Dedicated GPU workload profile when initially creating an environment. Consumption GPU and other types of workload profiles may be added later.

## Profile types

There are different types and sizes of workload profiles available by region. By default, each workload profile enabled environment includes a Consumption profile, but you can also add any of the following profiles:

| Display name | Name | vCPU | Memory (GiB) | GPU | Category | Allocation | Quota name |
|---|---|---|---|---|---|---|
| Consumption | Consumption | 4 | 8 | - | Consumption | per replica | Managed Environment Consumption Cores |
| Consumption-GPU-NC24-A100 | Consumption-GPU-NC24-A100 | 24 | 220 | 1 | Consumption GPU | per replica | Subscription Consumption NCA 100 Gpus |
| Consumption-GPU-NC8as-T4 | Consumption-GPU-NC8as-T4 | 8 | 56 | 1 | Consumption GPU | per replica | Subscription Consumption T 4 Gpus |
| Dedicated-D4 | D4 | 4 | 16 | - | General purpose | per node | Managed Environment General Purpose Cores |
| Dedicated-D8 | D8 | 8 | 32 | - | General purpose | per node | Managed Environment General Purpose Cores |
| Dedicated-D16 | D16 | 16 | 64 | - | General purpose | per node | Managed Environment General Purpose Cores |
| Dedicated-D32 | D32 | 32 | 128 | - | General purpose | per node | Managed Environment General Purpose Cores |
| Dedicated-E4 | E4 | 4 | 32 | - | Memory optimized | per node | Managed Environment Memory Optimized Cores |
| Dedicated-E8 | E8 | 8 | 64 | - | Memory optimized | per node | Managed Environment Memory Optimized Cores |
| Dedicated-E16 | E16 | 16 | 128 | - | Memory optimized | per node | Managed Environment Memory Optimized Cores |
| Dedicated-E32 | E32 | 32 | 256 | - | Memory optimized | per node | Managed Environment Memory Optimized Cores |
| Dedicated-NC24-A100 | NC24-A100 | 24 | 220 | 1 | GPU enabled | per node<sup>\*</sup> | Subscription NCA 100 Gpus |
| Dedicated-NC48-A100 | NC48-A100 | 48 | 440 | 2 | GPU enabled | per node<sup>\*</sup> | Subscription NCA 100 Gpus |
| Dedicated-NC96-A100 | NC96-A100 | 96 | 880 | 4 | GPU enabled | per node<sup>\*</sup> | Subscription NCA 100 Gpus |

<sup>\*</sup> Capacity is allocated on a per-case basis. Submit a [support ticket](https://azure.microsoft.com/support/create-ticket/) to request the capacity amount required for your application.

> [!NOTE]
> The command `az containerapp env workload-profile set` is no longer available for selecting a workload profile. Instead, use [az containerapp env workload-profile add](/cli/azure/containerapp/env/workload-profile#az-containerapp-env-workload-profile-add) or [az containerapp env workload-profile update](/cli/azure/containerapp/env/workload-profile#az-containerapp-env-workload-profile-update).

In addition to a different core size and memory size, each workload profile is allocated a different storage size. This allocated space is used for the runtime. Do not use this storage for your application data. Instead, use a [storage mount](storage-mounts.md).

The availability of different workload profiles varies by region.

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a single instance of a workload profile. However, the total resources available to a container app are less than the resources allocated to a profile. The difference between allocated and available resources is the amount reserved by the Container Apps runtime.

## Scaling

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances might be added.

At the same time, if the number of required replicas goes down, profile instances might be removed. You have control over the constraints on the minimum and maximum number of profile instances.

Azure calculates [billing](billing.md#consumption-dedicated) largely based on the number of running profile instances.

## Networking

When you use the workload profile environment, extra networking features that fully secure your ingress and egress networking traffic (such as user defined routes) are available. To learn more about what networking features are supported, see [Networking in Azure Container Apps environment](./networking.md). For steps on how to secure your network with Container Apps, see the [lock down your Container App environment section](networking.md#environment-security).

## Next steps

> [!div class="nextstepaction"]
> [Manage workload profiles with the CLI](workload-profiles-manage-cli.md)
