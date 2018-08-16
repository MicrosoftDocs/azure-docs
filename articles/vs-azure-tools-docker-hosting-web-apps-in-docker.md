---
title: Deploy an ASP.NET Docker container to Azure Container Registry (ACR) | Microsoft Docs
description: Learn how to use Visual Studio Tools for Docker to deploy an ASP.NET Core web app to a container registry
services: azure-container-service
documentationcenter: .net
author: mlearned
manager: douge
editor: ''

ms.assetid: e5e81c5e-dd18-4d5a-a24d-a932036e78b9
ms.service: azure-container-service
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/21/2018
ms.author: mlearned

---
# Deploy an ASP.NET container to a container registry using Visual Studio
## Overview
Docker is a lightweight container engine, similar in some ways to a virtual machine, which you can use to host applications and services.
This tutorial walks you through using Visual Studio to publish your containerized application to an [Azure Container Registry](https://azure.microsoft.com/services/container-registry).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/dotnet/?utm_source=acr-publish-doc&utm_medium=docs&utm_campaign=docs) before you begin.

## Prerequisites
To complete this tutorial:

* Install the latest version of [Visual Studio 2017](https://azure.microsoft.com/downloads/) with the "ASP.NET and web development" workload
* Install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

## 1. Create an ASP.NET Core web app
The following steps guide you through creating a basic ASP.NET Core app that will be used in this tutorial.

[!INCLUDE [create-aspnet5-app](../includes/create-aspnet5-app.md)]

## 2. Publish your container to Azure Container Registry
1. Right-click your project in **Solution Explorer** and choose **Publish**.
2. On the publish target dialog, select the **Container Registry** tab.
3. Choose **New Azure Container Registry** and click **Publish**.
4. Fill in your desired values in the **Create a new Azure Container Registry**.

    | Setting      | Suggested value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **DNS Prefix** | Globally unique name | Name that uniquely identifies your container registry. |
    | **Subscription** | Choose your subscription | The Azure subscription to use. |
    | **[Resource Group](../articles/azure-resource-manager/resource-group-overview.md)** | myResourceGroup |  Name of the resource group in which to create your container registry. Choose **New** to create a new resource group.|
    | **[SKU](https://docs.microsoft.com/azure/container-registry/container-registry-skus)** | Standard | Service tier of the container registry  |
    | **Registry Location** | A location close to you | Choose a Location in a [region](https://azure.microsoft.com/regions/) near you or near other services that will use your container registry. |
    ![Visual Studio's create Azure Container Registry dialog][0]
5. Click **Create**

You can now pull the container from the registry to any host capable of running Docker images, for example [Azure Container Instances](./container-instances/container-instances-tutorial-deploy-app.md).

[0]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/vs-acr-provisioning-dialog.png
