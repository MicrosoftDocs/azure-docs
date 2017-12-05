---
title: Quickstart - Create a private Docker registry in Azure with the Azure CLI
description: Quickly learn to create a private Docker container registry with the Azure CLI.
services: container-registry
author: neilpeterson
manager: timlt

ms.service: container-registry
ms.topic: quicksart
ms.date: 12/06/2017
ms.author: nepeters
ms.custom: H1Hack27Feb2017, mvc
---

# Create a container registry using the Azure CLI

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating an Azure Container Registry instance using the Azure CLI.

This quickstart requires that you are running the Azure CLI version 2.0.21 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0][azure-cli].

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Create a resource group

Create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a container registry

In this quickstart, we create a *Basic* registry. Azure Container Registry is available in several different SKUs, described briefly in the following table. For extended details on each, see [Container registry SKUs][container-registry-skus].

[!INCLUDE [container-registry-sku-matrix][container-registry-sku-matrix]]

Create an ACR instance using the [az acr create][az-acr-create] command.

The name of the registry **must be unique**. In the following example *myContainerRegistry007* is used. Update this to a unique value.

```azurecli
az acr create --resource-group myResourceGroup --name myContainerRegistry007 --sku Basic
```

When the registry is created, the output is similar to the following:

```json
{
  "adminUserEnabled": false,
  "creationDate": "2017-09-08T22:32:13.175925+00:00",
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
  "storageAccount": {
    "name": "mycontainerregistr223140"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

Throughout the rest of this quickstart, we use `<acrName>` as a placeholder for the container registry name.

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [az acr login][az-acr-login] command.

```azurecli
az acr login --name <acrName>
```

The command returns a `Login Succeeded` message once completed.

## Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If you don't yet have any local container images, run the following command to pull an existing image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server. Run the following command to obtain the full login server name of the ACR instance.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Tag the image using the [docker tag][docker-tag] command. Replace `<acrLoginServer>` with the login server name of your ACR instance.

```bash
docker tag microsoft/aci-helloworld <acrLoginServer>/aci-helloworld:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace `<acrLoginServer>` with the login server name of your ACR instance.

```bash
docker push <acrLoginServer>/aci-helloworld:v1
```

## List container images

The following example lists the repositories in a registry:

```azurecli
az acr repository list --name <acrName> --output table
```

Output:

```bash
Result
----------------
aci-helloworld
```

The following example lists the tags on the **aci-helloworld** repository.

```azurecli
az acr repository show-tags --name <acrName> --repository aci-helloworld --output table
```

Output:

```bash
Result
--------
v1
```

## Clean up resources

When no longer needed, you can use the [az group delete][az-group-delete] command to remove the resource group, ACR instance, and all container images.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI. If you would like to use Azure Container Registry with Azure Container Instances, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial][container-instances-tutorial-prepare-app]

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#create
[az-acr-login]: /cli/azure/acr#login
[az-group-create]: /cli/azure/group#create
[az-group-delete]: /cli/azure/group#delete
[azure-cli]: /cli/azure/install-azure-cli
[container-instances-tutorial-prepare-app]: ../container-instances/container-instances-tutorial-prepare-app.md
[container-registry-sku-matrix]: ../../includes/container-registry-sku-matrix.md
[container-registry-skus]: container-registry-skus.md