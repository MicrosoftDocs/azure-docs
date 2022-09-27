---
title: Premium plan workload profiles in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/26/2022
ms.author: cshoe
---

# Premium plan workload profiles in Azure Container Apps

Under the [Premium plan](./plans.md#premium-plan), you select a workload profile as you create a container app. Workload profiles determine the amount of compute and memory resources available to one or more container app(s) deployed to an instance of the workload profile.

Profiles are configured to fit the needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| General purpose | Balance of memory and hardware resources  | Line-of-business applications |
| General purpose: _Memory optimized_ | Increased memory resources | Large large in-memory data, in-memory machine learning models |
| General purpose: _Compute optimized_ | Increased hardware resources | Cryptography |

## Resource consumption

You can constrain the memory and CPU usage of each app inside a workload profile, and you can run many apps inside a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure Container Apps runtime.

## Scaling

Workload profiles scale in two ways. As demand for your app fluctuates, replicas increase or decrease as needed. This scaling model is the same as in the [Consumption plan](plans.md#consumption-plan), however, profiles themselves can also scale.

When demand for new apps, or additional replicas of an existing app, exceeds the profiles current resources additional profile instances may be added. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#premium-plan) largely based on the number of running profile instances.

## Select a profile

As you create your container app, the *App settings* tab includes the **Container resource allocation** section. Here, you can select from a list of different workload profiles that are customized to meet different needs.

The workload profile selector allows you to choose from profiles meant for general purpose computing loads to hardware-optimized specific configurations.

After you select a profile, you can adjust the allocated CPU and memory resources assigned to the app being created. Often you will be able to deploy multiple apps to an instance of a workload profile, it just depends on how many resources each app needs and how many resources the workload profile provide. But the workload profile can scale out by adding additional instances, up to the limits you can set.

:::image type="content" source="media/workload-profiles/azure-container-apps-select-workload.png" alt-text="Select a workload profile for your Premium plan container app.":::

## Manage workload profiles

To view or adjust your workload profiles:

1. Open your Container Apps **environment** in the Azure portal.
1. Select **Workload profile** on the navigation bar.

The workload profile page shows all the profiles available to this environment. It also shows how many instances of each profile are in use, this is what you are billed for. You can adjust the minimum and maximum number of instances that can be used for each profile, this allows you to control costs for this environment. Lastly, you can see the number of apps running in each profile and clicking on this number (when > 0) shows you which apps are running in this profile.```

Not sure if it is called the "navigation bar"?

:::image type="content" source="media/workload-profiles/azure-container-apps-adjust-workload.png" alt-text="The workload editor allows you to define the instance configuration for a profile.":::

## Next steps

> [!div class="nextstepaction"]
> [Plan types](plans.md)
