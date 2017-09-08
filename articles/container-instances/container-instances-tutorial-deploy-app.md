---
title: Azure Container Instances tutorial - Deploy app | Microsoft Docs
description: Azure Container Instances tutorial - Deploy app
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: 

ms.assetid: 
ms.service: container-instances
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: seanmck
ms.custom: mvc
---

# Deploy a container to Azure Container Instances

This is the last of a three-part tutorial. In previous sections, [a container image was created](container-instances-tutorial-prepare-app.md) and [pushed to an Azure Container Registry](container-instances-tutorial-prepare-acr.md). This section completes the tutorial by deploying the container to Azure Container Instances. Steps completed include:

> [!div class="checklist"]
> * Deploying a container from an image in Azure Container Registry
> * Verifying the running application
> * Viewing container logs

## Deploy the container using the Azure CLI

The Azure CLI enables deployment of a container to Azure Container Instances in a single command. Since the container image is hosted in the private Azure Container Registry, you must include the credentials required to access it. If necessary, you can query them as shown below.

Container registry login server (update with your registry name):

```azurecli-interactive
az acr show --name <acrName> --query loginServer
```

Container registry password:

```azurecli-interactive
az acr credential show --name <acrName> --query "passwords[0].value"
```

To deploy your container image from the container registry with a resource request of 1 CPU core and 1GB of memory, run the following command:

```azurecli-interactive
az container create --name aci-tutorial-app --image <acrLoginServer>/aci-tutorial-app:v1 --cpu 1 --memory 1 --registry-password <acrPassword> --ip-address public -g myResourceGroup
```

Within a few seconds, you will receive an initial response from Azure Resource Manager. To view the state of the deployment, use:

```azurecli-interactive
az container show --name aci-tutorial-app --resource-group myResourceGroup --query state
```

We can continue running this command until the state changes from *pending* to *running*. Then we can proceed.

## View the application and container logs

Once the deployment succeeds, open your browser to the IP address shown in the output of the following command:

```bash
az container show --name aci-tutorial-app --resource-group myResourceGroup --query ipAddress.ip
```

```json
"13.88.176.27"
```

![Hello world app in the browser][aci-app-browser]

You can also view the log output of the container:

```azurecli-interactive
az container logs --name aci-tutorial-app -g myResourceGroup
```

Output:

```bash
listening on port 80
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET / HTTP/1.1" 200 1663 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
::ffff:10.240.0.4 - - [21/Jul/2017:06:00:02 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://13.88.176.27/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
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
