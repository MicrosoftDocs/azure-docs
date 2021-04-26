---
title: Start, stop, and delete your Azure Spring Cloud application | Microsoft Docs
description:  How to start, stop, and delete your Azure Spring Cloud application
author: bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/31/2019
ms.author: brendm
ms.custom: devx-track-java, devx-track-azurecli
---

# Start, stop, and delete your Azure Spring Cloud application

**This article applies to:** ✔️ Java ✔️ C#

This guide explains how to change an application's state in Azure Spring Cloud by using either the Azure portal or the Azure CLI.

## Using the Azure portal

After you deploy an application, you can start, stop, and delete it by using the Azure portal.

1. Go to your Azure Spring Cloud service instance in the Azure portal.
1. Select the **Application Dashboard** tab.
1. Select the application whose state you want to change.
1. On the **Overview** page for that application, select **Start/Stop**, **Restart**, or **Delete**.

## Using the Azure CLI

> [!NOTE]
> You can use optional parameters and configure defaults with the Azure CLI. Learn more about the Azure CLI by reading [our reference documentation](/cli/azure/spring-cloud).  

First, install the Azure Spring Cloud extension for the Azure CLI as follows:

```azurecli
az extension add --name spring-cloud
```

Next, select any of these Azure CLI operations:

* To start your application:

    ```azurecli
    az spring-cloud app start -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

* To stop your application:

    ```azurecli
    az spring-cloud app stop -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

* To restart your application:

    ```azurecli
    az spring-cloud app restart -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

* To delete your application:

    ```azurecli
    az spring-cloud app delete -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```
