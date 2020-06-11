---
title: 'Tutorial: Create a NAT gateway - Azure CLI'
titlesuffix: Azure Virtual Network NAT
description: This quickstart shows how to create a NAT gateway using the Azure CLI
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to create a NAT gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.subservice: nat
ms.devlang: na
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 02/18/2020
ms.author: allensu
---

# Tutorial: Create a NAT gateway using Azure CLI

This tutorial shows you how to use Azure Virtual Network NAT service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can complete this tutorial using Azure Cloud Shell or run the respective commands locally.  If you have never used Azure Cloud Shell, [sign in now](https://shell.azure.com) to go through the initial setup.
If you choose to run these commands locally, you need to install CLI.  This tutorial requires that you're running a version of the Azure CLI version 2.0.71 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).


## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroupNAT** in the **eastus2** location:

```azurecli-interactive
  az group create \
    --name myResourceGroupNAT \
    --location eastus2
```

## Create the NAT Gateway

### Create a public IP address

To access the public Internet, you need one or more public IP addresses for the NAT gateway. Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip) to create a public IP address resource named **myPublicIP** in **myResourceGroupNAT**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupNAT \
    --name myPublicIP \
    --sku standard
```

### Create a public IP prefix

You can use one or more public IP address resources, public IP prefixes, or both with NAT gateway. We"ll add a public IP prefix resource to this scenario to demonstrate.   Use [az network public-ip prefix create](https://docs.microsoft.com/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create) to create a public IP prefix resource named **myPublicIPprefix** in **myResourceGroupNAT**.

```azurecli-interactive
  az network public-ip prefix create \
    --resource-group myResourceGroupNAT \
    --name myPublicIPprefix \
    --length 31
```

### Create a NAT gateway resource

This section details how you can create and configure the following components of the NAT service using the NAT gateway resource:
  - A public IP pool and public IP prefix to use for outbound flows translated by the NAT gateway resource.
  - Change the idle timeout from the default of 4 minutes to 10 minutes.

Create a global Azure NAT gateway with [az network nat gateway create](https://docs.microsoft.com/cli/azure/network/nat?view=azure-cli-latest) named **myNATgateway**. The command uses both the public IP address **myPublicIP** and the public IP prefix **myPublicIPprefix**. The command changes the idle timeout to **10** minutes.

```azurecli-interactive
  az network nat gateway create \
    --resource-group myResourceGroupNAT \
    --name myNATgateway \
    --public-ip-addresses myPublicIP \
    --public-ip-prefixes myPublicIPprefix \
    --idle-timeout 10       
  ```

At this point, the NAT gateway is functional and all that is missing is to configure which subnets of a virtual network should use it.

## Configure virtual network

Before you deploy a VM and can use your NAT gateway, we need to create the virtual network.

Create a virtual network named **myVnet** with a subnet named **mySubnet** in the **myResourceGroupNAT** using [az network vnet create](https://docs.microsoft.com/cli/azure/network/vnet).  The IP address space for the virtual network is **192.168.0.0/16**. The subnet within the virtual network is **192.168.0.0/24**.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroupNAT \
    --location eastus2 \
    --name myVnet \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 192.168.0.0/24
```

### Configure NAT service for source subnet

We'll configure the source subnet **mySubnet** in virtual network **myVnet** to use a specific NAT gateway resource **myNATgateway** with [az network vnet subnet update](https://docs.microsoft.com/cli/azure/network/vnet/subnet).  This command will activate the NAT service on the specified subnet.

```azurecli-interactive
  az network vnet subnet update \
    --resource-group myResourceGroupNAT \
    --vnet-name myVnet \
    --name mySubnet \
    --nat-gateway myNATgateway
```

All outbound traffic to Internet destinations is now using the NAT gateway.  It's not necessary to configure a UDR.

## Create a VM to use the NAT service

We'll now create a VM to use the NAT service.  This VM has a public IP to use as an instance-level Public IP to allow you to access the VM.  NAT service is flow direction aware and will replace the default Internet destination in your subnet. The VM's public IP address won't be used for outbound connections.

### Create public IP for source VM

We create a public IP to be used to access the VM.  Use [az network public-ip create](https://docs.microsoft.com/cli/azure/network/public-ip) to create a public IP address resource named **myPublicIPVM** in **myResourceGroupNAT**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupNAT \
    --name myPublicIPVM \
    --sku standard
```

### Create an NSG for VM

Because Standard Public IP addresses are 'secure by default', we need to create an NSG to allow inbound access for ssh access. Use [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create) to create an NSG resource named **myNSG** in **myResourceGroupNAT**.

```azurecli-interactive
  az network nsg create \
    --resource-group myResourceGroupNAT \
    --name myNSG 
```

### Expose SSH endpoint on source VM

We create a rule in the NSG for SSH access to the source vm. Use [az network nsg rule create](https://docs.microsoft.com/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create) to create an NSG rule named **ssh** in the NSG named **myNSG** in **myResourceGroupNAT**.

```azurecli-interactive
  az network nsg rule create \
    --resource-group myResourceGroupNAT \
    --nsg-name myNSG \
    --priority 100 \
    --name ssh \
    --description "SSH access" \
    --access allow \
    --protocol tcp \
    --direction inbound \
    --destination-port-ranges 22
```

### Create NIC for VM

Create a network interface with [az network nic create](/cli/azure/network/nic#az-network-nic-create) and associate with the Public IP address and the network security group. 

```azurecli-interactive
  az network nic create \
    --resource-group myResourceGroupNAT \
    --name myNic \
    --vnet-name myVnet \
    --subnet mySubnet \
    --public-ip-address myPublicIPVM \
    --network-security-group myNSG
```

### Create VM

Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).  We generate ssh keys for this VM and store the private key to use later.

 ```azurecli-interactive
  az vm create \
    --resource-group myResourceGroupNAT \
    --name myVM \
    --nics myNic \
    --image UbuntuLTS \
    --generate-ssh-keys
```

Wait for the VM to deploy then continue with the rest of the steps.

## Discover the IP address of the VM

First we need to discover the IP address of the VM you've created. To retrieve the public IP address of the VM, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroupNAT \
    --name myPublicIPVM \
    --query [ipAddress] \
    --output tsv
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it to access the VM.

### Sign in to VM

The SSH credentials should be stored in your Cloud Shell from the previous operation.  Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine.

```bash
ssh <ip-address-destination>
```

You're now ready to use the NAT service.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group and all resources contained within.

```azurecli-interactive 
  az group delete \
    --name myResourceGroupNAT
```

## Next steps

In this tutorial, you created a NAT gateway and a VM to use it. 

Review metrics in Azure Monitor to see your NAT service operating. Diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is addressed by adding additional public IP address resources or public IP prefix resources or both.


- Learn about [Azure Virtual Network NAT](./nat-overview.md)
- Learn about [NAT gateway resource](./nat-gateway-resource.md).
- Quickstart for deploying [NAT gateway resource using Azure CLI](./quickstart-create-nat-gateway-cli.md).
- Quickstart for deploying [NAT gateway resource using Azure PowerShell](./quickstart-create-nat-gateway-powershell.md).
- Quickstart for deploying [NAT gateway resource using Azure portal](./quickstart-create-nat-gateway-portal.md).
> [!div class="nextstepaction"]

