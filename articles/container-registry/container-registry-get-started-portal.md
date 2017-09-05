---
title: Quickstart - Create a private Docker registry in Azure | Microsoft Docs
description: Quickly learn to create a private Docker container registry with the Azure portal.
services: container-registry
documentationcenter: ''
author: mmacy
manager: timlt
editor: tysonn
tags: ''
keywords: ''

ms.assetid:
ms.service: container-registry
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/04/2017
ms.author: marsma
ms.custom:
---

# Create a Container Registry with the Azure portal

An Azure Container Registry is a private Docker registry in Azure where you can store and manage your private Docker container images. In this Quickstart, you create a Container Registry with the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Create a container registry

1. Select the **New** > **Containers** > **Azure Container Registry**.

   ![Creating a container registry in the Azure portal][qs-portal-01]

1. Select **Create** to start the configuration of your new container registry.

   ![Creating a container registry in the Azure portal][qs-portal-02]

1. Enter the following values in the **Registry name** and **Resource group** text boxes. Leave the other values at their defaults, then click **Create**.

   * **Registry name**: A unique name for your container registry. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
   * **Resource group**: `myResourceGroup`

   ![Creating a container registry in the Azure portal][qs-portal-03]

1. When the **Deployment succeeded** message appears, select the Container Registry in the portal, then select **Access keys**.

   ![Creating a container registry in the Azure portal][qs-portal-05]

1. Under **Admin user**, select **Enabled**. Take note of the following values:

   * Login server
   * Username
   * password

   You use these values in the following steps while working with your registry with the Docker CLI.

   ![Creating a container registry in the Azure portal][qs-portal-06]

## Pull an image from Docker hub

In order to push an image to your registry, you need to have one on your local machine.

## Push the image to Azure Container Registry

Now that you've pulled an image from Docker hub, you're ready to push it to your Azure Container Registry.

1. Tag image
1. Push image

## List the images in your container registry

1. List images
1. List tags

## Clean up resources

When no longer needed, delete the **myResourceGroup** resource group. Doing so will delete the resource group and all related resources, including the container registry you created earlier.

![Creating a container registry in the Azure portal][qs-portal-08]

## Next steps

In this Quickstart, you created an Azure Container Registy with the Azure portal. If you'd like to try building a container yourself, then deploy it to Azure Container Instances using your Azure Container Registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials](../container-instances/container-instances-tutorial-prepare-app.md)

<!-- IMAGES -->
[qs-portal-01]: ./media/container-registry-get-started-portal/qs-portal-01.png
[qs-portal-02]: ./media/container-registry-get-started-portal/qs-portal-02.png
[qs-portal-03]: ./media/container-registry-get-started-portal/qs-portal-03.png
[qs-portal-04]: ./media/container-registry-get-started-portal/qs-portal-04.png
[qs-portal-05]: ./media/container-registry-get-started-portal/qs-portal-05.png
[qs-portal-06]: ./media/container-registry-get-started-portal/qs-portal-06.png
[qs-portal-07]: ./media/container-registry-get-started-portal/qs-portal-07.png
[qs-portal-08]: ./media/container-registry-get-started-portal/qs-portal-08.png
[qs-portal-09]: ./media/container-registry-get-started-portal/qs-portal-09.png