---
title: Azure Container Apps environments
description: Learn how environments are managed in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 08/03/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, build-2023
---

# Azure Container Apps environments

A Container Apps environment is a secure boundary around one or more container apps. The Container Apps runtime manages environments by handling OS upgrades, scale operations, failover procedures, and resource balancing.

Environments include the following features:

| Feature | Description |
|---|---|
| Type | There are [two different types](#types) of Container Apps environments: Workload profile environments and Consumption only environments. |
| Virtual network | Each environment is integrated with a virtual network, which acts as its network boundary. When you create an environment, a virtual network is created for you that has [limited network capabilities](networking.md). Alternatively, you can provide an [existing virtual network](vnet-custom.md) for more fine-grained control over your network. |
| Multiple container apps | When multiple container apps are in the same environment, they share the same virtual network and write logs to the same logging destination. |
| Multi-service integration | You can add [Azure Functions](https://aka.ms/functionsonaca) and [Azure Spring Apps](https://aka.ms/asaonaca) to your Azure Container Apps environment. |

:::image type="content" source="media/environments/azure-container-apps-environments.png" alt-text="Azure Container Apps environments.":::

Depending on the needs of your system, you may opt to use one or more Container Apps environments. Use the following criteria to help you decide if you should use a single or multiple environments.

:::row:::
   :::column span="":::
      ### Deploy to the same environment
      - Manage related services
      - Deploy different applications to the same virtual network
      - Instrument Dapr applications that communicate via the Dapr service invocation API
      - Have applications to share the same Dapr configuration
      - Have applications share the same log analytics workspace
   :::column-end:::
   :::column span="":::
      ### Deploy to different environments
      - Two applications never share the same compute resources
      - Two Dapr applications can't communicate via the Dapr service invocation API
   :::column-end:::
:::row-end:::

## Types

| Type | Description | Plans |
|--|--|--|
| Workload profile | Run serverless apps with support for scale-to-zero and pay only for resources your apps use. Optionally, run apps with customized hardware and increased cost predictability using dedicated workload profiles. | Consumption or dedicated |
| Consumption only | Run serverless apps with support for scale-to-zero and pay only for resources your apps use. | Consumption only |

## Billing

Azure Container Apps has two different pricing structures.

- If you're using the Consumption plan, then billing is relevant only to individual container apps and their resource usage. There's no cost associated with the Container Apps environment.
- If you're using any Dedicated workload profiles in the Dedicated plan, there's a fixed cost for the Dedicated plan management. This cost is for the entire environment regardless of how many Dedicated workload profiles you're using.

## Logs

Settings relevant to the Azure Container Apps environment API resource.

| Property | Description |
|---|---|
| `properties.appLogsConfiguration` | Used for configuring the Log Analytics workspace where logs for all apps in the environment are published. |
| `properties.containerAppsConfiguration.daprAIInstrumentationKey` | App Insights instrumentation key provided to Dapr for tracing |

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
