---
title: Configure Virtual Machine Scale Set with an existing Azure Load Balancer - Azure CLI
description: Learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer using the Azure CLI.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 12/15/2022
ms.custom: template-how-to, engagement-fy23, devx-track-azurecli
---

# Configure a Virtual Machine Scale Set with an existing Azure Load Balancer using the Azure CLI

In this article, you'll learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer.

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- You need an existing standard sku load balancer in the subscription where the Virtual Machine Scale Set will be deployed.

- You need an Azure Virtual Network for the Virtual Machine Scale Set.
 
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Deploy a Virtual Machine Scale Set with existing load balancer

Deploy a Virtual Machine Scale Set with [`az vmss create`](/cli/azure/vmss#az-vmss-create).
Replace the values in brackets with the names of the resources in your configuration.

```azurecli-interactive
az vmss create \
    --resource-group <resource-group> \
    --name <vmss-name>\
    --image <your-image> \
    --admin-username <admin-username> \
    --generate-ssh-keys  \
    --upgrade-policy-mode Automatic \
    --instance-count 3 \
    --vnet-name <virtual-network-name> \
    --subnet <subnet-name> \
    --lb <load-balancer-name> \
    --backend-pool-name <backend-pool-name>
```

The below example deploys a Virtual Machine Scale Set with:

- Virtual Machine Scale Set named **myVMSS**
- Azure Load Balancer named **myLoadBalancer**
- Load balancer backend pool named **myBackendPool**
- Azure Virtual Network named **myVnet**
- Subnet named **mySubnet**
- Resource group named **myResourceGroup**
- Ubuntu Server image for the Virtual Machine Scale Set

```azurecli-interactive
az vmss create \
    --resource-group myResourceGroup \
    --name myVMSS \
    --image Canonical:UbuntuServer:18.04-LTS:latest \
    --admin-username adminuser \
    --generate-ssh-keys \
    --upgrade-policy-mode Automatic \
    --instance-count 3 \
    --vnet-name myVnet\
    --subnet mySubnet \
    --lb myLoadBalancer \
    --backend-pool-name myBackendPool
```
> [!NOTE]
> After the scale set has been created, the backend port cannot be modified for a load balancing rule used by a health probe of the load balancer. To change the port, you can remove the health probe by updating the Azure virtual machine scale set, update the port and then configure the health probe again.

## Next steps

In this article, you deployed a Virtual Machine Scale Set with an existing Azure Load Balancer.  To learn more about Virtual Machine Scale Sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are Virtual Machine Scale Sets?](../virtual-machine-scale-sets/overview.md)
                                
