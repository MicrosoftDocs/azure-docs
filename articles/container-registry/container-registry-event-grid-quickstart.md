---
title: Quickstart - Send Azure Container Registry events to Event Grid
description: In this quickstart, you enable Event Grid events for your container registry, then send container image push and delete events to a sample application.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 08/17/2018
ms.author: marsma
# Customer intent: As a container registry owner, I want to send events to Event Grid
# when container images are pushed to or deleted from my container registry so that
# downstream applications can react to those events.
---

# Quickstart: Send container registry events to Event Grid

Azure Event Grid is a fully managed event routing service that provides uniform event consumption using a publish-subscribe model. In this quickstart, you use the Azure CLI to create a container registry, subscribe to registry events, then deploy a sample web application to receive the events. Finally, you trigger container image `push` and `delete` events and view the event payload in the sample application.

After you complete the steps in this article, you can view events sent from your container registry to Event Grid in the sample web app:

IMAGE HERE

The Azure CLI commands in this article are formatted for the Bash shell. If you're using a different shell like PowerShell or Command Prompt, you may need to adjust line continuation characters or variable assignment lines accordingly. This article uses environment variables to minimize the amount of editing you need to do in commands in later sections.

If you don't have an Azure subscription, create a [free account][azure-account] before you begin.

## Create a resource group

An Azure resource group is a logical container in which you deploy and manage your Azure resources. Create a resource group with the following commands. The following [az group create][az-group-create] command creates a resource group named *myResourceGroup* in the *eastus* region. If you want to use a different name for your resource group, modify the `RESOURCE_GROUP_NAME` value.

```azurecli-interactive
RESOURCE_GROUP_NAME=myResourceGroup

az group create --name myResourceGroup --location eastus
```

## Create a container registry

Next, deploy a container registry into the resource group you created with the following commands. Before you run the [az acr create][az-acr-create] command, change `<acrName>` to a registry name unique within Azure, and containing 5-50 alphanumeric characters.

```azurecli-interactive
ACR_NAME=<acrName>

az acr create --resource-group $RESOURCE_GROUP_NAME --name $ACR_NAME --sku Basic
```

Once the registry has been created, the Azure CLI returns output similar to the following:

```json
{
  "adminUserEnabled": false,
  "creationDate": "2018-08-16T20:02:46.569509+00:00",
  "id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
  "location": "eastus",
  "loginServer": "myregistry.azurecr.io",
  "name": "myregistry",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}

```

In the remainder of this quickstart, `<acrName>` is a placeholder for the container registry name you specified in this section. Where you see this value in a command, replace it with your registry's name.

## Create an event endpoint

In this section, you use a Resource Manager template located in a GitHub repository to deploy a pre-built sample web application to Azure App Service. Later, you subscribe to your registry's Event Grid events and specify this app as the endpoint to which the events are sent.

To deploy the sample app, update `<your-site-name>` with a unique name for your web app, and execute the following commands. The site name must be unique within Azure because it forms part of the fully qualified domain name (FQDN) of the web app. In a later section, you navigate to the app's FQDN in a web browser to view your registry's events.

```azurecli-interactive
SITE_NAME=<your-site-name>

az group deployment create \
    --resource-group $RESOURCE_GROUP_NAME \
    --template-uri "https://raw.githubusercontent.com/dbarkol/azure-event-grid-viewer/master/azuredeploy.json" \
    --parameters siteName=$SITE_NAME hostingPlanName=$SITE_NAME-plan
```

Once the deployment has succeeded (it might take a few minutes), navigate to your web app to make sure it's running. In your favorite web browser, navigate to:

`https://<your-site-name>.azurewebsites.net`

You should see the sample app rendered with no event messages displayed:

IMAGE HERE

[!INCLUDE [event-grid-register-provider-cli.md](../../includes/event-grid-register-provider-cli.md)]

## Subscribe to registry events

In Event Grid, you subscribe to a **topic** to tell it which events you want to track, and where to send them. The following [az eventgrid event-subscription create][az-eventgrid event-subscription-create] command subscribes to the container registry you created, and specifies your web app's URL as the endpoint to which it should send events. The environment variables you populated in earlier sections are reused here to minimize editing of the commands.

```azurecli-interactive
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)
APP_ENDPOINT=https://$SITE_NAME.azurewebsites.net/api/updates

az eventgrid event-subscription create \
    --name event-sub-acr \
    --resource-id $ACR_REGISTRY_ID \
    --endpoint $APP_ENDPOINT
```

## Trigger registry events

## View registry events

## Next steps

For more information about image storage in Azure Container Registry see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- IMAGES -->
[sample-app-01]: ./media/container-registry-event-grid-quickstart/sample-app-01.png

<!-- LINKS - External -->
[azure-account]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
[sample-app]: https://github.com/dbarkol/azure-event-grid-viewer

<!-- LINKS - Internal -->
[az-acr-create]: /cli/azure/acr/repository#az-acr-create
[az-eventgrid-event-subscription-create]: /cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create
[az-group-create]: /cli/azure/group#az-group-create
