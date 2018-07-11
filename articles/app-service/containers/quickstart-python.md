---
title: Deploy a Python app in Azure Web App for Containers
description: How to deploy a Docker image running a Python application to Web App for Containers.
keywords: azure app service, web app, python, docker, container
services: app-service
author: cephalin 
manager: jeconnoc

ms.service: app-service
ms.devlang: python
ms.topic: quickstart
ms.date: 07/11/2018
ms.author: cephalin
ms.custom: mvc
---

# Deploy a Python web app in Web App for Containers

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This quickstart shows how to create a web app and deploy a Python app from a custom image in Docker Hub. You create the web app using the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli).

![Sample app running in Azure](TODO)

> [!NOTE]
> To learn how to deploy your own Python application to Azure, see [Flask quickstart using Azure Container Registry](https://github.com/qubitron/flask-webapp-quickstart).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)]

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)]

## Create a web app

Create a [web app](../app-service-web-overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace `<app name>` with a globally unique app name.

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app name> --deployment-container-image-name TODO
```

In the preceding command, `--deployment-container-image-name` points to the public Docker Hub image [TODO](https://hub.docker.com/r/microsoft/TODO/).

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app name>.azurewebsites.net",
  "deploymentLocalGitUrl": "https://<username>@<app name>.scm.azurewebsites.net/<app name>.git",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

## Browse to the app

```bash
http://<app_name>.azurewebsites.net/
```

![Sample app running in Azure](TODO)

**Congratulations!** You've deployed a custom Docker image running a Python application to Web App for Containers.

## Use a private image

This quickstart deploys a public image from Docker Hub. You can also [deploy a private image from Docker Hub](tutorial-custom-docker-image.md#use-a-private-image-from-docker-hub-optional) or [deploy an image from a private registry like Azure Container Registry](tutorial-custom-docker-image.md#use-a-docker-image-from-any-private-registry-optional).

[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Python with PostgreSQL](tutorial-docker-python-postgresql-app.md)
