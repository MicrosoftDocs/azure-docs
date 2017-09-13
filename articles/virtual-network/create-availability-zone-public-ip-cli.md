---
title: Create a zoned Public IP with the Azure CLI | Microsoft Docs
description: Create a public IP in an availability zone with the Azure CLI
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/13/2017
ms.author: kumud
ms.custom: 
---

# Create a Public IP in an availability zone with the Azure CLI

You can deploy a Public IP in an Azure availability zone (preview). An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. You learn how to:

> * Create a Public IP in an availability zone
> * Identify related resources created in the availability zone

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.xxx [*TBD*] or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a Public IP in an Availability Zone

You can create a Public IP in an Availability Zone using the following command:


```azurecli-interactive
az public-ip create -g MyResourceGroup -n MyPublicIP --zone 1
```


## Get information about the Public IP in an Availability Zone

You can get the availability zone information using the following command:

```azurecli-interactive
az network public-ip show -g MyResourceGroup -n MyPublicIP
```

## Next step

- Learn more about [Availability Zones] (../availability-zones/az-overview.md)
