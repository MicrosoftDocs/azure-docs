---
title: Azure Container Apps environments
description: Learn how environments are managed in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 08/29/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, build-2023
---

# Azure Container Apps environments

A Container Apps environment is a secure boundary around one or more container apps and jobs. The Container Apps runtime manages each environment by handling OS upgrades, scale operations, failover procedures, and resource balancing.

Environments include the following features:

| Feature | Description |
|---|---|
| Type | There are [two different types](#types) of Container Apps environments: Workload profiles environments and Consumption only environments. Workload profiles environments support both the Consumption and Dedicated [plans](plans.md) whereas Consumption only environments support only the Consumption [plan](plans.md). |
| Virtual network | A virtual network supports each environment, which enforces the environment's secure boundaries. As you create an environment, a virtual network that has [limited network capabilities](networking.md) is created for you, or you can provide your own. Adding an [existing virtual network](vnet-custom.md) gives you fine-grained control over your network. |
| Multiple container apps | When multiple container apps are in the same environment, they share the same virtual network and write logs to the same logging destination. |
| Multi-service integration | You can add [Azure Functions](https://aka.ms/functionsonaca) and [Azure Spring Apps](https://aka.ms/asaonaca) to your Azure Container Apps environment. |

:::image type="content" source="media/environments/azure-container-apps-environments.png" alt-text="Azure Container Apps environments.":::

Depending on your needs, you may want to use one or more Container Apps environments. Use the following criteria to help you decide if you should use a single or multiple environments.

### Single environment

Use a single environment when you want to:

- Manage related services
- Deploy different applications to the same virtual network
- Instrument Dapr applications that communicate via the Dapr service invocation API
- Have applications share the same Dapr configuration
- Have applications share the same log destination

### Multiple environments

Use more than one environment when you want two or more applications to:

- Never share the same compute resources
- Not communicate via the Dapr service invocation API
- Be isolated due to team or environment usage (for example, test vs. production)

## Types

| Type | Description | Plan | Billing considerations |
|--|--|--|--|
| Workload profile | Run serverless apps with support for scale-to-zero and pay only for resources your apps use with the consumption profile. You can also run apps with customized hardware and increased cost predictability using dedicated workload profiles. | Consumption and Dedicated | You can choose to run apps under either or both plans using separate workload profiles. The Dedicated plan has a fixed cost for the entire environment regardless of how many workload profiles you're using. |
| Consumption only | Run serverless apps with support for scale-to-zero and pay only for resources your apps use. | Consumption only | Billed only for individual container apps and their resource usage. There's no cost associated with the Container Apps environment. |

## Logs

Settings relevant to the Azure Container Apps environment API resource.

| Property | Description |
|---|---|
| `properties.appLogsConfiguration` | Used for configuring the Log Analytics workspace where logs for all apps in the environment are published. |
| `properties.containerAppsConfiguration.daprAIInstrumentationKey` | App Insights instrumentation key provided to Dapr for tracing |

## Policies

Azure Container Apps environments are automatically deleted if one of the following conditions is detected for longer than 90 days:

- In an idle state
- In a failed state due to VNet or Azure Policy configuration
- Blocks infrastructure updates due to VNet or Azure Policy configuration

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
