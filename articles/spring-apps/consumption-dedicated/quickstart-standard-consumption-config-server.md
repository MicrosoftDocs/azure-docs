---
title: Quickstart - Enable and Disable Cloud Config Server in Azure Spring Apps
description: Learn how to enable and disable Spring Cloud Config Server in Azure Spring Apps.
author: KarlErickson
ms.author: CaihuaRui
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 08/29/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Quickstart: Enable and disable Spring Cloud Config Server in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Standard consumption and dedicated (Preview) ❎ Basic/Standard ❎ Enterprise

This article describes how to enable and disable Spring Cloud Config Server for service registration and discovery in Azure Spring Apps.
Spring Cloud Config Server is a centralized configuration service for distributed systems. Config Server uses a pluggable repository layer that currently supports local storage, Git, and Subversion. In this quickstart, you set up the Config Server to get data from a Git repository.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.
- [Git](https://git-scm.com/downloads).
- An Azure Spring Apps Standard consumption and dedicated plan service instance.

## Set up Config Server

Use the following command to set up Config Server with the project specified by the `--uri` parameter. This example uses the Git repository for Azure Spring Apps as an example project.

```azurecli
az spring config-server git set \
    --name <Azure-Spring-Apps-instance-name> \
    --uri https://github.com/Azure-Samples/azure-spring-apps-samples \
    --search-paths steeltoe-sample/config
```

> [!TIP]
> For information on using a private repository for Config Server, see [Configure a managed Spring Cloud Config Server in Azure Spring Apps](../basic-standard/how-to-config-server.md?pivots=sc-standard&toc=/azure/spring-apps/consumption-dedicated/toc.json&bc=/azure/spring-apps/consumption-dedicated/breadcrumb/toc.json).

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
