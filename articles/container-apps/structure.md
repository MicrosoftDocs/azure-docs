---
title: Compute and billing structures in Azure Container Apps
description: Learn how compute and networking features and billing methods are structured in Azure Container Apps 
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 08/09/2024
ms.author: cshoe
---

# Compute and billing structures in Azure Container Apps

In Azure Container Apps, different environment types determine functionality and billing methods associated with different plans. This article explains the relationship between environment types, plans, workload profiles, and why to consider selecting one over another.

The environment type you choose helps determine the type of compute resources and features available to your app. The following diagram depicts the relationship between environments and plans.

:::image type="content" source="media/structure/azure-container-apps-structure.png" alt-text="Diagram of Azure Container Apps architecture structure.":::

In summary, plans dictate usage costs and influence the features available to your container apps. Workload profiles determine what type of compute resources are available to your apps, and each profile works either on the dedicated or the consumption plan. Finally, the environment type dictates whether or not you can use a workload profile, or if your container app works in a consumption-only context.

To better understand these relationships, start by considering the difference between environment types.

## Environment types

A Container Apps environment is a secure boundary around one or more container apps, and every app runs within an environment. Environments are available in two different types. Depending on which type of environment you select, you have a different set of networking and compute features and billing options available to your application.

| Workload profiles environment | Consumption-only environment |
|---|---|
| The workload profiles environment gives you the flexibility to select compute resources tailored to the needs of your applications. Within this environment, you can choose from dedicated hardware resources or a consumption context where you only pay for use. These different contexts are known as individual *workload profiles*. | The Consumption-only environment runs your application using compute resources exclusively allocated on-demand. You only pay for resources consumed by your application. |

The environment type you select dictates which plans are available to your environment.

> [!NOTE]
> The consumption-only environment represents an older version of the runtime. New applications that require consumption-based resources should use the Workload profiles environment with the built-in [consumption workload profile](#workload-profiles).

## Plans

The plan running in your Container Apps environment decides what features are available to your environment, and controls how billing is calculated. There are two types of plans:

| Plan type | Usage | Unique features | Billing method |
|---|---|---|---|
| **Dedicated plan** | Used exclusively with a workload profiles environment. | ▪️ Compute resources (vCPUs and RAM) dedicated to your environment<br><br>▪️ Optimized networking stack <-- TODO: elaborate | Dependent on the compute resources you make available to your workload profiles. The more vCPUs and RAM you allocate, the more you pay per month. |
| **Consumption plan** | Used with the consumption workload profile and consumption-only environment. | ▪️ Allows your apps to scale in to zero. | Billed as your application consumes resources. |

When you use a Workload profiles environment, different workload profiles use either the dedicated or consumption plan.

## Workload profiles

Each workload profiles environment automatically comes with a consumption profile. You can choose whether or not to use the consumption profile since you only incur costs for usage.

With a workload profiles environment, you add different workload profiles to your environment to accommodate the needs of your applications. You can add as many dedicated workload profiles to your environment as necessary. When you choose to use a dedicated workload profile, you can select the amount of memory and compute resources that are allocated to your apps.

As you add a dedicated workload profile to your environment, you select the memory and vCPU size you want assigned to the profile. Resource availability is categorized as into different series. The following table lists the different compute capacity series that you can choose from as you create a new workload profile.

| Type | Classification | Possible use cases | vCPU-to-RAM ratio |
|---|---|---|---|
| **D series** | General purpose | ▪️ TODO | 2x |
| **E series** | Memory optimized | ▪️ GPU intensive processing<br><br>▪️ TODO | 8x |

The different series of workload profile sizes use different vCPU-to-RAM ratios. For instance, with the *D series*, you get double the amount of RAM in GiB in relation to the number of vCPUs selected for the profile. For instance if you select a size with 2 vCPUs, then 6 GiB of RAM is allocated to your profile. Resources for the *E series* are calculated the same way except you get eight times more RAM in relation to your vCPUs.

## FAQ

### Can you have more than one consumption profile running in a workload profiles environment?

No. Every workload profiles environment comes with a single consumption profile by default. You use this profile for all your consumption needs.

### Can I remove the consumption profile from workload profiles environment?

No. If you don't need the consumption profile, just don't use it. As typical with pay-as-you-go, you aren't charged for the consumption profile if you don't use it.

### Does the consumption plan work the same way in a workload profiles environment vs. a consumption-only environment?

No. There are some distinctions between how the consumption plan operates among the workload profiles and consumption-only plans. Some networking features are different in a workload profiles environment. For instance, user defined routes (UDR) are only available in a workload profiles environment, and subnet sizes differ, and IP addresses are assigned differently depending on the environment type.

### I need consumption pricing. Should I use a Consumption-only environment, or a consumption workload profile?

If you need the features of a consumption model, and you're creating a new Azure Container Apps environment, use the Workload profiles environment with the consumption profile. Using this approach gives you the flexibility to add dedicated resources to your environment should you need them in the future.

## Related content

- [Environments](environment.md)
- [Plans](plans.md)
- [Workload profiles](workload-profiles-overview.md)