---
title: Azure Container Apps plan types
description: Contrast the different plains available in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/26/2022
ms.author: cshoe
---

# Azure Container Apps plan types

Azure Container Apps features two different plan types.

| Plan type | Description |
|--|--|
| Consumption | Serverless environment where apps can scale to zero. You only pay for apps as they're running. |
| Premium | A fully managed, isolated environment with customized infrastructure and flexible cost control options. |

## Consumption plan

The Consumption plan features a serverless architecture that allows your applications to scale in and out on demand. Applications can scale to zero, and you only pay for running apps.

Use the Consumption plan when you need:

- **Serverless architecture**: Apps can scale to zero, and you only pay for running apps.

- **Smaller architectural footprint**: Costs savings are often possible with the Consumption plan when you're deploying fewer than 100 microservices.

## Premium plan

The Premium plan features a managed architecture based on [workflow profiles](workload-profiles.md). When demand for applications in  profile exceeds the profile's capabilities, profile instances can increase. As demand falls, any profiles created on-demand are shut down while the [minimum threshold of resources](billing.md#premium-plan) stays running.

Use the Premium plan when you need:

- **Environment isolation**: Single tenancy in a Container Apps environment.

- **Custom infrastructure**: Run your apps on customized hardware where you can pick among different levels of CPU and memory resources.

- **Cost control**: Traditional serverless architecture can result in unexpected costs. With the Premium plan, you can set infrastructure scaling [restrictions](workload-profiles.md#resource-consumption) to help you better control costs.

    The Premium plan can be more cost effective when you're running higher scale deployments.

- **Fully private environment**: Access to a user defined routing (UDR) table for deterministic routes.

## Next steps

> [!div class="nextstepaction"]
> [Workload profiles](workload-profiles.md)
