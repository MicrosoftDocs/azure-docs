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

## Consumption + Dedicated plan structure

The Consumption + Dedicated plan structure features fully managed, isolated environments with access to customized infrastructure using general purpose, memory optimized, and compute optimized [workflow profiles](workload-profiles-overview.md). Each workload profile can scale in and out as demand requires. When demand falls, profiles created on-demand are shut down, while the [minimum threshold of resources](billing.md#consumption-dedicated) stays running.

Use the Consumption + Dedicated plan structure when you need:

- **Environment isolation**: Container Apps environment using dedicated hardware with a single tenant guarantee.

- **Custom compute**: Select from various resource profiles based on variation in workload demands around CPU and memory.

- **Cost control**: Traditional serverless compute options optimize for scale in response to events and may not provide cost control options. With the Consumption + Dedicated plan structure, you can set infrastructure scaling [restrictions](workload-profiles-overview.md#resource-consumption) to help you better control costs.

    The Consumption + Dedicated plan structure can be more cost effective when you're running higher scale deployments with steady throughput.

- **Secure outbound traffic**: You can create environments with no public inbound access, or customize the outbound network path from environments where public IPs are disallowed.

> [!NOTE]
> When configuring your cluster with a user defined route for egress, you must explicitly send egress traffic to a network virtual appliance such as Azure Firewall.

## Next steps

Deploy an app with:

- [Consumption plan](quickstart-portal.md)
- [Consumption + Dedicated plan structure](workload-profiles-manage-cli.md)
