---
title:  Enable and disable Eureka Server in Azure Spring Apps
description: Learn how to enable and disable Eureka Server in Azure Spring Apps
author: karlerickson
ms.author: CaihuaRui
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/15/2023
ms.custom: devx-track-java
---

# Enable and disable Eureka Server in Azure Spring Apps

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

Service registration and discovery are key requirements for maintaining a list of live app instances to call, and routing and load balancing inbound requests. Configuring each client manually takes time and introduces the possibility of human error.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- [Git](https://git-scm.com/downloads).
- Completion of the previous quickstart in this series: [Provision Standard Consumption Azure Spring Apps service](./quickstart-provision-standard-consumption-service-instance.md).

## Manage Eureka Server

Use the steps in this section to manage Eureka Server.

### Enable the Eureka Server

Use the following command to enable Eureka server:

```azurecli
az spring eureka-server enable \
    -resource-group <resource-group-name> \
    -name <Azure-Spring-Apps-instance-name>
```

### Disable the Eureka Server

Use the following command to disable Eureka server.

```azurecli
az spring eureka-server disable
    -resource-group <resource-group-name> \
    -name <Azure-Spring-Apps-instance-name>
```

## Next steps

> [!div class="nextstepaction"]
> [Discover and register your Spring Boot applications in Azure Spring Apps](how-to-service-registration.md)
