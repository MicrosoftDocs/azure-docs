---
title: Azure Container Registry tutorial - Deploy Web App from Azure Container Registry
description: Deploy a Linux-based Web App using a container image from a geo-replicated Azure container registry. Part two of a three-part series.
services: container-registry
documentationcenter: ''
author: mmacy
manager: timlt
editor: neilpeterson
tags: acr, azure-container-registry, geo-replication
keywords: Docker, Containers, Registry, Azure

ms.service: container-registry
ms.devlang:
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/31/2017
ms.author: marsma
ms.custom:
---

# Deploy Web App from Azure Container Registry

This is part two of a three-part tutorial series. In [part one](container-registry-tutorial-prepare-acr.md), a private, geo-replicated container registry was created, and a container image was built from source and pushed to the registry. In this article, you deploy the container into two Web App instances in two different Azure regions to take advantage of the network-close aspect of the geo-replicated registry.

If you haven't yet created a geo-replicated registry and pushed the image of the containerized sample application to the registry, return to the first tutorial in the series, [Prepare a geo-replicated Azure container registry](container-registry-tutorial-prepare-acr.md).

In this article, part two of the series, you:

> [!div class="checklist"]
> * Deploy an image to Azure App Service
> * View the application
> * Deploy a secondary Azure App Service
> * View the application

In the next part of the series, you update the application, then push a new container image to the registry to see geo-replication in action, viewing the change automatically reflected in both Web App instances.

## Deploy to Azure App Services

To aide in the automated update, we configure App Service from the ACR repository listing, which will configure the App Service with a Webhook, triggering automated deployments.

From the Azure portal, browse to Container registries.
Select the registry from the previous step.
Select **Repositories** to view the image pushed from the previous step.
You should see the **acr-helloworld**.

Click the image to see the list of image tags.

Right-click on the **latest** tag to view the deployment options:

![Tag Deployment Options](media/container-registry-tutorial-geo/tag-deployment-options.png)

Choose **Deploy to app service**

| Parameter | Value |
|---|---|
| **Site Name**: | Represents the unique URL. `<acrname>-WestUS` |
| **Resource Group:** | `ACR-Helloworld-WestUS` |
| **App service plan/location:** | Select or create a plan in the same location of the previously created registry, keeping the deployment network-close to the registry. |
| **Image:** | `acr-helloworld:latest`

Click **Create** to provision the App

![Configure App Service](media/container-registry-tutorial-geo/configure-app-service-westus.png)


## View the configured App Service

Select App Services from the Azure portal

Find the App Service created: **ACR-Helloworld-WestUs**

In the top right of the overview tab, click the deployed URL to launch the newly created App Service

![App Service Url](media/container-registry-tutorial-geo/app-service-overview-url.png)

Once the docker image is deployed, the site reflects an image representing the Azure Region hosting the Container Registry.

![App Service Url](media/container-registry-tutorial-geo/running-westus.png)

## Deploy second Azure App Service

The acr-helloworld image displays the region where the image was retrieved.
To see the results of a geo-replicated registry, deploy a second App Service.

Select **Repositories** to view the `acr-helloworld` image.

Click the image to see the list of image tags.

Right-click on the **latest** tag to view the deployment options:

![Tag Deployment Options](media/container-registry-tutorial-geo/tag-deployment-options.png)

Choose **Deploy to app service**

| Parameter | Value |
|---|---|
| **Site Name**: | Represents the unique URL. `<acrname>-EastUS` |
| **Resource Group:** | `ACR-Helloworld-EastUS` |
| **App service plan/location:** | Select or create a plan in the same location of the previously created registry, keeping the deployment network-close to the registry. |
| **Image:** | `acr-helloworld:latest`

Click **Create** to provision the App

![Configure App Service](media/container-registry-tutorial-geo/configure-app-service-eastus.png)

## View the configured App Service

Select App Services from the Azure portal

Find the App Service created: **ACR-Helloworld-EastUs**

In the top right of the overview tab, click the deployed URL to launch the newly created App Service

![App Service Url](media/container-registry-tutorial-geo/app-service-overview-url.png)

Once the docker image is deployed, the site reflects an image representing the Azure region hosting the Container Registry.

![App Service Url](media/container-registry-tutorial-geo/running-eastus.png)

## Next steps

In this tutorial, an App Service was provisioned from the Container Registry to two regions. ACR was geo-replicated, enabling network-close image deployment.

The following steps were completed:

> [!div class="checklist"]
> * Deployed two Azure App Services, with webhooks for automated updates
> * ACR was geo-replicated between East US and West US Regions
> * The two regions viewed in the browser to confirm each App Service was served from a local registry replica

Advance to the next tutorial to deploy a change to both regions.

> [!div class="nextstepaction"]
> [Deploy an update to replicated regions](./container-registry-tutorial-configure-geo-push-change.md)
