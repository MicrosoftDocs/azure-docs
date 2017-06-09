---
title: Azure Container Service tutorial - Prepare App | Microsoft Docs
description: Azure Container Service tutorial - Prepare App 
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/30/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Prepare App

```bash
git clone https://github.com/jpoon/voting-app-kubernetes.git
```

```bash
docker build ./vote-app-kubernetes/vote -t demo-front
```

```bash
docker build ./vote-app-kubernetes/worker -t demo-worker
```

```bash
docker build ./vote-app-kubernetes/result -t demo-result
```

```bash
docker images
```

Output:

```bash
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
demo-result         latest              0963ee8d8f93        3 seconds ago       235 MB
demo-worker         latest              7daf3e8f529e        2 minutes ago       975 MB
demo-front          latest              c80264b0b782        4 minutes ago       91.6 MB
```

## Create app storage account

```azurecli-interactive
az storage account create --resource-group myResourceGroup --name myappstorage$RANDOM --sku Standard_LRS
```


