---
title: Create your first Azure Container Instances container | Azure Docs
description: Deploy and get started with Azure Container Instances
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: container-instances
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2017
ms.author: seanmck
ms.custom: mvc
---

# Create your first container in Azure Container Instances

Azure Container Instances makes it easy to create and manage containers in Azure. In this quick start, you will create a container in Azure and expose it to the internet with a public IP address. This operation is completed in a single command. Within just a few seconds, you will see this in your browser:

![App deployed using Azure Container Instances viewed in browser][aci-app-browser]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.12 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Azure Container Instances are Azure resources and must be placed in an Azure resource group, a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#create) command. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a container

You can create a container by providing a name, a Docker image, and an Azure resource group. You can optionally expose the container to the internet with a public IP address. In this case, we'll use a container that hosts a very simple web app written in [Node.js](http://nodejs.org).

```azurecli-interactive
az container create --name mycontainer --image microsoft/aci-helloworld --resource-group myResourceGroup --ip-address public 
```

Within a few seconds, you should get a response to your request. Initially, the container will be in a **Creating** state, but it should start within a few seconds. You can check the status using the `show` command:

```azurecli-interactive
az container show --name mycontainer --resource-group myResourceGroup
```

At the bottom of the output, you will see the container's provisioning state and its IP address:

```json
...
"ipAddress": {
      "ip": "13.88.8.148",
      "ports": [
        {
          "port": 80,
          "protocol": "TCP"
        }
      ]
    },
    "osType": "Linux",
    "provisioningState": "Succeeded"
...
```

Once the container moves to the **Succeeded** state, you can reach it in the browser using the IP address provided. 

![App deployed using Azure Container Instances viewed in browser][aci-app-browser]

## Pull the container logs

You can pull the logs for the container you created using the `logs` command:

```azurecli-interactive
az container logs --name mycontainer --resource-group myResourceGroup
```

Output:

```bash
listening on port 80
::ffff:10.240.255.105 - - [21/Jul/2017:00:01:46 +0000] "GET / HTTP/1.1" 200 1663 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
::ffff:10.240.255.105 - - [21/Jul/2017:00:01:46 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://104.210.39.122/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## Delete the container

When you are done with the container, you can remove it using the `delete` command:

```azurecli-interactive
az container delete --name mycontainer --resource-group myResourceGroup
```

## Next steps

All of the code for the container used in this quick start is available [on GitHub][app-github-repo], along with its Dockerfile. If you'd like to try building it yourself and deploying it to Azure Container Instances using the Azure Container Registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials](./container-instances-tutorial-prepare-app.md)


<!-- LINKS -->
[app-github-repo]: https://github.com/Azure-Samples/aci-helloworld.git

<!-- IMAGES -->
[aci-app-browser]: ./media/container-instances-quickstart/aci-app-browser.png