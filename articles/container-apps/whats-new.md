---
title: What's new with Dapr in Azure Container Apps
description: Learn more about what's new with Dapr in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/26/2023
---

# What's new with Dapr in Azure Container Apps

This article lists significant updates to Dapr and how new features are available in Azure Container Apps.

## June 2023

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| [Stable Configuration API](https://docs.dapr.io/developing-applications/building-blocks/configuration/) | [Dapr integration with Azure Container Apps](./dapr-overview.md) | Dapr's Configuration API is now stable and supported in Azure Container Apps. |
| [Multi-app Run improved](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run) | [Multi-app Run logs](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run/multi-app-overview/#logs) | Use `dapr run -f .` to run multiple Dapr apps and see the app logs written to the console _and_ a local log file. |

## May 2023

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| [Easy component creation](./dapr-component-connection.md) | [Connect to Azure services via Dapr components in the Azure portal](./dapr-component-connection.md) | Service Connector teams up with Dapr to provide an improved component creation feature in the Azure Container Apps portal. | This feature makes it easier to configure and secure dependent Azure services to be used with Dapr APIs in the portal using the Service Connector feature. |


## Next steps

[Learn more about Dapr in Azure Container Apps.](./dapr-overview.md)