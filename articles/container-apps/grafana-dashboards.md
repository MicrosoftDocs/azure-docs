---
title: Grafana dashboards in Azure Container Apps (preview)
description: Learn how to use Azure Monitor Dashboards with Grafana in Azure Container Apps for application and environment observability.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 09/16/2025
ms.author: cshoe
---

# Grafana dashboards in Azure Container Apps (preview)

Azure Monitor Dashboards with Grafana provides prebuilt monitoring visualizations for your Azure Container Apps. These dashboards are available directly within the Azure portal, with no extra setup or costs.

In this article, you learn about:

- The available Container Apps dashboards
- Benefits of using Grafana dashboards
- How to access and use the dashboards

## Available dashboards

Azure Container Apps offers two prebuilt Grafana dashboards:

| Dashboard | Description |
|---|---|
| **Container app dashboard** | Displays metrics for an individual container app including CPU usage, memory usage, request rates, replica counts, and restart information. |
| **Environment dashboard** | Provides an overview of all container apps within an environment, showing metrics such as revision names, replica ranges, resource allocations, and performance data. |

## Benefits

Azure Monitor Dashboards with Grafana for Container Apps provides the following benefits:

- **Integrated observability**: Access powerful visualizations directly in the Azure portal
- **Centralized monitoring**: View metrics for both individual apps and across your entire environment
- **Customizable views**: Modify dashboards to meet your specific monitoring requirements
- **Grafana compatibility**: Export and use dashboards with any Grafana instance
- **Secure sharing**: Use Azure role-based access control (RBAC) to control dashboard access across your team

## Prerequisites

- An Azure account with an active subscription
- An Azure Container Apps environment with deployed container apps
- Appropriate permissions to access the container apps and environment

## Access Grafana dashboards

You can access Grafana dashboards at either the environment or container app level:

### Access from a container app

1. In the [Azure portal](https://portal.azure.com), navigate to your container app.
1. In the left menu under **Monitoring**, select **Dashboards with Grafana**.
1. The prebuilt container app dashboard appears.

### Access from an environment

1. In the [Azure portal](https://portal.azure.com), navigate to your container app environment.
1. In the left menu under **Monitoring**, select **Dashboards with Grafana**.
1. The prebuilt environment dashboard appears.

## Next steps

- [Monitor Azure Container Apps](observability.md)
- [Learn about Azure Monitor Dashboards with Grafana](/azure/azure-monitor/visualize/visualize-use-grafana-dashboards)
