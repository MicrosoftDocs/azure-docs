---
title: Create a zoned Public IP address with the Azure CLI | Microsoft Docs
description: Create a public IP in an availability zone with the Azure CLI.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/19/2017
ms.author: jdial
ms.custom: 
---

# Create a public IP address in an availability zone with the Azure CLI

You can deploy a public IP address in an Azure availability zone (preview). An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. You learn how to:

> * Create a public IP address in an availability zone
> * Identify related resources created in the availability zone

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI greater than version 2.0.17. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a zonal public IP address

Create a public IP address in an availability zone using the following command:


```azurecli-interactive
az network public-ip create --resource-group myResourceGroup --name myPublicIp --zone 2 --location westeurope
```

## Get zone information about a public IP address

Get the zone information of a public IP address using the following command:

```azurecli-interactive
az network public-ip show --resource-group myResourceGroup --name myPublicIp
```

## Next steps

- Learn more about [Availability zones](../availability-zones/az-overview.md)
- Learn more about [public IP addresses](virtual-network-public-ip-address.md) 
