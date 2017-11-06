---
title: Azure Container Instances tutorial - Deploy app
description: Azure Container Instances tutorial - Deploy app
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: mmacy
tags:
keywords:

ms.assetid:
ms.service: container-instances
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/07/2017
ms.author: seanmck
ms.custom: mvc
---

# Deploy a container to Azure Container Instances

This is the last of a three-part tutorial. In previous sections, [a container image was created](container-instances-tutorial-prepare-app.md) and [pushed to an Azure Container Registry](container-instances-tutorial-prepare-acr.md). This section completes the tutorial by deploying the container to Azure Container Instances. Steps completed include:

> [!div class="checklist"]
> * Deploying the container from the Azure Container Registry using the Azure CLI
> * Viewing the application in the browser
> * Viewing the container logs

## Before you begin

This tutorial requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. Therefore, we recommend a local installation of the Azure CLI and Docker development environment.

## Deploy the container using the Azure CLI

The Azure CLI enables deployment of a container to Azure Container Instances in a single command. Since the container image is hosted in the private Azure Container Registry, you must include the credentials required to access it. If necessary, you can query them as shown below.

Container registry login server (update with your registry name):

```azurecli
az acr show --name <acrName> --query loginServer
```

Container registry password:

```azurecli
az acr credential show --name <acrName> --query "passwords[0].value"
```

To deploy your container image from the container registry with a resource request of 1 CPU core and 1 GB of memory, run the following command. Replace `<acrLoginServer>` and `<acrPassword>` with the values you obtained with the previous two commands.

```azurecli
az container create --name aci-tutorial-app --image <acrLoginServer>/aci-tutorial-app:v1 --cpu 1 --memory 1 --registry-password <acrPassword> --ip-address public -g myResourceGroup
```

Within a few seconds, you should receive an initial response from Azure Resource Manager. To view the state of the deployment, use [az container show](/cli/azure/container#az_container_show):

```azurecli
az container show --name aci-tutorial-app --resource-group myResourceGroup --query instanceView.state
```

Repeat the `az container show` command until the state changes from *Pending* to *Running*, which should take under a minute. When the container is *Running*, proceed to the next step.

## View the application and container logs

Once the deployment succeeds, display the container's public IP address with the [az container show](/cli/azure/container#az_container_show) command:

```bash
az container show --name aci-tutorial-app --resource-group myResourceGroup --query ipAddress.ip
```

Example output: `"13.88.176.27"`

To see the running application, navigate to the public IP address in your favorite browser.

![Hello world app in the browser][aci-app-browser]

You can also view the log output of the container:

```azurecli
az container logs --name aci-tutorial-app -g myResourceGroup
```

Output:

```bash
listening on port 80
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET / HTTP/1.1" 200 1663 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://13.88.176.27/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## Clean up resources

If you no longer need any of the resources you created in this tutorial series, you can execute the [az group delete](/cli/azure/group#delete) command  to remove the resource group and all resources it contains. This command deletes the container registry you created, as well as the running container, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you completed the process of deploying your containers to Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Deploying the container from the Azure Container Registry using the Azure CLI
> * Viewing the application in the browser
> * Viewing the container logs

<!-- LINKS -->
[prepare-app]: ./container-instances-tutorial-prepare-app.md

<!-- IMAGES -->
[aci-app-browser]: ./media/container-instances-quickstart/aci-app-browser.png
