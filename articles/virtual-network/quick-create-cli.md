---
title: Create a virtual network - quickstart - Azure CLI
titlesuffix: Azure Virtual Network
description: In this quickstart, learn to create a virtual network using the Azure CLI. A virtual network lets Azure resources communicate with each other and with the internet.
author: KumudD
# Customer intent: I want to create a virtual network so that virtual machines can communicate with privately with each other and with the internet.
ms.service: virtual-network
ms.topic: quickstart
ms.date: 03/06/2021
ms.author: kumud 
ms.custom: devx-track-azurecli
---

# Quickstart: Create a virtual network using the Azure CLI

A virtual network enables Azure resources, like virtual machines (VMs), to communicate privately with each other, and with the internet. 

In this quickstart, you learn how to create a virtual network. After creating a virtual network, you deploy two VMs into the virtual network. You then connect to the VMs from the internet, and communicate privately over the new virtual network.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group and a virtual network

Before you can create a virtual network, you have to create a resource group to host the virtual network. Create a resource group with [az group create](/cli/azure/group#az_group_create). This example creates a resource group named **CreateVNetQS-rg** in the **Eastus** location:

```azurecli-interactive
az group create \
    --name CreateVNetQS-rg \
    --location eastus
```

Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create). This example creates a default virtual network named **myVNet** with one subnet named **default**:

```azurecli-interactive
az network vnet create \
  --name myVNet \
  --resource-group CreateVNetQS-rg \
  --subnet-name default
```

## Create virtual machines

Create two VMs in the virtual network.

### Create the first VM

Create a VM with [az vm create](/cli/azure/vm#az_vm_create). 

If SSH keys don't already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. 

The `--no-wait` option creates the VM in the background. You can continue to the next step. 

This example creates a VM named **myVM1**:

```azurecli-interactive
az vm create \
  --resource-group CreateVNetQS-rg \
  --name myVM1 \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --public-ip-address myPublicIP-myVM1 \
  --no-wait
```

### Create the second VM

You used the `--no-wait` option in the previous step. You can go ahead and create the second VM named **myVM2**.

```azurecli-interactive
az vm create \
  --resource-group CreateVNetQS-rg \
  --name myVM2 \
  --image UbuntuLTS \
  --public-ip-address myPublicIP-myVM2 \
  --generate-ssh-keys
```

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

### Azure CLI output message

The VMs take a few minutes to create. After Azure creates the VMs, the Azure CLI returns output like this:

```output
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/CreateVNetQS-rg/providers/Microsoft.Compute/virtualMachines/myVM2",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.5",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "CreateVNetQS-rg"
  "zones": ""
}
```

## VM public IP

To get the public IP address **myVM2**, use [az network public-ip show](/cli/azure/network/public-ip#az_network_public_ip_show):

```azurecli-interactive
az network public-ip show \
  --resource-group CreateVNetQS-rg  \
  --name myPublicIP-myVM2 \
  --query ipAddress \
  --output tsv
```

## Connect to a VM from the internet

In this command, replace `<publicIpAddress>` with the public IP address of your **myVM2** VM:

```bash
ssh <publicIpAddress>
```

## Communicate between VMs

To confirm private communication between the **myVM2** and **myVM1** VMs, enter this command:

```bash
ping myVM1 -c 4
```

You'll receive four replies from *10.0.0.4*.

Exit the SSH session with the **myVM2** VM.

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group and all the resources it has:

```azurecli-interactive
az group delete \
    --name CreateVNetQS-rg \
    --yes
```

## Next steps

In this quickstart: 

* You created a default virtual network and two VMs. 
* You connected to one VM from the internet and communicated privately between the two VMs.

Private communication between VMs is unrestricted in a virtual network. 

Advance to the next article to learn more about configuring different types of VM network communications:
> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
