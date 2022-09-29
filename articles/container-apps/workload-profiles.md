---
title: Premium plan workload profiles in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/27/2022
ms.author: cshoe
---

# Premium plan workload profiles in Azure Container Apps

Under the [Premium plan](./plans.md#premium-plan), you select a workload profile as you create a container app. Workload profiles determine the amount of compute and memory resources available to the container apps deployed to an instance of the workload profile.

Profiles are configured to fit the needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| General purpose | Balance of memory and compute resources  | Line-of-business applications |
| General purpose: _Memory optimized_ | Increased memory resources | Large large in-memory data, in-memory machine learning models |
| General purpose: _Compute optimized_ | Increased compute resources | Cryptography |

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run multiple apps inside a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure Container Apps runtime.

## Scaling

Workload profiles scale in two ways. As demand for your app fluctuates, replicas increase or decrease as needed. This scaling model is the same as in the [Consumption plan](plans.md#consumption-plan), however, profiles themselves can also scale.

When demand for new apps or more replicas of an existing app exceeds the profile's current resources, profile instances may be added. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#premium-plan) largely based on the number of running profile instances.

## Select a profile

As you create your container app, the *App settings* tab includes the **Container resource allocation** section. Here, you can select from a list of different workload profiles that are customized to meet different needs.

The workload profile selector allows you to choose from profiles meant for general purpose loads to compute-optimized configurations.

After you select a profile, you can adjust the allocated CPU and memory resources assigned to the app being created. Often you'll deploy multiple apps to an instance of a workload profile, depending on the resources requirements each app. A profile can scale out by adding more instances, up to the limits you can set.

:::image type="content" source="media/workload-profiles/azure-container-apps-select-workload.png" alt-text="Screenshot of select a workload profile for your Premium plan container app.":::

## Manage workload profiles

To view or adjust your workload profiles:

1. Open your Container Apps environment in the Azure portal.
1. Select **Workload profile** on the navigation bar.

The workload profile window shows the profiles available to an environment.

:::image type="content" source="media/workload-profiles/azure-container-apps-adjust-workload.png" alt-text="Screenshot of the workload editor, which allows you to define the instance configuration for a profile.":::

Shown in this view are the instances of each profile in use, which represent billable resources. You can change the minimum and maximum number of instances in use by each profile. Adjusting instance values allows you to control an environment's costs. You're also able to view a profile's running apps by selecting the value in the **# of Apps** column.

## Next steps

> [!div class="nextstepaction"]
> [Plan types](plans.md)
