---
title: Azure Container Apps plan types
description: Compare different plains available in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/29/2023
ms.author: cshoe
---

# Azure Container Apps plan types

Azure Container Apps features two different plan types.

| Plan type | Description |
|--|--|
| [Dedicated](#dedicated) | Fully managed environment with support for scale-to-zero and pay only for resources your apps use. Optionally, run apps with customized hardware and increased cost predictability using Dedicated [workload profiles environment](environment.md#types). |
| [Consumption](#consumption) | Serverless environment with support for scale-to-zero and pay only for resources your apps use. |

<a id="consumption-dedicated"></a>

## Dedicated

The Dedicated plan consists of a series of workload profiles that range from the default consumption profile to profiles that feature dedicated hardware customized for specialized compute needs.  

You can select from general purpose or specialized compute
[workload profiles](workload-profiles-overview.md) that provide larger amounts of CPU and memory or GPU enabled features. You pay per instance of the workload profile, versus per app, and workload profiles can scale in and out as demand rises and falls.

Use the Dedicated plan when you need any of the following in a single environment:

- **Secure outbound traffic**: You can assign single outbound network path to systems protected by firewalls or other network appliances.

- **Environment isolation**: Dedicated workload profiles provide access to dedicated hardware with a single tenant guarantee.

- **Customized compute**: Select from many types and sizes of workload profiles based on your apps requirements. You can deploy many apps to each workload profile. Each workload profile can scale independently as more apps are added or removed or as apps scale their replicas up or down.


- **Cost control**: Traditional serverless compute options optimize for scale in response to events and may not provide cost control options. Dedicated workload profiles let you set minimum and maximum scaling to help you better control costs.

    The Dedicated plan can be more cost effective when you're running higher scale deployments with steady throughput.

> [!NOTE]
> When configuring your cluster with a user defined route for egress, you must explicitly send egress traffic to a network virtual appliance such as Azure Firewall.

## Consumption

The Consumption plan features a serverless architecture that allows your applications to scale in and out on demand. Applications can scale to zero, and you only pay for running apps.

Use the Consumption plan when you don't have specific hardware requirements for your container app.

## Next steps

Deploy an app with:

- [Consumption plan](quickstart-portal.md)
- [Dedicated plan](workload-profiles-manage-cli.md)
