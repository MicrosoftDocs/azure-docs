---
title: CI/CD to custom Linux containers
description: Learn how to set up continuous deployment to a custom Linux container in Azure App Service. Continuous deployment is supported for Docker Hub and ACR.
keywords: azure app service, linux, docker, acr,oss
author: msangapu-msft

ms.assetid: a47fb43a-bbbd-4751-bdc1-cd382eae49f8
ms.topic: article
ms.date: 11/08/2018
ms.author: msangapu
ms.custom: seodec18

---
# Continuous deployment with Web App for Containers

In this tutorial, you configure continuous deployment for a custom container image from managed [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) repositories or [Docker Hub](https://hub.docker.com).

## Enable continuous deployment with ACR

![Screenshot of ACR webhook](./media/deploy-ci-cd-custom-container/ci-cd-acr-02.png)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the **App Service** option on the left side of the page.
3. Select the name of the app for which you want to configure continuous deployment.
4. On the **Container Settings** page, select **Single Container**
5. Select **Azure Container Registry**
6. Select **Continuous Deployment > On**
7. Select **Save** to enable continuous deployment.

## Use the ACR webhook

Once Continuous Deployment has been enabled, you can view the newly created webhook on your Azure Container Registry webhooks page.

![Screenshot of ACR webhook](./media/deploy-ci-cd-custom-container/ci-cd-acr-03.png)

In your Container Registry, click on Webhooks to view the current webhooks.

## Enable continuous deployment with Docker Hub (optional)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the **App Service** option on the left side of the page.
3. Select the name of the app for which you want to configure continuous deployment.
4. On the **Container Settings** page, select **Single Container**
5. Select **Docker Hub**
6. Select **Continuous Deployment > On**
7. Select **Save** to enable continuous deployment.

![Screenshot of app setting](./media/deploy-ci-cd-custom-container/ci-cd-docker-02.png)

Copy the Webhook URL. To add a webhook for Docker Hub, follow <a href="https://docs.docker.com/docker-hub/webhooks/" target="_blank">webhooks for Docker Hub</a>.

## Next steps

* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
* [Create a .NET Core web app in App Service on Linux](containers/quickstart-dotnetcore.md)
* [Create a Ruby web app in App Service on Linux](quickstart-ruby.md)
* [Deploy a Docker web app in Web App for Containers](containers/quickstart-docker-go.md)
* [App Service on Linux FAQ](faq-app-service-linux.md)
* [Manage Web App for Containers using Azure CLI](containers/app-service-linux-cli.md)
