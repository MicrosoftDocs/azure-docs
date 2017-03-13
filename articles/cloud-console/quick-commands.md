---
title: Azure Cloud Console quick commands | Microsoft Docs
description: Quick commands for the Azure Cloud Console.
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/09/2017
ms.author: juluk
---
# Quick commands for the Azure Cloud Console

Here are some quick examples of what you can do from the Azure Cloud Console.

## Create a resource group.

```azurecli
az group create --name myResourceGroup --location westeurope
```

## Create a new virtual machine, this creates SSH keys if not present.

```azurecli
az vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --generate-ssh-keys
```

## Open port 80 to allow web traffic to host.

```azurecli
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

## Install Docker and start container.

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name DockerExtension \
  --publisher Microsoft.Azure.Extensions \
  --version 1.1 \
  --settings '{"docker": {"port": "2375"},"compose": {"web": {"image": "nginx","ports": ["80:80"]}}}'
```