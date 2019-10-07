---
title: How to start, stop, and delete your Azure Spring Cloud application | Microsoft Docs
description:  How to start, stop, and delete your Azure Spring Cloud application
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---
# How to start, stop, and delete your Azure Spring Cloud application

This is a simple guide on how to change the state of an application in Azure Spring Cloud via both the Azure portal and CLI.

## Using the Azure portal

Once you have an application deployed, you can **Start**, **Stop**, and **Delete** it via the Azure portal.

1. Go to your Azure Spring Cloud service instance in the Azure portal
1. Click on the **Application Dashboard** tab.
1. Click on the application you want to change the state of.
1. In the **Overview** page for that application, there is a **Start/Stop**, a **Restart** button, and a **Delete** button at the top of the page. Click the buttons to change the application's state.

## Using the Azure CLI

> [!NOTE]
> You can use optional parameters and configure defaults with the Azure CLI. Find out more at the [reference documentation](spring-cloud-cli-reference.md).

- To start your application:
    ```Azure CLI
    az spring-cloud app start -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

- To stop your application:
    ```Azure CLI
    az spring-cloud app stop -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

- To restart your application:
    ```Azure CLI
    az spring-cloud app restart -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```

- To delete your application:
    ```Azure CLI
    az spring-cloud app delete -n <application name> -g <resource group> -s <Azure Spring Cloud name>
    ```
