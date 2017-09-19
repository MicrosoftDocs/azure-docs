---
title: Quickstart - Create your first Azure Container Instances container with the Azure portal
description: Deploy and get started with Azure Container Instances
services: container-instances
documentationcenter: ''
author: mmacy
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid:
ms.service: container-instances
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/20/2017
ms.author: marsma
ms.custom:
---

# Create your first container in Azure Container Instances

Azure Container Instances makes it easy to create and manage containers in Azure. In this quick start, you will create a container in Azure and expose it to the internet with a public IP address. This operation is completed by using the Azure portal. With just a few clicks, you will see this in your browser:

![App deployed using Azure Container Instances viewed in browser][aci-app-browser]

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Create a container instance

Select the **New** > **Containers** > **Azure Container Instances (preview)**.

![Creating a container instance in the Azure portal][aci-portal-01]

Enter the following values in the **Container name**, **Container image**, and **Resource group** text boxes. Leave the other values at their defaults, then click **OK**.

* Container name: `mycontainer`
* Container image: `microsoft/aci-helloworld`
* Resource group: `myResourceGroup`

![Creating a container instance in the Azure portal][aci-portal-03]

Under **Configuration**, leave all settings at their defaults and click **OK** to validate the configuration.

![Creating a container instance in the Azure portal][aci-portal-04]

When the validation completes, you are shown a summary of your container settings. Select **OK** to submit your container deployment request.

![Creating a container instance in the Azure portal][aci-portal-05]

When deployment starts, a tile is placed on your portal dashboard indicating deployment progress. Once deployment completes, the tile is updated to show your new **mycontainer-myc1** container group.

![Creating a container instance in the Azure portal][aci-portal-08]

Select the **mycontainer-myc1** container group to display the container group properties. Take note of the **Ip address** of the container group, as well as the **STATE** of your container.

![Creating a container instance in the Azure portal][aci-portal-06]

Once the container moves to the **Running** state, navigate to the IP address you noted in the previous step to display the application hosted in your new container.

![App deployed using Azure Container Instances viewed in browser][aci-app-browser]

<!-- IMAGES -->
[aci-portal-01]: ./media/container-instances-quickstart-portal/qs-portal-01.png
[aci-portal-02]: ./media/container-instances-quickstart-portal/qs-portal-02.png
[aci-portal-03]: ./media/container-instances-quickstart-portal/qs-portal-03.png
[aci-portal-04]: ./media/container-instances-quickstart-portal/qs-portal-04.png
[aci-portal-05]: ./media/container-instances-quickstart-portal/qs-portal-05.png
[aci-portal-06]: ./media/container-instances-quickstart-portal/qs-portal-06.png
[aci-app-browser]: ./media/container-instances-quickstart-portal/qs-portal-07.png
[aci-portal-08]: ./media/container-instances-quickstart-portal/qs-portal-08.png

## Next steps

In this Quickstart, you created an Azure Container Instance from an image in a public Docker Hub repository. If you'd like to try building a container yourself and deploy it to Azure Container Instances using the Azure Container Registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials](./container-instances-tutorial-prepare-app.md)