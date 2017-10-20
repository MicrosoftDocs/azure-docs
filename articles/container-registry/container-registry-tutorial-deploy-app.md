---
title: Azure Container Registry tutorial - Deploy web app from Azure Container Registry
description: Deploy a Linux-based web app using a container image from a geo-replicated Azure container registry. Part two of a three-part series.
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

# Deploy web app from Azure Container Registry

This is part two of a three-part tutorial series. In [part one](container-registry-tutorial-prepare-acr.md), a private, geo-replicated container registry was created, and a container image was built from source and pushed to the registry. In this article, you deploy the container into two Web App instances in two different Azure regions to take advantage of the network-close aspect of the geo-replicated registry.

If you haven't yet created a geo-replicated registry and pushed the image of the containerized sample application to the registry, return to the first tutorial in the series, [Prepare a geo-replicated Azure container registry](container-registry-tutorial-prepare-acr.md).

In this article, part two of the series, you:

> [!div class="checklist"]
> * Deploy an image to two Web App for Containers instances
> * Verify the deployed application

In the next part of the series, you update the application, then push a new container image to the registry to see geo-replication in action, viewing the change automatically reflected in both Web App instances.

## Automatic deployment to Web App for Containers

Azure Container Registry provides support for deploying containerized applications directly to [Web Apps for Containers](../app-service/containers/index.yml). In this tutorial, you use the Azure portal to deploy the container image created in previous tutorial to two web app plans located in different Azure regions.

When you deploy a web app from your registry, Azure Container Registry creates an image deployment [webhook](container-registry-webhook.md) for you. When you push a new image to your container repository, the webhook picks up the change and deploys the new container image to your web app. If your registry is geo-replicated, Web Apps for Containers pulls the new container image from the closest Azure region in which you've configured registry replicas.

## Configure first Web App for Containers instance

In this step, you create a Web App for Containers instance in the *West US* region.

Log in to the Azure portal at https://portal.azure.com and navigate to the registry you created in the previous tutorial.

Select **Repositories** > **acr-helloworld**, then right-click on the **v1** tag under **Tags** and select **Deploy to app service**.

![Deploy to app service in the Azure portal][deploy-app-portal-01]

Under **Web app on Linux (preview)** that's displayed, specify the following values for each setting:

| Setting | Value |
|---|---|
| **Site Name** | A globally unique name for the web app. In this example, we use the format `<acrName>-westus` to easily identify the registry and region the web app is deployed from. |
| **Resource Group** | **Use existing** > `myResourceGroup` |
| **App service plan/Location** | Create a new plan in the **West US** region. |
| **Image** | `acr-helloworld:v1`

Select **Create** to provision the web app.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-02]

## View the deployed web app

When deployment is complete, you can view the running application by navigating to its URL in your browser.

In the portal, select **App Services**, then the web app you provisioned in the previous step. In this example, the web app is named *uniqueregistryname-westus*.

Select the hyperlinked URL of the web app in the top-right of the App Service overview to open.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-04]

Select the hyperlinked URL of the web app in the top-right of the App Service overview to open.

Once the docker image is deployed, the site reflects an image representing the Azure Region hosting the Container Registry.

![DEPLOYED APP WESTUS][deployed-app-westus]

## Deploy second Azure App Service

Use the procedure outlined in the previous section to deploy a second web app to the *East US* region

Under **Web app on Linux (preview)** that's displayed, specify the following values for each setting:

| Setting | Value |
|---|---|
| **Site Name** | A globally unique name for the web app. In this example, we use the format `<acrName>-eastus` to easily identify the registry and region the web app is deployed from. |
| **Resource Group** | **Use existing** > `myResourceGroup` |
| **App service plan/Location** | Create a new plan in the **East US** region. |
| **Image** | `acr-helloworld:v1`

Select **Create** to provision the web app.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-06]

## View the configured App Service

Select App Services from the Azure portal

Find the App Service created: **ACR-Helloworld-EastUs**

In the top right of the overview tab, click the deployed URL to launch the newly created App Service

![App Service Url](media/container-registry-tutorial-geo/app-service-overview-url.png)

Once the docker image is deployed, the site reflects an image representing the Azure region hosting the Container Registry.

![App Service Url](media/container-registry-tutorial-geo/running-eastus.png)

## Next steps

In this tutorial, two Web App for Containers instances were provisioned from Azure Container Registry.

The following steps were completed:

> [!div class="checklist"]
> * Deployed an image to two Web App for Containers instances
> * Verified the deployed application

Advance to the next tutorial to deploy an updated container image to the container registry, and verify that the web apps in both regions are updated automatically.

> [!div class="nextstepaction"]
> [Deploy an update to replicated regions](./container-registry-tutorial-configure-geo-push-change.md)

<!-- IMAGES -->
[deploy-app-portal-01]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-01.png
[deploy-app-portal-02]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-02.png
[deploy-app-portal-03]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-03.png
[deploy-app-portal-04]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-04.png
[deploy-app-portal-05]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-05.png
[deploy-app-portal-06]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-06.png
[deploy-app-portal-07]: ./media/container-registry-tutorial-deploy-app/deploy-app-portal-07.png
[deployed-app-westus]: ./media/container-registry-tutorial-deploy-app/deployed-app-westus.png
[deployed-app-eastus]: ./media/container-registry-tutorial-deploy-app/deployed-app-eastus.png