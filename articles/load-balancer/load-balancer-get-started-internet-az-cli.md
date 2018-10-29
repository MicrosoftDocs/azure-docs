---
title: Create a public Load Balancer Standard with zone-redundant Public IP address frontend using Azure CLI | Microsoft Docs
description: Learn how to create a public Load Balancer Standard with zone-redundant Public IP address frontend using Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/22/2018
ms.author: kumud
---

#  Create a public Load Balancer Standard with zone-redundant frontend using Azure CLI

This article steps through creating a public [Load Balancer Standard](https://aka.ms/azureloadbalancerstandard) with a zone-redundant frontend using a Public IP Standard address.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, make sure that you have installed the latest [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) and are logged in to an Azure account with [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az_login).

> [!NOTE]
 Support for Availability Zones is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 


## Create a resource group

Create a resource group using the following command:

```azurecli-interactive
az group create --name myResourceGroupSLB --location westeurope
```

## Create a public IP Standard

Create a Public IP Standard using the following command:

```azurecli-interactive
az network public-ip create --resource-group myResourceGroupSLB --name myPublicIP --sku Standard
```

## Create a load balancer

Create a Public Load Balancer Standard with the Standard Public IP that you created in the preceding step using the following command:

```azurecli-interactive
az network lb create --resource-group myResourceGroupSLB --name myLoadBalancer --public-ip-address myPublicIP --frontend-ip-name myFrontEnd --backend-pool-name myBackEndPool --sku Standard
```

## Create an LB probe on port 80

Create a load balancer health probe using the following command:

```azurecli-interactive
az network lb probe create --resource-group myResourceGroupSLB --lb-name myLoadBalancer \
  --name myHealthProbe --protocol tcp --port 80
```

## Create an LB rule for port 80

Create a load balancer rule using the following command:

```azurecli-interactive
az network lb rule create --resource-group myResourceGroup --lb-name myLoadBalancer --name myLoadBalancerRuleWeb \
  --protocol tcp --frontend-port 80 --backend-port 80 --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool --probe-name myHealthProbe
```

## Next steps
- Learn more about [Standard Load Balancer and Availability zones](load-balancer-standard-availability-zones.md).



