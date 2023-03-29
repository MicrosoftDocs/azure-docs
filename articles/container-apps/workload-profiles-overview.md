---
title: Workload profiles in Consumption + Dedicated plan environments in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/28/2023
ms.author: cshoe
---

# Workload profiles in Consumption + Dedicated plan environments in Azure Container Apps

Under the [Consumption + Dedicated plan](./plans.md#consumption-dedicated), you can use different workload profiles in your environment. Workload profiles determine the amount of compute and memory resources available to container apps deployed in an environment.

Profiles are configured to fit the different needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| General purpose | Balance of memory and compute resources  | Line-of-business applications |
| Memory optimized | Increased memory resources | Large large in-memory data, in-memory machine learning models |
| Compute optimized | Increased compute resources | Cryptography |
| Consumption |  Added to any new environment by default. | |

By default, a Consumption workload profile is included with every Consumption + Dedicated plan environment. You can add more workload profiles of any type as you create an environment or after it's created.

## Supported regions

The following regions support workload profiles during preview:

- North Central US
- North Europe
- West Europe
- East US

## Profile types

There are a series of different types of workload profiles available by region. By default each Consumption + Dedicated plan includes a Consumption profile, but you can also add any of the following profiles:

| Title | Description |
|---|---|
| D-Series v5 | The latest generation D family sizes recommended for your general purpose needs |
| D-Series v4 | The 4th generation D family sizes for your general purpose needs |
| B-Series | Ideal for workloads that don't need continuous full CPU performance |
| E-Series v5 | The latest generation E family sizes for your high memory needs |
| E-Series v4 | The 4th generation E family sizes for your high memory needs |
| F-Series v2 | Up to 2X performance boost for vector processing workloads |
| L-Series | High throughput, low latency, directly mapped to local NVMe storage |
| D-Series v3 | The 3rd generation D family sizes for your general purpose needs |
| E-Series v3 | The 3rd generation E family sizes for your high memory needs |
| D-Series v2 | The 2nd generation D family sizes for your general purpose needs |

The availability of different profiles varies by region.

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure Container Apps runtime.

## Scaling

Workload profiles scale in two ways. As demand for your app fluctuates, replicas increase or decrease as needed. This scaling model is the same as in the [Consumption plan](plans.md#consumption-plan), however, profiles themselves can also scale.

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances may be added. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#dedicated-plan) largely based on the number of running profile instances.

## List supported profiles

Use the `list-supported` command to display the supported profiles by region.

```azcli
az containerapp env workload-profile list-supported --location <LOCATION>  --query "[].{Name: name, Cores: properties.cores, MemoryGiB: properties.memoryGiB, Category: properties.category}" -o table
```

## Next steps

> [!div class="nextstepaction"]
> [Manage workload profiles with the CLI](workload-profiles-manage-cli.md)