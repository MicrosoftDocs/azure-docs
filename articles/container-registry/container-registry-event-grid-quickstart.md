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

![Web browser rendering the sample web application with three received events][sample-app-01]

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

`http://<your-site-name>.azurewebsites.net`

You should see the sample app rendered with no event messages displayed:

![Web browser showing sample web app with no events displayed][sample-app-02]

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

Now that the sample app is up and running and you've subscribed to your registry with Event Grid, you're ready to generate some events. In this section, you use ACR Build to build and push a container image to your registry. ACR Build is a feature of Azure Container Registry that allows you to build container images in the cloud, without needing the Docker Engine installed on your local machine.

### Build and push image

Execute the following Azure CLI command to build a container image from the contents of a GitHub repository. By default, ACR Build automatically pushes a successfully built image to your registry, which generates an `ImagePushed` event.

```azurecli-interactive
az acr build --registry $ACR_NAME --image myimage:v1 https://github.com/Azure-Samples/acr-build-helloworld-node.git
```

You should see output similar to the following while ACR Build builds and then pushes your image. The following sample output has been truncated for brevity.

```console
$ az acr build -r $ACR_NAME --image myimage:v1 https://github.com/Azure-Samples/acr-build-helloworld-node.git
Sending build context to ACR...
Queued a build with build ID: aa2
Waiting for build agent...
2018/08/16 22:19:38 Using acb_vol_27a2afa6-27dc-4ae4-9e52-6d6c8b7455b2 as the home volume
2018/08/16 22:19:38 Setting up Docker configuration...
2018/08/16 22:19:39 Successfully set up Docker configuration
2018/08/16 22:19:39 Logging in to registry: myregistry.azurecr.io
2018/08/16 22:19:55 Successfully logged in
Sending build context to Docker daemon  94.72kB
Step 1/5 : FROM node:9-alpine
...
```

To verify that the built image is in your registry, execute the following command to view the tags in the "myimage" repository:

```azurecli-interactive
az acr repository show-tags --name $ACR_NAME --repository myimage
```

The "v1" tag of the image you built should appear in the output, similar to the following:

```console
$ az acr repository show-tags --name $ACR_NAME --repository myimage
[
  "v1"
]
```

### Delete the image

Now, generate an `ImageDeleted` event by deleting the image with the [az acr repository delete][az-acr-repository-delete] command.

```azurecli-interactive
az acr repository delete --name $ACR_NAME --image myimage:v1
```

You should see output similar to the following, asking for confirmation to delete the manifest and its images:

```console
$ az acr repository delete --name $ACR_NAME --image myimage:v1
This operation will delete the manifest 'sha256:f15fa9d0a69081ba93eee308b0e475a54fac9c682196721e294b2bc20ab23a1b' and all the following images: 'myimage:v1'.
Are you sure you want to continue? (y/n): y
```

## View registry events

You've now push an image to your registry and then deleted it. Navigate to your Event Grid Viewer web app, and you should see several events. One is the subscription event generated by executing the command in the [Subscribe to registry events](#subscribe-to-registry-events) section. There should also be both an `ImageDeleted` event and an `ImagePushed` event.

The following screenshot shows the sample app with the three events, and the `ImageDeleted` event is expanded to show its details.

![Web browser showing the sample app with ImagePushed and ImageDeleted events][sample-app-03]

Congratulations! You've deployed a container registry, built an image with ACR Build, deleted it, and have consumed your registry's events from Event Grid with a sample application.

## Clean up resources

Once you're done with the resources you created in this quickstart, you can delete them all with the following Azure CLI command. When you delete a resource group, all of the resources it contains are permanently deleted.

**WARNING**:This operation is irreversible, so be sure you no longer need any of these resources before running the command.

```azurecli-interactive
az group delete $RESOURCE_GROUP_NAME
```

## Next steps

For more information about image storage in Azure Container Registry see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- IMAGES -->
[sample-app-01]: ./media/container-registry-event-grid-quickstart/sample-app-01.png
[sample-app-02]: ./media/container-registry-event-grid-quickstart/sample-app-02-no-events.png
[sample-app-03]: ./media/container-registry-event-grid-quickstart/sample-app-03-with-events.png

<!-- LINKS - External -->
[azure-account]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
[sample-app]: https://github.com/dbarkol/azure-event-grid-viewer

<!-- LINKS - Internal -->
[az-acr-create]: /cli/azure/acr/repository#az-acr-create
[az-acr-repository-delete]: /cli/azure/acr/repository#az-acr-repository-delete
[az-eventgrid-event-subscription-create]: /cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create
[az-group-create]: /cli/azure/group#az-group-create
