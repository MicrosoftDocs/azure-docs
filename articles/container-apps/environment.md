---
title: Azure Container Apps environments Preview
description: Learn how environments are managed in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 12/05/2021
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Azure Container Apps Preview environments

Individual container apps are deployed to a single Container Apps environment, which acts as a secure boundary around groups of container apps. Container Apps in the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. You may provide an [existing virtual network](vnet-custom.md) when you create an environment.

:::image type="content" source="media/environments/azure-container-apps-environments.png" alt-text="Azure Container Apps environments.":::

Reasons to deploy container apps to the same environment include situations when you need to:

- Manage related services
- Deploy different applications to the same virtual network
- Have applications communicate with each other using Dapr
- Have applications to share the same Dapr configuration
- Have applications share the same log analytics workspace

Reasons to deploy container apps to different environments include situations when you want to ensure:

- Two applications never share the same compute resources
- Two applications can't communicate with each other via Dapr

## Logs

Settings relevant to the Azure Container Apps environment API resource.

| Property | Description |
|---|---|
| `properties.appLogsConfiguration` | Used for configuring Log Analytics workspace where logs for all apps in the environment will be published |
| `properties.containerAppsConfiguration.daprAIInstrumentationKey` | App Insights instrumentation key provided to Dapr for tracing |

## Billing

Billing is relevant only to individual container apps and their resource usage. There are no base charges associated with the Container Apps environment.

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)