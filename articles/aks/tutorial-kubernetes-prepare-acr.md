---
title: Kubernetes on Azure tutorial - Create a container registry
description: In this Azure Kubernetes Service (AKS) tutorial, you create an Azure Container Registry instance and upload a sample application container image.
services: container-service
author: mlearned

ms.service: container-service
ms.topic: tutorial
ms.date: 12/19/2018
ms.author: mlearned
ms.custom: mvc

#Customer intent: As a developer, I want to learn how to create and use a container registry so that I can deploy my own applications to Azure Kubernetes Service.
---

# Tutorial: Deploy and use Azure Container Registry

Azure Container Registry (ACR) is a private registry for container images. A private container registry lets you securely build and deploy your applications and custom code. In this tutorial, part two of seven, you deploy an ACR instance and push a container image to it. You learn how to:

> [!div class="checklist"]
> * Create an Azure Container Registry (ACR) instance
> * Tag a container image for ACR
> * Upload the image to ACR
> * View images in your registry

In additional tutorials, this ACR instance is integrated with a Kubernetes cluster in AKS, and an application is deployed from the image.

## Before you begin

In the [previous tutorial][aks-tutorial-prepare-app], a container image was created for a simple Azure Voting application. If you have not created the Azure Voting app image, return to [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

This tutorial requires that you're running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Create an Azure Container Registry

To create an Azure Container Registry, you first need a resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with the [az group create][az-group-create] command. In the following example, a resource group named *myResourceGroup* is created in the *eastus* region:

```azurecli
az group create --name myResourceGroup --location eastus
```

Create an Azure Container Registry instance with the [az acr create][az-acr-create] command and provide your own registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the rest of this tutorial, `<acrName>` is used as a placeholder for the container registry name. Provide your own unique registry name. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

```azurecli
az acr create --resource-group myResourceGroup --name <acrName> --sku Basic
```

## Log in to the container registry

To use the ACR instance, you must first log in. Use the [az acr login][az-acr-login] command and provide the unique name given to the container registry in the previous step.

```azurecli
az acr login --name <acrName>
```

The command returns a *Login Succeeded* message once completed.

## Tag a container image

To see a list of your current local images, use the [docker images][docker-images] command:

```
$ docker images

REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
azure-vote-front             latest              4675398c9172        13 minutes ago      694MB
redis                        latest              a1b99da73d05        7 days ago          106MB
tiangolo/uwsgi-nginx-flask   flask               788ca94b2313        9 months ago        694MB
```

To use the *azure-vote-front* container image with ACR, the image needs to be tagged with the login server address of your registry. This tag is used for routing when pushing container images to an image registry.

To get the login server address, use the [az acr list][az-acr-list] command and query for the *loginServer* as follows:

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Now, tag your local *azure-vote-front* image with the *acrloginServer* address of the container registry. To indicate the image version, add *:v1* to the end of the image name:

```console
docker tag azure-vote-front <acrLoginServer>/azure-vote-front:v1
```

To verify the tags are applied, run [docker images][docker-images] again. An image is tagged with the ACR instance address and a version number.

```
$ docker images

REPOSITORY                                           TAG           IMAGE ID            CREATED             SIZE
azure-vote-front                                     latest        eaf2b9c57e5e        8 minutes ago       716 MB
mycontainerregistry.azurecr.io/azure-vote-front      v1            eaf2b9c57e5e        8 minutes ago       716 MB
redis                                                latest        a1b99da73d05        7 days ago          106MB
tiangolo/uwsgi-nginx-flask                           flask         788ca94b2313        8 months ago        694 MB
```

## Push images to registry

With your image built and tagged, push the *azure-vote-front* image to your ACR instance. Use [docker push][docker-push] and provide your own *acrLoginServer* address for the image name as follows:

```console
docker push <acrLoginServer>/azure-vote-front:v1
```

It may take a few minutes to complete the image push to ACR.

## List images in registry

To return a list of images that have been pushed to your ACR instance, use the [az acr repository list][az-acr-repository-list] command. Provide your own `<acrName>` as follows:

```azurecli
az acr repository list --name <acrName> --output table
```

The following example output lists the *azure-vote-front* image as available in the registry:

```
Result
----------------
azure-vote-front
```

To see the tags for a specific image, use the [az acr repository show-tags][az-acr-repository-show-tags] command as follows:

```azurecli
az acr repository show-tags --name <acrName> --repository azure-vote-front --output table
```

The following example output shows the *v1* image tagged in a previous step:

```
Result
--------
v1
```

You now have a container image that is stored in a private Azure Container Registry instance. This image is deployed from ACR to a Kubernetes cluster in the next tutorial.

## Next steps

In this tutorial, you created an Azure Container Registry and pushed an image for use in an AKS cluster. You learned how to:

> [!div class="checklist"]
> * Create an Azure Container Registry (ACR) instance
> * Tag a container image for ACR
> * Upload the image to ACR
> * View images in your registry

Advance to the next tutorial to learn how to deploy a Kubernetes cluster in Azure.

> [!div class="nextstepaction"]
> [Deploy Kubernetes cluster][aks-tutorial-deploy-cluster]

<!-- LINKS - external -->
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr
[az-acr-list]: /cli/azure/acr
[az-acr-login]: https://docs.microsoft.com/cli/azure/acr#az-acr-login
[az-acr-list]: https://docs.microsoft.com/cli/azure/acr#az-acr-list
[az-acr-repository-list]: /cli/azure/acr/repository
[az-acr-repository-show-tags]: /cli/azure/acr/repository
[az-group-create]: /cli/azure/group#az-group-create
[azure-cli-install]: /cli/azure/install-azure-cli
[aks-tutorial-deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
