---
title: 'Quickstart: Create a NAT gateway - Azure CLI'
titlesuffix: Azure NAT Gateway
description: Get started creating a NAT gateway using the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: quickstart 
ms.date: 06/22/2023
ms.custom: template-quickstart, devx-track-azurecli
---

# Quickstart: Create a NAT gateway using the Azure CLI

In this quickstart, learn how to create a NAT gateway by using the Azure CLI. The NAT Gateway service provides outbound connectivity for virtual machines in Azure.

:::image type="content" source="./media/quickstart-create-nat-gateway-portal/nat-gateway-qs-resources.png" alt-text="Diagram of resources created in nat gateway quickstart.":::

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]


## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```

## Create the NAT gateway

In this section, create the NAT gateway and supporting resources.

### Create public IP address

To access the Internet, you need one or more public IP addresses for the NAT gateway. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address resource.

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-nat \
    --sku Standard \
    --location eastus2 \
    --zone 1 2 3
```

### Create NAT gateway resource

Create an Azure NAT gateway with [az network nat gateway create](/cli/azure/network/nat#az-network-nat-gateway-create). The result of this command creates a gateway resource that uses the public IP address defined in the previous step. The idle timeout is set to 10 minutes.  

```azurecli-interactive
az network nat gateway create \
    --resource-group test-rg \
    --name nat-gateway \
    --public-ip-addresses public-ip-nat \
    --idle-timeout 10 \
    --location eastus2
```

### Create virtual network

Create a virtual network with a subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The IP address space for the virtual network is **10.0.0.0/16**. The subnet within the virtual network is **10.0.0.0/24**.

```azurecli-interactive
az network vnet create \
    --name vnet-1 \
    --resource-group test-rg \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24 \
    --location eastus2
```

### Create bastion host subnet

Create an Azure Bastion host to access the virtual machine.

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create an Azure Bastion subnet.

```azurecli-interactive
az network vnet subnet create \
    --name AzureBastionSubnet \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --address-prefix 10.0.1.0/26
```

### Create public IP address for the bastion host

Create a public IP address for the bastion host with [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip \
    --sku Standard \
    --location eastus2 \
    --zone 1 2 3
```

### Create the bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create the bastion host.

[!INCLUDE [Pricing](../../includes/bastion-pricing.md)] For more information about Azure Bastion, see [Azure Bastion](~/articles/bastion/bastion-overview.md).

```azurecli-interactive
az network bastion create \
    --name bastion \
    --public-ip-address public-ip \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --location eastus2
```

The bastion host can take several minutes to deploy. Wait for the bastion host to deploy before moving on to the next section.

### Configure NAT service for source subnet

Configure the source subnet in virtual network to use a specific NAT gateway resource with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update). This command activates the NAT service on the specified subnet.

```azurecli-interactive
az network vnet subnet update \
    --name subnet-1 \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --nat-gateway nat-gateway
```

All outbound traffic to Internet destinations is now using the NAT gateway.  It's not necessary to configure a UDR.

## Create virtual machine

Create a virtual machine to test the NAT gateway to verify the public IP address of the outbound connection.

Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive
az vm create \
    --resource-group test-rg \
    --name vm-1 \
    --image Ubuntu2204 \
    --public-ip-address "" \
    --vnet-name vnet-1 \
    --subnet subnet-1 \
    --admin-username azureuser \
    --authentication-type password
```

Wait for the virtual machine creation to complete before moving on to the next section.

## Test NAT gateway

In this section, you test the NAT gateway. You first discover the public IP of the NAT gateway. You then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Public IP**. Select **Public IP addresses** in the search results.

1. Select **public-ip-nat**.

1. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. On the **Overview** page, select **Connect**, then select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password entered during VM creation. Select **Connect**.

1. In the bash prompt, enter the following command:

    ```bash
    curl ifconfig.me
    ```

1. Verify the IP address returned by the command matches the public IP address of the NAT gateway.

    ```output
    azureuser@vm-1:~$ curl ifconfig.me
    20.7.200.36
    ```

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and NAT gateway with the following CLI command:

```azurecli-interactive
  az group delete \
    --name test-rg
```

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Virtual Network NAT overview](nat-overview.md)
