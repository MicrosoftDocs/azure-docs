---
title: Azure Container Apps environments Preview
description: Learn how environments are managed in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 10/21/2021
ms.author: cshoe
---

# Azure Container Apps Preview environments

Individual container apps are deployed to a single Container Apps environment, which acts as a secure boundary around groups of container apps. Container Apps in the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

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

## Virtual Network integration

Each environment is automatically assigned an external IP address. However, you can configure individual container apps so that they are not accessible from outside the virtual network.

| Property | Description |
|---|---|
| `properties.workerAppsConfiguration.subnetResourceId` | Azure Resource Manager resource ID for the subnet used for the environment infrastructure. |
| `properties.workerAppsConfiguration.aciSubnetResourceName` | The name of a subnet in the same VNET where the container apps run. |

## Logs

Settings relevant to the Kubernetes environment API resource.

| Property | Description |
|---|---|
| `properties.appLogsConfiguration` | Used for configuring Log Analytics workspace where logs for all apps in the environment will be published |
| `properties.workerAppsConfiguration.daprAIInstrumentationKey` | App Insights instrumentation key provided to Dapr for tracing |

## Billing

Billing is relevant only to individual container apps and their resource usage. There are no base charges associated with the Container Apps environment.

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](autoscale.md)
