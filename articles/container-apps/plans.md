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
| [Consumption](#consumption-plan) | Serverless environment with support for scale-to-zero and pay only for resources your apps use. | No |
| [Consumption + Dedicated plan structures (preview)](#consumption-dedicated) | Fully managed environment with support for scale-to-zero and pay only for resources your apps use. Optionally, run apps with customized hardware and increased cost predictability using Dedicated workload profiles. | Yes |

## Consumption plan

The Consumption plan features a serverless architecture that allows your applications to scale in and out on demand. Applications can scale to zero, and you only pay for running apps.

Use the Consumption plan when you don't have specific hardware requirements for your container app.

<a id="consumption-dedicated"></a>

## Consumption + Dedicated plan structure (preview)

The Consumption + Dedicated plan structure consists of a serverless plan that allows your applications to scale in and out on demand. Applications can scale to zero, and you only pay for running apps. It also consists of a fully managed plan you can optionally use that provides dedicated, customized hardware to run your apps on.

You can select from general purpose and memory optimized [workflow profiles](workload-profiles-overview.md) that provide larger amounts of CPU and memory. You pay per node, versus per app, and workload profile can scale in and out as demand changes.

Use the Consumption + Dedicated plan structure when you need any of the following in a single environment:

- **Consumption usage**: Use of the Consumption plan to run apps that need to scale to zero that don't have specific hardware requirements.

- **Secure outbound traffic**: You can create environments with no public inbound access, and customize the outbound network path from environments to use firewalls or other network appliances.

Use the Dedicated plan within the Consumption + Dedicated plan structure when you need any of the following features:

- **Environment isolation**: Use of the Dedicated workload profiles provides apps with dedicated hardware with a single tenant guarantee.

- **Customized compute**: Select from many types and sizes of Dedicated workload profiles based on your apps requirements. You can deploy many apps to each workload profile. Each workload profile can scale independently as more apps are added or removed or as apps scale their replicas up or down.

- **Cost control**: Traditional serverless compute options optimize for scale in response to events and may not provide cost control options. With Dedicated workload profiles, you can set minimum and maximum scaling to help you better control costs.

    The Consumption + Dedicated plan structure can be more cost effective when you're running higher scale deployments with steady throughput.

> [!NOTE]
> When configuring your cluster with a user defined route for egress, you must explicitly send egress traffic to a network virtual appliance such as Azure Firewall.

## Next steps

Deploy an app with:

- [Consumption plan](quickstart-portal.md)
- [Consumption + Dedicated plan structure](workload-profiles-manage-cli.md)
