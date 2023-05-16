---
title: Enable and disable Cloud Config Server in Azure Spring Apps
description: Learn how to enable and disable Spring Cloud Config Server in Azure Spring Apps
author: karlerickson
ms.author: CaihuaRui
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/15/2023
ms.custom: devx-track-java
---

# Enable and disable Spring Cloud Config Server in Azure Spring Apps

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

Spring Cloud Config Server is a centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion. In this quickstart, you set up the Config Server to get data from a Git repository.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- [Git](https://git-scm.com/downloads).
- Completion of the previous quickstart in this series: [Provision Standard Consumption Azure Spring Apps service](./quickstart-provision-standard-consumption-service-instance.md).

## Manage Config Server

Use the steps in this section to manage Config Server.

### Set Config Server

Use the following command to set Config Server with the project specified by the `--uri` parameter. This example uses the Git repository for Azure Spring Apps as an example project.

```azurecli
az spring config-server git set \
    -name <Azure-Spring-Apps-instance> \
    --uri https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples \
    --search-paths steeltoe-sample/config
```

> [!TIP]
> For information on using a private repository for Config Server, see [Configure a managed Spring Cloud Config Server in Azure Spring Apps](./how-to-config-server.md).

### Enable Config Server

Use the following command to enable Config Server:

```azurecli
az spring config-server enable \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-nae>
```

### Disable Config Server

Use the following command to enable Config Server:

```azurecli
az spring config-server enable \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-nae>
```

## Next steps

- [Enable and disable Eureka Server in Azure Spring Apps](quickstart-standard-consumption-eureka-server.md)
