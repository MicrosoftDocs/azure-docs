---
title: 'Quickstart: Create a multi-container app'
description: Get started with multi-container apps on Azure App Service by deploying your first multi-container app.
keywords: azure app service, web app, linux, docker, compose, multicontainer, multi-container, web app for containers, multiple containers, container, wordpress, azure db for mysql, production database with containers
author: msangapu-msft
ms.topic: quickstart
ms.date: 11/18/2022
ms.author: msangapu
ms.custom: mvc, devx-track-azurecli, mode-other
---

# Create a multi-container (preview) app using a Docker Compose configuration

> [!NOTE]
> Multi-container is in preview.

[Web App for Containers](overview.md#app-service-on-linux) provides a flexible way to use Docker images. This quickstart shows how to deploy a multi-container app (preview) to Web App for Containers in the [Cloud Shell](../cloud-shell/overview.md) using a Docker Compose configuration.

![Sample multi-container app on Web App for Containers][1]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

This article requires version 2.0.32 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Download the sample

For this quickstart, you use the compose file from [Docker](https://docs.docker.com/samples/wordpress/). The configuration file can be found at [Azure Samples](https://github.com/Azure-Samples/multicontainerwordpress).

[!code-yml[Main](../../azure-app-service-multi-container/docker-compose-wordpress.yml)]

In the Cloud Shell, create a quickstart directory and then change to it.

```bash
mkdir quickstart

cd $HOME/quickstart
```

Next, run the following command to clone the sample app repository to your quickstart directory. Then change to the `multicontainerwordpress` directory.

```bash
git clone https://github.com/Azure-Samples/multicontainerwordpress

cd multicontainerwordpress
```

## Create a resource group

[!INCLUDE [resource group intro text](../../includes/resource-group.md)]

In the Cloud Shell, create a resource group with the [`az group create`](/cli/azure/group#az-group-create) command. The following example creates a resource group named *myResourceGroup* in the *South Central US* location. To see all supported locations for App Service on Linux in **Standard** tier, run the [`az appservice list-locations --sku S1 --linux-workers-enabled`](/cli/azure/appservice#az-appservice-list-locations) command.

```azurecli-interactive
az group create --name myResourceGroup --location "South Central US"
```

You generally create your resource group and the resources in a region near you.

When the command finishes, a JSON output shows you the resource group properties.

## Create an Azure App Service plan

In the Cloud Shell, create an App Service plan in the resource group with the [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) command.

The following example creates an App Service plan named `myAppServicePlan` in the **Standard** pricing tier (`--sku S1`) and in a Linux container (`--is-linux`).

```azurecli-interactive
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1 --is-linux
```

When the App Service plan has been created, the Azure CLI shows information similar to the following example:

<pre>
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
  &lt; JSON data removed for brevity. &gt;
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
</pre>

## Create a Docker Compose app

> [!NOTE]
> Docker Compose on Azure App Services currently has a limit of 4,000 characters when converted to Base64 at this time.

In your Cloud Shell terminal, create a multi-container [web app](overview.md#app-service-on-linux) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp#az-webapp-create) command. Don't forget to replace _\<app_name>_ with a unique app name (valid characters are `a-z`, `0-9`, and `-`).

```azurecli
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file compose-wordpress.yml
```

When the web app has been created, the Azure CLI shows output similar to the following example:

<pre>
{
  "additionalProperties": {},
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "&lt;app_name&gt;.azurewebsites.net",
  "enabled": true,
  &lt; JSON data removed for brevity. &gt;
}
</pre>

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). The app may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser.

![Sample multi-container app on Web App for Containers][1]

**Congratulations**, you've created a multi-container app in Web App for Containers.

[!INCLUDE [Clean-up section](../../includes/cli-script-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Multi-container WordPress app](tutorial-multi-container-app.md)

> [!div class="nextstepaction"]
> [Configure a custom container](configure-custom-container.md)

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

<!--Image references-->
[1]: media/tutorial-multi-container-app/azure-multi-container-wordpress-install.png
