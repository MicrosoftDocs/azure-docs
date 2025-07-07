---
title: Compute and billing structures in Azure Container Apps
description: Learn how compute and networking features and billing methods are structured in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/21/2025
ms.author: cshoe
---

# Compute and billing structures in Azure Container Apps

In Azure Container Apps, the environment and plan type you use determines the  functionality and billing methods associated with your application. This article explains the relationship between plans, workload profiles, and why to consider selecting one over another.

## Environment types

Azure Container Apps features two different environment types.

| Name | Identifier | Is default | Notes |
|---|---|---|---|
| Workload profiles | v2 | Yes | This article explains the details surrounding the default *Workload profiles (v2)* environment type. |
| Consumption-only | v1 | No | For more detail on the *Consumption-only (v1)* environment type, see [Consumption-only environment type](environment-type-consumption-only.md). |

The default environment type, **Workload profiles (v2)** environment allows you to use different compute profiles, known as *workload profiles*. Each profile features different amounts of compute resources, and is tailored specifically to meet your app's needs.

A *Workload profiles (v2)* environment allows you to select the type of compute profiles used in your environment, and different profiles run on different plans.

> [!NOTE]
> Any new Azure Container Apps environments you create should be a *Workload profiles (v2)* environment. The *v2* environment type gives you the maximum flexibility for consumption and dedicated compute options. A *v2* environment gives you all the consumption functionality you need along with access to more robust networking features. 

The following diagram shows how you can have different workload profiles in an environment, and how each profile is supported by either the dedicated or consumption plan.

:::image type="content" source="media/structure/azure-container-apps-structure.png" alt-text="Diagram of Azure Container Apps architecture structure.":::

Plans are related to your environment type and dictate usage costs and influence the features available to your container apps. Workload profiles determine the specific compute resources available to your environment, and each profile works either on the dedicated or the consumption plan.

To better understand these relationships, start by considering the differences between different workload profiles.

## Workload profiles

Each *Workload profiles (v2)* environment automatically comes with a consumption profile. The consumption profile allows you to run applications where you only want to pay for usage. Ultimately, you decide whether or not to use the consumption profile since you only incur costs when apps are running in the consumption workload profile.

By default, every *v2* environment only comes with a consumption workload profile. Depending on the needs of your app, you can choose to add any other specialized workload profiles that are best tailored for your application's needs.

The consumption profile makes 4 vCPUs with 8 GB of memory available to your apps. If you require more resources, then run your apps on dedicated workload profile. You can add as many dedicated workload profiles to your environment as necessary.

When you choose to use a dedicated workload profile, you can select the allocated amount of memory and compute resources available to your apps. For more information on available virtual machine sizes, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes/overview).

Regardless of what type of profile you decide to run, each profile runs on a plan. The consumption profile runs on the consumption plan while dedicated workload profiles use the dedicated plan.

## Plans

The plan running in your Container Apps environment determines available features and controls how billing is calculated. You can choose from dedicated resources or a consumption context where you only pay for use.

There are two types of plans:

| Plan type | Unique features | Billing method |
|---|---|---|---|
| **Dedicated plan** | Compute resources (vCPUs and RAM) dedicated to your environment | Dependent on the compute resources you make available to your workload profiles. The more vCPUs and RAM you allocate, the more you pay per month. |
| **Consumption plan** | Allows your apps to scale to zero. | Billed as your application consumes resources. |

Each plan is paired with one or more workload profiles.

## Making a selection

Any new Azure Container Apps environments you create should be a *Workload profiles (v2)* environment. The *v2* environment type gives you the maximum flexibility to use both the dedicated and consumption model.

*Workload profiles v2* environments have access to an extensive networking stack which includes firewall support, native private endpoints, and optimized IP address allocation.

## FAQ

### Can you have more than one consumption profile running in a workload profiles environment?

No. Every workload profiles environment comes with a single consumption profile by default. You use this profile for all your consumption needs.

### Can I remove the consumption profile from workload profiles environment?

No. If you don't need the consumption profile, just don't use it. As typical with pay-as-you-go scenarios, you aren't charged for the consumption profile if you don't use the profile.

### Does the consumption plan work the same way in a Workload profiles (v2) environment vs. a Consumption-only (v1) environment?

Yes, but there are some distinctions between how the consumption plan operates among the workload profiles and consumption-only plans. Some networking features are different in a workload profiles environment. For instance, user defined routes (UDR) are only available in a workload profiles environment, and subnet sizes differ, and IP addresses are assigned differently depending on the environment type.

### I need consumption pricing. Should I use a Consumption-only (v1) environment, or a Workload profiles (v2) environment with the consumption profile?

If you need the features of a consumption model, and you're creating a new Azure Container Apps environment, use the Workload profiles (v2) environment with the consumption profile. This approach gives you the flexibility to add dedicated resources to your environment should you need them in the future.

## Related content

- [Environments](environment.md)
- [Plans](plans.md)
- [Workload profiles](workload-profiles-overview.md)
