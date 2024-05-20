---
title: Create a VM with a static public IP address - Azure CLI
titlesuffix: Azure Virtual Network
description: Create a virtual machine (VM) with a static public IP address using the Azure CLI. Static public IP addresses are addresses that never change.
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, devx-track-azurecli 
ms.devlang: azurecli
---

# Create a virtual machine with a static public IP address using the Azure CLI

In this article, you'll create a VM with a static public IP address. A public IP address enables communication to a virtual machine from the internet. Assign a static public IP address, instead of a dynamic address, to ensure the address never changes. 

Public IP addresses have a [nominal charge](https://azure.microsoft.com/pricing/details/ip-addresses). There's a [limit](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) to the number of public IP addresses that you can use per subscription.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a standard public IPv4 address.

The following command creates a zone-redundant public IP address named **myPublicIP** in **myResourceGroup**.

```azurecli-interactive
az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP \
    --version IPv4 \
    --sku Standard \
    --zone 1 2 3
```
## Create a virtual machine

Create a virtual machine with [az vm create](/cli/azure/vm#az-vm-create). 

The following command creates a Windows Server virtual machine. You'll enter the name of the public IP address created previously in the **`-PublicIPAddressName`** parameter. When prompted, provide a username and password to be used as the credentials for the virtual machine:

```azurecli-interactive
  az vm create \
    --name myVM \
    --resource-group TutorVMRoutePref-rg \
    --public-ip-address myPublicIP \
    --size Standard_A2 \
    --image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
    --admin-username azureuser
```

For more information on public IP SKUs, see [Public IP address SKUs](public-ip-addresses.md#sku). A virtual machine can be added to the backend pool of an Azure Load Balancer. The SKU of the public IP address must match the SKU of a load balancer's public IP. For more information, see [Azure Load Balancer](../../load-balancer/skus.md).

View the public IP address assigned and confirm that it was created as a static address, with [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show):

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroup \
    --name myPublicIP \
    --query [ipAddress,publicIpAllocationMethod,sku] \
    --output table
```

> [!WARNING]
> Do not modify the IP address settings within the virtual machine's operating system. The operating system is unaware of Azure public IP addresses. Though you can add private IP address settings to the operating system, we recommend not doing so unless necessary, and not until after reading [Add a private IP address to an operating system](virtual-network-network-interface-addresses.md#private).

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains:

```azurecli-interactive
  az group delete --name myResourceGroup --yes
```

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure virtual machine.
- Learn more about creating [Linux](../../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Windows](../../virtual-machines/windows/tutorial-manage-vm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machines.
