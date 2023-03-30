---
title: Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/30/2023
ms.author: cshoe
---

# Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)

Under the [Consumption + Dedicated plan structure](./plans.md#consumption-dedicated), you can use different workload profiles in your environment. Workload profiles determine the amount of compute and memory resources available to container apps deployed in an environment.

Profiles are configured to fit the different needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| Dedicated General purpose | Balance of memory and compute resources  | Line-of-business applications |
| Dedicated Memory optimized | Increased memory resources | Large large in-memory data, in-memory machine learning models |
| Consumption |  Automatically added to any new environment. | TBD |

A Consumption workload profile is automatically added to any new Consumption + Dedicated plan structure environment you create. You can optionally add dedicated workload profiles of any type as you create an environment or after it's created.

For each Dedicated workload profile in your environment, you can:

- Select the category and size
- Deploy multiple apps into the profile
- Use autoscaling to add and remove nodes based on the needs of the apps
- Limit scaling of the profile to for better cost control

You can configure each of your apps to run on any of the workload profiles defined in your Container Apps environment. This is ideal for deploying a microservice solution where each app can run on the appropriate compute infrastructure. Additionally, the new Consumption workload profile allows you to request up to 4 vCPU’s and 8Gib’s of memory for an app, which is twice the capability found in the original Consumption-only plan.

Additional features include:

- Reduced subnet size requirements with a new `/27` minimum
- Support for environments on subnets with network security groups
- User-defined routes (UDR)
- Support for environments on subnets configured with Azure Firewall and third-party network appliances

## Supported regions

The following regions support workload profiles during preview:

- North Central US
- North Europe
- West Europe
- East US

## Profile types

There are a series of different types of workload profiles available by region. By default each Consumption + Dedicated plan structure includes a Consumption profile, but you can also add any of the following profiles:

| Name | Cores | MemoryGiB | Category |
|---|---|---|---|
| D4 | 4 | 16 | GeneralPurpose |
| D8 | 8 | 32 | GeneralPurpose |
| D16 | 16 | 64 | GeneralPurpose |
| E4 | 4 | 32 | MemoryOptimized |
| E8 | 8 | 64 | MemoryOptimized |
| E16 | 16 | 128 | MemoryOptimized |
| Consumption | 4 | 8 | Consumption (per replica) |

Use the *Name* value for the `--workload-profile-name` as you run [`az containerapp create`](workload-profiles-manage-cli.md#create).

The availability of different profiles may vary by region.

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure Container Apps runtime.

## Scaling

Workload profiles scale in two ways. As demand for your app fluctuates, replicas increase or decrease as needed. This scaling model is the same as in the [Consumption plan](plans.md#consumption-plan), however, profiles themselves can also scale.

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances may be added. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#consumption-dedicated) largely based on the number of running profile instances.

## Next steps

> [!div class="nextstepaction"]
> [Manage workload profiles with the CLI](workload-profiles-manage-cli.md)