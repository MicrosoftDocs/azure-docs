---
title: Compute and billing structures in Azure Container Apps
description: Learn how compute and networking features and billing methods are structured in Azure Container Apps 
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 08/21/2024
ms.author: cshoe
---

# Compute and billing structures in Azure Container Apps

In Azure Container Apps, the plan type you use determines the functionality and billing methods associated with your application. The default environment type, the **Workload profiles (v2)** environment pairs different plans with different compute profiles, known as *workload profiles*. Each profile is features different amounts of compute resources available, and is tailored specifically to meet your app's needs. This article explains the relationship between plans, workload profiles, and why to consider selecting one over another.

For information about the **Consumption-only (v1)** environment type, see [Consumption-only environment type](environment-type-consumption-only.md).

## Overview

A *Workload profiles (v2)* environment allows you to select the type of plans and profiles you use in your environment.

:::image type="content" source="media/structure/azure-container-apps-structure.png" alt-text="Diagram of Azure Container Apps architecture structure.":::

Plans dictate usage costs and influence the features available to your container apps. Workload profiles determine what type of compute resources are available in your environment, and each profile works either on the dedicated or the consumption plan.

To better understand these relationships, start by considering the difference between plans.

## Plans

The plan running in your Container Apps environment determines available features and controls how billing is calculated. You can choose from dedicated resources or a consumption context where you only pay for use.

There are two types of plans:

| Plan type | Unique features | Billing method |
|---|---|---|---|
| **Dedicated plan** | Compute resources (vCPUs and RAM) dedicated to your environment<br><br>Optimized networking stack <-- TODO: elaborate | Dependent on the compute resources you make available to your workload profiles. The more vCPUs and RAM you allocate, the more you pay per month. |
| **Consumption plan** | Allows your apps to scale in to zero. | Billed as your application consumes resources. |

Each plan is paired with one or more *workload profiles*.

## Workload profiles

Each *Workload profiles (v2)* environment automatically comes with a consumption profile. You can choose whether or not to use the consumption profile since you only incur costs for usage.

In addition to the build-in consumption profile, you can add extra profiles to your environment to accommodate the needs of your applications. When you choose to use a dedicated workload profile, you can select the amount of memory and compute resources that are allocated to your apps. You can add as many dedicated workload profiles to your environment as necessary.

As you add a dedicated workload profile to your environment, you select the memory and vCPU size you want assigned to the profile. Resource availability is categorized into different series of compute capacities.

The following table lists the different compute capacity series that you can choose from as you create a new workload profile.

| Type | Classification | Possible use cases | vCPU-to-RAM ratio |
|---|---|---|---|
| **D series** | General purpose | ▪️ TODO | 2x |
| **E series** | Memory optimized | ▪️ GPU intensive processing<br><br>▪️ TODO | 8x |

The different series of workload profile sizes use different vCPU-to-RAM ratios. With the *D series*, you get double the amount of RAM in GiB in relation to the number of vCPUs selected for the profile. For example, if you select a size with 2 vCPUs, then 6 GiB of RAM is allocated to your profile. Resources for the *E series* are calculated the same way except you get eight times more RAM in relation to your vCPUs.

## Making a selection

Any new Container Apps environments you create should be a *Workload profiles (v2)* environment. Using this environment type gives you the maximum flexibility to use both the dedicated and consumption model.

Depending on your application's needs, you choose different types of workload profiles most appropriate to your context:

| If you need... | Workload profile type |
|---|---|
| Pay-as-you-go pricing | Consumption |
| Scale in to zero capability | Consumption |
| Zero cold start | Dedicated |
| Access to GPU processing | Dedicated |
| TODO |  |
| TODO |  |

## FAQ

### Can you have more than one consumption profile running in a workload profiles environment?

No. Every workload profiles environment comes with a single consumption profile by default. You use this profile for all your consumption needs.

### Can I remove the consumption profile from workload profiles environment?

No. If you don't need the consumption profile, just don't use it. As typical with pay-as-you-go, you aren't charged for the consumption profile if you don't use it.

### Does the consumption plan work the same way in a Workload profiles (v2) environment vs. a Consumption-only (v1) environment?

No. There are some distinctions between how the consumption plan operates among the workload profiles and consumption-only plans. Some networking features are different in a workload profiles environment. For instance, user defined routes (UDR) are only available in a workload profiles environment, and subnet sizes differ, and IP addresses are assigned differently depending on the environment type.

### I need consumption pricing. Should I use a Consumption-only (v1) environment, or a Workload profiles (v2) environment with the consumption profile?

If you need the features of a consumption model, and you're creating a new Azure Container Apps environment, use the Workload profiles (v2) environment with the consumption profile. Using this approach gives you the flexibility to add dedicated resources to your environment should you need them in the future.

## Related content

- [Environments](environment.md)
- [Plans](plans.md)
- [Workload profiles](workload-profiles-overview.md)