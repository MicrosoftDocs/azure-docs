---
title: Quickstart - Enable and disable Cloud Config Server in Azure Spring Apps
description: Learn how to enable and disable Spring Cloud Config Server in Azure Spring Apps.
author: KarlErickson
ms.author: CaihuaRui
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.custom: devx-track-java, devx-track-extended-java
---

# Quickstart: Enable and disable Spring Cloud Config Server in Azure Spring Apps

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article describes how to enable and disable Spring Cloud Config Server for service registration and discovery in Azure Spring Apps.
Spring Cloud Config Server is a centralized configuration service for distributed systems. Config Server uses a pluggable repository layer that currently supports local storage, Git, and Subversion. In this quickstart, you set up the Config Server to get data from a Git repository.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.
- [Git](https://git-scm.com/downloads).
- The completion of [Quickstart: Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](./quickstart-provision-standard-consumption-service-instance.md).

## Set up Config Server

Use the following command to set up Config Server with the project specified by the `--uri` parameter. This example uses the Git repository for Azure Spring Apps as an example project.

```azurecli
az spring config-server git set \
    --name <Azure-Spring-Apps-instance-name> \
    --uri https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples \
    --search-paths steeltoe-sample/config
```

> [!TIP]
> For information on using a private repository for Config Server, see [Configure a managed Spring Cloud Config Server in Azure Spring Apps](./how-to-config-server.md).

## Enable Config Server

Use the following command to enable Config Server:

```azurecli
az spring config-server enable \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-name>
```

## Disable Config Server

Use the following command to disable Config Server:

```azurecli
az spring config-server disable \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-instance-name>
```

## Next steps

- [Enable and disable Eureka Server in Azure Spring Apps](quickstart-standard-consumption-eureka-server.md)
