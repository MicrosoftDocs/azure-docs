---
title: Continuous Deployment from a Docker container registry with Web App for Containers - Azure | Microsoft Docs
description: How to setup continuous deployment from a Docker container registry in Web App for Containers.
keywords: azure app service, linux, docker, acr,oss
services: app-service
documentationcenter: ''
author: ahmedelnably
manager: cfowler
editor: ''

ms.assetid: a47fb43a-bbbd-4751-bdc1-cd382eae49f8
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: aelnably;wesmc

---
# Continuous deployment with Web App for Containers

In this tutorial, you configure continuous deployment for a custom container image from Managed [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) repositories or [Docker Hub](https://hub.docker.com).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com)

## Enable container continuous deployment feature

You can enable the continuous deployment feature using [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and executing the following command

```azurecli-interactive
az webapp deployment container config -n sname -g rgname -e true
```

In the **[Azure portal](https://portal.azure.com/)**, click the **App Service** option on the left of the page.

Click on the name of your app that you want to configure Docker Hub continuous deployment for.

In the **App settings**, add an app setting called `DOCKER_ENABLE_CI` with the value `true`.

![insert image of app setting](./media/app-service-webapp-service-linux-ci-cd/step2.png)

## Prepare Webhook URL

You can obtain the Webhook URL using [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and executing the following command

```azurecli-interactive
az webapp deployment container show-cd-url -n sname1 -g rgname
```

For the Webhook URL, you need to have the following endpoint:
`https://<publishingusername>:<publishingpwd>@<sitename>.scm.azurewebsites.net/docker/hook`.

You can obtain your `publishingusername` and `publishingpwd` by downloading the web app publish profile using the Azure portal.

![insert image of adding webhook 2](./media/app-service-webapp-service-linux-ci-cd/step3-3.png)

## Add a web hook

### Azure Container Registry

In your registry portal blade, click **Webhooks**, create a new webhook by clicking **Add**. In the **Create webhook** blade, give your webhook a name. For the Webhook URI, you need to provide the URL obtained from **Step 3**

Make sure that you define the scope as the repo that contains your container image.

![insert image of webhook](./media/app-service-webapp-service-linux-ci-cd/step3ACRWebhook-1.png)

When the image gets updated, the web app get updated automatically with the new image.

### Docker Hub

In your Docker Hub page, click **Webhooks**, then **CREATE A WEBHOOK**.

![insert image of adding webhook 1](./media/app-service-webapp-service-linux-ci-cd/step3-1.png)

For the Webhook URL, you need to provide the URL obtained from **Step 3**

![insert image of adding webhook 2](./media/app-service-webapp-service-linux-ci-cd/step3-2.png)

When the image gets updated, the web app get updated automatically with the new image.

## Next steps

* [What is Azure App Service on Linux?](./app-service-linux-intro.md)
* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
* [Using .NET Core in Azure App Service on Linux](quickstart-dotnetcore.md)
* [Using Ruby in Azure App Service on Linux](quickstart-ruby.md)
* [How to use a custom Docker image for Web App for Containers](quickstart-custom-docker-image.md)
* [Azure App Service Web App for Containers FAQ](./app-service-linux-faq.md)
* [Manage Web App for Containers using Azure CLI 2.0](./app-service-linux-cli.md)