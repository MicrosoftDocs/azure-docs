---
title: Create Docker/Go app
description: How to deploy a Docker image running a Go application for Azure Web Apps for Containers.
keywords: azure app service, web app, go, docker, container
services: app-service
author: msangapu 
manager: cfowler

ms.assetid: b97bd4e6-dff0-4976-ac20-d5c109a559a8
ms.service: app-service
ms.devlang: go
ms.topic: quickstart
ms.date: 01/17/2018
ms.author: msangapu
ms.custom: mvc
---

# Deploy a Go App in Azure Web App for Containers

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service. This quickstart shows how to take a Docker image with a Go application and run it on Azure App Service. You create the web app using the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli).


[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Understanding of Docker and Docker images
* Understanding of Go Programming Language

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group.md)]

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)]

## Create a Web App for the Container

Create a [web app](../app-service-web-overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace `<app name>` with a globally unique app name.

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app name> --deployment-container-image-name microsoft/appservice-go-quickstart
```

In the preceding command, `--deployment-container-image-name` points to the public Docker Hub image [microsoft/appservice-go-quickstart](https://hub.docker.com/r/microsoft/appservice-go-quickstart).

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

## Get data from the app's endpoint

Using the `curl` command, contact the REST API endpoint provided by the container's application.

```bash
curl -X GET http://<app_name>.azurewebsites.net:8080/hello
```

```output
Hello world!
```

**Congratulations!** You've deployed a custom Docker image running a Go application to Web Apps for Containers.

## Next steps

> [!div class="nextstepaction"]
> [Use a custom Docker image](tutorial-custom-docker-image.md)
