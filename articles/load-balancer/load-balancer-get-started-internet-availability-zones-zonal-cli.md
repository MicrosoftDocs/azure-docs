---
title: Create a Load Balancer with zonal frontend - Azure CLI
titlesuffix: Azure Load Balancer
description: Learn how to create a Standard Load Balancer with zonal frontend using Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
manager: twooley
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/26/2018
ms.author: kumud
---

#  Create a Standard Load Balancer with zonal frontend using Azure CLI

This article steps through creating a public [Standard Load Balancer](https://aka.ms/azureloadbalancerstandard) with a zonal frontend. Having a zonal frontend means that any inbound or outbound flow is served by a single zone in a region. You can create a load balancer with a zonal frontend by using a zonal Standard Public IP address in its frontend configuration. To understand how availability zones work with Standard Load Balancer, see [Standard Load Balancer and Availability zones](load-balancer-standard-availability-zones.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, make sure that you have installed the latest [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) and are logged in to an Azure account with [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest).

> [!NOTE]
> Support for Availability Zones is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 


## Create a resource group

Create a resource group using the following command:

```azurecli-interactive
az group create --name myResourceGroupZLB --location westeurope
```

## Create a public Standard IP address

Create a zonal Standard Public IP address using the following command:

```azurecli-interactive
az network public-ip create --resource-group myResourceGroupZLB --name myPublicIPZonal --sku Standard --zone 1
```

## Create a load balancer

Create a Public Standard Load Balancer with the Standard Public IP that you created in the preceding step using the following command:

```azurecli-interactive
az network lb create --resource-group myResourceGroupZLB --name myLoadBalancer --public-ip-address myPublicIPZonal --frontend-ip-name myFrontEnd --backend-pool-name myBackEndPool --sku Standard
```

## Create an LB probe on port 80

Create a load balancer health probe using the following command:

```azurecli-interactive
az network lb probe create --resource-group myResourceGroupZLB --lb-name myLoadBalancer \
  --name myHealthProbe --protocol tcp --port 80
```

## Create an LB rule for port 80

Create a load balancer rule using the following command:

```azurecli-interactive
az network lb rule create --resource-group myResourceGroupZLB --lb-name myLoadBalancer --name myLoadBalancerRuleWeb \
  --protocol tcp --frontend-port 80 --backend-port 80 --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool --probe-name myHealthProbe
```

## Next steps
- Learn more about [Standard Load Balancer and Availability zones](load-balancer-standard-availability-zones.md).



