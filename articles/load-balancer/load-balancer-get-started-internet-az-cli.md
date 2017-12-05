---
title: Create a public Load Balancer Standard with zone-redundant Public IP address frontend using Azure CLI | Microsoft Docs
description: Learn how to create a public Load Balancer Standard with zone-redundant Public IP address frontend using Azure CLI
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/20/2017
ms.author: kumud
---

#  Create a public Load Balancer Standard with zone-redundant frontend using Azure CLI

This article steps through creating a public [Load Balancer Standard](https://aka.ms/azureloadbalancerstandard) with a zone-redundant frontend using a Public IP Standard address.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Register for Availability Zones, Load Balancer Standard, and Public IP Standard Preview

If you choose to install and use the CLI locally, this tutorial requires that you are running Azure CLI version 2.0.17 or higher.  To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

>[!NOTE]
[Load Balancer Standard SKU](https://aka.ms/azureloadbalancerstandard) is currently in Preview. During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use the Generally Available [Load Balancer Basic SKU](load-balancer-overview.md) for your production services. 

> [!NOTE]
> Availability zones are in preview and are ready for your development and test scenarios. Support is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  

Before selecting a zone or zone-redundant option for the frontend Public IP Address for the Load Balancer, you must first complete the steps in [register for the availability zones preview](https://docs.microsoft.com/azure/availability-zones/az-overview).

Make sure that you have installed the latest [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)and are logged in to an Azure account with [az login](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest#login).

## Create a resource group

Create a resource group using the following command:

```azurecli-interactive
az group create --name myResourceGroup --location westeurope
```

## Create a public IP Standard

Create a Public IP Standard using the following command:

```azurecli-interactive
az network public-ip create --resource-group myResourceGroup --name myPublicIP --sku Standard
```

## Create a load balancer

Create a Public Load Balancer Standard with the Standard Public IP that you created in the preceding step using the following command:

```azurecli-interactive
az network lb create --resource-group myResourceGroup --name myLoadBalancer --public-ip-address myPublicIP --frontend-ip-name myFrontEndPool --backend-pool-name myBackEndPool --sku Standard
```

## Create an LB probe on port 80

Create a load balancer health probe using the following command:

```azurecli-interactive
az network lb probe create --resource-group myResourceGroup --lb-name myLoadBalancer \
  --name myHealthProbe --protocol tcp --port 80
```

## Create an LB rule for port 80

Create a load balancer rule using the following command:

```azurecli-interactive
az network lb rule create --resource-group myResourceGroup --lb-name myLoadBalancer --name myLoadBalancerRuleWeb \
  --protocol tcp --frontend-port 80 --backend-port 80 --frontend-ip-name myFrontEndPool \
  --backend-pool-name myBackEndPool --probe-name myHealthProbe
```

## Next steps
- Learn how [create a Public IP in an availability zone](../virtual-network/create-public-ip-availability-zone-cli.md)



