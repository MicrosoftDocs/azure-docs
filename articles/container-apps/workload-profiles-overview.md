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

Under the [Consumption + Dedicated plan](./plans.md#dedicated-plan), you select a workload profile as you create a container app. Workload profiles determine the amount of compute and memory resources available to container apps deployed to an instance of the workload profile.

Profiles are configured to fit the needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| General purpose | Balance of memory and compute resources  | Line-of-business applications |
| Memory optimized | Increased memory resources | Large large in-memory data, in-memory machine learning models |
| Compute optimized | Increased compute resources | Cryptography |
| Consumption |  Added to any new environment by default. | |

By default, a Consumption workload profile is included with every Consumption + Dedicated plan environment. You can add more workload profiles of any type as you create an environment or after it is created.

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure Container Apps runtime.

## Scaling

Workload profiles scale in two ways. As demand for your app fluctuates, replicas increase or decrease as needed. This scaling model is the same as in the [Consumption plan](plans.md#consumption-plan), however, profiles themselves can also scale.

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances may be added. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#dedicated-plan) largely based on the number of running profile instances.

## Profile types

TODO

## Next steps

> [!div class="nextstepaction"]
> [Manage workload profiles with the CLI](workload-profiles-manage-cli.md)