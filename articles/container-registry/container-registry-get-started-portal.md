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

Select the **New** > **Containers** > **Azure Container Registry**.

![Creating a container registry in the Azure portal][qs-portal-01]

Enter the following values in the **Registry name** and **Resource group** text boxes, and select the specified **SKU** from the drop-down. Leave the other values at their defaults, then click **Create**.

* **Registry name**: A unique name for your container registry. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
* **Resource group**: `myResourceGroup`
* **SKU**: Classic

   Azure Container Registry is available in several different SKUs. When deploying an ACR instance, choose a SKU that matches your image management needs. In this Quickstart, we select Classic due to its availability in all regions.

   | SKU | Description | Notes |
   |---|---|---|
   | Classic | Limited capability and images stored in an Azure Storage account. Avaliable in all regions. |
   | Basic | Advanced capabilities such as managed storage and Webhooks. Preview in limited regions. |
   | Standard | Advanced capabilities such as managed storage and Webhooks. Preview in limited regions. |
   | Premium | Advanced capabilities such as managed storage and Webhooks. Preview in limited regions.

![Creating a container registry in the Azure portal][qs-portal-03]

When the **Deployment succeeded** message appears, select the container registry in the portal, then select **Access keys**.

![Creating a container registry in the Azure portal][qs-portal-05]

Under **Admin user**, select **Enabled**. Take note of the following values:

* Login server
* Username
* password

You use these values in the following steps while working with your registry with the Docker CLI.

![Creating a container registry in the Azure portal][qs-portal-06]

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command. Replace the username, password, and login server values with those you noted from in the previous step.

```
docker login --username <username> --password <password> <login server>
```

The command returns a 'Login Succeeded' message once completed.

## Push image to ACR

To push an image to your Azure Container Registry, you must first have an image. If needed, run the following command to pull an existing image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

Before you push the image to your registry, you must tag the image with the ACR login server name. Tag the image using the [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) command. Replace *acrLoginServer* with the login server name of your ACR instance.

```
docker tag microsoft/aci-helloworld:v1 acrLoginServer/aci-helloworld:v1
```

Finally, use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the ACR instance. Replace *acrLoginServer* with the login server name of your ACR instance.

```
docker push acrLoginServer/aci-helloworld:v1
```

## List container images

To list the images in your ACR instance, navigate to your registry in the portal and select **Repositories**, then the repository you just created with `docker push`. The images in the repository appear under **TAGS**.

In this example, we select the **aci-helloworld** repository.

![Creating a container registry in the Azure portal][qs-portal-09]

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