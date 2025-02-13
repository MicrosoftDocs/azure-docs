---
title: Quickstart - Enable and Disable Eureka Server in Azure Spring Apps
description: Learn how to enable and disable Eureka Server in Azure Spring Apps.
author: KarlErickson
ms.author: CaihuaRui
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 08/29/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Quickstart: Enable and disable Eureka Server in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Standard consumption and dedicated (Preview) ❎ Basic/Standard ❎ Enterprise

This article describes how to enable and disable Eureka Server for service registration and discovery in Azure Spring Apps. Service registration and discovery are key requirements for maintaining a list of live app instances to call, and for routing and load balancing inbound requests. Configuring each client manually takes time and introduces the possibility of human error.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.
- [Git](https://git-scm.com/downloads).
- An Azure Spring Apps Standard consumption and dedicated plan service instance.

## Enable the Eureka Server

Use the following command to enable Eureka server:

```azurecli
az spring eureka-server enable \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-name>
```

## Disable the Eureka Server

Use the following command to disable Eureka server:

```azurecli
az spring eureka-server disable
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-name>
```

## Next steps

> [!div class="nextstepaction"]
> [Discover and register your Spring Boot applications in Azure Spring Apps](../basic-standard/how-to-service-registration.md?toc=/azure/spring-apps/consumption-dedicated/toc.json&bc=/azure/spring-apps/consumption-dedicated/breadcrumb/toc.json)
