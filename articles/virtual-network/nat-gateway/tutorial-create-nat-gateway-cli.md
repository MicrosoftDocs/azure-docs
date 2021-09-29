---
title: 'Tutorial: Create a NAT gateway - Azure CLI'
titlesuffix: Azure Virtual Network NAT
description: Get started created a NAT gateway using the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial 
ms.date: 03/10/2021
ms.custom: template-tutorial, devx-track-azurecli
---

# Tutorial: Create a NAT gateway using the Azure CLI

This tutorial shows you how to use Azure Virtual Network NAT service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network.
> * Create a virtual machine.
> * Create a NAT gateway and associate with the virtual network.
> * Connect to virtual machine and verify NAT IP address.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az_group_create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroupNAT** in the **eastus2** location:

```azurecli-interactive
  az group create \
    --name myResourceGroupNAT \
    --location eastus2
```

## Create the NAT gateway

In this section we create the NAT gateway and supporting resources.

### Create public IP address

To access the Internet, you need one or more public IP addresses for the NAT gateway. Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address resource named **myPublicIP** in **myResourceGroupNAT**. 

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupNAT \
    --name myPublicIP \
    --sku standard \
    --allocation static
```

### Create NAT gateway resource

Create a global Azure NAT gateway with [az network nat gateway create](/cli/azure/network/nat#az_network_nat_gateway_create). The result of this command will create a gateway resource named **myNATgateway** that uses the public IP address **myPublicIP**. The idle timeout is set to 10 minutes.  

```azurecli-interactive
  az network nat gateway create \
    --resource-group myResourceGroupNAT \
    --name myNATgateway \
    --public-ip-addresses myPublicIP \
    --idle-timeout 10       
  ```

### Create virtual network

Create a virtual network named **myVnet** with a subnet named **mySubnet** [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) in the **myResourceGroup** resource group. The IP address space for the virtual network is **10.1.0.0/16**. The subnet within the virtual network is **10.1.0.0/24**.

```azurecli-interactive
  az network vnet create \
    --resource-group myResourceGroupNAT \
    --location eastus2 \
    --name myVnet \
    --address-prefix 10.1.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 10.1.0.0/24
```

### Create bastion host

Create an Azure Bastion host named **myBastionHost** to access the virtual machine. 

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a Azure Bastion subnet.

```azurecli-interactive
az network vnet subnet create \
    --resource-group myResourceGroupNAT \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.1.1.0/24
```

Create a public IP address for the bastion host with [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create). 

```azurecli-interactive
az network public-ip create \
    --resource-group myResourceGroupNAT \
    --name myBastionIP \
    --sku Standard
```

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create the bastion host. 

```azurecli-interactive
az network bastion create \
    --resource-group myResourceGroupNAT \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus2
```

### Configure NAT service for source subnet

We'll configure the source subnet **mySubnet** in virtual network **myVnet** to use a specific NAT gateway resource **myNATgateway** with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update). This command will activate the NAT service on the specified subnet.

```azurecli-interactive
  az network vnet subnet update \
    --resource-group myResourceGroupNAT \
    --vnet-name myVnet \
    --name mySubnet \
    --nat-gateway myNATgateway
```

All outbound traffic to Internet destinations is now using the NAT gateway.  It's not necessary to configure a UDR.


## Virtual machine

In this section, you'll create a virtual machine to test the NAT gateway to verify the public IP address of the outbound connection.

Create the virtual machine with [az vm create](/cli/azure/vm#az_vm_create).

```azurecli-interactive
az vm create \
    --name myVM \
    --resource-group myResourceGroupNAT  \
    --admin-username azureuser \
    --image win2019datacenter \
    --public-ip-address "" \
    --subnet mySubnet \
    --vnet-name myVNet
```

Wait for the virtual machine creation to complete before moving on to the next section.

## Test NAT gateway

In this section, we'll test the NAT gateway. We'll first discover the public IP of the NAT gateway. We'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. Sign in to the [Azure portal](https://portal.azure.com)

1. Find the public IP address for the NAT gateway on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP**.

2. Make note of the public IP address:

    :::image type="content" source="./media/tutorial-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

3. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM** that is located in the **myResourceGroupNAT** resource group.

4. On the **Overview** page, select **Connect**, then **Bastion**.

5. Select the blue **Use Bastion** button.

6. Enter the username and password entered during VM creation.

7. Open **Internet Explorer** on **myTestVM**.

8. Enter **https://whatsmyip.com** in the address bar.

9. Verify the IP address displayed matches the NAT gateway address you noted in the previous step:

    :::image type="content" source="./media/tutorial-create-nat-gateway-portal/my-ip.png" alt-text="Internet Explorer showing external outbound IP" border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following steps:

```azurecli-interactive 
  az group delete \
    --name myResourceGroupNAT
```

## Next steps

For more information on Azure Virtual Network NAT, see:
> [!div class="nextstepaction"]
> [Virtual Network NAT overview](nat-overview.md)
