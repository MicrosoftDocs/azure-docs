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
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/19/2017
ms.author: seanmck
---

# Deploy a container group

This is the last of a three-part tutorial. In previous sections, [a container image was created](container-instances-tutorial-prepare-app.md) and [pushed to an Azure Container Registry](container-instances-tutorial-prepare-acr.md). This section completes the tutorial by deploying the container to Azure Container Instances. Steps completed include:

> [!div class="checklist"]
> * Defining a container group using an Azure Resource Manager template
> * Deploying the container group using the Azure CLI
> * Viewing container logs

## Deploy the container using the Azure CLI

The Azure CLI enables deployment of a container to Azure Container Instances in a single command. Since the container image is hosted in the private Azure Container Registry, you must include the credentials required to access it. If necessary, you can query them as shown:

```azurecli-interactive
az acr credential show --name <acrName>
```

To deploy your container image from the container registry, run the following command:

```azurecli-interactive
az container create --name aci-tutorial-app --image mycontainerregistry082.azurecr.io/aci-tutorial-app --image-registry-login-server mycontainerregistry082.azurecr.io --image-registry-username <acrUsername> --image-registry-password <acrPassword> --ip-address public -g myResourceGroup
```

Within a few seconds, you will receive an initial response from Azure Resource Manager. To view the state of the deployment, use:

```azurecli-interactive
az container show --name aci-tutorial-app -g myResourceGroup
```

The output includes the public IP address that you can use to access the app in the browser.

```json
...
"ipAddress": {
      "ip": "13.88.176.27",
      "ports": [
        {
          "port": 80,
          "protocol": "TCP"
        }
      ]
    }
...
```


## View the application and container logs

Once the deployment succeeds, you can open your browser to the IP address shown in the output of `az container show`.

![Hello world app in the browser][aci-app-browser]

You can also view the log output of the container:

```azurecli-interactive
az container logs --name aci-tutorial-app -g myResourceGroup
```

Output:

```bash
Server running...
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663 "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET /favicon.ico HTTP/1.1" 404 19
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