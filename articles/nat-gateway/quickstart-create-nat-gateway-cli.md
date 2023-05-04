---
title: 'Quickstart: Create a NAT gateway - Azure CLI'
titlesuffix: Azure NAT Gateway
description: Get started creating a NAT gateway using the Azure CLI.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: quickstart 
ms.date: 02/04/2022
ms.custom: template-quickstart, devx-track-azurecli
---

# Quickstart: Create a NAT gateway using the Azure CLI

This quickstart shows you how to use the Azure NAT Gateway service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/cli-launch-cloud-shell-sign-in.md)]

## Set parameter values to create resources

Set the parameter values for use in creating the required resources. The $RANDOM function is used to create unique object names.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="VariableBlock":::

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="ResourceGroup":::

## Create the NAT gateway

In this section we create the NAT gateway and supporting resources.

### Create public IP address

To access the Internet, you need one or more public IP addresses for the NAT gateway. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a public IP address resource.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="ip":::

### Create NAT gateway resource

Create a global Azure NAT gateway with [az network nat gateway create](/cli/azure/network/nat#az-network-nat-gateway-create). The result of this command will create a gateway resource that uses the public IP address defined in the previous step. The idle timeout is set to 10 minutes.  

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="nat":::

### Create virtual network

Create a virtual network with a subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The IP address space for the virtual network is **10.1.0.0/16**. The subnet within the virtual network is **10.1.0.0/24**.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="vnet":::

### Create bastion host subnet

Create an Azure Bastion host to access the virtual machine.

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) to create an Azure Bastion subnet.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="subnet":::

### Create public IP address for the bastion host

Create a public IP address for the bastion host with [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="bastionIP":::

### Create the bastion host

Use [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create) to create the bastion host.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="bastionHost":::

### Configure NAT service for source subnet

Configure the source subnet in virtual network to use a specific NAT gateway resource with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update). This command will activate the NAT service on the specified subnet.

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="NATservice":::

All outbound traffic to Internet destinations is now using the NAT gateway.  It's not necessary to configure a UDR.

## Create virtual machine

Create a virtual machine to test the NAT gateway to verify the public IP address of the outbound connection.

Create the virtual machine with [az vm create](/cli/azure/vm#az-vm-create).

:::code language="azurecli" source="~/azure_cli_scripts/virtual-network/create-nat-gateway/create-nat-gateway-cli.sh" id="vm":::

Wait for the virtual machine creation to complete before moving on to the next section.

## Test NAT gateway

In this section, we'll test the NAT gateway. We'll first discover the public IP of the NAT gateway. We'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.

1. Sign in to the [Azure portal](https://portal.azure.com)

1. Find the public IP address for the NAT gateway on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP**.

1. Make note of the public IP address:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

1. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM** that is located in the **myResourceGroupNAT** resource group.

1. On the **Overview** page, select **Connect**, then **Bastion**.

1. Select the blue **Use Bastion** button.

1. Enter the username and password entered during VM creation.

1. Open **Internet Explorer** on **myTestVM**.

1. Enter **https://whatsmyip.com** in the address bar.

1. Verify the IP address displayed matches the NAT gateway address you noted in the previous step:

    :::image type="content" source="./media/quickstart-create-nat-gateway-portal/my-ip.png" alt-text="Internet Explorer showing external outbound IP" border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following CLI command:

```azurecli-interactive
  az group delete \
    --name $resourceGroup
```

## Next steps

For more information on Azure NAT Gateway, see:
> [!div class="nextstepaction"]
> [Virtual Network NAT overview](nat-overview.md)
