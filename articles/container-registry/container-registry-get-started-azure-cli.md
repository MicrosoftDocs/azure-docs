---
title: Quickstart - Create a private Docker registry in Azure - Azure CLI
description: Quickly learn to create a private Docker container registry with the Azure CLI.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: quickstart
ms.date: 01/22/2019
ms.author: danlep
ms.custom: "seodec18, H1Hack27Feb2017, mvc"
---
# Quickstart: Create a private container registry using the Azure CLI

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating an Azure Container Registry instance using the Azure CLI. Then, use Docker commands to push a container image into the registry, and finally pull and run the image from your registry.

This quickstart requires that you are running the Azure CLI version 2.0.27 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Create a resource group

Create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create a container registry

In this quickstart you create a *Basic* registry, which is a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers, see [Container registry SKUs][container-registry-skus].

Create an ACR instance using the [az acr create][az-acr-create] command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the following example, *myContainerRegistry007* is used. Update this to a unique value.

```azurecli
az acr create --resource-group myResourceGroup --name myContainerRegistry007 --sku Basic
```

When the registry is created, the output is similar to the following:

```json
{
  "adminUserEnabled": false,
  "creationDate": "2019-01-08T22:32:13.175925+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry007",
  "location": "eastus",
  "loginServer": "myContainerRegistry007.azurecr.io",
  "name": "myContainerRegistry007",
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

Throughout the rest of this quickstart `<acrName>` is a placeholder for the container registry name.

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [az acr login][az-acr-login] command.

```azurecli
az acr login --name <acrName>
```

The command returns a `Login Succeeded` message once completed.

## Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If you don't yet have any local container images, run the following [docker pull][docker-pull] command to pull an existing image from Docker Hub.

```bash
docker pull busybox
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server. Run the following command to obtain the full login server name (all lowercase) of the ACR instance. 

```azurecli
az acr show --name myContainerRegistry007 --query "{acrLoginServer:loginServer}" --output table
```

Tag the image using the [docker tag][docker-tag] command. Replace `<acrLoginServer>` with the login server name of your ACR instance.

```bash
docker tag busybox <acrLoginServer>/busybox:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace `<acrLoginServer>` with the login server name of your ACR instance. This example creates the **busybox** repository, containing the `busybox:v1` image.

```bash
docker push <acrLoginServer>/busybox:v1
```

## List container images

After pushing the image to your container registry, remove the `busybox:v1` image from your local environment. (Note that this [docker rmi][docker-rmi] command does not remove the image from the **busybox** repository in your Azure container registry.)

```bash
docker rmi <acrLoginServer>/busybox:v1
```

Now, verify that the image remains in your registry. The following example lists the repositories in your registry:

```azurecli
az acr repository list --name <acrName> --output table
```

Output:

```bash
Result
----------------
busybox
```

The following example lists the tags on the **busybox** repository.

```azurecli
az acr repository show-tags --name <acrName> --repository busybox --output table
```

Output:

```bash
Result
--------
v1
```

## Run image from ACR

Now, you can pull and run the `busybox:v1` container image from your container registry. This [docker run][docker-run] example displays the current date and time:

```bash
docker run <acrLoginServer>/busybox:v1 date 
```

Example output: 

```
Unable to find image 'mycontainerregistry007.azurecr.io/busybox:v1' locally
v1: Pulling from busybox
Digest: sha256:662dd8e65ef7ccf13f417962c2f77567d3b132f12c95909de6c85ac3c326a345
Status: Downloaded newer image for mycontainerregistry007.azurecr.io/busybox:v1
Wed Jan 23 00:45:03 UTC 2019
```

## Clean up resources

When no longer needed, you can use the [az group delete][az-group-delete] command to remove the resource group, ACR instance, and all container images.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI, pushed a container image to the registry, and pulled and ran the image from the registry. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-quick-task]

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-rmi]: https://docs.docker.com/engine/reference/commandline/rmi/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[azure-cli]: /cli/azure/install-azure-cli
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: container-registry-skus.md
