---
title: Azure Container Apps plan types
description: Compare different plains available in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/28/2023
ms.author: cshoe
---

# Azure Container Apps plan types

Azure Container Apps features two different plan types.

| Plan type | Description | In Preview |
|--|--|--|
| [Consumption](#consumption-plan) | Serverless environment where apps can scale to zero. You only pay for compute apps as they're running. | No |
| [Consumption with Dedicated workload profiles](#consumption-dedicated) | Serverless environment where apps can scale to zero. You only pay for compute apps as they're running. In addition, you can run apps with customized hardware or increased cost control requirements on Dedicated workload profiles. | Yes |

## Consumption plan

The Consumption plan features a serverless architecture that allows your applications to scale in and out on demand. Applications can scale to zero, and you only pay for running apps.

Use the Consumption plan when you don't have specific hardware requirement for your container app.

<a id="consumption-dedicated"></a>

## Consumption + Dedicated plan

The Consumption + Dedicated plan features fully managed, isolated environments with access to customized infrastructure using general purpose, memory optimized, and compute optimized [workflow profiles](workload-profiles-overview.md). Each workload profile can scale in and out as demand requires. When demand falls, profiles created on-demand are shut down, while the [minimum threshold of resources](billing.md#dedicated-plan) stays running.

Use the Consumption + Dedicated plan when you need:

- **Environment isolation**: Container Apps environment using dedicated hardware with a single tenant guarantee.

- **Custom compute**: Select from various resource profiles based on variation in workload demands around CPU and memory.

- **Cost control**: Traditional serverless compute options optimize for scale in response to events and may not provide cost control options. With the Consumption + Dedicated plan, you can set infrastructure scaling [restrictions](workload-profiles-overview.md#resource-consumption) to help you better control costs.

    The Consumption + Dedicated plan can be more cost effective when you're running higher scale deployments with steady throughput.

- **Secure outbound traffic**: You can create environments with no public inbound access, or customize the outbound network path from environments where public IPs are disallowed.

> [!NOTE]
> When configuring your cluster with a user defined route for egress, you must explicitly send egress traffic to a network virtual appliance such as Azure Firewall.

<!-- This private preview relies on a new flexible plan structure for Azure Container Apps. Developers can optimize their hosting plan by choosing between Serverless and Dedicated compute for each app in the Azure Container Apps environment. The new Dedicated plan included in the private preview enables customers to add one or more Dedicated Workload Profiles (WPs) to an environment. We will offer General purpose, Memory optimized, and Compute optimized Workload Profiles, all supporting more vCPUs and memory. By default, a Consumption workload profile is added to any new environment created. You can add additional Workload Profiles during environment creation or afterwards. A single environment can use both Dedicated and Consumption Workload Profiles with this new hybrid plan model.

You can deploy multiple apps to each WP instance, which means you can create many apps in some of the larger workload profiles. Additionally, the workload profile itself can scale independently from the container app scaling. You can set minimum and maximum instance counts for each WP which can help you control costs. When running apps at scale, the pricing for Dedicated WPs is a savings compared to the Consumption plan which bills per app only when it is running. 
-->

## Next steps

Deploy an app with:

- [Consumption plan](quickstart-portal.md)
- [Consumption + Dedicated plan](workload-profiles-manage-cli.md)
