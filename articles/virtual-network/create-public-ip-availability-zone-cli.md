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
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/25/2017
ms.author: jdial
ms.custom: 
---

# Create a public IP address in an availability zone with the Azure CLI

You can deploy a public IP address in an Azure availability zone (preview). An availability zone is a physically separate zone in an Azure region. Learn how to:

> * Create a public IP address in an availability zone
> * Identify related resources created in the availability zone

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires that you are running a version of the Azure CLI greater than version 2.0.17. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

> [!NOTE]
> Availability zones are in preview and are ready for your development and test scenarios. Support is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md).

## Create a zonal public IP address

Create a public IP address in an availability zone using the following command:


```azurecli-interactive
az network public-ip create --resource-group myResourceGroup --name myPublicIp --zone 2 --location westeurope
```
> [!NOTE]
> When you assign a standard SKU public IP address to a virtual machine’s network interface, you must explicitly allow the intended traffic with a [network security group](security-overview.md#network-security-groups). Communication with the resource fails until you create and associate a network security group and explicitly allow the desired traffic.

## Get zone information about a public IP address

Get the zone information of a public IP address using the following command:

```azurecli-interactive
az network public-ip show --resource-group myResourceGroup --name myPublicIp
```

## Next steps

- Learn more about [availability zones](https://docs.microsoft.com/azure/availability-zones/az-overview)
- Learn more about [public IP addresses](../virtual-network/virtual-network-public-ip-address.md) 
