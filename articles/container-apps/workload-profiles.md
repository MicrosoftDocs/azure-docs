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

Under the [Premium plan](./plans.md#premium-plan), you select a workload profile as you create a container app. Workload profiles determine the amount of compute resources available to each container app.

Profiles are configured to fit the needs of your applications.

| Profile type  | Description | Potential use |
|--|--|--|
| General purpose | Balance of memory and hardware resources  | Line-of-business applications |
| General purpose: _Memory optimized_ | Increased memory resources | Large large in-memory data, in-memory machine learning models |
| General purpose: _Compute optimized_ | Increased hardware resources | Cryptography |

## Resource consumption

You can constrain the memory and CPU usage of an app inside a workload profile. However, the total amount of resources available to a container app is less than what's allocated to a profile. The difference between allocated and available resources is what's reserved for the Azure runtime.

## Scaling

Workload profiles scale in two ways. As demand for your app fluctuates, replicas increase or decrease as needed. This scaling model is the same as in the [Consumption plan](plans.md#consumption-plan), however, profiles themselves can also scale.

When demand for applications in a profile exceeds the profile's capabilities, profile instances can increase. You have control over the constraints on the minimum and maximum number of profile instances. Azure calculates [billing](billing.md#premium-plan) in part based on the number of running profiles.

## Select a profile

As you create your container app, the *App settings* tab includes the **Container resource allocation** section. Here, you can select from a list of different workload profiles that are customized to meet different needs.

The workload profile selector allows you to choose from profiles meant for general purpose computing loads to hardware-optimized specific configurations.

After you select a profile, you can adjust the allocated CPU and memory resources assigned to the profile.

:::image type="content" source="media/workload-profiles/azure-container-apps-select-workload.png" alt-text="Select a workload profile for your Premium plan container app.":::

## Maintain a profile

To adjust your workload profile:

1. Open your Container Apps environment in the Azure portal.
1. Go to *Settings* and select **Workload profile** to open the profile editor.

The workload editor allows you to define the instance minimums and maximums for a profile.

:::image type="content" source="media/workload-profiles/azure-container-apps-adjust-workload.png" alt-text="The workload editor allows you to define the instance configuration for a profile.":::

## Next steps

> [!div class="nextstepaction"]
> [Plan types](plans.md)
