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

Deploy the template:

```bash
az group deployment create \
  --name AciDeployment \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json
  --parameters @azuredeploy.parameters.json
```

Within a few seconds, you will receive an initial response from Azure Resource Manager. To view the state of the deployment, use:

```bash
az group deployment show -n AciDeployment -g myResourceGroup
```

You can also view the state of your container group using:

```bash
az container show -n aci-tutorial -g myResourceGroup
```

Note the public IP address that has been provisioned for your container group.

## View the application and container logs

Once the deployment succeeds, you can open your browser to the IP address shown in the output of `az container show`.

You can also view the log output of the main application container and the sidecar.

Main app:

```bash
az container logs --name aci-tutorial --container-name aci-tutorial-app -g myResourceGroup
```

Output:

```bash
Server running...
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663 "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET /favicon.ico HTTP/1.1" 404 19
```

Sidecar:

```bash
az container logs --name aci-tutorial --container-name aci-tutorial-sidecar -g myResourceGroup
```

Output:

```bash
Every 3.0s: curl -I http://localhost                                                                                                                       Mon Jul 17 11:27:36 2017

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0  1663    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 1663
Content-Type: text/html; charset=utf-8
Last-Modified: Sun, 16 Jul 2017 02:08:22 GMT
Date: Mon, 17 Jul 2017 18:27:36 GMT
```

As you can see, the sidecar is periodically making a HTTP request to the main web application via the group's local network to ensure that it is running. In a real application, the sidecar could be expanded to trigger an alert if it received a HTTP response code other than 200 OK. 

## Next steps

In this tutorial, you completed the process of deploying your containers to Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Configuring an Azure Resource Manager template
> * Deploying the containers to Azure Container Instances
> * Viewing the container logs with the Azure CLI


<!-- LINKS -->
[prepare-app]: ./container-instances-tutorial-prepare-app.md