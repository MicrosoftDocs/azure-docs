---
title: Azure Container Apps plan types
description: Contrast the different plains available in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/27/2022
ms.author: cshoe
---

# Azure Container Apps plan types

Azure Container Apps features two different plan types.

| Plan type | Description |
|--|--|
| Consumption | Serverless environment where apps can scale to zero. You only pay for compute apps as they're running. |
| Premium | A fully managed, isolated environment with customized compute options and flexible cost control options. |

## Consumption plan

The Consumption plan features a serverless architecture that allows your applications to scale in and out on demand. Applications can scale to zero, and you only pay for running apps.

Use the Consumption plan when you need:

- **Serverless architecture**: Focus only on your app instead of managing infrastructure.

- **Pay only when apps are running**: Apps can be idle for cost savings, and even scale to zero for a no-cost option.

## Premium plan

The Premium plan features fully managed, isolated environments with access to customized infrastructure using [workflow profiles](workload-profiles.md). Each workload profile can scale in and out as demand requires. As demand falls, any profiles created on-demand are shut down, while the [minimum threshold of resources](billing.md#premium-plan) stays running.

Use the Premium plan when you need:

- **Environment isolation**: Single tenancy in a Container Apps environment.

- **Custom infrastructure**: Run your apps on customized compute options where you can pick among different levels of CPU and memory resources.

- **Cost control**: Traditional serverless compute options optimize for scale in response to events and may not provide cost control options. With the Premium plan, you can set infrastructure scaling [restrictions](workload-profiles.md#resource-consumption) to help you better control costs.

    The Premium plan can be more cost effective when you're running higher scale deployments.

- **Secure network egress**: Access to a [user defined routing](https://aka.ms/container-apps-udr) (UDR) which enables scanning and filtering of all outbound traffic.

## Next steps

Deploy your first app with:

- [Azure portal](quickstart-portal.md)
- [Azure CLI](get-started.md)
