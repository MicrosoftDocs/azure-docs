---
title: Create your first Azure Container Instances container | Azure Docs
description: Deploy and get started with Azure Container Instances
services: container-service
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: 
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/07/2017
ms.author: seanmck
ms.custom: 
---

# Create your first container in Azure Container Instances

Azure Container Instances makes it easy to create and manage containers in Azure. In this article, we will create a container in Azure and expose it to the internet with a public IP address.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a container

You can create a container by providing a name for the container, a Docker image, and an Azure resource group. You can optionally expose the container to the internet with a public IP address.

To begin, create a resource group to store your containers:

```azurecli-interactive
az group create -l westus -n acidemogroup
```

Now, create a container in that group and give it a public IP address:

```azurecli-interactive
az container create --name myContainer --image seanmckenna/aci-helloworld -g acidemogroup --ip-address public 
```

Within a few seconds, you should get a response to your request. Initially,the container will be in a **Creating** state, but it should start within a few seconds. You can check the status using the `show` command:

```azurecli-interactive
az container show myContainer -g acidemogroup
```

Once the container moves to the **Succeeded** state, you will be able to reach it in the browser using the IP address shown in the output. 

![App deployed using Azure Container Instances viewed in browser][aci-app-browser]

## Pull the container logs

You can pull the logs for the container you created using the `logs` command:

```azurecli-interactive
az container logs --name myContainer -g acidemogroup
```

## Delete the container

When you are done with the container, you can remove it using the `delete` command:

```azurecli-interactive
az container delete --name myContainer -g acidemogroup
```

## Next steps

In this quick start, you’ve created a simple container instance. To learn more about Azure Container Instances, continue to the Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials](./container-instances-overview.md)


<!-- IMAGES -->

[aci-app-browser]: ./media/container-instances-quickstart/aci-app-browser.png