---
title: Create a multi-container (preview) app using Azure Web App for Containers
description: Deploy your first multi-container app in Azure Web App for Containers in minutes
keywords: azure app service, web app, linux, docker, compose, multi-container, container, kubernetes
services: app-service\web
documentationcenter: ''
author: msangapu
manager: jeconnoc
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 06/23/2018
ms.author: msangapu
ms.custom: mvc
---
# Create a multi-container (preview) app using Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides a flexible way to use Docker images. This quickstart shows how to deploy a multi-container app to Web App for Containers using the [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).

You'll complete this quickstart in Cloud Shell, but you can also run these commands locally with [Azure CLI](/cli/azure/install-azure-cli) (2.0.32 or later).

![Sample multi-container app on Web App for Containers][1]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this tutorial, you need:

* Experience with [Docker Compose](https://docs.docker.com/compose/) or [Kubernetes](https://kubernetes.io/).

## Create a deployment user

In the Cloud Shell, create deployment credentials with the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az_webapp_deployment_user_set) command. This deployment user is required for FTP and local Git deployment to a web app. The user name and password are account level. _They are different from your Azure subscription credentials._

In the following example, replace *\<username>* and *\<password>* (including brackets) with a new user name and password. The user name must be unique within Azure. The password must be at least eight characters long, with two of the following three elements: letters, numbers, symbols.

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

You should get a JSON output, with the password shown as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password.

You create this deployment user only once; you can use it for all your Azure deployments.

> [!NOTE]
> Record the user name and password. You use them to deploy the web app later.
>
>

## Create a resource group

[!INCLUDE [resource group intro text](../../../includes/resource-group.md)]

In the Cloud Shell, create a resource group with the [`az group create`](/cli/azure/group?view=azure-cli-latest#az_group_create) command. The following example creates a resource group named *myResourceGroup* in the *South Central US* location. To see all supported locations for App Service on Linux in **Standard** tier, run the [`az appservice list-locations --sku S1 --linux-workers-enabled`](/cli/azure/appservice?view=azure-cli-latest#az_appservice_list_locations) command.

```azurecli-interactive
az group create --name myResourceGroup --location "South Central US"
```

You generally create your resource group and the resources in a region near you.

When the command finishes, a JSON output shows you the resource group properties.

## Create an Azure App Service plan

In the Cloud Shell, create an App Service plan in the resource group with the [`az appservice plan create`](/cli/azure/appservice/plan?view=azure-cli-latest#az_appservice_plan_create) command.

<!-- [!INCLUDE [app-service-plan](app-service-plan-linux.md)] -->

The following example creates an App Service plan named `myAppServicePlan` in the **Standard** pricing tier (`--sku S1`) and in a Linux container (`--is-linux`).

```azurecli-interactive
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1 --is-linux
```

When the App Service plan has been created, the Azure CLI shows information similar to the following example:

```json
{
  "adminSiteName": null,
  "appServicePlanName": "myAppServicePlan",
  "geoRegion": "South Central US",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "kind": "linux",
  "location": "South Central US",
  "maximumNumberOfWorkers": 1,
  "name": "myAppServicePlan",
  < JSON data removed for brevity. >
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
```

## Download the sample

For this quickstart, you use the compose file from [Docker](https://docs.docker.com/compose/wordpress/#define-the-project), but you'll modify it include Azure Database for MySQL, persistent storage, and Redis. Alternatively, you can use a [Kubernetes configuration](#use-a-kubernetes-configuration-optional). The configuration files can be found at [Azure Samples](https://github.com/Azure-Samples/multicontainerwordpress).

[!code-yml[Main](../../../azure-app-service-multi-container/docker-compose-wordpress.yml)]

In the Cloud Shell, create a quickstart directory and then change to it.

```bash
mkdir quickstart

cd quickstart
```

Next, run the following command to clone the sample app repository to your quickstart directory.

```bash
git clone https://github.com/Azure-Samples/multicontainerwordpress
```

While running, it displays information similar to the following example:

```bash
Cloning into 'nodejs-docs-hello-world'...
remote: Counting objects: 40, done.
remote: Total 40 (delta 0), reused 0 (delta 0), pack-reused 40
Unpacking objects: 100% (40/40), done.
Checking connectivity... done.
````

## Create a Docker Compose app

In your Cloud Shell terminal, create a multi-container [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file compose-wordpress.yml
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
{
  "additionalProperties": {},
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). The app may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser. If you're having trouble and would like to troubleshoot, review [container logs](#find-docker-container-logs).

![Sample multi-container app on Web App for Containers][1]

**Congratulations**, you've created a multi-container app in Web App for Containers. Next you'll configure your app to use Azure Database for MySQL. Don't install WordPress at this time.

## Use a Kubernetes configuration (optional)

In this section, you'll learn how to use a Kubernetes configuration to deploy multiple containers. Make sure you follow earlier steps in to create a [resource group](#create-a-resource-group) and an [App Service plan](#create-an-azure-app-service-plan).

### Create configuration file

Save the following YAML to a file called *kubernetes-wordpress.yml*.

[!code-yml[Main](../../../azure-app-service-multi-container/kubernetes-wordpress.yml)]

[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Use a custom Docker image for Web App for Containers](tutorial-custom-docker-image.md)

<!--Image references-->
[1]: ./media/tutorial-multi-container-app/azure-multi-container-wordpress-install.png
[2]: ./media/tutorial-multi-container-app/wordpress-plugins.png
[3]: ./media/tutorial-multi-container-app/activate-redis.png
[4]: ./media/tutorial-multi-container-app/redis-settings.png
[5]: ./media/tutorial-multi-container-app/enable-object-cache.png
[6]: ./media/tutorial-multi-container-app/redis-connected.png
