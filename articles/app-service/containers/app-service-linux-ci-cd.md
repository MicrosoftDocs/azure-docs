---
title: Continuous deployment from a Docker container registry with Web App for Containers - Azure | Microsoft Docs
description: How to set up continuous deployment from a Docker container registry in Web App for Containers.
keywords: azure app service, linux, docker, acr,oss
services: app-service
documentationcenter: ''
author: msangapu
manager: jeconnoc
editor: ''

ms.assetid: a47fb43a-bbbd-4751-bdc1-cd382eae49f8
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2018
ms.author: msangapu

---
# Continuous deployment with Web App for Containers

In this tutorial, you configure continuous deployment for a custom container image from managed [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) repositories or [Docker Hub](https://hub.docker.com).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable the continuous deployment feature

Enable the continuous deployment feature by using [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and executing the following command:

```azurecli-interactive
az webapp deployment container config --name name --resource-group myResourceGroup --enable-cd true
```

In the [Azure portal](https://portal.azure.com/), select the **App Service** option on the left side of the page.

Select the name of the app for which you want to configure Docker Hub continuous deployment.

On the **Container Settings** page, select **On**, and then select **Save** to enable continuous deployment.

![Screenshot of app setting](./media/app-service-webapp-service-linux-ci-cd/step2.png)

## Prepare the webhook URL

Obtain the webhook URL by using [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and executing the following command:

```azurecli-interactive
az webapp deployment container show-cd-url --name sname1 --resource-group rgname
```

Make a note of the webhook URL. You'll need it in the next section.
`https://<publishingusername>:<publishingpwd>@<sitename>.scm.azurewebsites.net/docker/hook`.

You can obtain your `publishingusername` and `publishingpwd` by downloading the web app publish profile using the Azure portal.

![Screenshot of adding webhook 2](./media/app-service-webapp-service-linux-ci-cd/step3-3.png)

## Add a webhook

To add a webhook, follow the steps in these guides:

- [Azure Container Registry](../../container-registry/container-registry-webhook.md) using the webhook URL
- [Webhooks for Docker Hub](https://docs.docker.com/docker-hub/webhooks/)

## Next steps

* [Introduction to Azure App Service on Linux](./app-service-linux-intro.md)
* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
* [Create a .NET Core web app in App Service on Linux](quickstart-dotnetcore.md)
* [Create a Ruby web app in App Service on Linux](quickstart-ruby.md)
* [Deploy a Docker/Go web app in Web App for Containers](quickstart-docker-go.md)
* [Azure App Service on Linux FAQ](./app-service-linux-faq.md)
* [Manage Web App for Containers using Azure CLI](./app-service-linux-cli.md)
