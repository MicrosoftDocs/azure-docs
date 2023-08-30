---
title: What's new in Azure Container Apps
titleSuffix: Azure Container Apps
description: Learn more about what's new in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/30/2023
# Customer Intent: As an Azure Container Apps user, I'd like to know about new and improved features in Azure Container Apps. 
---

# What's new in Azure Container Apps

This article lists significant updates and new features available in Azure Container Apps.

## Dapr

Learn about new and updated Dapr features available in Azure Container Apps.

### August 2023 

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| [Stable Configuration API](https://docs.dapr.io/developing-applications/building-blocks/configuration/) | [Dapr integration with Azure Container Apps](./dapr-overview.md) | Dapr's Configuration API is now stable and supported in Azure Container Apps. |

### June 2023

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| [Multi-app Run improved](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run) | [Multi-app Run logs](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run/multi-app-overview/#logs) | Use `dapr run -f .` to run multiple Dapr apps and see the app logs written to the console _and_ a local log file. |

### May 2023

| Feature | Documentation | Description |
| ------- | ------------- | ----------- |
| [Easy component creation](./dapr-component-connection.md) | [Connect to Azure services via Dapr components in the Azure portal](./dapr-component-connection.md) | This feature makes it easier to configure and secure dependent Azure services to be used with Dapr APIs in the portal using the Service Connector feature. |


## Next steps

[Learn more about Dapr in Azure Container Apps.](./dapr-overview.md)