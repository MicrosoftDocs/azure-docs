---
title: Azure Container Apps environments
description: Learn how environments are managed in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  conceptual
ms.date: 11/06/2025
ms.author: cshoe
ms.custom: build-2023
---

# Azure Container Apps environments

A Container Apps environment is a secure boundary around one or more container apps and jobs. The Container Apps runtime manages each environment by handling OS upgrades, scale operations, failover procedures, and resource balancing.

Environments include the following features:

| Feature | Description |
|---|---|
| Type | There are [two different types](#types) of Container Apps environments: Workload profiles environments and Consumption only environments. Workload profiles environments support both the Consumption and Dedicated [plans](plans.md) whereas Consumption only environments support only the Consumption [plan](plans.md). |
| Virtual network | A virtual network supports each environment, which enforces the environment's secure boundaries. As you create an environment, a virtual network with [limited network capabilities](networking.md) is created for you, or you can provide your own. Adding an [existing virtual network](vnet-custom.md) gives you fine-grained control over your network. |
| Multiple container apps | When multiple container apps are in the same environment, they share the same virtual network and write logs to the same logging destination. |
| Multi-service integration | You can add [Azure Functions](../container-apps/functions-overview.md) and [Azure Spring Apps](https://aka.ms/asaonaca) to your Azure Container Apps environment. |

:::image type="content" source="media/environments/azure-container-apps-environments.png" alt-text="Azure Container Apps environments.":::

Depending on your needs, you might want to use one or more Container Apps environments. Use the following criteria to help you decide if you should use a single or multiple environments.

### Single environment

Use a single environment when you want to:

- Manage related services
- Deploy different applications to the same virtual network
- Instrument Dapr applications that communicate via the Dapr service invocation API
- Share the same Dapr configuration among applications
- Share the same log destination among applications

### Multiple environments

Use more than one environment when you want two or more applications to:

- Never share the same compute resources
- Not communicate through the Dapr service invocation API
- Be isolated due to team or environment usage (for example, test vs. production)

## Types

| Type | Description | Plan | Billing considerations |
|--|--|--|--|
| Workload profile | Run serverless apps with support for scale-to-zero and pay only for resources your apps use with the consumption profile. You can also run apps with customized hardware and increased cost predictability by using dedicated workload profiles. | Consumption and Dedicated | You can choose to run apps under either or both plans by using separate workload profiles. The Dedicated plan has a fixed plan management cost for the entire environment regardless of how many workload profiles you're using. The Dedicated plan also has a variable cost based on the number of workload profile instances and the resources allocated to each instance. For more information, see [Billing](billing.md#dedicated-plan). |
| Consumption only | Run serverless apps with support for scale-to-zero and pay only for resources your apps use. | Consumption only | Billed only for individual container apps and their resource usage. There's no cost associated with the Container Apps environment. |

## Logs

Logging is an essential part of monitoring and troubleshooting container apps running in your environment. Azure Container Apps environments provide centralized logging capabilities through integration with Azure Monitor and Application Insights.

By default, all container apps within an environment send logs to a common Log Analytics workspace, making it easier to query and analyze logs across multiple apps. These logs include:

- Container `stdout`/`stderr` streams
- Container app scaling events
- Dapr sidecar logs (if Dapr is enabled)
- System-level metrics and events

### Log configuration properties

You can configure the following properties at the environment level through the API:

| Property | Description |
|---|---|
| `properties.appLogsConfiguration` | Used for configuring the Log Analytics workspace where logs for all apps in the environment are published. |
| `properties.containerAppsConfiguration.daprAIInstrumentationKey` | App Insights instrumentation key provided to Dapr for tracing |

## Policies

Azure Container Apps environments are automatically deleted if one of the following conditions persists for longer than 90 days:

- The environment is idle (no active container apps or jobs running in the environment)
- The environment is in a failed state due to virtual network or Azure Policy configuration
- The environment blocks infrastructure updates due to virtual network or Azure Policy configuration

These policies help ensure efficient resource use and maintain service quality. To prevent automatic deletion:

- Keep at least one active container app or job running in your environment
- Ensure your virtual network and Azure Policy configurations are correctly set up
- Respond to any notifications about your environment being in a problematic state

You can monitor the health and status of your Container Apps environments in several ways:

- **Azure Monitor alerts:** Set up alerts to automatically notify you of important changes or issues in your environments.

- **Azure portal:** View real-time environment status and details directly in the Azure portal.

- **Azure CLI:** Use the Azure CLI to check the current status and properties of your environments programmatically.

These options help you stay informed and quickly respond to any issues affecting your environments.

## Limits and quotas

Understanding the limits and quotas for Container Apps environments helps you plan your application architecture effectively.

To see the quotas relevant to your environment, see [Quotas for Azure Container Apps](./quotas.md) for ways to return your quota limits.

For the most up-to-date limits and quotas, refer to the [Azure Container Apps service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#container-apps-limits).

## Related content

- [Containers in Azure Container Apps](containers.md)
- [Networking in Container Apps](networking.md)
