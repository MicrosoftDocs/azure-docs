---
title: Supported Azure resource types
titleSuffix: Azure Load Testing
description: 'Learn which Azure resource types are supported for server-side monitoring in Azure Load Testing. You can select specific metrics to be monitored during a load test.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 01/04/2022
---

# Supported Azure resource types for monitoring in Azure Load Testing Preview

Learn which Azure resource types Azure Load Testing Preview supports for server-side monitoring. You can select specific metrics for each resource type to track and report on for a load test.

To learn how to configure your load test, see [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Supported Azure resource types

This section lists the Azure resource types that Azure Load Testing supports for server-side monitoring.

* Azure API Management
* Azure App Service
* Azure App Service plan
* Azure Application Insights
* Azure Cache for Redis
* Azure Cosmos DB
* Azure Database for MariaDB server
* Azure Database for MySQL server
* Azure Database for PostgreSQL server
* Azure Functions function app
* Azure Kubernetes Service (AKS)
* Azure SQL Database
* Azure SQL elastic pool
* Azure SQL Managed Instance
* Event Hubs cluster
* Event Hubs namespace
* Key Vault
* Service Bus
* Static Web Apps
* Storage Accounts: Azure Blog Storage/Azure Files/Azure Table Storage/Queue Storage
* Storage Accounts (classic): Azure Files/Azure Table Storage/Queue Storage
* Traffic Manager profile
* Virtual Machine Scale Sets
* Virtual Machines

## Next steps

* Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
* Learn how to [Get more insights from App Service diagnostics](./how-to-appservice-insights.md).
* Learn how to [Compare multiple test runs](./how-to-compare-multiple-test-runs.md).
