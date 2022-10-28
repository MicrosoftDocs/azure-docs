---
title: Start, stop, and delete an application in Azure Spring Apps | Microsoft Docs
description:  How to start, stop, and delete an application in Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 10/31/2019
ms.author: karler
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Start, stop, and delete an application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This guide explains how to change an application's state in Azure Spring Apps by using either the Azure portal or the Azure CLI.

## Using the Azure portal

After you deploy an application, you can start, stop, and delete it by using the Azure portal.

1. Go to your Azure Spring Apps service instance in the Azure portal.
1. Select the **Application Dashboard** tab.
1. Select the application whose state you want to change.
1. On the **Overview** page for that application, select **Start/Stop**, **Restart**, or **Delete**.

## Using the Azure CLI

> [!NOTE]
> You can use optional parameters and configure defaults with the Azure CLI. Learn more about the Azure CLI by reading [our reference documentation](/cli/azure/spring).

First, install the Azure Spring Apps extension for the Azure CLI as follows:

```azurecli
az extension add --name spring
```

Next, select any of these Azure CLI operations:

* To start your application:

    ```azurecli
    az spring app start -n <application name> -g <resource group> -s <Azure Spring Apps name>
    ```

* To stop your application:

    ```azurecli
    az spring app stop -n <application name> -g <resource group> -s <Azure Spring Apps name>
    ```

* To restart your application:

    ```azurecli
    az spring app restart -n <application name> -g <resource group> -s <Azure Spring Apps name>
    ```

* To delete your application:

    ```azurecli
    az spring app delete -n <application name> -g <resource group> -s <Azure Spring Apps name>
    ```
