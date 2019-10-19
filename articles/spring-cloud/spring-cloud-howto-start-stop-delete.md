---
title: How to start, stop, and delete your Azure Spring Cloud application | Microsoft Docs
description:  How to start, stop, and delete your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/07/2019
ms.author: v-vasuke

---
# How to start, stop, and delete your Azure Spring Cloud application

This guide explains how to change the state of an application in Azure Spring Cloud using either the Azure portal or CLI.

## Using the Azure portal

Once you have an application deployed, you can **Start**, **Stop**, and **Delete** it using the Azure portal.

1. Go to your Azure Spring Cloud service instance in the Azure portal.
1. Select the **Application Dashboard** tab.
1. Select the application whose state you want to change.
2. In the **Overview** page for that application, find buttons to **Start/Stop**, **Restart**, and **Delete** the application.

## Using the Azure CLI

> [!NOTE]
> You can use optional parameters and configure defaults with the Azure CLI. Learn more about by reading our [reference documentation](spring-cloud-cli-reference.md).

* To start your application:
    ```Azure CLI
    az spring-cloud app start -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

* To stop your application:
    ```Azure CLI
    az spring-cloud app stop -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

* To restart your application:
    ```Azure CLI
    az spring-cloud app restart -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

* To delete your application:
    ```Azure CLI
    az spring-cloud app delete -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```
