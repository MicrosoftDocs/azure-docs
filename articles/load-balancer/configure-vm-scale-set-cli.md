---
title: Configure virtual machine scale set with an existing Azure Load Balancer - Azure CLI
description: Learn how to configure a virtual machine scale set with an existing Azure Load Balancer by using the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: how-to
ms.date: 03/25/2020
---

# Configure a virtual machine scale set with an existing Azure Load Balancer using the Azure CLI

In this article, you'll learn how to configure a virtual machine scale set with an existing Azure Load Balancer.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

 - You need an existing standard sku load balancer in the subscription where the virtual machine scale set will be deployed.

 - You need an Azure Virtual Network for the virtual machine scale set.

 - This article requires version 2.0.28 or later of the Azure CLI. Run [az version](/cli/azure/reference-index#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az_upgrade).

## Sign in to Azure CLI

Sign into Azure.

```azurecli-interactive
az login
```

## Deploy a virtual machine scale set with existing load balancer

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

The below example deploys a virtual machine scale set with:

- Virtual machine scale set named **myVMSS**
- Azure Load Balancer named **myLoadBalancer**
- Load balancer backend pool named **myBackendPool**
- Azure Virtual Network named **myVnet**
- Subnet named **mySubnet**
- Resource group named **myResourceGroup**
- Ubuntu Server image for the virtual machine scale set

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

In this article, you deployed a virtual machine scale set with an existing Azure Load Balancer.  To learn more about virtual machine scale sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are virtual machine scale sets?](../virtual-machine-scale-sets/overview.md)
                                