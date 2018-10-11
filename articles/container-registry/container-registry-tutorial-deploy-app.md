---
title: Azure Container Registry tutorial - Deploy web app from Azure Container Registry
description: Deploy a Linux-based web app using a container image from a geo-replicated Azure container registry. Part two of a three-part series.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: tutorial
ms.date: 08/20/2018
ms.author: danlep
ms.custom: mvc
---

# Tutorial: Deploy web app from Azure Container Registry

This is part two in a three-part tutorial series. In [part one](container-registry-tutorial-prepare-registry.md), a private, geo-replicated container registry was created, and a container image was built from source and pushed to the registry. In this article, you take advantage of the network-close aspect of the geo-replicated registry by deploying the container to Web App instances in two different Azure regions. Each instance then pulls the container image from the closest registry.

In this tutorial, part two in the series:

> [!div class="checklist"]
> * Deploy a container image to two *Web Apps for Containers* instances
> * Verify the deployed application

If you haven't yet created a geo-replicated registry and pushed the image of the containerized sample application to the registry, return to the previous tutorial in the series, [Prepare a geo-replicated Azure container registry](container-registry-tutorial-prepare-registry.md).

In the next article in the series, you update the application, then push the updated container image to the registry. Finally, you browse to each running Web App instance to see the change automatically reflected in both, showing Azure Container Registry geo-replication and webhooks in action.

## Automatic deployment to Web Apps for Containers

Azure Container Registry provides support for deploying containerized applications directly to [Web Apps for Containers](../app-service/containers/index.yml). In this tutorial, you use the Azure portal to deploy the container image created in the previous tutorial to two web app plans located in different Azure regions.

When you deploy a web app from a container image in your registry, and you have a geo-replicated registry in the same region, Azure Container Registry creates an image deployment [webhook](container-registry-webhook.md) for you. When you push a new image to your container repository, the webhook picks up the change and automatically deploys the new container image to your web app.

## Deploy a Web App for Containers instance

In this step, you create a Web App for Containers instance in the *West US* region.

Sign in to the [Azure portal](https://portal.azure.com) and navigate to the registry you created in the previous tutorial.

Select **Repositories** > **acr-helloworld**, then right-click on the **v1** tag under **Tags** and select **Deploy to web app**:

![Deploy to app service in the Azure portal][deploy-app-portal-01]

If "Deploy to web app" is disabled, you might not have enabled the registry admin user as directed in [Create a container registry](container-registry-tutorial-prepare-registry.md#create-a-container-registry) in the first tutorial. You can enable the admin user in **Settings** > **Access keys** in the Azure portal.

Under **Web App for Containers** that's displayed after you select "Deploy to web app," specify the following values for each setting:

| Setting | Value |
|---|---|
| **Site Name** | A globally unique name for the web app. In this example, we use the format `<acrName>-westus` to easily identify the registry and region the web app is deployed from. |
| **Resource Group** | **Use existing** > `myResourceGroup` |
| **App service plan/Location** | Create a new plan named `plan-westus` in the **West US** region. |
| **Image** | `acr-helloworld:v1`

Select **Create** to provision the web app to the *West US* region.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-02]

## View the deployed web app

When deployment is complete, you can view the running application by navigating to its URL in your browser.

In the portal, select **App Services**, then the web app you provisioned in the previous step. In this example, the web app is named *uniqueregistryname-westus*.

Select the hyperlinked URL of the web app in the top-right of the **App Service** overview to view the running application in your browser.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-04]

Once the Docker image is deployed from your geo-replicated container registry, the site displays an image representing the Azure region hosting the container registry.

![Deployed web application viewed in a browser][deployed-app-westus]

## Deploy second Web App for Containers instance

Use the procedure outlined in the previous section to deploy a second web app to the *East US* region. Under **Web App for Containers**, specify the following values:

| Setting | Value |
|---|---|
| **Site Name** | A globally unique name for the web app. In this example, we use the format `<acrName>-eastus` to easily identify the registry and region the web app is deployed from. |
| **Resource Group** | **Use existing** > `myResourceGroup` |
| **App service plan/Location** | Create a new plan named `plan-eastus` in the **East US** region. |
| **Image** | `acr-helloworld:v1`

Select **Create** to provision the web app to the *East US* region.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-06]

## View the deployed web app

As before, you can view the running application by navigating to its URL in your browser.

In the portal, select **App Services**, then the web app you provisioned in the previous step. In this example, the web app is named *uniqueregistryname-eastus*.

Select the hyperlinked URL of the web app in the top-right of the **App Service overview** to view the running application in your browser.

![Web app on Linux configuration in the Azure portal][deploy-app-portal-07]

Once the Docker image is deployed from your geo-replicated container registry, the site displays an image representing the Azure region hosting the container registry.

![Deployed web application viewed in a browser][deployed-app-eastus]

## Next steps

In this tutorial, you deployed two Web App for Containers instances from a geo-replicated Azure container registry.

Advance to the next tutorial to update and then deploy a new container image to the container registry, then verify that the web apps running in both regions were updated automatically.

> [!div class="nextstepaction"]
> [Deploy an update to geo-replicated container image](./container-registry-tutorial-deploy-update.md)

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