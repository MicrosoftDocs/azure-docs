---
title: Azure Container Apps environments
description: Learn how environments are managed in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 03/13/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, build-2023
---

# Azure Container Apps environments

A Container Apps environment is a secure boundary around groups of container apps that share the same virtual network and write logs to the same logging destination.

Container Apps environments are fully managed where Azure handles OS upgrades, scale operations, failover procedures, and resource balancing.

:::image type="content" source="media/environments/azure-container-apps-environments.png" alt-text="Azure Container Apps environments.":::

Reasons to deploy container apps to the same environment include situations when you need to:

- Manage related services
- Deploy different applications to the same virtual network
- Instrument Dapr applications that communicate via the Dapr service invocation API
- Have applications to share the same Dapr configuration
- Have applications share the same log analytics workspace

Also, you may provide an [existing virtual network](vnet-custom.md) when you create an environment.

Reasons to deploy container apps to different environments include situations when you want to ensure:

- Two applications never share the same compute resources
- Two Dapr applications can't communicate via the Dapr service invocation API

You can add [**Azure Functions**](https://aka.ms/functionsonaca) and [**Azure Spring Apps**](https://aka.ms/asaonaca) to your Azure Container Apps environment.

## Logs

Settings relevant to the Azure Container Apps environment API resource.

| Property | Description |
|---|---|
| `properties.appLogsConfiguration` | Used for configuring the Log Analytics workspace where logs for all apps in the environment are published. |
| `properties.containerAppsConfiguration.daprAIInstrumentationKey` | App Insights instrumentation key provided to Dapr for tracing |

## Billing

Azure Container Apps has two different pricing structures.

- If you're using the Consumption only plan, or only the Consumption workload profile in the Consumption + Dedicated plan structure then billing is relevant only to individual container apps and their resource usage. There's no cost associated with the Container Apps environment.
- If you're using any Dedicated workload profiles in the Consumption + Dedicated plan structure, there's a fixed cost for the Dedicated plan management. This cost is for the entire environment regardless of how many Dedicated workload profiles you're using.

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
